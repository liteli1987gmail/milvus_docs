
Milvus中如何删除实体?
===

本文介绍在Milvus中如何删除实体。

Milvus支持通过布尔表达式筛选主键删除实体。

* 如果一致性级别低于`Strong`，则删除的实体仍然可以在删除后立即检索。

* 超出Time Travel预设时间范围的删除的实体将无法再次检索。

* 频繁的删除操作将影响系统性能。

准备布尔表达式
------------------

准备筛选要删除的实体的布尔表达式。

Milvus仅支持删除具有明确定义主键的实体，这只需要在术语表达式中使用`in`就能实现。其他操作符只能用于向量搜索中的查询或标量过滤。有关更多信息，请参见[布尔表达式规则](boolean.md)。

以下示例筛选主键值为`0`和`1`的数据。


[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
expr = "book_id in [0,1]"

```

```python
const expr = "book_id in [0,1]";

```

```python
private static final String DELETE_EXPR = "book_id in [0,1]";

```

```python
delete entities -c book
The expression to specify entities to be deleted： book_id in [0,1]

```

```python
"expr" = "book_id in [0,1]"

```

| Option | Description |
| --- | --- |
| -c | The name of the collection. |
| -p (Optional) | The name of the partition that the entities belong to. |

删除实体 Delete entities
---------------

删除使用您创建的布尔表达式的实体。 Milvus返回已删除实体的ID列表。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.delete(expr)

```

```python
await milvusClient.deleteEntities({
  collection_name: "book",
  expr: expr,
});

```

```python
// This function is under active development on the GO client.

```

```python
milvusClient.delete(
  DeleteParam.newBuilder()
    .withCollectionName("book")
    .withExpr(DELETE_EXPR)
    .build()
);

```

```python
You are trying to delete the entities of collection. This action cannot be undone!
Do you want to continue? [y/N]: y

```

```python
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/entities' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "expr": "book_id in [0,1]"
  }'

```

Output:

```python
{
  "status":{},
  "IDs":{"IdField":{"IntId":{"data":[0,1]}}},
  "delete_cnt":2,
  "timestamp":434262178115092482
}

```
| 参数 | 描述 |
| --- | --- |
| `expr` | 用于指定要删除的实体的布尔表达式。 |
| `partition_name`（可选） | 要从中删除实体的分区的名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从其中删除实体的集合名称。 |
| `expr` | 用于指定要删除的实体的布尔表达式。 |
| `partition_name`（可选） | 要从中删除实体的分区的名称。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要从其中删除实体的集合名称。 |
| `expr` | 用于指定要删除的实体的布尔表达式。 |
| `PartitionName`（可选） | 要从中删除实体的分区的名称。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要从其中删除实体的集合名称。 |
| `expr` | 用于指定要删除的实体的布尔表达式。 |

下一步是什么
---------------

* 了解更多关于Milvus的基本操作：
	+ [Build an index for vectors](build_index.md)
	+ [Conduct a vector search](search.md)
	+ [Conduct a hybrid search](hybridsearch.md)
