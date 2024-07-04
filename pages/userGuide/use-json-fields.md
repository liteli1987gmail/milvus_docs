


# 使用 JSON 字段

本指南将说明如何使用 JSON 字段，包括插入 JSON 值以及使用基本和高级运算符在 JSON 字段中进行搜索和查询。

<div class="admonition note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。将来更新将发布适用于其他语言的新 MilvusClient SDK。

</div>

## 概述

JSON 是 JavaScript 对象表示法的缩写。它是一种简单且轻量级的基于文本的数据格式。JSON 中的数据以键值对的形式进行结构化。每个键都是一个字符串，对应一个可以是数字、字符串、布尔值、列表或数组的值。在 Milvus 中，你可以将字典作为文档集合中的字段值存储。

例如，以下是存储发布文章的元数据的 JSON 字段示例：

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

<p> <b> 注意事项 </b> </p>

<ul>
<li> <p> 确保列表或数组中的所有值具有相同的数据类型。</p> </li>
<li> <p> JSON 字段值中的任何嵌套字典都将被视为字符串。</p> </li>
<li> <p> 仅使用字母数字字符和下划线来命名 JSON 键，因为其他字符可能导致过滤或搜索时出现问题。</p> </li>
<li> 目前，不支持对 JSON 字段进行索引，这可能导致过滤操作耗时。但是，这个限制将在未来的发布中解决。</li>
</ul>

</div>

## 定义 JSON 字段

要定义 JSON 字段，只需按照定义其他类型字段的相同步骤进行操作。

```python
import os, json, time
from pymilvus import MilvusClient, DataType

COLLECTION_NAME="medium_articles_2020" # 设置你的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置你的数据集路径

# 1. 连接到集群
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 定义集合模式
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

# 4. 创建集合
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

## 插入字段值







在使用 `CollectionSchema` 对象创建集合之后，可以将上面的字典插入其中。

```python
# 6. 准备数据
import random

with open(DATASET_PATH) as f:
    data = json.load(f)
    list_of_rows = data['rows']

    data_rows = []
    for row in list_of_rows:
        # 移除id字段，因为对于主键启用了自动id
        del row['id']
        # 创建article_meta字段
        row['article_meta'] = {}
        # 将以下键移入article_meta字段中
        row['article_meta']['link'] = row.pop('link')
        row['article_meta']['reading_time'] = row.pop('reading_time')
        row['article_meta']['publication'] = row.pop('publication')
        row['article_meta']['claps'] = row.pop('claps')
        row['article_meta']['responses'] = row.pop('responses')
        row['article_meta']['tag_1'] = [ random.randint(0, 40) for _ in range(5)],
        row['article_meta']['tag_2'] = [ [ random.randint(0, 10) for _ in range(3) ] for _ in range(3)]
        # 将此行添加到data_rows列表中
        data_rows.append(row)

# 7. 插入数据

res = client.insert(
    collection_name=COLLECTION_NAME,
    data=data_rows
)

print(res)

# 输出
#
# 数据插入成功！已插入数量：5979
```

## 在 JSON 字段内搜索



# 
一旦你添加了所有的数据，你可以使用 JSON 字段中的键进行搜索，就像使用标准标量字段一样。只需按照以下步骤进行操作：

```python
＃ 8.搜索数据
result = collection.search(
    data=[data_rows[0]['title_vector']],
    anns_field="title_vector",
    param={"metric_type": "L2", "params": {"nprobe": 10}},
    limit=3,
    ＃ 访问JSON字段中的键
    expr='article_meta["claps"] > 30 and article_meta["reading_time"] < 10',
    ＃ 包含在输出中返回JSON字段
    output_fields=["title", "article_meta"],
)

print([list(map(lambda y: y.entity.to_dict(), x)) for x in result])

