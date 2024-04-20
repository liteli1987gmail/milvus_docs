---
title: 单向量搜索
---
# 单向量搜索

一旦您插入了数据，下一步就是在 Milvus 中对您的集合执行相似性搜索。

Milvus 允许您根据集合中向量字段的数量进行两种类型的搜索：

- **单向量搜索**：如果您的集合只有一个向量字段，使用 [`search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/MilvusClient/Vector/search.md) 方法查找最相似的实体。此方法将您的查询向量与集合中的现有向量进行比较，并返回最接近匹配项的 ID 以及它们之间的距离。可选地，它还可以返回结果的向量值和元数据。
- **多向量搜索**：对于具有两个或更多向量字段的集合，使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法。此方法执行多个近似最近邻（ANN）搜索请求，并将结果组合以在重新排名后返回最相关的匹配项。

本指南重点介绍如何在 Milvus 中执行单向量搜索。有关多向量搜索的详细信息，请参阅 [混合搜索](https://milvus.io/docs/multi-vector-search.md)。

## 概览

有多种搜索类型以满足不同需求：

- [基本搜索](https://milvus.io/docs/single-vector-search.md#Basic-search)：包括单向量搜索、批量向量搜索、分区搜索和指定输出字段的搜索。

- [过滤搜索](https://milvus.io/docs/single-vector-search.md#Filtered-search)：根据标量字段应用过滤条件以细化搜索结果。

- [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search)：查找与查询向量在特定距离范围内的向量。

- [分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search)：根据特定字段对搜索结果进行分组，以确保结果的多样性。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a> (Python) 与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

以下代码片段重新利用现有代码建立与 Milvus 的连接，并快速设置集合。

```python
from pymilvus import MilvusClient

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 插入随机生成的向量 
colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {"id": i, "vector": [ random.uniform(-1, 1) for _ in range(5) ], "color": f"{random.choice(colors)}_{str(random.randint(1000, 9999))}" } for i in range(1000) ]

res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# 输出
#
# {
#     "insert_count": 1000
# }
```

## 基本搜索

发送 `search` 请求时，您可以提供表示查询嵌入的一个或多个向量值，以及指示要返回的结果数量的 `limit` 值。

根据您的数据和查询向量，您可能会得到少于 `limit` 的结果。当 `limit` 大于查询的可能匹配向量数量时，就会发生这种情况。

### 单向量搜索

单向量搜索是 Milvus 中 `search` 操作的最简单形式，旨在找到给定查询向量最相似的向量。

要执行单向量搜索，请指定目标集合名称、查询向量和所需的结果数量（`limit`）。此操作返回包含最相似向量、它们的 ID 以及与查询向量的距离的结果集。

以下是搜索与查询向量最相似的前 5 个实体的示例：

```python
# 单向量搜索
res = client.search(
    collection_name="test_collection", # 替换为您集合的实际名称
    # 替换为您的查询向量
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}} #