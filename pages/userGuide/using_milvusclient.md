---
id: using_milvusclient.md
related_key: Milvus Client Python
summary: Learn how to use the MilvusClient Python API.
title: Use the MilvusClient
---

# 使用 MilvusClient

本页面介绍了如何在 Pymilvus 中使用 MilvusClient。MilvusClient 是 Pymilvus 的简化包装器，更易于使用，并且隐藏了使用原始 SDK 时发现的大部分复杂性。

<div class="alert note">
    确保 Milvus 正在运行。
</div>

MilvusClient 支持通过 URI 使用单一统一的方式来连接服务。以下是一些有效的 URI 示例：

1. "http://localhost:19530"
2. "https://user:password@mysite:19530"
3. "https://username:password@in01-12a.aws-us-west-2.vectordb.zillizcloud.com:19538"

当使用 HTTPS 连接时，我们期望提供用户名和密码。

现在让我们来看看使用 MilvusClient 的一个快速示例。

## 基础

### 创建客户端

使用客户端所需的大部分信息都在构造调用中提供。客户端有两个主要用例，创建一个新的 Milvus 集合或使用之前创建的集合。

如果要创建新集合，则必须指定 vector_field 名称，因为这无法从插入的数据中解析。如果您想手动处理此集合的主字段键，则还必须指定 pk_field，否则将使用自动生成的 int 字段。如果在 Milvus 实例中存在同名的集合，则必须将 overwrite 设置为 `True` 以删除之前的集合。

如果您想连接到之前创建的集合，则只需要提供 uri 和 collection_name，其余信息将从集合本身推断出来。

```python
from pymilvus import MilvusClient

client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector",
    # pk_field= "id", # 如果您想提供自己的 PK
    overwrite=True,
)
```

### 插入数据

创建了 MilvusClient 后，我们可以开始插入数据。数据以字典列表的形式插入，其中每个字典对应集合中的一行。每个字典必须包含集合中所有列的值，否则插入将抛出异常。

如果客户端是在不存在的集合上创建的，或者将 overwrite 设置为 True，则字典列表中的第一个条目将用于构建集合的模式。所有后续插入都需要包含与第一个字典相同的字段。如果在构造时没有提供索引参数，则将使用默认的 HNSW 索引来索引数据。

```python
data = [
    {
        "float_vector": [1,2,3],
        "id": 1,
        "text": "foo"
    },
    {
        "float_vector": [4,5,6],
        "id": 2,
        "text": "bar"
    },
    {
        "float_vector": [7,8,9],
        "id": 3,
        "text": "baz"
    }
]
client.insert_data(data)
```

### 搜索数据

将数据插入 Milvus 后，我们可以开始搜索集合。搜索需要输入搜索向量/s 和我们想要的搜索结果数量（top_k）。此外，如果您愿意，您还可以提供搜索参数。这些搜索参数应与构造时提供的索引参数相对应。如果没有提供，MilvusClient 将使用默认的搜索参数。

```python
res = client.search_data(
    data = [[1,3,5], [7,8,9]],
    top_k = 2,
)
# [[
#     {'data': {'id': 1, 'internal_pk_4537': 441340318978146436, 'text': 'foo'}, 'score': 5.0},
#     {'data': {'id': 2, 'internal_pk_4537': 441340318978146437, 'text': 'bar'}, 'score': 14.0}
# ],
# [
#     {'data': {'id': 3, 'internal_pk_4537': 441340318978146438, 'text': 'baz'}, 'score': 0.0},
#     {'data': {'id': 2, 'internal_pk_4537': 441340318978146437, 'text': 'bar'}, 'score': 27.0}
# ]]
```

搜索结果将以列表列表的形式返回。对于每个搜索向量，您将收到一个包含距离和相应结果数据的字典列表。如果不需要所有数据，您可以使用 return_fields 参数调整返回的数据。

## 高级

### 分区

MilvusClient 在当前版本中支持分区。分区可以在 MilvusClient 构造时和之后指定。以下是使用分区功能的快速示例。

```python
from pymilvus import MilvusClient



client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector",
    partitions = ["zaz"],
    overwrite=True,
)

data = [
    {
        "float_vector": [1,2,3],
        "id": 1,
        "text": "foo"
    },
]
client.insert_data(data, partition="zaz")

client.add_partitions(["zoo"])

data = [
    {
        "float_vector": [4,5,6],
        "id": 2,
        "text": "bar"
    },
]
client.insert_data(data, partition="zoo")

res = client.search_data(
    data = [1,3,5],
    top_k = 2,
)

# [[
#     {'data': {'id': 1, 'internal_pk_3bd4': 441363276234227849, 'text': 'foo'}, 'score': 5.0},
#     {'data': {'id': 2, 'internal_pk_3bd4': 441363276234227866, 'text': 'bar'}, 'score': 14.0}
# ]]


res = client.search_data(
    data = [1,3,5],
    top_k = 2,
    partitions=["zaz"]
)

# [[
#     {'data': {'id': 1, 'internal_pk_3bd4': 441363276234227849, 'text': 'foo'}, 'score': 5.0}
# ]]

res = client.search_data(
    data = [1,3,5],
    top_k = 2,
    partitions=["zoo"]
)

# [[
#     {'data': {'id': 2, 'internal_pk_3bd4': 441363276234227866, 'text': 'bar'}, 'score': 14.0}
# ]]
```

### Filtering

Filtering can be used to narrow down results to match metadata or to query data based on metadata.

```python
from pymilvus import MilvusClient

client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector",
    # pk_field= "id", # If you wanted to provide your own PK
    overwrite=True,
)

data = [
    {
        "float_vector": [1,2,3],
        "id": 1,
        "text": "foo"
    },
    {
        "float_vector": [4,5,6],
        "id": 2,
        "text": "bar"
    },
    {
        "float_vector": [7,8,9],
        "id": 3,
        "text": "baz"
    }
]
client.insert_data(data)

res = client.search_data(
    data = [1,3,5],
    top_k = 2,
    filter_expression = "id > 1"
)

# [[
#     {'score': 14.0, 'data': {'id': 2, 'text': 'bar', 'internal_pk_5465': 441363276234227922}},
#     {'score': 77.0, 'data': {'id': 3, 'text': 'baz', 'internal_pk_5465': 441363276234227923}}
# ]]

res = client.query_data(
    filter_expression = "id == 1"
)

# [
#   {'id': 1, 'text': 'foo', 'internal_pk_5465': 441363276234227921}
# ]
```

### Vector Retrieval and Deletion

As a vector database we have the ability to return the actual vectors and delete their entries. In order to do these two functions we need to first get the pks corresponding to the entry we are trying to act on. Here is an example below.

```python
from pymilvus import MilvusClient

client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector",
    pk_field= "text",
    overwrite=True,
)

data = [
    {
        "float_vector": [1,2,3],
        "id": 1,
        "text": "foo"
    },
    {
        "float_vector": [4,5,6],
        "id": 2,
        "text": "bar"
    },
    {
        "float_vector": [7,8,9],
        "id": 3,
        "text": "baz"
    }
]

client.insert_data(data)

res = client.query_data(
    filter_expression = "id == 1"
)

# [
#   {'id': 1, 'text': 'foo'}
# ]

res = client.get_vectors_by_pk(pks = res[0]["text"])

# [
#     {'float_vector': [1.0, 2.0, 3.0], 'text': 'foo'}
# ]

client.delete_by_pk(pks = res[0]["text"])

res = client.query_data(
    filter_expression = "id == 1"
)

# []
```
