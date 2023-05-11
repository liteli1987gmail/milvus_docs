
本指南描述了如何在标量字段上建立索引。

概览
--

与向量不同，标量只有大小而没有方向。Milvus将单个数字和字符串视为标量。在Milvus中，这里是标量字段的可用数据类型列表[。](schema.md#Supported-data-type)

从Milvus v2.1.0开始，为标量字段构建索引可以加速[属性过滤](boolean.md)在[混合搜索](hybridsearch.md)中的应用。您可以在此处[了解更多](scalar_index.md)关于标量字段索引的信息。

Build index
-----------

To build an index on scalar fields, you do not need to set any index parameters. The default value of a scalar field index name is ***default_idx***. You can set it to another value that seems fit.

The following code snippet assumes that a collection named `book` already exists and an index is to be created on the string field `book_name`.

```
from pymilvus import Collection

collection = Collection("book")   
collection.create_index(
  field_name="book_name", 
  index_name="scalar_index",
)
collection.load()

```

Once the index has been created, you can include a boolean expression on this string field in a vector similarity search as follows:

```
search_param = {
  "data": [[0.1, 0.2]],
  "anns_field": "book_intro",
  "param": {"metric_type": "L2", "params": {"nprobe": 10}},
  "limit": 2,
  "expr": "book_name like \"Hello%\"", 
}
res = collection.search(**search_param)

```

What's next
-----------

* To learn more about scalar field indexing, read [Scalar Index](scalar_index.md).
* To learn more about the related terms and rules mentioned above, read

	+ [Bitset](bitset.md)
	+ [Hybrid search](hybridsearch.md)
	+ [Boolean expression rules](boolean.md)
	+ [Supported data types](schema.md#Supported-data-type)
