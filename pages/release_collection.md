释放集合
====

本主题介绍如何在搜索或查询后释放集合以减少内存使用。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.release()

```

```
await milvusClient.releaseCollection({
  collection_name: "book",
});

```

```
err := milvusClient.ReleaseCollection(
  context.Background(),                            // ctx
  "book",                                          // CollectionName
)
if err != nil {
  log.Fatal("failed to release collection:", err.Error())
}

```

```
milvusClient.releaseCollection(
  ReleaseCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```
release -c book

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/collection/load' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

Output:

```
{}

```

| Parameter | Description |
| --- | --- |
| `partition_name` (optional) | Name of the partition to release. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to release. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to release. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to release. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to release. |
| -p (Optional/Multiple) | The name of the partition to release. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to release. |

Constraints
-----------

* 成功加载的集合可以被释放。

* 当集合的分区被加载时，可以释放该集合。

* 当父集合已经加载时，尝试释放分区将返回错误。未来的版本将支持从已加载的集合中释放分区，并在释放集合的分区时加载集合。

接下来是什么
------

* 了解更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
