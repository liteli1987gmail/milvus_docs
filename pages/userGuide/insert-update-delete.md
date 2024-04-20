---
title: 插入、上插和删除
---

# 插入、上插和删除

本指南将指导您完成集合内的数据操作，包括插入、上插（upsert）和删除。

## 开始之前

- 您已安装了您选择的 SDK。要安装 SDK，请参考 [安装 SDK](https://milvus.io/docs/install-pymilvus.md)。

- 您已创建了一个集合。要创建集合，请参考 [管理集合](manage-collections.md)。

- 如果要插入大量数据，建议您使用 [数据导入](https://milvus.io/api-reference/pymilvus/v2.4.x/DataImport/LocalBulkWriter/LocalBulkWriter.md)。

## 概述

在 Milvus 集合的上下文中，实体是集合中的一个单一、可识别的实例。它代表一个特定类别的一个独特成员，无论是图书馆中的一本书、基因组中的一个基因，还是任何其他可识别的实体。

集合中的实体共享一组称为模式（schema）的共同属性，该模式概述了每个实体必须遵守的结构，包括字段名称、数据类型和任何其他约束。

成功将实体插入集合需要提供的数据应包含目标集合中定义的所有模式字段。此外，如果您已启用动态字段，您还可以包括非模式定义的字段。有关详细信息，请参考 [启用动态字段](enable-dynamic-field.md)。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

下面的代码片段重新利用现有代码，建立与 Milvus 集群的连接，并快速设置一个集合。

```python
from pymilvus import MilvusClient

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建一个集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5,
    metric_type="IP"
)
```

<div class="admonition note">

<p><b>注意</b></p>

<p>上述代码生成的集合仅包含两个字段：<strong>id</strong>（作为主键）和 <code>vector</code>（作为向量字段），<strong>auto<em>id</strong> 和 <strong>enable</em>dynamic_field</strong> 设置默认启用。当插入数据时，</p>
<ul>
<li><p>您不需要在要插入的数据中包含 <strong>id</strong>，因为主键字段在插入数据时会自动递增。</p></li>
<li><p>非模式定义的字段将作为键值对保存在名为 <strong>$meta</strong> 的保留 JSON 字段中。</p></li>
</ul>

</div>

## 插入实体

要插入实体，您需要将数据组织成字典列表，其中每个字典代表一个实体。每个字典包含对应于目标集合中预定义和动态字段的键。

```python
# 3. 插入一些数据
data=[
    {"id": 0, "vector": [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], "color": "pink_8682"},
    {"id": 1, "vector": [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104], "color": "red_7025"},
    # ... 其他数据 ...
]

res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# 输出
#
# {
#     "insert_count": 10,
#     "ids": [
#         0,
#         1,
#         ... 其他 ID ...
#     ]
# }
```

### 插入到分区

要将数据插入特定分区，您可以在插入请求中指定分区的名称，如下所示：

```python
# 4. 向特定分区插入更多数据
data=[
    # ... 数据 ...
]

client.create_partition(
    collection_name="quick_setup",
    partition_name="partitionA"
)

res = client.insert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)

print(res)

# 输出
#
# {
#     "insert_count": 10,
#     "ids": [
#         10,
