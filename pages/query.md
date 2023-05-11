向量查询
===

本主题介绍如何进行向量查询。

与向量相似性搜索不同，向量查询通过基于布尔表达式的标量过滤来检索向量。Milvus支持许多标量字段中的数据类型和各种布尔表达式。布尔表达式过滤标量字段或主键字段，并检索与过滤器匹配的所有结果。

The following example shows how to perform a vector query on a 2000-row dataset of book ID (primary key), word count (scalar field), and book introduction (vector field), simulating the situation where you query for certain books based on their IDs.

Load collection
---------------

All search and query operations within Milvus are executed in memory. Load the collection to memory before conducting a vector query.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load()

```

```
await milvusClient.loadCollection({
  collection_name: "book",
});

```

```
err := milvusClient.LoadCollection(
  context.Background(),   // ctx
  "book",                 // CollectionName
  false                   // async
)
if err != nil {
  log.Fatal("failed to load collection:", err.Error())
}

```

```
milvusClient.loadCollection(
  LoadCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```
load -c book

```

```
# See the following step.

```

Conduct a vector query
----------------------

The following example filters the vectors with certain `book_id` values, and returns the `book_id` field and `book_intro` of the results.

Milvus supports setting consistency level specifically for a query. The example in this topic sets the consistency level as `Strong`. You can also set the consistency level as `Bounded`, `Session` or `Eventually`. See [Consistency](consistency.md) for more information about the four consistency levels in Milvus.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
res = collection.query(
  expr = "book_id in [2,4,6,8]",
  offset = 0,
  limit = 10, 
  output_fields = ["book_id", "book_intro"],
  consistency_level="Strong"
)

```

```
const results = await milvusClient.query({
  collection_name: "book",
  expr: "book_id in [2,4,6,8]",
  output_fields: ["book_id", "book_intro"],
});

```

```
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

```
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

```
query

collection_name: book

The query expression: book_id in [2,4,6,8]

Name of partitions that contain entities(split by "," if multiple) []:

A list of fields to return(split by "," if multiple) []: book_id, book_intro

timeout []:

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "output_fields": ["book_id", "book_intro"],
    "expr": "book_id in [2,4,6,8]"
  }'

```

Output:

```
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

| Parameter | Description |
| --- | --- |
| `expr` | Boolean expression used to filter attribute. Find more expression details in [布尔表达式规则](boolean.md). |
| `offset` | Number of results to skip in the returned set. The sum of this value and `limit` should be less than 65535. |
| `limit` | Number of the most similar results to return. The sum of this value and `offset` should be less than 65535. |
| `output_fields` (optional) | List of names of the field to return. |
| `partition_names` (optional) | List of names of the partitions to query on. |
| `consistency_level` (optional) | Consistency level of the query. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to query. |
| `expr` | Boolean expression used to filter attribute. Find more expression details in [布尔表达式规则](boolean.md). |
| `output_fields` (optional) | List of names of the field to return. |
| `partition_names` (optional) | List of names of the partitions to query on. |

| Parameter | Description | Options |
| --- | --- | --- |
| `ctx` | Context to control API invocation process. | N/A |
| `CollectionName` | Name of the collection to query. | N/A |
| `partitionName` | List of names of the partitions to load. All partitions will be queried if it is left empty. | N/A |
| `expr` | Boolean expression used to filter attribute. | See [布尔表达式规则](boolean.md) for more information. |
| `OutputFields` | Name of the field to return. | Vector field is not supported in current release. |

| Parameter | Description | Options |
| --- | --- | --- |
| `CollectionName` | Name of the collection to load. | N/A |
| `OutFields` | Name of the field to return. | Vector field is not supported in current release. |
| `Expr` | Boolean expression used to filter attribute. | See [布尔表达式规则](boolean.md) for more information. |
| `ConsistencyLevel` | The consistency level used in the query. | `STRONG`, `BOUNDED`, and`EVENTUALLY`. |

| Option | Full name | Description |
| --- | --- | --- |
| --help | n/a | Displays help for using the command. |

| Parameter | Description |
| --- | --- |
| `output_fields` (optional) | List of names of the fields to return. |
| `vectors` | Vectors to query. |
| `expr` | Boolean expression used to filter attribute. Find more expression details in [布尔表达式规则](boolean.md). |

检查返回的结果。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
sorted_res = sorted(res, key=lambda k: k['book_id'])
sorted_res

```

```
console.log(results.data)

```

```
fmt.Printf("%#v\n", queryResult)
for _, qr := range queryResult {
	fmt.Println(qr.IDs)
}

```

```
QueryResultsWrapper wrapperQuery = new QueryResultsWrapper(respQuery.getData());
System.out.println(wrapperQuery.getFieldWrapper("book_id").getFieldData());
System.out.println(wrapperQuery.getFieldWrapper("word_count").getFieldData());

```

```
# Milvus CLI automatically returns the entities with the pre-defined output fields.

```

```
# See the output of the previous step.

```

接下来是什么？
-------

* Learn more basic operations of Milvus:

	+ [Conduct a vector search](search.md)
	+ [Conduct a hybrid search](hybridsearch.md)
	+ [Search with Time Travel](timetravel.md)
* Explore API references for Milvus SDKs:

	+ [PyMilvus API reference](/api-reference/pymilvus/v2.2.8/About.md)
	+ [Node.js API reference](/api-reference/node/v2.2.x/About.md)
	+ [Go API reference](/api-reference/go/v2.2.2/About.md)
	+ [Java API reference](/api-reference/java/v2.2.5/About.md)
