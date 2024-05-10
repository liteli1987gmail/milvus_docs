---
id: array_data_type.md
related_key: array_data_type
summary: Array data type in Milvus.
title: Array
---

# 数组

在 Milvus 中，数组数据类型是一个有序的元素集合，其中每个元素可以是特定的数据类型：INT、VARCHAR、BOOL、FLOAT 或 DOUBLE。当你需要在单个字段中存储多个值时，数组特别有用。

<div class="alert note">

单个数组中的所有元素必须具有相同的数据类型。

</div>

为了演示数组字段的使用，我们准备了一份来自 Kaggle 的 [数据集](https://www.kaggle.com/datasets/shiyu22chen/cleaned-medium-articles-dataset)，其中包含了 2020 年 1 月至 2020 年 8 月在 Medium.com 上发布的 articles。

在本主题中，我们加载了数据集中的前 100 个实体，并将 `link` 和 `publication` 字段的值组织到一个名为 `var_array` 的数组字段中，将 `reading_time`、`claps` 和 `responses` 的值组织到一个名为 `int_array` 的数组字段中。

数据结构如下所示：

```json
{
    'title': 'The Reported Mortality Rate of Coronavirus Is Not Important',
    'title_vector': [0.041732933, 0.013779674, -0.027564144, ..., 0.030096486],
    'var_array': ['https://medium.com/swlh/the-reported-mortality-rate-of-coronavirus-is-not-important-369989c8d912', 'The Startup'],
    'int_array': [13, 1100, 18]
}
```

供你参考，以下是可以用来处理示例数据集的代码：

```python
import pandas as pd

# 加载下载的数据集的前 100 个实体
df = pd.read_csv('New_Medium_Data.csv', nrows=100)
for i in range(100):
    df['title_vector'][i] = eval(df['title_vector'][i])

# 将指定字段转换为数组
df['var_array'] = df[['link', 'publication']].values.tolist()
df['int_array'] = df[['reading_time', 'claps', 'responses']].values.tolist()

# 删除原始列
df = df.drop(columns=['link', 'publication', 'reading_time', 'claps', 'responses'])

# 将 DataFrame 转换为字典列表
data = df.to_dict('records')
```

## 定义数组字段

在定义数组字段时，为数组字段中的元素指定以下参数：

- `element_type`: (必需) 数组中元素的数据类型。有效值：`DataType.Int8`, `DataType.Int16`, `DataType.Int32`, `DataType.Int64`, `DataType.VARCHAR`, `DataType.BOOL`, `DataType.FLOAT`, 和 `DataType.DOUBLE`。
- `max_capacity`: (必需) 数组字段可以包含的元素的最大数量。值范围：[1, 4,096]。
- `max_length`: 数组字段中每个 VARCHAR 元素的最大长度。当 `element_type` 设置为 `DataType.VARCHAR` 时，此参数是必需的。值范围：[1, 65,535]。

```python
# 定义数组字段

from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType

connections.connect(host='localhost', port='19530')

# 1. 定义字段
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=False, max_length=100),
    FieldSchema(name='title', dtype=DataType.VARCHAR, max_length=512),
    FieldSchema(name='title_vector', dtype=DataType.FLOAT_VECTOR, dim=768),
    # 定义 VARCHAR 元素的 ARRAY 字段
    FieldSchema(name='var_array', dtype=DataType.ARRAY, element_type=DataType.VARCHAR, max_capacity=900, max_length=1000),
    # 定义 INT64 元素的 ARRAY 字段
    FieldSchema(name='int_array', dtype=DataType.ARRAY, element_type=DataType.INT64, max_capacity=900)
]

# 2. 在模式定义中启用动态模式
schema = CollectionSchema(
    fields,
    "The schema for a medium news collection",
    enable_dynamic_field=True # 可选，默认为 'False'。
)

# 3. 在集合中引用模式
collection = Collection("medium_articles_with_array", schema)

# 4. 索引向量字段
index_params = {
    "index_type": "AUTOINDEX",
    "metric_type": "L2",
    "params": {}
}

collection.create_index(
    field_name="title_vector",
    index_params=index_params
)

# 5. 加载集合
collection.load()
```

## Insert field values

Once the collection is created, you can insert the processed data into it.

<div class="alert note">

If `auto_id` is set to `True` for a collection, insert data without the primary key field. Otherwise, an error can occur during data insert.

</div>

```python
# Insert field values

# 1. insert data
collection.insert(data)

# 2. call the flush API to make inserted data immediately available for search
collection.flush()

print("Entity counts: ", collection.num_entities)

# Output
# Entity counts:  100
```

## Search or query with array fields

Then, you can search or query with array fields in the same manner as you would with a standard scalar field.

Search data with `int_array` to filter entities whose `reading_time` is between 10 and 20 (exclusive).

```python
# 1. search data with `int_array`
result = collection.search(
    data=data[0]['title_vector'],
    anns_field='title_vector',
    param={"metric_type": "L2", "params": {"nprobe": 10}},
    limit=3,
    expr='10 < int_array[0] < 20',
    output_fields=['title','int_array']
)

for hits in result:
    print("Matched IDs: ", hits.ids)
    print("Distance to the query vector: ", hits.distances)
    print("Matched articles: ")
    for hit in hits:
        print(
            "Title: ",
            hit.entity.get("title"),
            ", Reading time: ",
            hit.entity.get("int_array")[0]
        )
```

Query data with `var_array` to filter entities whose `publication` is `'The Startup'`.

```python
# 2. query data with `var_array`
result = collection.query(
    expr='var_array[1] == "The Startup"',
    output_fields=['title','var_array']
)

for hits in result:
    print("Matched IDs: ", hits.id)
    print("Matched articles: ")
    for hit in hits:
        print(
            "Title: ",
            hit.entity.get("title"),
            ", Publication: ",
            hit.entity.get("var_array")[1]
        )
```

Check whether `int_array` contains element `10`.

```python
# 3. use array_contains to check whether an array contains a specific element

collection.query(
    expr='array_contains(int_array, 10)',
    output_fields=['title','int_array']
)
```

## Limits

When working with array fields, you can enclose a string value with either double quotation marks ("") or single quotation marks (''). It's important to note that Milvus stores string values in the array field as is without performing semantic escape or conversion. For instance, **'a"b'**, **"a'b"**, **'a\'b'**, and **"a\"b"** will be saved as is, while **'a'b'** and **"a"b"** will be treated as invalid values.

Assume that two array fields `int_array` and `var_array` have been defined. The following table describes the supported boolean expressions that you can use in `expr` when searching with array fields.

| Operator                                | Examples                                                                    | Remarks                                                                                                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <                                       | <code>'int_array[0] < 3'</code>                                             | This expression evaluates to true if the value of <code>int_array[0]</code> is less than 3.                                                                                                     |
| >                                       | <code>'int_array[0] > 5'</code>                                             | This expression evaluates to true if the value of <code>int_array[0]</code> is greater than 5.                                                                                                  |
| ==                                      | <code>'int_array[0] == 0'</code>                                            | This expression evaluates to true if the value of <code>int_array[0]</code> is equal to 0.                                                                                                      |
| !=                                      | <code>'var_array[0] != "a"'</code>                                          | This expression evaluates to true if the value of <code>var_array[0]</code> is not equal to <code>"a"</code>.                                                                                   |
| <=                                      | <code>'int_array[0] <= 3'</code>                                            | This expression evaluates to true if the value of <code>int_array[0]</code> is smaller than or equal to 3.                                                                                      |
| >=                                      | <code>'int_array[0] >= 10'</code>                                           | This expression evaluates to true if the value of <code>int_array[0]</code> is greater than or equal to 10.                                                                                     |
| in                                      | <code>'var_array[0] in ["str1", "str2"]'</code>                             | This expression evaluates to true if the value of <code>var_array[0]</code> is <code>"str1"</code> or <code>"str2"</code>.                                                                      |
| not in                                  | <code>'int_array[0] not in [1, 2, 3]'</code>                                | This expression evaluates to true if the value of <code>int_array[0]</code> is not 1, 2, or 3.                                                                                                  |
| +, -, \*, /, %, \*\*                    | <code>'int_array[0] + 100 > 200'</code>                                     | This expression evaluates to true if the value of <code>int_array[0] + 100</code> is greater than 200.                                                                                          |
| like (LIKE)                             | <code>'var_array[0] like "prefix%"'</code>                                  | This expression evaluates to true if the value of <code>var_array[0]</code> is prefixed with <code>"prefix"</code>.                                                                             |
| and (&&)                                | <code>'var_array[0] like "prefix%" && int_array[0] <= 100'</code>           | This expression evaluates to true if the value of <code>var_array[0]</code> is prefixed with <code>"prefix"</code>, and the value of <code>int_array[0]</code> is smaller than or equal to 100. |
| or (&#124;&#124;)                       | <code>'var_array[0] like "prefix%" &#124;&#124; int_array[0] <= 100'</code> | This expression evaluates to true if the value of <code>var_array[0]</code> is prefixed with <code>"prefix"</code>, or the value of <code>int_array[0]</code> is smaller than or equal to 100.  |
| array_contains (ARRAY_CONTAINS)         | <code>'array_contains(int_array, 100)'</code>                               | This expression evaluates to true if <code>int_array</code> contains element <code>100</code>.                                                                                                  |
| array_contains_all (ARRAY_CONTAINS_ALL) | <code>'array_contains_all(int_array, [1, 2, 3])'</code>                     | This expression evaluates to true if <code>int_array</code> contains all elements <code>1</code>, <code>2</code>, and <code>3</code>.                                                           |
| array_contains_any (ARRAY_CONTAINS_ANY) | <code>'array_contains_any(var_array, ["a", "b", "c"])'</code>               | This expression evaluates to true if <code>var_array</code> contains any element of <code>"a"</code>, <code>"b"</code>, and <code>"c"</code>.                                                   |
| array_length                            | <code>'array_length(int_array) == 10'</code>                                | This expression evaluates to true if <code>int_array</code> contains exactly 10 elements.                                                                                                       |

## What’s next

- [Dynamic Schema](enable-dynamic-field.md)
- [JSON](use-json-fields.md)
