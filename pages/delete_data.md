
Milvus中如何删除实体?
===

本文介绍在Milvus中如何删除实体。

Milvus支持通过布尔表达式筛选主键删除实体。

* 如果一致性级别低于`Strong`，则删除的实体仍然可以在删除后立即检索。

* 超出Time Travel预设时间范围的删除的实体将无法再次检索。

* 频繁的删除操作将影响系统性能。

Prepare boolean expression
--------------------------

Prepare the boolean expression that filters the entities to delete.

Milvus only supports deleting entities with clearly specified primary keys, which can be achieved merely with the term expression `in`. Other operators can be used only in query or scalar filtering in vector search. See [Boolean Expression Rules](boolean.md) for more information.

The following example filters data with primary key values of `0` and `1`.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
expr = "book_id in [0,1]"

```

```
const expr = "book_id in [0,1]";

```

```
private static final String DELETE_EXPR = "book_id in [0,1]";

```

```
delete entities -c book
The expression to specify entities to be deleted： book_id in [0,1]

```

```
"expr" = "book_id in [0,1]"

```

| Option | Description |
| --- | --- |
| -c | The name of the collection. |
| -p (Optional) | The name of the partition that the entities belong to. |

Delete entities
---------------

删除使用您创建的布尔表达式的实体。 Milvus返回已删除实体的ID列表。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.delete(expr)

```

```
await milvusClient.deleteEntities({
  collection_name: "book",
  expr: expr,
});

```

```
// This function is under active development on the GO client.

```

```
milvusClient.delete(
  DeleteParam.newBuilder()
    .withCollectionName("book")
    .withExpr(DELETE_EXPR)
    .build()
);

```

```
You are trying to delete the entities of collection. This action cannot be undone!
Do you want to continue? [y/N]: y

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/entities' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "expr": "book_id in [0,1]"
  }'

```

Output:

```
{
  "status":{},
  "IDs":{"IdField":{"IntId":{"data":[0,1]}}},
  "delete_cnt":2,
  "timestamp":434262178115092482
}

```

| Parameter | Description |
| --- | --- |
| `expr` | Boolean expression that specifies the entities to delete. |
| `partition_name` (optional) | Name of the partition to delete entities from. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to delete entities from. |
| `expr` | Boolean expression that specifies the entities to delete. |
| `partition_name` (optional) | Name of the partition to delete entities from. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to delete entities from. |
| `expr` | Boolean expression that specifies the entities to delete. |
| `PartitionName` (optional) | Name of the partition to delete entities from. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to delete entities from. |
| `expr` | Boolean expression that specifies the entities to delete. |

What's next
-----------

* Learn more basic operations of Milvus:
	+ [Build an index for vectors](build_index.md)
	+ [Conduct a vector search](search.md)
	+ [Conduct a hybrid search](hybridsearch.md)
