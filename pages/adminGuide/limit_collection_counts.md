---

id: limit_collection_counts.md
title: 设置集合数量限制
---

# 设置集合数量限制

一个 Milvus 实例允许最多 65,536 个集合。然而，太多的集合可能会导致性能问题。因此，建议限制在 Milvus 实例中创建的集合数量。

本指南提供了如何在 Milvus 实例中设置集合数量限制的说明。

配置方法因安装 Milvus 实例的方式而异。

- 对于使用 Helm 图表安装的 Milvus 实例

  将配置添加到 `values.yaml` 文件的 `config` 部分下。有关详细信息，请参阅 [使用 Helm 图表配置 Milvus](configure-helm.md)。

- 对于使用 Docker Compose 安装的 Milvus 实例

  将配置添加到您用于启动 Milvus 实例的 `milvus.yaml` 文件中。有关详细信息，请参阅 [使用 Docker Compose 配置 Milvus](configure-docker.md)。

- 对于使用 Operator 安装的 Milvus 实例

  将配置添加到 `Milvus` 自定义资源的 `spec.components` 部分。有关详细信息，请参阅 [使用 Operator 配置 Milvus](configure_operator.md)。

## 配置选项

```yaml
rootCoord:
    maxGeneralCapacity: 1024
```

`maxGeneralCapacity` 参数设置当前 Milvus 实例可以持有的集合的最大数量。默认值为 `1024`。

## 计算集合数量

在一个集合中，您可以设置多个分片和分区。分片是用于在多个数据节点之间分布数据写操作的逻辑单元。分区是用于通过仅加载集合数据的子集来提高数据检索效率的逻辑单元。在计算当前 Milvus 实例中的集合数量时，您还需要计算分片和分区的数量。

例如，假设您已经创建了 **100** 个集合，在其中 **60** 个集合中有 **2** 个分片和 **4** 个分区，在其余 **40** 个集合中有 **1** 个分片和 **12** 个分区。当前集合的数量可以计算为：

```
60 (集合) x 2 (分片) x 4 (分区) + 40 (集合) x 1 (分片) x 12 (分区) = 960
```

在上述示例中，您已经使用了默认限制的 **960**。现在，如果您想创建一个具有 **4** 个分片和 **20** 个分区的新集合，您将收到以下错误提示，因为总集合数量超过了最大容量：

```shell
failed checking constraint: sum_collections(parition*shard) exceeding the max general capacity:
```

为了避免这个错误，您可以减少现有或新集合中的分片或分区数量，删除一些集合，或者增加 `maxGeneralCapacity` 的值。