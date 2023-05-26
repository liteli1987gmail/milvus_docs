释放分区
====

本主题描述了如何在搜索或查询后释放分区以减少内存使用。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Partition
partition = Partition("novel")       # Get an existing partition.
partition.release()

```

```bash
await milvusClient.releasePartitions({
    collection_name: "book",
    partition_names: ["novel"],
 });

```

```bash
err := milvusClient.ReleasePartitions(
  context.Background(),   // ctx
  "book",                 // CollectionName
  []string{"novel"}       // partitionNames
)
if err != nil {
  log.Fatal("failed to release partitions:", err.Error())
}

```

```bash
List<String> partitionNames = new ArrayList<>();
partitionNames.add("novel");
milvusClient.releasePartitions(
  ReleasePartitionsParam.newBuilder()
    .withCollectionName("book")
    .withPartitionNames(partitionNames)
    .build()
);

```

```bash
release -c book -p novel

```

```bash
curl -X 'DELETE' 
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

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要释放分区的集合名称。 |
| `partition_names` | 要释放的分区名称列表。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要释放分区的集合名称。 |
| `partitionNames` | 要释放的分区名称列表。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要释放分区的集合名称。 |
| `PartitionNames` | 要释放的分区名称列表。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要释放分区的集合名称。 |
| -p（多个） | 要释放的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要释放分区的集合名称。 |
| `partition_names` | 要释放的分区名称列表。 |

约束
--

* 当父集合已经被加载时，尝试释放分区时会返回错误。未来的版本将支持从已加载的集合中释放分区，然后加载其他分区（如果需要）。

* 当已经加载了已加载的集合时，将返回“成功加载”。

* 当子分区已经加载时，尝试加载集合时会返回错误。未来的版本将支持在某些分区已经加载的情况下加载集合。

* 通过单独的RPC加载同一集合中的不同分区是不允许的。

接下来是什么
------

* 学习更多Milvus的基本操作:
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
