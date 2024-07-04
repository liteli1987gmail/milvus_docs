


# RocksMQ 相关配置

本主题介绍了 Milvus 的 RocksMQ 相关配置。

RocksMQ 是支持 Milvus 独立版可靠存储和消息流发布/订阅的底层引擎，它是基于 RocksDB 实现的。

在此部分，你可以配置消息大小、保留时间和大小等。

## `rocksmq.path`

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
        <li> Milvus 在 RocksMQ 中存储数据的键前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
        <li> 如果已存在 etcd 服务，请为 Milvus 设置一个易于识别的根键前缀。</li>
      </td>
      <td>/var/lib/milvus/rdb_data </td>
    </tr>
  </tbody>
</table>

## `rocksmq.rocksmqPageSize`

<table id="rocksmq.rocksmqPageSize">
  <thead>
    <tr>
    <th class="width80"> 描述 </th>
    <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> RocksMQ 中每个页面中消息的最大大小。基于此参数，RocksMQ 会批量检查并清除（当过期时）RocksMQ 中的消息。</li>
        <li> 单位：字节 </li>
      </td>
      <td> 2147483648 </td>
    </tr>
  </tbody>
</table>

## `rocksmq.retentionTimeInMinutes`

<table id="rocksmq.retentionTimeInMinutes">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> RocksMQ 中已确认消息的最大保留时间。RocksMQ 中的已确认消息将在指定的时间段内保留，然后被清除。</li>
        <li> 单位：分钟 </li>
      </td>
      <td> 10080 </td>
    </tr>
  </tbody>
</table>

## `rocksmq.retentionSizeInMB`



# rocksmq.retentionSizeInMB

| **描述** | **默认值** |
|---|---|
| 每个主题在 RocksMQ 中已确认消息的最大保留大小。如果每个主题中的已确认消息大小超过此参数，则清除已确认消息。| 8192 |
| 单位：MB |

# rocksmq.compactionInterval

| **描述** | **默认值** |
|---|---|
| 触发 RocksDB 数据清理的时间间隔。| 86400 |
| 单位：秒 |

# rocksmq.lrucacheratio







<table id="rocksmq.lrucacheratio">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Rocksdb 缓存内存比例。</li>
      </td>
      <td> 0.06 </td>
    </tr>
  </tbody>
</table>
 