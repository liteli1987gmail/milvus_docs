


# 获取和标量查询

该指南演示了如何通过 ID 获取实体并进行标量过滤。标量过滤是根据定义的条件使用布尔表达式对集合中的实体进行过滤。查询结果是与定义的条件匹配的实体集合。与矢量搜索不同，查询是根据特定条件对实体进行过滤，而不是识别与给定矢量最接近的矢量。

在 Milvus 中，**过滤器始终是由运算符连接的字段名称的字符串**。在本指南中，你将找到各种过滤器示例。要了解有关运算符详细信息，请转到 [参考](https://milvus.io/docs/get-and-scalar-query.md#Reference-on-scalar-filters) 部分。

<div class="alert note">

本页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。将来的更新中将发布用于其他语言的新 MilvusClient SDK。

</div>

## 准备工作

以下步骤重用代码以连接到 Milvus，快速设置集合，并将 1000 多个随机生成的实体插入集合中。

### 步骤 1：创建集合

```python
from pymilvus import MilvusClient

# 1. 设置Milvus客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5,
)
```

### 步骤 2：插入随机生成的实体

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

# 4. 插入实体到集合中
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

### 步骤 3：创建分区并插入更多实体




---

id: get-and-scalar-query.md
order: 3
summary: 本指南演示了如何按 ID 获取实体并进行标量过滤。
title: 获取和标量查询

# 获取和标量查询

本指南演示了如何按 ID 获取实体并进行标量过滤。标量过滤根据定义的条件使用布尔表达式对集合中的实体进行过滤。查询结果是与定义条件匹配的一组实体。与向量搜索不同，后者用于识别集合中与给定向量最接近的向量，查询根据特定标准过滤实体。

在 Milvus 中，过滤器始终是一个字符串，其中包含由运算符连接的字段名。在本指南中，你将找到各种过滤器示例。要了解有关运算符详细信息，请转到 [参考](https://milvus.io/docs/get-and-scalar-query.md#标量过滤器参考) 部分。

<div class="alert note">

此页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

以下步骤重用代码以连接到 Milvus，快速设置一个集合，并将超过 1000 个随机生成的实体插入到集合中。

### 步骤 1：创建集合

```python
from pymilvus import MilvusClient

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

### 步骤 2：插入随机生成的实体

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

# 4. 将实体插入到集合中
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

### 步骤 3：创建分区并插入更多实体

```python
# 5. 创建两个分区
client.create_partition(collection_name="quick_setup", partition_name="partitionA")
client.create_partition(collection_name="quick_setup", partition_name="partitionB")

# 6. 在分区 A 中插入 500 个实体
  


# 5. 创建两个分区
client.create_partition(collection_name="quick_setup", partition_name="partitionA")
client.create_partition(collection_name="quick_setup", partition_name="partitionB")

# 6. 在分区A中插入500个实体
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

# 7. 在分区B中插入300个实体
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

# 输出
#
# {
#     "insert_count": 300
# }


## 通过ID获取实体





如果你知道感兴趣的实体的ID，可以使用`get()`方法。

``` python
# 4. 根据 ID 获取实体
res = client.get(
    collection_name = "quick_setup",
    ids = [0, 1, 2]
)

print(res)

# 输出
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

### 从分区获取实体



前往特定分区获取实体。

``` python
# 5. 从分区获取实体
res = client.get(
    collection_name = "quick_setup",
    ids = [0, 1, 2],
    partition_names =["_default "]
)

print(res)

# 输出
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

## 使用基本运算符



在本节中，你将找到如何在标量过滤中使用基本运算符的示例。你可以将这些过滤器应用于[向量搜索](https://milvus.io/docs/single-vector-search.md#Filtered-search)和[数据删除](https://milvus.io/docs/insert-update-delete.md#Delete-entities)。

- 过滤标签值在1,000到1,500之间的实体。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter =" 1000 < tag < 1500 ",
        output_fields = ["color_tag"],
        # highlight-end
        limit = 3
    )
    
    # 输出
    #
    # 
    ```

- 过滤颜色值设置为红色的实体。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter ='color == "brown"',
        output_fields = ["color_tag"],
        # highlight-end
        limit = 3
    )
    
    # 输出
    #
    # 
    ```

- 过滤颜色值未设置为绿色和紫色的实体。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter ='color not in ["green", "purple"]',
        output_fields = ["color_tag"],
        # highlight-end
        limit = 3
    )
    
    # 输出
    #
    # 
    ```

- 过滤颜色标签以"red"开头的文章。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter ='color_tag like "red%"',
        output_fields = ["color_tag"],
        # highlight-end
        limit = 3
    )
    
    # 输出
    #
    # 
    ```

- 过滤颜色设置为红色且标签值在1,000到1,500之间的实体。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter ='(color == "red") and (1000 < tag < 1500)',
        output_fields = ["color_tag"],
        # highlight-end
        limit = 3
    )
    
    # 输出
    #
    # 
    ```

## 使用高级操作符

在本节中，你将找到在标量过滤中如何使用高级操作符的示例。你可以将这些过滤器应用于[向量搜索](https://milvus.io/docs/single-vector-search.md#Filtered-search)和[数据删除](https://milvus.io/docs/insert-update-delete.md#Delete-entities)。

### 计数实体



        

- 统计集合中的实体总数。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        output_fields =[" count(*)"]
        # highlight-end
    )
    
    # 输出
    #
    # 
    ```

- 统计特定分区中的实体总数。

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        output_fields =[" count(*)"],
        partition_name = "partitionA"
        # highlight-end
    )
    
    # 输出
    #
    # 
    
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        output_fields =[" count(*)"],
        partition_name = "partitionB"
        # highlight-end
    )
    
    # 输出
    #
    # 
    ```

- 统计满足过滤条件的实体数

    ``` python
    res = client.query(
        collection_name = "quick_setup",
        # highlight-start
        filter ='(publication == "Towards Data Science") and ((claps > 1500 and responses > 15) or (10 < reading_time < 15))',
        output_fields =[" count(*)"],
        # highlight-end
    )
    
    # 输出
    #
    # 
    ```

## 标量过滤器参考

### 基本运算符

__布尔表达式__ 总是 __由操作符连接的字段名称字符串__。在本节中，你将了解更多关于基本运算符的信息。

|  __运算符__   |  __描述__                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
|  __add (&&)__   |  当两个操作数都为 true 时，结果为 True                                                                                                    |
|  __or (\|\|)__  |  当两个操作数中任一操作数为 true 时，结果为 True                                                                                           |
|  __+, -, *, /__ |  加法、减法、乘法和除法                                                                                                                           |
|  __**__         |  指数                                                                                                                                   |
|  __%__          |  取模                                                                                                                                    |
|  __<, >__       |  小于，大于                                                                                                                    |
|  __==, !=__     |  等于，不等于                                                                                                                     |
|  __<=, >=__     |  小于等于，大于等于                                                                                            |
|  __not__        |  反转给定条件的结果                                                                                                  |
|  __like__       |  使用通配符操作符将一个值与类似值进行比较。<br/> 例如，like "prefix%" 匹配以 "prefix" 开头的字符串。 |
|  __in__         |  测试一个表达式是否与值列表中的任何值匹配。                                                                              |

### 高级运算符




- `count(*)`

    统计集合中实体的准确数量。将其用作输出字段，以获得集合或分区中实体的准确数量。

    <div class="admonition note">

    <p><b>注：</b></p>

    <p>此适用于已加载的集合。你应将其作为唯一的输出字段。</p>

    </div>

