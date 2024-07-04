

# Data Coordinator 相关配置

本主题介绍了 Milvus 的数据协调器（data coordinator）相关的配置。

数据协调器（data coord）管理数据节点的拓扑结构，维护元数据，并触发刷新、合并和其他后台数据操作。

在本部分中，你可以配置数据协调器地址、分段设置、压缩、垃圾收集等。

## `dataCoord.address`

<table id="dataCoord.address">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器的 TCP/IP 地址。</li>
        <li> 如果将此参数设置为 <code> 0.0.0.0 </code>，数据协调器将监视所有 IPv4 地址。</li>
      </td>
      <td> localhost </td>
    </tr>
  </tbody>
</table>

## `dataCoord.port`

<table id="dataCoord.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 数据协调器的 TCP 端口。</td>
      <td> 13333 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.grpc.serverMaxRecvSize`

<table id="dataCoord.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.grpc.serverMaxSendSize`

<table id="dataCoord.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 在接收 RPC 请求时，数据协调器可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>


## `dataCoord.grpc.clientMaxRecvSize`



# `dataCoord.grpc.clientMaxRecvSize`

<table id="dataCoord.grpc.clientMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调节点在发送 RPC 请求时可以接收的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>


## `dataCoord.grpc.clientMaxSendSize`

<table id="dataCoord.grpc.clientMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调节点可以发送的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.activeStandby.enabled`

<table id="rootCoord.dmlChannelNum">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        数据协调节点是否工作在主备模式下。
      </td>
      <td> false </td>
    </tr>
  </tbody>
</table>

## `dataCoord.replicas`

<table id="rootCoord.dmlChannelNum">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        数据协调节点的数量。如果 `dataCoord.activeStandby.enabled` 设置为 `true`，则必须指定该值。
      </td>
      <td> 1 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.enableCompaction`

<table id="dataCoord.enableCompaction">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 控制是否启用段压缩的开关值。</li>
        <li> 压缩将小尺寸的段合并成一个大段，并清理超出时间旅行保留期限的已删除实体。</li>
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>


## `dataCoord.enableGarbageCollection`
 





<table id="dataCoord.enableGarbageCollection">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        开关值，用于控制是否启用垃圾回收来清除 MinIO 或 S3 服务中的废弃数据。
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>

## `dataCoord.segment.maxSize`

<table id="dataCoord.segment.maxSize">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 一个段的最大大小。</li>
        <li> 单位：MB </li>
        <li> <code> datacoord.segment.maxSize </code> 和 <code> datacoord.segment.sealProportion </code> 一起确定是否可以封存段。</li>
      </td>
      <td> 512 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.segment.sealProportion`

<table id="dataCoord.segment.sealProportion">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 用于封存段的最小比例 <code> datacoord.segment.maxSize </code>。</li>
        <li> <code> datacoord.segment.maxSize </code> 和 <code> datacoord.segment.sealProportion </code> 一起确定是否可以封存段。</li>
      </td>
      <td> 0.23 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.segment.assignmentExpiration`

<table id="dataCoord.segment.assignmentExpiration">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 段分配的过期时间。</li>
        <li> 单位：ms </li>
      </td>
      <td> 2000 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.compaction.enableAutoCompaction`




# `dataCoord.compaction.enableAutoCompaction`

<table id="dataCoord.compaction.enableAutoCompaction">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 开关值，用于控制是否在后台进行自动段合并的数据协调器。</li>
        <li> 仅当 `dataCoord.enableCompaction` 设置为 `true` 时，此配置才生效。</li>
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>


## `dataCoord.gc.interval`

<table id="dataCoord.gc.interval">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器执行垃圾回收的间隔。</li>
        <li> 单位：秒 </li>
        <li> 仅当 `dataCoord.enableGarbageCollection` 设置为 `true` 时，此配置才生效。</li>
      </td>
      <td> 3600 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.gc.missingTolerance`

<table id="dataCoord.gc.missingTolerance">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 未记录的二进制日志（binlog）文件的保留时长。</li>
        <li> 设置一个合理大的值可以避免错误删除缺乏元数据的新建 binlog 文件。</li>
        <li> 单位：秒 </li>
        <li> 仅当 `dataCoord.enableGarbageCollection` 设置为 `true` 时，此配置才生效。</li>
      </td>
      <td> 86400 </td>
    </tr>
  </tbody>
</table>

## `dataCoord.gc.dropTolerance`
 



# 表格 `dataCoord.gc.dropTolerance`

| Description | Default Value |
| --- | --- |
| The retention duration of the binlog files of the deleted segments before they are cleared. | 86400 |
| Unit: Second |  |
| This configuration takes effect only when `dataCoord.enableGarbageCollection` is set as `true`. |  |


 