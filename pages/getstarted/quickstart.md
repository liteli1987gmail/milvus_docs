


# 快速开始

本指南介绍如何在几分钟内连接到你的 Milvus 集群并执行 CRUD 操作

## 开始之前

- 你已经安装了 [Milvus 独立版](/getstarted/standalone/install_standalone-docker.md) 或 [Milvus 集群](/getstarted/cluster/install_cluster-milvusoperator.md)。

- 你已经安装了首选的 SDK。你可以选择多种语言，包括 [Python](/getstarted/install_SDKs/install-pymilvus.md)、[Java](/getstarted/install_SDKs/install-java.md)、[Go](/getstarted/install_SDKs/install-go.md) 和 [Node.js](/getstarted/install_SDKs/install-node.md)。

## 你好，Milvus

为了确认你的 Milvus 实例正在运行并且 Python SDK 已正确设置，首先下载 `hello_milvus.py` 脚本。你可以使用以下命令完成此操作：

```bash
wget https://raw.githubusercontent.com/milvus-io/milvus-docs/v2.4.x/assets/hello_milvus.py
```

然后，使用你的 Milvus 实例地址更新脚本中的 `uri` 参数。更新后，使用以下命令运行该脚本：

```python
python hello_milvus.py
```

如果该脚本执行时没有返回任何错误消息，则表示你的 Milvus 实例正常运行并且 Python SDK 已正确安装。

## 连接到 Milvus

一旦你获得了集群凭据或 API 密钥，你就可以使用它来连接到你的 Milvus。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置一个Milvus客户端
client = MilvusClient(
    uri="http://localhost:19530"
)
```

<div class="alert note">

<p> 如果你在 Milvus 实例上启用了身份验证，应在初始化 MilvusClient 时将 `token` 作为参数添加，并将其值设置为以冒号分隔的用户名和密码。要使用默认的用户名和密码进行身份验证，请将 `token` 设置为 `root:Milvus`。</p>

</div>

## 创建集合

在 Milvus 中，你需要将向量嵌入存储在集合中。所有存储在集合中的向量嵌入都共享相同的维度和用于测量相似性的距离度量。你可以使用以下任一方式创建集合。

### 快速设置

要以快速设置模式设置集合，你只需设置集合名称和集合的向量字段的维度。

```python
# 2. 在快速设置模式下创建集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5
)
```

在上述设置中，

- 主字段和向量字段使用其默认名称（__id__ 和 __vector__）。

- 度量类型也设置为其默认值（__COSINE__）。

- 主字段接受整数并且不会自动增加。

- 一个名为 __$meta__ 的保留 JSON 字段用于存储非架构定义的字段及其值。

<div class="admonition note">

<p> <b> 注意事项 </b> </p>

<p> 使用 RESTful API 创建的集合支持至少 32 维的向量字段。</p>

</div>

### 自定义设置



# To define the collection schema by yourself, use the customized setup. In this manner, you can define the attributes of each field in the collection, including its name, data type, and extra attributes of a specific field.

```python
# 3. Create a collection in customized setup mode

# 3.1. Create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. Add fields to schema
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# 3.3. Prepare index parameters
index_params = client.prepare_index_params()

# 3.4. Add indexes
index_params.add_index(
    field_name="my_id"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="IP"
)

# 3.5. Create a collection
client.create_collection(
    collection_name="customized_setup",
    schema=schema,
    index_params=index_params
)
```

In the above setup, you have the flexibility to define various aspects of the collection during its creation, including its schema and index parameters.

- __Schema__

    The schema defines the structure of a collection. Except for adding pre-defined fields and setting their attributes as demonstrated above, you have the option of enabling and disabling

    - __AutoID__

        Whether to enable the collection to automatically increment the primary field.

    - __Dynamic Field__

        Whether to use the reserved JSON field __$meta__ to store non-schema-defined fields and their values. 

     For a detailed explanation of the schema, refer to [Schema](/reference/schema.md).

- __Index parameters__

    Index parameters dictate how Milvus organizes your data within a collection. You can assign specific indexes to fields by configuring their __metric types__ and __index types__. 

    - For the vector field, you can use __AUTOINDEX__ as the index type and use __COSINE__, __L2__, or __IP__ as the `metric_type`.

    - For scalar fields, including the primary field, Milvus uses __TRIE__ for integers and __STL_SORT__ for strings.

    For additional insights into index types, refer to [Index](/reference/index.md).

<div class="admonition note">

<p> <b> notes </b> </p>

<p> The collection created in the preceding code snippets are automatically loaded. If you prefer not to create an automatically loaded collection, refer to <a href="https://milvus.io/docs/manage-collections.md"> Manage Collections </a>.</p>
<p> Collections created using the RESTful API are always automatically loaded.</p>

</div>

## Insert Data





                
Collections created in either of the preceding ways have been indexed and loaded. Once you are ready, insert some example data.

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

提供的代码假设你已经根据“快速设置”方式创建了一个集合。如上所示的代码，

- 要插入的数据被组织成一个字典列表，其中每个字典表示一个数据记录，被称为实体。

- 每个字典包含一个非模式定义字段，名为 "color"。

- 每个字典包含与预定义字段和动态字段对应的键。

<div class="admonition note">

<p> <b> 注意 </b> </p>

<p> 使用启用了 AutoID 的 RESTful API 创建的集合，因此你需要跳过要插入的数据中的主字段。</p>

</div>

### 插入更多数据

如果你希望稍后使用已插入的 10 个实体进行搜索，则可以安全地跳过此部分。为了更好地了解 Milvus 的搜索性能，建议你使用以下代码段将更多随机生成的实体添加到集合中。

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

<p> <b> 注意 </b> </p>

<p> 每次调用 Insert RESTful API 时，你可以一次批量插入最多 100 个实体。</p>

</div>

## 相似度搜索
 


你可以根据一个或多个向量嵌入进行相似性搜索。

<div class="admonition note">

<p> <b> notes </b> </p>

<p> The insert operations are asynchronous, and conducting a search immediately after data insertions may result in empty result set. To avoid this, you are advised to wait for a few seconds.</p>

</div>

### 单向量搜索

__query_vectors__ 变量的值是一个包含浮点数子列表的列表。子列表代表一个 5 维向量嵌入。

```python
# 6. 使用单向量进行搜索
# 6.1. 准备查询向量
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 6.2. 开始搜索
res = client.search(
    collection_name="quick_setup",     # 目标集合
    data=query_vectors,                # 查询向量
    limit=3,                           # 返回的实体数量
)

