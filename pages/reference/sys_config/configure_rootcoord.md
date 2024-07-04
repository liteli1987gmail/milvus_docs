


# 根协调器相关配置

本主题介绍了 Milvus 的根协调器相关配置。

根协调器（root coord）处理数据定义语言（DDL）和数据控制语言（DCL）请求，管理 TSO（时间戳 Oracle），并发布时间脉冲消息。

在该部分下，你可以配置根协调器的地址、索引构建阈值等。


## `rootCoord.address`

<table id="rootCoord.address">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器的 TCP/IP 地址。</li>
        <li> 如果将此参数设置为 <code> 0.0.0.0 </code>，则根协调器监视所有 IPv4 地址。</li>
      </td>
      <td> localhost </td>
    </tr>
  </tbody>
</table>


## `rootCoord.port`

<table id="rootCoord.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 根协调器的 TCP 端口。</td>
      <td> 53100 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.grpc.serverMaxRecvSize`

<table id="rootCoord.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.grpc.serverMaxSendSize`

<table id="rootCoord.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 当根协调器接收到 RPC 请求时，可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.grpc.clientMaxRecvSize`


<table id="rootCoord.grpc.clientMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 在发送 RPC 请求时，根协调器可以接收的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>

## `rootCoord.grpc.clientMaxSendSize`

<table id="rootCoord.grpc.clientMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器可以发送的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.activeStandby.enabled`

<table id="rootCoord.dmlChannelNum">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        根协调器是否以主备模式运行。
      </td>
      <td> false </td>
    </tr>
  </tbody>
</table>

## `rootCoord.replicas`

<table id="rootCoord.dmlChannelNum">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        根协调器的副本数。如果 `rootCoord.activeStandby.enabled` 设置为 `true`，则此项是必需的。
      </td>
      <td> 1 </td>
    </tr>
  </tbody>
</table>

## `rootCoord.dmlChannelNum`

<table id="rootCoord.dmlChannelNum">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        根协调器启动时要创建的 DML 通道的数量。
      </td>
      <td> 256 </td>
    </tr>
  </tbody>
</table>

## `rootCoord.maxPartitionNum`



# `rootCoord.maxPartitionNum`

<table id="rootCoord.maxPartitionNum">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每个集合中的最大分区数。</li>
        <li> 如果此参数设置为 <code> 0 </code> 或 <code> 1 </code>，则无法创建新的分区。</li>
        <li> 范围： [0, INT64MAX] </li>
      </td>
      <td> 4096 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.minSegmentSizeToEnableIndex`

<table id="rootCoord.minSegmentSizeToEnableIndex">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 创建索引所需段的最小行数。</li>
        <li> 大小小于此参数的段不会被索引，并将使用暴力搜索。</li>
      </td>
      <td> 1024 </td>
    </tr>
  </tbody>
</table>


## `rootCoord.importTaskExpiration`

<table id="rootCoord.importTaskExpiration">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 导入任务在 <code> importTaskExpiration </code> 秒后过期。</li>
        <li> 单位：秒 </li>
        <li> 你还应在 <code> internal/util/paramtable/component_param.go </code> 文件中更改该参数的值。</li>
      </td>
      <td> 900 </td>
    </tr>
  </tbody>
</table>

## `rootCoord.importTaskRetention`
 




<table id="rootCoord.importTaskRetention">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Milvus 会至少保留导入任务的记录 <code> importTaskRetention </code> 秒。</li>
        <li> 你还应该在 <code> internal/util/paramtable/component_param.go </code> 文件中更改该参数的值。</li>
      </td>
      <td> 86400 </td>
    </tr>
  </tbody>
</table> 