向量查询
===

本主题介绍如何进行向量查询。

与向量相似性搜索不同，向量查询通过基于布尔表达式的标量过滤来检索向量。Milvus支持许多标量字段中的数据类型和各种布尔表达式。布尔表达式过滤标量字段或主键字段，并检索与过滤器匹配的所有结果。

以下示例演示如何在一个2000行的数据集上执行向量查询，该数据集包含图书ID(主键)、单词计数(标量字段)和书籍介绍(向量字段)，模拟您基于ID查询某些书籍的情况。

加载集合
---------------

Milvus中的所有搜索和查询操作都在内存中执行。在进行向量查询之前，将集合加载到内存中。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load()

```

```python
await milvusClient.loadCollection({
  collection_name: "book",
});

```

```python
err := milvusClient.LoadCollection(
  context.Background(),   // ctx
  "book",                 // CollectionName
  false                   // async
)
if err != nil {
  log.Fatal("failed to load collection:", err.Error())
}

```

```python
milvusClient.loadCollection(
  LoadCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```python
load -c book

```

```python
# See the following step.

```

进行向量查询
----------------------

以下示例根据特定的 `book_id` 值过滤向量，并返回结果的 `book_id` 字段和 `book_intro` 字段。

Milvus支持对查询设置一致性级别。本主题中的示例将一致性级别设置为“强一致性（Strong）”。

您也可以将一致性级别设置为“有界一致性（Bounded）”、“会话一致性（Session）”或“最终一致性（Eventually）”。

有关Milvus中四个一致性级别的更多信息，请参见[一致性（Consistency）](consistency.md)。 


[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
res = collection.query(
  expr = "book_id in [2,4,6,8]",
  offset = 0,
  limit = 10, 
  output_fields = ["book_id", "book_intro"],
  consistency_level="Strong"
)

```

```python
const results = await milvusClient.query({
  collection_name: "book",
  expr: "book_id in [2,4,6,8]",
  output_fields: ["book_id", "book_intro"],
});

```

```python
queryResult, err := milvusClient.Query(
	context.Background(),                                   // ctx
	"book",                                                 // CollectionName
	"",                                                     // PartitionName
	entity.NewColumnInt64("book_id", []int64{2,4,6,8}),     // expr
	[]string{"book_id", "book_intro"}                       // OutputFields
)
if err != nil {
	log.Fatal("fail to query collection:", err.Error())
}

```

```python
List<String> query_output_fields = Arrays.asList("book_id", "word_count");
QueryParam queryParam = QueryParam.newBuilder()
  .withCollectionName("book")
  .withConsistencyLevel(ConsistencyLevelEnum.STRONG)
  .withExpr("book_id in [2,4,6,8]")
  .withOutFields(query_output_fields)
  .withOffset(0L)
  .withLimit(10L)
  .build();
R<QueryResults> respQuery = milvusClient.query(queryParam);

```

```python
query

collection_name: book

The query expression: book_id in [2,4,6,8]

Name of partitions that contain entities(split by "," if multiple) []:

A list of fields to return(split by "," if multiple) []: book_id, book_intro

timeout []:

```

```python
curl -X 'POST' 
  'http://localhost:9091/api/v1/query' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "output_fields": ["book_id", "book_intro"],
    "expr": "book_id in [2,4,6,8]"
  }'

```

Output:

```python
{
  "status":{},
  "fields_data":[
    {
      "type":5,
      "field_name":"book_id",
      "Field":{"Scalars":{"Data":{"LongData":{"data":[6,8,2,4]}}}},
      "field_id":100
    },
    {
      "type":101,
      "field_name":"book_intro",
      "Field":{"Vectors":{"dim":2,"Data":{"FloatVector":{"data":[6,1,8,1,2,1,4,1]}}}},
      "field_id":102
    }
  ]
}

```
| 参数 | 描述 |
| --- | --- |
| `expr` | 用于过滤属性的布尔表达式。查看[布尔表达式规则](boolean.md)以获取更多详细信息。 |
| `offset` | 返回结果集中要跳过的数量。该值与 `limit` 的和应小于 65535。 |
| `limit` | 要返回的最相似结果的数量。该值与 `offset` 的和应小于 65535。 |
| `output_fields`（可选） | 要返回的字段名称列表。 |
| `partition_names`（可选） | 要查询的分区名称列表。 |
| `consistency_level`（可选） | 查询的一致性级别。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要查询的集合名称。 |
| `expr` | 用于过滤属性的布尔表达式。查看[布尔表达式规则](boolean.md)以获取更多详细信息。 |
| `output_fields`（可选） | 要返回的字段名称列表。 |
| `partition_names`（可选） | 要查询的分区名称列表。 |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 | 无 |
| `CollectionName` | 要查询的集合名称。 | 无 |
| `partitionName` | 要加载的分区名称列表。如果留空，则将查询所有分区。 | 无 |
| `expr` | 用于过滤属性的布尔表达式。 | 更多信息请参见[布尔表达式规则](boolean.md)。 |
| `OutputFields` | 要返回的字段名。 | 当前版本中不支持矢量字段。 |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `CollectionName` | 要加载的集合的名称。 | 无 |
| `OutFields` | 要返回的字段名称。 | 当前版本中不支持矢量字段。 |
| `Expr` | 用于过滤属性的布尔表达式。 | 更多信息请参见[布尔表达式规则](boolean.md)。 |
| `ConsistencyLevel` | 查询使用的一致性级别。 | `STRONG`、`BOUNDED`和`EVENTUALLY`。 |

| 选项 | 全名 | 描述 |
| --- | --- | --- |
| --help | n/a | 显示使用该命令的帮助文档。 |

| 参数 | 描述 |
| --- | --- |
| `output_fields`（可选） | 要返回的字段名称列表。 |
| `vectors` | 要查询的向量。 |
| `expr` | 用于过滤属性的布尔表达式。查看[布尔表达式规则](boolean.md)以获取更多详细信息。 |

检查返回的结果。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
sorted_res = sorted(res, key=lambda k: k['book_id'])
sorted_res

```

```python
console.log(results.data)

```

```python
fmt.Printf("%#v", queryResult)
for _, qr := range queryResult {
	fmt.Println(qr.IDs)
}

```

```python
QueryResultsWrapper wrapperQuery = new QueryResultsWrapper(respQuery.getData());
System.out.println(wrapperQuery.getFieldWrapper("book_id").getFieldData());
System.out.println(wrapperQuery.getFieldWrapper("word_count").getFieldData());

```

```python
# Milvus CLI automatically returns the entities with the pre-defined output fields.

```

```python
# See the output of the previous step.

```

接下来是什么？
-------

* 学习更多基本操作:

	+ [Conduct a vector search](search.md)
	+ [Conduct a hybrid search](hybridsearch.md)
	+ [Search with Time Travel](timetravel.md)
* 查看 Milvus SDKs:

	+ [PyMilvus API reference](/api-reference/pymilvus/v2.2.8/About.md)
	+ [Node.js API reference](/api-reference/node/v2.2.x/About.md)
	+ [Go API reference](/api-reference/go/v2.2.2/About.md)
	+ [Java API reference](/api-reference/java/v2.2.5/About.md)
