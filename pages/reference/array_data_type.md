

                
# 数组

在 Milvus 中，数组（Array）是一个有序的元素集合，每个元素可以是特定的数据类型：INT、VARCHAR、BOOL、FLOAT 或 DOUBLE。当你需要在单个字段中存储多个值时，数组特别有用。

<div class="alert note">

单个数组内的所有元素必须是相同的数据类型。

</div>

为了演示使用数组字段，我们准备了一个包含 Medium.com 从 2020 年 1 月到 2020 年 8 月发布的文章的数据集 [a dataset from Kaggle](https://www.kaggle.com/datasets/shiyu22chen/cleaned-medium-articles-dataset)。

在这个主题中，我们加载数据集中的前 100 个实体，并将 `link` 和 `publication` 字段的值组织成一个名为 `var_array` 的数组字段，将 `reading_time`、`claps` 和 `responses` 的值组织成一个名为 `int_array` 的数组字段。

数据结构类似于以下示例：

```json
{

		'title': 'The Reported Mortality Rate of Coronavirus Is Not Important',
		'title_vector': [0.041732933, 0.013779674, -0.027564144, ..., 0.030096486],
		'var_array': ['https://medium.com/swlh/the-reported-mortality-rate-of-coronavirus-is-not-important-369989c8d912', 'The Startup'],
		'int_array': [13, 1100, 18]

}
```

供参考，以下代码可用于处理示例数据集：

```python
import pandas as pd

# 加载下载的数据集的前100个实体
df = pd.read_csv('New_Medium_Data.csv', nrows=100)
for i in range(100):
	df['title_vector'][i] = eval(df['title_vector'][i])

# 将指定字段转换为数组
df['var_array'] = df[['link', 'publication']].values.tolist()
df['int_array'] = df[['reading_time', 'claps', 'responses']].values.tolist()

# 删除原始列
df = df.drop(columns=['link', 'publication', 'reading_time', 'claps', 'responses'])

# 将DataFrame转换为字典列表
data = df.to_dict('records')
```

## 定义数组字段



        I provide the content of the markdown document that needs to be translated. Only the headings, paragraphs, and list content in markdown syntax need to be translated. Words in camel case and underscore do not need to be translated. Please retain the punctuations of md syntax. After you finish translating, replace the original content and return the result to me.
        
        When defining an array field, specify the following arguments for elements in the array field:

        - `element_type`: (Required) Data type of elements in an array. Valid values: `DataType.Int8`, `DataType.Int16`, `DataType.Int32`, `DataType.Int64`, `DataType.VARCHAR`, `DataType.BOOL`, `DataType.FLOAT`, and `DataType.DOUBLE`.
        - `max_capacity`: (Required) Maximum number of elements that an array field can contain. Value range: [1, 4,096].
        - `max_length`: Maximum length of strings for each VARCHAR element in an array field. This argument is required when `element_type` is set to `DataType.VARCHAR`. Value range: [1, 65,535].

        ```python
        # Define array fields

        from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType

        connections.connect(host='localhost', port='19530')

        # 1. define fields
        fields = [
            FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=False, max_length=100),
            FieldSchema(name='title', dtype=DataType.VARCHAR, max_length=512),
            FieldSchema(name='title_vector', dtype=DataType.FLOAT_VECTOR, dim=768),
            # define ARRAY field with VARCHAR elements
            FieldSchema(name='var_array', dtype=DataType.ARRAY, element_type=DataType.VARCHAR, max_capacity=900, max_length=1000),
            # define ARRAY field with INT64 elements
            FieldSchema(name='int_array', dtype=DataType.ARRAY, element_type=DataType.INT64, max_capacity=900)
        ]

        # 2. enable dynamic schema in schema definition
        schema = CollectionSchema(
                fields, 
                "The schema for a medium news collection", 
                enable_dynamic_field=True # Optional, defaults to 'False'.
        )

        # 3. reference the schema in a collection
        collection = Collection("medium_articles_with_array", schema)

        # 4. index the vector field
        index_params = {
            "index_type": "AUTOINDEX",
            "metric_type": "L2",
            "params": {}
        }

        collection.create_index(
          field_name="title_vector", 
          index_params=index_params
        )

        # 5. load the collection
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



## Limits

使用相同的方式搜索或查询数组字段，就像使用标量字段一样。

使用 `int_array` 进行搜索，过滤 `reading_time` 在 10 与 20 之间（不包括 10 和 20）的实体。

```python
# 1. 使用 `int_array` 进行搜索
result = collection.search(
    data=data[0]['title_vector'],
    anns_field='title_vector',
    param={"metric_type": "L2", "params": {"nprobe": 10}},
    limit=3,
    expr='10 < int_array[0] < 20',
    output_fields=['title','int_array']
)

for hits in result:
    print("匹配的 ID：", hits.ids)
    print("与查询向量的距离：", hits.distances)
    print("匹配的文章：")
    for hit in hits:
        print(
            "标题：", 
            hit.entity.get("title"), 
            "，阅读时间：", 
            hit.entity.get("int_array")[0]
        )
```

使用 `var_array` 进行查询，过滤 `publication` 为 `'The Startup'` 的实体。

```python
# 2. 使用 `var_array` 进行查询
result = collection.query(
    expr='var_array[1] == "The Startup"',
    output_fields=['title','var_array']
)

for hits in result:
    print("匹配的 ID：", hits.id)
    print("匹配的文章：")
    for hit in hits:
        print(
            "标题：",
            hit.entity.get("title"),
            "，出版物：",
            hit.entity.get("var_array")[1]
        )
```

检查 `int_array` 是否包含元素 `10`。

```python
# 3. 使用 array_contains 检查数组是否包含特定元素

collection.query(
    expr='array_contains(int_array, 10)',
    output_fields=['title','int_array']
)
```

## 限制

在使用数组字段时，可以使用双引号（""）或单引号（''）将字符串值括起来。需要注意的是，Milvus 将字符串值存储在数组字段中时，不会执行语义转义或转换。例如，**'a "b'**、**" a'b "**、**'a\'b'** 和 **" a\"b"** 会原样保存，而 **'a'b'** 和 **"a" b " ** 会被视为无效值。

假设已经定义了两个数组字段 `int_array` 和 `var_array`。以下表格描述了在使用数组字段进行搜索时，在 `expr` 中支持的布尔表达式。

| 运算符          | 示例                                                          | 备注                                                                                                                                                                           |
|-------------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <                 | <code>'int_array [0] < 3'</code>                                   | 当 <code> int_array [0] </code> 的值小于 3 时，该表达式为真。                                                                                                    |
| >                 | <code>'int_array [0] > 5'</code>                                   | 当 <code> int_array [0] </code> 的值大于 5 时，该表达式为真。                                                                                                 |
| ==                | <code>'int_array [0] == 0'</code>                                  | 当 <code> int_array [0] </code> 的值等于 0 时，该表达式为真。                                                                                                     |
| !=                | <code>'var_array [0] != "a"'</code>                                | 当 <code> var_array [0] </code> 的值不等于 <code> "a" </code> 时，该表达式为真。                                                                                                   |
| <=                | <code>'int_array [0] <= 3'</code>                                  | 当 <code> int_array [0] </code> 的值小于或等于 3 时，该表达式为真。                                                                                     |
| >=                | <code>'int_array [0] >= 10'</code>                                 | 当 <code> int_array [0] </code> 的值大于或等于 10 时，该表达式为真。                                                                                    |
| in                | <code>'var_array [0] in ["str1", "str2"]'</code>                   | 当 <code> var_array [0] </code> 的值为 <code> "str1" </code> 或 <code> "str2" </code> 时，该表达式为真。                                                                                               |
| not in            | <code>'int_array [0] not in [1, 2, 3]'</code>                      | 当 <code> int_array [0] </code> 的值不为 1、2 或 3 时，该表达式为真。                                                                                                 |
| +, -, *, /, %, ** | <code>'int_array [0] + 100 > 200'</code>                           | 当 <code> int_array [0] + 100 </code> 的值大于 200 时，该表达式为真。                                                                                         |
| like (LIKE)       | <code>'var_array [0] like "prefix%"'</code>                        | 当 <code> var_array [0] </code> 的值以 <code> "prefix" </code> 开头时，该表达式为真。                                                                                         |
| and (&&)          | <code>'var_array [0] like "prefix%" && int_array [0] <= 100'</code> | 当 <code> var_array [0] </code> 的值以 <code> "prefix" </code> 开头，并且 <code> int_array [0] </code> 的值小于或等于 100 时，该表达式为真。 |
| or (&#124;&#124;) | <code>'var_array [0] like "prefix%" &#124;&#124; int_array [0] <= 100'</code> | 当 <code> var_array [0] </code> 的值以 <code> "prefix" </code> 开头，或者 <code> int_array [0] </code> 的值小于或等于 100 时，该表达式为真。 |
| array_contains (ARRAY_CONTAINS) | <code>'array_contains(int_array, 100)'</code> | 当 <code> int_array </code> 包含元素 <code> 100 </code> 时，该表达式为真。 |
| array_contains_all (ARRAY_CONTAINS_ALL) | <code>'array_contains_all(int_array, [1, 2, 3])'</code> | 当 <code> int_array </code> 包含所有元素 <code> 1 </code>、<code> 2 </code> 和 <code> 3 </code> 时，该表达式为真。 |
| array_contains_any (ARRAY_CONTAINS_ANY) | <code>'array_contains_any(var_array, ["a", "b", "c"])'</code> | 当 <code> var_array </code> 包含任意元素 <code> "a" </code>、<code> "b" </code> 和 <code> "c" </code> 时，该表达式为真。 |
| array_length | <code>'array_length(int_array) == 10'</code> | 当 <code> int_array </code> 包含恰好 10 个元素时，该表达式为真。 |

## 下一步操作



# 


- [动态模式](/userGuide/enable-dynamic-field.md)
- [JSON](/userGuide/use-json-fields.md)

 