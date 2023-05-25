
本主题介绍如何使用Helm Charts配置Milvus组件及其第三方依赖项。

In current release, all parameters take effect only after Milvus restarts.

Configure Milvus via configuration file
---------------------------------------

You can configure Milvus with a configuration file `values.yaml`.

### 下载配置文件

[下载](https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml) `values.yaml` 文件，或者使用以下命令下载。

```python
$ wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml

```

### Modify the configuration file

Configure your Milvus instance to suit your application scenarios by adjusting corresponding parameters in `values.yaml`.

Specifically, search for `extraConfigFiles` in `values.yaml` and put your configurations in this section as follows:

```python
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

| Dependencies | Components |
| --- | --- |
| * [etcd](configure_etcd.md)
* [MinIO or S3](configure_minio.md)
* [Pulsar](configure_pulsar.md)
* [RocksMQ](configure_rocksmq.md)
 | * [Root coord](configure_rootcoord.md)
* [Proxy](configure_proxy.md)
* [Query coord](configure_querycoord.md)
* [Query node](configure_querynode.md)
* [Index coord](configure_indexcoord.md)
* [Index node](configure_indexnode.md)
* [Data coord](configure_datacoord.md)
* [Data node](configure_datanode.md)
* [Local storage](configure_localstorage.md)
* [Log](configure_log.md)
* [Message channel](configure_messagechannel.md)
* [Common](configure_common.md)
* [Knowhere](configure_knowhere.md)
* [Quota and Limits](configure_quota_limits.md)
 |

| Purpose | Parameters |
| --- | --- |
| Performance tuning | * [`queryNode.gracefulTime`](configure_querynode.md#queryNodegracefulTime)
* [`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex)
* [`dataCoord.segment.maxSize`](configure_datacoord.md#dataCoordsegmentmaxSize)
* [`dataCoord.segment.sealProportion`](configure_datacoord.md#dataCoordsegmentsealProportion)
* [`dataNode.flush.insertBufSize`](configure_datanode.md#dataNodeflushinsertBufSize)
* [`queryCoord.autoHandoff`](configure_querycoord.md#queryCoordautoHandoff)
* [`queryCoord.autoBalance`](configure_querycoord.md#queryCoordautoBalance)
* [`localStorage.enabled`](configure_localstorage.md#localStorageenabled)
 |
| Data and meta | * [`common.retentionDuration`](configure_common.md#commonretentionDuration)

* [`rocksmq.retentionTimeInMinutes`](configure_rocksmq.md#rocksmqretentionTimeInMinutes)

* [`dataCoord.enableCompaction`](configure_datacoord.md#dataCoordenableCompaction)

* [`dataCoord.enableGarbageCollection`](configure_datacoord.md#dataCoordenableGarbageCollection)

* [`dataCoord.gc.dropTolerance`](configure_datacoord.md#dataCoordgcdropTolerance)
 |
| Administration | * [`log.level`](configure_log.md#loglevel)

* [`log.file.rootPath`](configure_log.md#logfilerootPath)

* [`log.file.maxAge`](configure_log.md#logfilemaxAge)

* [`minio.accessKeyID`](configure_minio.md#minioaccessKeyID)
* [`minio.secretAccessKey`](configure_minio.md#miniosecretAccessKey)
 |
| Quota and Limits | * [`quotaAndLimits.ddl.enabled`](configure_quota_limits.md#quotaAndLimitsddlenabled)
* [`quotaAndLimits.ddl.collectionRate`](configure_quota_limits.md#quotaAndLimitsddlcollectionRate)
* [`quotaAndLimits.ddl.partitionRate`](configure_quota_limits.md#quotaAndLimitsddlpartitionRate)
* [`quotaAndLimits.indexRate.enabled`](configure_quota_limits.md#quotaAndLimitsindexRateenabled)
* [`quotaAndLimits.indexRate.max`](configure_quota_limits.md#quotaAndLimitsindexRatemax)
* [`quotaAndLimits.flushRate.enabled`](configure_quota_limits.md#quotaAndLimitsflushRateenabled)
* [`quotaAndLimits.flush.max`](configure_quota_limits.md#quotaAndLimitsflushmax)
* [`quotaAndLimits.compation.enabled`](configure_quota_limits.md#quotaAndLimitscompationenabled)
* [`quotaAndLimits.compaction.max`](configure_quota_limits.md#quotaAndLimitscompactionmax)
* [`quotaAndLimits.dml.enabled`](configure_quota_limits.md#quotaAndLimitsdmlenabled)
* [`quotaAndLimits.dml.insertRate.max`](configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax)
* [`quotaAndLimits.dml.deleteRate.max`](configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax)
* [`quotaAndLimits.dql.enabled`](configure_quota_limits.md#quotaAndLimitsdqlenabled)
* [`quotaAndLimits.dql.searchRate.max`](configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax)
* [`quotaAndLimits.dql.queryRate.max`](configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax)
* [`quotaAndLimits.limitWriting.ttProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled)
* [`quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay)
* [`quotaAndLimits.limitWriting.memProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled)
* [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel)
* [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel)
* [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel)
* [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel)
* [`quotaAndLimits.limitWriting.diskProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled)
* [`quotaAndLimits.limitWriting.diskProtection.diskQuota`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota)
* [`quotaAndLimits.limitWriting.forceDeny`](configure_quota_limits.md#quotaAndLimitslimitWritingforceDeny)
* [`quotaAndLimits.limitReading.queueProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionenabled)
* [`quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionnqInQueueThreshold)
* [`quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionqueueLatencyThreshold)
* [`quotaAndLimits.limitReading.resultProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionenabled)
* [`quotaAndLimits.limitReading.resultProtection.maxReadResultRate`](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionmaxReadResultRate)
* [`quotaAndLimits.limitReading.forceDeny`](configure_quota_limits.md#quotaAndLimitslimitReadingforceDeny)
 |

对于 Kubernetes 安装的其他参数，请参见[Milvus Helm Chart 配置](https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus#configuration)。

### 启动 Milvus

Having finished modifying the configuration file, you can then start Milvus with the file.

```python
$ helm upgrade my-release milvus/milvus -f values.yaml

```

Configure Milvus via command line
---------------------------------

Alternatively, you can upgrade Milvus configurations directly with the Helm command.

### Check the configurable parameters

Before upgrade, you can check the configurable parameters with Helm charts.

```python
$ helm show values milvus/milvus

```

### Start Milvus

Configure and start Milvus by adding `--values` or `--set` in the command for upgrade.

```python
# For instance, upgrade the Milvus cluster with compaction disabled
$ helm upgrade my-release milvus/milvus --set dataCoord.enableCompaction=false

```

What's next
-----------

* If you want to learn how to monitor the Milvus services and create alerts:

	+ Learn [Monitor Milvus with Prometheus Operator on Kubernetes](monitor.md)
	+ Learn [Visualize Milvus Metrics in Grafana](visualize.md).
* If you are looking for instructions on how to allocate resources:

	+ [Allocate Resources on Kubernetes](allocate.md#standalone)
