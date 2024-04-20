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

