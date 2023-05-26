检查分区信息
======

本主题介绍如何检查Milvus中的分区信息。

验证分区是否存在
--------

验证指定集合中的分区是否存在。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.has_partition("novel")

```

```bash
await milvusClient.hasPartition({
  collection_name: "book",
  partition_name: "novel",
});

```

```bash
hasPar, err := milvusClient.HasPartition(
  context.Background(),   // ctx
  "book",                 // CollectionName
  "novel",                // partitionName
)
if err != nil {
  log.Fatal("failed to check the partition:", err.Error())
}
log.Println(hasPar)

```

```bash
R<Boolean> respHasPartition = milvusClient.hasPartition(
  HasPartitionParam.newBuilder()
    .withCollectionName("book")
    .withPartitionName("novel")
    .build()
);
if (respHasPartition.getData() == Boolean.TRUE) {
  System.out.println("Partition exists.");
}

```

```bash
describe partition -c book -p novel

```

```bash
curl -X 'GET' 
  'http://localhost:9091/api/v1/partition/existence' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "partition_name": "novel"
  }'

```

Output:

```bash
{"status":{},"value":true}

```
| 参数 | 描述 |
| --- | --- |
| `partition_name` | 要检查的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要检查的集合名称。 |
| `partition_name` | 要检查的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要检查的集合名称。 |
| `partitionName` | 要检查的分区名称。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要检查的集合名称。 |
| -p | 要检查的分区名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要检查的集合名称。 |
| `partition_name` | 要检查的分区名称。 |

列出所有分区
------

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.partitions

```

```bash
await milvusClient.showPartitions({
  collection_name: "book",
});

```

```bash
listPar, err := milvusClient.ShowPartitions(
  context.Background(),   // ctx
  "book",                 // CollectionName
)
if err != nil {
  log.Fatal("failed to list partitions:", err.Error())
}
log.Println(listPar)

```

```bash
R<ShowPartitionsResponse> respShowPartitions = milvusClient.showPartitions(
  ShowPartitionsParam.newBuilder()
          .withCollectionName("book")
          .build()
);
System.out.println(respShowPartitions);

```

```bash
list partitions -c book

```

```bash
curl -X 'GET' 
  'http://localhost:9091/api/v1/partitions' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

Output:

```bash
{
  "status": {},
  "partition_names": [
    "_default",
    "novel"
  ],
  "partitionIDs": [
    434261413928632322,
    434261764795531265
  ],
  "created_timestamps": [
    434261413928632323,
    434261764795531266
  ],
  "created_utc_timestamps": [
    1656575828280,
    1656577166731
  ]
}

```
| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要检查的集合名称。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要检查的集合名称。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要检查的集合名称。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要检查的集合名称。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要检查的集合名称。 |


接下来是什么
------

* 了解更多关于Milvus的基础操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
