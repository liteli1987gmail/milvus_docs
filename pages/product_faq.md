
产品问答
===

#### Milvus 的价格是多少？

Milvus 是一个 100% 免费的开源项目。

在生产或分发目的时，请遵守 [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)。

Zilliz是Milvus背后的公司，同时也提供完全托管的云版本平台，适用于那些不想构建和维护自己的分布式实例的用户。 [Zilliz Cloud](https://zilliz.com/cloud)自动维护数据可靠性，让用户只需按照使用量付费。

#### Milvus是否支持非x86架构？

Milvus无法安装或在非x86平台上运行。

要运行Milvus，您的CPU必须支持以下指令集之一：SSE4.2，AVX，AVX2，AVX512。 这些都是x86专用的SIMD指令集。

#### Milvus能够处理的最大数据集大小是多少？

从理论上讲，Milvus能够处理的最大数据集大小取决于它运行的硬件，特别是系统内存和存储：

* Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.

* When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.

#### Where does Milvus store data?

Milvus处理两种类型的数据，插入的数据和元数据。

存储插入的数据，包括向量数据、标量数据和集合特定的模式，以增量日志的形式存储在持久存储中（目前仅支持MinIO）。

元数据在Milvus内部生成。每个Milvus模块都有自己的元数据，这些元数据存储在etcd中。

#### 为什么etcd中没有向量数据？

etcd存储Milvus模块的元数据；MinIO存储实体。

#### Milvus的Python SDK是否有连接池？

Milvus v0.9.0或更高版本的Python SDK具有连接池。连接池中的连接数量没有上限。

#### Milvus支持同时插入和搜索数据吗？

是的。插入操作和查询操作由两个相互独立的模块处理。从客户端的角度来看，插入操作在插入的数据进入消息队列后就完成了。然而，在加载到查询节点之前，插入的数据是不可搜索的。如果段的大小未达到索引构建阈值（默认为512 MB），Milvus会采用暴力搜索，查询性能可能会降低。

#### Milvus是否允许插入具有重复主键的向量？

可以。Milvus不会检查向量主键是否重复。

#### 当插入具有重复主键的向量时，Milvus会将其视为更新操作吗？

不支持更新操作，并且不检查实体主键是否重复。您需要确保实体主键是唯一的，如果不是，则Milvus可能包含具有重复主键的多个实体。

如果出现此情况，查询时将返回哪个数据副本仍然是未知的行为。这个限制将在未来的版本中得到修复。

#### 自定义实体主键的最大长度是多少？

实体主键必须是非负的64位整数。

#### 每次插入操作最多可以添加多少数据？

每次插入操作的大小不能超过 1,024 MB。这是由 gRPC 强制实施的限制。

#### 当在特定分区中搜索时，集合大小是否影响查询性能？

不会。如果指定了搜索的分区，Milvus只会搜索指定的分区。

#### 当为搜索指定分区时，Milvus是否加载整个集合？

不是。Milvus的行为各不相同。在搜索之前，数据必须被加载到内存中。

* 如果您知道数据位于哪些分区，请调用`load_partition()`来加载所需的分区，然后在`search()`方法调用中指定分区。

* 如果您不知道确切的分区，请在调用`search()`之前调用`load_collection()`。

* 如果在搜索之前未加载集合或分区，Milvus将返回错误。

#### 在插入向量后可以创建索引吗？

是的。如果调用`create_index()`，Milvus会为随后插入的向量建立索引。然而，直到新插入的向量填满整个段并且新创建的索引文件与先前的文件分开，Milvus才会建立索引。

#### FLAT和IVF_FLAT索引有何不同？

IVF_FLAT索引将向量空间划分为列表聚类。在默认列表值16384下，Milvus将比较目标向量与所有16384个聚类的质心之间的距离，以返回探测到的最近聚类。然后Milvus将比较目标向量与所选聚类中的向量之间的距离，以获取最近的向量。与IVF_FLAT不同，FLAT直接比较目标向量与每个其他向量之间的距离。

当向量总数大约等于nlist时，IVF_FLAT和FLAT在计算要求和搜索性能方面的距离很小。然而，随着向量数量超过nlist两倍或更多，IVF_FLAT开始展现性能优势。

更多信息，请参见[向量索引](index.md)。

#### Milvus如何刷新数据？

当数据插入到消息队列中时，Milvus返回成功。但是，数据还没有刷新到磁盘。然后，Milvus的数据节点将消息队列中的数据作为增量日志写入持久性存储。如果调用`flush()`，则强制数据节点立即将消息队列中的所有数据写入持久性存储。

#### 什么是规范化？为什么需要规范化？

规范化是指将向量转换为使其范数等于1的过程。如果使用内积计算向量相似性，则必须对向量进行规范化。规范化后，内积等于余弦相似度。

有关更多信息，请参见[维基百科](https://en.wikipedia.org/wiki/Unit_vector)。

#### 为什么欧几里得距离(L2)和内积(IP)返回不同的结果？

对于归一化向量，欧几里得距离(L2)在数学上等同于内积(IP)。如果这些相似度指标返回不同的结果，请检查你的向量是否进行了归一化

#### Is there a limit to the total number of collections and partitions in Milvus?

There is no limit on the number of collections. However, the number of partitions in each collection must not exceed the value set by the parameter `master.maxPartitionNum`.

#### Why do I get fewer than k vectors when searching for `topk` vectors?

Among the indexes that Milvus supports, IVF_FLAT and IVF_SQ8 implement the k-means clustering method. A data space is divided into `nlist` clusters and the inserted vectors are distributed to these clusters. Milvus then selects the `nprobe` nearest clusters and compares the distances between the target vector and all vectors in the selected clusters to return the final results.

If `nlist` and `topk` are large and nprobe is small, the number of vectors in the nprobe clusters may be less than `k`. Therefore, when you search for the `topk` nearest vectors, the number of returned vectors is less than `k`.

To avoid this, try setting `nprobe` larger and `nlist` and `k` smaller.

See [Vector Index](index.md) for more information.

#### What is the maximum vector dimension supported in Milvus?

Milvus can manage vectors with up to 32,768 dimensions.

#### Does Milvus support Apple M1 CPU?

Current Milvus release does not support Apple M1 CPU.

#### What data types does Milvus support on the primary key field?

In current release, Milvus support both INT64 and string.

#### Is Milvus scalable?

Yes. You can deploy Milvus cluster with multiple nodes via Helm Chart on Kubernetes. Refer to [Scale Guide](scaleout.md) for more instruction.

#### Does the query perform in memory? What are incremental data and historical data?

Yes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.

#### Is Milvus available for concurrent search?

Yes. For queries on the same collection, Milvus concurrently searches the incremental and historical data. However, queries on different collections are conducted in series. Whereas the historical data can be an extremely huge dataset, searches on the historical data are relatively more time-consuming and essentially performed in series.

#### Why does the data in MinIO remain after the corresponding collection is dropped?

Data in MinIO is designed to remain for a certain period of time for the convenience of data rollback.

#### Does Milvus support message engines other than Pulsar?

Yes. Kafka is supported in Milvus 2.1.0.

#### What's the diference between a search and a query?

In Milvus, a vector similarity search retrieves vectors based on similarity calculation and vector index acceleration. Unlike a vector similarity search, a vector query retrieves vectors via scalar filtering based on a boolean expression. The boolean expression filters on scalar fields or the primary key field, and it retrieves all results that match the filters. In a query, neither similarity metrics nor vector index is involved.

#### Why does a float vector value have a precision of 7 decimal digits in Milvus?

Milvus stores vectors as Float32 arrays. A Float32 value has a precision of 7 decimal digits. Even with a Float64 value, such as 1.3476964684980388, Milvus stores it as 1.347696. Therefore, when you retrieve such a vector from Milvus, the precision of the Float64 value is lost.

#### Still have questions?

You can:

* Check out [Milvus](https://github.com/milvus-io/milvus/issues) on GitHub. You're welcome to raise questions, share ideas, and help others.
* Join our [Slack community](https://slack.milvus.io/) to find support and engage with our open-source community.
