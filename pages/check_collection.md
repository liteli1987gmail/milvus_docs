检查集合信息
======

本主题介绍了如何在 Milvus 中检查集合信息。

检查集合是否存在
--------

验证Milvus中是否存在集合。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import utility
utility.has_collection("book")

```

```
await milvusClient.hasCollection({
  collection_name: "book",
});

```

```
hasColl, err := milvusClient.HasCollection(
  context.Background(), // ctx
  collectionName,       // CollectionName
)
if err != nil {
  log.Fatal("failed to check whether collection exists:", err.Error())
}
log.Println(hasColl)

```

```
R<Boolean> respHasCollection = milvusClient.hasCollection(
  HasCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);
if (respHasCollection.getData() == Boolean.TRUE) {
  System.out.println("Collection exists.");
}

```

```
describe collection -c book

```

```
curl -X 'GET' \
  'http://localhost:9091/api/v1/collection/existence' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

Output:

```
{
  "status":{},
  "value":true
}

```

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to check. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to check. |

查看集合详情
------

查看集合的详情。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[命令行](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")  # Get an existing collection.

collection.schema                # Return the schema.CollectionSchema of the collection.
collection.description           # Return the description of the collection.
collection.name                  # Return the name of the collection.
collection.is_empty              # Return the boolean value that indicates if the collection is empty.
collection.num_entities          # Return the number of entities in the collection.
collection.primary_field         # Return the schema.FieldSchema of the primary key field.
collection.partitions            # Return the list[Partition] object.
collection.indexes               # Return the list[Index] object.
collection.properties		# Return the expiration time of data in the collection.

```

```
await milvusClient.describeCollection({          // Return the name and schema of the collection.
  collection_name: "book",
});

await milvusClient.getCollectionStatistics({     // Return the statistics information of the collection.
  collection_name: "book",
});

```

```
collDesc, err := milvusClient.DescribeCollection(               // Return the name and schema of the collection.
  context.Background(),   // ctx
  "book",                 // CollectionName
)
if err != nil {
  log.Fatal("failed to check collection schema:", err.Error())
}
log.Printf("%v\n", collDesc)

collStat, err := milvusClient.GetCollectionStatistics(          // Return the statistics information of the collection.
  context.Background(),   // ctx
  "book",                 // CollectionName
)
if err != nil {
  log.Fatal("failed to check collection statistics:", err.Error())
}

```

```
R<DescribeCollectionResponse> respDescribeCollection = milvusClient.describeCollection(
  // Return the name and schema of the collection.
  DescribeCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);
DescCollResponseWrapper wrapperDescribeCollection = new DescCollResponseWrapper(respDescribeCollection.getData());
System.out.println(wrapperDescribeCollection);

R<GetCollectionStatisticsResponse> respCollectionStatistics = milvusClient.getCollectionStatistics(
  // Return the statistics information of the collection.
  GetCollectionStatisticsParam.newBuilder()
    .withCollectionName("book")
    .build()
  );
GetCollStatResponseWrapper wrapperCollectionStatistics = new GetCollStatResponseWrapper(respCollectionStatistics.getData());
System.out.println("Collection row count: " + wrapperCollectionStatistics.getRowCount());

```

```
describe collection -c book

```

```
curl -X 'GET' \
  'http://localhost:9091/api/v1/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

Output:

```
{
  "status": {},
  "schema": {
    "name": "book",
    "description": "Test book search",
    "fields": [
      {
        "fieldID": 100,
        "name": "book_id",
        "is_primary_key": true,
        "description": "book id",
        "data_type": 5
      },
      {
        "fieldID": 101,
        "name": "book_intro",
        "description": "embedded vector of book introduction",
        "data_type": 101,
        "type_params": [
          {
            "key": "dim",
            "value": "2"
          }
        ]
      }
    ]
  },
  "collectionID": 434240188610972993,
  "virtual_channel_names": [
    "by-dev-rootcoord-dml_0_434240188610972993v0",
    "by-dev-rootcoord-dml_1_434240188610972993v1"
  ],
  "physical_channel_names": [
    "by-dev-rootcoord-dml_0",
    "by-dev-rootcoord-dml_1"
  ],
  "created_timestamp": 434240188610772994,
  "created_utc_timestamp": 1656494860118,
  "shards_num": 2,
  "consistency_level": 1
}

```

| Parameter | Description |
| --- | --- |
| schema | The schema of the collection. |
| description | The description of the collection. |
| name | The name of the collection. |
| is_empty | A boolean value that indicates whether the collection is empty. |
| num_entities | The number of entities in the collection. |
| primary_field | The primary field of the collection. |
| properties | Currently, only the property of `collection.ttl.seconds` is shown. Collection time to live (TTL) is the expiration time of data in a collection. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to check. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to check. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to check. |

列出所有集合
------

列出此 Milvus 实例中的所有集合。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import utility
utility.list_collections()

```

```
await milvusClient.showCollections();

```

```
listColl, err := milvusClient.ListCollections(
  context.Background(),   // ctx
)
if err != nil {
  log.Fatal("failed to list all collections:", err.Error())
}
log.Println(listColl)

```

```
R<ShowCollectionsResponse> respShowCollections = milvusClient.showCollections(
    ShowCollectionsParam.newBuilder().build()
  );
System.out.println(respShowCollections);

```

```
list collections

```

```
curl -X 'GET' \
  'http://localhost:9091/api/v1/collections' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json'

```

Output:

```
{
  "status": {},
  "collection_names": [
    "book"
  ],
  "collection_ids": [
    434240188610972993
  ],
  "created_timestamps": [
    434240188610772994
  ],
  "created_utc_timestamps": [
    1656494860118
  ]
}

```

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |

接下来是什么
------

* 学习更多关于Milvus的基本操作:
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
