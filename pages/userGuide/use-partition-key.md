---
id: 使用分区键.md
title: 使用分区键
---

# 使用分区键

本指南将指导您如何使用分区键来加速从您的集合中检索数据。

## 概述

Milvus 中的分区键允许根据各自的分区键值将传入的实体分配到不同的分区中。这允许具有相同键值的实体被分组到一个分区中，从而通过避免在按键字段过滤时扫描不相关的分区来加速搜索性能。与传统的过滤方法相比，分区键可以大大增强查询性能。

您可以使用分区键来实现多租户。有关多租户的详细信息，请阅读 [多租户](https://milvus.io/docs/multi_tenancy.md) 以获取更多信息。

<div class="alert note">

本页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a> (Python) 与 Milvus 交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 启用分区键

为了演示分区键的使用，我们将继续使用包含超过 5,000 篇文章的示例数据集，并且 __publication__ 字段将作为分区键。

```python
import json, time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

COLLECTION_NAME="medium_articles_2020" # 设置您的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置您的数据集路径

# 1. 连接到集群
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 定义集合架构
schema = MilvusClient.create_schema(
    auto_id=True,
    partition_key_field="publication"
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="title_vector", datatype=DataType.FLOAT_VECTOR, dim=768)
schema.add_field(field_name="link", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="reading_time", datatype=DataType.INT64)
schema.add_field(field_name="publication", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="claps", datatype=DataType.INT64)
schema.add_field(field_name="responses", datatype=DataType.INT64)
```
在您定义了字段之后，设置其他必要的参数。

```python
# 3. 定义索引参数
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="title_vector",
    index_type="AUTOINDEX",
    metric_type="L2"
)
```

最后，您可以创建一个集合。

```python
# 4. 创建集合
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

## 插入数据

一旦集合准备好了，就可以按照以下方式开始插入数据：

### 准备数据

```python
with open(DATASET_PATH) as f:
    data = json.load(f)
    list_of_rows = data['rows']

    data_rows = []
    for row in list_of_rows:
        # 因为主键已启用 auto_id，所以删除 id 字段。
        del row['id']
        # 行中除了 title 和 title_vector 字段之外的其他键
        # 将被视为动态字段。
        data_rows.append(row)
```

### 插入数据

```python
# 7. 插入数据
res = client.insert(
    collection_name=COLLECTION_NAME,
    data=data_rows,
)

# 输出
#
# {
#     "insert_count": 5979
# }

time.sleep(5000)
```

## 使用分区键

一旦您索引并加载了集合以及插入了数据，就可以使用分区键进行相似性搜索。

<div class="admonition note">

<p><b>注意</b></p>

<p>要使用分区键进行相似性搜索，您应该在搜索请求的布尔表达式中包含以下内容之一：</p>
<ul>
<li><p><code>expr='&lt;partition_key&gt;=="xxxx"'</code></p></li>
<li><p><code>expr='&lt;partition_key&gt; in ["xxx", "xxx"]'</code></p></li>
</ul>
<p>请将 <code>&lt;partition_key&gt;</code> 替换为被指定为分区键的字段名称。</p>

</div>

```python
res = client.search(
    collection_name=COLLECTION_NAME,
    data=[data_rows