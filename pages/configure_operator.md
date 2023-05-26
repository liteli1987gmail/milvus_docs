
配置 Milvus 集群
===

在生产环境中，您需要根据机器类型和工作负载为 Milvus 集群分配资源。您可以在部署期间进行配置，也可以在集群运行时更新配置。

本主题介绍如何在使用 Milvus Operator 安装 Milvus 时配置 Milvus 集群。

本主题假定您已部署 Milvus Operator。有关更多信息，请参见[部署 Milvus Operator](install_cluster-milvusoperator.md)。

使用Milvus Operator配置Milvus集群包括：

* 全局资源配置
* 私有资源配置

私有资源配置将覆盖全局资源配置。如果同时配置全局资源并指定某个组件的私有资源，该组件将优先并首先响应私有配置。

配置全局资源
--------------------------

使用Milvus Operator启动Milvus集群时，需要指定一个配置文件。此处的示例使用默认的配置文件。

```bash
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvus_cluster_default.yaml

```

配置文件的详细信息如下：
```bash
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}

```

字段`spec.components`包括所有Milvus组件的全局和私有资源配置。以下是四个常用字段来配置全局资源。

* `image`：使用的Milvus docker镜像。

* `resources`：分配给每个组件的计算资源。

* `tolerations`和`nodeSelector`：K8s集群中每个Milvus组件的调度规则。有关更多信息，请参见[tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)和[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)。

* `env`：环境变量。

