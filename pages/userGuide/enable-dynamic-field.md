---
id: 启用动态字段.md
title: 启用动态字段
---

# 启用动态字段

本页解释了如何在集合中使用动态字段以灵活地插入和检索数据。

## 概述

模式设计对于 Milvus 数据处理至关重要。在将实体插入集合之前，需要明确模式设计，并确保之后插入的所有数据实体都与该模式相匹配。然而，这限制了集合，使它们类似于关系数据库中的表。

动态模式允许用户在不修改现有模式的情况下，将具有新字段的实体插入集合。这意味着用户可以在不知道集合的完整模式的情况下插入数据，并且可以包含尚未定义的字段。

动态模式还为数据处理提供了灵活性，使用户能够在其集合中存储和检索复杂的数据结构。这包括嵌套数据、数组和其他复杂的数据类型。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 交互。未来更新中将发布其他语言的新 MilvusClient SDK。

</div>

## 启用动态字段

要使用动态模式创建集合，定义数据模型时将 `enable_dynamic_field` 设置为 `True`。之后，插入之后的所有未定义字段及其值将被视为预定义字段。我们倾向于使用“动态字段”一词来指代这些键值对。

有了这些动态字段，您可以要求 Milvus 在搜索/查询结果中输出动态字段，并将它们包含在搜索和查询过滤表达式中，就像它们已经在集合模式中定义一样。

```python
import json, os, time
from pymilvus import MilvusClient, DataType

COLLECTION_NAME="medium_articles_2020" # 设置您的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置您的数据集路径

# 1. 连接到集群
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 定义集合模式
schema = MilvusClient.create_schema(
    auto_id=True,
    enable_dynamic_field=True
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="title_vector", datatype=DataType.FLOAT_VECTOR, dim=768)

# 3. 定义索引参数
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="title_vector",
    index_type="AUTOINDEX",
    metric_type="L2"
)

# 4. 创建集合
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

## 插入动态数据

一旦创建了集合，您就可以开始插入数据，包括将动态数据插入集合。

### 准备数据

现在我们需要准备一段适用的数据。

```python
# 6. 准备数据
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

然后您可以安全地将数据插入集合。

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

## 使用动态字段进行搜索

如果您已启用动态字段并创建了集合，并插入了未定义模式的字段，则可以在搜索或查询的过滤表达式中使用这些字段，如下所示：

```python
# 8. 搜索数据
res = client.search(
    collection_name=COLLECTION_NAME,
    data=[data_rows[0]['title_vector']],
    filter='claps > 30 and reading_time < 10',
    limit=3,
    output_fields=["title", "reading_time", "claps"],
    search_params={"metric_type": "L2", "params": {}}
)

print(result)

# 输出
#
# [
#     [
#         {
#             "id": 443943328732915404,
#             "distance": 0.36103835701942444,
#             "entity": {
#                 "title": "The Hidden Side Effect of the Coronavirus",
#                 "reading_time": 