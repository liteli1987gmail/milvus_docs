本文介绍如何在 Milvus 中删除索引。

删除索引会不可逆地移除所有对应的索引文件。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.drop_index()

```

```
await milvusClient.dropIndex({
  collection_name: "book",
});

```

```
err = milvusClient.DropIndex(
  context.Background(),     // ctx
  "book",                   // CollectionName
  "book_intro",             // fieldName
)
if err != nil {
  log.Fatal("fail to drop index:", err.Error())
}

```

```
milvusClient.dropIndex(
  DropIndexParam.newBuilder()
    .withCollectionName("book")
    .withFieldName("book_intro")
    .build()
);

```

```
delete index -c book

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/index' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "field_name": "book_intro"
  }'

```

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop index from. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to drop index on. |
| `fieldName` | Name of the vector field to drop index on. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to drop index on. |
| `FieldName` | Name of the vector field to drop index on. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to drop index from. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to drop index on. |
| `field_name` | Name of the vector field to drop index on. |

下一步怎么做
 ------------

* 了解更多有关 Milvus 的基本操作:
	+ [进行向量搜索](search.md)（Conduct a vector search）
	+ [进行混合搜索](hybridsearch.md)（Conduct a hybrid search）
	+ [通过时间旅行进行搜索](timetravel.md)（Search with Time Travel）