如果您想配置更多字段，请参见文档[此处](https://pkg.go.dev/github.com/milvus-io/milvus-operator/apis/milvus.io/v1beta1#ComponentSpec)。

要为Milvus集群配置全局资源，请创建`milvuscluster_resource.yaml`文件。

### 示例

以下示例为Milvus集群配置全局资源。

```bash
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2.1.0
    nodeSelector: {}
    tolerations: {}
    env: {}
    resources:
      limits:
        cpu: '4'
        memory: 8Gi
      requests:
        cpu: 200m
        memory: 512Mi

```

运行以下命令以应用新配置：

```bash
kubectl apply -f milvuscluster_resource.yaml

```

如果在K8s集群中存在名为`my-release`的Milvus集群，则集群资源将根据配置文件进行更新。否则，将创建一个新的Milvus集群。

配置私有资源
---------------------------

在Milvus 2.0中，Milvus集群原本包括8个组件：proxy、root coord、index coord、data coord、query coord、index node、data node和query node。然而，在Milvus 2.1.0发布时，新的组件mix coord也随之发布。Mix coord包括所有的协调器组件。因此，启动mix coord意味着不需要安装和启动其他的协调器，包括root coord、index coord、data coord和query coord。

用于配置每个组件的常见字段包括：

* `replica`：每个组件的副本数量。
* `port`：每个组件的监听端口号。
* 全局资源配置中使用的4个常用字段：`image`、`env`、`nodeSelector`、`tolerations`、`resources`（见上文）。有关更多可配置的字段，请单击[此文档](https://pkg.go.dev/github.com/milvus-io/milvus-operator/apis/milvus.io/v1beta1#MilvusComponents)中的每个组件。

此外，在配置proxy时，还有一个额外的字段叫做`serviceType`。该字段定义了Milvus在K8s集群中提供的服务类型。

要为特定组件配置资源，请先在`spec.componets`下的字段中添加组件名称，然后配置其私有资源。

[Components or dependencies](#component) [Configuration purposes](#purpose)

以下为Milvus的参数表格和相关说明：

| 依赖项 | 组件 |
| --- | --- |
| * [etcd](configure_etcd.md) <br> * [MinIO或S3](configure_minio.md) <br> * [Pulsar](configure_pulsar.md) <br> * [RocksMQ](configure_rocksmq.md) | * [Root coord](configure_rootcoord.md) <br> * [Proxy](configure_proxy.md) <br> * [Query coord](configure_querycoord.md) <br> * [Query node](configure_querynode.md) <br> * [Index coord](configure_indexcoord.md) <br> * [Index node](configure_indexnode.md) <br> * [Data coord](configure_datacoord.md) <br> * [Data node](configure_datanode.md) <br> * [本地存储](configure_localstorage.md) <br> * [日志](configure_log.md) <br> * [消息通道](configure_messagechannel.md) <br> * [通用](configure_common.md) <br> * [Knowhere](configure_knowhere.md) <br> * [配额和限制](configure_quota_limits.md) | 



| 目的 | 参数 |
| --- | --- |
| 性能调优 Performance tuning| * [`queryNode.gracefulTime`](configure_querynode.md#queryNodegracefulTime) <br> * [`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex) <br> * [`dataCoord.segment.maxSize`](configure_datacoord.md#dataCoordsegmentmaxSize) <br> * [`dataCoord.segment.sealProportion`](configure_datacoord.md#dataCoordsegmentsealProportion) <br> * [`dataNode.flush.insertBufSize`](configure_datanode.md#dataNodeflushinsertBufSize) <br> * [`queryCoord.autoHandoff`](configure_querycoord.md#queryCoordautoHandoff) <br> * [`queryCoord.autoBalance`](configure_querycoord.md#queryCoordautoBalance) <br> * [`localStorage.enabled`](configure_localstorage.md#localStorageenabled) | 
| 数据和元数据 Data and meta| * [`common.retentionDuration`](configure_common.md#commonretentionDuration) <br> * [`rocksmq.retentionTimeInMinutes`](configure_rocksmq.md#rocksmqretentionTimeInMinutes) <br> * [`dataCoord.enableCompaction`](configure_datacoord.md#dataCoordenableCompaction) <br> * [`dataCoord.enableGarbageCollection`](configure_datacoord.md#dataCoordenableGarbageCollection) <br> * [`dataCoord.gc.dropTolerance`](configure_datacoord.md#dataCoordgcdropTolerance) | 
| 管理 Administration| * [`log.level`](configure_log.md#loglevel) <br> * [`log.file.rootPath`](configure_log.md#logfilerootPath) <br> * [`log.file.maxAge`](configure_log.md#logfilemaxAge) <br> * [`minio.accessKeyID`](configure_minio.md#minioaccessKeyID) <br> * [`minio.secretAccessKey`](configure_minio.md#miniosecretAccessKey) | 
| 配额和限制 Quota and Limits| * [`quotaAndLimits.ddl.enabled`](configure_quota_limits.md#quotaAndLimitsddlenabled) <br> * [`quotaAndLimits.ddl.collectionRate`](configure_quota_limits.md#quotaAndLimitsddlcollectionRate) <br> * [`quotaAndLimits.ddl.partitionRate`](configure_quota_limits.md#quotaAndLimitsddlpartitionRate) <br> * [`quotaAndLimits.indexRate.enabled`](configure_quota_limits.md#quotaAndLimitsindexRateenabled) <br> * [`quotaAndLimits.indexRate.max`](configure_quota_limits.md#quotaAndLimitsindexRatemax) <br> * [`quotaAndLimits.flushRate.enabled`](configure_quota_limits.md#quotaAndLimitsflushRateenabled) <br> * [`quotaAndLimits.flush.max`](configure_quota_limits.md#quotaAndLimitsflushmax) <br> * [`quotaAndLimits.compation.enabled`](configure_quota_limits.md#quotaAndLimitscompationenabled) <br> * [`quotaAndLimits.compaction.max`](configure_quota_limits.md#quotaAndLimitscompactionmax) <br> * [`quotaAndLimits.dml.enabled`](configure_quota_limits.md#quotaAndLimitsdmlenabled) <br> * [`quotaAndLimits.dml.insertRate.max`](configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax) <br> * [`quotaAndLimits.dml.deleteRate.max`](configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax) <br> * [`quotaAndLimits.dql.enabled`](configure_quota_limits.md#quotaAndLimitsdqlenabled) <br> * [`quotaAndLimits.dql.searchRate.max`](configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax) <br> * [`quotaAndLimits.dql.queryRate.max`](configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax) <br> * [`quotaAndLimits.limitWriting.ttProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled) <br> * [`quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay`](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay) <br> * [`quotaAndLimits.limitWriting.memProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled) <br> * [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel) <br> * [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel) <br> * [`quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel) <br> * [`quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel`](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel) <br> * [`quotaAndLimits.limitWriting.diskProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled) <br> * [`quotaAndLimits.limitWriting.diskProtection.diskQuota`](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota) <br> * [`quotaAndLimits.limitWriting.forceDeny`](configure_quota_limits.md#quotaAndLimitslimitWritingforceDeny) <br> * [`quotaAndLimits.limitReading.queueProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionenabled) <br> * [`quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionnqInQueueThreshold) <br> * [`quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold`](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionqueueLatencyThreshold) <br> * [`quotaAndLimits.limitReading.resultProtection.enabled`](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionenabled) <br> * [`quotaAndLimits.limitReading.resultProtection.maxReadResultRate`](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionmaxReadResultRate) |





### 示例

以下示例在`milvuscluster.yaml`文件中配置了代理和数据节点的副本和计算资源。

```bash
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2.1.0
    resources:
      limits:
        cpu: '4'
        memory: 8Gi
      requests:
        cpu: 200m
        memory: 512Mi
    rootCoord: 
      replicas: 1
      port: 8080
      resources:
        limits:
          cpu: '6'
          memory: '10Gi'
    dataCoord: {}
    queryCoord: {}
    indexCoord: {}
    dataNode: {}
    indexNode: {}
    queryNode: {}
    proxy:
      replicas: 1
      serviceType: ClusterIP
      resources:
        limits:
          cpu: '2'
          memory: 4Gi
        requests:
          cpu: 100m
          memory: 128Mi
  config: {}
  dependencies: {}

```

该示例不仅配置了全局资源，还为root coord和proxy配置了私有计算资源。使用此配置文件启动Milvus集群时，将应用私有资源配置到root coord和proxy上，而其他组件将遵循全局资源配置。

运行以下命令以应用新配置：

```bash
kubectl apply -f milvuscluster.yaml

```

下一步
---

* 学习如何通过Milvus Operator管理以下Milvus依赖项：
	+ [使用Milvus Operator配置对象存储](object_storage_operator.md)
	+ [使用Milvus Operator配置元数据存储](meta_storage_operator.md)
	+ [使用Milvus Operator配置消息存储](message_storage_operator.md)
