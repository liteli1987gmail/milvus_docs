


# Milvus 系统配置清单

本主题介绍 Milvus 系统配置的一般部分。

Milvus 维护了一定数量的参数来配置系统。每个配置都有一个默认值，可以直接使用。你可以灵活修改这些参数，以便 Milvus 可以更好地为你的应用程序服务。有关更多信息，请参见 [配置 Milvus](/adminGuide/configure-docker.md)。

<div class = "alert note">
在当前版本中，只有在 Milvus 启动后配置的所有参数才生效。
</div>

## 部分

为了方便维护，Milvus 根据其组件、依赖项和一般用法将其配置分为 17 个部分。

### `etcd`

etcd 是支持 Milvus 的元数据存储和访问的元数据引擎。

在此部分下，你可以配置 etcd 的端点、相关键前缀等。

有关此部分下每个参数的详细说明，请参见 [与 etcd 相关的配置](/reference/sys_config/configure_etcd.md)。

### `minio`

Milvus 支持 MinIO 和 Amazon S3 作为插入日志文件和索引文件的数据持久化存储引擎。而 MinIO 是 S3 兼容性的事实标准，你可以直接在 MinIO 部分下配置 S3 参数。

在此部分下，你可以配置 MinIO 或 S3 地址、相关访问密钥等。

有关此部分下每个参数的详细说明，请参见 [minio 相关的配置](/reference/sys_config/configure_minio.md)。

### `pulsar`

Pulsar 是支持 Milvus 集群可靠存储和消息流的发布/订阅的底层引擎。

在此部分下，你可以配置 Pulsar 地址、消息大小等。

有关此部分下每个参数的详细说明，请参见 [pulsar 相关的配置](/reference/sys_config/configure_pulsar.md)。

### `rocksmq`

RocksMQ 是支持 Milvus 独立于可靠存储和消息流发布/订阅的底层引擎。它是基于 RocksDB 实现的。

在此部分下，你可以配置消息大小、保留时间和大小等。

有关此部分下每个参数的详细说明，请参见 [RocksMQ 相关配置](/reference/sys_config/configure_rocksmq.md)。

### `nats`

NATS 是一种面向消息的中间件，允许应用程序和服务之间以消息形式进行数据交换。Milvus 使用 NATS 作为可靠存储和消息流的发布/订阅的底层引擎。你可以将其用作 RocksMQ 的替代方案。

在此部分下，你可以配置 NATS 服务器、监视属性以及租用时间和大小等。

有关此部分下每个参数的详细说明，请参见 [NATS 相关的配置](/reference/sys_config/configure_nats.md)。

### `kafka`

Apache Kafka 是一个开源的分布式事件流平台，用于高性能数据管道、流式分析、数据集成和关键应用程序。它用作可靠存储和消息流的发布/订阅的 RocksMQ 和 Pulsar 的替代方案。

有关此部分下每个参数的详细说明，请参见 [kafka 相关的配置](/reference/sys_config/configure_kafka.md)。

### `rootCoord`

根协调器（root coord）处理数据定义语言（DDL）和数据控制语言（DCL）请求，管理 TSO（时间戳 Oracle）并发布时间检测消息。

在此部分下，你可以配置 root coord 地址、索引构建阈值等。

有关此部分下每个参数的详细说明，请参见 [根协调器相关的配置](/reference/sys_config/configure_rootcoord.md)。

### `proxy`

代理是系统的访问层和用户的终点。它验证客户端请求并减少返回的结果。

在此部分下，你可以配置代理端口、系统限制等。

有关此部分下每个参数的详细说明，请参见 [代理相关的配置](/reference/sys_config/configure_proxy.md)。

### `queryCoord`

查询协调器（query coord）管理查询节点的拓扑和负载均衡，以及从增长段到密封段的移交操作。

在此部分下，你可以配置查询协调器地址、自动移交、自动负载均衡等。

有关此部分下每个参数的详细说明，请参见 [查询协调器相关的配置](/reference/sys_config/configure_querycoord.md)。

### `queryNode`



## Query Node

查询节点在增量和历史数据上同时执行向量和标量数据的混合搜索。

在此部分下，你可以配置查询节点端口、优雅时间等。

有关此部分下每个参数的详细描述，请参见 [查询节点相关配置](/reference/sys_config/configure_querynode.md)。

