

# 启用动态字段

本页介绍了如何在集合中使用动态字段来进行灵活的数据插入和检索。

## 概述

对于 Milvus 数据处理来说，模式设计是很关键的。在向集合中插入实体之前，需要明确模式设计，并确保随后插入的所有数据实体都符合模式。但是，这限制了集合的使用，使其类似于关系数据库中的表格。

动态模式使用户能够在不修改现有模式的情况下向集合中插入具有新字段的实体。这意味着用户可以在不了解集合的完整模式的情况下插入数据，并且可以包含尚未定义的字段。

动态模式还提供了数据处理的灵活性，使用户能够在集合中存储和检索复杂的数据结构。包括嵌套数据、数组和其他复杂的数据类型。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 启用动态字段

要使用动态模式创建一个集合，请在定义数据模型时将 `enable_dynamic_field` 设置为 `True`。之后，插入的所有未定义字段及其值将被视为预定义字段。我们更倾向于使用术语 "动态字段" 来指代这些键值对。

使用这些动态字段，你可以要求 Milvus 在搜索/查询结果中输出动态字段，并在搜索和查询过滤表达式中包含它们，就像它们已经在集合模式中定义一样。

```python
import json, os, time
from pymilvus import MilvusClient, DataType

COLLECTION_NAME="medium_articles_2020" # 设置你的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置你的数据集路径

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

一旦集合被创建，就可以开始插入数据，包括动态数据。

### 准备数据

现在我们需要准备一段适用的数据。

```python
# 6. 准备数据
with open(DATASET_PATH) as f:
    data = json.load(f)
    list_of_rows = data['rows']

    data_rows = []
    for row in list_of_rows:
        # 删除id字段，因为主键已启用auto_id。
        del row['id']
        # 行中的除了title和title_vector字段之外的其他键会被视为动态字段。
        data_rows.append(row)
```

### 插入数据



# 
然后你可以将数据安全地插入到集合中。

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

如果你已经启用了动态字段并插入了非模式定义的字段，你可以按照以下方式在搜索或查询的过滤表达式中使用这些字段：

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
#                 "title": "冠状病毒的隐藏副作用",
#                 "reading_time": 8,
#                 "claps": 83
#             }
#         },
#         {
#             "id": 443943328732915438,
#             "distance": 0.37674015760421753,
#             "entity": {
#                 "title": "为什么冠状病毒的死亡率是误导的",
#                 "reading_time": 9,
#                 "claps": 2900
#             }
#         },
#         {
#             "id": 443943328732913238,
#             "distance": 0.4162980318069458,
#             "entity": {
#                 "title": "冠状病毒展示出亚马逊的伦理可能性",
#                 "reading_time": 4,
#                 "claps": 51
#             }
#         }
#     ]
# ]
```

## 回顾
 


请注意，当你定义模式时，__claps__ 和 __reading_time__ 不存在，但这并不妨碍你在过滤表达式中使用它们，并在输出字段中包含它们，只要插入的数据实体具有这些字段，就像你以往一样。

如果动态字段的键包含除了数字、字母和下划线之外的字符（例如加号、星号或美元符号），你需要像下面的代码片段中所示，在布尔表达式中使用它或将其包含在输出字段中时，在 __$meta []__ 中包含键。

```python
... 
expr='$meta["#key"] in ["a", "b", "c"]', 
output_fields='$meta["#key"]'  
...
```

