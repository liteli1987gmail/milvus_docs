---
id: 管理集合.md
title: 管理集合
---

# 管理集合

本指南将引导您使用您选择的SDK创建和管理集合。

## 开始之前

- 您已安装了[Milvus独立部署](https://milvus.io/docs/install_standalone-docker.md)或[Milvus集群](https://milvus.io/docs/install_cluster-milvusoperator.md)。

- 您已安装了首选的SDK。您可以选择多种语言，包括[Python](https://milvus.io/docs/install-pymilvus.md)、[Java](https://milvus.io/docs/install-java.md)、[Go](https://milvus.io/docs/install-go.md)和[Node.js](https://milvus.io/docs/install-node.md)。

## 概述

在Milvus中，您将向量嵌入存储在集合中。集合内的所有向量嵌入共享相同的维度和距离度量以测量相似性。

Milvus集合支持动态字段（即，未在模式中预定义的字段）和主键的自动递增。

为了适应不同的偏好，Milvus提供了两种创建集合的方法。一种提供快速设置，另一种允许详细定制集合模式和索引参数。

此外，您可以在需要时查看、加载、释放和删除集合。

<div class="alert note">

本页上的代码片段使用新的<a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与Milvus交互。其他语言的新MilvusClient SDK将在未来的更新中发布。

</div>

## 创建集合

您可以以以下任一方式创建集合：

- __快速设置__

    通过这种方式，您可以通过简单地给集合命名并指定要存储在该集合中的向量嵌入的维度数来创建集合。有关详细信息，请参阅[快速设置](manage-collections.md)。

- __自定义设置__

    而不是让Milvus为您的集合决定几乎所有事情，您可以自己确定集合的__schema__和__index parameters__。有关详细信息，请参阅[自定义设置](manage-collections.md)。

### 快速设置

在AI行业的巨大飞跃背景下，大多数开发人员只需要一个简单且动态的集合来开始。Milvus允许使用仅三个参数快速设置这样的集合：

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

而不是让Milvus为您的集合决定几乎所有事情，您可以自己确定集合的__schema__和__index parameters__。

#### 第1步：设置模式

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

在提供的Python代码片段中，`enable_dynamic_field`设置为`True`，为主键启用了`auto_id`。此外，引入了一个`vector`字段，配置为768维，以及四个标量字段，每个字段都有