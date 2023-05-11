删除分区
====

本主题介绍如何在指定集合中删除分区。

- You have to release the partition before you drop it.
- Dropping a partition irreversibly deletes all data within it.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection.drop_partition("novel")

```

```
await milvusClient.dropPartition({
  collection_name: "book",
  partition_name: "novel",
});

```

```
err := milvusClient.DropPartition(
  context.Background(),   // ctx
  "book",                 // CollectionName
  "novel",                // partitionName
)
if err != nil {
  log.Fatal("fail to drop partition:", err.Error())
}

```

```
milvusClient.dropPartition(
  DropPartitionParam.newBuilder()
    .withCollectionName("book")
    .withPartitionName("novel")
    .build()
);

```

```
delete partition -c book -p novel

```

```
curl -X 'DELETE' \
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
| `partition_name` | Name of the partition to drop. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop partition from. |
| `partition_name` | Name of the partition to drop. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to drop a partition in. |
| `partitionName` | Name of the partition to drop. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to drop a partition in. |
| `PartitionName` | Name of the partition to drop. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to drop partition from. |
| -p | Name of the partition to drop. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop partition from. |
| `partition_name` | Name of the partition to drop. |

接下来是什么
------

* 学习更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
