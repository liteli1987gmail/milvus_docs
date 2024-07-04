

# NATS 相关配置

本文介绍了 Milvus 的 NATS 相关配置。

NATS 是一种面向消息的中间件，允许应用程序和服务之间以消息的形式进行数据交换。Milvus 使用 NATS 作为可靠存储和消息流发布/订阅的底层引擎。你可以将其用作 RocksMQ 的替代方案。

在此部分中，你可以配置消息大小、保留时间和大小等参数。

## `natsmq.server.port`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        NATS 服务器的监听端口。
      </td>
      <td> <code> 4222 </code> </td>
    </tr>
  </tbody>
</table>

## `natsmq.server.storeDir`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        JetStream 存储路径。
      </td>
      <td> <code>/var/lib/milvus/nats </code> </td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxFileStore`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <b> 文件 </b> 存储的最大大小。
      </td>
      <td> <code> 17179869184 </code> (16 GB)</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxPayload`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        每个消息的有效负载的最大大小（以字节为单位）。
      </td>
      <td> <code> 8388608 </code> (8 MB)</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxPending`






<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        每个客户端连接的最大缓冲区大小（以字节为单位）。
      </td>
      <td> <code> 67108864 </code>（64 MB）</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.initializeTimeout`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        NATs 初始化的超时时长（以毫秒为单位）。
      </td>
      <td> <code> 4000 </code>（4 秒）</td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.debug`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        是否启用调试日志
      </td>
      <td> <code> false </code> </td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.logTime`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        是否在调试日志中包含时间戳。
      </td>
      <td> <code> true </code> </td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.logFile`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 生成的日志文件的存储路径。</li>
        <li> 如果未指定，则不会生成日志文件。</li>
      </td>
      <td> N/A </td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.logSizeLimit`
 





<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每个日志文件的最大大小（以字节为单位）。</li>
        <li> 如果设置为 <code> 0 </code>，则没有限制。</li>
      </td>
      <td> <code> 0 </code> </td>
    </tr>
  </tbody>
</table>

## `natsmq.rentention.maxAge`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        P 通道中每条消息的最大过期时间（以分钟为单位）。
      </td>
      <td> <code> 4320 </code>（3 天）</td>
    </tr>
  </tbody>
</table>

## `natsmq.rentention.maxBytes`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> P 通道中每条消息的最大过期时间（以分钟为单位）。</li>
        <li> 如果未指定，则没有限制。</li>
      </td>
      <td> N/A </td>
    </tr>
  </tbody>
</table>

## `natsmq.rentention.maxMsgs`





<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每个 P 通道的最大消息数。</li>
        <li> 如果未指定任何限制，则没有限制。</li>
      </td>
      <td> N/A </td>
    </tr>
  </tbody>
</table>
