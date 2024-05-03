---
title: 快速入门
---

# 快速入门

本指南解释了如何连接到您的 Milvus 集群，并在几分钟内执行 CRUD 操作。

## 开始之前

- 您已安装了 [Milvus 独立部署](https://milvus.io/docs/install_standalone-docker.md) 或 [Milvus 集群](https://milvus.io/docs/install_cluster-milvusoperator.md)。

- 您已安装了首选的 SDK。您可以选择包括 [Python](https://milvus.io/docs/install-pymilvus.md)、[Java](https://milvus.io/docs/install-java.md)、[Go](https://milvus.io/docs/install-go.md) 和 [Node.js](https://milvus.io/docs/install-node.md) 在内的各种语言。

## Hello Milvus

为了确认您的 Milvus 实例正在运行并且 Python SDK 设置正确，首先下载 `hello_milvus.py` 脚本。您可以使用以下命令执行此操作：

```bash
wget https://raw.githubusercontent.com/milvus-io/milvus-docs/v2.4.x/assets/hello_milvus.py
```

接下来，更新脚本中的 `uri` 参数为您的 Milvus 实例地址。更新后，使用以下命令运行脚本：

```python
python hello_milvus.py
```

如果脚本执行没有返回任何错误消息，您的 Milvus 实例正在正常运行，并且 Python SDK 已正确安装。

## 连接到 Milvus

一旦您获得了集群凭据或 API 密钥，现在就可以使用它连接到您的 Milvus。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)
```

<div class="alert note">

<p>如果您在 Milvus 实例上启用了身份验证，您应该在初始化 MilvusClient 时添加 `token` 作为参数，并将值设置为用冒号分隔的用户名和密码。要使用默认的用户名和密码进行身份验证，请将 `token` 设置为 `root:Milvus`。</p>

</div>

## 创建集合

在 Milvus 中，您需要将向量嵌入存储在集合中。存储在集合中的所有向量嵌入共享相同的维度和用于测量相似性的距离度量。您可以以以下任一方式创建集合。

### 快速设置

要快速设置集合，您只需要设置集合名称和集合的向量字段的维度。

```python
# 2. 在快速设置模式下创建集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5
)
```

在上面的设置中，

- 主键和向量字段使用它们的默认名称（__id__ 和 __vector__）。

- 度量类型也设置为其默认值（__COSINE__）。

- 主键字段接受整数，并且不会自动递增。

- 使用名为 __$meta__ 的保留 JSON 字段来存储非模式定义的字段及其值。

<div class="admonition note">

<p><b>注意</b></p>

<p>使用 RESTful API 创建的集合支持至少 32 维的向量字段。</p>

</div>

### 自定义设置

要自己定义集合模式，使用自定义设置。通过这种方式，您可以定义集合中每个字段的属性，包括其名称、数据类型和特定字段的额外属性。

```python
# 3. 在自定义设置模式下创建集合

# 3.1. 创建模式
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. 向模式添加字段
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# 3.3. 准备索引参数
index_params = client.prepare_index_params()

# 3.4. 添加索引
index_params.add_index(
    field_name="my_id"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="IP"
)

