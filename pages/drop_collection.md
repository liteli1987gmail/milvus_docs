删除集合
====

本主题介绍如何删除集合及其中的数据。

Dropping a collection irreversibly deletes all data within it.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import utility
utility.drop_collection("book")

```

```
await milvusClient.dropCollection({ collection_name: "book" });

```

```
err = milvusClient.DropCollection(
  context.Background(), // ctx
  "book",               // CollectionName
)
if err != nil {
	log.Fatal("fail to drop collection:", err.Error())
}

```

```
milvusClient.dropCollection(
  DropCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```
delete collection -c book

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/collection' \
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
| `collection_name` | Name of the collection to drop. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to drop. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to drop. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to drop. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop. |

What's next
-----------

* 学习更多Milvus的基本操作：
	+ [将数据插入到Milvus中](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
