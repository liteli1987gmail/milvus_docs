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

- __模式__

    模式定义了集合的结构。除了像上面演示的那样添加预定义字段并设置它们的属性外，您还可以启用和禁用

    - __AutoID__

        是否启用集合自动递增主键。

    - __动态字段__

        是否使用保留的 JSON 字段 __$