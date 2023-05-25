加载分区
====

本主题介绍如何将分区加载到内存中。将分区加载到内存中而不是整个集合可以显著减少内存使用量。Milvus 中的所有搜索和查询操作都在内存中执行。

Milvus 2.1 允许用户将分区加载为多个副本，以利用额外查询节点的 CPU 和内存资源。此功能可以通过额外硬件提高总体 QPS 和吞吐量。当前版本中 PyMilvus 支持此功能。

* 在当前版本中，要加载的数据量必须低于所有查询节点的总内存资源的90％，以保留执行引擎的内存资源。

* 在当前版本中，所有在线查询节点将根据用户指定的副本数量分为多个副本组。所有副本组都必须具有加载所提供集合的一个副本所需的最小内存资源。否则，将返回错误。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load(["novel"], replica_number=2)

# Or you can load a partition with the partition as an object
from pymilvus import Partition
partition = Partition("novel")       # Get an existing partition.
partition.load(replica_number=2)

```

```python
await milvusClient.loadPartitions({
  collection_name: "book",
  partition_names: ["novel"],
});

```

```python
err := milvusClient.LoadPartitions(
  context.Background(),   // ctx
  "book",                 // CollectionName
  []string{"novel"},      // partitionNames
  false                   // async
)
if err != nil {
  log.Fatal("failed to load partitions:", err.Error())
}

```

```python
milvusClient.loadPartitions(
  LoadPartitionsParam.newBuilder()
          .withCollectionName("book")
          .withPartitionNames(["novel"])
          .build()
);

```

```python
load -c book -p novel

```

```python
curl -X 'POST' 
  'http://localhost:9091/api/v1/partitions/load' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "partition_names": ["novel"],
    "replica_number": 1
  }'

```
| 参数 | 描述 |
| --- | --- |
| `partition_name` | 分区名称。 |
| `replica_number`（可选） | 要加载的副本数。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从中加载分区的集合名称。 |
| `partition_names` | 要加载的分区名称列表。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要从中加载分区的集合名称。 |
| `partitionNames` | 要加载的分区名称列表。 |
| `async` | 用于控制同步/异步行为的开关。在同步加载中，上下文的截止时间不适用。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要从中加载分区的集合名称。 |
| `PartitionNames` | 要加载的分区名称列表。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要从中加载分区的集合名称。 |
| -p（多个） | 要加载的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从中加载分区的集合名称。 |
| `partition_names` | 要加载的分区名称列表。 |
| `replica_number`（可选） | 要加载的副本数。 |

获取副本信息
------

您可以查看已加载副本的信息。

```python
from pymilvus import Partition
partition = Partition("novel")       # Get an existing partition.
partition.load(replica_number=2)     # Load partition as 2 replicas
result = partition.get_replicas()
print(result)

```

约束
--

* 当父集合已经加载时，尝试加载分区将返回错误。将来的版本将支持从已加载的集合中释放分区，然后再加载其他分区（如果需要）。

* 尝试加载已经加载的集合将返回"成功加载"。

* 当子分区已经加载时，尝试加载集合将返回错误。将来的版本将支持在已经加载了某些分区的情况下加载集合。

* 不允许通过单独的RPC在同一集合中加载不同的分区。

接下来怎么做？
-------

* 了解Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
