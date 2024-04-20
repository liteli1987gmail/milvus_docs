---
title: 获取和标量查询
---
# 获取和标量查询

本指南演示了如何通过ID获取实体以及如何进行标量过滤。标量过滤是根据指定的过滤条件检索实体。

## 概述

标量查询是基于定义的条件使用布尔表达式对集合中的实体进行过滤。查询结果是一组符合定义条件的实体。与向量搜索不同，后者是识别集合中最接近给定向量的向量，查询则是根据特定标准过滤实体。

在 Milvus 中，__filter 总是一个由操作符连接的字段名组成的字符串__。在本指南中，您将找到各种过滤器示例。要了解更多关于操作符的详细信息，请访问[参考](https://milvus.io/docs/get-and-scalar-query.md#Reference-on-scalar-filters)部分。

<div class="alert note">

本页上的代码片段使用新的<a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

以下步骤重新利用代码连接到 Milvus，快速设置一个集合，并将超过 1,000 个随机生成的实体插入到集合中。

### 第 1 步：创建一个集合

```python
from pymilvus import MilvusClient

# 1. 设置一个 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建一个集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5,
)
```

### 第 2 步：插入随机生成的实体

```python
# 3. 插入随机生成的向量 
colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {
        "id": i, 
        "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
        "color": random.choice(colors), 
        "tag": random.randint(1000, 9999) 
    } for i in range(1000) ]

for i in data:
    i["color_tag"] = "{}_{}".format(i["color"], i["tag"])

print(data[0])

# 输出
#
# {
#     "id": 0,
#     "vector": [
#         0.5913205104316952,
#         -0.5474675922381218,
#         0.9433357315736743,
#         0.22479148416151284,
#         0.28294612647978834
#     ],
#     "color": "grey",
#     "tag": 5024,
#     "color_tag": "grey_5024"
# }

# 4. 将实体插入集合
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

### 第 3 步：创建分区并插入更多实体

```python
# 5. 创建两个分区
client.create_partition(collection_name="quick_setup", partition_name="partitionA")
client.create_partition(collection_name="quick_setup", partition_name="partitionB")

# 6. 在分区 A 中插入 500 个实体
data = [ {
        "id": i + 1000, 
        "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
        "color": random.choice(colors), 
        "tag": random.randint(1000, 9999) 
    } for i in range(500) ]

for i in data:
    i["color_tag"] = "{}_{}".format(i["color"], i["tag"])

res = client.insert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)

print(res)

# 输出
#
# {
#     "insert_count": 500
# }

# 7. 在分区 B 中插入 300 个实体
data = [ {
        "id": i + 1500, 
        "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
        "color": random.choice(colors), 
        "tag": random.randint(1000, 9999) 
    } for i in range(300) ]

for i in data:
    i["color_tag"