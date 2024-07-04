


# 查询协调器相关配置

本主题介绍了 Milvus 的查询协调器相关配置。

查询协调器（query coord）管理查询节点的拓扑和负载均衡，以及从增长段到封存段的切换操作。

在本部分中，你可以配置查询协调器地址、自动切换、自动负载均衡等。

## `queryCoord.address`

<table id="queryCoord.address">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询协调器的 TCP/IP 地址。</li>
        <li> 如果将此参数设置为 <code> 0.0.0.0 </code>，查询协调器将监视所有 IPv4 地址。</li>
      </td>
      <td> localhost </td>
    </tr>
  </tbody>
</table>

## `queryCoord.port`

<table id="queryCoord.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 查询协调器的 TCP 端口。</td>
      <td> 19531 </td>
    </tr>
  </tbody>
</table>

## `queryCoord.activeStandby.enabled`

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
        查询协调器是否以主备模式工作。
      </td>
      <td> false </td>
    </tr>
  </tbody>
</table>

## `queryCoord.replicas`

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
        查询协调器的副本数。如果将 `queryCoord.activeStandby.enabled` 设置为 `true`，则此参数是必需的。
      </td>
      <td> 1 </td>
    </tr>
  </tbody>
</table>

## `queryCoord.autoHandoff`
 
<table id="queryCoord.autoHandoff">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Switch value to control if to automatically replace a growing segment with the corresponding indexed sealed segment when the growing segment reaches the sealing threshold.</li>
        <li> If this parameter is set <code> false </code>, Milvus simply searches the growing segments with brute force.</li>
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>

## `queryCoord.autoBalance`

<table id="queryCoord.autoBalance">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Switch value to control if to automatically balance the memory usage among query nodes by distributing segment loading and releasing operations evenly.
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>

## `queryCoord.overloadedMemoryThresholdPercentage`

<table id="queryCoord.overloadedMemoryThresholdPercentage">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        The threshold of memory usage (in percentage) in a query node to trigger the sealed segment balancing. 
      </td>
      <td> 90 </td>
    </tr>
  </tbody>
</table>

## `queryCoord.balanceIntervalSeconds`

<table id="queryCoord.balanceIntervalSeconds">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> The interval at which query coord balances the memory usage among query nodes.</li>
        <li> Unit: Second </li>
      </td>
      <td> 60 </td>
    </tr>
  </tbody>
</table>


## `queryCoord.memoryUsageMaxDifferencePercentage`

<table id="queryCoord.memoryUsageMaxDifferencePercentage">
  <thead>
    <tr>
      <th class="width80"> Description </th>
      <th class="width20"> Default Value </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        The threshold of memory usage difference (in percentage) between any two query nodes to trigger the sealed segment balancing. 
      </td>
      <td> 30 </td>
    </tr>
  </tbody>
</table>

## `queryCoord.grpc.serverMaxRecvSize`
 


# `queryCoord.grpc.serverMaxRecvSize`

<table id="queryCoord.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询协调器可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

# `queryCoord.grpc.serverMaxSendSize`

<table id="queryCoord.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询协调器在接收 RPC 请求时可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

# `queryCoord.grpc.clientMaxRecvSize`

<table id="queryCoord.grpc.clientMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询协调器在发送 RPC 请求时可以接收的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>

# `queryCoord.grpc.clientMaxSendSize`



# 


<table id="queryCoord.grpc.clientMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 简介 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询协调器可以发送的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table> 

