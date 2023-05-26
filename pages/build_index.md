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

```bash
index_params = {
  "metric_type":"L2",
  "index_type":"IVF_FLAT",
  "params":{"nlist":1024}
}

```

```bash
const index_params = {
  metric_type: "L2",
  index_type: "IVF_FLAT",
  params: JSON.stringify({ nlist: 1024 }),
};

```

```bash
idx, err := entity.NewIndexIvfFlat(   // NewIndex func
    entity.L2,                        // metricType
    1024,                             // ConstructParams
)
if err != nil {
  log.Fatal("fail to create ivf flat index parameter:", err.Error())
}

```

```bash
final IndexType INDEX_TYPE = IndexType.IVF_FLAT;   // IndexType
final String INDEX_PARAM = "{"nlist":1024}";     // ExtraParam

```

```bash
create index

Collection name (book): book

The name of the field to create an index for (book_intro): book_intro

Index type (FLAT, IVF_FLAT, IVF_SQ8, IVF_PQ, RNSG, HNSW, ANNOY): IVF_FLAT

Index metric type (L2, IP, HAMMING, TANIMOTO): L2

Index params nlist: 1024

Timeout []:

```

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/index' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "field_name": "book_intro",
    "extra_params":[
      {"key": "metric_type", "value": "L2"},
      {"key": "index_type", "value": "IVF_FLAT"},
      {"key": "params", "value": "{"nlist":1024}"}
    ]
  }'

