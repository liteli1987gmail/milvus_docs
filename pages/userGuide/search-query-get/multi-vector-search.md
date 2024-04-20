---
title: 多向量搜索
---

# 多向量搜索

## 概述

自 Milvus 2.4 版本起，我们引入了多向量支持和混合搜索框架，这意味着用户可以将多个向量字段（最多10个）带入单个集合中。不同的向量字段可以代表不同的方面、不同的嵌入模型，甚至可以是描述同一实体的不同模态的数据，这极大地扩展了信息的丰富性。此功能在全面搜索场景中特别有用，例如基于图片、声音、指纹等多种属性识别向量库中最相似的人。

多向量搜索允许在不同的向量字段上执行搜索请求，并使用重新排序策略（如互反排名融合（RRF）和加权评分）结合结果。要了解更多关于重新排序策略的信息，请参考[重新排序](reranking.md)。

在本教程中，您将学习如何：

- 为不同向量字段的相似性搜索创建多个 `AnnSearchRequest` 实例；
- 配置重新排序策略以组合和重新排序来自多个 `AnnSearchRequest` 实例的搜索结果；
- 使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法执行多向量搜索。

<div class="alert note">

本页上的代码片段使用 [PyMilvus ORM 模块](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md) 与 Milvus 交互。使用新的 [MilvusClient SDK](https://milvus.io/api-reference/pymilvus/v2.4.x/About.md) 的代码片段将很快提供。

</div>

## 准备工作

在开始多向量搜索之前，请确保您有一个包含多个向量字段的集合。

以下是创建一个名为 `test_collection` 的集合的示例，该集合包含两个向量字段 `filmVector` 和 `posterVector`，并将随机实体插入其中。

```python
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
import random

# 连接到 Milvus
connections.connect(
    host="10.102.7.3", # 替换为您的 Milvus 服务器 IP
    port="19530"
)

# 创建 schema
fields = [
    FieldSchema(name="film_id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="filmVector", dtype=DataType.FLOAT_VECTOR, dim=5), # 电影向量字段
    FieldSchema(name="posterVector", dtype=DataType.FLOAT_VECTOR, dim=5)] # 海报向量字段

schema = CollectionSchema(fields=fields,enable_dynamic_field=False)

# 创建集合
collection = Collection(name="test_collection", schema=schema)

# 为每个向量字段创建索引
index_params = {
    "metric_type": "L2",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 128},
}

collection.create_index("filmVector", index_params)
collection.create_index("posterVector", index_params)

# 生成随机实体以插入
entities = []

for _ in range(1000):
    # 为 schema 中的每个字段生成随机值
    film_id = random.randint(1, 1000)
    film_vector = [ random.random() for _ in range(5) ]
    poster_vector = [ random.random() for _ in range(5) ]

    # 为每个实体创建一个字典
    entity = {
        "film_id": film_id,
        "filmVector": film_vector,
        "posterVector": poster_vector
    }

    # 将实体添加到列表中
    entities.append(entity)
    
collection.insert(entities)
```

## 第 1 步：创建多个 AnnSearchRequest 实例

多向量搜索使用 `hybrid_search()` API 在单个调用中执行多个 ANN 搜索请求。每个 `AnnSearchRequest` 代表对特定向量字段的单个搜索请求。

以下示例创建了两个 `AnnSearchRequest` 实例，以对两个向量字段执行单独的相似性搜索。

```python
from pymilvus import AnnSearchRequest

# 创建针对 filmVector 的 ANN 搜索请求 1
query_filmVector = [[0.8896863042430693, 0.370613100114602, 0.23779315077113428, 0.38227915951132996, 0.5997064603128835]]

search_param_1 = {
    "data": query_filmVector, # 查询向量
    "anns_field": "filmVector", # 向量字段名称
    "param": {
        "metric_type": "L2", # 此