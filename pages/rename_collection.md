重命名集合
=====

如果您想要重命名集合，可以使用集合重命名API与Milvus交互。本指南将帮助您了解如何使用所选的SDK重命名现有集合。

在以下代码片段中，我们创建一个名为`old_collection`的集合，然后将其重命名为`new_collection`。

```
from pymilvus import Collection, FieldSchema, CollectionSchema, DataType, connections, utility
connections.connect(alias="default")
schema = CollectionSchema(fields=[
...     FieldSchema("int64", DataType.INT64, description="int64", is_primary=True),
...     FieldSchema("float_vector", DataType.FLOAT_VECTOR, is_primary=False, dim=128),
... ])
collection = Collection(name="old_collection", schema=schema)
utility.rename_collection("old_collection", "new_collection") # Output: True
utility.drop_collection("new_collection")
utility.has_collection("new_collection") # Output: False

```

对于其他编程语言风格的代码示例，请继续观看。

接下来是什么
------

* [将数据插入到Milvus](insert_data.md)

* [创建分区](create_partition.md)

* [为向量构建索引](build_index.md)

* [进行向量搜索](search.md)

* [进行混合搜索](hybridsearch.md)