＃ 输出
＃
＃ [
＃   [
＃     {
＃         "id": 443943328732940369,
＃         "distance": 0.36103835701942444,
＃         "entity": {
＃             "title": "The Hidden Side Effect of the Coronavirus",
＃             "article_meta": {
＃                 "link": "https://medium.com/swlh/the-hidden-side-effect-of-the-coronavirus-b6a7a5ee9586",
＃                 "reading_time": 8,
＃                 "publication": "The Startup",
＃                 "claps": 83,
＃                 "responses": 0
＃             }
＃         }
＃     },
＃     {
＃         "id": 443943328732940403,
＃         "distance": 0.37674015760421753,
＃         "entity": {
＃             "title": "Why The Coronavirus Mortality Rate is Misleading",
＃             "article_meta": {
＃                 "link": "https://towardsdatascience.com/why-the-coronavirus-mortality-rate-is-misleading-cc63f571b6a6",
＃                 "reading_time": 9,
＃                 "publication": "Towards Data Science",
＃                 "claps": 2900,
＃                 "responses": 47
＃             }
＃         }
＃     },
＃     {
＃         "id": 443943328732938203,
＃         "distance": 0.4162980318069458,
＃         "entity": {
＃             "title": "Coronavirus shows what ethical Amazon could look like",
＃             "article_meta": {
＃                 "link": "https://medium.com/swlh/coronavirus-shows-what-ethical-amazon-could-look-like-7c80baf2c663",
＃                 "reading_time": 4,
＃                 "publication": "The Startup",
＃                 "claps": 51,
＃                 "responses": 0
＃             }
＃         }
＃     }
＃   ]
＃ ]

# 获取集合信息
print("Entity counts: ", collection.num_entities)

# 输出
# Entity counts: 5979
```

## 使用 JSON 键查询
 

访问 JSON 字段中的特定键，你可以通过在 `expr` 中包含 JSON 字段名称（例如 `article_meta["claps"]`）并把 JSON 字段名称包含在 `output_fields` 中来引用键名。然后你可以像访问普通字典一样访问返回的 JSON 值中的键。

- 筛选 `tag_1` 中包含 `4` 和 `14` 的文章。

    ```python
    # 解决方案 1
    res = client.query(
        collection_name="medium_articles_2020",
        # 突出开始
        filter='json_contains(tag_1, 4) and json_contains(tag_1, 14)',
        output_fields=["title", "tag_1"],
        # 突出结束
        limit=3
    )
    
    # 输出
    # 
    # 
    
    # 解决方案 2
    res = client.query(
        collection_name="medium_articles_2020",
        # 突出开始
        filter='json_contains_all(tag_1, [4, 14])',
        output_fields=["title", "tag_1"],
        # 突出结束
        limit=3
    )
    
    # 输出
    # 
    # 
    ```

- 筛选 `tag_2` 中包含 `[2, 12]` 的文章。

    ```python
    res = client.query(
        collection_name="medium_articles_2020",
        # 突出开始
        filter='json_contains(tag_2, [2, 12])',
        output_fields=["title", "tag_2"],
        # 突出结束
        limit=3
    )
    
    # 输出
    # 
    # 
    ```

- 筛选 `tag_1` 中包含 `5`、`7` 或 `9` 任一的文章。

    ```python
    res = client.query(
        collection_name="medium_articles_2020",
        # 突出开始
        filter='json_contains_any(tag_1, [5, 7, 9])',
        output_fields=["title", "tag_1"],
        # 突出结束
        limit=3
    )
    
    # 输出
    # 
    # 
    ```

## JSON 过滤器参考

使用 JSON 字段时，你可以直接使用 JSON 字段作为过滤器，或者使用其特定键。

<div class="admonition note">

<p> <b> 注意 </b> </p>

<ul>
<li> Milvus 将字符串值存储在 JSON 字段中，不执行语义转义或转换。 </li>
</ul>
<p> 例如，<code>'a "b'</code>、<code>" a'b "</code>、<code>'a\\\\'b'</code> 和 <code>" a\\\\"b" </code> 将原样保存，而 <code>'a'b'</code> 和 <code> "a" b " </code> 将被视为无效值。</p>
<ul>
<li> <p> 使用 JSON 字段构建过滤器表达式时，你可以利用字段内的键。 </p> </li>
<li> <p> 如果键的值是一个整数或浮点数，你可以将其与另一个整数或浮点数键或 INT32/64 或 FLOAT32/64 字段进行比较。</p> </li>
<li> <p> 如果键的值是一个字符串，你只能将其与另一个字符串键或 VARCHAR 字段进行比较。</p> </li>
</ul>

</div>

### JSON 字段中的基本操作符


下表假设一个名为 `json_key` 的 JSON 字段的值有一个名为 `A` 的键。在构建使用 JSON 字段键的布尔表达式时，请将其用作参考。

| 运算符  | 示例                                                         | 备注                                                                                                                     |
| ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
|  <      |  `'json_field[" A "] < 3'`                                     | 如果`json_field[" A "]`的值小于`3`，则此表达式求值为 true。                                                                   |
|  >      |  `'json_field["A"] > 1'`                                     | 如果 `json_field["A"]` 的值大于 `1`，则此表达式求值为 true。                                                                   |
|  ==     |  `'json_field["A"] == 1'`                                    | 如果 `json_field["A"]` 的值等于 `1`，则此表达式求值为 true。                                                                   |
|  !=     |  `'json_field["A"][0]' != "abc"'`                            | 如果：<br/> - `json_field` 没有名为 `A` 的键。<br/> - `json_field` 具有名为 `A` 的键，但 `json_field["A"]` 不是数组。<br/> - `json_field["A"]` 是一个空数组。<br/> - `json_field["A"]` 是一个数组，但第一个元素不是 `abc`。则此表达式求值为 true。 |
|  <=     |  `'json_field[" A "] <= 5'`                                    | 如果`json_field[" A "]`的值小于或等于`5`，则此表达式求值为 true。                                                             |
|  >=     |  `'json_field["A"] >= 1'`                                    | 如果 `json_field["A"]` 的值大于或等于 `1`，则此表达式求值为 true。                                                             |
|  not    |  `'not json_field["A"] == 1'`                                | 如果：<br/> - `json_field` 没有名为 `A` 的键。<br/> - `json_field["A"]` 不等于 `1`。则此表达式求值为 true。                     |
|  in     |  `'json_field["A"] in [1, 2, 3]'`                            | 如果 `json_field["A"]` 的值是 `1`、`2` 或 `3`，则此表达式求值为 true。                                                           |
|  and    |  `'json_field["A"] > 1 && json_field["A"] < 3'`              | 如果 `json_field["A"]` 的值大于 `1` 且小于 `3`，则此表达式求值为 true。                                                           |
|  or     |  `'json_field["A"] > 1 \|\| json_field["A"] < 3'`            | 如果 `json_field["A"]` 的值大于 `1` 或小于 `3`，则此表达式求值为 true。                                                           |
|  exists |  `'exists json_field["A"]'`                                  | 如果 `json_field` 有一个名为 `A` 的键，则此表达式求值为 true。                                                                    |

