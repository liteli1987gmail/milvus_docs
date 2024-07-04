


# 限制集合数量

Milvus 实例允许最多 65,536 个集合。然而，太多的集合可能导致性能问题。因此，建议限制在 Milvus 实例中创建的集合数量。

本指南介绍如何在 Milvus 实例上设置集合数量的限制。

配置会因安装 Milvus 实例的方式而有所不同。

- 对于使用 Helm Charts 安装的 Milvus 实例

  将配置添加到 `values.yaml` 文件的 `config` 部分中。详细信息请参考 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。

- 对于使用 Docker Compose 安装的 Milvus 实例

  将配置添加到你用于启动 Milvus 实例的 `milvus.yaml` 文件中。详细信息请参考 [使用 Docker Compose 配置 Milvus](/adminGuide/configure-docker.md)。

- 对于使用 Operator 安装的 Milvus 实例

  将配置添加到 `Milvus` 自定义资源的 `spec.components` 部分。详细信息请参考 [使用 Operator 配置 Milvus](/adminGuide/configure_operator.md)。

## 配置选项

```yaml
rootCoord:
    maxGeneralCapacity: 1024
```

`maxGeneralCapacity` 参数设置当前 Milvus 实例可以容纳的最大集合数量。默认值为 `1024`。

## 计算集合数量




在一个集合中，你可以设置多个分片和分区。分片是用来在多个数据节点之间分配数据写操作的逻辑单位。分区是用来通过仅加载集合数据的子集来提高数据检索效率的逻辑单位。当计算当前 Milvus 实例中的集合数量时，你还需要计算分片和分区的数量。

例如，假设你已经创建了 **100** 个集合，其中 **60** 个集合中有 **2** 个分片和 **4** 个分区，其余 **40** 个集合中有 **1** 个分片和 **12** 个分区。可以通过以下公式来计算当前集合的数量：

```
60 (集合数) x 2 (分片数) x 4 (分区数) + 40 (集合数) x 1 (分片数) x 12 (分区数) = 960
```

在上面的示例中，你已经使用了 **960** 个默认限制中的数量。现在，如果你想要创建一个具有 **4** 个分片和 **20** 个分区的新集合，你将收到以下错误提示，因为总集合数超过了最大容量限制：

```shell
failed checking constraint: sum_collections(parition*shard) exceeding the max general capacity:
```

为了避免这个错误，你可以减少现有或新集合中的分片或分区数量，删除一些集合，或增加 `maxGeneralCapacity` 的值。
