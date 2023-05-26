删除索引
===


本文介绍如何在 Milvus 中删除索引。

删除索引会不可逆地移除所有对应的索引文件。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.drop_index()

```

```bash
await milvusClient.dropIndex({
  collection_name: "book",
});

```

```bash
err = milvusClient.DropIndex(
  context.Background(),     // ctx
  "book",                   // CollectionName
  "book_intro",             // fieldName
)
if err != nil {
  log.Fatal("fail to drop index:", err.Error())
}

```

```bash
milvusClient.dropIndex(
  DropIndexParam.newBuilder()
    .withCollectionName("book")
    .withFieldName("book_intro")
    .build()
);

```

```bash
delete index -c book

```

```bash
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/index' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "field_name": "book_intro"
  }'

```
| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从其中删除索引的向量集合名称。|

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。|
| `CollectionName` | 要删除索引的向量集合名称。|
| `fieldName` | 要删除索引的向量字段名称。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要删除索引的向量集合名称。|
| `FieldName` | 要删除索引的向量字段名称。 |

| 选项 | 描述 |
| --- | --- |
| `-c` | 要从其中删除索引的向量集合名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要删除索引的向量集合名称。|
| `field_name` | 要删除索引的向量字段名称。|

下一步怎么做
 ------------

* 了解更多有关 Milvus 的基本操作:
	+ [进行向量搜索](search.md)（Conduct a vector search）
	+ [进行混合搜索](hybridsearch.md)（Conduct a hybrid search）
	+ [通过时间旅行进行搜索](timetravel.md)（Search with Time Travel）