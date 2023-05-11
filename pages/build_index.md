在Milvus上构建向量索引
==============

本指南描述了如何在Milvus上构建向量索引。

向量索引是用于加速[向量相似性搜索](search.md)的元数据的组织单元。如果没有在向量上构建索引，Milvus将默认执行暴力搜索。

有关向量索引的机制和种类的更多信息，请参见[向量索引](index.md)。

默认情况下，Milvus不会对小于1,024行的段进行索引。要更改此参数，请在`milvus.yaml`中配置[`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoord.minSegmentSizeToEnableIndex)。

以下示例使用欧几里得距离（L2）作为相似度指标构建了一个1,024个簇的IVF_FLAT索引。您可以选择适合您情境的索引和指标。有关更多信息，请参阅[相似度指标](metric.md)。

准备索引参数
------

将索引参数准备如下：

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
index_params = {
  "metric_type":"L2",
  "index_type":"IVF_FLAT",
  "params":{"nlist":1024}
}

```

```
const index_params = {
  metric_type: "L2",
  index_type: "IVF_FLAT",
  params: JSON.stringify({ nlist: 1024 }),
};

```

```
idx, err := entity.NewIndexIvfFlat(   // NewIndex func
    entity.L2,                        // metricType
    1024,                             // ConstructParams
)
if err != nil {
  log.Fatal("fail to create ivf flat index parameter:", err.Error())
}

```

```
final IndexType INDEX_TYPE = IndexType.IVF_FLAT;   // IndexType
final String INDEX_PARAM = "{\"nlist\":1024}";     // ExtraParam

```

```
create index

Collection name (book): book

The name of the field to create an index for (book_intro): book_intro

Index type (FLAT, IVF_FLAT, IVF_SQ8, IVF_PQ, RNSG, HNSW, ANNOY): IVF_FLAT

Index metric type (L2, IP, HAMMING, TANIMOTO): L2

Index params nlist: 1024

Timeout []:

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/index' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "field_name": "book_intro",
    "extra_params":[
      {"key": "metric_type", "value": "L2"},
      {"key": "index_type", "value": "IVF_FLAT"},
      {"key": "params", "value": "{\"nlist\":1024}"}
    ]
  }'

```

| Parameter | Description | Options |
| --- | --- | --- |
| `metric_type` | Type of metrics used to measure the similarity of vectors. | For floating point vectors:
 * `L2`（欧几里得距离）

* `IP`（内积）

 For binary vectors:
 * `JACCARD`（Jaccard距离）

* `TANIMOTO`（Tanimoto距离）

* `HAMMING`（Hamming距离）

* `SUPERSTRUCTURE`（超结构）

* `SUBSTRUCTURE`（子结构）
 |
| `index_type` | Type of index used to accelerate the vector search. | For floating point vectors:
 * `FLAT`（FLAT）

* `IVF_FLAT`（IVF_FLAT）

* `IVF_SQ8`（IVF_SQ8）

* `IVF_PQ`（IVF_PQ）

* `HNSW`（HNSW）

* `ANNOY`（ANNOY）

* `DISKANN*`（DISK_ANN）

 For binary vectors:
 * `BIN_FLAT`（BIN_FLAT）

* `BIN_IVF_FLAT`（BIN_IVF_FLAT）
 |
| `params` | Building parameter(s) specific to the index. | See [内存索引](index.md) and [磁盘索引](disk_index.md) for more information. |
| * DISKANN has certain prerequisites to meet. For details, see [磁盘索引](disk_index.md). |

| Parameter | Description | Option |
| --- | --- | --- |
| `metric_type` | Type of metrics used to measure the similarity of vectors. | For floating point vectors:
 * `L2`（欧几里得距离）

* `IP`（内积）

 For binary vectors:
 * `JACCARD`（Jaccard距离）

* `TANIMOTO`（Tanimoto距离）

* `HAMMING`（Hamming距离）

* `SUPERSTRUCTURE`（超结构）

* `SUBSTRUCTURE`（子结构）
 |
| `index_type` | Type of index used to accelerate the vector search. | For floating point vectors:
 * `FLAT`（FLAT）

* `IVF_FLAT`（IVF_FLAT）

* `IVF_SQ8`（IVF_SQ8）

* `IVF_PQ`（IVF_PQ）

* `HNSW`（HNSW）

* `ANNOY`（ANNOY）

 For binary vectors:
 * `BIN_FLAT`（BIN_FLAT）

* `BIN_IVF_FLAT`（BIN_IVF_FLAT）
 |
| `params` | Building parameter(s) specific to the index. | See [内存索引](index.md) and [磁盘索引](disk_index.md) for more information. |

| Parameter | Description | Options |
| --- | --- | --- |
| `NewIndex func` | Function to create entity. Index according to different index types. | For floating point vectors:
 * `NewIndexFlat`（FLAT）

* `NewIndexIvfFlat`（IVF_FLAT）

* `NewIndexIvfSQ8`（IVF_SQ8）

* `NewIndexIvfPQ`（IVF_PQ）

* `NewIndexHNSW`（HNSW）

* `NewIndexANNOY`（ANNOY）

* `NewIndexDISKANN*`（DISK_ANN）

 For binary vectors:
 * `NewIndexBinFlat`（BIN_FLAT）

* `NewIndexBinIvfFlat`（BIN_IVF_FLAT）
 |
| `metricType` | Type of metrics used to measure the similarity of vectors. | For floating point vectors:
 * `L2`（欧几里得距离）

* `IP`（内积）

 For binary vectors:
 * `JACCARD`（Jaccard距离）

* `TANIMOTO`（Tanimoto距离）

* `HAMMING`（Hamming距离）

* `SUPERSTRUCTURE`（超结构）

* `SUBSTRUCTURE`（子结构）
 |
| `ConstructParams` | Building parameter(s) specific to the index. | See [内存索引](index.md) and [磁盘索引](disk_index.md) for more information. |
| * DISKANN has certain prerequisites to meet. For details, see [磁盘索引](disk_index.md). |

| Parameter | Description | Options |
| --- | --- | --- |
| `IndexType` | Type of index used to accelerate the vector search. | For floating point vectors:
 * `FLAT`（FLAT）

* `IVF_FLAT`（IVF_FLAT）

* `IVF_SQ8`（IVF_SQ8）

* `IVF_PQ`（IVF_PQ）

* `HNSW`（HNSW）

* `ANNOY`（ANNOY）

* `DISKANN*`（DISK_ANN）

 For binary vectors:
 * `BIN_FLAT`（BIN_FLAT）

* `BIN_IVF_FLAT`（BIN_IVF_FLAT）
 |
| `ExtraParam` | Building parameter(s) specific to the index. | See [内存索引](index.md) and [磁盘索引](disk_index.md) for more information. |
| * DISKANN has certain prerequisites to meet. For details, see [磁盘索引](disk_index.md). |

| Option | Description |
| --- | --- |
| --help | Displays help for using the command. |

| Parameter | Description | Options |
| --- | --- | --- |
| `collection_name` | Name of the collection to build the index on. |
| `field_name` | Name of the vector field to build the index on. |
| `metric_type` | Type of metrics used to measure the similarity of vectors. | For floating point vectors:
 * `L2`（欧几里德距离）

* `IP`（内积）

 For binary vectors:
 * `JACCARD`（Jaccard距离）

* `TANIMOTO`（Tanimoto距离）

* `HAMMING`（汉明距离）

* `SUPERSTRUCTURE`（超级结构）

* `SUBSTRUCTURE`（子结构）
 |
| `index_type` | Type of index used to accelerate the vector search. | For floating point vectors:
 * `FLAT`（FLAT）

* `IVF_FLAT`（IVF_FLAT）

* `IVF_SQ8`（IVF_SQ8）

* `IVF_PQ`（IVF_PQ）

* `HNSW`（HNSW）

* `ANNOY`（ANNOY）

 For binary vectors:
 * `BIN_FLAT`（BIN_FLAT）

* `BIN_IVF_FLAT`（BIN_IVF_FLAT）
 |
| `params` | Building parameter(s) specific to the index. | See [内存索引](index.md) for more information. |

建立索引
----

通过指定向量字段名称和索引参数来建立索引。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection, utility
# Get an existing collection.
collection = Collection("book")      
collection.create_index(
  field_name="book_intro", 
  index_params=index_params
)

utility.index_building_progress("book")
# Output: {'total_rows': 0, 'indexed_rows': 0}

```

```
await milvusClient.createIndex({
  collection_name: "book",
  field_name: "book_intro",
  extra_params: index_params,
});

```

```
err := milvusClient.CreateIndex(
  context.Background(),        // ctx
  "book",                      // CollectionName
  "book_intro",                // fieldName
  idx,                         // entity.Index
  false,                       // async
)
if err != nil {
  log.Fatal("fail to create index:", err.Error())
}

```

```
milvusClient.createIndex(
  CreateIndexParam.newBuilder()
    .withCollectionName("book")
    .withFieldName("book_intro")
    .withIndexType(INDEX_TYPE)
    .withMetricType(MetricType.L2)
    .withExtraParam(INDEX_PARAM)
    .withSyncMode(Boolean.FALSE)
    .build()
);

```

```
# Follow the previous step.

```

```
# Follow the previous step.

```

| Parameter | Description |
| --- | --- |
| `field_name` | Name of the vector field to build index on. |
| `index_params` | Parameters of the index to build. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to build index in. |
| `field_name` | Name of the vector field to build index on. |
| `extra_params` | Parameters of the index to build. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to build index on. |
| `fieldName` | Name of the vector field to build index on. |
| `entity.Index` | Parameters of the index to build. |
| `async` | Switch to control sync/async behavior. The deadline of context is not applied in sync building process. |

接下来是什么
------

* 学习更多Milvus基本操作：
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
	+ [使用时间旅行搜索](timetravel.md)
