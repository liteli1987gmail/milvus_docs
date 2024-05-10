---
id: load_balance.md
related_key: Load balance
summary: Learn how to balance query load in Milvus.
title: Balance Query Load
---

# 平衡查询负载

本文介绍了如何在 Milvus 中平衡查询负载。

Milvus 默认支持自动负载均衡。您可以通过 [配置](configure-docker.md) Milvus 来启用或禁用 [自动负载均衡](configure_querycoord.md#queryCoordautoBalance)。通过指定 [`queryCoord.balanceIntervalSeconds`](configure_querycoord.md#queryCoordbalanceIntervalSeconds)、[`queryCoord.overloadedMemoryThresholdPercentage`](configure_querycoord.md#queryCoordoverloadedMemoryThresholdPercentage) 和 [`queryCoord.memoryUsageMaxDifferencePercentage`](configure_querycoord.md#queryCoordmemoryUsageMaxDifferencePercentage)，您可以更改触发自动负载均衡的阈值。

如果禁用了自动负载均衡，您仍然可以手动平衡负载。

## 检查段信息

获取您期望转移的封闭段的 `segmentID` 以及您期望将段转移到的查询节点的 `nodeID`。

{{fragments/multiple_code.md}}

```python
from pymilvus import utility
utility.get_query_segment_info("book")
```

```go
// 这个函数在 GO 客户端上正在积极开发中。
```

```java
milvusClient.getQuerySegmentInfo(
  GetQuerySegmentInfoParam.newBuilder()
    .withCollectionName("book")
    .build()
);
```

```javascript
await getQuerySegmentInfo({
  collectionName: "book",
});
```

```shell
show query_segment -c book
```

<table class="language-python">
	<thead>
	<tr>
		<th>参数</th>
		<th>描述</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>collection_name</code></td>
		<td>要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

<table class="language-javascript">
	<thead>
	<tr>
		<th>参数</th>
		<th>描述</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>collectionName</code></td>
		<td>要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

<table class="language-java">
	<thead>
	<tr>
		<th>参数</th>
		<th>描述</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>CollectionName</code></td>
		<td>要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

<table class="language-shell">
    <thead>
        <tr>
            <th>选项</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>-c</td>
            <td>要检查段信息的集合名称。</td>
        </tr>
    </tbody>
</table>

## 转移段

使用 `segmentID` 和当前查询节点的 `nodeID` 以及新查询节点的 `nodeID` 转移封闭段。

{{fragments/multiple_code.md}}

```python
utility.load_balance(
  src_node_id=3,
  dst_node_ids=[4],
  sealed_segment_ids=[431067441441538050]
)
```

```go
// 这个函数在 GO 客户端上正在积极开发中。
```

```java
milvusClient.loadBalance(
  LoadBalanceParam.newBuilder()
    .withSourceNodeID(3L)
    .addDestinationNodeID(4L)
    .addSegmentID(431067441441538050L)
    .build()
);
```

```javascript
await loadBalance({
  src_nodeID: 3,
  dst_nodeIDs: [4],
  sealed_segmentIDs: [431067441441538050],
});
```

```shell
load_balance -s 3 -d 4 -ss 431067441441538050
```

<table class="language-python">
	<thead>
	<tr>
		<th>Parameter</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>src_node_id</code></td>
		<td>ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td><code>dst_node_ids</code> (Optional)</td>
		<td>ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	<tr>
		<td><code>sealed_segment_ids</code> (Optional)</td>
		<td>ID(s) of the segment(s) you want to transfer. Milvus transfers all sealed segment(s) in the source query node to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>

<table class="language-javascript">
	<thead>
	<tr>
		<th>Parameter</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>src_nodeID</code></td>
		<td>ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td><code>dst_nodeIDs</code> (Optional)</td>
		<td>ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	<tr>
		<td><code>sealed_segmentIDs</code> (Optional)</td>
		<td>ID(s) of the segment(s) you want to transfer. Milvus transfers all sealed segment(s) in the source query node to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>

<table class="language-java">
	<thead>
	<tr>
		<th>Parameter</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>SourceNodeID</code></td>
		<td>ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td><code>DestinationNodeID</code> (Optional)</td>
		<td>ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	<tr>
		<td><code>SegmentID</code> (Optional)</td>
		<td>ID(s) of the segment(s) you want to transfer. Milvus transfers all sealed segment(s) in the source query node to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>

<table class="language-shell">
	<thead>
	<tr>
		<th>Option</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>-s</code></td>
		<td>ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td><code>-d</code> (Multiple)</td>
		<td>ID(s) of the query node(s) you want to transfer segment(s) to.</td>
	</tr>
	<tr>
		<td><code>-ss</code> (Multiple)</td>
		<td>ID(s) of the segment(s) you want to transfer.</td>
	</tr>
	</tbody>
</table>

## What's next

- Learn more basic operations of Milvus:
  - [Insert, Upsert & Delete](insert-update-delete.md)
  - [Manage Partitions](manage-partitions.md)
  - [Index Vector Fields](index-vector-fields.md)
  - [Index Scalar Fields](index-scalar-fields.md)
  - [Single-vector search](single-vector-search.md)
  - [Multi-vector search](multi-vector-search.md)
