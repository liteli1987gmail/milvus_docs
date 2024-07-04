


# 使用 Milvus Operator 配置 Milvus

在生产环境中，你需要根据机器类型和工作负载为 Milvus 集群分配资源。你可以在部署期间进行配置，也可以在集群运行时更新配置。

本文介绍了如何使用 Milvus Operator 安装并配置 Milvus 集群。

本文假设你已经部署了 Milvus Operator。有关更多信息，请参见 [部署 Milvus Operator](/getstarted/cluster/install_cluster-milvusoperator.md)。

配置 Milvus 集群包括以下内容：
- 全局资源配置
- 私有资源配置

<div class="alert note">
私有资源配置将覆盖全局资源配置。如果你在全局配置的同时指定了某个组件的私有资源配置，该组件将优先响应私有配置。
</div>

## 配置全局资源

使用 Milvus Operator 启动 Milvus 集群时，你需要指定一个配置文件。这里的示例使用默认的配置文件。

```yaml
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

配置文件的详细信息如下：

```yaml
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

`spec.components` 字段包括所有 Milvus 组件的全局和私有资源配置。下面是配置全局资源常用的四个字段。
- `image`：使用的 Milvus Docker 镜像。
- `resources`：为每个组件分配的计算资源。
- `tolerations` 和 `nodeSelector`：K8s 集群中每个 Milvus 组件的调度规则。有关更多信息，请参见 [tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) 和 [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)。
- `env`：环境变量。

