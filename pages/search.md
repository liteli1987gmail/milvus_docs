
Milvus搜索实体
===

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
curl -X 'POST' 
  'http://localhost:9091/api/v1/collection/load' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

准备搜索参数
------

准备适合你的搜索场景的参数。以下示例定义搜索将使用欧几里得距离计算距离，并从由IVF_FLAT索引构建的最近的10个聚类中检索向量。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
search_params = {"metric_type": "L2", "params": {"nprobe": 10}, "offset": 5}

```

```bash
const searchParams = {
  anns_field: "book_intro",
  topk: "2",
  metric_type: "L2",
  params: JSON.stringify({ nprobe: 10 }),
};

```

```bash
sp, _ := entity.NewIndexFlatSearchParam( // NewIndex*SearchParam func
	10,                                  // searchParam
)

```

```bash
final Integer SEARCH_K = 2;                       // TopK
final String SEARCH_PARAM = "{"nprobe":10, ”offset”:5}";    // Params

```

```bash
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
| 参数 | 描述 |
| --- | --- |
| `metric_type` | 用于衡量向量相似度的指标类型。有关更多信息，请参见[相似度指标](metric.md)。 |
| `params` | 指标特定的搜索参数，详见[向量索引](index.md)。 |
| `offset` | 此词典中的偏移量。`offset`和`limit`值之和应小于65535。 |
| `ignore_growing` | 是否忽略相似性搜索中的新片段。默认值为`False`，表示搜索包括新片段。 |

| 参数 | 描述 |
| --- | --- |
| `anns_field` | 要搜索的字段名称。 |
| `topk` | 返回的最相似结果的数量。 |
| `metric_type` | 用于衡量向量相似度的指标类型。有关更多信息，请参见[相似度指标](metric.md)。 |
| `params` | 指标特定的搜索参数，详见[向量索引](index.md)。 |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `NewIndex*SearchParam func` | 根据不同的索引类型创建`entity.SearchParam`的函数。 | 对于浮点向量：`NewIndexFlatSearchParam` (FLAT)   或  `NewIndexIvfFlatSearchParam` (IVF_FLAT)   或 `NewIndexIvfSQ8SearchParam` (IVF_SQ8) 或 `NewIndexIvfPQSearchParam` (RNSG) 或 `NewIndexRNSGSearchParam` (HNSW) 或  `NewIndexHNSWSearchParam` (HNSW) 或  `NewIndexANNOYSearchParam` (ANNOY) 或  `NewIndexRHNSWFlatSearchParam` (RHNSW_FLAT) 或  `NewIndexRHNSW_PQSearchParam` (RHNSW_PQ) 或  `NewIndexRHNSW_SQSearchParam` (RHNSW_SQ)        对于二进制向量：`NewIndexBinFlatSearchParam` (BIN_FLAT) 或  `NewIndexBinIvfFlatSearchParam` (BIN_IVF_FLAT) |
| `searchParam` | 指标特定的搜索参数。 | 详见[向量索引](index.md)。 |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `TopK` | 返回的最相似结果的数量。 | N/A |
| `Params` | 指标特定的搜索参数。 | 详见[向量索引](index.md)。 |

| 选项 | 完整名称 | 描述 |
| --- | --- | --- |
| --help | n/a | 显示如何使用命令的帮助信息。 |

| 参数 | 描述 |
| --- | --- |
| `output_fields`(可选) | 要返回的字段名称。当前版本不支持向量字段。 |
| `anns_field` | 要搜索的字段名称。 |
| `topk` | 返回的最相似结果的数量。 |
| `params` | 指标特定的搜索参数。详见[向量索引](index.md)。 |
| `metric_type` | 用于衡量向量相似度的指标类型。详见[相似度指标](metric.md)。 |
| `round_decimal` (可选) | 返回的距离的小数位数。 |
| `Vectors` | 要搜索的向量。 |
| `dsl_type` | `dsl`（数据搜索语言）字段的类型：0：“Dsl” 1：“BoolExprV1” |

# 进行向量搜索