# 3.5. 创建集合
client.create_collection(
    collection_name="customized_setup",
    schema=schema,
    index_params=index_params
)
```

在上面的设置中，您有灵活性在创建集合时定义集合的各个方面，包括其模式和索引参数。

- __Schema__

  架构定义集合的结构。除了如上所述添加预定义字段并设置其属性外，您还可以选择启用和禁用

    - __AutoID__

      是否启用集合以自动递增主字段。

    - __Dynamic Field__

      是否使用保留的JSON字段__$meta__来存储非架构定义的字段及其值。

   有关模式的详细说明，请参阅 [Schema](schema.md).

- __Index parameters__

  索引参数决定Milvus如何在集合中组织数据。您可以通过配置字段的 `__metric types__` 和 `__index types__` 来为字段分配特定索引。

  - 对于矢量字段，可以使用__AUTOINDEX__作为索引类型，并使用__COSINE__、__L2__或__IP__作为`metric_type`。

  - 对于标量字段，包括主字段，Milvus对整数使用__TRIE__，对字符串使用__STL_SORT__。

有关索引类型的其他见解，请参阅[索引](index.md).

<div class="admonition note">

<p><b>notes</b></p>

<p>The collection created in the preceding code snippets are automatically loaded. If you prefer not to create an automatically loaded collection, refer to <a href="https://milvus.io/docs/manage-collections.md">Manage Collections</a>.</p>
<p>Collections created using the RESTful API are always automatically loaded.</p>

</div>

## 插入数据

已对以上述任一方式创建的集合进行了索引和加载。准备好后，插入一些示例数据。

```python
# 4. Insert data into the collection
# 4.1. Prepare data
data=[
    {"id": 0, "vector": [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], "color": "pink_8682"},
    {"id": 1, "vector": [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104], "color": "red_7025"},
    {"id": 2, "vector": [0.43742130801983836, -0.5597502546264526, 0.6457887650909682, 0.7894058910881185, 0.20785793220625592], "color": "orange_6781"},
    {"id": 3, "vector": [0.3172005263489739, 0.9719044792798428, -0.36981146090600725, -0.4860894583077995, 0.95791889146345], "color": "pink_9298"},
    {"id": 4, "vector": [0.4452349528804562, -0.8757026943054742, 0.8220779437047674, 0.46406290649483184, 0.30337481143159106], "color": "red_4794"},
    {"id": 5, "vector": [0.985825131989184, -0.8144651566660419, 0.6299267002202009, 0.1206906911183383, -0.1446277761879955], "color": "yellow_4222"},
    {"id": 6, "vector": [0.8371977790571115, -0.015764369584852833, -0.31062937026679327, -0.562666951622192, -0.8984947637863987], "color": "red_9392"},
    {"id": 7, "vector": [-0.33445148015177995, -0.2567135004164067, 0.8987539745369246, 0.9402995886420709, 0.5378064918413052], "color": "grey_8510"},
    {"id": 8, "vector": [0.39524717779832685, 0.4000257286739164, -0.5890507376891594, -0.8650502298996872, -0.6140360785406336], "color": "white_9381"},
    {"id": 9, "vector": [0.5718280481994695, 0.24070317428066512, -0.3737913482606834, -0.06726932177492717, -0.6980531615588608], "color": "purple_4976"}
]

# 4.2. Insert data
res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# Output
#
# {
#     "insert_count": 10,
#     "ids": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# }
```

提供的代码假设您已经以 `__Quick Setup__` 方式创建了一个集合。如上述代码所示，

- 要插入的数据被组织到字典列表中，其中每个字典表示一个数据记录，称为一个实体。

- 每个字典都包含一个名为 `__color__` 的非模式定义字段。

- 每个字典都包含对应于预定义字段和动态字段的关键字。

<div class="admonition note">

<p><b>notes</b></p>

<p>Collections created using RESTful API enabled AutoID, and therefore you need to skip the primary field in the data to insert.</p>

</div>

### 插入更多数据

如果以后希望使用插入的10个实体进行搜索，则可以安全地跳过此部分。要了解更多关于Milvus搜索性能的信息，建议您使用以下代码片段将更多随机生成的实体添加到集合中。

```python
# 5. Insert more data into the collection
# 5.1. Prepare data

colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {
    "id": i, 
    "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
    "color": f"{random.choice(colors)}_{str(random.randint(1000, 9999))}" 
} for i in range(1000) ]

# 5.2. Insert data
res = client.insert(
    collection_name="quick_setup",
    data=data[10:]
)

print(res)

