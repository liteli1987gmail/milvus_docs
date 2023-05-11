创建集合
====

本主题介绍了如何在Milvus中创建集合。

集合由一个或多个分区组成。在创建新集合时，Milvus会创建一个默认分区`_default`。有关更多信息，请参见[术语表 - 集合](glossary.md#Collection)。

以下示例构建了一个两个[分片](glossary.md#Sharding)的集合，名为`book`，具有名为`book_id`的主键字段，名为`word_count`的`INT64`标量字段和名为`book_intro`的二维浮点向量字段。实际应用程序通常使用比示例更高维度的向量。

准备模式
----

The collection to create must contain a primary key field and a vector field. INT64 and String are supported data type on primary key field.

首先，准备必要的参数，包括字段模式、集合模式和集合名称。

[Python](#python) 
[Java](#java)
[前往](#go)
[Node.js](#javascript)
[命令行界面](#shell)
[Curl](#curl)

```
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

```
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

```
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

```
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

```
create collection -c book -f book_id:INT64:book_id -f word_count:INT64:word_count -f book_intro:FLOAT_VECTOR:2 -p book_id

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
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

```
{}

```

| Parameter | Description | Option |
| --- | --- | --- |
| `FieldSchema` | Schema of the fields within the collection to create. Refer to [模式](schema.md) for more information. | N/A |
| `name` | Name of the field to create. | N/A |
| `dtype` | Data type of the field to create. | For primary key field:
 * `DataType.INT64` (numpy.int64)

* `DataType.VARCHAR` (VARCHAR)

 For scalar field:
 * `DataType.BOOL` (布尔值)

* `DataType.INT8` (numpy.int8)

* `DataType.INT16` (numpy.int16)

* `DataType.INT32` (numpy.int32)

* `DataType.INT64` (numpy.int64)

* `DataType.FLOAT` (numpy.float32)

* `DataType.DOUBLE` (numpy.double)

* `DataType.VARCHAR` (VARCHAR)

 For vector field:
 * `BINARY_VECTOR` (二进制向量)

* `FLOAT_VECTOR` (浮点向量)
 |
| `is_primary` (Mandatory for primary key field) | Switch to control if the field is primary key field. | `True` or `False` |
| `auto_id` (Mandatory for primary key field) | Switch to enable or disable automatic ID (primary key) allocation. | `True` or `False` |
| `max_length` (Mandatory for VARCHAR field) | Maximum length of strings allowed to be inserted. | [1, 65,535] |
| `dim` (Mandatory for vector field) | Dimension of the vector. | [1, 32,768] |
| `description` (Optional) | Description of the field. | N/A |
| `CollectionSchema` | Schema of the collection to create. Refer to [模式](schema.md) for more information. | N/A |
| `fields` | Fields of the collection to create. | N/A |
| `description` (Optional) | Description of the collection to create. | N/A |
| `collection_name` | Name of the collection to create. | N/A |

| Parameter | Description | Option |
| --- | --- | --- |
| `collectionName` | Name of the collection to create. | N/A |
| `description` | Description of the collection to create. | N/A |
| `Fields` | Schema of the fields within the collection to create. Refer to [模式](schema.md) for more information. | N/A |
| `Name` | Name of the field to create. | N/A |
| `DataType` | Data type of the field to create. | For primary key field:
 * `entity.FieldTypeInt64 (numpy.int64)`

* `entity.FieldTypeVarChar (VARCHAR)`

 For scalar field:
 * `entity.FieldTypeBool (布尔值)`

* `entity.FieldTypeInt8 (numpy.int8)`

* `entity.FieldTypeInt16 (numpy.int16)`

* `entity.FieldTypeInt32 (numpy.int32)`

* `entity.FieldTypeInt64 (numpy.int64)`

* `entity.FieldTypeFloat (numpy.float32)`

* `entity.FieldTypeDouble (numpy.double)`

* `entity.FieldTypeVarChar (VARCHAR)`

 For vector field:
 * `entity.FieldTypeBinaryVector` (二进制向量)

* `entity.FieldTypeFloatVector` (浮点向量)
 |
| `PrimaryKey` (Mandatory for primary key field) | Switch to control if the field is primary key field. | `True` or `False` |
| `AutoID` (Mandatory for primary key field) | Switch to enable or disable Automatic ID (primary key) allocation. | `True` or `False` |
| `dim` (Mandatory for vector field) | Dimension of the vector. | [1, 32768] |

| Parameter | Description | Option |
| --- | --- | --- |
| `collection_name` | Name of the collection to create. | N/A |
| `description` | Description of the collection to create. | N/A |
| `fields` | Schema of the field and the collection to create. | Refer to [模式](schema.md) for more information. |
| `data_type` | Data type of the filed to create. | Refer to [数据类型参考编号](https://github.com/milvus-io/milvus-sdk-node/blob/main/milvus/const/Milvus.ts#L287) for more information. |
| `is_primary_key` (Mandatory for primary key field) | Switch to control if the field is primary key field. | `true` or `false` |
| `autoID` | Switch to enable or disable Automatic ID (primary key) allocation. | `true` or `false` |
| `dim` (Mandatory for vector field) | Dimension of the vector. | [1, 32768] |
| `max_length` (Mandatory for VarChar field) | Dimension of the vector. | [1, 32768] |
| `description` (Optional) | Description of the field. | N/A |

| Parameter | Description | Option |
| --- | --- | --- |
| `Name` | Name of the field to create. | N/A |
| `Description` | Description of the field to create. | N/A |
| `DataType` | Data type of the field to create. | For primary key field:
 * `entity.FieldTypeInt64` (numpy.int64)

* `entity.FieldTypeVarChar` (VARCHAR)

 For scalar field:
 * `entity.FieldTypeBool` (Boolean)

* `entity.FieldTypeInt8` (numpy.int8)

* `entity.FieldTypeInt16` (numpy.int16)

* `entity.FieldTypeInt32` (numpy.int32)

* `entity.FieldTypeInt64` (numpy.int64)

* `entity.FieldTypeFloat` (numpy.float32)

* `entity.FieldTypeDouble` (numpy.double)

* `entity.FieldTypeVarChar` (VARCHAR)

 For vector field:
 * `entity.FieldTypeBinaryVector` (Binary vector)

* `entity.FieldTypeFloatVector` (Float vector)
 |
| `PrimaryKey` (Mandatory for primary key field) | Switch to control if the field is primary key field. | `True` or `False` |
| `AutoID` | Switch to enable or disable Automatic ID (primary key) allocation. | `True` or `False` |
| `Dimension` (Mandatory for vector field) | Dimension of the vector. | [1, 32768] |
| `CollectionName` | Name of the collection to create. | N/A |
| `Description` (Optional) | Description of the collection to create. | N/A |
| `ShardsNum` | Number of the shards for the collection to create. | [1,64] |

| Option | Description |
| --- | --- |
| -c | The name of the collection. |
| -f (Multiple) | The field schema in the `<fieldName>:<dataType>:<dimOfVector/desc>` format. |
| -p | The name of the primary key field. |
| -a (Optional) | Flag to generate IDs automatically. |
| -d (Optional) | The description of the collection. |

| Parameter | Description | Option |
| --- | --- | --- |
| `collection_name` | Name of the collection to create. | N/A |
| `name` (schema) | Must be the same as `collection_name`, this duplicated field is kept for historical reasons. | Same as `collection_name` |
| `autoID` (schema) | Switch to enable or disable Automatic ID (primary key) allocation. | `True` or `False` |
| `description` (schema) | Description of the collection to create. | N/A |
| `fields` | Schema of the fields within the collection to create. Refer to [Schema](schema.md) for more information. | N/A |
| `name`(field) | Name of the field to create. | N/A |
| `description` (field) | Description of the collection to create. | N/A |
| `is_primary_key`(Mandatory for primary key field) | Switch to control if the field is primary key field. | `True` or `False` |
| `autoID` (field)(Mandatory for primary key field) | Switch to enable or disable Automatic ID (primary key) allocation. | `True` or `False` |
| `data_type` | Data type of the field to create. | 
 Enums:
 1: "Bool",
 2: "Int8",
 3: "Int16",
 4: "Int32",
 5: "Int64",
 10: "Float",
 11: "Double",
 20: "String",
 21: "VarChar",
 100: "BinaryVector",
 101: "FloatVector",

For primary key field:
 * `DataType.INT64` (numpy.int64)

* `DataType.VARCHAR` (VARCHAR)

 For scalar field:
 * `DataType.BOOL` (Boolean)

* `DataType.INT64` (numpy.int64)

* `DataType.FLOAT` (numpy.float32)

* `DataType.DOUBLE` (numpy.double)

 For vector field:
 * `BINARY_VECTOR` (Binary vector)

* `FLOAT_VECTOR` (Float vector)
 |
| `dim` (Mandatory for vector field) | Dimension of the vector. | [1, 32,768] |

创建带有上述指定模式的集合
-------------

然后，使用您上面指定的模式创建集合。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection(
    name=collection_name,
    schema=schema,
    using='default',
    shards_num=2
    )

```

```
await milvusClient.createCollection(params);

```

```
err = milvusClient.CreateCollection(
    context.Background(), // ctx
    schema,
    2, // shardNum
)
if err != nil {
    log.Fatal("failed to create collection:", err.Error())
}

```

```
milvusClient.createCollection(createCollectionReq);

```

```
# Follow the previous step.

```

```
# Follow the previous step.

```

| Parameter | Description | Option |
| --- | --- | --- |
| `using` (optional) | By specifying the server alias here, you can choose in which Milvus server you create a collection. | N/A |
| `shards_num` (optional) | Number of the shards for the collection to create. | [1,256] |
| `properties: collection.ttl.seconds` (optional) | Collection time to live (TTL) is the expiration time of a collection. Data in an expired collection will be cleaned up and will not be involved in searches or queries. Specify TTL in the unit of seconds. | The value should be 0 or greater. 0 means TTL is disabled. |

| Parameter | Description | Option |
| --- | --- | --- |
| `ctx` | Context to control API invocation process. | N/A |
| `shardNum` | Number of the shards for the collection to create. | [1,256] |

限制
--

| Feature | Maximum limit |
| --- | --- |
| Length of a collection name | 255 characters |
| Number of partitions in a collection | 4,096 |
| Number of fields in a collection | 64 |
| Number of shards in a collection | 256 |

接下来要做什么
-------

* 学习更多Milvus的基本操作：
	+ [将数据插入到Milvus中](insert_data.md)
	+ [创建一个分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
