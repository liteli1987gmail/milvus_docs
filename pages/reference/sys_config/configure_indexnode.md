

# Index Node 相关配置

本主题介绍了 Milvus 的 Index Node 相关配置。

Index Node 用于为向量构建索引。

在本节中，你可以配置 Index Node 的端口等。

## `indexNode.port`

<table id="indexNode.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> Index Node 的 TCP 端口。</td>
      <td> 21121 </td>
    </tr>
  </tbody>
</table>

## `indexNode.grpc.serverMaxRecvSize`

<table id="indexNode.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Index Node 可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

## `indexNode.grpc.serverMaxSendSize`

<table id="indexNode.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Index Node 在接收到 RPC 请求时可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483647 </td>
    </tr>
  </tbody>
</table>

## `indexNode.grpc.clientMaxRecvSize`

<table id="indexNode.grpc.clientMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Index Node 在发送 RPC 请求时可以接收的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>

## `indexNode.grpc.clientMaxSendSize`


## 表格 indexNode.grpc.clientMaxSendSize
| 描述                             | 默认值         |
| ------------------------------ | ------------- |
| 索引节点可以发送的每个 RPC 请求的最大大小。单位：字节 | 104857600 |