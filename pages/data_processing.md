
本文详细介绍了Milvus中数据插入、索引构建和数据查询的实现。

数据插入
--------------

您可以为 Milvus 中的每个集合指定多个分片（shard），每个分片对应一个虚拟通道（*vchannel*）。正如下图所示，Milvus 在日志代理中为每个虚拟通道指定了一个物理通道（*pchannel*）。任何传入的插入/删除请求都将根据主键的哈希值路由到分片上。

 Milvus没有复杂的事务，因此DML请求的验证被移动到代理。代理会向TSO（时间戳Oracle）请求每个插入/删除请求的时间戳，TSO是与根协调器相邻的定时模块。通过较新的时间戳覆盖旧的时间戳，时间戳用于确定正在处理的数据请求的顺序。代理从数据协调器以批处理的方式检索包括实体段和主键在内的信息，以增加总吞吐量并避免过度负担中央节点。

[![Channels 1](https://milvus.io/static/495a73f11565829f35df6a51efdfcb99/0a251/channels_1.jpg "Each shard corresponds to a vchannel.")](https://milvus.io/static/495a73f11565829f35df6a51efdfcb99/878e7/channels_1.jpg)

Each shard corresponds to a vchannel.

 DML（数据操作语言）操作和DDL（数据定义语言）操作都写入日志序列，但DDL操作仅分配一个通道，因为它们的发生频率很低。

[![Channels 2](https://milvus.io/static/9136dc9adb8ad9fad41cc5ff75037050/0a251/channels_2.jpg "Log broker nodes.")](https://milvus.io/static/9136dc9adb8ad9fad41cc5ff75037050/878e7/channels_2.jpg)

日志代理节点

 *Vchannels* 在底层日志代理节点中维护。每个通道在物理上不可分割，但可供任何但仅一个节点使用。当数据摄取速率达到瓶颈时，请考虑两件事：日志代理节点是否超载并需要扩展，以及是否有足够的分片以确保每个节点的负载平衡。

[![Write log sequence](https://milvus.io/static/d75cab95c807c5664c94e3a6a56e26b3/0a251/write_log_sequence.jpg "The process of writing log sequence.")](https://milvus.io/static/d75cab95c807c5664c94e3a6a56e26b3/878e7/write_log_sequence.jpg)

写入日志序列.

上图概括了写入日志序列的四个组件的过程：代理，日志代理，数据节点和对象存储。该过程涉及四个任务：DML请求的验证，日志序列的发布-订阅，从流式日志转换为日志快照以及日志快照的持久化。四个任务解耦以确保每个任务由其相应的节点类型处理。同一类型的节点被视为相等，可以弹性地独立地扩展以适应各种数据负载，特别是大量且高度波动的流式数据。

索引构建
--------------

索引构建是由索引节点执行的。为了避免针对数据更新频繁执行索引构建，Milvus 将每个集合进一步划分为多个段，每个段都有自己的索引。

[![Index building](https://milvus.io/static/73386b6e118015e167ce9dbf41275b6e/0a251/index_building.jpg "在 Milvus 中构建索引。")](https://milvus.io/static/73386b6e118015e167ce9dbf41275b6e/878e7/index_building.jpg)

在 Milvus 中构建索引。

Milvus 支持为每个向量字段、标量字段和主键字段构建索引。索引构建的输入和输出都与对象存储相关：索引节点将要从对象存储中的段日志快照加载到内存中以进行索引构建，反序列化相应的数据和元数据以构建索引，索引构建完成后，对索引进行序列化，并将其写回到对象存储。

索引构建主要涉及向量和矩阵运算，因此需要大量的计算资源和内存资源。由于向量具有高维性，传统的基于树的索引无法有效地索引向量，但可以使用更成熟的基于聚类和图的索引技术进行索引。无论其类型如何，构建索引都涉及到大规模向量的大量迭代计算，例如 K-means 或图遍历。

与标量数据的索引不同，构建向量索引必须充分利用 SIMD（单指令多数据）加速。Milvus 具有对 SIMD 指令集的天然支持，例如 SSE、AVX2 和 AVX512。鉴于向量索引构建的“卡顿”和资源密集型特性，在经济方面，弹性变得非常重要。未来的 Milvus 版本将进一步探索异构计算和无服务器计算，以降低相关成本。

除此之外，Milvus 还支持标量过滤和主键字段查询。它具有内置索引以提高查询效率，例如布隆过滤器索引、哈希索引、基于树的索引和倒排索引，并计划引入更多的外部索引，例如位图索引和粗糙索引。

数据查询
----------

数据查询是指在指定的集合中搜索距离目标向量最近的*k*个向量或距离范围内的*所有*向量的过程。返回的向量还包括其对应的主键和字段。

[![Data query](https://milvus.io/static/9719896fcb1489002dbe83a77b3666be/0a251/data_query.jpg "Data query in Milvus.")](https://milvus.io/static/9719896fcb1489002dbe83a77b3666be/878e7/data_query.jpg)

Milvus数据查询

Milvus中的集合被分成多个段，查询节点按段加载索引。当搜索请求到达时，它被广播到所有查询节点进行并发搜索。然后每个节点修剪本地段，搜索满足条件的向量，并减少并返回搜索结果。

在数据查询中，查询节点彼此独立。每个节点仅负责两个任务：根据查询协调器的指示加载或释放段；在本地段内进行搜索。代理负责从每个查询节点减少搜索结果并将最终结果返回给客户端。

[![Handoff](https://milvus.io/static/c986cace09b9fd6bfbcaf222febf1c0a/0a251/handoff.jpg "Handoff in Milvus.")](https://milvus.io/static/c986cace09b9fd6bfbcaf222febf1c0a/2f23f/handoff.jpg)

在 Milvus 中的交接

在 Milvus 中，有两种类型的段：增量数据的增长段和历史数据的封存段。查询节点订阅虚拟通道以接收最近的更新（增量数据）作为增长段。当一个增长段达到预定义的阈值时，数据协调器对其进行关闭，并开始索引构建。然后由查询协调器发起一次 *交接* 操作，将增量数据转为历史数据。查询协调器将根据内存使用、CPU 开销和段数将封存段均匀分配给所有查询节点。

接下来的步骤
-----------

* 了解如何[使用 Milvus 向量数据库进行实时查询](https://milvus.io/blog/deep-dive-5-real-time-query.md)。
* 了解[Milvus中的数据插入和数据持久化](https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md)。
* 了解[Milvus中的数据处理方式](https://milvus.io/blog/deep-dive-3-data-processing.md)。