### `indexNode`

索引节点为向量建立索引。

在此部分下，你可以配置索引节点端口等。

有关此部分下每个参数的详细描述，请参见 [索引节点相关配置](/reference/sys_config/configure_indexnode.md)。

### `dataCoord`

数据协调器（数据协调器）管理数据节点的拓扑结构，维护元数据，并触发刷新、压缩和其他后台数据操作。

在此部分下，你可以配置数据协调器地址、段设置、压缩、垃圾回收等。

有关此部分下每个参数的详细描述，请参见 [数据协调器相关配置](/reference/sys_config/configure_datacoord.md)。

### `dataNode`

数据节点通过订阅日志代理检索增量日志数据，处理变更请求，并将日志数据打包成日志快照并存储在对象存储中。

在此部分下，你可以配置数据节点端口等。

有关此部分下每个参数的详细描述，请参见 [数据节点相关配置](/reference/sys_config/configure_datanode.md)。

### `localStorage`

Milvus 在搜索或查询时将向量数据存储在本地存储中，以避免重复访问 MinIO 或 S3 服务。

在此部分下，你可以启用本地存储并配置路径等。

有关此部分下每个参数的详细描述，请参见 [本地存储相关配置](/reference/sys_config/configure_localstorage.md)。

### `log`

使用 Milvus 会生成一系列日志。默认情况下，Milvus 使用日志记录标准输出（stdout）和标准错误（stderr）的调试或更高级别的信息。

在此部分下，你可以配置系统日志输出。

有关此部分下每个参数的详细描述，请参见 [日志相关配置](/reference/sys_config/configure_log.md)。

### `msgChannel`

在此部分下，你可以配置消息通道名称前缀和组件订阅名称前缀。

有关此部分下每个参数的详细描述，请参见 [消息通道相关配置](/reference/sys_config/configure_messagechannel.md)。

### `common`

在此部分下，你可以配置分区和索引的默认名称，以及 Milvus 的时间轮（数据保留）跨度。

有关此部分下每个参数的详细描述，请参见 [通用配置](/reference/sys_config/configure_common.md)。

### `knowhere`

[Knowhere](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/knowhere_design.md) 是 Milvus 的搜索引擎。

在此部分下，你可以配置系统的默认 SIMD 指令集类型。

有关此部分下每个参数的详细描述，请参见 [Knowhere 相关配置](/reference/sys_config/configure_knowhere.md)。

## 经常使用的参数

以下列出了一些经常使用的参数，按照修改目的进行分类。

### 性能优化

以下参数控制影响索引创建和向量相似性搜索性能的系统行为。

