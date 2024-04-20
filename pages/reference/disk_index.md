# 磁盘索引

本文介绍了一种名为 DiskANN 的磁盘索引算法。DiskANN 基于 Vamana 图，能够在大型数据集中实现高效的搜索。

## 概述

为了提高查询性能，你可以为每个向量字段[指定索引类型](index-vector-fields.md)。

<div class="alert note"> 
目前，一个向量字段只支持一种索引类型。当你切换索引类型时，Milvus 会自动删除旧的索引。
</div>

## 先决条件

要使用 DiskANN，请确保：

- DiskANN 默认启用。如果你更喜欢内存中的索引而不是磁盘上的索引，建议禁用此功能以获得更好的性能。
  - 要禁用它，你可以在 Milvus 配置文件中将 `queryNode.enableDisk` 更改为 `false`。
  - 要再次启用它，你可以将 `queryNode.enableDisk` 设置为 `true`。
- Milvus 实例运行在 Ubuntu 18.04.6 或更高版本上。
- Milvus 数据路径应挂载到 NVMe SSD 上以获得最佳性能：
  - 对于 Milvus 独立实例，数据路径应在实例运行的容器中的 **/var/lib/milvus/data**。
  - 对于 Milvus 集群实例，数据路径应在运行 QueryNodes 和 IndexNodes 的容器中的 **/var/lib/milvus/data**。

## 限制

要使用 DiskANN，请确保：

- 你的数据中只使用至少有 1 维的浮点向量。
- 只使用欧几里得距离（L2）或内积（IP）来测量向量之间的距离。

## 索引和搜索设置

- 索引构建参数

  在构建 DiskANN 索引时，使用 `DISKANN` 作为索引类型。不需要索引参数。

- 搜索参数

  | 参数     | 描述                         | 范围                                           |
  | ------------- | ----------------------------------- | ----------------------------------------------- |
  | `search_list` | 候选列表的大小，更大的大小提供更高的召回率，但性能会下降。 | [topk, int32_max] |

## DiskANN 相关的 Milvus 配置

DiskANN 是可调的。你可以通过修改 `${MILVUS_ROOT_PATH}/configs/milvus.yaml` 中的 DiskANN 相关参数来提高其性能。

```YAML
...
DiskIndex:
  MaxDegree: 56
  SearchListSize: 100
  PQCodeBugetGBRatio: 0.125
  SearchCacheBudgetGBRatio: 0.125
  BeamWidthRatio: 4.0
...
```

| 参数 | 描述 | 值范围 | 默认值 |
| --- | --- | --- | --- |
| `MaxDegree` | Vamana 图的最大度数。<br>更大的值提供更高的召回率，但增加了索引的构建大小和时间。 | [1, 512] | 56 | 
| `SearchListSize` | 候选列表的大小。<br>更大的值增加了构建索引的时间，但提供了更高的召回率。<br>除非你需要减少索引构建时间，否则将其设置为小于 `MaxDegree` 的值。 | [1, int32_max] | 100 |
| `PQCodeBugetGBRatio` | PQ 码的大小限制。<br>更大的值提供更高的召回率，但增加了内存使用量。 | (0.0, 0.25] | 0.125 |
| `SearchCacheBudgetGBRatio` | 缓存节点数量与原始数据的比率。<br>更大的值提高了索引构建性能，增加了内存使用量。 | [0.0, 0.3) | 0.10 |
| `BeamWidthRatio` | 每次搜索迭代的最大 IO 请求数与 CPU 数量的比率。 | [1, max(128 / CPU 数量, 16)] | 4.0 |

## 故障排除

- 如何处理 `io_setup() failed; returned -11, errno=11:Resource temporarily unavailable` 错误？

  Linux 内核提供了异步非阻塞 I/O (AIO) 特性，允许进程同时启动多个 I/O 操作而无需等待它们中的任何一个完成。这有助于提高可以重叠处理和 I/O 的应用程序的性能。

  可以使用 proc 文件系统中的 `/proc/sys/fs/aio-max-nr` 虚拟文件调整性能。`aio-max-nr` 参数决定了允许的同时请求的最大数量。

  `aio-max-nr` 默认为 `65535`，你可以将其设置为 `10485760`。