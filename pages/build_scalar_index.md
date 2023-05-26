

标量字段上建立索引
====


本指南描述了如何在标量字段上建立索引。


与向量不同，标量只有大小而没有方向。Milvus将单个数字和字符串视为标量。在Milvus中，这里是标量字段的可用数据类型[列表](schema.md#Supported-data-type)

从Milvus v2.1.0开始，为标量字段构建索引可以加速[属性过滤](boolean.md)在[混合搜索](hybridsearch.md)中的应用。您可以在此处[了解更多](scalar_index.md)关于标量字段索引的信息。


构建索引
-----------

对于标量字段，您无需设置任何索引参数即可构建索引。标量字段索引名称的默认值为 ***default_idx***，您可以将其设置为适合的其他值。

以下代码片段假设已经存在一个名为“book”的 collection，并且在字符串字段“book_name”上创建了一个索引。

```bash
from pymilvus import Collection

collection = Collection("book")   
collection.create_index(
  field_name="book_name", 
  index_name="scalar_index",
)
collection.load()

```

索引创建完成后，可以在向量相似度搜索中包含此字符串字段的布尔表达式，如下所示：

```bash
search_param = {
  "data": [[0.1, 0.2]],
  "anns_field": "book_intro",
  "param": {"metric_type": "L2", "params": {"nprobe": 10}},
  "limit": 2,
  "expr": "book_name like "Hello" ", 
}
res = collection.search(**search_param)

```

接下来的步骤
-----------

* 要了解更多有关标量字段索引的信息，请阅读[标量索引（Scalar Index）](scalar_index.md)。
* 要了解有关上述提到的相关术语和规则的更多信息，请阅读：

	+ [Bitset](bitset.md)
	+ [Hybrid search](hybridsearch.md)
	+ [Boolean expression rules](boolean.md)
	+ [Supported data types](schema.md#Supported-data-type)
