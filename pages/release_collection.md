释放集合
====

本主题介绍如何在搜索或查询后释放集合以减少内存使用。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.release()

```

```python
await milvusClient.releaseCollection({
  collection_name: "book",
});

```

```python
err := milvusClient.ReleaseCollection(
  context.Background(),                            // ctx
  "book",                                          // CollectionName
)
if err != nil {
  log.Fatal("failed to release collection:", err.Error())
}

```

```python
milvusClient.releaseCollection(
  ReleaseCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```python
release -c book

```

```python
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/collection/load' 
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
| `partition_name` (可选) | 要释放的分区的名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要释放的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要释放的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要释放的集合的名称。|

| 选项 | 描述 |
| --- | --- |
| `-c` | 要释放的集合的名称。|
| `-p` (可选/重复) | 要释放的分区的名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要释放的集合的名称。|

限制 Constraints
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
