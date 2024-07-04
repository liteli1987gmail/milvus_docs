


# 平衡查询负载

本主题介绍了如何在 Milvus 中平衡查询负载。

Milvus 默认支持自动负载均衡。你可以 [配置](/adminGuide/configure-docker.md) 你的 Milvus 以启用或禁用 [自动负载均衡](configure_querycoord.md#queryCoordautoBalance)。通过指定 [`queryCoord.balanceIntervalSeconds`](configure_querycoord.md#queryCoordbalanceIntervalSeconds)，[`queryCoord.overloadedMemoryThresholdPercentage`](configure_querycoord.md#queryCoordoverloadedMemoryThresholdPercentage) 和 [`queryCoord.memoryUsageMaxDifferencePercentage`](configure_querycoord.md#queryCoordmemoryUsageMaxDifferencePercentage)，你可以更改触发自动负载均衡的阈值。

如果禁用了自动负载均衡，你仍然可以通过手动方式平衡负载。

## 检查分段信息





获取你预期要传输的密封段的 `segmentID`，以及你预期将段传输到的查询节点的 `nodeID`。

{{fragments/multiple_code.md}}

```python
from pymilvus import utility
utility.get_query_segment_info("book")
```

```go
// This function is under active development on the GO client.
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

Python 示例：

<table class="language-python">
	<thead>
	<tr>
		<th> 参数 </th>
		<th> 描述 </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> collection_name </code> </td>
		<td> 要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

JavaScript 示例：

<table class="language-javascript">
	<thead>
	<tr>
		<th> 参数 </th>
		<th> 描述 </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> collectionName </code> </td>
		<td> 要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

Java 示例：

<table class="language-java">
	<thead>
	<tr>
		<th> 参数 </th>
		<th> 描述 </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> CollectionName </code> </td>
		<td> 要检查段信息的集合名称。</td>
	</tr>
	</tbody>
</table>

Shell 示例：

<table class="language-shell">
    <thead>
        <tr>
            <th> 选项 </th>
            <th> 描述 </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>-c </td>
            <td> 要检查段信息的集合名称。</td>
        </tr>
    </tbody>
</table>

## 传输段



Transfer the sealed segment(s) with the `segmentID` and the `nodeID` of the current query node and new query node(s).

{{fragments/multiple_code.md}}

```python
utility.load_balance(
  src_node_id=3, 
  dst_node_ids=[4], 
  sealed_segment_ids=[431067441441538050]
)
```

```go
// This function is under active development on the GO client.
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
  sealed_segmentIDs: [431067441441538050]
});
```

```shell
load_balance -s 3 -d 4 -ss 431067441441538050
```

<table class="language-python">
	<thead>
	<tr>
		<th> Parameter </th>
		<th> Description </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> src_node_id </code> </td>
		<td> ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td> <code> dst_node_ids </code> (Optional)</td>
		<td> ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	<tr>
		<td> <code> sealed_segment_ids </code> (Optional)</td>
		<td> ID(s) of the segment(s) you want to transfer. Milvus transfers all sealed segment(s) in the source query node to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>

<table class="language-javascript">
	<thead>
	<tr>
		<th> Parameter </th>
		<th> Description </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> src_nodeID </code> </td>
		<td> ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td> <code> dst_nodeIDs </code> (Optional)</td>
		<td> ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	<tr>
		<td> <code> sealed_segmentIDs </code> (Optional)</td>
		<td> ID(s) of the segment(s) you want to transfer. Milvus transfers all sealed segment(s) in the source query node to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>

<table class="language-java">
	<thead>
	<tr>
		<th> Parameter </th>
		<th> Description </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code> SourceNodeID </code> </td>
		<td> ID of the query node you want to transfer segment(s) from.</td>
	</tr>
	<tr>
		<td> <code> DestinationNodeID </code> (Optional)</td>
		<td> ID(s) of the query node(s) you want to transfer segment(s) to. Milvus transfers segment(s) to other query nodes automatically if this parameter is left blank.</td>
	</tr>
	</tbody>
</table>





<table class="language-shell">
	<thead>
	<tr>
		<th> 选项 </th>
		<th> 描述 </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td> <code>-s </code> </td>
		<td> 要从中转移段的查询节点的 ID。</td>
	</tr>
	<tr>
		<td> <code>-d </code>（多个）</td>
		<td> 要将段转移到的查询节点的 ID。</td>
	</tr>
	<tr>
		<td> <code>-ss </code>（多个）</td>
		<td> 要传输的段的 ID。</td>
	</tr>
	</tbody>
</table>

## 下一步做什么
 





- 学习更多 Milvus 的基本操作：
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [索引向量字段](/userGuide/manage-indexes/index-vector-fields.md)
  - [索引标量字段](/userGuide/manage-indexes/index-scalar-fields.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

