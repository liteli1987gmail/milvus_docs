


                # 管理分区

                本指南将指导你如何在集合中创建和管理分区。

                ## 概述

                Milvus 中的分区表示集合的子分区。此功能允许将集合的物理存储划分为多个部分，通过将焦点缩小到较小的数据子集而不是整个集合，有助于改进查询性能。

                在创建集合时，至少会自动创建一个名为 ___default__ 的默认分区。一个集合内最多可以创建 4,096 个分区。

                <div class="admonition note">

                <p> <b> 注意 </b> </p>

                <p> Milvus 引入了称为 <strong> Partition Key </strong> 的功能，利用底层分区来根据特定字段的散列值存储实体。此功能有助于实现多租户，提高搜索性能。详情请阅读 <a href="https://milvus.io/docs/use-partition-key.md"> 使用 Partition Key </a>。</p>
                <p> 如果集合中启用了 <strong> Partition Key </strong> 功能，Milvus 会负责管理所有分区，解放你的责任。</p>
                <p> 本页面中的代码段使用新版 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。未来的更新中将发布适用于其他语言的新版 MilvusClient SDK。</p>

                </div>

                ## 准备工作

                下面的代码段重用现有代码，以快速设置方式建立与 Milvus 的连接并创建一个集合，表明该集合在创建时即被加载。

                ```python
                from pymilvus import MilvusClient, DataType

                # 1. 建立 Milvus 客户端
                client = MilvusClient(
                    uri="http://localhost:19530"
                )

                # 2. 创建集合
                client.create_collection(
                    collection_name="quick_setup",
                    dimension=5,
                )

                ```

                <div class="admonition note">

                <p> <b> 注意 </b> </p>

                <p> 在上述代码片段中，索引已在创建集合时创建，表明该集合在创建时即被加载。</p>

                </div>

                ## 列出分区

                集合准备好后，你可以列出其分区。

                ```python
                # 3. 列出分区
                res = client.list_partitions(collection_name="quick_setup")
                print(res)

                # 输出
                #
                # ["_default"]
                ```

                上述代码片段的输出包括指定集合内分区的名称。

                <div class="admonition note">

                <p> <b> 注意 </b> </p>

                <p> 如果你在集合中设置了字段作为分区键，Milvus 会创建至少 <strong> 64 </strong> 个与其集合一起的分区。列出分区时，结果可能与上述代码片段的输出不同。</p>
                <p> 有关详细信息，请参阅 <a href="https://milvus.io/docs/use-partition-key.md"> 使用 Partition Key </a>。</p>

                </div>

                ## 创建分区
                





你可以向集合中添加更多的分区。一个集合最多可以有 64 个分区。

```python
# 4. 创建更多的分区
client.create_partition(
    collection_name="quick_setup",
    partition_name="partitionA"
)

client.create_partition(
    collection_name="quick_setup",
    partition_name="partitionB"
)

res = client.list_partitions(collection_name="quick_setup")
print(res)

# 输出
#
# ["_default", "partitionA", "partitionB"]
```

上述代码片段创建了一个分区，并列出了该集合的分区。

<div class="admonition note">

<p> <b> 注意 </b> </p>

<p> 如果在集合中将字段设置为分区键，则 Milvus 负责管理集合中的分区。因此，在尝试创建分区时可能会出现提示的错误。</p>
<p> 详细信息请参考 <a href="https://milvus.io/docs/use-partition-key.md"> 使用分区键 </a>。</p>

</div>

## 检查特定分区

你还可以检查特定分区是否存在。

```python
# 5. 检查分区是否存在
res = client.has_partition(
    collection_name="quick_setup",
    partition_name="partitionA"
)
print(res)

# 输出
#
# True

res = client.has_partition(
    collection_name="quick_setup",
    partition_name="partitionC"
)
print(res)

# 输出
#
# False
```

上述代码片段检查了集合是否存在名为 `partitionA` 和 `partitionC` 的分区。

## 加载和释放分区

你可以加载和释放特定的分区，使它们可用或不可用于搜索和查询。

### 获取加载状态


    
To check the load status of a collection and its partitions, follow these steps:

