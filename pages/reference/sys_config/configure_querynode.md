


# Query Node 相关配置

本主题介绍了 Milvus 的 query node 相关配置。

Query node 在增量数据和历史数据上执行向量和标量数据的混合搜索。

在这个部分中，你可以配置 query node 端口、优雅时间等。

## `queryNode.gracefulTime`

<table id="queryNode.gracefulTime">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 新增数据可以被搜索的最短时间。</li>
        <li> 单位：毫秒 </li>
        <li> 当搜索消息的时间戳早于查询节点系统时间时，Milvus 直接执行搜索请求。</li>
        <li> 当搜索消息的时间戳晚于查询节点系统时间时，Milvus 等待查询节点系统时间与时间戳之间的时间差小于该参数值，然后执行搜索请求。</li>
      </td>
      <td> 0 </td>
    </tr>
  </tbody>
</table>

## `queryNode.port`

<table id="queryNode.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 查询节点的 TCP 端口。</td>
      <td> 21123 </td>
    </tr>
  </tbody>
</table>

## `queryNode.grpc.serverMaxRecvSize`

<table id="queryNode.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询节点可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

## `queryNode.grpc.serverMaxSendSize`

<table id="queryNode.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询节点在接收 RPC 请求时可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

## `queryNode.grpc.clientMaxRecvSize`



# `queryNode.grpc.clientMaxRecvSize`

查询节点在发送 RPC 请求时能接收的最大响应大小。
- 单位：字节
- 默认值：104857600

# `queryNode.grpc.clientMaxSendSize`

查询节点可以发送的每个 RPC 请求的最大大小。
- 单位：字节
- 默认值：104857600

# `queryNode.stats.publishInterval`

查询节点发布节点统计信息的间隔，包括段状态、CPU 使用率、内存使用率、健康状况等。
- 单位：毫秒
- 默认值：1000

# `queryNode.dataSync.flowGraph.maxQueueLength`

查询节点中流图中任务队列缓存的最大大小。
- 单位：MB
- 查询节点使用流图来订阅和组织消息流。
- 默认值：1024

# `queryNode.segcore.chunkRows`

Segcore 将段划分为块的行数。
- 默认值：1024

# `queryNode.segcore.InterimIndex`

（此处原文未提供完整的配置项描述，如需翻译请提供完整信息）



<table id="queryNode.segcore.chunkRows">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
          是否为增长中的片段和封装的片段创建临时索引，以提高搜索性能。<br/>
          <ul> <li>
            Milvus 最终会封装并索引所有的片段，但启用此功能可以优化数据插入后的立即查询的搜索性能。
          </li>
          <li>
            默认为 `true`，表明 Milvus 在搜索时会为增长中的片段和尚未索引的封装片段创建临时索引。
          </li> </ul>
      </td>
      <td> true </td>
    </tr>
  </tbody>
</table>
