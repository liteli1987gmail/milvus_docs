


# 使用 MilvusClient

本页面介绍如何使用 Pymilvus 中的 MilvusClient。MilvusClient 是 Pymilvus 中的一个简化封装，使用起来更方便，隐藏了使用原始 SDK 中的大部分复杂性。

<div class="alert note">
    请确保 Milvus 正在运行。
</div>

MilvusClient 通过使用 URI 支持一种单一的连接服务的方式。一些有效的 URI 示例包括:
1. "http://localhost: 19530"
2. "https://user: password@mysite: 19530"
2. "https://username: password@in01-12a.aws-us-west-2.vectordb.zillizcloud.com: 19538"

当使用 HTTPS 连接时，我们希望提供用户名和密码。

现在让我们通过一个快速示例来了解如何使用 MilvusClient。

## 基础知识

### 创建客户端

大部分使用客户端所需的信息都在构造调用中提供。客户端有两个主要用例，创建新的 Milvus 集合或使用之前创建的集合。

如果要创建新集合，则必须指定 vector_field 名称，因为它不能从插入的数据中解析。如果要手动处理该集合的主字段键，则还必须指定 pk_field；否则，将使用自动生成的 int 字段。如果 Milvus 实例中存在同名集合，则必须将 overwrite 设置为 `True`，以删除先前的集合。

如果要连接到之前创建的集合，则只需提供 uri 和 collection_name，其余信息将从集合本身推断出。

```python
from pymilvus import MilvusClient

client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector", 
    # pk_field= "id", # 如果要提供自己的 PK
    overwrite=True,
)
```

### 插入数据

创建了 MilvusClient 后，就可以开始插入数据了。数据以字典列表的形式插入，其中每个字典对应集合中的一行。每个字典必须包含集合中所有列的值，否则插入操作将抛出异常。

如果客户端是在一个不存在的集合上创建的，或者 overwrite 设置为 True，则将使用字典列表中的第一个条目来构造集合的模式。所有后续的插入都需要包含与第一个字典相同的字段。如果在构造时未提供索引参数，则将使用默认的 HNSW 索引对数据进行索引。

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

一旦数据被插入到 Milvus 中，我们就可以开始搜索集合了。搜索函数接受搜索向量，以及我们想要的搜索结果数（top_k）。此外，如果需要，还可以提供搜索参数。搜索参数应与在构造时提供的 index_parameters 对应。如果未提供参数，则 MilvusClient 将使用默认搜索参数。

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

搜索结果将以列表列表的形式呈现。对于每个搜索向量，你将收到一个字典列表，其中每个字典包含距离和对应的结果数据。如果不需要所有数据，可以使用 return_fields 参数调整返回哪些数据。

## 高级功能

### 分区



The MilvusClient 在当前版本中支持分区。分区可以在 MilvusClient 的构建和之后指定。以下是使用分区功能的快速示例。

```python
from pymilvus import MilvusClient


client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector",
    partitions=["zaz"],
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
    data=[1,3,5],
    top_k=2,
)

# [[
#     {'data': {'id': 1, 'internal_pk_3bd4': 441363276234227849, 'text': 'foo'}, 'score': 5.0},
#     {'data': {'id': 2, 'internal_pk_3bd4': 441363276234227866, 'text': 'bar'}, 'score': 14.0}
# ]]

res = client.search_data(
    data=[1,3,5],
    top_k=2,
    partitions=["zaz"]
)

# [[
#     {'data': {'id': 1, 'internal_pk_3bd4': 441363276234227849, 'text': 'foo'}, 'score': 5.0}
# ]]

res = client.search_data(
    data=[1,3,5],
    top_k=2,
    partitions=["zoo"]
)

# [[
#     {'data': {'id': 2, 'internal_pk_3bd4': 441363276234227866, 'text': 'bar'}, 'score': 14.0}
# ]]
```


### Filtering



# 
过滤可以用于根据元数据缩小结果范围或根据元数据查询数据。

```python
from pymilvus import MilvusClient

client = MilvusClient(
    collection_name="qux",
    uri="http://localhost:19530",
    vector_field="float_vector", 
    # pk_field= "id", # 如果你想提供自己的主键
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

### 向量检索和删除



作为向量数据库，我们有能力返回实际的向量并删除它们的条目。为了执行这两个功能，我们首先需要获取与我们尝试操作的条目相对应的主键（pks）。以下是一个示例。

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