使用Milvus执行向量搜索。若要在特定的[分区（partition）](glossary.md#Partition)中进行搜索，请指定分区名称列表。

Milvus支持为搜索设置一致性级别。此主题中的示例将一致性级别设置为“Strong”。您也可以将一致性级别设置为“Bounded”、“Session”或“Eventually”。有关Milvus中四个一致性级别的更多信息，请参见[一致性](consistency.md)。


[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
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

```bash
const results = await milvusClient.search({
  collection_name: "book",
  expr: "",
  vectors: [[0.1, 0.2]],
  search_params: searchParams,
  vector_type: 101,    // DataType.FloatVector
});

```

```bash
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

```bash
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

```bash
# Follow the previous step.

```

```bash
# Follow the previous step.

```
| 参数 | 描述 |
| --- | --- |
| `data` | 要搜索的向量。 |
| `anns_field` | 要搜索的字段名称。 |
| `param` | 指标特定的搜索参数。详见[向量索引](index.md)。 |
| `offset` | 返回集合中结果的偏移量。此值与`limit`之和应小于16384。 |
| `limit` | 要返回的最相似结果的数量。此值与偏移值之和应小于16384。 |
| `expr` | 用于过滤属性的布尔表达式。详见[布尔表达式规则](boolean.md)。 |
| `partition_names` (可选) | 要搜索的分区名称列表。 |
| `output_fields` (可选) | 要返回的字段名称。当前版本不支持向量字段。 |
| `timeout` (可选) | 允许等待RPC执行的持续时间（以秒为单位）。当其设置为 None 时，客户端会等待服务器响应或发生错误。 |
| `round_decimal` (可选) | 返回的距离的小数位数。 |
| `consistency_level` (可选) | 要搜索的一致性级别。 |

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要搜索的数据集名称。 |
| `search_params` | 用于搜索的参数（作为一个对象）。 |
| `vectors` | 要搜索的向量。 |
| `vector_type` | 二进制或浮点向量的预检测。`100`表示二进制向量，`101`表示浮点向量。 |
| `partition_names` (可选) | 要搜索的分区名称列表。 |
| `expr` (可选) | 用于过滤属性的布尔表达式。详见[布尔表达式规则](boolean.md)。 |
| `output_fields` (可选) | 要返回的字段名称。当前版本不支持向量字段。 |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `ctx` | 控制API调用过程的上下文。 | N/A |
| `CollectionName` | 要加载的集合名称。 | N/A |
| `partitionNames` | 要加载的分区名称列表。如果为空，则将搜索所有分区。 | N/A |
| `expr` | 用于过滤属性的布尔表达式。 | 详见[布尔表达式规则](boolean.md)。 |
| `output_fields` | 要返回的字段名称。 | 当前版本不支持向量字段。 |
| `vectors` | 要搜索的向量。 | N/A |
| `vectorField` | 要搜索的字段名称。 | N/A |
| `metricType` | 用于搜索的指标类型。 | 此参数必须与用于索引构建的指标类型相同。 |
| `topK` | 要返回的最相似结果的数量。 | N/A |
| `sp` | 指标特定的entity.SearchParam。 | N/A |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `CollectionName` | 要加载的集合名称。 | N/A |
| `MetricType` | 用于搜索的指标类型。 | 此参数必须与用于索引构建的指标类型相同。 |
| `OutFields` | 要返回的字段名称。 | 当前版本不支持向量字段。 |
| `Vectors` | 要搜索的向量。 | N/A |
| `VectorFieldName` | 要搜索的字段名称。 | N/A |
| `Expr` | 用于过滤属性的布尔表达式。 | 详见[布尔表达式规则](boolean.md)。 |
| `ConsistencyLevel` | 查询中使用的一致性级别。 | `STRONG`，`BOUNDED`和`EVENTUALLY`。 |

检查最相似向量的主键值和它们之间的距离。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
results[0].ids
results[0].distances

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

在搜索完成后，释放在Milvus中加载的集合以减少内存消耗。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
collection.release()

```

```bash
await milvusClient.releaseCollection({  collection_name: "book",});

```

```bash
err := milvusClient.ReleaseCollection(
    context.Background(),                            // ctx
    "book",                                          // CollectionName
)
if err != nil {
    log.Fatal("failed to release collection:", err.Error())
}

```

```bash
milvusClient.releaseCollection(
		ReleaseCollectionParam.newBuilder()
                .withCollectionName("book")
                .build());

```

```bash
release -c book

```

```bash
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/collection/load' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

限制
--
| 功能 | 最大限制 |
| --- | --- |
| 集合名称长度 | 255个字符 |
| 集合中的分区数量 | 4,096 |
| 集合中的字段数量 | 256 |
| 集合中的分片数量 | 256 |
| 向量的维度 | 32,768 |
| Top K值 | 16,384 |
| 目标输入向量数量 | 16,384 |

下一步

* 学习更多关于Milvus的基本操作：
  	+ [查询向量](query.md)
	+ [进行混合搜索](hybridsearch.md)
	+ [使用时间旅行搜索](timetravel.md)
* 探索Milvus SDK的API参考：
	+ [PyMilvus API参考](https://milvus.io/api-reference/pymilvus/v2.2.x/About.md)
	+ [Node.js API参考](https://milvus.io/api-reference/node/v2.2.x/About.md)
	+ [Go API参考](https://milvus.io/api-reference/go/v2.2.x/About.md)
	+ [Java API参考](https://milvus.io/api-reference/java/v2.2.x/About.md)