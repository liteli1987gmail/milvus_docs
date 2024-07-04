

# 配额和限制相关配置

本主题介绍了与 Milvus 配额和限制相关的配置项。

其中一些配置项用于设置 Milvus 对于与集合、分区、索引等相关的 DDL/DML/DQL 请求主动进行限流的阈值。

其中一些配置项用于设置使 Milvus 降低 DDL/DML/DQL 请求速率的反压信号。

## `quotaAndLimits.limits.maxCollectionNumPerDB`

<table id="quotaAndLimits.ddl.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 每个数据库的最大集合数量。</td>
      <td> 64 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.enabled`

<table id="quotaAndLimits.ddl.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用 DDL 请求限流。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.collectionRate`

<table id="quotaAndLimits.ddl.collectionRate">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒钟与集合相关的 DDL 请求的最大数量。</li>
        <li> 将此项设置为 <code> 10 </code> 表示 Milvus 每秒钟处理不超过 10 个与集合相关的 DDL 请求，包括集合创建请求、集合删除请求、集合加载请求和集合释放请求。</li>
        <li> 要使用此设置，同时将 <code> quotaAndLimits.ddl.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.partitionRate`

<table id="quotaAndLimits.ddl.partitionRate">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒钟与分区相关的 DDL 请求的最大数量。</li>
        <li> 将此项设置为 <code> 10 </code> 表示 Milvus 每秒钟处理不超过 10 个与分区相关的请求，包括分区创建请求、分区删除请求、分区加载请求和分区释放请求。</li>
        <li> 要使用此设置，同时将 <code> quotaAndLimits.ddl.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.indexRate.enabled`






<table id="quotaAndLimits.indexRate.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用与索引相关的请求限制。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.indexRate.max`

<table id="quotaAndLimits.indexRate.max">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒处理的与索引相关的请求的最大数量。</li>
        <li> 将此项设置为 <code> 10 </code> 表示 Milvus 每秒最多处理 10 个与分区相关的请求，包括索引创建请求和索引删除请求。</li>
        <li> 要使用此设置，同时将 <code> quotaAndLimits.indexRate.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.flushRate.enabled`

<table id="quotaAndLimits.flushRate.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用刷新请求限制。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.flush.max`

<table id="quotaAndLimits.flush.max">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒处理的刷新请求的最大数量。</li>
        <li> 将此项设置为 <code> 10 </code> 表示 Milvus 每秒最多处理 10 个刷新请求。</li>
        <li> 要使用此设置，同时将 <code> quotaAndLimits.flushRate.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.compaction.enabled`

<table id="quotaAndLimits.compaction.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用压缩请求限制。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.compaction.max`



# quotaAndLimits.compaction.max

| 描述                                                         | 默认值 |
| ------------------------------------------------------------ | ------ |
| 最大的手动压缩请求每秒数。                                    | 10     |
| 将该项目设置为 `10` 表示 Milvus 每秒最多处理 10 个手动压缩请求。     |        |
| 要使用此设置，请同时将 `quotaAndLimits.compaction.enabled` 设置为 `true`。 | ∞      |

## `quotaAndLimits.dml.enabled`

| 描述                                                   | 默认值 |
| ------------------------------------------------------ | ------ |
| 是否启用 DML 请求限制。                                   | False  |

## `quotaAndLimits.dml.insertRate.max`

| 描述                                                           | 默认值 |
| -------------------------------------------------------------- | ------ |
| 每秒的最高数据插入速率。                                        | 5      |
| 将该项目设置为 `5` 表示 Milvus 只允许以 5 MB/s 的速率进行数据插入。     |        |
| 要使用此设置，请同时将 `quotaAndLimits.dml.enabled` 设置为 `true`。 | ∞      |

## `quotaAndLimits.dml.insertRate.collection.max`

| 描述                                                                     | 默认值 |
| ------------------------------------------------------------------------ | ------ |
| 每秒的每个 collection 的最高数据插入速率。                                | 5      |
| 将该项目设置为 `5` 表示 Milvus 只允许以 5 MB/s 的速率向任何 collection 插入数据。 |        |
| 要使用此设置，请同时将 `quotaAndLimits.dml.enabled` 设置为 `true`。          | ∞      |

## `quotaAndLimits.dml.deleteRate.max`



# `quotaAndLimits.dml.deleteRate.max`

| 描述 | 默认值 |
| --- | --- |
| 最高每秒数据删除速率。 | ∞ |
| 将此项设为 `0.1` 表示 Milvus 只允许以 0.1 MB/s 的速率进行数据删除。同时，还需将 `quotaAndLimits.dml.enabled` 设置为 `true`。 |