print(res)

# 输出
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

输出是一个包含三个字典子列表的列表，表示返回实体及其 ID 和距离。

### 批量向量搜索
 


也可以在 __query_vectors__ 变量中包含多个向量嵌入，以进行批量相似度搜索。

```python
# 7.搜索多个向量
# 7.1.准备查询向量
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648],
    [0.0039737443, 0.003020432, -0.0006188639, 0.03913546, -0.00089768134]
]

# 7.2.开始搜索
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    limit=3,
)

print(res)

# 输出结果
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

输出应该是一个包含两个子列表的列表，每个子列表包含三个字典，表示返回的带有其 ID 和距离的实体。

### 过滤搜索



使用架构定义的字段

你还可以通过在搜索请求中包含过滤器并指定特定的输出字段来增强搜索结果。

```python
# 8. 使用架构定义的字段进行带过滤表达式的搜索
# 1 准备查询向量
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 2. 开始搜索
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    filter="500 < id < 800",
    limit=3
)

print(res)

# 输出
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

输出应为包含三个字典子列表的列表，每个字典代表一个搜索实体，包含其 ID、距离和指定的输出字段。

使用非架构定义的字段

你还可以在过滤器表达式中包含动态字段。在下面的代码片段中，`color` 是一个非架构定义的字段。你可以将其作为 `$meta` 字段中的键，例如 `$meta["color"]`，也可以像使用架构定义的字段一样直接使用它，例如 `color`。

```python
# 9. 使用自定义字段进行带过滤表达式的搜索
# 9.1. 准备查询向量
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 9.2. 开始搜索
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    filter='$meta["color"] like "red%"',
    limit=3,
    output_fields=["color"]
)

print(res)

# 输出
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

标量查询





                
                

                
与矢量相似性搜索不同，查询通过基于 [过滤表达式](/reference/boolean.md) 的标量过滤来检索向量。

- __使用已定义字段进行过滤__

    ```python
    # 10. 使用已定义字段进行过滤的查询表达式
    res = client.query(
        collection_name="quick_setup",
        filter="10 < id < 15",
        output_fields=["color"]
    )
    
    print(res)
    
    # 输出
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

如果你知道要检索的实体的 ID，可以按照其 ID 获取实体，如下所示：

```python
# 12. 按ID获取实体
res = client.get(
    collection_name="quick_setup",
    ids=[1,2,3],
    output_fields=["title", "vector"]
)

print(res)

# 输出
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

<p> <b> 注意 </b> </p>

<p> 目前，RESTful API 不提供 get 端点。</p>

</div>

## 删除实体

 

                
                Milvus 允许通过 ID 和过滤器删除实体。

- __通过 ID 删除实体__

    ```python
    # 13. 通过ID删除实体
    res = client.delete(
        collection_name="quick_setup",
        ids=[0,1,2,3,4]
    )
    
    print(res)
    
    # 输出
    #
    # {
    #     "delete_count": 5
    # }
    ```

- __通过过滤器删除实体__

    ```python
    # 14. 通过过滤器表达式删除实体
    res = client.delete(
        collection_name="quick_setup",
        filter="id in [5,6,7,8,9]"
    )
    
    print(res)
    
    # 输出
    #
    # {
    #     "delete_count": 5
    # }
    ```

    <div class="admonition note">

    <p> <b> 注意 </b> </p>

    <p> 目前，RESTful API 的删除端点不支持过滤器。</p>

    </div>

## 删除集合

Starter 计划在无服务器集群中允许最多两个集合。完成本指南后，你可以按以下方式删除集合：

```python
# 15. 删除集合
client.drop_collection(
    collection_name="quick_setup"
)

client.drop_collection(
    collection_name="customized_setup"
)
```

## 总结



- 有两种方法创建一个集合。第一种是快速设置，只需提供名称和向量字段的维度即可。第二种是自定义设置，允许你自定义集合的几乎所有方面。

- 数据插入过程可能需要一些时间才能完成。建议在插入数据和进行相似性搜索之间等待几秒钟。

- 过滤表达式可以在搜索和查询请求中使用。但是，在查询请求中，它们是强制性的。

