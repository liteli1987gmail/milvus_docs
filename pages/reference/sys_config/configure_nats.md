# NATS相关配置

本主题介绍了Milvus中与NATS相关的配置。

NATS是一种面向消息的中间件，允许应用程序和服务之间的数据交换，以消息的形式进行分段。Milvus使用NATS作为可靠的存储和消息流的发布/订阅的底层引擎。您可以将其作为RocksMQ的替代品。

在本节中，您可以配置消息大小、保留时间和大小等。

## `natsmq.server.port`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        NATS服务器的监听端口。
      </td>
      <td><code>4222</code></td>
    </tr>
  </tbody>
</table>

## `natsmq.server.storeDir`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        JetStream存储路径。
      </td>
      <td><code>/var/lib/milvus/nats</code></td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxFileStore`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        文件存储的最大大小。
      </td>
      <td><code>17179869184</code> (16 GB)</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxPayload`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        每条消息的最大负载大小（以字节为单位）。
      </td>
      <td><code>8388608</code> (8 MB)</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.maxPending`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        每个客户端连接的最大缓冲区大小（以字节为单位）。
      </td>
      <td><code>67108864</code> (64 MB)</td>
    </tr>
  </tbody>
</table>

## `natsmq.server.initializeTimeout`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        NATS初始化的超时持续时间（以毫秒为单位）。
      </td>
      <td><code>4000</code> (4秒)</td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.debug`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        是否启用调试日志
      </td>
      <td><code>false</code></td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.logTime`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        是否在调试日志中包含时间戳。
      </td>
      <td><code>true</code></td>
    </tr>
  </tbody>
</table>

## `natsmq.monitor.logFile`

<table id="rocksmq.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>生成的日志文件的存储路径。</li>
        <li>如果未指定