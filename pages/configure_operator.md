
配置 Milvus 集群
===

在生产环境中，您需要根据机器类型和工作负载为 Milvus 集群分配资源。您可以在部署期间进行配置，也可以在集群运行时更新配置。

本主题介绍如何在使用 Milvus Operator 安装 Milvus 时配置 Milvus 集群。

本主题假定您已部署 Milvus Operator。有关更多信息，请参见[部署 Milvus Operator](install_cluster-milvusoperator.md)。

Configuring a Milvus cluster with Milvus Operator includes:

* Global resource configurations
* Private resource configurations

Private resource configurations will overwrite global resource configurations. If you configure the resources globally and specify the private resource of a certain component at the same time, the component will prioritize and respond to the private configurations first.

Configure global resources
--------------------------

When using Milvus Operator to start a Milvus cluster, you need to specify a configuration file. The example here uses the default configuration file.

```
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvus_cluster_default.yaml

```

The details of the configuration file is as follows:

```
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

### Example

The following example configures global resource for a Milvus cluster.

```
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

Run the following command to apply new configurations:

```
kubectl apply -f milvuscluster_resource.yaml

```

Cluster resources will be updated according to the configuration file if there is a Milvus cluster named `my-release` in the K8s cluster. Otherwise, a new Milvus cluster will be created.

Configure private resources
---------------------------

Originally in Milvus 2.0, a Milvus cluster includes eight components: proxy, root coord, index coord, data coord, query coord, index node, data node, and query node. However, a new component, mix coord, is released along with Milvus 2.1.0. Mix coord includes all coordinator components. Therefore, starting a mix coord means that you do not need to install and start other coordinators including root coord, index coord, data coord, and query coord.

Common fields used to configure each component include:

* `replica`: The number of replicas of each component.
* `port`: The listen port number of each component.
* The four commonly used fields in global resource configuration: `image`, `env`, `nodeSelector`, `tolerations`, `resources` (see above). For more configurable fields, click on each component in [this documentation](https://pkg.go.dev/github.com/milvus-io/milvus-operator/apis/milvus.io/v1beta1#MilvusComponents).

In addition, when configuring proxy, there is an extra field called `serviceType`. This field defines the type of service Milvus provides in the K8s cluster.

To configure resources for a specific component, add the component name in the field under `spec.componets` first and then configure its private resources.

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

### Example

The example below configures the replicas and compute resources of proxy and datanode in the `milvuscluster.yaml` file.

```
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

This example configures not only global resources but also private compute resources for root coord and proxy. When using this configuration file to start a Milvus cluster, the private resources configurations will be applied to root coord and proxy, while the rest of the components will follow the global resource configuration.

Run the following command to apply new configurations:

```
kubectl apply -f milvuscluster.yaml

```

下一步
---

* 学习如何通过Milvus Operator管理以下Milvus依赖项：
	+ [使用Milvus Operator配置对象存储](object_storage_operator.md)
	+ [使用Milvus Operator配置元数据存储](meta_storage_operator.md)
	+ [使用Milvus Operator配置消息存储](message_storage_operator.md)
