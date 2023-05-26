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

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load()

```

```bash
await milvusClient.loadCollection({
  collection_name: "book",
});

```

```bash
err := milvusClient.LoadCollection(
  context.Background(),   // ctx
  "book",                 // CollectionName
  false                   // async
)
if err != nil {
  log.Fatal("failed to load collection:", err.Error())
}

```

```bash
milvusClient.loadCollection(
  LoadCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

```

```bash
load -c book

```

```bash
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

```bash
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

```bash
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

```bash
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

```bash
final Integer SEARCH_K = 2;
final String SEARCH_PARAM = "{"nprobe":10, ”offset”:5}";
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

```bash
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

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/search' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "output_fields": ["book_id"],
    "search_params": [
      {"key": "anns_field", "value": "book_intro"},
      {"key": "topk", "value": "2"},
      {"key": "params", "value": "{"nprobe": 10}"},
      {"key": "metric_type", "value": "L2"},
      {"key": "round_decimal", "value": "-1"}
    ],
    "vectors": [ [0.1,0.2] ],
    "dsl": "word_count >= 11000",
    "dsl_type": 1
  }'

```

Output:

```bash
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

| 参数 | 描述 |
| --- | --- |
| `data` | 用于搜索的向量 |
| `anns_field` | 要搜索的字段名称 |
| `params` | 用于索引构建的指标类型特定的搜索参数。详情请见[向量索引(Vector Index)](index.md) |
| `offset` | 返回结果中要跳过的结果数。此值与 `limit` 的和应小于65535。 |
| `limit` | 要返回的最相似结果的数量。 |
| `expr` | 用于过滤属性的布尔表达式。详见[布尔表达式规则](boolean.md) |
| `partition_names` （可选) | 要搜索的分区名称列表。此值与 `offset` 的和应小于65535。 |
| `output_fields` (可选) | 要返回的字段名称。当前版本不支持向量字段 |
| `timeout` (可选) | 允许RPC的持续时间，单位为秒。当设置为None时，客户端等待服务器响应或错误发生。|
| `round_decimal` (可选) | 返回的距离的小数位数。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要搜索的集合名称 |
| `search_params` | 用于搜索的参数（作为对象）。|
| `vectors` | 用于搜索的向量。 |
| `vector_type` | 预先检查二进制或浮点向量。`100`表示二进制向量，`101`表示浮点向量。 |
| `partition_names` (可选) | 要搜索的分区名称列表。 |
| `expr` (可选) | 用于过滤属性的布尔表达式。详见[布尔表达式规则](boolean.md)。|
| `output_fields` (可选) | 要返回的字段名称。当前版本不支持向量字段。|

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `NewIndex*SearchParam func` | 根据不同的索引类型创建entity.SearchParam的功能 | 对于浮点向量:  * `NewIndexFlatSearchParam` (FLAT)  * `NewIndexIvfFlatSearchParam` (IVF_FLAT) * `NewIndexIvfSQ8SearchParam` (IVF_SQ8)  * `NewIndexIvfPQSearchParam` (RNSG) * `NewIndexRNSGSearchParam` (HNSW) * `NewIndexHNSWSearchParam` (HNSW)  * `NewIndexANNOYSearchParam` (ANNOY)  * `NewIndexRHNSWFlatSearchParam` (RHNSW_FLAT)  * `NewIndexRHNSW_PQSearchParam` (RHNSW_PQ)  * `NewIndexRHNSW_SQSearchParam` (RHNSW_SQ)   对于二进制向量:  `NewIndexBinFlatSearchParam` (BIN_FLAT)  `NewIndexBinIvfFlatSearchParam` (BIN_IVF_FLAT)|
| `searchParam` | 用于索引构建的指标类型特定的搜索参数。 | 详见[向量索引(Vector Index)](index.md) |
| `ctx` | 控制API调用过程的上下文。 | N/A |
| `CollectionName` | 要加载的集合名称。 | N/A |
| `partitionNames` | 要加载的分区名称列表。如果为空，则将搜索所有分区。 | N/A |
| `expr` | 用于过滤属性的布尔表达式。 | 详见[布尔表达式规则](boolean.md)|
| `output_fields` | 要返回的字段名称。 | 当前版本不支持向量字段 |
| `vectors` | 用于搜索的向量。 | N/A |
| `VectorFieldName` | 要搜索的字段名称。 | N/A |
| `metricType` | 用于搜索的指标类型。 | 此参数必须与用于索引构建的指标类型相同。 |
| `topK` | 要返回的最相似结果的数量。 | N/A |
| `sp` | 特定于索引的entity.SearchParam。 | N/A |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `CollectionName` | 要加载的集合名称。 | N/A |
| `MetricType` | 用于搜索的指标类型 | 此参数必须与用于索引构建的指标类型相同。 |
| `OutFields` | 要返回的字段名称。 | 当前版本不支持向量字段。 |
| `TopK` | 要返回的最相似结果的数量。| N/A |
| `Vectors` | 用于搜索的向量。 | N/A |
| `VectorFieldName` | 要搜索的字段名称。 | N/A |
| `Expr` | 用于过滤属性的布尔表达式。 | 详见[布尔表达式规则](boolean.md) |
| `Params` | 用于索引构建的特定于指标类型的搜索参数。 | 详见[向量索引(Vector Index)](index.md) |

| 选项 | 全称 | 描述 |
| --- | --- | --- |
| --help | n/a | 显示命令使用帮助。 |

| 参数 | 描述 |
| --- | --- |
| `output_fields`(可选) | 要返回的字段名。当前版本不支持向量字段。 |
| `anns_field` | 要搜索的字段名称 |
| `topk` | 要返回的最相似结果的数量。 |
| `params` | 用于索引构建的特定于指标类型的搜索参数。详见[向量索引(Vector Index)](index.md) |
| `metric_type` | 用于搜索的指标类型。此参数必须与用于索引构建的指标类型相同。 |
| `round_decimal` (可选) | 返回的距离的小数位数。 |
| `Vectors` | 要搜索的向量。 |
| `dsl` | 用于过滤属性的布尔表达式。详见[布尔表达式规则](boolean.md)。 |
| `dsl_type` | `dsl`(数据搜索语言)的类型。0: "Dsl"，1: "BoolExprV1"|

检查返回结果。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
assert len(res) == 1
hits = res[0]
assert len(hits) == 2
print(f"- Total hits: {len(hits)}, hits ids: {hits.ids} ")
print(f"- Top1 hit id: {hits[0].id}, distance: {hits[0].distance}, score: {hits[0].score} ")

```

```bash
console.log(results.results)

```

```bash
fmt.Printf("%#v", searchResult)
for _, sr := range searchResult {
  fmt.Println(sr.IDs)
  fmt.Println(sr.Scores)
}

```

```bash
SearchResultsWrapper wrapperSearch = new SearchResultsWrapper(respSearch.getData().getResults());
System.out.println(wrapperSearch.getIDScore(0));
System.out.println(wrapperSearch.getFieldData("book_id", 0));

```

```bash
# Milvus CLI automatically returns the primary key values of the most similar vectors and their distances.

```

```bash
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