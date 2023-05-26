
本主题介绍Milvus中的模式。 模式用于定义集合和其中的字段的属性。

字段模式
------------

字段模式是字段的逻辑定义。在[定义集合模式](#集合模式)和[创建集合](create_collection.md)之前，首先需要定义字段模式。

Milvus仅支持集合中的一个主键字段。

### 字段模式属性

| 属性
说明 | 注释 | |
| --- | --- | --- |
| name | 要在集合中创建的字段名称 | 数据类型：字符串。必填项 |
| dtype | 字段的数据类型 | 必填项 |
| description | 字段的描述 | 数据类型：字符串。可选 |
| is_primary | 是否将该字段设置为主键字段 | 数据类型：布尔（`true`或`false`）。主键字段的必填项 |
| 维度 | 向量的维度 | 数据类型：整数 ∈[1, 32768]。向量字段的必填项 |

### 创建字段模式

```bash
from pymilvus import FieldSchema
id_field = FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, description="主键ID")
age_field = FieldSchema(name="age", dtype=DataType.INT64, description="年龄")
embedding_field = FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=128, description="向量")

```

### 支持的数据类型

`DataType`定义了字段包含的数据类型。不同的字段支持不同的数据类型。

* 主键字段支持：
	+ INT64：numpy.int64
	+ VARCHAR：字符串类型
* 标量字段支持：
	+ BOOL：布尔类型（`true`或`false`）

	+ INT8：numpy.int8

	+ INT16：numpy.int16

	+ INT32：numpy.int32

	+ INT64：numpy.int64

	+ FLOAT：numpy.float32

	+ DOUBLE：numpy.double

	+ VARCHAR：字符串类型
* 向量字段支持：
	+ BINARY_VECTOR：二进制向量
	+ FLOAT_VECTOR：浮点向量

集合模式
----

集合模式是集合的逻辑定义。通常在定义[字段模式](#Field-schema)和创建集合之前需要定义集合模式。

### 集合模式属性

| 属性
说明 | 注释 | |
| --- | --- | --- |
| name | 要在集合中创建的字段 | 必填项 |
| description | 集合的描述 | 数据类型：字符串。可选 |
| auto_id | 是否启用自动ID（主键）分配 | 数据类型：布尔（`true`或`false`）。可选 |

### 创建集合架构

在定义集合模式之前，先定义字段模式。

```bash
from pymilvus import FieldSchema, CollectionSchema
id_field = FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, description="主键ID")
age_field = FieldSchema(name="age", dtype=DataType.INT64, description="年龄")
embedding_field = FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=128, description="向量")
schema = CollectionSchema(fields=[id_field, age_field, embedding_field], auto_id=False, description="集合描述")

```

使用指定的架构创建集合：

```bash
from pymilvus import Collection
collection_name1 = "tutorial_1"
collection1 = Collection(name=collection_name1, schema=schema, using='default', shards_num=2)

```

您可以使用`shards_num`定义分片数，并通过在`using`中指定别名来创建Milvus服务器中的集合。

您还可以使用`Collection.construct_from_dataframe`创建集合，该方法可以从DataFrame自动生成集合模式并创建集合。

```bash
import pandas as pd
df = pd.DataFrame({
        "id": [i for i in range(nb)],
        "age": [random.randint(20, 40) for i in range(nb)],
        "embedding": [[random.random() for _ in range(dim)] for _ in range(nb)]
    })
collection, ins_res = Collection.construct_from_dataframe(
                                'my_collection',
                                df,
                                primary_field='id',
                                auto_id=False
                                )

```

下一步
-----------

* 了解如何在[创建集合](create_collection.md)时准备架构。
