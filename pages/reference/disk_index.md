

# 硬盘索引

本文介绍了一种名为 DiskANN 的磁盘索引算法。基于 Vamana 图，DiskANN 可以在大型数据集内进行高效搜索。

为了提高查询性能，你可以 [为每个向量字段指定索引类型](/userGuide/manage-indexes/index-vector-fields.md)。

<div class="alert note">
目前，一个向量字段仅支持一种索引类型。当切换索引类型时，Milvus 会自动删除旧索引。
</div>

## 前提条件

要使用 DiskANN，请注意以下事项：
- DiskANN 默认启用。如果你更喜欢内存索引而不是磁盘索引，建议禁用此功能以获得更好的性能。
  - 你可以在 Milvus 配置文件中将 `queryNode.enableDisk` 更改为 `false` 以禁用它。
  - 要再次启用它，可以将 `queryNode.enableDisk` 设置为 `true`。
- Milvus 实例运行在 Ubuntu 18.04.6 或更新版本上。
- Milvus 数据路径应挂载到 NVMe SSD 以获得最佳性能：
  - 对于独立 Milvus 实例，数据路径应为运行实例的容器中的 **/var/lib/milvus/data**。
  - 对于 Milvus 集群实例，数据路径应为 QueryNodes 和 IndexNodes 运行的容器中的 **/var/lib/milvus/data**。

## 限制

要使用 DiskANN，请确保你：
- 在数据中只使用至少 1 个维度的浮点向量。
- 仅使用欧氏距离（L2）或内积（IP）来衡量向量之间的距离。

## 索引和搜索设置

- 索引构建参数

  在构建 DiskANN 索引时，使用 `DISKANN` 作为索引类型。不需要任何索引参数。

- 搜索参数

  | 参数          | 描述                                 | 范围                             |
  | ------------- | ------------------------------------ | -------------------------------- |
  | `search_list` | 候选列表的大小，更大的大小提供更高的召回率但性能下降 | [topk，int32_max] |

## 与 DiskANN 相关的 Milvus 配置

DiskANN 是可调的。你可以修改 `${MILVUS_ROOT_PATH}/configs/milvus.yaml` 中与 DiskANN 相关的参数以提高其性能。

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

| 参数                     | 描述                                                   | 值范围           | 默认值        |
| ------------------------ | ------------------------------------------------------ | --------------- | ------------- |
| `MaxDegree`              | Vamana 图的最大度数。较大的值提供更高的召回率但增加索引的大小和构建时间 | [1, 512]        | 56            |
| `SearchListSize`         | 候选列表的大小。较大的值增加构建索引的时间但提供更高的召回率。除非需要减少索引构建时间，否则将其设置为小于 `MaxDegree` 的值 | [1, int32_max]  | 100           |
| `PQCodeBugetGBRatio`     | PQ 码的大小限制。较大的值提供更高的召回率但增加内存使用量       | (0.0, 0.25]     | 0.125         |
| `SearchCacheBudgetGBRatio` | 缓存节点数与原始数据的比率。较大的值通过增加内存使用量来提高索引构建性能 | [0.0, 0.3)      | 0.10          |
| `BeamWidthRatio`         | 每个搜索迭代的最大 IO 请求数与 CPU 数之间的比率                   | [1, max(128 / CPU 数，16)] | 4.0           |

## 故障排除


- 如何处理“`io_setup()失败；返回-11，errno=11：资源暂时不可用`”错误？

  Linux 内核提供了异步非阻塞 I/O（AIO）功能，允许进程同时启动多个 I/O 操作而无需等待任何一个操作完成。这有助于提高能够同时进行处理和 I/O 的应用程序的性能。

  可以使用 proc 文件系统中的 `/proc/sys/fs/aio-max-nr` 虚拟文件来调整性能。`aio-max-nr` 参数确定允许的最大并发请求数。

  `aio-max-nr` 默认为 `65535`，可以将其设置为 `10485760`。
