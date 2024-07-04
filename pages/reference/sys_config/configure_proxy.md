
# 代理相关配置

这个主题介绍了 Milvus 的代理相关配置。

代理是系统的访问层和用户的终点。它验证客户端请求并减少返回结果。

在这个部分，你可以配置代理端口、系统限制等。

## `proxy.port`

<table id="proxy.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 代理的 TCP 端口。</td>
      <td> 19530 </td>
    </tr>
  </tbody>
</table>

## `proxy.grpc.serverMaxRecvSize`

<table id="proxy.grpc.serverMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 代理可以接收的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 536870912 </td>
    </tr>
  </tbody>
</table>

## `proxy.grpc.serverMaxSendSize`

<table id="proxy.grpc.serverMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 当接收到 RPC 请求时，代理可以发送的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 536870912 </td>
    </tr>
  </tbody>
</table>

## `proxy.grpc.clientMaxRecvSize`

<table id="proxy.grpc.clientMaxRecvSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 当发送 RPC 请求时，代理可以接收的每个响应的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>

## `proxy.grpc.clientMaxSendSize`

<table id="proxy.grpc.clientMaxSendSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 代理可以发送的每个 RPC 请求的最大大小。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 104857600 </td>
    </tr>
  </tbody>
</table>


## `proxy.timeTickInterval`

<table id="proxy.timeTickInterval">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 代理同步时间标记的间隔。</li>
        <li> 单位：毫秒 </li>
      </td>
      <td> 200 </td>
    </tr>
  </tbody>
</table>

## `proxy.msgStream.timeTick.bufSize`

<table id="proxy.msgStream.timeTick.bufSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        代理在生成消息时，在 timeTick 消息流中可以缓冲的最大消息数。
      </td>
      <td> 512 </td>
    </tr>
  </tbody>
</table>

## `proxy.maxNameLength`

<table id="proxy.maxNameLength">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 在 Milvus 中可以创建的名称或别名的最大长度，包括集合名称、集合别名、分区名称和字段名称。</td>
      <td> 255 </td>
    </tr>
  </tbody>
</table>

## `proxy.maxFieldNum`

<table id="proxy.maxFieldNum">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 在创建集合时可以创建的字段的最大数量。</td>
      <td> 64 </td>
    </tr>
  </tbody>
</table>

## `proxy.maxDimension`



# `proxy.maxDimension`

| 描述 | 默认值 |
| --- | --- |
| 一个向量在创建时可以具有的最大维度数量。 | 32768 |

# `proxy.maxShardNum`

| 描述 | 默认值 |
| --- | --- |
| 一个集合在创建时可以具有的最大分片数量。 | 64 |

# `proxy.maxTaskNum`

| 描述 | 默认值 |
| --- | --- |
| 代理任务队列中可以具有的最大任务数量。 | 1024 |

# `proxy.maxVectorFieldNum`

| 描述 | 默认值 |
| --- | --- |
| 一个集合中可以指定的向量字段的最大数量。取值范围：[1, 10]。 | 4 |

# `proxy.accessLog.enable`

| 描述 | 默认值 |
| --- | --- |
| 是否启用访问日志功能。 | False |

# `proxy.accessLog.filename`




# 代理服务器访问日志配置

## `proxy.accessLog.filename`

| 描述 | 默认值 |
| ---- | ---- |
| 访问日志文件的名称。如果不填写该参数，访问日志将打印到 stdout。| 空字符串 |

## `proxy.accessLog.localPath`

| 描述 | 默认值 |
| ---- | ---- |
| 访问日志文件所存储的本地文件夹路径。只有在 `proxy.accessLog.filename` 不为空时才能指定该参数。| /tmp/milvus_access |

## `proxy.accessLog.maxSize`

| 描述 | 默认值 |
| ---- | ---- |
| - 访问日志文件的最大允许大小。如果日志文件大小达到此限制，将触发一个轮转过程。该过程会封存当前的访问日志文件，创建一个新的日志文件，并清除原始日志文件的内容。 \n - 单位：MB | 64 |

## `proxy.accessLog.rotatedTime`

| 描述 | 默认值 |
| ---- | ---- |
| - 轮转单个访问日志文件的最大时间间隔。在达到指定的时间间隔后，将触发一个轮转过程，导致创建新的访问日志文件并封存之前的日志文件。 \n - 单位：秒 | 0 |

## `proxy.accessLog.maxBackups`

| 描述 | 默认值 |
| ---- | ---- |
| 可保留的封存访问日志文件的最大数量。如果封存的访问日志文件数量超过限制，最旧的文件将被删除。| 8 |

## `proxy.accessLog.minioEnable`




## `proxy.accessLog.remotePath`

<table id="proxy.accessLog.remotePath">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 用于上传访问日志文件的对象存储路径。</td>
      <td> access_log/</td>
    </tr>
  </tbody>
</table>

## `proxy.accessLog.remoteMaxTime`

<table id="proxy.accessLog.remoteMaxTime">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 允许上传访问日志文件的时间间隔。如果日志文件的上传时间超过此间隔，文件将被删除。将该值设置为 <code> 0 </code> 将禁用此功能。</td>
      <td> 0 </td>
    </tr>
  </tbody>
</table>

## `proxy.accessLog.base.format`

<table id="proxy.accessLog.base.format">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 包含动态指标的日志格式。默认情况下，此格式适用于所有方法。有关指标的更多信息，请参见 <a href="configure_access_logs.md"> 配置访问日志 </a>。</td>
      <td> 空字符串 </td>
    </tr>
  </tbody>
</table>

## `proxy.accessLog.<custom_formatter_name>.format`

<table id="proxy.accessLog.<custom_formatter_name>.format ">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 为特定方法配置的自定义日志格式。该参数与 <code> proxy.accessLog.&lt; custom_formatter_name&gt;.methods </code> 一起使用。</td>
      <td> 空字符串 </td>
    </tr>
  </tbody>
</table>

## `proxy.accessLog.<custom_formatter_name>.methods`



# 


| 信息 id                                                         | 描述                                                                                                                                                                             | 默认值       |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| proxy.accessLog.<custom_formatter_name>.methods | 定义应用该自定义格式化程序的方法。此参数与 <code> proxy.accessLog.&lt; custom_formatter_name&gt;.format </code> 一起使用。 |  空字符串  |

