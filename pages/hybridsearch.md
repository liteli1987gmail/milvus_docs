本主题介绍如何执行混合搜索。

混合搜索本质上是向量搜索与属性过滤的结合。通过指定[布尔表达式（boolean expressions）](boolean.md)来过滤标量字段或主键字段，可以限制搜索的某些条件。

以下示例演示了如何在基于常规[向量搜索（vector search）](search.md）的基础上进行混合搜索。假设您想基于书籍的向量化介绍搜索某些书籍，但是您只想在特定摘要字数范围内进行搜索。您可以在搜索参数中指定布尔表达式来过滤`word_count`字段。Milvus将仅在与该表达式匹配的实体中搜索相似向量。

加载集合
---------------

在Milvus中，所有搜索和查询操作都在内存中执行。在进行向量搜索之前，将集合加载到内存中。

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

进行混合向量搜索
--------
通过指定布尔表达式，您可以在向量搜索期间过滤实体的标量字段。以下示例将搜索范围限制在指定`word_count`值范围内的向量中。


[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
search_param = {
  "data": [[0.1, 0.2]],
  "anns_field": "book_intro",
  "param": {"metric_type": "L2", "params": {"nprobe": 10}},
  "offset": 0,
  "limit": 2,
  "expr": "word_count <= 11000",
}
res = collection.search(**search_param)

```

```
const results = await milvusClient.search({
  collection_name: "book",
  expr: "word_count <= 11000",
  vectors: [[0.1, 0.2]],
  search_params: {
    anns_field: "book_intro",
    topk: "2",
    metric_type: "L2",
    params: JSON.stringify({ nprobe: 10 }),
  },
  vector_type: 101,    // DataType.FloatVector,
});

```

```
sp, _ := entity.NewIndexFlatSearchParam(   // NewIndex*SearchParam func
  10,                                      // searchParam
)
searchResult, err := milvusClient.Search(
  context.Background(),                    // ctx
  "book",                                  // CollectionName
  []string{},                              // partitionNames
  "word_count <= 11000",                   // expr
  []string{"book_id"},                     // outputFields
  []entity.Vector{entity.FloatVector([]float32{0.1, 0.2})}, // vectors
  "book_intro",                            // vectorField
  entity.L2,                               // metricType
  2,                                       // topK
  sp,                                      // sp
)
if err != nil {
  log.Fatal("fail to search collection:", err.Error())
}

```

```
final Integer SEARCH_K = 2;
final String SEARCH_PARAM = "{\"nprobe\":10, \”offset\”:5}";
List<String> search_output_fields = Arrays.asList("book_id");
List<List<Float>> search_vectors = Arrays.asList(Arrays.asList(0.1f, 0.2f));

SearchParam searchParam = SearchParam.newBuilder()
  .withCollectionName("book")
  .withMetricType(MetricType.L2)
  .withOutFields(search_output_fields)
  .withTopK(SEARCH_K)
  .withVectors(search_vectors)
  .withVectorFieldName("book_intro")
  .withExpr("word_count <= 11000")
  .withParams(SEARCH_PARAM)
  .build();
R<SearchResults> respSearch = milvusClient.search(searchParam);

```

```
search

Collection name (book): book

The vectors of search data(the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a csv file without headers): [[0.1, 0.2]]

The vector field used to search of collection (book_intro): book_intro

Metric type: L2

Search parameter nprobe's value: 10

The max number of returned record, also known as topk: 2

The boolean expression used to filter attribute []: word_count <= 11000

The names of partitions to search (split by "," if multiple) ['_default'] []: 

timeout []:

Guarantee Timestamp(It instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date) [0]: 

Travel Timestamp(Specify a timestamp in a search to get results based on a data view) [0]:

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "output_fields": ["book_id"],
    "search_params": [
      {"key": "anns_field", "value": "book_intro"},
      {"key": "topk", "value": "2"},
      {"key": "params", "value": "{\"nprobe\": 10}"},
      {"key": "metric_type", "value": "L2"},
      {"key": "round_decimal", "value": "-1"}
    ],
    "vectors": [ [0.1,0.2] ],
    "dsl": "word_count >= 11000",
    "dsl_type": 1
  }'

```

Output:

```
{
  "status":{},
  "results":{
    "num_queries":1,
    "top_k":2,
    "fields_data":[
      {
        "type":5,
        "field_name":"book_id",
        "Field":{"Scalars":{"Data":{"LongData":{"data":[11,12]}}}},
        "field_id":100
      }
    ],
    "scores":[119.44999,142.24998],
    "ids":{"IdField":{"IntId":{"data":[11,12]}}},"topks":[2]
  },
  "collection_name":"book"
}

```

| Parameter | Description |
| --- | --- |
| `data` | Vectors to search with. |
| `anns_field` | Name of the field to search on. |
| `params` | Search parameter(s) specific to the index. See [Vector Index](index.md) for more information. |
| `offset` | Number of results to skip in the returned set. The sum of this value and `limit` should be less than 65535. |
| `limit` | Number of the most similar results to return. |
| `expr` | Boolean expression used to filter attribute. See [Boolean Expression Rules](boolean.md) for more information. |
| `partition_names` (optional) | List of names of the partition to search in. The sum of this value and `offset` should be less than 65535. |
| `output_fields` (optional) | Name of the field to return. Vector field is not supported in current release. |
| `timeout` (optional) | A duration of time in seconds to allow for RPC. Clients wait until server responds or error occurs when it is set to None. |
| `round_decimal` (optional) | Number of decimal places of returned distance. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to search in. |
| `search_params` | Parameters (as an object) used for search. |
| `vectors` | Vectors to search with. |
| `vector_type` | Pre-check of binary or float vectors. `100` for binary vectors and `101` for float vectors. |
| `partition_names` (optional) | List of names of the partition to search in. |
| `expr` (optional) | Boolean expression used to filter attribute. See [Boolean Expression Rules](boolean.md) for more information. |
| `output_fields` (optional) | Name of the field to return. Vector field not support in current release. |

| Parameter | Description | Options |
| --- | --- | --- |
| `NewIndex*SearchParam func` | Function to create entity.SearchParam according to different index types. | For floating point vectors:
 * `NewIndexFlatSearchParam` (FLAT)
* `NewIndexIvfFlatSearchParam` (IVF_FLAT)
* `NewIndexIvfSQ8SearchParam` (IVF_SQ8)
* `NewIndexIvfPQSearchParam` (RNSG)
* `NewIndexRNSGSearchParam` (HNSW)
* `NewIndexHNSWSearchParam` (HNSW)
* `NewIndexANNOYSearchParam` (ANNOY)
* `NewIndexRHNSWFlatSearchParam` (RHNSW_FLAT)
* `NewIndexRHNSW_PQSearchParam` (RHNSW_PQ)
* `NewIndexRHNSW_SQSearchParam` (RHNSW_SQ)

 For binary vectors:
 * `NewIndexBinFlatSearchParam` (BIN_FLAT)
* `NewIndexBinIvfFlatSearchParam` (BIN_IVF_FLAT)
 |
| `searchParam` | Search parameter(s) specific to the index. | See [Vector Index](index.md) for more information. |
| `ctx` | Context to control API invocation process. | N/A |
| `CollectionName` | Name of the collection to load. | N/A |
| `partitionNames` | List of names of the partitions to load. All partitions will be searched if it is left empty. | N/A |
| `expr` | Boolean expression used to filter attribute. | See [Boolean Expression Rules](boolean.md) for more information. |
| `output_fields` | Name of the field to return. | Vector field is not supported in current release. |
| `vectors` | Vectors to search with. | N/A |
| `vectorField` | Name of the field to search on. | N/A |
| `metricType` | Metric type used for search. | This parameter must be set identical to the metric type used for index building. |
| `topK` | Number of the most similar results to return. | N/A |
| `sp` | entity.SearchParam specific to the index. | N/A |

| Parameter | Description | Options |
| --- | --- | --- |
| `CollectionName` | Name of the collection to load. | N/A |
| `MetricType` | Metric type used for search. | This parameter must be set identical to the metric type used for index building. |
| `OutFields` | Name of the field to return. | Vector field is not supported in current release. |
| `TopK` | Number of the most similar results to return. | N/A |
| `Vectors` | Vectors to search with. | N/A |
| `VectorFieldName` | Name of the field to search on. | N/A |
| `Expr` | Boolean expression used to filter attribute. | See [Boolean Expression Rules](boolean.md) for more information. |
| `Params` | Search parameter(s) specific to the index. | See [Vector Index](index.md) for more information. |

| Option | Full name | Description |
| --- | --- | --- |
| --help | n/a | Displays help for using the command. |

| Parameter | Description |
| --- | --- |
| `output_fields`(optional) | Name of the field to return. Vector field is not supported in current release. |
| `anns_field` | Name of the field to search on. |
| `topk` | Number of the most similar results to return. |
| `params` | Search parameter(s) specific to the index. See [Vector Index](index.md) for more information. |
| `metric_type` | Metric type used for search. This parameter must be set identical to the metric type used for index building. |
| `round_decimal` (optional) | Number of decimal places of returned distance. |
| `Vectors` | Vectors to search with. |
| `dsl` | Boolean expression used to filter attribute. Find more expression details in [Boolean Expression Rules](boolean.md). |
| `dsl_type` | Type of `dsl` (Data Search Language) field:
 0: "Dsl"
 1: "BoolExprV1"
  |

Check the returned results.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
assert len(res) == 1
hits = res[0]
assert len(hits) == 2
print(f"- Total hits: {len(hits)}, hits ids: {hits.ids} ")
print(f"- Top1 hit id: {hits[0].id}, distance: {hits[0].distance}, score: {hits[0].score} ")

```

```
console.log(results.results)

```

```
fmt.Printf("%#v\n", searchResult)
for _, sr := range searchResult {
  fmt.Println(sr.IDs)
  fmt.Println(sr.Scores)
}

```

```
SearchResultsWrapper wrapperSearch = new SearchResultsWrapper(respSearch.getData().getResults());
System.out.println(wrapperSearch.getIDScore(0));
System.out.println(wrapperSearch.getFieldData("book_id", 0));

```

```
# Milvus CLI automatically returns the primary key values of the most similar vectors and their distances.

```

```
# See the output of the previous step.

```

接下来的步骤
---------------

* 尝试使用[Time Travel搜索（Search with Time Travel）](timetravel.md)
* 查看Milvus SDK的API参考文档：

	+ [PyMilvus API参考文档](/api-reference/pymilvus/v2.2.8/About.md)
	+ [Node.js API参考文档](/api-reference/node/v2.2.x/About.md)
	+ [Go API参考文档](/api-reference/go/v2.2.2/About.md)
	+ [Java API参考文档](/api-reference/java/v2.2.5/About.md)