### 高级运算符



以下操作符仅适用于 JSON 字段：

- `json_contains(identifier, jsonExpr)`

    此操作符用于过滤包含指定 JSON 表达式的实体。

    - 示例 1：`{"x": [1,2,3]}`

        ```python
        json_contains(x, 1) # => True (x包含1)
        json_contains(x, "a") # => False (x不包含成员"a")
        ```

    - 示例 2：`{"x", [[1,2,3], [4,5,6], [7,8,9]]}`

        ```python
        json_contains(x, [1,2,3]) # => True (x包含[1,2,3])
        json_contains(x, [3,2,1]) # => False (x不包含成员[3,2,1])
        ```

- `json_contains_all(identifier, jsonExpr)`

    此操作符用于过滤包含 JSON 表达式的所有成员的实体。

    示例：`{"x": [1,2,3,4,5,7,8]}`

    ```python
    json_contains_all(x, [1,2,8]) # => True (x包含1、2和8)
    json_contains_all(x, [4,5,6]) # => False (x不包含成员6)
    ```

- `json_contains_any(identifier, jsonExpr)`

    此操作符用于过滤包含 JSON 表达式中任意成员的实体。

    示例：`{"x": [1,2,3,4,5,7,8]}`

    ```python
    json_contains_any(x, [1,2,8]) # => True (x包含1、2和8)
    json_contains_any(x, [4,5,6]) # => True (x包含4和5)
    json_contains_any(x, [6,9]) # => False (x不包含6和9中的任何一个)
    ```
    
