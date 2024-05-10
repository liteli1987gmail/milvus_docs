---
id: get-and-scalar-query.md
order: 3
summary: This guide demonstrates how to get entities by ID and conduct scalar filtering.
title: Get & Scalar Query
---

# 获取和标量查询

本指南演示了如何通过 ID 获取实体以及如何进行标量过滤。标量过滤是根据指定的过滤条件检索实体。

## 概述

标量查询是基于定义的条件使用布尔表达式对集合中的实体进行过滤。查询结果是一组符合定义条件的实体。与向量搜索不同，后者是识别集合中最接近给定向量的向量，查询则是根据特定标准过滤实体。

在 Milvus 中，**filter 总是一个由操作符连接的字段名组成的字符串**。在本指南中，您将找到各种过滤器示例。要了解更多关于操作符的详细信息，请访问[参考](https://milvus.io/docs/get-and-scalar-query.md#Reference-on-scalar-filters)部分。

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
    i["color_tag"] = "{}_{}".format(i["color"], i["tag"])

res = client.insert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionB"
)

print(res)

# Output
#
# {
#     "insert_count": 300
# }
```

## Get Entities by ID

If you know the IDs of the entities of your interests, you can use the `get()` method.

```python
# 4. Get entities by ID
res = client.get(
    collection_name="quick_setup",
    ids=[0, 1, 2]
)

print(res)

# Output
#
# [
#     {
#         "id": 0,
#         "vector": [
#             0.68824464,
#             0.6552274,
#             0.33593303,
#             -0.7099536,
#             -0.07070546
#         ],
#         "color_tag": "green_2006",
#         "color": "green"
#     },
#     {
#         "id": 1,
#         "vector": [
#             -0.98531723,
#             0.33456197,
#             0.2844234,
#             0.42886782,
#             0.32753858
#         ],
#         "color_tag": "white_9298",
#         "color": "white"
#     },
#     {
#         "id": 2,
#         "vector": [
#             -0.9886812,
#             -0.44129863,
#             -0.29859528,
#             0.06059075,
#             -0.43817034
#         ],
#         "color_tag": "grey_5312",
#         "color": "grey"
#     }
# ]
```

### Get entities from partitions

You can also get entities from specific partitions.

```python
# 5. Get entities from partitions
res = client.get(
    collection_name="quick_setup",
    ids=[0, 1, 2],
    partition_names=["_default"]
)

print(res)

# Output
#
# [
#     {
#         "color_tag": "green_2006",
#         "color": "green",
#         "id": 0,
#         "vector": [
#             0.68824464,
#             0.6552274,
#             0.33593303,
#             -0.7099536,
#             -0.07070546
#         ]
#     },
#     {
#         "color_tag": "white_9298",
#         "color": "white",
#         "id": 1,
#         "vector": [
#             -0.98531723,
#             0.33456197,
#             0.2844234,
#             0.42886782,
#             0.32753858
#         ]
#     },
#     {
#         "color_tag": "grey_5312",
#         "color": "grey",
#         "id": 2,
#         "vector": [
#             -0.9886812,
#             -0.44129863,
#             -0.29859528,
#             0.06059075,
#             -0.43817034
#         ]
#     }
# ]
```

## Use Basic Operators

In this section, you will find examples of how to use basic operators in scalar filtering. You can apply these filters to [vector searches](https://milvus.io/docs/single-vector-search.md#Filtered-search) and [data deletions](https://milvus.io/docs/insert-update-delete.md#Delete-entities) too.

- Filter entities with their tag values falling between 1,000 to 1,500.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter="1000 < tag < 1500",
      output_fields=["color_tag"],
      # highlight-end
      limit=3
  )

  # Output
  #
  #
  ```

- Filter entities with their **color** values set to **red**.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter='color == "brown"',
      output_fields=["color_tag"],
      # highlight-end
      limit=3
  )

  # Output
  #
  #
  ```

- Filter entities with their **color** values not set to **green** and **purple**.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter='color not in ["green", "purple"]',
      output_fields=["color_tag"],
      # highlight-end
      limit=3
  )

  # Output
  #
  #
  ```

- Filter articles whose color tags start with **red**.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter='color_tag like "red%"',
      output_fields=["color_tag"],
      # highlight-end
      limit=3
  )

  # Output
  #
  #
  ```

- Filter entities with their colors set to red and tag values within the range from 1,000 to 1,500.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter='(color == "red") and (1000 < tag < 1500)',
      output_fields=["color_tag"],
      # highlight-end
      limit=3
  )

  # Output
  #
  #
  ```

## Use Advanced Operators

In this section, you will find examples of how to use advanced operators in scalar filtering. You can apply these filters to [vector searches](https://milvus.io/docs/single-vector-search.md#Filtered-search) and [data deletions](https://milvus.io/docs/insert-update-delete.md#Delete-entities) too.

### Count entities

- Counts the total number of entities in a collection.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      output_fields=["count(*)"]
      # highlight-end
  )

  # Output
  #
  #
  ```

- Counts the total number of entities in specific partitions.

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      output_fields=["count(*)"],
      partition_name="partitionA"
      # highlight-end
  )

  # Output
  #
  #

  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      output_fields=["count(*)"],
      partition_name="partitionB"
      # highlight-end
  )

  # Output
  #
  #
  ```

- Counts the number of entities that match a filtering condition

  ```python
  res = client.query(
      collection_name="quick_setup",
      # highlight-start
      filter='(publication == "Towards Data Science") and ((claps > 1500 and responses > 15) or (10 < reading_time < 15))',
      output_fields=["count(*)"],
      # highlight-end
  )

  # Output
  #
  #
  ```

## Reference on scalar filters

### Basic Operators

A **boolean expression** is always **a string comprising field names joined by operators**. In this section, you will learn more about basic operators.

| **Operator**    | **Description**                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **add (&&)**    | True if both operands are true                                                                                                          |
| **or (\|\|)**   | True if either operand is true                                                                                                          |
| **+, -, \*, /** | Addition, subtraction, multiplication, and division                                                                                     |
| **\*\***        | Exponent                                                                                                                                |
| **%**           | Modulus                                                                                                                                 |
| **<, >**        | Less than, greater than                                                                                                                 |
| **==, !=**      | Equal to, not equal to                                                                                                                  |
| **<=, >=**      | Less than or equal to, greater than or equal to                                                                                         |
| **not**         | Reverses the result of a given condition.                                                                                               |
| **like**        | Compares a value to similar values using wildcard operators.<br/> For example, like "prefix%" matches strings that begin with "prefix". |
| **in**          | Tests if an expression matches any value in a list of values.                                                                           |

### Advanced operators

- `count(*)`

  Counts the exact number of entities in the collection. Use this as an output field to get the exact number of entities in a collection or partition.

    <div class="admonition note">

    <p><b>notes</b></p>

    <p>This applies to loaded collections. You should use it as the only output field.</p>

    </div>