# `quotaAndLimits.dml.deleteRate.collection.max`

| 描述 | 默认值 |
| --- | --- |
| 最高每秒数据删除速率。 | ∞ |
| 将此项设为 `0.1` 表示 Milvus 只允许以 0.1 MB/s 的速率从任意集合进行数据删除。同时，还需将 `quotaAndLimits.dml.enabled` 设置为 `true`。 |

# `quotaAndLimits.dql.enabled`

| 描述 | 默认值 |
| --- | --- |
| 是否启用 DQL 请求限流。 | False |

# `quotaAndLimits.dql.searchRate.max`

| 描述 | 默认值 |
| --- | --- |
| 每秒最大搜索向量数。 | ∞ |
| 将此项设为 `100` 表示 Milvus 只允许每秒搜索 100 个向量，无论这 100 个向量是在一次搜索中还是分布在多个搜索中。同时，还需将 `quotaAndLimits.dql.enabled` 设置为 `true`。 |

# `quotaAndLimits.dql.searchRate.collection.max`



<table id="quotaAndLimits.dql.searchRate.collection.max">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒每个集合要搜索的向量的最大数量。</li>
        <li> 将此项设置为 <code> 100 </code> 表示 Milvus 每秒只允许搜索 100 个向量，无论这 100 个向量是在一次搜索中还是分散在多次搜索中。</li>
        <li> 同时设置 <code> quotaAndLimits.dql.enabled </code> 为 <code> true </code> 以使用此设置。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.dql.queryRate.max`

<table id="quotaAndLimits.dql.queryRate.max">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒查询的最大数量。</li>
        <li> 将此项设置为 <code> 100 </code> 表示 Milvus 每秒只允许 100 个查询。</li>
        <li> 同时设置 <code> quotaAndLimits.dql.enabled </code> 为 <code> true </code> 以使用此设置。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.dql.queryRate.collection.max`

<table id="quotaAndLimits.dql.queryRate.collection.max">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 每秒每个集合的查询的最大数量。</li>
        <li> 将此项设置为 <code> 100 </code> 表示 Milvus 每秒只允许每个集合 100 个查询。</li>
        <li> 同时设置 <code> quotaAndLimits.dql.enabled </code> 为 <code> true </code> 以使用此设置。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.ttProtection.enabled`

<table id="quotaAndLimits.limitWriting.ttProtection.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用基于时间刻度延迟的反压力。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay`



                

<table id="quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 最大时间刻度延迟。时间刻度延迟是 RootCoord TSO 与 DataNodes 和 QueryNodes 上所有流图的最小时间刻度之间的差异。</li>
        <li> 将此项设置为 <code> 300 </code> 表示当延迟增加时，Milvus 会减少 DML 请求的速率，并在延迟达到设置的最大值时丢弃所有 DML 请求（以秒为单位）。</li>
        <li> 要使用此设置，请同时将 <code> quotaAndLimits.limitWriting.ttProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> 300 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.memProtection.enabled`

<table id="quotaAndLimits.limitWriting.memProtection.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用基于内存水位的背压。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel`

<table id="quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> DataNodes 上的低内存水位。内存水位是 DataNodes 上已使用内存与总内存之间的比率。</li>
        <li> 将此项设置为 <code> 0.85 </code> 表示当 DataNodes 上的内存水位达到设置的值时，Milvus 会减少 DML 请求的速率。</li>
        <li> 要使用此设置，请同时将 <code> quotaAndLimits.limitWriting.memProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> 0.85 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel`

<table id="quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> QueryNodes 上的低内存水位。内存水位是 QueryNodes 上已使用内存与总内存之间的比率。</li>
        <li> 将此项设置为 <code> 0.85 </code> 表示当 QueryNodes 上的内存水位达到设置的值时，Milvus 会减少 DML 请求的速率。</li>
        <li> 要使用此设置，请同时将 <code> quotaAndLimits.limitWriting.memProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> 0.85 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel`
 



## `quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel`

