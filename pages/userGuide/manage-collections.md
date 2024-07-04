


# 管理集合

本指南将指导你使用所选的 SDK 创建和管理集合。

## 开始之前

- 你已经安装了 [Milvus 单机版](/getstarted/standalone/install_standalone-docker.md) 或 [Milvus 集群版](/getstarted/cluster/install_cluster-milvusoperator.md)。

- 你已经安装了所需的 SDK。你可以选择多种语言，包括 [Python](/getstarted/install_SDKs/install-pymilvus.md)、[Java](/getstarted/install_SDKs/install-java.md)、[Go](/getstarted/install_SDKs/install-go.md) 和 [Node.js](/getstarted/install_SDKs/install-node.md)。

## 概述

在 Milvus 中，你可以将向量嵌入存储在集合中。集合中的所有向量嵌入共享相同的维度和用于衡量相似性的距离度量。

Milvus 集合支持动态字段（即模式中未预定义的字段）和主键的自动递增。

为了适应不同的偏好，Milvus 提供了两种创建集合的方法。一种提供快速设置，而另一种允许详细定制集合的模式和索引参数。

此外，你可以在需要时查看、加载、释放和删除集合。

<div class="alert note">

此页面上的代码片段使用的是新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 创建集合

你可以通过以下两种方式之一创建集合：

- __快速设置__

    在此方式中，你可以通过仅提供名称和要存储在该集合中的向量嵌入的维度数量来创建集合。详情请参阅 [快速设置](/userGuide/manage-collections.md)。

- __自定义设置__

    你可以根据自己的需求确定集合的 __模式__ 和 __索引参数__，而不是让 Milvus 为集合几乎决定一切。详情请参阅 [自定义设置](/userGuide/manage-collections.md)。

### 快速设置

在人工智能领域取得巨大进展的背景下，大多数开发人员只需要一个简单而动态的集合即可开始。Milvus 允许使用仅三个参数快速设置此类集合：

- 要创建的集合名称，

- 要插入的向量嵌入的维度，以及

- 用于衡量向量嵌入之间相似性的度量类型。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置Milvus客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 以快速设置模式创建集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5
)

res = client.get_load_state(
    collection_name="quick_setup"
)

print(res)

# 输出
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

上述代码中生成的集合仅包含两个字段：`id`（作为主键）和 `vector`（作为向量字段），默认启用了 `auto_id` 和 `enable_dynamic_field` 设置。

- `auto_id`

    启用此设置可确保主键自动递增。在数据插入过程中无需手动提供主键。

- `enable_dynamic_field`

    启用后，将把要插入的数据中除 `id` 和 `vector` 之外的所有字段视为动态字段。这些额外的字段将保存在一个名为 `$meta` 的特殊字段中，以键值对的形式存储。这个功能允许在数据插入过程中包含额外的字段。

提供的代码自动生成的、具有自动索引和加载状态的集合已准备好进行数据插入。

### 自定义设置

你可以根据自己的需求确定集合的 __模式__ 和 __索引参数__，而不是让 Milvus 为集合几乎决定一切。

#### 步骤 1：设置模式




# A schema defines the structure of a collection. 

The schema allows you to enable or disable `enable_dynamic_field`, add pre-defined fields, and set attributes for each field. For a detailed explanation of the concept and available data types, refer to [Schema Explained](/reference/schema.md).

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
```

In the provided code snippet for Python, the `enable_dynamic_field` is set to `True`, and `auto_id` is enabled for the primary key. Additionally, a `vector` field is introduced, configured with a dimensionality of 768, along with the inclusion of four scalar fields, each with its respective attributes.

### Step 2: Set up index parameters

Index parameters dictate how Milvus organizes your data within a collection. You can tailor the indexing process for specific fields by adjusting their `metric_type` and `index_type`. For the vector field, you have the flexibility to select `COSINE`, `L2`, or `IP` as the `metric_type`.

```python
# 3.3. Prepare index parameters
index_params = client.prepare_index_params()

