# RocksMQ 相关配置

本主题介绍了 Milvus 独立部署模式下 RocksMQ 的相关配置。

RocksMQ 是支撑 Milvus 独立部署模式下可靠存储和消息流发布/订阅的底层引擎。它基于 RocksDB 实现。

在本节中，您可以配置消息大小、保留时间和大小等。

## `rocksmq.path`

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
        <li>Milvus 在 RocksMQ 中存储数据的键的前缀。</li>
        <li>注意：在一段时间使用 Milvus 后更改此参数将影响您访问旧数据。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
        <li>如果 etcd 服务已经存在，为 Milvus 设置一个容易识别的根键前缀。</li>
      </td>
      <td>/var/lib/milvus/rdb_data</td>
    </tr>
  </tbody>
</table>


## `rocksmq.rocksmqPageSize`

<table id="rocksmq.rocksmqPageSize">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>RocksMQ 中每页消息的最大大小。RocksMQ 根据此参数批量检查和清除（当过期时）消息。</li>
        <li>单位：字节</li>
      </td>
      <td>2147483648</td>
    </tr>
  </tbody>
</table>


## `rocksmq.retentionTimeInMinutes`

<table id="rocksmq.retentionTimeInMinutes">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>RocksMQ 中已确认消息的最大保留时间。RocksMQ 中的已确认消息将保留指定的时间，然后被清除。</li>
        <li>单位：分钟</li>
      </td>
      <td>10080</td>
    </tr>
  </tbody>
</table>


## `rocksmq.retentionSizeInMB`

<table id="rocksmq.retentionSizeInMB">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>RocksMQ 中每个主题的已确认消息的最大保留大小。如果每个主题中的已确认消息大小超过此参数，则将被清除。</li>
        <li>单位：MB</li>
      </td>
      <td>8192</td>
    </tr>
  </tbody>
</table>

## `rocksmq.compactionInterval`

<table id="rocksmq.compactionInterval">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>触发 rocksdb 压缩以删除已删除数据的时间间隔。</li>
        <li>单位：秒</li>
      </td>
      <td>86400</td>
    </tr>
  </tbody>
</table>

## `rocksmq.lrucacheratio`

<table id="rocksmq.lrucacheratio">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Rocksdb 缓存内存比例。</li>
      </td>
      <td>0.06</td>
    </tr>
  </tbody>
</table>