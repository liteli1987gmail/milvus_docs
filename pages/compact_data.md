# 数据压缩

本主题描述了如何在 Milvus 中对数据进行压缩。

Milvus 默认支持自动数据压缩。您可以 [配置](configure-docker.md) Milvus 以启用或禁用 [压缩](configure_datacoord.md#dataCoordenableCompaction) 和[自动压缩](configure_datacoord.md#dataCoordcompactionenableAutoCompaction)。

如果自动压缩被禁用，您仍然可以手动压缩数据。

为了确保使用时间旅行时的搜索准确性，Milvus会在[`common.retentionDuration`](configure_common.md#common.retentionDuration)中指定的时间范围内保留数据操作日志。因此，在此期间操作的数据将不会被压缩。

手动压缩数据
------

压缩请求是异步处理的，因为它们通常需要花费很长时间。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.compact()

```

```bash
const res = await milvusClient.compact({
  collection_name: "book",
});
const compactionID = res.compactionID;

```

```bash
// This function is under active development on the GO client.

```

```bash
R<ManualCompactionResponse> response = milvusClient.manualCompaction(
  ManualCompactionParam.newBuilder()
    .withCollectionName("book")
    .build()
);
long compactionID = response.getData().getCompactionID();

```

```bash
compact -c book

```

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/compaction' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collectionID": 434262071120432449
  }'

```

Output:

```bash
{"status":{},"compactionID":434262132129005569}

```

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要压缩数据的集合的名称。 |

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要压缩数据的集合的名称。 |

| 选项 | 描述 |
| --- | --- |
| -c | 要压缩数据的集合的名称。 |

检查压缩状态
------

您可以通过手动触发压缩时返回的压缩ID来检查压缩状态。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
collection.get_compaction_state()

```

```bash
const state = await milvusClient.getCompactionState({
    compactionID
});

```

```bash
// This function is under active development on the GO client.

```

```bash
milvusClient.getCompactionState(GetCompactionStateParam.newBuilder()
  .withCompactionID(compactionID)
  .build()
);

```

```bash
show compaction_state -c book

```

```bash
curl -X 'GET' 
  'http://localhost:9091/api/v1/compaction/state' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "compactionID": 434262132129005569
  }'

```

Output:

```bash
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
