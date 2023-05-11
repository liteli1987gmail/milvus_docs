本主题介绍如何使用Milvus搜索实体。

在Milvus中进行向量相似度搜索时，会计算查询向量和集合中具有指定相似性度量的向量之间的距离，并返回最相似的结果。通过指定一个[布尔表达式](boolean.md)来过滤标量字段或主键字段，您可以执行[混合搜索](hybridsearch.md)甚至[时光旅行搜索](timetravel.md)。

以下示例展示了如何对一个包含2000行书籍ID（主键）、字数（标量字段）和书籍介绍（向量字段）的数据集执行向量相似度搜索，模拟搜索基于向量化介绍的特定书籍的情况。Milvus将根据您定义的查询向量和搜索参数返回最相似的结果。

加载集合
---------------

在Milvus中，所有的搜索和查询操作都在内存中执行。在进行向量相似度搜索之前，需要将集合加载到内存中。

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
curl -X 'POST' \
  'http://localhost:9091/api/v1/collection/load' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

准备搜索参数
------

Prepare the parameters that suit your search scenario. The following example defines that the search will calculate the distance with Euclidean distance, and retrieve vectors from ten closest clusters built by the IVF_FLAT index.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
search_params = {"metric_type": "L2", "params": {"nprobe": 10}, "offset": 5}

```

```
const searchParams = {
  anns_field: "book_intro",
  topk: "2",
  metric_type: "L2",
  params: JSON.stringify({ nprobe: 10 }),
};

```

```
sp, _ := entity.NewIndexFlatSearchParam( // NewIndex*SearchParam func
	10,                                  // searchParam
)

```

```
final Integer SEARCH_K = 2;                       // TopK
final String SEARCH_PARAM = "{\"nprobe\":10, \”offset\”:5}";    // Params

```

```
search

Collection name (book): book

The vectors of search data(the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a csv file without headers): [[0.1, 0.2]]

The vector field used to search of collection (book_intro): book_intro

Metric type: L2

Search parameter nprobe's value: 10

The max number of returned record, also known as topk: 10

The boolean expression used to filter attribute []: 

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
        "Field":{"Scalars":{"Data":{"LongData":{"data":[1,2]}}}},
        "field_id":100
      }
    ],
    "scores":[1.45,4.25],
    "ids":{"IdField":{"IntId":{"data":[1,2]}}},
    "topks":[2]},
    "collection_name":"book"
}

```

| Parameter | Description |
| --- | --- |
| `metric_type` | Metrics used to measure the similarity of vectors. See [Simlarity Metrics](metric.md) for more information. |
| `params` | Search parameter(s) specific to the index. See [Vector Index](index.md) for more information. |
| `offset` | An offset in this dictionary. The sum of the offset value and the value in `limit` should be less than 65535.  |
| `ignore_growing` | Whether to ignore growing segments during similarity searches. The value defaults to `False`, indicating that searches involve growing segments. |

| Parameter | Description |
| --- | --- |
| `anns_field` | Name of the field to search on. |
| `topk` | Number of the most similar results to return. |
| `metric_type` | Metrics used to measure similarity of vectors. See [Simlarity Metrics](metric.md) for more information. |
| `params` | Search parameter(s) specific to the index. See [Vector Index](index.md) for more information. |

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

| Parameter | Description | Options |
| --- | --- | --- |
| `TopK` | Number of the most similar results to return. | N/A |
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
| `metric_type` | Metrics used to measure similarity of vectors. See [Simlarity Metrics](metric.md) for more information. |
| `round_decimal` (optional) | Number of decimal places of returned distance. |
| `Vectors` | Vectors to search with. |
| `dsl_type` | Type of `dsl` (Data Search Language) field:
 0: "Dsl"
 1: "BoolExprV1"
  |

Conduct a vector search
-----------------------

Search vectors with Milvus. To search in a specific [partition](glossary.md#Partition), specify the list of partition names.

Milvus supports setting consistency level specifically for a search. The example in this topic sets the consistency level as `Strong`. You can also set the consistency level as `Bounded`, `Session` or `Eventually`. See [一致性](consistency.md) for more information about the four consistency levels in Milvus.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
results = collection.search(
	data=[[0.1, 0.2]], 
	anns_field="book_intro", 
	param=search_params,
	limit=10, 
	expr=None,
	output_fields=['title'] # set the names of the fields you want to retrieve from the search result.
	consistency_level="Strong"
)

# get the IDs of all returned hits
results[0].ids

# get the distances to the query vector from all returned hits
results[0].distances

# get the value of an output field specified in the search request.
# vector fields are not supported yet.
hit = results[0][0]
hit.entity.get('title')

```

```
const results = await milvusClient.search({
  collection_name: "book",
  expr: "",
  vectors: [[0.1, 0.2]],
  search_params: searchParams,
  vector_type: 101,    // DataType.FloatVector
});

```

