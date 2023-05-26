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

```bash
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

```bash
await milvusClient.loadCollection({
  collection_name: "book",
});

```

```bash
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

```bash
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

```bash
load -c book

```

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/collection/load' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book"
  }'

```

Output:

```bash
{}

```
以下是每个表格的中文翻译：

| 参数 | 描述 |
| --- | --- |
| `partition_name` (可选) | 要加载的分区的名称。|
| `replica_number` (可选) | 要加载的副本的数量。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要加载的集合的名称。|

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `CollectionName` | 要加载的集合的名称。|
| `async` | 控制同步/异步行为的开关。同步加载不适用于上下文。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要加载的集合的名称。|

| 选项 | 描述 |
| --- | --- |
| `-c` | 要加载的集合的名称。|
| `-p` (可选/重复) | 要加载的分区的名称。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要加载的集合的名称。|


获取副本信息
------

您可以检查已加载副本的信息。

```bash
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.
collection.load(replica_number=2)    # Load collection as 2 replicas
result = collection.get_replicas()
print(result)

```

以下是输出示例。

```bash
Replica groups:
- Group: <group_id:435309823872729305>, <group_nodes:(21, 20)>, <shards:[Shard: <channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0>, <shard_leader:21>, <shard_nodes:[21]>, Shard: <channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1>, <shard_leader:20>, <shard_nodes:[20, 21]>]>
- Group: <group_id:435309823872729304>, <group_nodes:(25,)>, <shards:[Shard: <channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1>, <shard_leader:25>, <shard_nodes:[25]>, Shard: <channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0>, <shard_leader:25>, <shard_nodes:[25]>]>

```

限制条件
----

* 当父集合已经加载时，尝试加载分区将返回错误。未来的版本将支持从已加载的集合中释放分区，然后加载其他分区（如果需要）。

* 尝试加载已经加载的集合将返回"成功加载"。

* 当子分区已经加载时，尝试加载集合将返回错误。未来的版本将支持在已经加载一些分区的情况下加载集合。

* 这意味着您不能通过单独的远程过程调用（RPC）将不同分区的数据加载到同一集合中。您应该一次性加载所有分区，或为每个分区使用不同的集合。

下一步
-----------

* 学习更多关于 Milvus 的基本操作：
    + [将数据插入 Milvus](insert_data.md)
    + [创建一个分区](create_partition.md)
    + [为向量构建索引](build_index.md)
    + [进行向量搜索](search.md)
    + [进行混合搜索](hybridsearch.md)
