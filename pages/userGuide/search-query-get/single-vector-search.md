


# 单向量搜索

一旦你插入了数据，下一步就是在 Milvus 的集合中执行相似性搜索。

Milvus 允许你根据集合中的向量字段数量执行两种类型的搜索：

- **单向量搜索**：如果你的集合只有一个向量字段，请使用 [`search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/MilvusClient/Vector/search.md) 方法来查找最相似的实体。该方法将你的查询向量与集合中现有的向量进行比较，并返回最接近的匹配项的 ID 以及它们之间的距离。可选地，它还可以返回结果的向量值和元数据。
- **多向量搜索**：对于具有两个或更多向量字段的集合，请使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法。该方法执行多个近似最近邻（ANN）搜索请求，并将结果合并以返回重新排列后的最相关匹配项。

本文介绍了如何在 Milvus 中执行单向量搜索。有关多向量搜索的详细信息，请参阅 [multi-vector search](/userGuide/search-query-get/multi-vector-search.md)。

## 概述

有多种搜索类型可满足不同的需求：

- [基本搜索](https://milvus.io/docs/single-vector-search.md#Basic-search)：包括单向量搜索、批量向量搜索、分区搜索和具有指定输出字段的搜索。

- [过滤搜索](https://milvus.io/docs/single-vector-search.md#Filtered-search)：根据标量字段应用筛选条件来细化搜索结果。

- [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search)：查找与查询向量在特定距离范围内的向量。

- [分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search)：根据特定字段对搜索结果进行分组，以确保结果的多样性。

<div class="alert note">

本页面上的代码段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在以后的更新中发布。

</div>

## 准备工作

下面的代码段重新使用现有代码来与 Milvus 建立连接并快速设置一个集合。

```python
from pymilvus import MilvusClient

# 1. 设置一个Milvus客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 插入随机生成的向量
colors = ["绿色", "蓝色", "黄色", "红色", "黑色", "白色", "紫色", "粉色", "橙色", "棕色", "灰色"]
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

当发送 `search` 请求时，可以提供一个或多个向量值来表示查询的嵌入向量，并提供一个 `limit` 值来指示返回的结果数量。

根据你的数据和查询向量，可能会获得少于 `limit` 的结果。当 `limit` 大于查询的可能匹配向量数量时，就会发生这种情况。

### 单向量搜索




单向量搜索是 Milvus 中最简单的 `搜索` 操作形式，旨在找到与给定查询向量最相似的向量。

要执行单向量搜索，请指定目标集合名称、查询向量和所需结果数（`limit`）。该操作返回一个结果集，其中包括最相似的向量、它们的 ID 以及与查询向量的距离。

下面是搜索与查询向量最相似的前 5 个实体的示例：

```python
# 单向量搜索
res = client.search(
    collection_name="test_collection", # 用你的集合的实际名称替换
    # 用你的查询向量替换
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}} # 搜索参数
)

# 将输出转换为格式化的JSON字符串
result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 0,
            "distance": 1.4093276262283325,
            "entity": {}
        },
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {}
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {}
        },
        {
            "id": 5,
            "distance": 0.7972343564033508,
            "entity": {}
        },
        {
            "id": 2,
            "distance": 0.5928734540939331,
            "entity": {}
        }
    ]
]
```

输出展示了与查询向量最接近的前 5 个邻居，包括它们的唯一 ID 和计算出的距离。

### 批量向量搜索


批量向量搜索扩展了 [单向量搜索](https://milvus.io/docs/single-vector-search.md#Single-Vector-Search) 的概念，它允许在单个请求中搜索多个查询向量。这种类型的搜索非常适合需要为一组查询向量找到相似向量的场景，显著减少了所需的时间和计算资源。

在批量向量搜索中，你可以在 `data` 字段中包含多个查询向量。系统将并行处理这些向量，为每个查询向量返回单独的结果集，每个结果集包含在集合中找到的最接近匹配项。

以下是一个使用两个查询向量搜索两组最相似实体的示例：

```python
# 批量向量搜索
res = client.search(
    collection_name="test_collection", # 替换为你的集合的实际名称
    data=[
        [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104],
        [0.3172005263489739, 0.9719044792798428, -0.36981146090600725, -0.4860894583077995, 0.95791889146345]
    ], # 替换为你的查询向量
    limit=2, # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}} # 搜索参数
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 1,
            "distance": 1.3017789125442505,
            "entity": {}
        },
        {
            "id": 7,
            "distance": 1.2419954538345337,
            "entity": {}
        }
    ], # 结果集 1
    [
        {
            "id": 3,
            "distance": 2.3358664512634277,
            "entity": {}
        },
        {
            "id": 8,
            "distance": 0.5642921924591064,
            "entity": {}
        }
    ] # 结果集 2
]
```

结果包括两组最近邻，每组对应一个查询向量，展示了批量向量搜索在同时处理多个查询向量时的效率。

### 分区搜索


# Partition search

Partition 搜索将你的搜索范围缩小到集合的特定子集或分区。这对于有组织的数据集特别有用，其中数据分为逻辑或分类部分，可以通过减少要扫描的数据量来加快搜索操作速度。

要进行分区搜索，只需在搜索请求的 `partition_names` 中包含目标分区的名称。这指定 `search` 操作仅考虑指定分区内的向量。

下面是在 `partition_1` 中搜索实体的示例：

```python
# 搜索在partition_1中的实体
res = client.search(
    collection_name="test_collection",  # 替换为实际集合的名称
    data=[[0.02174828545444263, 0.058611125483182924, 0.6168633415965343, -0.7944160935612321, 0.5554828317581426]],
    limit=5,  # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}},  # 搜索参数
    partition_names=["partition_1"]  # 要搜索的分区名称
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 16,
            "distance": 0.9200337529182434,
            "entity": {}
        },
        {
            "id": 14,
            "distance": 0.4505271911621094,
            "entity": {}
        },
        {
            "id": 15,
            "distance": 0.19924677908420563,
            "entity": {}
        },
        {
            "id": 17,
            "distance": 0.0075093843042850494,
            "entity": {}
        },
        {
            "id": 13,
            "distance": -0.14609718322753906,
            "entity": {}
        }
    ]
]
```

然后，在 `partition_2` 中搜索实体：

```python
# 创建MilvusClient实例
client = MilvusClient(
    uri="http://localhost:19530",
)

# 搜索在partition_2中的实体
res = client.search(
    collection_name="test_collection",  # 替换为实际集合的名称
    data=[[-0.2798451532635784, 0.9486592746891414, -0.9311928407781922, 0.1830057032090473, 0.6962886429672028]],
    limit=5,  # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}},  # 搜索参数
    partition_names=["partition_2"]  # 要搜索的分区名称
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 20,
            "distance": 2.363696813583374,
            "entity": {}
        },
        {
            "id": 26,
            "distance": 1.0665391683578491,
            "entity": {}
        },
        {
            "id": 23,
            "distance": 1.066049575805664,
            "entity": {}
        },
        {
            "id": 29,
            "distance": 0.8353596925735474,
            "entity": {}
        }
    ]
]
```


## 标题

## 段落

## 列表

- `partition_1` 中的数据与 `partition_2` 中的不同。因此，搜索结果将被限制在指定的分区中，反映该子集的独特特征和数据分布。

- 搜索输出字段

    - 搜索输出字段允许你指定应在搜索结果中包含的匹配向量的属性或字段。

    - 你可以在请求中指定 `output_fields` 以返回具有特定字段的结果。

- 以下是一个返回带有 `color` 属性值结果的示例：

    ```python
    # 搜索输出字段
    res = client.search(
        collection_name="test_collection", # 替换为你的集合的实际名称
        data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
        limit=5, # 返回的搜索结果的最大数量
        search_params={"metric_type": "IP", "params": {}}, # 搜索参数
        output_fields=["color"] # 返回的输出字段
    )

    result = json.dumps(res, indent=4)
    print(result)
    ```

    输出类似于以下内容：

    ```python
    [
        [
            {
                "id": 0,
                "distance": 1.4093276262283325,
                "entity": {
                    "color": "pink_8682"
                }
            },
            {
                "id": 16,
                "distance": 1.0159327983856201,
                "entity": {
                    "color": "yellow_1496"
                }
            },
            {
                "id": 4,
                "distance": 0.9902134537696838,
                "entity": {
                    "color": "red_4794"
                }
            },
            {
                "id": 14,
                "distance": 0.9803846478462219,
                "entity": {
                    "color": "green_2899"
                }
            },
            {
                "id": 1,
                "distance": 0.8519943356513977,
                "entity": {
                    "color": "red_7025"
                }
            }
        ]
    ]
    ```

- 除了最近的邻居外，搜索结果还将包括指定的字段 `color`，为每个匹配的向量提供更丰富的信息集。

## 过滤搜索


Filtered search 应用标量过滤器到向量搜索，允许你根据特定条件来细化搜索结果。你可以在 [布尔表达式规则](/reference/boolean.md) 中找到有关过滤器表达式的更多信息，并在 [获取和标量查询](/userGuide/search-query-get/get-and-scalar-query.md) 中找到示例。

例如，要根据字符串模式细化搜索结果，你可以使用 __like__ 运算符。该运算符通过考虑前缀、中缀和后缀来进行字符串匹配：

- 要匹配以特定前缀开头的值，使用语法 __'like "prefix%"'__。

- 要匹配在字符串中包含特定字符序列的值，使用语法 __'like "%infix%"'__。

- 要匹配以特定后缀结尾的值，使用语法 __'like "%suffix"'__。

- 还可以使用 __like__ 运算符进行单字符匹配，使用下划线（_）表示任何单个字符。例如，_ _'like "y_llow"'__。

过滤颜色以 __red__ 开头的结果：

```python
# 使用过滤器进行搜索
res = client.search(
    collection_name="test_collection", # 替换为你的集合的实际名称
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}}, # 搜索参数
    output_fields=["color"], # 返回的输出字段
    filter='color like "red%"'
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {
                "color": "red_4794"
            }
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {
                "color": "red_7025"
            }
        },
        {
            "id": 6,
            "distance": -0.4113418459892273,
            "entity": {
                "color": "red_9392"
            }
        }
    ]
]
```

过滤颜色字段任意位置包含字母对 __ll__ 的结果：

```python
# 在颜色字段上进行中缀匹配
res = client.search(
    collection_name="test_collection", # 替换为你的集合的实际名称
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # 返回的搜索结果的最大数量
    search_params={"metric_type": "IP", "params": {}}, # 搜索参数
    output_fields=["color"], # 返回的输出字段
    filter='color like "%ll%"' # 在颜色字段上进行过滤，中缀匹配 "ll"
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 5,
            "distance": 0.7972343564033508,
            "entity": {
                "color": "yellow_4222"
            }
        }
    ]
]
```

## 范围搜索



Range search 允许你找到与查询向量距离在指定范围内的向量。

通过设置 `radius` 和可选的 `range_filter`，你可以调整搜索的广度，包括与查询向量相似的向量，从而提供更全面的潜在匹配结果。

- `radius`：定义搜索空间的外部边界。只有距离查询向量在此距离内的向量被认为是潜在的匹配项。

- `range_filter`：虽然 `radius` 设置了搜索的外部限制，但可以选择使用 `range_filter` 来定义内部边界，创建一个距离范围，在此范围内的向量将被视为匹配项。

```python
# 进行范围搜索
search_params = {
    "metric_type": "IP",
    "params": {
        "radius": 0.8, # 搜索圆的半径
        "range_filter": 1.0 # 范围过滤器，用于过滤掉不在搜索圆内的向量
    }
}

res = client.search(
    collection_name="test_collection", # 用实际的集合名称替换
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=3, # 最多返回的搜索结果数量
    search_params=search_params, # 搜索参数
    output_fields=["color"], # 返回的输出字段
)

result = json.dumps(res, indent=4)
print(result)
```

输出类似于以下内容：

```python
[
    [
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {
                "color": "red_4794"
            }
        },
        {
            "id": 14,
            "distance": 0.9803846478462219,
            "entity": {
                "color": "green_2899"
            }
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {
                "color": "red_7025"
            }
        }
    ]
]
```

你会观察到返回的所有实体都具有与查询向量的距离在 0.8 到 1.0 的范围内。

`radius` 和 `range_filter` 的参数设置根据使用的度量类型而有所不同。

|  __度量类型__ |  __特征__                                                              |  __范围搜索设置__                                                                                     |
| ------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|  `L2`        | 较小的 L2 距离表示较高的相似度。                                         | 要排除最接近的向量，请确保：<br/> `range_filter` <= distance < `radius`                          |
|  `IP`        | 较大的 IP 距离表示较高的相似度。                                          | 要排除最接近的向量，请确保：<br/> `radius` < distance <= `range_filter`                           |

## 分组搜索



在 Milvus 中，通过特定字段进行分组搜索可以避免结果中相同字段项的冗余。你可以获得特定字段的不同结果集。

考虑一个包含多个文档的集合，每个文档被分割成多个段落。每个段落由一个向量嵌入表示，并属于一个文档。为了找到相关文档而不是相似段落，你可以在 `search()` 操作中的 `group_by_field` 参数中包含文档 ID 来对结果进行分组。这有助于返回最相关和唯一的文档，而不是同一文档的独立段落。

下面是按字段分组搜索结果的示例代码：

```python
# Connect to Milvus
client = MilvusClient(uri='http://localhost:19530') # Milvus服务器地址

# Load data into collection
client.load_collection("group_search") # 集合名称

# Group search results
res = client.search(
    collection_name="group_search", # 集合名称
    data=[[0.14529211512077012, 0.9147257273453546, 0.7965055218724449, 0.7009258593102812, 0.5605206522382088]], # 查询向量
    search_params={
    "metric_type": "L2",
    "params": {"nprobe": 10},
    }, # 搜索参数
    limit=10, # 返回的最大搜索结果数
    group_by_field="doc_id", # 按文档ID分组结果
    output_fields=["doc_id", "passage_id"]
)

# 提取`doc_id`列中的值
doc_ids = [result['entity']['doc_id'] for result in res[0]]

print(doc_ids)
```

输出类似于以下内容：

```python
[5, 10, 1, 7, 9, 6, 3, 4, 8, 2]
```

可以观察到输出结果中不包含重复的 `doc_id` 值。

为了比较，让我们注释掉 `group_by_field` 并进行常规搜索：

```python
# Connect to Milvus
client = MilvusClient(uri='http://localhost:19530') # Milvus服务器地址

# Load data into collection
client.load_collection("group_search") # 集合名称

# 没有`group_by_field`的搜索
res = client.search(
    collection_name="group_search", # 集合名称
    data=query_passage_vector, # 替换为你的查询向量
    search_params={
    "metric_type": "L2",
    "params": {"nprobe": 10},
    }, # 搜索参数
    limit=10, # 返回的最大搜索结果数
    # group_by_field="doc_id", # 按文档ID分组结果
    output_fields=["doc_id", "passage_id"]
)

# 提取`doc_id`列中的值
doc_ids = [result['entity']['doc_id'] for result in res[0]]

print(doc_ids)
```

输出类似于以下内容：

```python
[1, 10, 3, 10, 1, 9, 4, 4, 8, 6]
```

可以观察到输出结果中包含重复的 `doc_id` 值。

__限制__

- __索引__：此分组功能仅适用于采用 __HNSW__、__IVF_FLAT__ 或 __FLAT__ 类型进行索引的集合。更多信息，请参阅 [内存索引](https://milvus.io/docs/index.md#HNSW)。

- __向量__：目前，分组搜索不支持 __BINARY_VECTOR__ 类型的向量字段。有关数据类型的更多信息，请参阅 [支持的数据类型](https://milvus.io/docs/schema.md#Supported-data-types)。

- __字段__：目前，分组搜索只允许使用单个列。不能在 `group_by_field` 配置中指定多个字段名。此外，组合搜索与 JSON、FLOAT、DOUBLE、ARRAY 或向量字段的数据类型不兼容。

- __性能影响__：请注意，随着查询向量数量的增加，性能会下降。使用具有 2 个 CPU 核心和 8GB 内存的集群作为示例，随着输入查询向量数量的增加，分组搜索的执行时间将成比例增加。

- __功能__：目前，分组搜索不受 [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search)、[搜索迭代器](https://milvus.io/docs/with-iterators.md#Search-with-iterator) 或 [多向量搜索](multi-vector-search.md) 的支持。

## 搜索参数


                
在上述搜索中，除了范围搜索以外，默认的搜索参数适用。在正常情况下，你不需要手动设置搜索参数。

```python
# 在正常情况下，你不需要手动设置搜索参数
# 除了范围搜索。
search_parameters = {
    'metric_type': 'L2',
    'params': {
        'nprobe': 10,
        'level': 1，
        'radius': 1.0
        'range_filter': 0.8
    }
}
```

下表列出了搜索参数中的所有可能设置。

|  __参数名称__    |  __参数描述__                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  `metric_type`         |  如何衡量向量嵌入之间的相似度。<br/> 可能的值为 `IP`，`L2` 和 `COSINE`，默认值为加载的索引文件的值。      |
|  `params.nprobe`       |  搜索过程中要查询的单元数。<br/> 值落在范围 [1, nlist <sub>[1] </sub>] 之内。                                                     |
|  `params.level`        |  搜索精度级别。<br/> 可能的值为 `1`，`2` 和 `3`，默认为 `1`。较高的值可提供更准确的结果，但性能更慢。  |
|  `params.radius`       |  查询向量和候选向量之间的最小相似度。<br/> 值落在范围 [1, nlist <sub>[1] </sub>] 之内。                              |
|  `params.range_filter` |  相似度范围，可选择在该范围内细化向量的搜索。<br/> 值落在范围 [top-K <sub>[2] </sub>, ∞] 之内。           |

<div class="admonition note">

<p> <b> 注解 </b> </p>

<p> [1] 索引后的群集单元数。当索引集合时，Milvus 将向量数据分成多个群集单元，其数量因实际索引设置而异。</p>
<p> [2] 搜索中返回的实体数。</p>

</div>

 