# Output
#
# {
#     "insert_count": 990
# }
```

<div class="admonition note">

<p><b>notes</b></p>

<p>You can insert a maximum of 100 entities in a batch upon each call to the Insert RESTful API.</p>

</div>

## 相似性搜索

可以基于一个或多个向量嵌入进行相似性搜索。

<div class="admonition note">

<p><b>notes</b></p>

<p>The insert operations are asynchronous, and conducting a search immediately after data insertions may result in empty result set. To avoid this, you are advised to wait for a few seconds.</p>

</div>

### 单矢量搜索

`__query_vectors__` 变量的值是一个包含浮动子列表的列表。子列表表示5个维度的矢量嵌入。

```python
# 6. Search with a single vector
# 6.1. Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 6.2. Start search
res = client.search(
    collection_name="quick_setup",     # target collection
    data=query_vectors,                # query vectors
    limit=3,                           # number of returned entities
)

print(res)

# Output
#
# [
#     [
#         {
#             "id": 548,
#             "distance": 0.08589144051074982,
#             "entity": {}
#         },
#         {
#             "id": 736,
#             "distance": 0.07866684347391129,
#             "entity": {}
#         },
#         {
#             "id": 928,
#             "distance": 0.07650312781333923,
#             "entity": {}
#         }
#     ]
# ]

```

输出是一个列表，其中包含三个字典的子列表，表示返回的实体及其ID和距离。

### 批量矢量搜索

您还可以在 `__query_vectors__` 变量中包含多个矢量嵌入，以进行批量相似性搜索。

```python
# 7. Search with multiple vectors
# 7.1. Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648],
    [0.0039737443, 0.003020432, -0.0006188639, 0.03913546, -0.00089768134]
]

# 7.2. Start search
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    limit=3,
)

print(res)

# Output
#
# [
#     [
#         {
#             "id": 548,
#             "distance": 0.08589144051074982,
#             "entity": {}
#         },
#         {
#             "id": 736,
#             "distance": 0.07866684347391129,
#             "entity": {}
#         },
#         {
#             "id": 928,
#             "distance": 0.07650312781333923,
#             "entity": {}
#         }
#     ],
#     [
#         {
#             "id": 532,
#             "distance": 0.044551681727170944,
#             "entity": {}
#         },
#         {
#             "id": 149,
#             "distance": 0.044386886060237885,
#             "entity": {}
#         },
#         {
#             "id": 271,
#             "distance": 0.0442606583237648,
#             "entity": {}
#         }
#     ]
# ]