# 3.4. Add indexes
index_params.add_index(
    field_name="my_id",
    index_type="STL_SORT"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="IVF_FLAT",
    metric_type="IP",
    params={ "nlist": 128 }
)
```

The code snippet above demonstrates how to set up index parameters for the vector field and a scalar field, respectively. For the vector field, set both the metric type and the index type. For a scalar field, set only the index type. It is recommended to create an index for the vector field and any scalar fields that are frequently used for filtering.

### Step 3: Create the collection







你有两种选项，分别是单独创建一个集合和索引文件，或者在创建集合的同时加载索引。

- __在创建集合的同时加载索引__

    ```python
    # 3.5. 在创建集合的同时加载索引
    client.create_collection(
        collection_name="customized_setup_1",
        schema=schema,
        index_params=index_params
    )
    
    time.sleep(5)
    
    res = client.get_load_state(
        collection_name="customized_setup_1"
    )
    
    print(res)
    
    # 输出
    #
    # {
    #     "state": "<LoadState: Loaded>"
    # }
    ```

    上面创建的集合会自动加载。要了解更多关于加载和释放集合的信息，请参考 [加载和释放集合](/userGuide/manage-collections.md)。

- __单独创建一个集合和索引文件__

    ```python
    # 3.6. 单独创建一个集合和索引文件
    client.create_collection(
        collection_name="customized_setup_2",
        schema=schema,
    )
    
    res = client.get_load_state(
        collection_name="customized_setup_2"
    )
    
    print(res)
    
    # 输出
    #
    # {
    #     "state": "<LoadState: NotLoad>"
    # }
    ```

    上面创建的集合不会自动加载。你可以按照下面的方式为集合创建索引。单独创建集合索引不会自动加载集合。详细信息请参考 [加载和释放集合](/userGuide/manage-collections.md)。

    ```python
    # 3.6. 创建索引
    client.create_index(
        collection_name="customized_setup_2",
        index_params=index_params
    )
    
    res = client.get_load_state(
        collection_name="customized_setup_2"
    )
    
    print(res)
    
    # 输出
    #
    # {
    #     "state": "<LoadState: NotLoad>"
    # }
    ```

## 查看集合



You can check the details of an existing collection as follows:

```python
# 5. 查看集合详情
res = client.describe_collection(
    collection_name="customized_setup_2"
)

print(res)

# 输出
#
# {
#     "collection_name": "customized_setup_2",
#     "auto_id": false,
#     "num_shards": 1,
#     "description": "",
#     "fields": [
#         {
#             "field_id": 100,
#             "name": "my_id",
#             "description": "",
#             "type": 5,
#             "params": {},
#             "element_type": 0,
#             "is_primary": true
#         },
#         {
#             "field_id": 101,
#             "name": "my_vector",
#             "description": "",
#             "type": 101,
#             "params": {
#                 "dim": 5
#             },
#             "element_type": 0
#         }
#     ],
#     "aliases": [],
#     "collection_id": 448143479230158446,
#     "consistency_level": 2,
#     "properties": {},
#     "num_partitions": 1,
#     "enable_dynamic_field": true
# }

```

To list all existing collections, you can do as follows:

```python
# 6. 列出所有集合名称
res = client.list_collections()

print(res)

# 输出
#
# [
#     "customized_setup_2",
#     "quick_setup",
#     "customized_setup_1"
# ]
```

## 加载和释放集合

在加载集合过程中，Milvus 会将集合的索引文件加载到内存中。相反，在释放集合时，Milvus 会从内存中卸载索引文件。在进行集合搜索之前，请确保集合已加载。

### 加载集合

```python
# 7. 加载集合
client.load_collection(
    collection_name="customized_setup_2"
)

res = client.get_load_state(
    collection_name="customized_setup_2"
)

print(res)

# 输出
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

### 释放集合



## 设置别名

你可以为集合分配别名，使其在特定的上下文中更具意义。你可以为一个集合分配多个别名，但多个集合不能共用一个别名。

### 创建别名

```python
# 9.1. 创建别名
client.create_alias(
    collection_name="customized_setup_2",
    alias="bob"
)

client.create_alias(
    collection_name="customized_setup_2",
    alias="alice"
)
```

### 列出别名

```python
# 9.2. 列出别名
res = client.list_aliases(
    collection_name="customized_setup_2"
)

print(res)

# 输出
#
# {
#     "aliases": [
#         "bob",
#         "alice"
#     ],
#     "collection_name": "customized_setup_2",
#     "db_name": "default"
# }
```

### 描述别名

```python
# 9.3. 描述别名
res = client.describe_alias(
    alias="bob"
)

print(res)

# 输出
#
# {
#     "alias": "bob",
#     "collection_name": "customized_setup_2",
#     "db_name": "default"
# }
```

### 重新分配别名




# 9.4 将别名重新分配给其他集合

```python
# 9.4 Reassign aliases to other collections
client.alter_alias(
    collection_name="customized_setup_1",
    alias="alice"
)

res = client.list_aliases(
    collection_name="customized_setup_1"
)

print(res)

# 输出
#
# {
#     "aliases": [
#         "alice"
#     ],
#     "collection_name": "customized_setup_1",
#     "db_name": "default"
# }

res = client.list_aliases(
    collection_name="customized_setup_2"
)

print(res)

# 输出
#
# {
#     "aliases": [
#         "bob"
#     ],
#     "collection_name": "customized_setup_2",
#     "db_name": "default"
# }
```

### 删除别名

```python
# 9.5 Drop aliases
client.drop_alias(
    alias="bob"
)

client.drop_alias(
    alias="alice"
)
```

## 删除集合



如果不再需要某个集合，可以删除该集合。

```python
# 10. 删除集合
client.drop_collection(
    collection_name="quick_setup"
)

client.drop_collection(
    collection_name="customized_setup_1"
)

client.drop_collection(
    collection_name="customized_setup_2"
)
```

 