<table id="quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> DataNodes 的内存使用高水位。内存水位是 DataNodes 上已使用内存和总内存之间的比率。</li>
        <li> 将此项设置为 <code> 0.95 </code> 表示当 DataNodes 上的内存水位达到设定值时，Milvus 将丢弃所有 DML 请求。</li>
        <li> 同时设置 <code> quotaAndLimits.limitWriting.memProtection.enabled </code> 为 <code> true </code> 来使用此设置。</li>
      </td>
      <td> 0.95 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel`

<table id="quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> QueryNodes 的内存使用高水位。内存水位是 QueryNodes 上已使用内存和总内存之间的比率。</li>
        <li> 将此项设置为 <code> 0.95 </code> 表示当 QueryNodes 上的内存水位达到设定值时，Milvus 将丢弃所有 DML 请求。</li>
        <li> 同时设置 <code> quotaAndLimits.limitWriting.memProtection.enabled </code> 为 <code> true </code> 来使用此设置。</li>
      </td>
      <td> 0.95 </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.diskProtection.enabled`

<table id="quotaAndLimits.limitWriting.diskProtection.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用基于磁盘配额的背压机制。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.diskProtection.diskQuota`

<table id="quotaAndLimits.limitWriting.diskProtection.diskQuota">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 分配给 binlog 的磁盘配额。</li>
        <li> 将此项设置为 <code> 8192 </code> 表示当 binlog 的大小达到设定值时，Milvus 将丢弃所有 DML 请求。</li>
        <li> 同时设置 <code> quotaAndLimits.limitWriting.diskProtection.enabled </code> 为 <code> true </code> 来使用此设置。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.diskProtection.diskQuotaPerCollection`
 



<table id="quotaAndLimits.limitWriting.diskProtection.diskQuotaPerCollection">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 分配给每个集合的 binlog 的磁盘配额。</li>
        <li> 将此项目设置为 <code> 8192 </code> 表示当集合的 binlog 大小达到设置的值时，Milvus 将丢弃该集合中的所有 DML 请求。</li>
        <li> 如果要使用此设置，请同时将 <code> quotaAndLimits.limitWriting.diskProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.forceDeny`

<table id="quotaAndLimits.limitWriting.forceDeny">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 手动配置 Milvus 是否丢弃所有 DML 请求。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitReading.queueProtection.enabled`

<table id="quotaAndLimits.limitReading.queueProtection.enabled">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用基于搜索和查询队列长度的背压。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold`

<table id="quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 搜索向量或查询的最大数目。请注意，包含多个搜索向量的搜索请求被视为多个搜索，而查询与仅包含一个搜索向量的搜索请求相同。</li>
        <li> 将此项设置为 <code> 10000 </code> 表示当搜索和查询的数量达到设置的最大值时，Milvus 会以毫秒为单位降低 DQL 请求速率，并在数量低于设置值时解决背压。降低速率由 <code> quotaAndLimits.limitReading.coolOffSpeed </code> 确定。</li>
        <li> 如果要使用此设置，请同时将 <code> quotaAndLimits.limitReading.queueProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold`

<table id="quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 搜索和查询队列的平均延迟。请注意，包含多个搜索向量的搜索请求被视为多个搜索，而查询与仅包含一个搜索向量的搜索请求相同。</li>
        <li> 将此项设置为 <code> 200 </code> 表示当平均延迟达到设置的最大值时，Milvus 会以毫秒为单位降低 DQL 请求速率，并在毫秒级下降到设置值以下时解决背压。降低速率由 <code> quotaAndLimits.limitReading.coolOffSpeed </code> 确定。</li>
        <li> 如果要使用此设置，请同时将 <code> quotaAndLimits.limitReading.queueProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitReading.resultProtection.enabled`
 



<table id="quotaAndLimits.limitReading.resultProtection.enabled">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 是否启用基于查询结果速率的背压。</td>
      <td> False </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitReading.resultProtection.maxReadResultRate`

<table id="quotaAndLimits.limitReading.resultProtection.maxReadResultRate">
  <thead>
    <tr>
      <th class="width80"> 说明 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 将数据返回给客户端的速率。</li>
        <li> 将此项设置为 <code> 2 </code> 表示当数据速率达到设置的最大值（以 MB/s 为单位）时，Milvus 将降低 DQL 请求速率，并在数据速率低于设置值时解决背压。降低速率由 <code> quotaAndLimits.limitReading.coolOffSpeed </code> 确定。</li>
        <li> 要使用此设置，同时将 <code> quotaAndLimits.limitReading.resultProtection.enabled </code> 设置为 <code> true </code>。</li>
      </td>
      <td> ∞ </td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.limitWriting.forceDeny`


| Description                                                 | Default Value |
| ------------------------------------------------------------ | ------------- |
| 是否手动配置 Milvus 以放弃所有 DQL 请求                             | False         |

