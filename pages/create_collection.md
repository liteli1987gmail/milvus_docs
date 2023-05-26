创建集合
====

本主题介绍了如何在Milvus中创建集合。

集合由一个或多个分区组成。在创建新集合时，Milvus会创建一个默认分区`_default`。有关更多信息，请参见[术语表 - 集合](glossary.md#Collection)。

以下示例构建了一个两个[分片](glossary.md#Sharding)的集合，名为`book`，具有名为`book_id`的主键字段，名为`word_count`的`INT64`标量字段和名为`book_intro`的二维浮点向量字段。实际应用程序通常使用比示例更高维度的向量。

准备模式
----

需要创建的集合必须包含一个主键字段和一个向量字段。INT64和String是主键字段支持的数据类型。

首先，准备必要的参数，包括字段模式、集合模式和集合名称。

[Python](#python) 
[Java](#java)
[前往](#go)
[Node.js](#javascript)
[命令行界面](#shell)
[Curl](#curl)

```bash
from pymilvus import CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name="book_id",
  dtype=DataType.INT64,
  is_primary=True,
)
book_name = FieldSchema(
  name="book_name",
  dtype=DataType.VARCHAR,
  max_length=200,
)
word_count = FieldSchema(
  name="word_count",
  dtype=DataType.INT64,
)
book_intro = FieldSchema(
  name="book_intro",
  dtype=DataType.FLOAT_VECTOR,
  dim=2
)
schema = CollectionSchema(
  fields=[book_id, book_name, word_count, book_intro],
  description="Test book search"
)
collection_name = "book"

```

```bash
import { DataType } from "@zilliz/milvus2-sdk-node";
const params = {
  collection_name: "book",
  description: "Test book search",
  fields: [
    {
      name: "book_intro",
      description: "",
      data_type: DataType.FloatVector,
      dim: 2,
    },
    {
      name: "book_id",
      data_type: DataType.Int64,
      is_primary_key: true,
      description: "",
    },
    {
      name: "book_name",
      data_type: DataType.VarChar,
      max_length: 256,
      description: "",
    },
    {
      name: "word_count",
      data_type: DataType.Int64,
      description: "",
    },
  ],
};

```

```bash
var (
    collectionName = "book"
    )
schema := &entity.Schema{
  CollectionName: collectionName,
  Description:    "Test book search",
  Fields: []*entity.Field{
    {
      Name:       "book_id",
      DataType:   entity.FieldTypeInt64,
      PrimaryKey: true,
      AutoID:     false,
    },
    {
      Name:       "word_count",
      DataType:   entity.FieldTypeInt64,
      PrimaryKey: false,
      AutoID:     false,
    },
    {
      Name:     "book_intro",
      DataType: entity.FieldTypeFloatVector,
      TypeParams: map[string]string{
          "dim": "2",
      },
    },
  },
}

```

```bash
FieldType fieldType1 = FieldType.newBuilder()
        .withName("book_id")
        .withDataType(DataType.Int64)
        .withPrimaryKey(true)
        .withAutoID(false)
        .build();
FieldType fieldType2 = FieldType.newBuilder()
        .withName("word_count")
        .withDataType(DataType.Int64)
        .build();
FieldType fieldType3 = FieldType.newBuilder()
        .withName("book_intro")
        .withDataType(DataType.FloatVector)
        .withDimension(2)
        .build();
CreateCollectionParam createCollectionReq = CreateCollectionParam.newBuilder()
        .withCollectionName("book")
        .withDescription("Test book search")
        .withShardsNum(2)
        .addFieldType(fieldType1)
        .addFieldType(fieldType2)
        .addFieldType(fieldType3)
        .build();

```

```bash
create collection -c book -f book_id:INT64:book_id -f word_count:INT64:word_count -f book_intro:FLOAT_VECTOR:2 -p book_id

```

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/collection' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "schema": {
      "autoID": false,
      "description": "Test book search",
      "fields": [
        {
          "name": "book_id",
          "description": "book id",
          "is_primary_key": true,
          "autoID": false,
          "data_type": 5
        },
        {
          "name": "word_count",
          "description": "count of words",
          "is_primary_key": false,
          "data_type": 5
        },
        {
          "name": "book_intro",
          "description": "embedded vector of book introduction",
          "data_type": 101,
          "is_primary_key": false,
          "type_params": [
            {
              "key": "dim",
              "value": "2"
            }
          ]
        }
      ],
      "name": "book"
    }
  }'

```

Output:

```bash
{}

```
非常感谢您的纠正和耐心指导，我很抱歉之前没有整理出正确的表格。以下是根据您的指导进行修正的表格：


| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `FieldSchema` | 要创建的集合中字段的模式。有关更多信息，请参见[模式](schema.md)。| N/A |
| `name` | 要创建的字段的名称。 | N/A |
| `dtype` | 要创建的字段的数据类型。 | 对于主键字段：`DataType.INT64` (numpy.int64) 或 `DataType.VARCHAR` (VARCHAR)；对于标量字段：`DataType.BOOL` (布尔值)、`DataType.INT8` (numpy.int8)、`DataType.INT16` (numpy.int16)、`DataType.INT32` (numpy.int32)、`DataType.INT64` (numpy.int64)、`DataType.FLOAT` (numpy.float32)、`DataType.DOUBLE` (numpy.double) 或 `DataType.VARCHAR` (VARCHAR)；对于向量字段：`DataType.BINARY_VECTOR` (二进制向量) 或 `DataType.FLOAT_VECTOR` (浮点向量)。 |
| `is_primary`（主键字段必需） | 用于控制字段是否为主键字段的开关。 | `True` 或 `False` |
| `auto_id`（主键字段必需） | 用于启用或禁用自动ID（主键）分配的开关。 | `True` 或 `False` |
| `max_length`（VARCHAR字段必需） | 允许插入的字符串的最大长度。 | [1, 65,535] |
| `dim`（向量字段必需） | 向量的维度。 | [1, 32,768] |
| `description`（可选） | 字段的描述信息。 | N/A |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `CollectionSchema` | 要创建的集合的模式。有关更多信息，请参见[模式](schema.md)。| N/A |
| `fields` | 要创建的集合的字段。 | N/A |
| `description`（可选） | 要创建的集合的描述信息。 | N/A |
| `collection_name` | 要创建的集合的名称。 | N/A |

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `collectionName` | 要创建的集合的名称。 | N/A |
| `description` | 要创建的集合的描述信息。 | N/A |
| `Fields` | 要创建的集合中字段的模式。有关更多信息，请参见[模式](schema.md)。| N/A |
| `Name` | 要创建的字段的名称。 | N/A |
| `DataType` | 要创建的字段的数据类型。 | 对于主键字段：`entity.FieldTypeInt64 (numpy.int64)` 或 `entity.FieldTypeVarChar (VARCHAR)`；对于标量字段：`entity.FieldTypeBool (布尔值)`、`entity.FieldTypeInt8 (numpy.int8)`、`entity.FieldTypeInt16 (numpy.int16)`、`entity.FieldTypeInt32 (numpy.int32)`、`entity.FieldTypeInt64 (numpy.int64)`、`entity.FieldTypeFloat (numpy.float32)`、`entity.FieldTypeDouble (numpy.double)` 或 `entity.FieldTypeVarChar (VARCHAR)`；对于向量字段：`entity.FieldTypeBinaryVector` (二进制向量) 或 `entity.FieldTypeFloatVector` (浮点向量)。 |
| `PrimaryKey`（主键字段必需） | 用于控制字段是否为主键字段的开关。 | `True` 或 `False` |
| `AutoID`（主键字段必需） | 用于启用或禁用自动ID（主键）分配的开关。 | `True` 或 `False` |
| `dim`（向量字段必需） | 向量的维度。 | [1, 32768] |



| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `collection_name` | 要创建的集合的名称。| 无 |
| `description` | 要创建的集合的描述。| 无 |
| `fields` | 要创建的字段和集合的模式。有关更多信息，请参阅[模式](schema.md)。| 无 |
| `data_type` | 要创建的字段的数据类型。| 有关更多信息，请参阅[数据类型参考编号](https://github.com/milvus-io/milvus-sdk-node/blob/main/milvus/const/Milvus.ts#L287)。 |
| `is_primary_key`（主键字段必填） | 用于控制字段是否为主键字段的开关。| `true` 或 `false` |
| `autoID` | 用于启用或禁用自动生成的 ID（主键）分配的开关。| `true` 或 `false` |
| `dim`（向量字段必填） | 向量的维度。|  `[1, 32,768]` |
| `max_length` （VarChar 字段必填）| 字符串字段最大长度。| `[1, 32,768]` |
| `description` (可选) | 字段的描述。| 无 |



| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `Name` | 要创建的字段的名称。| 无 |
| `Description` | 要创建的字段的描述。| 无 |
| `DataType`（数据类型）| 要创建的字段的数据类型。| 对于主键字段，数据类型可以是 `entity.FieldTypeInt64` （numpy.int64）或 `entity.FieldTypeVarChar` （VARCHAR）。对于标量字段，数据类型可以是 `entity.FieldTypeBool` （布尔）、`entity.FieldTypeInt8` （numpy.int8）、`entity.FieldTypeInt16` （numpy.int16）、`entity.FieldTypeInt32` （numpy.int32）、`entity.FieldTypeInt64` （numpy.int64）、`entity.FieldTypeFloat` （numpy.float32）、`entity.FieldTypeDouble` （numpy.double）、`entity.FieldTypeVarChar` （VARCHAR）。对于向量字段，数据类型可以是 `entity.FieldTypeBinaryVector` （二进制向量）或 `entity.FieldTypeFloatVector` （浮点向量）。 |
| `PrimaryKey`（主键字段必填） | 用于控制字段是否为主键字段的开关。| `True` 或 `False` |
| `AutoID`（自动生成的 ID）| 用于启用或禁用自动生成的 ID（主键）分配的开关。| `True` 或 `False` |
| `Dimension`（向量字段必填） | 向量的维度。| `[1, 32,768]` |
| `CollectionName` | 要创建的集合的名称。| 无 |
| `Description` (可选) | 要创建的集合的描述。| 无 |
| `ShardsNum` | 要创建的集合的分片数。| `[1, 64]` |



| 选项 | 描述 |
| --- | --- |
| `-c` | 集合的名称。|
| `-f`（多个） | 字段模式的字符串，格式为`<字段名称>:<数据类型>:<向量分量数/描述>`。 |
| `-p` | 主键字段的名称。|
| `-a`（可选） | 用于启用或禁用自动生成的 ID。 |
| `-d`（可选） | 集合的描述。|

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `collection_name` | 要创建的集合的名称。| 无 |
| `name` (schema) | 必须与 `collection_name` 相同，这个重复的字段是为了历史原因而保留的。| 与 `collection_name` 相同 |
| `autoID` (schema) | 用于启用或禁用自动生成的 ID（主键）分配。| `True` 或 `False` |
| `description` (schema) | 要创建的集合的描述。| 无 |
| `fields` | 要创建的集合中字段的结构。有关更多信息，请参阅[模式](schema.md)。| 无 |
| `name`(field) | 要创建的字段的名称。| 无 |
| `description` (field) | 要创建的字段的描述。| 无 |
| `is_primary_key`（主键字段必填）| 用于控制字段是否为主键字段的开关。| `true` 或 `false` |
| `autoID` (field)(主键字段必填) | 用于启用或禁用自动生成的 ID（主键）分配的开关。| `true` 或 `false` |
| `data_type` | 要创建的字段的数据类型。| 枚举项：`1：“Bool”`、`2：“Int8”`、`3：“Int16”`、`4：“Int32”`、`5：“Int64”`、`10：“Float”`、`11：“Double”`、`20：“String”`、`21：“VarChar”`、`100：“BinaryVector”`、`101：“FloatVector”`。对于主键字段，数据类型可以是 `DataType.INT64` （numpy.int64）或 `DataType.VARCHAR` （VARCHAR）。对于标量字段，数据类型可以是 `DataType.BOOL` （布尔）、`DataType.INT64` （numpy.int64）、`DataType.FLOAT` （numpy.float32）、`DataType.DOUBLE` （numpy.double）。对于向量字段，数据类型可以是 `BINARY_VECTOR` （二进制向量）或 `FLOAT_VECTOR` （浮点向量）。 |
| `dim` (向量字段必填) | 向量的维度。| `[1, 32,768]` |


创建带有上述指定模式的集合
-------------

然后，使用您上面指定的模式创建集合。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Collection
collection = Collection(
    name=collection_name,
    schema=schema,
    using='default',
    shards_num=2
    )

```

```bash
await milvusClient.createCollection(params);

```

```bash
err = milvusClient.CreateCollection(
    context.Background(), // ctx
    schema,
    2, // shardNum
)
if err != nil {
    log.Fatal("failed to create collection:", err.Error())
}

```

```bash
milvusClient.createCollection(createCollectionReq);

```

```bash
# Follow the previous step.

```

```bash
# Follow the previous step.

```

以下是第一个表格的中文翻译：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `using` (可选) | 通过在此处指定服务器别名，可以选择在哪个 Milvus 服务器上创建集合。| 无 |
| `shards_num` (可选) | 要创建的集合的分片数。| `[1, 256]` |
| `properties: collection.ttl.seconds` (可选) | 集合生存时间（TTL）是集合的到期时间。过期的数据将被清理，并不会参与搜索或查询。以秒为单位指定 TTL。| 值应为0或更大。 0表示TTL已禁用。|

以下是第二个表格的中文翻译：

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `ctx` | 控制 API 调用过程的上下文。| 无 |
| `shardNum` |要创建的集合的分片数。| `[1, 256]` |

限制
--

| 功能 | 最大限制 |
| --- | --- |
| 集合名称的长度 | 255 个字符 |
| 集合中的分区数量 | 4,096 |
| 集合中的字段数量 | 64 |
| 集合中的分片数量 | 256 |

接下来要做什么
-------

* 学习更多Milvus的基本操作：
	+ [将数据插入到Milvus中](insert_data.md)
	+ [创建一个分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
