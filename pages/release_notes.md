


# 发布说明

了解 Milvus 的新功能！本页面总结了每个版本的新功能、改进、已知问题和错误修复。你可以在 v2.4.0 之后的每个发布版本上找到相应的发布说明。我们建议你定期访问此页面以获取更新信息。

## v2.4.0

发布日期：2024 年 4 月 17 日

| Milvus 版本 | Python SDK 版本 | Node.js SDK 版本 |
|----------------|--------------------| --------------------|
| 2.4.0          | 2.4.0              | 2.4.0               |

我们很高兴宣布 Milvus 2.4.0 的正式发布。在 2.4.0-rc.1 版本的坚实基础之上，我们专注于解决用户报告的关键错误，同时保留现有功能。此外，Milvus 2.4.0 引入了一系列优化，旨在提高系统性能，通过合并各种度量标准来改进可观察性，并通过简化代码库来提高系统的简洁性。

### 改进

- 支持 MinIO 的 TLS 连接([#31396](https://github.com/milvus-io/milvus/pull/31396), [#31618](https://github.com/milvus-io/milvus/pull/31618))
- 标量字段的自动索引支持([#31593](https://github.com/milvus-io/milvus/pull/31593))
- 混合搜索重构以实现与常规搜索一致的执行路径([#31742](https://github.com/milvus-io/milvus/pull/31742), [#32178](https://github.com/milvus-io/milvus/pull/32178))
- 通过位图和位图视图重构加速过滤([#31592](https://github.com/milvus-io/milvus/pull/31592), [#31754](https://github.com/milvus-io/milvus/pull/31754), [#32139](https://github.com/milvus-io/milvus/pull/32139))
- 导入任务现在支持等待数据索引完成([#31733](https://github.com/milvus-io/milvus/pull/31733))
- 增强导入兼容性([#32121](https://github.com/milvus-io/milvus/pull/32121))，任务调度([#31475](https://github.com/milvus-io/milvus/pull/31475))，并限制导入文件的大小和数量([#31542](https://github.com/milvus-io/milvus/pull/31542))
- 代码简化工作，包括类型检查的接口标准化([#31945](https://github.com/milvus-io/milvus/pull/31945), [#31857](https://github.com/milvus-io/milvus/pull/31857))，删除已弃用的代码和度量标准([#32079](https://github.com/milvus-io/milvus/pull/32079), [#32134](https://github.com/milvus-io/milvus/pull/32134), [#31535](https://github.com/milvus-io/milvus/pull/31535), [#32211](https://github.com/milvus-io/milvus/pull/32211), [#31935](https://github.com/milvus-io/milvus/pull/31935))，以及常量名称的规范化([#31515](https://github.com/milvus-io/milvus/pull/31515))
- 新的查询协调器目标频道检查点滞后延迟度量标准([#31420](https://github.com/milvus-io/milvus/pull/31420))
- 用于常规度量的新的数据库标签([#32024](https://github.com/milvus-io/milvus/pull/32024))
- 关于已删除、已索引和已加载实体的新度量，包括 collectionName 和 dbName 等标签([#31861](https://github.com/milvus-io/milvus/pull/31861))
- 改进不匹配的向量类型的错误处理([#31766](https://github.com/milvus-io/milvus/pull/31766))
- 在无法构建索引时，支持抛出错误而不是崩溃([#31845](https://github.com/milvus-io/milvus/pull/31845))
- 在删除数据库时支持使数据库元数据缓存失效([#32092](https://github.com/milvus-io/milvus/pull/32092))
- 重构通道分发接口([#31814](https://github.com/milvus-io/milvus/pull/31814))和主节点视图管理接口([#32127](https://github.com/milvus-io/milvus/pull/32127))
- 重构通道分发管理器接口([#31814](https://github.com/milvus-io/milvus/pull/31814))和重构主节点视图管理器接口([#32127](https://github.com/milvus-io/milvus/pull/32127))
- 批处理([#31632](https://github.com/milvus-io/milvus/pull/31632))，添加映射信息([#32234](https://github.com/milvus-io/milvus/pull/32234), [#32249](https://github.com/milvus-io/milvus/pull/32249))，并避免使用锁([#31787](https://github.com/milvus-io/milvus/pull/31787))以加速频繁调用的操作

### 重大更改

- 停止在二进制向量上进行分组搜索([#31735](https://github.com/milvus-io/milvus/pull/31735))
- 停止使用混合搜索进行分组搜索([#31812](https://github.com/milvus-io/milvus/pull/31812))
- 停止在二进制向量上使用 HNSW 索引([#31883](https://github.com/milvus-io/milvus/pull/31883))

### 问题修复

- 改进查询和插入的数据类型和值检查，以防止崩溃([#31478](https://github.com/milvus-io/milvus/pull/31478), [#31653](https://github.com/milvus-io/milvus/pull/31653), [#31698](https://github.com/milvus-io/milvus/pull/31698), [#31842](https://github.com/milvus-io/milvus/pull/31842), [#32042](https://github.com/milvus-io/milvus/pull/32042), [#32251](https://github.com/milvus-io/milvus/pull/32251), [#32204](https://github.com/milvus-io/milvus/pull/32204))
- 修复 RESTful API 的错误([#32160](https://github.com/milvus-io/milvus/pull/32160))
- 改进倒排索引资源使用情况的预测([#31641](https://github.com/milvus-io/milvus/pull/31641))
- 解决启用授权时与 etcd 的连接问题([#31668](https://github.com/milvus-io/milvus/pull/31668))
- NATS 服务器的安全更新([#32023](https://github.com/milvus-io/milvus/pull/32023))
- 存储倒排索引文件到 QueryNode 的本地存储路径而不是/tmp([#32210](https://github.com/milvus-io/milvus/pull/32210))
- 解决数据协调器的 collectionInfo 内存泄漏问题([#32243](https://github.com/milvus-io/milvus/pull/32243))
- 修复与 fp16/bf16 相关的错误，可能导致系统崩溃([#31677](https://github.com/milvus-io/milvus/pull/31677), [#31841](https://github.com/milvus-io/milvus/pull/31841), [#32196](https://github.com/milvus-io/milvus/pull/32196))
- 解决分组搜索返回结果不足的问题([#32151](https://github.com/milvus-io/milvus/pull/32151))
- 调整使用迭代器的搜索以更有效地处理 Reduce 步骤中的偏移量，并在启用 "reduceStopForBest" 时确保充分的结果([#32088](https://github.com/milvus-io/milvus/pull/32088))

## v2.4.0-rc.1
发布日期：2024 年 3 月 20 日

| Milvus 版本 | Python SDK 版本 |
|----------------|--------------------|
| 2.4.0-rc.1     | 2.4.0              |

该版本引入了几个基于场景的功能：

- **新的 GPU 索引 - CAGRA**：得益于 NVIDIA 的贡献，这种新的 GPU 索引在批量搜索中提供了 10 倍的性能提升。详情请参阅 [GPU 索引](/reference/gpu_index.md)。

- **多向量** 和 **混合搜索**：该功能可实现存储来自多个模型的向量嵌入并进行多向量搜索。详情请参阅 [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)。

- **稀疏向量**：适用于关键词解释和分析的稀疏向量现在支持在你的集合中进行处理。详情请参阅 [稀疏向量](/reference/sparse_vector.md)。

- **分组搜索**：针对检索增强生成（RAG）应用程序，分类聚合增强了文档级召回。详情请参阅 [分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search)。

- **倒排索引** 和 **模糊匹配**：这些功能改进了标量字段的关键词检索。详情请参阅 [索引标量字段](/userGuide/manage-indexes/index-scalar-fields.md) 和 [过滤搜索](single-vector-search.md#filtered-search)。

### 新功能

#### GPU 索引 - CAGRA

我们要向 NVIDIA 团队表达诚挚的感谢，感谢他们对 CAGRA 的宝贵贡献，CAGRA 是一种可在线使用的最新 GPU 图索引。

与以往的 GPU 索引不同，CAGRA 即使在小批量查询中也展示了压倒性的优势，这是 CPU 索引传统上擅长的领域。此外，CAGRA 在大批量查询和索引构建速度方面的性能，这些领域已经是 GPU 索引的亮点，确实是无与伦比的。

示例代码可以在 [example_gpu_cagra.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/example_gpu_cagra.py) 中找到。

#### 稀疏向量（Beta）

在此版本中，我们介绍了一种称为稀疏向量的新类型的向量字段。稀疏向量与密集向量不同，它们往往具有数倍于非零向量的数量的维度，只有少数几个维度为非零。这个功能由于其基于术语的特性而提供了更好的解释能力，并且在某些领域中可能更有效。SPLADEv2/BGE-M3 等学习的稀疏模型已经被证明对于常见的第一阶段排名任务非常有用。Milvus 中这个新功能的主要用途是允许对由 SPLADEv2/BGE-M3 等神经模型和 BM25 算法等统计模型生成的稀疏向量进行高效的近似语义最近邻搜索。Milvus 现在支持高效、高性能的稀疏向量存储、索引和搜索（MIPS，最大内积搜索）。

示例代码可以在 [hello_sparse.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/hello_sparse.py) 中找到。

#### 多嵌入和混合搜索
 





多向量支持是多模型数据处理或密集和稀疏向量混合应用的基石。有了多向量支持，现在你可以：

- 存储为非结构化文本、图像或音频样本生成的来自多个模型的向量嵌入。
- 进行包括每个实体多个向量的 ANN 搜索。
- 通过为不同的嵌入模型分配权重来定制搜索策略。
- 尝试各种嵌入模型以找到最优的模型组合。

多向量支持允许在集合中存储、索引并应用重新排序策略到不同类型的多个向量字段，如 FLOAT_VECTOR 和 SPARSE_FLOAT_VECTOR。当前有两种重新排序策略可用：**互惠排名融合（RRF）** 和 **平均加权评分**。这两种策略都将来自不同向量字段的搜索结果组合成一个统一的结果集。第一种策略优先考虑在不同向量字段的搜索结果中一致出现的实体，而另一种策略则为每个向量字段的搜索结果分配权重，以确定它们在最终结果集中的重要性。

示例代码可以在 [hybrid_search.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/hybrid_search.py) 中找到。

#### Inverted Index and Fuzzy Match

在 Milvus 之前的版本中，使用基于内存的二分索引和 Marisa Trie 索引进行标量字段索引。然而，这些方法消耗内存。最新的 Milvus 版本现在采用了基于 Tantivy 的倒排索引，可以应用于所有数字和字符串数据类型。这个新的索引大大提高了标量查询性能，将字符串中关键字的查询减少了十倍。此外，由于数据压缩和内部索引结构的内存映射存储（MMap）机制的额外优化，倒排索引消耗的内存也更少。

此版本还支持在标量过滤中使用前缀、中缀和后缀进行模糊匹配。

示例代码可以在 [示例代码 hybrid_search.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/hybrid_search.py) 中找到。

#### Grouping Search

你现在可以通过特定标量字段中的值对搜索结果进行聚合。这有助于 RAG 应用程序实现基于文档级别的回溯。考虑一个由多个段落组成的文档集合，每个段落通过一个向量嵌入来表示并属于一个文档。为了找到相关性更高的文档而不是散布的段落，你可以在 search()操作中包含 group_by_field 参数，通过文档 ID 对结果进行分组。

示例代码可以在 [示例代码 example_group_by.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/example_group_by.py) 中找到。

#### Float16 and BFloat16 Vector DataType

机器学习和神经网络通常使用半精度数据类型，如 Float16 和 BFloat16。尽管这些数据类型可以提高查询效率和降低内存使用量，但它们也会带来准确性降低的折衷。通过此版本，Milvus 现在支持这些数据类型的向量字段。

示例代码可以在 [float16_example.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/float16_example.py) 和 [bfloat16_example.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/bfloat16_example.py) 中找到。

### Upgraded Architecture

#### L0 Segment

此版本包括一个称为 L0 Segment 的新段，用于记录删除的数据。这个段会定期压缩存储的被删除记录，并将它们拆分成封闭的段，从而减少了小删除所需的数据刷新次数，并留下了较小的储存占用。通过这种机制，Milvus 完全将数据的压缩和数据的刷新分离开来，提高了删除和更新操作的性能。

#### Refactored BulkInsert

此版本还引入了改进的批量插入逻辑。这使你可以在单个批量插入请求中导入多个文件。通过重构后的版本，批量插入的性能和稳定性都得到了显著提高。用户体验也得到了增强，例如细调的速率限制和更友好的错误消息。此外，你可以通过 Milvus 的 RESTful API 轻松访问批量插入端点。

#### Memory-mapped Storage

Milvus 使用内存映射存储（MMap）来优化内存使用。这种机制将文件内容映射到内存中，而不是直接加载到内存中。这种方法会带来性能下降的折衷。通过在具有 2 个 CPU 和 8GB RAM 的主机上启用对 HNSW 索引集合的 MMap 支持，可以加载多 4 倍的数据，性能降低不到 10%。

此外，此版本还允许动态和精细控制 MMap，无需重新启动 Milvus。

详情请参阅 [MMap Storage](/reference/mmap.md)。

### Others

#### Milvus-CDC

Milvus-CDC 是一个易于使用的伴随工具，用于在 Milvus 实例之间捕获和同步增量数据，实现简单的增量备份和灾难恢复。在此版本中，Milvus-CDC 提高了稳定性，并且其 Change Data Capture (CDC)功能现已正式提供。

有关 Milvus-CDC 的更多信息，请参阅 [GitHub repository](https://github.com/zilliztech/milvus-cdc) 和 [Milvus-CDC Overview](milvus-cdc-overview.md)。

#### Refined MilvusClient Interfaces
 


MilvusClient 是一个易于使用的 ORM 模块的替代方案。它采用纯函数式方法简化与服务器的交互。每个 MilvusClient 都会建立一个 gRPC 连接到服务器，而不是维护一个连接池。
MilvusClient 模块已经实现了 ORM 模块的大部分功能。
要了解更多关于 MilvusClient 模块的信息，请访问 [pymilvus](https://github.com/milvus-io/pymilvus) 和 [参考文档](/api-reference/pymilvus/v2.4.x/About.md)。

