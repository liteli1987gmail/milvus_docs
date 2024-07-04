


# 标题：索引标量字段

在 Milvus 中，标量索引用于通过特定的非向量字段值加速元数据过滤，类似于传统数据库索引。本指南将指导你创建和配置针对整数、字符串等字段的标量索引。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a> (Python)与 Milvus 进行交互。其他语言的新版 MilvusClient SDK 将在未来更新中发布。

</div>

## 标量索引的类型

- __[自动索引](https://milvus.io/docs/index-scalar-fields.md#Auto-indexing)__: Milvus 根据标量字段的数据类型自动决定索引类型。当你不需要控制特定索引类型时，可以使用此选项。

- __[自定义索引](https://milvus.io/docs/index-scalar-fields.md#Custom-indexing)__: 你可以指定精确的索引类型，例如倒排索引。这样可以更好地控制索引类型的选择。

## 自动索引

要使用自动索引，请忽略 __index_type__ 参数，以使 Milvus 可以根据标量字段类型推断索引类型。有关标量数据类型和默认索引算法之间的映射，请参阅 [标量字段索引算法](https://milvus.io/docs/scalar_index.md#Scalar-field-indexing-algorithms)。

示例：

```python
# 自动索引
client = MilvusClient(
    uri="http://localhost:19530"
)

index_params = client.create_index_params() # 准备一个空的IndexParams对象，无需指定任何索引参数

index_params.add_index(
    field_name="scalar_1", # 要索引的标量字段名称
    index_type="", # 要创建的索引类型。对于自动索引，保留为空或省略此参数。
    index_name="default_index" # 要创建的索引名称
)

client.create_index(
  collection_name="test_scalar_index", # 指定集合名称
  index_params=index_params
)
```

## 自定义索引




使用自定义索引，请在 __index_type__ 参数中指定特定的索引类型。

```python
index_params = client.create_index_params() # 准备一个IndexParams对象

index_params.add_index(
    field_name="scalar_2", # 要索引的标量字段的名称
    index_type="INVERTED", # 要创建的索引类型
    index_name="inverted_index" # 要创建的索引的名称
)

client.create_index(
  collection_name="test_scalar_index", # 指定集合名称
  index_params=index_params
)
```

__方法和参数__

- __create_index_params()__

    准备一个 __IndexParams__ 对象。

- __add_index()__

    将索引配置添加到 __IndexParams__ 对象中。

    - __field_name__ (_string_)

        要索引的标量字段的名称。

    - __index_type__ (_string_): 

        要创建的标量索引的类型。对于隐式索引，保留为空或省略此参数。

        对于自定义索引，有效的值包括:

        - __INVERTED__：(推荐)倒排索引包含一个包含所有标记化单词按字母顺序排序的词典。详细信息请参见标量索引。

        - __STL_SORT__：使用标准模板库排序算法对标量字段进行排序。支持布尔值和数字字段 (例如，INT8、INT16、INT32、INT64、FLOAT、DOUBLE)。

        - __Trie__：用于快速前缀搜索和检索的树数据结构。支持 VARCHAR 字段。

    - __index_name__ (_string_)

        要创建的标量索引的名称。每个标量字段支持一个索引。

- __create_index()__

    在指定的集合中创建索引。

    - __collection_name__ (_string_)

        要创建索引的集合的名称。

    - __index_params__

        包含索引配置的 __IndexParams__ 对象。

## 验证结果

使用 __list_indexes()__ 方法来验证标量索引的创建：

```python
client.list_indexes(
    collection_name="test_scalar_index"  # 指定集合名称
)

# 输出:
# ['default_index','inverted_index']
```

## 限制




- 目前，标量索引支持 INT8、INT16、INT32、INT64、FLOAT、DOUBLE、BOOL 和 VARCHAR 数据类型，但不支持 JSON 和 ARRAY 类型。

