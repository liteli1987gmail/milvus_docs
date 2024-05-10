---
id: 管理集合.md
title: 管理集合
---

# 管理集合

本指南将引导您使用您选择的 SDK 创建和管理集合。

## 开始之前

- 您已安装了[Milvus 独立部署](https://milvus.io/docs/install_standalone-docker.md)或[Milvus 集群](https://milvus.io/docs/install_cluster-milvusoperator.md)。

- 您已安装了首选的 SDK。您可以选择多种语言，包括[Python](https://milvus.io/docs/install-pymilvus.md)、[Java](https://milvus.io/docs/install-java.md)、[Go](https://milvus.io/docs/install-go.md)和[Node.js](https://milvus.io/docs/install-node.md)。

## 概述

在 Milvus 中，您将向量嵌入存储在集合中。集合内的所有向量嵌入共享相同的维度和距离度量以测量相似性。

Milvus 集合支持动态字段（即，未在模式中预定义的字段）和主键的自动递增。

为了适应不同的偏好，Milvus 提供了两种创建集合的方法。一种提供快速设置，另一种允许详细定制集合模式和索引参数。

此外，您可以在需要时查看、加载、释放和删除集合。

<div class="alert note">

本页上的代码片段使用新的<a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 创建集合

您可以以以下任一方式创建集合：

- **快速设置**

  通过这种方式，您可以通过简单地给集合命名并指定要存储在该集合中的向量嵌入的维度数来创建集合。有关详细信息，请参阅[快速设置](manage-collections.md)。

- **自定义设置**

  而不是让 Milvus 为您的集合决定几乎所有事情，您可以自己确定集合的**schema**和**index parameters**。有关详细信息，请参阅[自定义设置](manage-collections.md)。

### 快速设置

在 AI 行业的巨大飞跃背景下，大多数开发人员只需要一个简单且动态的集合来开始。Milvus 允许使用仅三个参数快速设置这样的集合：

- 要创建的集合的名称，

- 要插入的向量嵌入的维度，

- 用于测量向量嵌入之间相似性的度量类型。

```python
from pymilvus import MilvusClient, DataType

# 1. 设置Milvus客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 在快速设置模式下创建集合
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

上述代码中生成的集合仅包含两个字段：`id`（作为主键）和`vector`（作为向量字段），`auto_id`和`enable_dynamic_field`设置默认启用。

- `auto_id`

  启用此设置确保主键自动递增。在数据插入期间不需要手动提供主键。

- `enable_dynamic_field`

  启用时，除了要插入的数据中的`id`和`vector`之外的所有字段都被视为动态字段。这些额外的字段被保存为一个名为`$meta`的特殊字段中的键值对。此功能允许在数据插入期间包含额外的字段。

从提供的代码自动索引和加载的集合已准备好立即进行数据插入。

### 自定义设置

而不是让 Milvus 为您的集合决定几乎所有事情，您可以自己确定集合的**schema**和**index parameters**。

#### 第 1 步：设置模式

模式定义了集合的结构。在模式中，您可以选择启用或禁用`enable_dynamic_field`，添加预定义字段，并为每个字段设置属性。有关概念和可用数据类型的详细解释，请参阅[模式解释](schema.md)。

```python
# 3. 在自定义设置模式下创建集合

# 3.1. 创建模式
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. 向模式中添加字段
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)
```

In the provided code snippet for Python, the `enable_dynamic_field` is set to `True`, and `auto_id` is enabled for the primary key. Additionally, a `vector` field is introduced, configured with a dimensionality of 768, along with the inclusion of four scalar fields, each with its respective attributes.

#### Step 2: Set up index parameters

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

#### Step 3: Create the collection

You have the option to create a collection and an index file separately or to create a collection with the index loaded simultaneously upon creation.

- **Create a collection with the index loaded simultaneously upon creation.**

  ```python
  # 3.5. Create a collection with the index loaded simultaneously
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

  # Output
  #
  # {
  #     "state": "<LoadState: Loaded>"
  # }
  ```

  The collection created above is loaded automatically. To learn more about loading and releasing a collection, refer to [Load & Release Collection](manage-collections.md).

- **Create a collection and an index file separately.**

  ```python
  # 3.6. Create a collection and index it separately
  client.create_collection(
      collection_name="customized_setup_2",
      schema=schema,
  )

  res = client.get_load_state(
      collection_name="customized_setup_2"
  )

  print(res)

  # Output
  #
  # {
  #     "state": "<LoadState: NotLoad>"
  # }
  ```

  The collection created above is not loaded automatically. You can create an index for the collection as follows. Creating an index for the collection in a separate manner does not automatically load the collection. For details, refer to [Load & Release Collection](manage-collections.md).

  ```python
  # 3.6 Create index
  client.create_index(
      collection_name="customized_setup_2",
      index_params=index_params
  )

  res = client.get_load_state(
      collection_name="customized_setup_2"
  )

  print(res)

  # Output
  #
  # {
  #     "state": "<LoadState: NotLoad>"
  # }
  ```

## View Collections

You can check the details of an existing collection as follows:

```python
# 5. View Collections
res = client.describe_collection(
    collection_name="customized_setup_2"
)

print(res)

# Output
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
# 6. List all collection names
res = client.list_collections()

print(res)

# Output
#
# [
#     "customized_setup_2",
#     "quick_setup",
#     "customized_setup_1"
# ]
```

## Load & Release Collection

During the loading process of a collection, Milvus loads the collection's index file into memory. Conversely, when releasing a collection, Milvus unloads the index file from memory. Before conducting searches in a collection, ensure that the collection is loaded.

### Load a collection

```python
# 7. Load the collection
client.load_collection(
    collection_name="customized_setup_2"
)

res = client.get_load_state(
    collection_name="customized_setup_2"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

### Release a collection

```python
# 8. Release the collection
client.release_collection(
    collection_name="customized_setup_2"
)

res = client.get_load_state(
    collection_name="customized_setup_2"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoad>"
# }
```

## Set up aliases

You can assign aliases for collections to make them more meaningful in a specific context. You can assign multiple aliases for a collection, but multiple collections cannot share an alias.

### Create aliases

```python
# 9.1. Create aliases
client.create_alias(
    collection_name="customized_setup_2",
    alias="bob"
)

client.create_alias(
    collection_name="customized_setup_2",
    alias="alice"
)
```

### List aliases

```python
# 9.2. List aliases
res = client.list_aliases(
    collection_name="customized_setup_2"
)

print(res)

# Output
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

### Describe aliases

```python
# 9.3. Describe aliases
res = client.describe_alias(
    alias="bob"
)

print(res)

# Output
#
# {
#     "alias": "bob",
#     "collection_name": "customized_setup_2",
#     "db_name": "default"
# }
```

### Reassign aliases

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

# Output
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

# Output
#
# {
#     "aliases": [
#         "bob"
#     ],
#     "collection_name": "customized_setup_2",
#     "db_name": "default"
# }
```

### Drop aliases

```python
# 9.5 Drop aliases
client.drop_alias(
    alias="bob"
)

client.drop_alias(
    alias="alice"
)
```

## Drop a Collection

If a collection is no longer needed, you can drop the collection.

```python
# 10. Drop the collections
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
