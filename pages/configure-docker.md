
# 使用 Docker Compose 配置 Milvus 组件

本主题介绍如何使用 Docker Compose 配置 Milvus 组件及其第三方依赖。

在当前版本中，所有参数仅在 Milvus 重启后生效。

下载配置文件
------

[直接下载](https://raw.githubusercontent.com/milvus-io/milvus/v2.2.8/configs/milvus.yaml) `milvus.yaml` 或使用以下命令。

```bash
$ wget https://raw.githubusercontent.com/milvus-io/milvus/v2.2.8/configs/milvus.yaml

```

修改配置文件
------

通过调整`milvus.yaml`中的相应参数，配置您的Milvus实例以适应您的应用场景。

查看以下链接，了解每个参数的更多信息。

按以下方式排序：


以下是整理后的表格和相关说明：

| 依赖项 | 组件 |
| --- | --- |
| * [etcd](configure_etcd.md) <br> * [MinIO或S3](configure_minio.md) <br> * [Pulsar](configure_pulsar.md) <br> * [RocksMQ](configure_rocksmq.md) | * [Root coord](configure_rootcoord.md) <br> * [Proxy](configure_proxy.md) <br> * [Query coord](configure_querycoord.md) <br> * [Query node](configure_querynode.md) <br> * [Index coord](configure_indexcoord.md) <br> * [Index node](configure_indexnode.md) <br> * [Data coord](configure_datacoord.md) <br> * [Data node](configure_datanode.md) <br> * [本地存储](configure_localstorage.md) <br> * [日志](configure_log.md) <br> * [消息通道](configure_messagechannel.md) <br> * [通用](configure_common.md) <br> * [知道哪里](configure_knowhere.md) <br> * [配额和限制](configure_quota_limits.md) |

说明：该表格显示了Milvus的依赖项和组件。依赖项包括：etcd、MinIO（或S3）、Pulsar和RocksMQ。有关每个依赖项的配置目的，请参见链接页面。组件包括：Root coord、Proxy、Query coord、Query node、Index coord、Index node、Data coord、Data node、本地存储、日志、消息通道、通用、知道哪里和配额和限制。

| 目的 | 参数 |
| --- | --- |
| 性能调优 | * [`queryNode.gracefulTime`](configure_querynode.md#queryNodegracefulTime) <br> * [`rootCoord.minSegmentSizeToEnableIndex`](configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex) <br> * [`dataCoord.segment.maxSize`](configure_datacoord.md#dataCoordsegmentmaxSize) <br> * [`dataCoord.segment.sealProportion`](configure_datacoord.md#dataCoordsegmentsealProportion) <br> * [`dataNode.flush.insertBufSize`](configure_datanode.md#dataNodeflushinsertBufSize) <br> * [`queryCoord.autoHandoff`](configure_querycoord.md#queryCoordautoHandoff) <br> * [`queryCoord.autoBalance`](configure_querycoord.md#queryCoordautoBalance) <br> * [`localStorage.enabled`](configure_localstorage.md#localStorageenabled) |

说明：该表格列出了Milvus性能调优参数。这些参数包括：`queryNode.gracefulTime`、`rootCoord.minSegmentSizeToEnableIndex`、`dataCoord.segment.maxSize`、`dataCoord.segment.sealProportion`、`dataNode.flush.insertBufSize`、`queryCoord.autoHandoff`、`queryCoord.autoBalance`和`localStorage.enabled`。对于每个参数的详细信息和用法，请参见相应的链接页面。

| 数据和元数据 | 参数 |
| --- | --- |
| * [`common.retentionDuration`](configure_common.md#commonretentionDuration) <br> * [`rocksmq.retentionTimeInMinutes`](configure_rocksmq.md#rocksmqretentionTimeInMinutes) <br> * [`dataCoord.enableCompaction`](configure_datacoord.md#dataCoordenableCompaction) <br> * [`dataCoord.enableGarbageCollection`](configure_datacoord.md#dataCoordenableGarbageCollection) <br> * [`dataCoord.gc.dropTolerance`](configure_datacoord.md#dataCoordgcdropTolerance) | 

说明：该表格列出了与数据和元数据相关的Milvus参数。这些参数包括：`common.retentionDuration`、`rocksmq.retentionTimeInMinutes`、`dataCoord.enableCompaction`、`dataCoord.enableGarbageCollection`和`dataCoord.gc.dropTolerance`。有关每个参数的详细信息和用法，请参见相应的链接页面。

| 管理 | 参数 |
| --- | --- |
| * [`log.level`](configure_log.md#loglevel) <br> * [`log.file.rootPath`](configure_log.md#logfilerootPath) <br> * [`log.file.maxAge`](configure_log.md#logfilemaxAge) <

下载安装文件
-----------------------------

下载Milvus [单机版](https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml)的安装文件，并将其另存为`docker-compose.yml`。

你也可以直接运行以下命令。

```bash
# For Milvus standalone
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml

```

修改安装文件
----------------------------

在`docker-compose.yml`中，为每个Milvus组件添加一个`volumes`部分，即：root coord、data coord、data node、query coord、query node、index coord、index node和proxy。

将本地路径映射到相应的docker容器路径，配置文件`/milvus/configs/milvus.yaml`，在所有`volumes`节下。


```bash
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

根据`docker-compose.yml`中的默认配置，数据存储在`/volumes`文件夹中。要更改存储数据的文件夹，请编辑`docker-compose.yml`或运行`$ export DOCKER_VOLUME_DIRECTORY=`。

启动 Milvus
------------

在完成修改配置文件和安装文件后，您可以启动 Milvus。


```bash
$ sudo docker-compose up -d

```

接下来的步骤
-----------

* 了解如何使用Docker Compose或Helm管理以下Milvus依赖项：
	+ [Configure Object Storage with Docker Compose or Helm](deploy_s3.md)
	+ [Configure Meta Storage with Docker Compose or Helm](deploy_etcd.md)
	+ [Configure Message Storage with Docker Compose or Helm](deploy_pulsar.md)
