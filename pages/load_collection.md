集合加载
====


本主题介绍如何在查询或搜索之前将集合加载到内存中。Milvus 中的所有搜索和查询操作都在内存中执行。

Milvus 2.1 允许用户将集合加载为多个副本，以利用额外查询节点的 CPU 和内存资源。此功能可以提高整体 QPS 和吞吐量，而不需要额外的硬件。当前版本中 PyMilvus 支持此功能。

* 在当前版本中，要加载的数据量必须在所有查询节点的总内存资源的 90% 以下，以保留执行引擎的内存资源。

* 在当前版本中，所有在线查询节点都将根据用户指定的副本数分为多个副本组。所有副本组都应具有最小的内存资源来加载所提供的集合的一个副本。否则，将返回错误。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import Collection, utility

# Get an existing collection.
collection = Collection("book")      
collection.load(replica_number=2)

# Check the loading progress and loading status
utility.load_state("book")
# Output: <LoadState: Loaded>

utility.loading_progress("book")
# Output: {'loading_progress': 100%}

```

```
await milvusClient.loadCollection({
  collection_name: "book",
});

```

```
err := milvusClient.LoadCollection(
  context.Background(),   // ctx
  "book",                 // CollectionName
  false                   // async
)
if err != nil {
  log.Fatal("failed to load collection:", err.Error())
}

// To get the load status
loadStatus, err := milvusClient.GetLoadState(
  context.Background(),             // ctx
  "book",                           // CollectionName
  []string{"Default partition"}     // List of partitions
)
if err != nil {
    log.Fatal("failed to get the load state", err.Error())
}

// To get the loading progress
percentage, err := milvusClient.GetLoadingProgress(
    context.Background(),           // ctx
    "book",                         // CollectionName
    []string{"Default partition"}   // List of partitions
)
if err != nil {
    log.Fatal("failed to get the loading progress", err.Error())
}

```

```
milvusClient.loadCollection(
  LoadCollectionParam.newBuilder()
    .withCollectionName("book")
    .build()
);

// You can check the loading status 

GetLoadStateParam param = GetLoadStateParam.newBuilder()
        .withCollectionName(collectionName)
        .build();
R<GetLoadStateResponse> response = client.getLoadState(param);
if (response.getStatus() != R.Status.Success.getCode()) {
    System.out.println(response.getMessage());
}
System.out.println(response.getState());

// and loading progress as well

GetLoadingProgressParam param = GetLoadingProgressParam.newBuilder()
        .withCollectionName(collectionName)
        .build();
R<GetLoadingProgressResponse> response = client.getLoadingProgress(param);
if (response.getStatus() != R.Status.Success.getCode()) {
    System.out.println(response.getMessage());
}
System.out.println(response.getProgress());

```

```
load -c book

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/collection/load' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book"
  }'

```

Output:

```
{}

```

| Parameter | Description |
| --- | --- |
| `partition_name` (optional) | Name of the partition to load. |
| `replica_number` (optional) | Number of the replica to load. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to load. |

| Parameter | Description |
| --- | --- |
| `ctx` | Context to control API invocation process. |
| `CollectionName` | Name of the collection to load. |
| `async` | Switch to control sync/async behavior. The deadline of context is not applied in sync load. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to load. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to load. |
| -p (Optional/Multiple) | The name of the partition to load. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to load. |

获取副本信息
------

您可以检查已加载副本的信息。

```
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load(replica_number=2)    # Load collection as 2 replicas
result = collection.get_replicas()
print(result)

```

以下是输出示例。

```
Replica groups:
- Group: <group_id:435309823872729305>, <group_nodes:(21, 20)>, <shards:[Shard: <channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0>, <shard_leader:21>, <shard_nodes:[21]>, Shard: <channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1>, <shard_leader:20>, <shard_nodes:[20, 21]>]>
- Group: <group_id:435309823872729304>, <group_nodes:(25,)>, <shards:[Shard: <channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1>, <shard_leader:25>, <shard_nodes:[25]>, Shard: <channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0>, <shard_leader:25>, <shard_nodes:[25]>]>

```

限制条件
----

* 当父集合已经加载时，尝试加载分区将返回错误。未来的版本将支持从已加载的集合中释放分区，然后加载其他分区（如果需要）。

* 尝试加载已经加载的集合将返回"成功加载"。

* 当子分区已经加载时，尝试加载集合将返回错误。未来的版本将支持在已经加载一些分区的情况下加载集合。
* Loading different partitions in a same collection via separate RPCs is not allowed.

What's next
-----------

* Learn more basic operations of Milvus:
	+ [Insert data into Milvus](insert_data.md)
	+ [Create a partition](create_partition.md)
	+ [Build an index for vectors](build_index.md)
	+ [Conduct a vector search](search.md)
	+ [Conduct a hybrid search](hybridsearch.md)
