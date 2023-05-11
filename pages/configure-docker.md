
# 使用 Docker Compose 配置 Milvus 组件

本主题介绍如何使用 Docker Compose 配置 Milvus 组件及其第三方依赖。

在当前版本中，所有参数仅在 Milvus 重启后生效。

下载配置文件
------

[直接下载](https://raw.githubusercontent.com/milvus-io/milvus/v2.2.8/configs/milvus.yaml) `milvus.yaml` 或使用以下命令。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus/v2.2.8/configs/milvus.yaml

```

修改配置文件
------

通过调整`milvus.yaml`中的相应参数，配置您的Milvus实例以适应您的应用场景。

查看以下链接，了解每个参数的更多信息。

按以下方式排序：

[组件或依赖项](#component) [配置目的](#purpose)

| Dependencies | Components |
| --- | --- |
| * [etcd](configure_etcd.md)

* [MinIO或S3](configure_minio.md)

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

* [本地存储](configure_localstorage.md)

* [日志](configure_log.md)

* [消息通道](configure_messagechannel.md)

* [通用](configure_common.md)

* [知道哪里](configure_knowhere.md)

* [配额和限制](configure_quota_limits.md)
 |

| Purpose | Parameters |
| --- | --- |
| Performance tuning | * [`queryNode.gracefulTime`查询节点渐进时间](configure_querynode.md#queryNodegracefulTime)

* [`rootCoord.minSegmentSizeToEnableIndex`RootCoord启用索引的最小段大小](configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex)

* [`dataCoord.segment.maxSize`DataCoord段的最大大小](configure_datacoord.md#dataCoordsegmentmaxSize)

* [`dataCoord.segment.sealProportion`DataCoord段封存比例](configure_datacoord.md#dataCoordsegmentsealProportion)

* [`dataNode.flush.insertBufSize`DataNode插入缓冲区大小](configure_datanode.md#dataNodeflushinsertBufSize)

* [`queryCoord.autoHandoff`QueryCoord自动切换](configure_querycoord.md#queryCoordautoHandoff)

* [`queryCoord.autoBalance`QueryCoord自动平衡](configure_querycoord.md#queryCoordautoBalance)

* [`localStorage.enabled`本地存储是否启用](configure_localstorage.md#localStorageenabled)
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

Download an installation file
-----------------------------

Download the installation file for Milvus [standalone](https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml), and save it as `docker-compose.yml`.

You can also simply run the following command.

```
# For Milvus standalone
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml

```

Modify the installation file
----------------------------

In `docker-compose.yml`, add a `volumes` section under each Milvus component, i.e. root coord, data coord, data node, query coord, query node, index coord, index node, and proxy.

Map the local path to your `milvus.yaml` file onto the corresponding docker container paths to the configuration files `/milvus/configs/milvus.yaml` under all `volumes` sections.

```
...
proxy:
    container_name: milvus-proxy
    image: milvusdb/milvus:v2.2.8
    command: ["milvus", "run", "proxy"]
    volumes:       # Add a volumes section.
      - /local/path/to/your/milvus.yaml:/milvus/configs/milvus.yaml   # Map the local path to the container path
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
      PULSAR_ADDRESS: pulsar://pulsar:6650
    ports:
      - "19530:19530"
...

```

Data are stored in the `/volumes` folder according to the default configuration in `docker-compose.yml`. To change the folder to store data, edit `docker-compose.yml` or run `$ export DOCKER_VOLUME_DIRECTORY=`.

Start Milvus
------------

Having finished modifying the configuration file and installation file, you can then start Milvus.

```
$ sudo docker-compose up -d

```

What's next
-----------

* Learn how to manage the following Milvus dependencies with Docker Compose or Helm:
	+ [Configure Object Storage with Docker Compose or Helm](deploy_s3.md)
	+ [Configure Meta Storage with Docker Compose or Helm](deploy_etcd.md)
	+ [Configure Message Storage with Docker Compose or Helm](deploy_pulsar.md)