```

很抱歉，我再次失误了。以下是正确的中文翻译及表格格式：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `metric_type` | 用于衡量向量相似度的度量类型。 | 对于浮点型向量：`L2`（欧几里得距离）、`IP`（内积）；对于二元型向量：`JACCARD`（Jaccard距离）、`TANIMOTO`（Tanimoto距离）、`HAMMING`（Hamming距离）、`SUPERSTRUCTURE`（超结构）、`SUBSTRUCTURE`（子结构）|
| `index_type` | 用于加速向量搜索的索引类型。 | 对于浮点型向量：`FLAT`（FLAT）、`IVF_FLAT`（IVF_FLAT）、`IVF_SQ8`（IVF_SQ8）、`IVF_PQ`（IVF_PQ）、`HNSW`（HNSW）、`ANNOY`（ANNOY）；对于二元型向量：`BIN_FLAT`（BIN_FLAT）、`BIN_IVF_FLAT`（BIN_IVF_FLAT）|
| `params` | 指定建立索引的参数。 | 更多信息请参见[内存索引](index.md)和[磁盘索引](disk_index.md)。 * DISKANN 有一些特定要求要满足。详情请参见[磁盘索引](disk_index.md)。|

非常感谢您的指导，以下是修改后的表格及翻译：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `NewIndex func` | 根据不同的索引类型创建实体索引的函数。 | 对于浮点类型向量：`NewIndexFlat`（FLAT）、`NewIndexIvfFlat`（IVF_FLAT）、`NewIndexIvfSQ8`（IVF_SQ8）、`NewIndexIvfPQ`（IVF_PQ）、`NewIndexHNSW`（HNSW）、`NewIndexANNOY`（ANNOY）、`NewIndexDISKANN*`（DISK_ANN）； 对于二元类型向量：`NewIndexBinFlat`（BIN_FLAT）、`NewIndexBinIvfFlat`（BIN_IVF_FLAT）|
| `metricType` | 用于衡量向量相似度的距离类型。 | 对于浮点类型向量：`L2`（欧几里得距离）、`IP`（内积）； 对于二元类型向量：`JACCARD`（Jaccard距离）、`TANIMOTO`（Tanimoto距离）、`HAMMING`（Hamming距离）、`SUPERSTRUCTURE`（超级结构）、`SUBSTRUCTURE`（子结构）|
| `ConstructParams` | 创建索引时需要用到的特定参数。 | 更多信息请参见[内存索引](index.md)和[磁盘索引](disk_index.md)。 * DISKANN 有一些特定要求要满足。详情请参见[磁盘索引](disk_index.md)。|

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `IndexType` | 用于加速向量搜索的索引类型。 | 对于浮点类型向量：`FLAT`（FLAT）、`IVF_FLAT`（IVF_FLAT）、`IVF_SQ8`（IVF_SQ8）、`IVF_PQ`（IVF_PQ）、`HNSW`（HNSW）、`ANNOY`（ANNOY）、`DISKANN*`（DISK_ANN）； 对于二元类型向量：`BIN_FLAT`（BIN_FLAT）、`BIN_IVF_FLAT`（BIN_IVF_FLAT）|
| `ExtraParam` | 创建索引时需要用到的特定参数。 | 更多信息请参见[内存索引](index.md)和[磁盘索引](disk_index.md)。* DISKANN 有一些特定要求要满足。详情请参见[磁盘索引](disk_index.md)。|

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `metricType` | 用于衡量向量相似度的距离类型。 | 对于浮点类型向量：`L2`（欧几里得距离）、`IP`（内积）； 对于二元类型向量：`JACCARD`（Jaccard距离）、`TANIMOTO`（Tanimoto距离）、`HAMMING`（Hamming距离）、`SUPERSTRUCTURE`（超级结构）、`SUBSTRUCTURE`（子结构）|
| `NewIndex func` | 根据不同的索引类型创建实体索引的函数。 | 对于浮点类型向量：`NewIndexFlat`（FLAT）、`NewIndexIvfFlat`（IVF_FLAT）、`NewIndexIvfSQ8`（IVF_SQ8）、`NewIndexIvfPQ`（IVF_PQ）、`NewIndexHNSW`（HNSW）、`NewIndexANNOY`（ANNOY）、`NewIndexDISKANN*`（DISK_ANN）； 对于二元类型向量：`NewIndexBinFlat`（BIN_FLAT）、`NewIndexBinIvfFlat`（BIN_IVF_FLAT）|
| `ConstructParams` | 创建索引时需要用到的特定参数。 | 更多信息请参见[内存]|

|参数|描述|选项|
|---|---|---|
| `collection_name` | 构建索引的向量集合名称。 |  |
| `field_name` | 构建索引的向量字段名称。 |  |
| `metric_type` | 用于衡量向量相似度的距离类型。 | 对于浮点类型向量：`L2`（欧几里德距离）、`IP`（内积）； 对于二元类型向量：`JACCARD`（Jaccard距离）、`TANIMOTO`（Tanimoto距离）、`HAMMING`（汉明距离）、`SUPERSTRUCTURE`（超级结构）、`SUBSTRUCTURE`（子结构）|
| `index_type` | 用于加速向量搜索的索引类型。 | 对于浮点类型向量：`FLAT`（FLAT）、`IVF_FLAT`（IVF_FLAT）、`IVF_SQ8`（IVF_SQ8）、`IVF_PQ`（IVF_PQ）、`HNSW`（HNSW）、`ANNOY`（ANNOY）； 对于二元类型向量：`BIN_FLAT`（BIN_FLAT）、`BIN_IVF_FLAT`（BIN_IVF_FLAT）|
| `params` | 创建索引时需要用到的特定参数。 | 更多信息请参见[内存索引](index.md)。|
| `--help` | 显示命令使用的帮助信息。| |

建立索引
----

通过指定向量字段名称和索引参数来建立索引。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
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

```bash
await milvusClient.createIndex({
  collection_name: "book",
  field_name: "book_intro",
  extra_params: index_params,
});

```

```bash
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

```bash
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

```bash
# Follow the previous step.

```

```bash
# Follow the previous step.

```

| 参数 | 描述 |
| --- | --- |
| `field_name` | 构建索引的向量字段名称。 |
| `index_params` | 所要构建的索引的参数。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 在其中构建索引的向量集合名称。 |
| `field_name` | 构建索引的向量字段名称。 |
| `extra_params` | 所要构建的索引的参数。|

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 构建索引的向量集合名称。 |
| `fieldName` | 构建索引的向量字段名称。 |
| `entity.Index` | 所要构建的索引的参数。|
| `async`| 控制同步/异步行为的开关。在同步构建过程中，上下文的截止时间不适用。|

接下来是什么
------

* 学习更多Milvus基本操作：
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
	+ [使用时间旅行搜索](timetravel.md)
