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

是的。如果在插入向量之前，已经通过`create_index()`为集合构建了索引，Milvus将自动为随后插入的向量构建索引。然而，Milvus直到新插入的向量填满一个完整的段并且新创建的索引文件与之前的索引文件分开时，才会构建