- [queryNode.gracefulTime](configure_querynode.md#queryNode.gracefulTime)
- [rootCoord.minSegmentSizeToEnableIndex](configure_rootcoord.md#rootCoord.minSegmentSizeToEnableIndex)
- [dataCoord.segment.maxSize](configure_datacoord.md#dataCoord.segment.maxSize)
- [dataCoord.segment.sealProportion](configure_datacoord.md#dataCoord.segment.sealProportion)
- [dataNode.flush.insertBufSize](configure_datanode.md#dataNode.flush.insertBufSize)
- [queryCoord.autoHandoff](configure_querycoord.md#queryCoord.autoHandoff)
- [queryCoord.autoBalance](configure_querycoord.md#queryCoord.autoBalance)
- [localStorage.enabled](configure_localstorage.md#localStorage.enabled)

### 数据和元数据保留

以下参数控制数据和元数据的保留。

- [common.retentionDuration](configure_common.md#common.retentionDuration)
- [rocksmq.retentionTimeInMinutes](configure_rocksmq.md#rocksmq.retentionTimeInMinutes)
- [dataCoord.enableCompaction](configure_datacoord.md#dataCoord.enableCompaction)
- [dataCoord.enableGarbageCollection](configure_datacoord.md#dataCoord.enableGarbageCollection)
- [dataCoord.gc.dropTolerance](configure_datacoord.md#dataCoord.gc.dropTolerance)

### 管理





以下参数控制日志输出和对象存储访问。

- [log.level](configure_log.md#log.level)
- [log.file.rootPath](configure_log.md#log.file.rootPath)
- [log.file.maxAge](configure_log.md#log.file.maxAge)
- [minio.accessKeyID](configure_minio.md#minio.accessKeyID)
- [minio.secretAccessKey](configure_minio.md#minio.secretAccessKey)

### 配额和限制

- [quotaAndLimits.ddl.enabled](configure_quota_limits.md#quotaAndLimitsddlenabled)
- [quotaAndLimits.ddl.collectionRate](configure_quota_limits.md#quotaAndLimitsddlcollectionRate)
- [quotaAndLimits.ddl.partitionRate](configure_quota_limits.md#quotaAndLimitsddlpartitionRate)
- [quotaAndLimits.indexRate.enabled](configure_quota_limits.md#quotaAndLimitsindexRateenabled)
- [quotaAndLimits.indexRate.max](configure_quota_limits.md#quotaAndLimitsindexRatemax)
- [quotaAndLimits.flushRate.enabled](configure_quota_limits.md#quotaAndLimitsflushRateenabled)
- [quotaAndLimits.flush.max](configure_quota_limits.md#quotaAndLimitsflushmax)
- [quotaAndLimits.compation.enabled](configure_quota_limits.md#quotaAndLimitscompationenabled)
- [quotaAndLimits.compaction.max](configure_quota_limits.md#quotaAndLimitscompactionmax)
- [quotaAndLimits.dml.enabled](configure_quota_limits.md#quotaAndLimitsdmlenabled)
- [quotaAndLimits.dml.insertRate.max](configure_quota_limits.md#quotaAndLimitsdmlinsertRatemax)
- [quotaAndLimits.dml.deleteRate.max](configure_quota_limits.md#quotaAndLimitsdmldeleteRatemax)
- [quotaAndLimits.dql.enabled](configure_quota_limits.md#quotaAndLimitsdqlenabled)
- [quotaAndLimits.dql.searchRate.max](configure_quota_limits.md#quotaAndLimitsdqlsearchRatemax)
- [quotaAndLimits.dql.queryRate.max](configure_quota_limits.md#quotaAndLimitsdqlqueryRatemax)
- [quotaAndLimits.limitWriting.ttProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionenabled)
- [quotaAndLimits.limitWriting.ttProtection.maxTimeTickDelay](configure_quota_limits.md#quotaAndLimitslimitWritingttProtectionmaxTimeTickDelay)
- [quotaAndLimits.limitWriting.memProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionenabled)
- [quotaAndLimits.limitWriting.memProtection.dataNodeMemoryLowWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryLowWaterLevel)
- [quotaAndLimits.limitWriting.memProtection.queryNodeMemoryLowWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryLowWaterLevel)
- [quotaAndLimits.limitWriting.memProtection.dataNodeMemoryHighWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectiondataNodeMemoryHighWaterLevel)
- [quotaAndLimits.limitWriting.memProtection.queryNodeMemoryHighWaterLevel](configure_quota_limits.md#quotaAndLimitslimitWritingmemProtectionqueryNodeMemoryHighWaterLevel)
- [quotaAndLimits.limitWriting.diskProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectionenabled)
- [quotaAndLimits.limitWriting.diskProtection.diskQuota](configure_quota_limits.md#quotaAndLimitslimitWritingdiskProtectiondiskQuota)
- [quotaAndLimits.limitWriting.forceDeny](configure_quota_limits.md#quotaAndLimitslimitWritingforceDeny)
- [quotaAndLimits.limitReading.queueProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionenabled)
- [quotaAndLimits.limitReading.queueProtection.nqInQueueThreshold](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionnqInQueueThreshold)
- [quotaAndLimits.limitReading.queueProtection.queueLatencyThreshold](configure_quota_limits.md#quotaAndLimitslimitReadingqueueProtectionqueueLatencyThreshold)
- [quotaAndLimits.limitReading.resultProtection.enabled](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionenabled)
- [quotaAndLimits.limitReading.resultProtection.maxReadResultRate](configure_quota_limits.md#quotaAndLimitslimitReadingresultProtectionmaxReadResultRate)
- [quotaAndLimits.limitReading.forceDeny](configure_quota_limits.md#quotaAndLimitslimitReadingforceDeny)

## 下一步



- 学习如何在安装之前 [配置 Milvus](/adminGuide/configure-docker.md)。

- 了解更多关于 Milvus 的安装：
  - [安装独立版 Milvus](/getstarted/standalone/install_standalone-docker.md)

