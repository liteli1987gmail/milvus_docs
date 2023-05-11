本主题介绍如何在向量搜索期间使用时光旅行（Time Travel）功能。

Milvus为所有数据插入和删除操作维护一个时间线。这使用户可以在搜索中指定时间戳，在指定时间点检索数据视图，而不需要付出大量时间和精力进行数据回滚维护。

默认情况下，Milvus允许时间旅行跨度为432,000秒（120小时）。您可以在`common.retentionDuration`中配置此参数。

准备工作
--------

以下示例代码演示了插入数据之前的步骤。

如果您在现有的Milvus实例中使用自己的数据集，则可以继续执行下一步。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
connections.connect("default", host='localhost', port='19530')
collection_name = "test_time_travel"
schema = CollectionSchema([
  FieldSchema("pk", DataType.INT64, is_primary=True),
  FieldSchema("example_field", dtype=DataType.FLOAT_VECTOR, dim=2)
])
collection = Collection(collection_name, schema)

```

```
const { MilvusClient } =require("@zilliz/milvus2-sdk-node");
const milvusClient = new MilvusClient("localhost:19530");
const params = {
  collection_name: "test_time_travel",
  fields: [{
      name: "example_field",
      description: "",
      data_type: 101, // DataType.FloatVector
      type_params: {
        dim: "2",
      },
    },
    {
      name: "pk",
      data_type: 5, //DataType.Int64
      is_primary_key: true,


[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
data = [
  [i for i in range(10, 20)],
  [[random.random() for _ in range(2)] for _ in range(9)],
]
data[1].append([1.0,1.0])
batch2 = collection.insert(data)

```

```
const entities2 = Array.from({
  length: 9
}, (v, k) => ({
  "example_field": Array.from({
    length: 2
  }, () => Math.random()),
  "pk": k + 10,
}));
entities2.push({
  "pk": 19,
  "example_field": [1.0, 1.0],
});
const batch2 = await milvusClient.insert({
  collection_name: "test_time_travel",
  fields_data: entities2,
});

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
import -c test_time_travel https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/user_guide/search_with_timetravel_2.csv
Reading file from remote URL.
Reading csv rows...  [####################################]  100%
Column names are ['pk', 'example_field']
Processed 11 lines.

Inserted successfully.

--------------------------  ------------------
Total insert entities:                      10
Total collection entities:                  20
Milvus timestamp:           430390435713122310
--------------------------  ------------------

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/entities' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "fields_data": [
      {
        "field_name": "pk",
        "type": 5,
        "field": [
          10,11,12,13,14,15,16,17,18,19
        ]
      },
      {
        "field_name": "example_field",
        "type": 101,
        "field": [
          [11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[17,12],[18,12],[19,12],[1,1]
        ]
      }
    ],
    "num_rows": 10
  }'

```

Output:

```
{
  "status":{},
  "IDs":{"IdField":{"IntId":{"data":[10,11,12,13,14,15,16,17,18,19]}}},
  "succ_index":[0,1,2,3,4,5,6,7,8,9],
  "insert_cnt":10,
  "timestamp":434575834238943233
}

```
使用指定的时间戳搜索
---------------------------------

加载集合并使用第一批数据批次的时间戳搜索目标数据。使用指定的时间戳，Milvus仅在时间戳指示的时间点检索数据视图。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
collection.load()
search_param = {
  "data": [[1.0, 1.0]],
  "anns_field": "example_field",
  "param": {"metric_type": "L2"},
  "limit": 10,
  "travel_timestamp": batch1.timestamp,
}
res = collection.search(**search_param)
res[0].ids

```

```
await milvusClient.loadCollection({
  collection_name: "test_time_travel",
});
const res = await milvusClient.search({
  collection_name: "test_time_travel",
  vectors: [
    [1.0, 1.0]
  ],
  travel_timestamp: batch1.timestamp,
  search_params: {
    anns_field: "example_field",
    topk: "10",
    metric_type: "L2",
    params: JSON.stringify({
      nprobe: 10
    }),
  },
  vector_type: 101, // DataType.FloatVector,
});
console.log(res1.results)

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
search
Collection name (test_collection_query, test_time_travel): test_time_travel
The vectors of search data (the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a CSV file without headers): [[1.0, 1.0]]
The vector field used to search of collection (example_field): example_field
The specified number of decimal places of returned distance [-1]: 
The max number of returned record, also known as topk: 10
The boolean expression used to filter attribute []: 
The names of partitions to search (split by "," if multiple) ['_default'] []: 
Timeout []: 
Guarantee Timestamp(It instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date) [0]: 
Travel Timestamp(Specify a timestamp in a search to get results based on a data view) [0]: 430390410783752199

```

```
# Load the collection:
curl -X 'POST' \
  'http://localhost:9091/api/v1/collection/load' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel"
  }'

# Conduct a vector search:
curl -X 'POST' \
  'http://localhost:9091/api/v1/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "output_fields": ["pk"],
    "search_params": [
      {"key": "anns_field", "value": "example_field"},
      {"key": "topk", "value": "10"},
      {"key": "params", "value": "{\"nprobe\": 10}"},
      {"key": "metric_type", "value": "L2"}
    ],
    "travel_timestamp": 434575831766925313,
    "vectors": [ [10,10] ],
    "dsl_type": 1
  }'

```

As shown below, the target data itself and other data inserted later are not returned as results.

```
[8, 7, 4, 2, 5, 6, 9, 3, 0, 1]

```

```
[8, 7, 4, 2, 5, 6, 9, 3, 0, 1]

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
Search results:

No.1:
+---------+------+------------+-----------+
|   Index |   ID |   Distance |     Score |
+=========+======+============+===========+
|       0 |    2 |  0.0563737 | 0.0563737 |
+---------+------+------------+-----------+
|       1 |    5 |  0.122474  | 0.122474  |
+---------+------+------------+-----------+
|       2 |    3 |  0.141737  | 0.141737  |
+---------+------+------------+-----------+
|       3 |    8 |  0.331008  | 0.331008  |
+---------+------+------------+-----------+
|       4 |    0 |  0.618705  | 0.618705  |
+---------+------+------------+-----------+
|       5 |    1 |  0.676788  | 0.676788  |
+---------+------+------------+-----------+
|       6 |    9 |  0.69871   | 0.69871   |
+---------+------+------------+-----------+
|       7 |    6 |  0.706456  | 0.706456  |
+---------+------+------------+-----------+
|       8 |    4 |  0.956929  | 0.956929  |
+---------+------+------------+-----------+
|       9 |    7 |  1.19445   | 1.19445   |
+---------+------+------------+-----------+

```

Output:

```
{
  "status":{},
  "results":{
    "num_queries":1,
    "top_k":10,
    "fields_data":[
      {
        "type":5,
        "field_name":"pk",
        "Field":{"Scalars":{"Data":{"LongData":{"data":[9,8,7,6,5,4,3,2,1,0]}}}},
        "field_id":100
      }
    ],
    "scores":[81,82,85,90,97,106,117,130,145,162],
    "ids":{"IdField":{"IntId":{"data":[9,8,7,6,5,4,3,2,1,0]}}},
    "topks":[10]
  },
  "collection_name":"test_time_travel"
}

```

如果您没有指定时间戳或使用第二批数据的时间戳进行指定，Milvus将返回两个批次的结果。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
batch2.timestamp
428828283406123011
search_param = {
    "data": [[1.0, 1.0]],
    "anns_field": "example_field",
    "param": {"metric_type": "L2"},
    "limit": 10,
    "travel_timestamp": batch2.timestamp,
}
res = collection.search(**search_param)
res[0].ids
[19, 10, 8, 7, 4, 17, 2, 5, 13, 15]

```

```
batch2.timestamp
428828283406123011
const res2 = await milvusClient.search({
  collection_name: "test_time_travel",
  vectors: [
    [1.0, 1.0]
  ],
  travel_timestamp: batch2.timestamp,
  search_params: {
    anns_field: "example_field",
    topk: "10",
    metric_type: "L2",
    params: JSON.stringify({
      nprobe: 10
    }),
  },
  vector_type: 101, // DataType.FloatVector,
});
console.log(res2.results)

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
search 
Collection name (test_collection_query, test_time_travel): test_time_travel
The vectors of search data (the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a CSV file without headers): [[1.0, 1.0]]
The vector field used to search of collection (example_field): example_field
The specified number of decimal places of returned distance [-1]: 
The max number of returned record, also known as topk: 10
The boolean expression used to filter attribute []: 
The names of partitions to search (split by "," if multiple) ['_default'] []: 
Timeout []: 
Guarantee Timestamp(It instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date) [0]: 
Travel Timestamp(Specify a timestamp in a search to get results based on a data view) [0]: 
Search results:

No.1:
+---------+------+------------+------------+
|   Index |   ID |   Distance |      Score |
+=========+======+============+============+
|       0 |   19 | 0          | 0          |
+---------+------+------------+------------+
|       1 |   12 | 0.00321393 | 0.00321393 |
+---------+------+------------+------------+
|       2 |    2 | 0.0563737  | 0.0563737  |
+---------+------+------------+------------+
|       3 |    5 | 0.122474   | 0.122474   |
+---------+------+------------+------------+
|       4 |    3 | 0.141737   | 0.141737   |
+---------+------+------------+------------+
|       5 |   10 | 0.238646   | 0.238646   |
+---------+------+------------+------------+
|       6 |    8 | 0.331008   | 0.331008   |
+---------+------+------------+------------+
|       7 |   18 | 0.403166   | 0.403166   |
+---------+------+------------+------------+
|       8 |   13 | 0.508617   | 0.508617   |
+---------+------+------------+------------+
|       9 |   11 | 0.531529   | 0.531529   |
+---------+------+------------+------------+

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "output_fields": ["pk"],
    "search_params": [
      {"key": "anns_field", "value": "example_field"},
      {"key": "topk", "value": "10"},
      {"key": "params", "value": "{\"nprobe\": 10}"},
      {"key": "metric_type", "value": "L2"}
    ],
    "vectors": [ [11,11] ],
    "dsl_type": 1
  }'

```

Output:

```
{
  "status":{},
  "results":{
    "num_queries":1,
    "top_k":10,
    "fields_data":[
      {
        "type":5,
        "field_name":"pk",
        "Field":{"Scalars":{"Data":{"LongData":{"data":[10,11,12,13,14,15,16,17,18,9]}}}},
        "field_id":100
      }
    ],
    "scores":[1,2,5,10,17,26,37,50,65,101],
    "ids":{"IdField":{"IntId":{"data":[10,11,12,13,14,15,16,17,18,9]}}},
    "topks":[10]
  },
  "collection_name":"test_time_travel"
}

```

生成搜索时间戳
-------

如果之前的时间戳没有记录，Milvus允许您使用现有的时间戳、Unix Epoch时间或日期时间生成一个时间戳。

以下示例模拟了一次意外删除操作，并演示了如何在删除之前生成时间戳和如何使用它进行搜索。

在删除之前基于日期时间或Unix Epoch时间生成时间戳。

```
import datetime
datetime = datetime.datetime.now()
from pymilvus import utility
pre_del_timestamp = utility.mkts_from_datetime(datetime)

```

```
const {  datetimeToHybrids } = require("@zilliz/milvus2-sdk-node/milvus/utils/Format");
const datetime = new Date().getTime()
const pre_del_timestamp = datetimeToHybrids(datetime)

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
calc mkts_from_unixtime -e 1641809375
430390476800000000

```

```
# This function is not supported. It is suggested to use Milvus_CLI.

```

删除部分数据以模拟意外删除操作。

```
expr = "pk in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]"
collection.delete(expr)

```

```
const expr = "pk in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]"
await milvusClient.deleteEntities({
  collection_name: "test_time_travel",
  expr: expr,
});

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
delete entities -c test_time_travel
The expression to specify entities to be deleted, such as "film_id in [ 0, 1 ]": pk in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
You are trying to delete the entities of collection. This action cannot be undone!

Do you want to continue? [y/N]: y
(insert count: 0, delete count: 10, upsert count: 0, timestamp: 430390494161534983)

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/entities' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "expr": "pk in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]"
  }'

```

Output:

```
{
  "status":{},
  "IDs":{"IdField":{"IntId":{"data":[0,2,4,6,8,10,12,14,16,18]}}},
  "delete_cnt":10,
  "timestamp": 434575874068316161
}

```

如下所示，如果您在不指定时间戳的情况下搜索，则不会返回已删除的实体。

```
search_param = {
    "data": [[1.0, 1.0]],
    "anns_field": "example_field",
    "param": {"metric_type": "L2"},
    "limit": 10,
}
res = collection.search(**search_param)
res[0].ids

```

```
const res3 = await milvusClient.search({
  collection_name: "test_time_travel",
  vectors: [
    [1.0, 1.0]
  ],
  search_params: {
    anns_field: "example_field",
    topk: "10",
    metric_type: "L2",
    params: JSON.stringify({
      nprobe: 10
    }),
  },
  vector_type: 101, // DataType.FloatVector,
});
console.log(res3.results)

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
search 
Collection name (test_collection_query, test_time_travel): test_time_travel
The vectors of search data (the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a CSV file without headers): [[1.0, 1.0]]
The vector field used to search of collection (example_field): example_field
The specified number of decimal places of returned distance [-1]: 
The max number of returned record, also known as topk: 10
The boolean expression used to filter attribute []: 
The names of partitions to search (split by "," if multiple) ['_default'] []: 
Timeout []: 
Guarantee Timestamp(It instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date) [0]: 
Travel Timestamp(Specify a timestamp in a search to get results based on a data view) [0]: 
Search results:

No.1:
+---------+------+------------+----------+
|   Index |   ID |   Distance |    Score |
+=========+======+============+==========+
|       0 |   19 |   0        | 0        |
+---------+------+------------+----------+
|       1 |    5 |   0.122474 | 0.122474 |
+---------+------+------------+----------+
|       2 |    3 |   0.141737 | 0.141737 |
+---------+------+------------+----------+
|       3 |   13 |   0.508617 | 0.508617 |
+---------+------+------------+----------+
|       4 |   11 |   0.531529 | 0.531529 |
+---------+------+------------+----------+
|       5 |   17 |   0.593702 | 0.593702 |
+---------+------+------------+----------+
|       6 |    1 |   0.676788 | 0.676788 |
+---------+------+------------+----------+
|       7 |    9 |   0.69871  | 0.69871  |
+---------+------+------------+----------+
|       8 |    7 |   1.19445  | 1.19445  |
+---------+------+------------+----------+
|       9 |   15 |   1.53964  | 1.53964  |
+---------+------+------------+----------+

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "output_fields": ["pk"],
    "search_params": [
      {"key": "anns_field", "value": "example_field"},
      {"key": "topk", "value": "10"},
      {"key": "params", "value": "{\"nprobe\": 10}"},
      {"key": "metric_type", "value": "L2"}
    ],
    "vectors": [ [11,11] ],
    "dsl_type": 1
  }'

```

Output:

```
{
  "status":{},
  "results":{
    "num_queries":1,
    "top_k":10,
    "fields_data":[
      {
        "type":5,
        "field_name":"pk",
        "Field":{"Scalars":{"Data":{"LongData":{"data":[11,13,15,17,9,7,5,3,1,19]}}}},
        "field_id":100
      }
    ],
    "scores":[2,10,26,50,101,109,125,149,181,200],
    "ids":{"IdField":{"IntId":{"data":[11,13,15,17,9,7,5,3,1,19]}}},
    "topks":[10]
  },
  "collection_name":"test_time_travel"
}

```

使用删除之前的时间戳进行搜索。Milvus从删除之前的数据中检索实体。

```
search_param = {
    "data": [[1.0, 1.0]],
    "anns_field": "example_field",
    "param": {"metric_type": "L2"},
    "limit": 10,
    "travel_timestamp": pre_del_timestamp,
}
res = collection.search(**search_param)
res[0].ids

```

```
const res4 = await milvusClient.search({
  collection_name: "test_time_travel",
  vectors: [
    [1.0, 1.0]
  ],
  travel_timestamp: pre_del_timestamp,
  search_params: {
    anns_field: "example_field",
    topk: "10",
    metric_type: "L2",
    params: JSON.stringify({
      nprobe: 10
    }),
  },
  vector_type: 101, // DataType.FloatVector,
});
console.log(res4.results)

```

```
// This function is under active development on the GO client.

```

```
// Java User Guide will be ready soon.

```

```
search 
Collection name (test_collection_query, test_time_travel): test_time_travel
The vectors of search data (the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a CSV file without headers): [[1.0, 1.0]]
The vector field used to search of collection (example_field): example_field
The specified number of decimal places of returned distance [-1]: 
The max number of returned record, also known as topk: 10
The boolean expression used to filter attribute []: 
The names of partitions to search (split by "," if multiple) ['_default'] []: 
Timeout []: 
Guarantee Timestamp(It instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date) [0]: 
Travel Timestamp(Specify a timestamp in a search to get results based on a data view) [0]: 430390476800000000
Search results:

No.1:
+---------+------+------------+------------+
|   Index |   ID |   Distance |      Score |
+=========+======+============+============+
|       0 |   19 | 0          | 0          |
+---------+------+------------+------------+
|       1 |   12 | 0.00321393 | 0.00321393 |
+---------+------+------------+------------+
|       2 |    2 | 0.0563737  | 0.0563737  |
+---------+------+------------+------------+
|       3 |    5 | 0.122474   | 0.122474   |
+---------+------+------------+------------+
|       4 |    3 | 0.141737   | 0.141737   |
+---------+------+------------+------------+
|       5 |   10 | 0.238646   | 0.238646   |
+---------+------+------------+------------+
|       6 |    8 | 0.331008   | 0.331008   |
+---------+------+------------+------------+
|       7 |   18 | 0.403166   | 0.403166   |
+---------+------+------------+------------+
|       8 |   13 | 0.508617   | 0.508617   |
+---------+------+------------+------------+
|       9 |   11 | 0.531529   | 0.531529   |
+---------+------+------------+------------+

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "test_time_travel",
    "output_fields": ["pk"],
    "search_params": [
      {"key": "anns_field", "value": "example_field"},
      {"key": "topk", "value": "10"},
      {"key": "params", "value": "{\"nprobe\": 10}"},
      {"key": "metric_type", "value": "L2"}
    ],
    "travel_timestamp": 434284782724317186,
    "vectors": [ [10,10] ],
    "dsl_type": 1
  }'

```

Output:

```
{
  "status":{},
  "results":{
    "num_queries":1,
    "top_k":10,
    "fields_data":[
      {
        "type":5,
        "field_name":"pk",
        "Field":{"Scalars":{"Data":{"LongData":{"data":[11,12,13,14,15,16,17,18,10,9]}}}},
        "field_id":100}
    ],
    "scores":[5,8,13,20,29,40,53,68,81,82],
    "ids":{"IdField":{"IntId":{"data":[11,12,13,14,15,16,17,18,10,9]}}},
    "topks":[10]
  },
  "collection_name":"test_time_travel"
}

```

下一步操作
-----

* 了解Milvus的更多基本操作：

	+ [查询向量](query.md)
	+ [进行混合搜索](hybridsearch.md)

* 探索Milvus SDK的API参考：

	+ [PyMilvus API参考](/api-reference/pymilvus/v2.2.8/About.md)
	+ [Node.js API参考](/api-reference/node/v2.2.x/About.md)
	+ [Go API参考](/api-reference/go/v2.2.2/About.md)
	+ [Java API参考](/api-reference/java/v2.2.5/About.md)
