计算向量之间的距离
=========

本主题介绍了如何使用 Milvus 计算向量之间的距离。

Milvus 基于向量的距离计算搜索最相似的向量。反之，您也可以使用 Milvus 计算向量之间的距离，使用适合特定场景的距离度量。更多信息请参见[相似度度量](metric.md)。

以下示例模拟了您想要计算集合中向量与其他向量之间距离的情况。

准备向量
----

准备用于计算的向量。

需计算的向量在向量类型和维度上必须一致。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
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

```python
// Node User Guide will be ready soon.

```

```python
// GO User Guide will be ready soon.

```

```python
// Java User Guide will be ready soon.

```

```python
// CLI User Guide will be ready soon.

```

```python
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

以下是经过整理后的表格：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `vectors_left` 和 `vectors_right` | 运算符左边和右边的向量。字典格式，可表示为 `{"ids": [主键1，主键2，...主键n]，"collection": "collection_name"，"partition":"partition_name"，"field": "vector_field_name"}`，`{"float_vectors": [[1.0，2.0]，[3.0，4.0]，... [9.0，10.0]]}`，或 `{"bin_vectors": [b''，b'N'，... b'Ê']}`。 | N/A |
| `ids` | 集合中实体的主键列表。 | N/A |
| `collection` | 包含实体的集合名称。 | N/A |
| `partition` | 包含实体的分区名称。 | N/A |
| `field` | 集合中所需矢量字段的名称。 | N/A |
| `float_vectors` 或 `bin_vectors` | 矢量的类型。 | N/A |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `dim` | 向量的维度。 | N/A |
| `id_array` | 集合中实体的主键列表。 | N/A |
| `collection_name` | 包含实体的集合的名称。 | N/A |
| `partition_names` | 包含实体的分区的名称。 | N/A |
| `field_name` | 集合中所需矢量字段的名称。 | N/A |
| `vectors` | 目前仅支持浮点向量。 | N/A |

准备计算参数
------

指定用于计算的参数。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
params = {
    "metric": "IP", 
    "dim": 2
}

```

```python
// Node User Guide will be ready soon.

```

```python
// GO User Guide will be ready soon.

```

```python
// Java User Guide will be ready soon.

```

```python
// CLI User Guide will be ready soon.

```

```python
params='[
  {"key": "metric", "value": "IP"}
]'

```


| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `params` | 计算参数。 | N/A |
| `metric` | 用于计算的度量类型。 |对于浮点向量：`L2`（欧几里得距离）和`IP`（内积）。 对于二进制向量：`JACCARD`（Jaccard距离）、`TANIMOTO`（Tanimoto距离）、`HAMMING`（Hamming距离）、`SUPERSTRUCTURE`（超级结构）和`SUBSTRUCTURE`（子结构）。 |
| `dim` | 向量的维度。 | N/A |

以下是经过整理后的表格：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `metric` | 用于计算的度量类型。对于浮点向量：`L2`（欧几里得距离）和`IP`（内积）。| 对于浮点向量：     - `L2`（欧几里得距离）     - `IP`（内积）|

加载集合 (Optional) Load collection
--------------------------

如果在Milvus中计算集合中的向量，必须先将集合加载到内存中。

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
curl -X 'POST' 
  'http://localhost:9091/api/v1/collection/load' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

计算向量距离
------

根据提供的向量和参数计算向量之间的距离。

```python
from pymilvus import utility
results = utility.calc_distance(
    vectors_left=vectors_left, 
    vectors_right=vectors_right, 
    params=params
)
print(results)

```

```python
// Node User Guide will be ready soon.

```

```python
// GO User Guide will be ready soon.

```

```python
// Java User Guide will be ready soon.

```

```python
// CLI User Guide will be ready soon.

```

```python
curl -X 'GET' 
  'http://localhost:9091/api/v1/distance' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d "{
    "op_left": $vectors_left,
    "op_right": $vectors_right,
    "params": $params
  }"

```

Output:

```python
{"status":{},"Array":{"FloatDist":{"data":[3,7,11,15,4,10,16,22]}}}

```

接下来是什么
------

* 了解更多 Milvus 的基本操作：
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
	+ [使用时间旅行搜索](timetravel.md)
