
本主题介绍如何使用Helm Charts配置Milvus组件及其第三方依赖项。

在当前版本中，所有参数只有在Milvus重新启动后才会生效。

通过配置文件配置Milvus
---------------------------------------

您可以使用配置文件`values.yaml`配置Milvus。

### 下载配置文件

[下载](https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml) `values.yaml` 文件，或者使用以下命令下载。

```bash
$ wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml

```

### 修改配置文件

通过在`values.yaml`中调整相应参数，可以将Milvus实例配置为适合您的应用程序场景。

具体来说，在`values.yaml`中搜索`extraConfigFiles`，并将配置放在该节中，如下所示：

```bash
# Extra configs for milvus.yaml
# If set, this config will merge into milvus.yaml
# Please follow the config structure in the milvus.yaml
# at https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml
# Note: this config will be the top priority which will override the config
# in the image and helm chart.
extraConfigFiles:
  user.yaml: |+
    #    For example to set the graceful time for query nodes
    #    queryNodes:
    #      gracefulTime: 10

```

Check the following links for more information about each parameter.

Sorted by:

[Components or dependencies](#component) [Configuration purposes](#purpose)



| 依赖项 | 组件 |
| --- | --- |
| * [etcd](configure_etcd.md) * [MinIO or S3](configure_minio.md) * [Pulsar](configure_pulsar.md) * [RocksMQ](configure_rocksmq.md) | * [Root coord](configure_rootcoord.md) * [Proxy](configure_proxy.md) * [Query coord](configure_querycoord.md) * [Query node](configure_querynode.md) * [Index coord](configure_indexcoord.md) * [Index node](configure_indexnode.md) * [Data coord](configure_datacoord.md) * [Data node](configure_datanode.md) * [Local storage](configure_localstorage.md) * [Log](configure_log.md) * [Message channel](configure_messagechannel.md) * [Common](configure_common.md) * [Knowhere](configure_knowhere.md) * [Quota and Limits](configure_quota_limits.md) |



| 目的 Purpose | 参数 Parameters |
| --- | --- |
| Performance tuning | * [`queryNode.gracefulTime`](configure_querynode.md#queryNodegracefulTime) * [`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex) * [`dataCoord.segment.maxSize`](configure_datacoord.md#dataCoordsegmentmaxSize) * [`dataCoord.segment.sealProportion`](configure_datacoord.md#dataCoordsegmentsealProportion) * [`dataNode.flush.insertBufSize`](configure_datanode.md#dataNodeflushinsertBufSize) * [`queryCoord.autoHandoff`](configure_querycoord.md#queryCoordautoHandoff) * [`queryCoord.autoBalance`](configure_querycoord.md#queryCoordautoBalance) * [`localStorage.enabled`](configure_localstorage.md#localStorageenabled) |
| Data and meta | * [`common.retentionDuration`](configure_common.md#commonretentionDuration) * [`rocksmq.retentionTimeInMinutes`](configure_rocksmq.md#rocksmqretentionTimeInMinutes) * [`dataCoord.enableCompaction`](configure_datacoord.md#dataCoordenableCompaction) * [`dataCoord.enableGarbageCollection`](configure_datacoord.md#dataCoordenableGarbageCollection) * [`dataCoord.gc.dropTolerance`](configure_datacoord.md#dataCoordgcdropTolerance)|
| Administration | * [`log.level`](configure_log.md#loglevel) * [`log.file.rootPath`](configure_log.md#logfilerootPath) * [`log.file.maxAge`](configure_log.md#logfilemaxAge) * [`minio.accessKeyID`](configure_minio.md#minioaccessKeyID) * [`minio.secretAccessKey`](configure_minio.md#miniosecretAccessKey) |
| Quota and Limits | * [`quotaAndLimits.ddl.enabled`](configure_quota_limits.md#quotaAndLimitsddlenabled) * [`quotaAndLimits.ddl.collectionRate`](configure_quota_limits.md#quotaAndLimitsddlcollectionRate) * [`quotaAndLimits.ddl.partitionRate`](configure_quota_limits.md#quotaAndLimitsddlpartitionRate) * [`quotaAndLimits.indexRate.enabled`](configure_quota_limits.md#quotaAndLimitsindexRateenabled) * [`quotaAndLimits.indexRate.max`](configure_quota_limits.md#quotaAndLimitsindexRatemax) * [`quotaAndLimits.flushRate.enabled`](configure_quota_limits.md#quotaAndLimitsflushRateenabled) * [`quotaAndLimits.flush.max`](configure_quota_limits.md#quotaAndLimitsflushmax) * [`quotaAndLimits.compation.enabled`](configure_quota_limits.md#quotaAndLimitscompationenabled) * [`quotaAndLimits.compaction.max`](configure_quota_limits.md#quotaAndLimitscompactionmax) * [`quotaAndLimits.dml.enabled`](configure_quota_limits.md#quotaAndLimitsdmlenabled) * [`quotaAndLimits.dml.insertRate.max`](configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax) * [`quotaAndLimits.dml.deleteRate.max`](configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax) * [`quotaAndLimits.dql.enabled`](configure_quota_limits.md#quotaAndLimitsdqlenabled) * [`quotaAndLimits.dql.searchRate.max`](configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax) * [`quotaAndLimits.dql.queryRate.max`](configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax) * [`quotaAndLimits.limitWriting.ttProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled) * [`quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay) * [`quotaAndLimits.limitWriting.memProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled) * [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel) * [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel) * [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel) * [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel) * [`quotaAndLimits.limitWriting.diskProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled) * [`quotaAndLimits.limitWriting.diskProtection.diskQuota`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota) * [`quotaAndLimits.limitWriting.forceDeny`](configure_quota_limits

对于 Kubernetes 安装的其他参数，请参见[Milvus Helm Chart 配置](https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus#configuration)。

### 启动 Milvus

完成修改配置文件后，您可以使用该文件启动Milvus。

```bash
$ helm upgrade my-release milvus/milvus -f values.yaml

```

通过命令行配置Milvus
---------------------------------

或者，您可以直接使用Helm命令升级Milvus配置。

### 检查可配置参数

在升级之前，您可以使用Helm图表检查可配置参数。

```bash
$ helm show values milvus/milvus

```

### 启动Milvus

通过在升级命令中添加`--values`或`--set`，对Milvus进行配置和启动。

```bash
# 例如，禁用紧缩功能的Milvus集群升级
$ helm upgrade my-release milvus/milvus --set dataCoord.enableCompaction=false

```

下一步
-----------

* 如果您想学习如何监视Milvus服务并创建警报：

	+ 学习[Kubernetes上使用Prometheus Operator监视Milvus](monitor.md)
	+ 学习[Grafana中可视化Milvus度量信息](visualize.md)。
* 如果您正在寻找有关如何分配资源的说明：

	+ [在Kubernetes上分配资源](allocate.md#standalone)
