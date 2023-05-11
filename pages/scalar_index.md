标量索引
====

Milvus支持使用标量和向量字段进行[混合搜索](hybridsearch.md)。为了加速通过标量字段对实体进行搜索，Milvus在2.1.0版本中引入了标量字段索引。本文帮助您了解Milvus中的标量字段索引。

概述
--

在 Milvus 中进行向量相似度搜索后，可以使用逻辑运算符将标量字段组织成布尔表达式。

当 Milvus 接收到带有这样一个布尔表达式的搜索请求时，它将将布尔表达式解析成抽象语法树 (AST)，生成属性过滤的物理计划。然后，在每个段中应用物理计划，生成一个 [位向量](bitset.md) 作为过滤结果，并将其作为向量搜索参数包含在内，以缩小搜索范围。在这种情况下，向量搜索的速度严重依赖于属性过滤的速度。

[![Attribute filtering in a segment](https://milvus.io/static/d82e80c1233e6b9c5777dd980d59f68b/1263b/scalar_index.png "Attribute filtering in a segment")](https://milvus.io/static/d82e80c1233e6b9c5777dd980d59f68b/7914b/scalar_index.png)

标量字段索引是通过特定的排序方式对标量字段值进行排序以加速信息检索，从而确保属性过滤的速度。

标量字段索引算法
--------

Milvus通过实现标量字段索引来实现低内存使用、高过滤效率和短加载时间的目标。

具体来说，标量字段的索引算法因字段数据类型而异。下表列出了Milvus支持的数据类型及其对应的默认索引算法。

| Data type | Default indexing algorithm |
| --- | --- |
| BOOL | STL sort |
| VARCHAR | MARISA-trie |
| INT16 | STL sort |
| INT32 | STL sort |
| INT64 | STL sort |
| FLOAT | STL sort |
| DOUBLE | STL sort |

性能建议
----

为了充分利用Milvus在标量字段索引和向量相似性搜索方面的能力，您可能需要一个模型来估计所需的内存大小，这取决于您拥有的数据。

下表列出了Milvus支持的所有数据类型的估算函数。

* 数值字段

| 数据类型 | 内存估算函数（MB） |
| --- | --- |
| INT8 | numOfRows * **12** / 1024 / 1024 |
| INT16 | numOfRows * **12** / 1024 / 1024 |
| INT32 | numOfRows * **12** / 1024 / 1024 |
| INT64 | numOfRows * **24** / 1024 / 1024 |
| FLOAT32 | numOfRows * **12** / 1024 / 1024 |
| DOUBLE | numOfRows * **24** / 1024 / 1024 |

* 字符串字段

| 字符串长度 | 内存估算函数（MB） |
| --- | --- |
| (0, 8] | numOfRows * **128** / 1024 / 1024 |
| (8, 16] | numOfRows * **144** / 1024 / 1024 |
| (16, 32] | numOfRows * **160** / 1024 / 1024 |
| (32, 64] | numOfRows * **192** / 1024 / 1024 |
| (64, 128] | numOfRows * **256** / 1024 / 1024 |
| (128, 65535] | numOfRows * **strLen * 1.5** / 1024 / 1024 |

接下来是什么
------

* 要对标量字段建立索引，请阅读[在标量上建立索引](build_scalar_index.md)。

* 要了解上述相关术语和规则，请阅读：

	+ [位集](bitset.md)
	+ [混合搜索](hybridsearch.md)
	+ [布尔表达式规则](boolean.md)
	+ [支持的数据类型](schema.md#Supported-data-type)
