---
id: 索引向量字段.md
order: 1
summary: 本指南将指导您完成在集合上创建和管理向量字段索引的基本操作。
title: 索引向量字段
---

# 索引向量字段

本指南将指导您完成在集合上创建和管理向量字段索引的基本操作。

## 概述

利用索引文件中存储的元数据，Milvus 以一种特殊结构组织您的数据，以便在搜索或查询期间快速检索请求的信息。

Milvus 提供了 [几种索引类型](https://milvus.io/docs/index.md) 来对字段值进行排序，以实现高效的相似性搜索。它还提供了三种 [度量类型](https://milvus.io/docs/metric.md#Similarity-Metrics)：**余弦相似度** (COSINE)、**欧几里得距离** (L2) 和 **内积** (IP) 来衡量向量嵌入之间的距离。

建议为经常访问的向量字段和标量字段创建索引。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a> (Python) 与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

如 [管理集合](manage-collections.md) 中所述，如果在创建集合请求中指定了以下条件之一，Milvus 在创建集合时会自动生成一个索引并将其加载到内存中：

- 向量字段的维度和度量类型，或

- 架构和索引参数。

下面的代码片段重新利用现有代码，建立与 Milvus 实例的连接，并在未指定其索引参数的情况下创建一个集合。在这种情况下，集合没有索引且未加载。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建架构
# 2.1. 创建架构
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 2.2. 向架构中添加字段
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# 3. 创建集合
client.create_collection(
    collection_name="customized_setup", 
    schema=schema, 
)
```

## 索引集合

要为集合创建索引或索引集合，您需要设置索引参数并调用 `create_index()`。

```python
# 4.1. 设置索引参数
index_params = MilvusClient.prepare_index_params()

# 4.2. 在向量字段上添加索引。
index_params.add_index(
    field_name="vector",
    metric_type="COSINE",
    index_type=,
    index_name="vector_index"
)

# 4.3. 创建索引文件
client.create_index(
    collection_name="customized_setup",
    index_params=index_params
)
```

<div class="admonition note">

<p><b>注意</b></p>

<p>目前，您可以为集合中的每个字段创建一个索引文件。</p>

</div>

## 检查索引详细信息

创建索引后，您可以检查其详细信息。

```python
# 5. 描述索引
res = client.list_indexes(
    collection_name="customized_setup"
)

print(res)

# 输出
#
# [
#     "vector_index",
# ]

res = client.describe_index(
    collection_name="customized_setup",
    index_name="vector_index"
)

print(res)

# 输出
#
# {
#     "index_type": ,
#     "metric_type": "COSINE",
#     "field_name": "vector",
#     "index_name": "vector_index"
# }
```

您可以检查在特定字段上创建的索引文件，并收集使用此索引文件索引的行数的统计信息。

## 删除索引

如果不再需要索引，您可以简单地删除它。

```python
# 6. 删除索引
client.drop_index(
    collection_name="customized_setup",
    index_name="vector_index"
)
```