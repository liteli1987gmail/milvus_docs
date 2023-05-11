
Milvus 中系统配置
===

本主题介绍 Milvus 中系统配置的一般部分。

Milvus 维护了许多参数来配置系统。每个配置都有一个默认值，可以直接使用。您可以灵活地修改这些参数，以便 Milvus 可以更好地服务于您的应用程序。有关更多信息，请参见[配置 Milvus](configure-docker.md)。

In current release, all parameters take effect only after being configured at the startup of Milvus.

章节
--

为了维护方便，Milvus将其配置根据组件、依赖项和一般用途分成了17个部分。

### `etcd`

etcd 是支持 Milvus 元数据存储和访问的元数据引擎。

在此部分下，您可以配置 etcd 端点、相关键前缀等。

请参阅 [与 etcd 相关的配置](configure_etcd.md)，以获取此部分下每个参数的详细说明。

### `minio`

Milvus支持MinIO和Amazon S3作为插入日志文件和索引文件的数据持久化存储引擎。虽然MinIO是S3兼容性的事实标准，但您可以直接在MinIO部分下配置S3参数。

在此部分下，您可以配置MinIO或S3地址、相关访问密钥等。

请参阅[与MinIO相关的配置](configure_minio.md)，了解此部分下每个参数的详细说明。

### `pulsar`

Pulsar是支持Milvus集群可靠存储和发布/订阅消息流的底层引擎。

在这个部分下，您可以配置Pulsar地址、消息大小等。

请参阅[与Pulsar相关的配置](configure_pulsar.md)，以了解此部分下每个参数的详细说明。

### `rocksmq`

RocksMQ 是支持 Milvus 独立版可靠存储和发布/订阅消息流的底层引擎。它是基于 RocksDB 实现的。

在本节中，您可以配置消息大小、保留时间和大小等。

有关此部分下每个参数的详细说明，请参见[RocksMQ 相关配置](configure_rocksmq.md)。

### `rootCoord`

Root coordinator (root coord) handles data definition language (DDL) and data control language (DCL) requests, manages TSO (timestamp Oracle), and publishes time tick messages.

Under this section, you can configure root coord address, index building threshold, etc.

See [Root Coordinator-related Configurations](configure_rootcoord.md) for detailed description for each parameter under this section.

### `proxy`

Proxy 是系统的访问层和用户端点。它验证客户端请求并减少返回的结果。

在这个部分下，您可以配置代理端口、系统限制等等。

有关此部分下每个参数的详细描述，请参见[与代理相关的配置](configure_proxy.md)。

### `queryCoord`

查询协调器（query coord）负责管理查询节点的拓扑结构和负载平衡，以及从增长段切换到封存段的操作。

在此部分下，您可以配置查询协调器地址、自动切换、自动负载平衡等。

有关此部分下每个参数的详细说明，请参阅[查询协调器相关配置](configure_querycoord.md)。

### `queryNode`

查询节点可在增量和历史数据上执行向量和标量数据的混合搜索。

在此部分下，您可以配置查询节点端口、优雅时间等。

有关此部分下每个参数的详细说明，请参阅[查询节点相关配置](configure_querynode.md)。

### `indexCoord`

索引协调器（index coord）管理索引节点的拓扑结构，并维护索引元数据。

在此部分下，您可以配置索引协调器地址等。

有关此部分下每个参数的详细说明，请参见[与索引协调器相关的配置](configure_indexcoord.md)。

### `indexNode`

索引节点为向量建立索引。

在此部分下，您可以配置索引节点端口等信息。

有关此部分下每个参数的详细说明，请参见[与索引节点相关的配置](configure_indexnode.md)。

### `dataCoord`

数据协调器（data coord）负责管理数据节点的拓扑结构，维护元数据，并触发刷新、压缩和其他后台数据操作。

在本节中，您可以配置数据协调器地址、段设置、压缩、垃圾回收等。

有关本节中每个参数的详细说明，请参见[与数据协调器相关的配置](configure_datacoord.md)。

### `dataNode`

