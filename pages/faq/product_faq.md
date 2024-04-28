---
id: product_faq.md
summary: 寻找关于世界上最先进的向量数据库的常见问题答案。
title: 产品常见问题解答
---

# 产品常见问题解答

<!-- 目录 -->



<!-- 目录结束 -->

#### Milvus的费用是多少？

Milvus是一个100%免费的开源项目。

在生产或分发用途中使用Milvus时，请遵守[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)。

Milvus背后的公司Zilliz还提供了一个完全托管的云版本平台，供那些不想构建和维护自己的分布式实例的人使用。[Zilliz Cloud](https://zilliz.com/cloud)自动维护数据可靠性，并允许用户只为他们使用的付费。

#### Milvus是否支持非x86架构？

Milvus无法在非x86平台上安装或运行。

您的CPU必须支持以下指令集之一才能运行Milvus：SSE4.2、AVX、AVX2、AVX512。这些都是专用于x86的SIMD指令集。

#### Milvus能处理的最大数据集大小是多少？

理论上，Milvus能处理的最大数据集大小由运行它的硬件决定，具体是系统内存和存储：

- Milvus在运行查询之前将所有指定的集合和分区加载到内存中。因此，内存大小决定了Milvus可以查询的最大数据量。
- 当向Milvus添加新的实体和与集合相关的模式（目前仅支持MinIO进行数据持久化）时，系统存储决定了插入数据的最大允许大小。

#### Milvus在哪里存储数据？

Milvus处理两种类型的数据，插入的数据和元数据。

插入的数据，包括向量数据、标量数据和特定集合的模式，都作为增量日志存储在持久存储中。Milvus支持多个对象存储后端，包括[MinIO](https://min.io/)、[AWS S3](https://aws.amazon.com/s3/?nc1=h_ls)、[Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS)、[Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)、[Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service)和[Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS)。

元数据是在Milvus内部生成的。每个Milvus模块都有自己的元数据，它们存储在etcd中。

#### 为什么etcd中没有向量数据？

etcd存储Milvus模块的元数据；MinIO存储实体。

#### Milvus是否支持同时插入和搜索数据？

是的。插入操作和查询操作由两个独立的模块处理，它们是相互独立的。从客户端的角度来看，当插入的数据进入消息队列时，插入操作就完成了。然而，插入的数据在加载到查询节点之前是不可搜索的。如果段的大小没有达到构建索引的阈值（默认为512 MB），Milvus会使用暴力搜索，查询性能可能会降低。

#### 可以将具有重复主键的向量插入到Milvus中吗？

是的。Milvus不检查向量主键是否重复。

#### 当插入具有重复主键的向量时，Milvus是否将其视为更新操作？

不。Milvus目前不支持更新操作，也不检查实体主键是否重复。您需要确保实体主键是唯一的，如果它们不是，Milvus可能包含具有重复主键的多个实体。

如果发生这种情况，当查询时返回哪份数据的行为是未知的。这个限制将在未来的版本中得到修复。

#### 自定义实体主键的最大长度是多少？

实体主键必须是非负的64位整数。

#### 每次插入操作可以添加的最大数据量是多少？

插入操作的大小不得超过1,024 MB。这是由gRPC施加的限制。

#### 在特定分区中搜索时，集合大小是否会影响查询性能？

不。如果为搜索指定了分区，Milvus只搜索指定的分区。

#### 在为搜索指定分区时，Milvus是否加载整个集合？

不。Milvus有不同的行为。在搜索之前必须将数据加载到内存中。

- 如果您知道数据所在的分区，先调用`load_partition()`加载所需的分区，然后在`search()`方法调用中指定分区。
- 如果您不知道确切的分区，先调用`load_collection()`，然后再调用`search()`。
- 如果在搜索之前未能加载集合或分区，Milvus将返回错误。

#### 在插入向量后可以创建索引吗？

Yes. If an index has been built for a collection by `create_index()` before, Milvus will automatically build an index for subsequently inserted vectors. However, Milvus does not build an index until the newly inserted vectors fill an entire segment and the newly created index file is separate from the previous one.

#### How are the FLAT and IVF_FLAT indexes different?

The IVF_FLAT index divides vector space into list clusters. At the default list value of 16,384, Milvus compares the distances between the target vector and the centroids of all 16,384 clusters to return probe nearest clusters. Milvus then compares the distances between the target vector and the vectors in the selected clusters to get the nearest vectors. Unlike IVF_FLAT, FLAT directly compares the distances between the target vector and every other vector.

When the total number of vectors approximately equals nlist, there is little distance between IVF_FLAT and FLAT in terms of calculation requirements and search performance. However, as the number of vectors exceeds nlist by a factor of two or more, IVF_FLAT begins to demonstrate performance advantages.

See [Vector Index](index.md) for more information.

#### How does Milvus flush data?

Milvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus' data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.

#### What is normalization? Why is normalization needed?

Normalization refers to the process of converting a vector so that its norm equals 1. If inner product is used to calculate vector similarity, vectors must be normalized. After normalization, inner product equals cosine similarity.

See [Wikipedia](https://en.wikipedia.org/wiki/Unit_vector) for more information.

#### Why do Euclidean distance (L2) and inner product (IP) return different results?

For normalized vectors, Euclidean distance (L2) is mathematically equivalent to inner product (IP). If these similarity metrics return different results, check to see if your vectors are normalized

#### Is there a limit to the total number of collections and partitions in Milvus?

Yes. You can create up to 65,535 collections in a Milvus instance. When calculating the number of existing collections, Milvus counts all collections with shards and partitions in them.

For example, let's assume you have already created 100 collections, with 2 shards and 4 partitions in 60 of them and with 1 shard and 12 partitions in the rest 40 collections. The current number of collections can be calculated as:

```
60 * 2 * 4 + 40 * 1 * 12 = 960
```

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

In current release, Milvus supports both INT64 and string.

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

#### What's the difference between a search and a query?

In Milvus, a vector similarity search retrieves vectors based on similarity calculation and vector index acceleration. Unlike a vector similarity search, a vector query retrieves vectors via scalar filtering based on a boolean expression. The boolean expression filters on scalar fields or the primary key field, and it retrieves all results that match the filters. In a query, neither similarity metrics nor vector index is involved.

#### Why does a float vector value have a precision of 7 decimal digits in Milvus?

Milvus supports storing vectors as Float32 arrays. A Float32 value has a precision of 7 decimal digits. Even with a Float64 value, such as 1.3476964684980388, Milvus stores it as 1.347696. Therefore, when you retrieve such a vector from Milvus, the precision of the Float64 value is lost.

#### How does Milvus handle vector data types and precision?

Milvus supports Binary, Float32, Float16, and BFloat16 vector types.

- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.
- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.
- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.

#### Still have questions?

You can:

- Check out [Milvus](https://github.com/milvus-io/milvus/issues) on GitHub. You're welcome to raise questions, share ideas, and help others.
- Join our [Slack community](https://slack.milvus.io/) to find support and engage with our open-source community.

