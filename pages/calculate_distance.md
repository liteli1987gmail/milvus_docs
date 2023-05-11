计算向量之间的距离
=========

本主题介绍了如何使用 Milvus 计算向量之间的距离。

Milvus 基于向量的距离计算搜索最相似的向量。反之，您也可以使用 Milvus 计算向量之间的距离，使用适合特定场景的距离度量。更多信息请参见[相似度度量](metric.md)。

以下示例模拟了您想要计算集合中向量与其他向量之间距离的情况。

准备向量
----

准备用于计算的向量。

Vectors to be calculated must agree in vector type and dimension.

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
vectors_left = {
    "ids": [0, 1], 
    "collection": "book", 
    "partition": "_default", 
    "field": "book_intro"
}
import random
external_vectors = [[random.random() for _ in range(2)] for _ in range(4)]
vectors_right = {"float_vectors": external_vectors}

```

```
// Node User Guide will be ready soon.

```

```
// GO User Guide will be ready soon.

```

```
// Java User Guide will be ready soon.

```

```
// CLI User Guide will be ready soon.

```

```
vectors_left='{
  "dim": 2,
  "ids": {
    "id_array": [1,2],
    "collection_name": "book",
    "partition_names": ["_default"],
    "field_name": "book_intro"
  }
}'
vectors_right='{
  "dim": 2,
  "vectors": [1,2,3,4,5,6,7,8] # The numbers in the list will be automatically split into four vectors. 
}'

```

| Parameter | Description |
| --- | --- |
| `vectors_left` and `vectors_right` | Vectors on the left and right side of the operator. Dict type that can be represented as `{"ids": [primary_key_1, primary_key_2, ... primary_key_n], "collection": "collection_name", "partition": "partition_name", "field": "vector_field_name"}`, `{"float_vectors": [[1.0, 2.0], [3.0, 4.0], ... [9.0, 10.0]]}`, or `{"bin_vectors": [b'', b'N', ... b'Ê']}`. |
| `ids` | List of primary key of entities that in the collection. |
| `collection` | Name of the collection that holds the entities. |
| `partition` | Name of the partition that holds the entities. |
| `field` | Name of the vector field in the collection. |
| `float_vectors` or `bin_vectors` | Type of the vectors. |

| Parameter | Description | Option |
| --- | --- | --- |
| `dim` | Dimension of the vector. | N/A |
| `id_array` | List of the primary keys of entities in the collection. | N/A |
| `collection_name` | Name of the collection that holds the entities. | N/A |
| `partition_names` | Names of the partitions that hold the entities. | N/A |
| `field_name` | Name of the vector field in the collection. | N/A |
| `vectors` | Temporarily only floating-point vectors are supported. | N/A |

准备计算参数
------

指定用于计算的参数。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
params = {
    "metric": "IP", 
    "dim": 2
}

```

```
// Node User Guide will be ready soon.

```

```
// GO User Guide will be ready soon.

```

```
// Java User Guide will be ready soon.

```

```
// CLI User Guide will be ready soon.

```

```
params='[
  {"key": "metric", "value": "IP"}
]'

```

| Parameter | Description | Option |
| --- | --- | --- |
| `params` | Calculation parameters. | N/A |
| `metric` | Metric types used for calculation. | For floating-point vectors:
 * `L2` (欧几里得距离)

* `IP` (内积)

 For binary vectors:
 * `JACCARD` (Jaccard 距离)

* `TANIMOTO` (Tanimoto 距离)

* `HAMMING` (Hamming 距离)

* `SUPERSTRUCTURE` (Superstructure)

* `SUBSTRUCTURE` (Substructure)
 |
| `dim` | Dimension of the vector. | N/A |

| Parameter | Description | Option |
| --- | --- | --- |
| `metric` | Metric types used for calculation. | For floating-point vectors:
 * `L2` (Euclidean distance)

* `IP` (Inner product)
 |

(Optional) Load collection
--------------------------

如果在Milvus中计算集合中的向量，必须先将集合加载到内存中。

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

计算向量距离
------

根据提供的向量和参数计算向量之间的距离。

```
from pymilvus import utility
results = utility.calc_distance(
    vectors_left=vectors_left, 
    vectors_right=vectors_right, 
    params=params
)
print(results)

```

```
// Node User Guide will be ready soon.

```

```
// GO User Guide will be ready soon.

```

```
// Java User Guide will be ready soon.

```

```
// CLI User Guide will be ready soon.

```

```
curl -X 'GET' \
  'http://localhost:9091/api/v1/distance' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d "{
    \"op_left\": $vectors_left,
    \"op_right\": $vectors_right,
    \"params\": $params
  }"

```

Output:

```
{"status":{},"Array":{"FloatDist":{"data":[3,7,11,15,4,10,16,22]}}}

```

接下来是什么
------

* 了解更多 Milvus 的基本操作：
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
	+ [使用时间旅行搜索](timetravel.md)