```
searchResult, err := milvusClient.Search(
	context.Background(),                    // ctx
	"book",                                  // CollectionName
	[]string{},                              // partitionNames
	"",                                      // expr
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
List<String> search_output_fields = Arrays.asList("book_id");
List<List<Float>> search_vectors = Arrays.asList(Arrays.asList(0.1f, 0.2f));

SearchParam searchParam = SearchParam.newBuilder()
		.withCollectionName("book")
		.withConsistencyLevel(ConsistencyLevelEnum.STRONG)
		.withMetricType(MetricType.L2)
		.withOutFields(search_output_fields)
		.withTopK(SEARCH_K)
		.withVectors(search_vectors)
		.withVectorFieldName("book_intro")
		.withParams(SEARCH_PARAM)
		.build();
R<SearchResults> respSearch = milvusClient.search(searchParam);

```

```
# Follow the previous step.

```

```
# Follow the previous step.

```

| Parameter | Description |
| --- | --- |
| `data` | Vectors to search with. |
| `anns_field` | Name of the field to search on. |
| `param` | Search parameter(s) specific to the index. See [向量索引](index.md) for more information. |
| `offset` | Number of results to skip in the returned set. The sum of this value and `limit` should be less than 16384. |
| `limit` | Number of the most similar results to return. The sum of this value and `offset` should be less than 16384. |
| `expr` | Boolean expression used to filter attribute. See [布尔表达式规则](boolean.md) for more information. |
| `partition_names` (optional) | List of names of the partition to search in. |
| `output_fields` (optional) | Name of the field to return. Vector field is not supported in current release. |
| `timeout` (optional) | A duration of time in seconds to allow for RPC. Clients wait until server responds or error occurs when it is set to None. |
| `round_decimal` (optional) | Number of decimal places of returned distance. |
| `consistency_level` (optional) | Consistency level of the search. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to search in. |
| `search_params` | Parameters (as an object) used for search. |
| `vectors` | Vectors to search with. |
| `vector_type` | Pre-check of binary or float vectors. `100` for binary vectors and `101` for float vectors. |
| `partition_names` (optional) | List of names of the partition to search in. |
| `expr` (optional) | Boolean expression used to filter attribute. See [布尔表达式规则](boolean.md) for more information. |
| `output_fields` (optional) | Name of the field to return. Vector field is not supported in current release. |

| Parameter | Description | Options |
| --- | --- | --- |
| `ctx` | Context to control API invocation process. | N/A |
| `CollectionName` | Name of the collection to load. | N/A |
| `partitionNames` | List of names of the partitions to load. All partitions will be searched if it is left empty. | N/A |
| `expr` | Boolean expression used to filter attribute. | See [布尔表达式规则](boolean.md) for more information. |
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
| `Vectors` | Vectors to search with. | N/A |
| `VectorFieldName` | Name of the field to search on. | N/A |
| `Expr` | Boolean expression used to filter attribute. | See [布尔表达式规则](boolean.md) for more information. |
| `ConsistencyLevel` | The consistency level used in the query. | `STRONG`, `BOUNDED`, and`EVENTUALLY`. |

检查最相似向量的主键值和它们之间的距离。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
results[0].ids
results[0].distances

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

在搜索完成后，释放在Milvus中加载的集合以减少内存消耗。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
collection.release()

```

```
await milvusClient.releaseCollection({  collection_name: "book",});

```

```
err := milvusClient.ReleaseCollection(
    context.Background(),                            // ctx
    "book",                                          // CollectionName
)
if err != nil {
    log.Fatal("failed to release collection:", err.Error())
}

```

```
milvusClient.releaseCollection(
		ReleaseCollectionParam.newBuilder()
                .withCollectionName("book")
                .build());

```

```
release -c book

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/collection/load' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

限制
--

| Feature | Maximum limit |
| --- | --- |
| Length of a collection name | 255 characters |
| Number of partitions in a collection | 4,096 |
| Number of fields in a collection | 256 |
| Number of shards in a collection | 256 |
| Dimensions of a vector | 32,768 |
| Top K | 16,384 |
| Target input vectors | 16,384 |

What's next
-----------

* Learn more basic operations of Milvus:

	+ [Query vectors](query.md)
	+ [Conduct a hybrid search](hybridsearch.md)
	+ [Search with Time Travel](timetravel.md)
* Explore API references for Milvus SDKs:

	+ [PyMilvus API reference](/api-reference/pymilvus/v2.2.8/About.md)
	+ [Node.js API reference](/api-reference/node/v2.2.x/About.md)
	+ [Go API reference](/api-reference/go/v2.2.2/About.md)
	+ [Java API reference](/api-reference/java/v2.2.5/About.md)