数据节点通过订阅日志代理获取增量日志数据，处理突变请求，并将日志数据打包成日志快照并存储在对象存储中。

在本节下，可以配置数据节点端口等。

有关此部分下每个参数的详细说明，请参见[数据节点相关配置](configure_datanode.md)。

### `localStorage`

Milvus将向量数据存储在本地存储器中，以避免重复访问MinIO或S3服务。

在此部分下，您可以启用本地存储，并配置路径等。

有关此部分下每个参数的详细说明，请参见[与本地存储相关的配置](configure_localstorage.md)。

### `log`

使用 Milvus 会生成一组日志。默认情况下，Milvus 使用日志记录标准输出(stdout)和标准错误(stderr)的调试或更高级别的信息。

在此部分下，您可以配置系统日志输出。

请参阅[与日志相关的配置](configure_log.md)，以获取此部分下每个参数的详细说明。

### `msgChannel`

在此部分中，您可以配置消息通道名称前缀和组件订阅名称前缀。

有关此部分下每个参数的详细说明，请参见[相关配置消息通道](configure_messagechannel.md)。

### `common`

在此部分下，您可以配置Milvus的分区和索引的默认名称，以及时间旅行（数据保留）跨度。

有关此部分下每个参数的详细说明，请参见[常规配置](configure_common.md)。

### `knowhere`

[Knowhere](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/knowhere_design.md) 是 Milvus 的搜索引擎。

在本节下，您可以配置系统的默认SIMD指令集类型。

有关此部分下每个参数的详细说明，请参见[与Knowhere相关的配置](configure_knowhere.md)。

常用参数
----

以下是按照修改目的分类的一些常用参数列表。

### 性能调优

以下参数控制了影响索引创建和向量相似度搜索性能的系统行为。

* [`queryNode.gracefulTime`](configure_querynode.md#queryNode.gracefulTime)

* [`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoord.minSegmentSizeToEnableIndex)

* [`dataCoord.segment.maxSize`](configure_datacoord.md#dataCoord.segment.maxSize)

* [`dataCoord.segment.sealProportion`](configure_datacoord.md#dataCoord.segment.sealProportion)

* [`dataNode.flush.insertBufSize`](configure_datanode.md#dataNode.flush.insertBufSize)

* [`queryCoord.autoHandoff`](configure_querycoord.md#queryCoord.autoHandoff)

* [`queryCoord.autoBalance`](configure_querycoord.md#queryCoord.autoBalance)

* [`localStorage.enabled`](configure_localstorage.md#localStorage.enabled)

### 数据和元数据的保留

以下参数控制数据和元数据的保留。

* [`common.retentionDuration`](configure_common.md#common.retentionDuration)

* [`rocksmq.retentionTimeInMinutes`](configure_rocksmq.md#rocksmq.retentionTimeInMinutes)

* [`dataCoord.enableCompaction`](configure_datacoord.md#dataCoord.enableCompaction)

* [`dataCoord.enableGarbageCollection`](configure_datacoord.md#dataCoord.enableGarbageCollection)

* [`dataCoord.gc.dropTolerance`](configure_datacoord.md#dataCoord.gc.dropTolerance)

### 管理

以下参数控制日志输出和对象存储访问。

* [`log.level`](configure_log.md#log.level)

* [`log.file.rootPath`](configure_log.md#log.file.rootPath)

* [`log.file.maxAge`](configure_log.md#log.file.maxAge)

* [`minio.accessKeyID`](configure_minio.md#minio.accessKeyID)

* [`minio.secretAccessKey`](configure_minio.md#minio.secretAccessKey)

### 配额和限制

* [`quotaAndLimits.ddl.enabled`](configure_quota_limits.md#quotaAndLimitsddlenabled)

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

接下来是什么
------

* 在安装之前[配置Milvus](configure-docker.md)

* 了解更多关于Milvus的安装信息：

	+ [安装独立版Milvus](install_standalone-docker.md)
	+ [安装Milvus集群版](install_cluster-docker.md)
