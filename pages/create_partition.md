创建分区
====

本主题介绍了如何在 Milvus 中创建分区。

Milvus 允许您将大量向量数据分成少量分区。然后，搜索和其他操作可以限制在一个分区内以提高性能。

集合由一个或多个分区组成。在创建新集合时，Milvus 创建一个默认分区 `_default`。有关更多信息，请参见[词汇表 - 分区](glossary.md#Partition)。

以下示例在集合`book`中建立一个分区`novel`。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.create_partition("novel")

```

```
await milvusClient.createPartition({
  collection_name: "book",
  partition_name: "novel",
});

```

```
err := milvusClient.CreatePartition(
  context.Background(),   // ctx
  "book",                 // CollectionName
  "novel"                 // partitionName
)
if err != nil {
  log.Fatal("failed to create partition:", err.Error())
}

```

```
milvusClient.createPartition(
  CreatePartitionParam.newBuilder()
    .withCollectionName("book")
    .withPartitionName("novel")
    .build()
);

```

```
create partition -c book -p novel

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/partition' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "partition_name": "novel"
  }'

```

| Parameter | Description |
| --- | --- |
| `partition_name` | Name of the partition to create. |
| `description` (optional) | Description of the partition to create. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to create a partition in. |
| `partition_name` | Name of the partition to create. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to create a partition in. |
| `partitionName` | Name of the partition to create. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to create a partition in. |
| `PartitionName` | Name of the partition to create. |

| Option | Description |
| --- | --- |
| -c | The name of the collection. |
| -p | The partition name. |
| -d (Optional) | The description of the partition. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to create a partition in. |
| `partition_name` | Name of the partition to create. |

限制
--

| Feature | Maximum limit |
| --- | --- |
| Number of partitions in a collection | 4,096 |

下一步
---

* 了解更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
