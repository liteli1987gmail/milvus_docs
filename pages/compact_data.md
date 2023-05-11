# 数据压缩

本主题描述了如何在 Milvus 中对数据进行压缩。

Milvus 默认支持自动数据压缩。您可以 [配置](configure-docker.md) Milvus 以启用或禁用 [压缩](configure_datacoord.md#dataCoordenableCompaction) 和[自动压缩](configure_datacoord.md#dataCoordcompactionenableAutoCompaction)。

如果自动压缩被禁用，您仍然可以手动压缩数据。

To ensure accuracy of searches with Time Travel, Milvus retains the data operation log within the span specified in [`common.retentionDuration`](configure_common.md#common.retentionDuration). Therefore, data operated within this period will not be compacted. 

手动压缩数据
------

压缩请求是异步处理的，因为它们通常需要花费很长时间。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.compact()

```

```
const res = await milvusClient.compact({
  collection_name: "book",
});
const compactionID = res.compactionID;

```

```
// This function is under active development on the GO client.

```

```
R<ManualCompactionResponse> response = milvusClient.manualCompaction(
  ManualCompactionParam.newBuilder()
    .withCollectionName("book")
    .build()
);
long compactionID = response.getData().getCompactionID();

```

```
compact -c book

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/compaction' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collectionID": 434262071120432449
  }'

```

Output:

```
{"status":{},"compactionID":434262132129005569}

```

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to compact data. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to compact data. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to compact data. |

检查压缩状态
------

您可以通过手动触发压缩时返回的压缩ID来检查压缩状态。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
collection.get_compaction_state()

```

```
const state = await milvusClient.getCompactionState({
    compactionID
});

```

```
// This function is under active development on the GO client.

```

```
milvusClient.getCompactionState(GetCompactionStateParam.newBuilder()
  .withCompactionID(compactionID)
  .build()
);

```

```
show compaction_state -c book

```

```
curl -X 'GET' \
  'http://localhost:9091/api/v1/compaction/state' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "compactionID": 434262132129005569
  }'

```

Output:

```
{"status":{},"state":2}

```

下一步操作
-----

* 学习更多 Milvus 的基本操作：
	+ [向 Milvus 插入数据](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
