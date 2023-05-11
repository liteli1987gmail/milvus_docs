本文介绍了一种名为 DiskANN 的磁盘索引算法。基于 Vamana 图，DiskANN 对大型数据集内的有效搜索提供支持。

为了提高查询性能，您可以为每个向量字段[指定索引类型](build_index.md)。

目前，一个向量字段只支持一种索引类型。当切换索引类型时，Milvus 会自动删除旧的索引。

先决条件
--------

要使用 DiskANN，请注意以下事项：

* 您在从源代码编译 Milvus 时运行了 `make disk_index=ON` 命令。
* 您的 Milvus 实例运行在 Ubuntu 18.04.6 或更高版本上。
* 路径 **${MILVUS_ROOT_PATH}/milvus/data** 已经装载到 NVMe SSD 上以获得完整的性能。

限制
-----

要使用 DiskANN，请确保您：

* 在数据中仅使用至少包含 32 个维度的浮点向量。
* 仅使用欧式距离（L2）或内积（IP）来衡量向量之间的距离。

索引和搜索设置
---------------

* 索引构建参数

创建 DiskANN 索引时，请使用 `DISKANN` 作为索引类型。不需要索引参数。

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `k` | 要返回的最近向量数目 | [1, 12768] |
| `search_list` | 候选列表的大小，较大的大小可以以牺牲性能的方式提高召回率。 | [k, min( 10 * k, 65535)] for k > 20  [k, 200] for k <= 20 |

DiskANN 相关的 Milvus 配置
--------------------------

DiskANN 是可调的。您可以在 `${MILVUS_ROOT_PATH}/configs/milvus.yaml` 中修改 DiskANN 相关参数来提高其性能。

```
...
DiskIndex:
  MaxDegree: 56
  SearchListSize: 100
  PQCodeBugetGBRatio: 0.125
  BuildNumThreadsRatio: 1.0
  SearchCacheBudgetGBRatio: 0.125
  LoadNumThreadRatio: 8.0
  BeamWidthRatio: 4.0
...

```

| Parameter | Description | Value Range | Default Value |
| --- | --- | --- | --- |
| `MaxDegree` | Maximum degree of the Vamana graph.  A larger value offers a higher recall rate but increases the size of and time to build the index. | [1, 512] | 56 |
| `SearchListSize` | Size of the candidate list.  A larger value increases the time spent on building the index but offers a higher recall rate.  Set it to a value smaller than `MaxDegree` unless you need to reduce the index-building time. | [1, ∞] | 100 |
| `PQCodeBugetGBRatio` | Size limit on the PQ code.  A larger value offers a higher recall rate but increases memory usage. | (0.0, 0.25] | 0.125 |
| `BuildNumThreadsRatio` | Ratio between the number of threads used to build the index and the number of CPUs. | [1.0, 128.0 / CPU number] | 1.0 |
| `SearchCacheBudgetGBRatio` | Ratio of cached node numbers to raw data.  A larger value improves index-building performance with increased memory usage. | [0.0, 0.3) | 0.10 |
| `LoadNumThreadRatio` | Ratio between the number of threads used to load index/search and the number of CPUs. For details, refer to the first item in [References and Facts](disk_index.md#references-and-facts). | [1, 65536 / 32 / CPU number] | 8.0 |
| `BeamWidthRatio` | Ratio between the maximum number of IO requests per search iteration and CPU number. | [1, max(128 / CPU number, 16)] | 4.0 |