如果你想配置更多字段，请参考 [此处的文档](https://pkg.go.dev/github.com/zilliztech/milvus-operator/apis/milvus.io/v1beta1#ComponentSpec)。

要为 Milvus 集群配置全局资源，请创建一个名为 `milvuscluster_resource.yaml` 的文件。

### 示例

以下示例为 Milvus 集群配置了全局资源。

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

运行以下命令应用新的配置：

```
kubectl apply -f milvuscluster_resource.yaml
```

<div class="alert note">
如果 K8s 集群中存在名为 <code> my-release </code> 的 Milvus 集群，则将根据配置文件更新集群资源。否则，将创建一个新的 Milvus 集群。
</div>

## 配置私有资源




原始的 Milvus 2.0 中，Milvus 集群包括七个组件：代理（proxy）、根协调器（root coord）、数据协调器（data coord）、查询协调器（query coord）、索引节点（index node）、数据节点（data node）和查询节点（query node）。然而，随着 Milvus 2.1.0 的发布，新增了一个组件，混合协调器（mix coord）。混合协调器包括了所有的协调器组件。因此，启动混合协调器意味着你不需要安装和启动其他协调器，包括根协调器、数据协调器和查询协调器。

用于配置每个组件的常见字段包括：
- `replica`：每个组件的副本数量。
- `port`：每个组件的监听端口号。
- 全局资源配置中常用的四个字段：`image`、`env`、`nodeSelector`、`tolerations`、`resources`（请参考以上内容）。要获取更多可配置字段，请单击 [此文档](https://pkg.go.dev/github.com/zilliztech/milvus-operator/apis/milvus.io/v1beta1#MilvusComponents) 中的每个组件。

<div class="alert note">
另外，配置代理时，还有一个额外的字段叫做 `serviceType`。该字段定义了 Milvus 在 K8s 集群中提供的服务类型。
</div>

要配置特定组件的资源，请首先在 `spec.components` 字段下添加组件名称，然后配置其私有资源。

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
            <li> <a href="configure_rootcoord.md"> 根协调器（Root coord）</a> </li>
            <li> <a href="configure_proxy.md"> 代理（Proxy）</a> </li>
            <li> <a href="configure_querycoord.md"> 查询协调器（Query coord）</a> </li>
            <li> <a href="configure_querynode.md"> 查询节点（Query node）</a> </li>
            <li> <a href="configure_indexcoord.md"> 索引协调器（Index coord）</a> </li>
            <li> <a href="configure_indexnode.md"> 索引节点（Index node）</a> </li>
            <li> <a href="configure_datacoord.md"> 数据协调器（Data coord）</a> </li>
            <li> <a href="configure_datanode.md"> 数据节点（Data node）</a> </li>
            <li> <a href="configure_localstorage.md"> 本地存储（Local storage）</a> </li>
            <li> <a href="configure_log.md"> 日志（Log）</a> </li>
            <li> <a href="configure_messagechannel.md"> 消息通道（Message channel）</a> </li>
            <li> <a href="configure_common.md"> 通用（Common）</a> </li>
            <li> <a href="configure_knowhere.md"> Knowhere </a> </li>
            <li> <a href="configure_quota_limits.md"> 配额和限制（Quota and Limits）</a> </li>
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
            <li> <a href="configure_common.md#commonretentionDuration"> <code> common.retentionDuration </code> </a> </li>
            <li> <a href="configure_rocksmq.md#rocksmqretentionTimeInMinutes"> <code> rocksmq.retentionTimeInMinutes </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordenableCompaction"> <code> dataCoord.enableCompaction </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordenableGarbageCollection"> <code> dataCoord.enableGarbageCollection </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordgcdropTolerance"> <code> dataCoord.gc.dropTolerance </code> </a> </li>
        </ul>
    </td>
  </tr>
 





<table>
<thead>
  <tr>
    <th> 分类 </th>
    <th> 内容 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> 管理 </td>
    <td>
        <ul>
            <li> <a href="configure_log.md#loglevel"> <code> 日志级别 </code> </a> </li>
            <li> <a href="configure_log.md#logfilerootPath"> <code> 日志文件根路径 </code> </a> </li>
            <li> <a href="configure_log.md#logfilemaxAge"> <code> 日志文件最大保存天数 </code> </a> </li>
            <li> <a href="configure_minio.md#minioaccessKeyID"> <code> minio 访问密钥 ID </code> </a> </li>
            <li> <a href="configure_minio.md#miniosecretAccessKey"> <code> minio 访问密钥 </code> </a> </li>
        </ul>
    </td>
  </tr>
  <tr>
    <td> 配额和限制 </td>
    <td>
        <ul>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitsmaxCollectionNumPerDB"> <code> quotaAndLimits.limits.maxCollectionNumPerDB </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsddlenabled"> <code> quotaAndLimits.ddl.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsddlcollectionRate"> <code> quotaAndLimits.ddl.collectionRate </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsddlpartitionRate"> <code> quotaAndLimits.ddl.partitionRate </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsindexRateenabled"> <code> quotaAndLimits.indexRate.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsindexRatemax"> <code> quotaAndLimits.indexRate.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsflushRateenabled"> <code> quotaAndLimits.flushRate.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsflushmax"> <code> quotaAndLimits.flush.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitscompationenabled"> <code> quotaAndLimits.compation.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitscompactionmax"> <code> quotaAndLimits.compaction.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdmlenabled"> <code> quotaAndLimits.dml.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax"> <code> quotaAndLimits.dml.insertRate.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdmlinsertRatecollectionmax"> <code> quotaAndLimits.dml.insertRate.collection.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax"> <code> quotaAndLimits.dml.deleteRate.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdmldeleteRatecollectionmax"> <code> quotaAndLimits.dml.deleteRate.collection.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdqlenabled"> <code> quotaAndLimits.dql.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax"> <code> quotaAndLimits.dql.searchRate.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdqlsearchRatecollectionmax"> <code> quotaAndLimits.dql.searchRate.collection.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax"> <code> quotaAndLimits.dql.queryRate.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitsdqlqueryRatecollectionmax"> <code> quotaAndLimits.dql.queryRate.collection.max </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled"> <code> quotaAndLimits.limitWriting.ttProtection.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay"> <code> quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled"> <code> quotaAndLimits.limitWriting.memProtection.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel"> <code> quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel"> <code> quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel"> <code> quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel"> <code> quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled"> <code> quotaAndLimits.limitWriting.diskProtection.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota"> <code> quotaAndLimits.limitWriting.diskProtection.diskQuota </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuotaPerCollection"> <code> quotaAndLimits.limitWriting.diskProtection.diskQuotaPerCollection </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitWritingforceDeny"> <code> quotaAndLimits.limitWriting.forceDeny </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionenabled"> <code> quotaAndLimits.limitReading.queueProtection.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionnqInQueueThreshold"> <code> quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionqueueLatencyThreshold"> <code> quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionenabled"> <code> quotaAndLimits.limitReading.resultProtection.enabled </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionmaxReadResultRate"> <code> quotaAndLimits.limitReading.resultProtection.maxReadResultRate </code> </a> </li>
            <li> <a href="configure_quota_limits.md#quotaAndLimitslimitReadingforceDeny"> <code> quotaAndLimits.limitReading.forceDeny </code> </a> </li>
        </ul>
    </td>
  </tr>
</tbody>
</table>

</div>

### 示例



我下面列出了在 `milvuscluster.yaml` 文件中配置 proxy 和 datanode 的副本和计算资源的示例。

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: 集群
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

<div class="alert note">
这个示例不仅配置了全局资源，还为 root coord 和 proxy 配置了私有计算资源。在使用此配置文件启动 Milvus 集群时，私有资源配置将应用于 root coord 和 proxy，而其余组件将遵循全局资源配置。
</div>

运行以下命令应用新的配置：

```
kubectl apply -f milvuscluster.yaml
```

## 下一步



学习如何使用 Milvus Operator 管理以下 Milvus 依赖项：
  - [使用 Milvus Operator 配置对象存储](/adminGuide/object_storage_operator.md)
  - [使用 Milvus Operator 配置元数据存储](/adminGuide/meta_storage_operator.md)
  - [使用 Milvus Operator 配置消息存储](/adminGuide/message_storage_operator.md)