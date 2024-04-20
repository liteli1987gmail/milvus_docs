---

id: 使用-json字段.md
title: 使用 JSON 字段

---

# 使用 JSON 字段

本指南解释了如何使用 JSON 字段，例如插入 JSON 值以及使用基本和高级运算符在 JSON 字段中进行搜索和查询。

<div class="admonition note">

本页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 概述

JSON 是 Javascript Object Notation 的缩写。它是一种简单、轻量级的基于文本的数据格式。JSON 中的数据以键值对的形式结构化。每个键都是一个字符串，它对应一个可以是数字、字符串、布尔值、列表或数组的值。在 Milvus 中，您可以将字典作为字段值存储在集合中。

例如，以下是一个存储发表文章的元数据的 JSON 字段示例。

```python
{
    'title': 'The Reported Mortality Rate of Coronavirus Is Not Important', 
    'title_vector': [0.041732933, 0.013779674, -0.027564144, ..., 0.030096486], 
    'article_meta': {
        'link': 'https://medium.com/swlh/the-reported-mortality-rate-of-coronavirus-is-not-important-369989c8d912', 
        'reading_time': 13, 
        'publication': 'The Startup', 
        'claps': 1100, 
        'responses': 18,
        'tag_1': [4, 15, 6, 7, 9],
        'tag_2': [[2, 3, 4], [7, 8, 9], [5, 6, 1]]
    }
}
```

<div class="admonition note">

<p><b>注意事项</b></p>

<ul>
<li><p>确保列表或数组中的所有值都是相同的数据类型。</p></li>
<li><p>JSON 字段值中的任何嵌套字典都将被视为字符串。</p></li>
<li><p>使用仅包含字母数字字符和下划线的字符来命名 JSON 键，因为其他字符可能会导致过滤或搜索时出现问题。</p></li>
<li>目前，JSON 字段的索引尚不可用，这可能会使过滤过程变得耗时。然而，这个限制将在即将发布的版本中得到解决。</li>
</ul>

</div>

## 定义 JSON 字段

要定义一个 JSON 字段，只需按照定义其他类型字段的相同程序进行。

```python
import os, json, time
from pymilvus import MilvusClient, DataType

COLLECTION_NAME="medium_articles_2020" # 设置您的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置您的数据集路径

# 1. 连接到集群
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 定义集合架构
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="title_vector", datatype=DataType.FLOAT_VECTOR, dim=768)
schema.add_field(field_name="article_meta", datatype=DataType.JSON)

# 3. 定义索引参数
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="title_vector",
    index_type="AUTOINDEX",
    metric_type="L2"
)

# 4. 创建一个集合
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

## 插入字段值

从 `CollectionSchema` 对象创建集合后，可以将上述字典等数据插入其中。

```python
# 6. 准备数据
import random

with open(DATASET_PATH) as f:
    data = json.load(f)
    list_of_rows = data['rows']

    data_rows = []
    for row in list_of_rows:
        # 因为为主键启用了自动 ID，所以删除 id 字段
        del row['id']
        # 创建 article_meta 字段并
        row['article_meta'] = {}
        # 将以下键移动到 article_meta 字段
        row['article_meta']['link'] = row.pop('link')
        row['article_meta']['reading_time'] = row.pop('reading_time')
        row['article