```python
# Release the collection
client.release_collection(collection_name="quick_setup")

# Check the load status
res = client.get_load_state(collection_name="quick_setup")
print(res)

# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }

res = client.get_load_state(
    collection_name="quick_setup", 
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }

res = client.get_load_state(
    collection_name="quick_setup", 
    partition_name="partitionB"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoad>"
# }

```

Possible load status may be either of the following:

- __Loaded__

    A collection is marked as `Loaded` if at least one of its partitions has been loaded.

- __NotLoad__

    A collection is marked as `NotLoad` if none of its partitions has been loaded.

- __Loading__

### Load Partitions






加载集合的所有分区，只需调用 `load_collection()`。要加载集合的特定分区，请按以下步骤操作：

```python
client.load_partitions(
    collection_name="quick_setup",
    partition_names=["partitionA"]
)

res = client.get_load_state(collection_name="quick_setup")
print(res)

# 输出结果
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

要同时加载多个分区，请按如下方式操作：

```python
client.load_partitions(
    collection_name="quick_setup",
    partition_names=["partitionA", "partitionB"]
)

res = client.get_load_status(
    collection_name="quick_setup",
    partition_name="partitionA"
)

# 输出结果
#
# {
#     "state": "<LoadState: Loaded>"
# }

res = client.get_load_status(
    collection_name="quick_setup",
    partition_name="partitionB"
)

# 输出结果
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

### 释放分区

要释放集合的所有分区，只需调用 `release_collection`。要释放集合的特定分区，请按以下步骤操作：

```python
# 7. Release a partition
client.release_partitions(
    collection_name="quick_setup",
    partition_names=["partitionA"]
)

res = client.get_load_state(
    collection_name="quick_setup", 
    partition_name="partitionA"
)

print(res)

# 输出结果
#
# {
#     "state": "<LoadState: NotLoad>"
# }

```

要同时释放多个分区，请按如下方式操作：

```python
client.release_partitions(
    collection_name="quick_setup",
    partition_names=["_default", "partitionA", "partitionB"]
)

res = client.get_load_status(
    collection_name="quick_setup",
)

# 输出结果
#
# {
#     "state": "<LoadState: NotLoad>"
# }
```

## 删除分区





一旦释放分区，如果不再需要，就可以删除它。

```python
# 8. 删除一个分区
client.drop_partition(
    collection_name="quick_setup",
    partition_name="partitionB"
)

res = client.list_partitions(collection_name="quick_setup")
print(res)

# 输出
#
# ["_default", "partitionA"]
```

<div class="admonition note">

<p> <b> 注意：</b> </p>

<p> 在删除分区之前，需要从内存中释放它。</p>

</div>

## 常见问题




- __一个分区可以存储多少数据？__

    建议在一个分区中存储少于 1B 的数据。

- __最多可以创建多少个分区？__

    默认情况下，Milvus 允许最多创建 4,096 个分区。你可以通过配置 `rootCoord.maxPartitionNum` 来调整最大分区数。详细信息请参阅 [系统配置](https://milvus.io/docs/configure_rootcoord.md#rootCoordmaxPartitionNum)。

- __如何区分分区和分区键？__

    分区是物理存储单元，而分区键是基于指定列自动将数据分配到特定分区的逻辑概念。

    例如，在 Milvus 中，如果你有一个以 `color` 字段定义为分区键的集合，系统会根据每个实体的 `color` 字段的散列值自动将数据分配到分区。这个自动化过程使用户不需要在插入或搜索数据时手动指定分区。

    另一方面，当手动创建分区时，你需要根据分区键的条件将数据分配给每个分区。如果你有一个带有 `color` 字段的集合，你需要手动将具有 `color` 值为 `red` 的实体分配给 `分区A`，将具有 `color` 值为 `blue` 的实体分配给 `分区B`。这种手动管理需要更多的努力。

    总之，分区和分区键都用于优化数据计算和提高查询效率。重要的是要认识到启用分区键意味着放弃对分区数据插入和加载的手动管理控制，因为这些过程完全由 Milvus 自动化处理。

