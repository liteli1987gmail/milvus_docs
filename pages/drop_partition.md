删除分区
====

本主题介绍如何在指定集合中删除分区。



- 在删除分区之前，必须先释放分区。
- 删除分区将不可逆地删除其中的所有数据。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import Collection
collection.drop_partition("novel")

```

```python
await milvusClient.dropPartition({
  collection_name: "book",
  partition_name: "novel",
});

```

```python
err := milvusClient.DropPartition(
  context.Background(),   // ctx
  "book",                 // CollectionName
  "novel",                // partitionName
)
if err != nil {
  log.Fatal("fail to drop partition:", err.Error())
}

```

```python
milvusClient.dropPartition(
  DropPartitionParam.newBuilder()
    .withCollectionName("book")
    .withPartitionName("novel")
    .build()
);

```

```python
delete partition -c book -p novel

```

```python
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/partition' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "partition_name": "novel"
  }'

```
| 参数 | 描述 |
| --- | --- |
| `partition_name` | 要删除的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从中删除分区的集合名称。 |
| `partition_name` | 要删除的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要删除分区的集合名称。 |
| `partitionName` | 要删除的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要删除分区的集合名称。 |
| `PartitionName` | 要删除的分区名称。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要从中删除分区的集合名称。 |
| -p | 要删除的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从中删除分区的集合名称。 |
| `partition_name` | 要删除的分区名称。 |

接下来是什么
------

* 学习更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
