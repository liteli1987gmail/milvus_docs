删除集合
====

本主题介绍如何删除集合及其中的数据。

删除一个集合将不可逆地删除其中的所有数据。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import utility
utility.drop_collection("book")

```

```python
await milvusClient.dropCollection({ collection_name: "book" });

```

```python
err = milvusClient.DropCollection(
  context.Background(), // ctx
  "book",               // CollectionName
)
if err != nil {
	log.Fatal("fail to drop collection:", err.Error())
}

```

```python
milvusClient.dropCollection(
  DropCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```python
delete collection -c book

```

```python
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/collection' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

Output:

```python
{}

```


| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要清除的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要清除的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要清除的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要清除的集合的名称。|

| 选项 | 描述 |
| --- | --- |
| `-c` | 要清除的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要清除的集合的名称。|

下一步
-----------

* 学习更多Milvus的基本操作：
	+ [将数据插入到Milvus中](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
