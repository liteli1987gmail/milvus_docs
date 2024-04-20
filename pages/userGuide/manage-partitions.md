---
id: 管理分区.md
title: 管理分区
---

# 管理分区

本指南将指导您如何在集合中创建和管理分区。

## 概述

在 Milvus 中，分区代表集合的一个子分区。此功能允许将集合的物理存储划分为多个部分，通过将焦点缩小到较小的数据子集而不是整个集合，从而提高查询性能。

创建集合时，至少会自动创建一个名为 __default__ 的默认分区。您可以在集合中创建最多 4,096 个分区。

<div class="admonition note">

<p><b>注意</b></p>

<p>Milvus 引入了一个名为 <strong>分区键</strong> 的功能，利用底层分区根据特定字段的哈希值存储实体。此功能有助于实现多租户，提高搜索性能。详情请阅读 <a href="https://milvus.io/docs/use-partition-key.md">使用分区键</a>。</p>
<p>如果在集合中启用了 <strong>分区键</strong> 功能，Milvus 将负责管理所有分区，免除您的这一责任。</p>
<p>本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 交互。未来更新中将发布其他语言的新 MilvusClient SDK。</p>

</div>

## 准备工作

以下代码片段重新利用现有代码，快速设置模式下建立与 Milvus 的连接并创建集合，表明集合在创建时已加载。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置 Milvus 客户端
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

<p><b>注意</b></p>

<p>在上面的代码片段中，集合的索引已随集合一起创建，表明集合在创建时已加载。</p>

</div>

## 列出分区

一旦集合准备好，您可以列出其分区。

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

<p><b>注意</b></p>

<p>如果您在集合中将某个字段设置为分区键，Milvus 会随着集合的创建至少创建 <strong>64</strong> 个分区。当列出分区时，结果可能与上述代码片段的输出不同。</p>
<p>详情请参考 <a href="https://milvus.io/docs/use-partition-key.md">使用分区键</a>。</p>

</div>

## 创建分区

您可以向集合中添加更多分区。一个集合最多可以有 64 个分区。

```python
# 4. 创建更多分区
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

上述代码片段在集合中创建了一个分区，并列出了集合的分区。

<div class="admonition note">

<p><b>注意</b></p>

<p>如果您在集合中将某个字段设置为分区键，Milvus 将负责管理集合中的分区。因此，在尝试创建分区时，您可能会遇到提示的错误。</p>
<p>详情请参考 <a href="https://milvus.io/docs/use-partition-key.md">使用分区键</a>。</p>

</div>

## 检查特定分区

您还可以检查特定分区的存在性。

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

上述代码片段检查集合是否具有名为 `partitionA` 和 `partitionC` 的分区。

## 加载与释放分区

您可以加载和释放特定分区，使它们可用于或不可用于搜索和查询。

### 获取加载状态

要检查集合及其分区的加载状态，请执行以下操作：

```python
# 释放集合
client.release_collection(collection_name="quick_setup")

# 检查加载状态
res = client.get_load_state