```

输出应该是两个子列表的列表，每个子列表包含三个字典，用它们的ID和距离表示返回的实体。

### 筛选的搜索

- __With schema-defined fields__

    You can also enhance the search result by including a filter and specifying certain output fields in the search request.

    ```python
    # 8. Search with a filter expression using schema-defined fields
    # 1 Prepare query vectors
    query_vectors = [
        [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
    ]
    
    # 2. Start search
    res = client.search(
        collection_name="quick_setup",
        data=query_vectors,
        filter="500 < id < 800",
        limit=3
    )
    
    print(res)
    
    # Output
    #
    # [
    #     [
    #         {
    #             "id": 548,
    #             "distance": 0.08589144051074982,
    #             "entity": {}
    #         },
    #         {
    #             "id": 736,
    #             "distance": 0.07866684347391129,
    #             "entity": {}
    #         },
    #         {
    #             "id": 505,
    #             "distance": 0.0749310627579689,
    #             "entity": {}
    #         }
    #     ]
    # ]
    ```

  输出应该是一个包含三个字典的子列表的列表，每个字典代表一个搜索到的实体及其ID、距离和指定的输出字段。

- __With non-schema-defined fields__

  也可以在过滤器表达式中包含动态字段。在下面的代码片段中，“color”是一个非模式定义的字段。您可以将它们作为键包含在神奇的“$meta”字段中，如“$meta[“color”]'，也可以像模式定义的字段一样直接使用它，如“color'”。

    ```python
    # 9. Search with a filter expression using custom fields
    # 9.1.Prepare query vectors
    query_vectors = [
        [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
    ]
    
    # 9.2.Start search
    res = client.search(
        collection_name="quick_setup",
        data=query_vectors,
        filter='$meta["color"] like "red%"',
        limit=3,
        output_fields=["color"]
    )
    
    print(res)
    
    # Output
    #
    # [
    #     [
    #         {
    #             "id": 240,
    #             "distance": 0.0694073885679245,
    #             "entity": {
    #                 "color": "red_8667"
    #             }
    #         },
    #         {
    #             "id": 581,
    #             "distance": 0.059804242104291916,
    #             "entity": {
    #                 "color": "red_1786"
    #             }
    #         },
    #         {
    #             "id": 372,
    #             "distance": 0.049707964062690735,
    #             "entity": {
    #                 "color": "red_2186"
    #             }
    #         }
    #     ]
    # ]
    
    ```

## 标量查询

  与向量相似性搜索不同，查询通过基于[filter expressions](https://milvus.io/docs/boolean.md)的标量过滤来检索向量

- __With filter using schema-defined fields__

    ```python
    # 10. Query with a filter expression using a schema-defined field
    res = client.query(
        collection_name="quick_setup",
        filter="10 < id < 15",
        output_fields=["color"]
    )
    
    print(res)
    
    # Output
    #
    # [
    #     {
    #         "color": "green_7413",
    #         "id": 11
    #     },
    #     {
    #         "color": "orange_1417",
    #         "id": 12
    #     },
    #     {
    #         "color": "orange_6143",
    #         "id": 13
    #     },
    #     {
    #         "color": "white_4084",
    #         "id": 14
    #     }
    # ]
    
    ```

## 获取实体

如果知道要检索的实体的ID，则可以通过实体的ID获取实体，如下所示：

```python
# 12. Get entities by IDs
res = client.get(
    collection_name="quick_setup",
    ids=[1,2,3],
    output_fields=["title", "vector"]
)

print(res)

# Output
#
# [
#     {
#         "id": 1,
#         "vector": [
#             0.19886813,
#             0.060235605,
#             0.6976963,
#             0.26144746,
#             0.8387295
#         ]
#     },
#     {
#         "id": 2,
#         "vector": [
#             0.43742132,
#             -0.55975026,
#             0.6457888,
#             0.7894059,
#             0.20785794
#         ]
#     },
#     {
#         "id": 3,
#         "vector": [
#             0.3172005,
#             0.97190446,
#             -0.36981148,
#             -0.48608947,
#             0.9579189
#         ]
#     }
# ]
```

<div class="admonition note">

<p><b>notes</b></p>

<p>Currently, the RESTful API does not provide a get endpoint.</p>

</div>

## 删除实体

Milvus允许通过ID和过滤器删除实体。

- __Delete entities by IDs.__

    ```python
    # 13. Delete entities by IDs
    res = client.delete(
        collection_name="quick_setup",
        ids=[0,1,2,3,4]
    )
    
    print(res)
    
    # Output
    #
    # {
    #     "delete_count": 5
    # }
    ```

- __Delete entities by filter__

    ```python
    # 14. Delete entities by a filter expression
    res = client.delete(
        collection_name="quick_setup",
        filter="id in [5,6,7,8,9]"
    )
    
    print(res)
    
    # Output
    #
    # {
    #     "delete_count": 5
    # }
    ```

    <div class="admonition note">

    <p><b>notes</b></p>

    <p>Currently, the delete endpoint of the RESTful API does not support filters.</p>

    </div>

## 删除集合

Starter计划允许在无服务器集群中最多有两个集合。完成本指南后，您可以按如下方式删除集合：

```python
# 15. Drop collection
client.drop_collection(
    collection_name="quick_setup"
)

client.drop_collection(
    collection_name="customized_setup"
)
```

## 简要回顾

- 有两种方法可以创建集合。第一种是快速设置，只需要提供矢量场的名称和尺寸。第二个是自定义设置，它允许您自定义集合的几乎所有方面。

- 数据插入过程可能需要一些时间才能完成。建议在插入数据后和进行相似性搜索前等待几秒钟。

- 筛选表达式既可以用于搜索请求，也可以用于查询请求。但是，它们对于查询请求是强制性的。

