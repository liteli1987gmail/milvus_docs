


# 使用 Helm Charts 配置 Milvus

本文介绍如何使用 Helm Charts 来配置 Milvus 组件及其第三方依赖项。

<div class="alert note">
在当前版本中，所有参数仅在 Milvus 重启后生效。
</div>

## 通过配置文件配置 Milvus

你可以使用配置文件 `values.yaml` 来配置 Milvus。

### 下载配置文件

你可以直接 [下载](https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml) `values.yaml`，或使用以下命令下载：

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml
```

### 修改配置文件



配置你的 Milvus 实例以适应你的应用场景，通过调整 `values.yaml` 中的相应参数。

具体来说，搜索 `values.yaml` 中的 `extraConfigFiles`，并将你的配置放在下面的部分中：

```yaml
# Extra configs for milvus.yaml
# If set, this config will merge into milvus.yaml
# Please follow the config structure in the milvus.yaml
# at https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml
# Note: this config will be the top priority which will override the config
# in the image and helm chart.
extraConfigFiles:
  user.yaml: |+
    #    例如为查询节点设置优雅时间
    #    queryNodes:
    #      gracefulTime: 10
```

查看下面的链接以获取有关每个参数的更多信息。

按照以下方式对其进行分类:

<div class="filter">
<a href="#component"> 组件或依赖项 </a> <a href="#purpose"> 配置目的 </a> 

</div>

<div class="filter-component table-wrapper">

<table id="component">
<thead>
  <tr>
    <th> 依赖项 </th>
    <th> 组件 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>
        <ul>
            <li> <a href="configure_etcd.md"> etcd </a> </li>
            <li> <a href="configure_minio.md"> MinIO 或 S3 </a> </li>
            <li> <a href="configure_pulsar.md"> Pulsar </a> </li>
            <li> <a href="configure_rocksmq.md"> RocksMQ </a> </li>
        </ul>
    </td>
    <td>
        <ul>
            <li> <a href="configure_rootcoord.md"> Root coord </a> </li>
            <li> <a href="configure_proxy.md"> Proxy </a> </li>
            <li> <a href="configure_querycoord.md"> Query coord </a> </li>
            <li> <a href="configure_querynode.md"> Query node </a> </li>
            <li> <a href="configure_indexcoord.md"> Index coord </a> </li>
            <li> <a href="configure_indexnode.md"> Index node </a> </li>
            <li> <a href="configure_datacoord.md"> Data coord </a> </li>
            <li> <a href="configure_datanode.md"> Data node </a> </li>
            <li> <a href="configure_localstorage.md"> Local storage </a> </li>
            <li> <a href="configure_log.md"> Log </a> </li>
            <li> <a href="configure_messagechannel.md"> Message channel </a> </li>
            <li> <a href="configure_common.md"> Common </a> </li>
            <li> <a href="configure_knowhere.md"> Knowhere </a> </li>
            <li> <a href="configure_quota_limits.md"> Quota and Limits </a> </li>
        </ul>
    </td>
  </tr>
</tbody>
</table>

</div>

<div class="filter-purpose table-wrapper">

<table id="purpose">
<thead>
  <tr>
    <th> 目的 </th>
    <th> 参数 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> 性能调优 </td>
    <td>
        <ul>
            <li> <a href="configure_querynode.md#queryNodegracefulTime"> <code> queryNode.gracefulTime </code> </a> </li>
            <li> <a href="configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex"> <code> rootCoord.minSegmentSizeToEnableIndex </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordsegmentmaxSize"> <code> dataCoord.segment.maxSize </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordsegmentsealProportion"> <code> dataCoord.segment.sealProportion </code> </a> </li>
            <li> <a href="configure_datanode.md#dataNodeflushinsertBufSize"> <code> dataNode.flush.insertBufSize </code> </a> </li>
            <li> <a href="configure_querycoord.md#queryCoordautoHandoff"> <code> queryCoord.autoHandoff </code> </a> </li>
            <li> <a href="configure_querycoord.md#queryCoordautoBalance"> <code> queryCoord.autoBalance </code> </a> </li>
            <li> <a href="configure_localstorage.md#localStorageenabled"> <code> localStorage.enabled </code> </a> </li>
        </ul>
    </td>
  </tr>
  <tr>
    <td> 数据和元数据 </td>
    <td>
        <ul>
 





# Milvus Helm Chart Configuration

用于 Milvus Helm Chart 的配置参数列表如下。你可以根据需要修改这些参数以适应你的环境。

## General

- [common.retentionDuration](configure_common.md#commonretentionDuration) - 数据保留时间（以天为单位）。

- [rocksmq.retentionTimeInMinutes](configure_rocksmq.md#rocksmqretentionTimeInMinutes) - RocksMQ 数据保留时间（以分钟为单位）。

- [dataCoord.enableCompaction](configure_datacoord.md#dataCoordenableCompaction) - 是否启用数据协调（DataCoord）的数据整理。

- [dataCoord.enableGarbageCollection](configure_datacoord.md#dataCoordenableGarbageCollection) - 是否启用数据协调（DataCoord）的垃圾回收。

- [dataCoord.gc.dropTolerance](configure_datacoord.md#dataCoordgcdropTolerance) - 从 Meta 上删除数据时数据允许的落差。

## Administration

- [log.level](configure_log.md#loglevel) - 日志级别。

- [log.file.rootPath](configure_log.md#logfilerootPath) - 日志文件的存储路径。

- [log.file.maxAge](configure_log.md#logfilemaxAge) - 日志文件保留的最大天数。

- [minio.accessKeyID](configure_minio.md#minioaccessKeyID) - MinIO 访问密钥 ID。

- [minio.secretAccessKey](configure_minio.md#miniosecretAccessKey) - MinIO 密钥密码。

## Quota and Limits

- [quotaAndLimits.ddl.enabled](configure_quota_limits.md#quotaAndLimitsddlenabled) - 是否启用 DDL 限制策略。

- [quotaAndLimits.ddl.collectionRate](configure_quota_limits.md#quotaAndLimitsddlcollectionRate) - DDL 任务的收集速率。

- [quotaAndLimits.ddl.partitionRate](configure_quota_limits.md#quotaAndLimitsddlpartitionRate) - DDL 任务的分析速率。

- [quotaAndLimits.indexRate.enabled](configure_quota_limits.md#quotaAndLimitsindexRateenabled) - 是否启用索引构建限制策略。

- [quotaAndLimits.indexRate.max](configure_quota_limits.md#quotaAndLimitsindexRatemax) - 索引构建的上限。

- [quotaAndLimits.flushRate.enabled](configure_quota_limits.md#quotaAndLimitsflushRateenabled) - 是否启用数据刷新限制策略。

- [quotaAndLimits.flush.max](configure_quota_limits.md#quotaAndLimitsflushmax) - 数据刷新的上限。

- [quotaAndLimits.compation.enabled](configure_quota_limits.md#quotaAndLimitscompationenabled) - 是否启用数据整理限制策略。

- [quotaAndLimits.compaction.max](configure_quota_limits.md#quotaAndLimitscompactionmax) - 数据整理的上限。

- [quotaAndLimits.dml.enabled](configure_quota_limits.md#quotaAndLimitsdmlenabled) - 是否启用 DML 限制策略。

- [quotaAndLimits.dml.insertRate.max](configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax) - DML 插入操作的上限。

- [quotaAndLimits.dml.deleteRate.max](configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax) - DML 删除操作的上限。

- [quotaAndLimits.dql.enabled](configure_quota_limits.md#quotaAndLimitsdqlenabled) - 是否启用 DQL 限制策略。

- [quotaAndLimits.dql.searchRate.max](configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax) - DQL 搜索操作的上限。

- [quotaAndLimits.dql.queryRate.max](configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax) - DQL 查询操作的上限。

- [quotaAndLimits.limitWriting.ttProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled) - 是否启用数据写入 TT 保护限制策略。

- [quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay) - 数据写入 TT 保护的最大时间 Tick 延迟。

- [quotaAndLimits.limitWriting.memProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled) - 是否启用数据写入内存保护限制策略。

- [quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel) - 数据写入内存保护的数据节点低内存水位。

- [quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel) - 数据写入内存保护的查询节点低内存水位。

- [quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel) - 数据写入内存保护的数据节点高内存水位。

- [quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel) - 数据写入内存保护的查询节点高内存水位。

- [quotaAndLimits.limitWriting.diskProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled) - 是否启用数据写入磁盘保护限制策略。

- [quotaAndLimits.limitWriting.diskProtection.diskQuota](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota) - 数据写入磁盘保护的磁盘配额。

- [quotaAndLimits.limitWriting.forceDeny](configure_quota_limits.md#quotaAndLimitslimitWritingforceDeny) - 是否强制拒绝数据写入。

- [quotaAndLimits.limitReading.queueProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionenabled) - 是否启用数据读取队列保护限制策略。

- [quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionnqInQueueThreshold) - 数据读取队列保护的 NQ 队列中数据的阈值。

- [quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionqueueLatencyThreshold) - 数据读取队列保护的队列延迟阈值。

- [quotaAndLimits.limitReading.resultProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionenabled) - 是否启用数据读取结果保护限制策略。

- [quotaAndLimits.limitReading.resultProtection.maxReadResultRate](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionmaxReadResultRate) - 数据读取结果保护的最大读取结果速率。

- [quotaAndLimits.limitReading.forceDeny](configure_quota_limits.md#quotaAndLimitslimitReadingforceDeny) - 是否强制拒绝数据读取。

对于 Kubernetes 安装的其他参数，请参见 [Milvus Helm Chart Configuration](https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus#configuration)。

### 启动 Milvus

完成配置文件的修改后，你可以使用以下命令启动 Milvus。

```
$ helm upgrade my-release milvus/milvus -f values.yaml
```

## 命令行配置 Milvus

你还可以直接使用 Helm 命令对 Milvus 进行配置。

### 检查可配置参数

在升级之前，你可以使用 Helm chart 检查可配置参数。

```
$ helm show values milvus/milvus
```

### 启动 Milvus

通过在升级命令中添加 `--values` 或 `--set` 来配置并启动 Milvus。

```
# 例如，使用禁用数据整理的设置升级Milvus集群
$ helm upgrade my-release milvus/milvus --set dataCoord.enableCompaction=false
```

## 下一步操作

接下来你可以进行以下操作：



- 如果你想学习如何监控 Milvus 服务并创建警报：
  - 学习 [使用 Prometheus Operator 在 Kubernetes 上监控 Milvus](/adminGuide/monitor/monitor.md)
  - 学习 [在 Grafana 中可视化 Milvus 指标](/adminGuide/monitor/visualize.md)。

- 如果你想了解如何分配资源：
  - [在 Kubernetes 上分配资源](allocate.md#standalone)
 