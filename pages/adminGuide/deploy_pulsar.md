---
title: 使用 Docker Compose 或 Helm 配置消息存储
---

# 使用 Docker Compose 或 Helm 配置消息存储

Milvus 使用 Pulsar 或 Kafka 来管理最近更改的日志、输出流日志，并提供日志订阅。Pulsar 是默认的消息存储系统。本主题介绍如何使用 Docker Compose 或 Helm 配置消息存储。

您可以在 K8s 上使用 Docker Compose 配置 Pulsar，并在 K8s 上配置 Kafka。

## 使用 Docker Compose 配置 Pulsar

### 1. 配置 Pulsar

要使用 Docker Compose 配置 Pulsar，请在 milvus/configs 路径下的 `milvus.yaml` 文件的 `pulsar` 部分提供您的值。

```
pulsar:
  address: localhost # Pulsar 的地址
  port: 6650 # Pulsar 的端口
  maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar 中每条消息的最大大小
```

有关更多信息，请参见 [Pulsar 相关配置](configure_pulsar.md)。

### 2. 运行 Milvus

运行以下命令以启动使用 Pulsar 配置的 Milvus。

```
docker compose up
```

<div class="alert note">配置仅在 Milvus 启动后生效。有关更多信息，请参见 <a href=https://milvus.io/docs/install_standalone-docker.md#Start-Milvus>启动 Milvus</a>。</div>

## 使用 Helm 配置 Pulsar

对于 K8s 上的 Milvus 集群，您可以在启动 Milvus 的相同命令中配置 Pulsar。或者，在启动 Milvus 之前，您可以使用 [milvus-helm](https://github.com/milvus-io/milvus-helm) 仓库中 /charts/milvus 路径上的 `values.yml` 文件进行配置。

有关如何使用 Helm 图表配置 Milvus 的详细信息，请参阅 [使用 Helm 图表配置 Milvus](configure-helm.md)。有关 Pulsar 相关配置项的详细信息，请参阅 [Pulsar 相关配置](configure_pulsar.md)。

### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `externalConfigFiles` 部分。

```yaml
extraConfigFiles:
  user.yaml: |+
    pulsar:  address: localhost # Pulsar 的地址  port: 6650 # Pulsar 的端口  webport: 80 # Pulsar 的 Web 端口，如果直接连接而不需要代理，则应使用 8080  maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar 中每条消息的最大大小  tenant: public  namespace: default
```

2. 配置上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 Pulsar 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```

## 使用 Helm 配置 Kafka

对于 K8s 上的 Milvus 集群，您可以在启动 Milvus 的相同命令中配置 Kafka。或者，在启动 Milvus 之前，您可以使用 [milvus-helm](https://github.com/milvus-io/milvus-helm) 仓库中 /charts/milvus 路径上的 `values.yml` 文件进行配置。

有关如何使用 Helm 图表配置 Milvus 的详细信息，请参阅 [使用 Helm 图表配置 Milvus](configure-helm.md)。有关 Pulsar 相关配置项的详细信息，请参阅 [Kafka 相关配置](configure_kafka.md)。

### 使用 YAML 文件

1. 如果您想使用 Kafka 作为消息存储系统，请在 `values.yaml` 文件中配置 `externalConfigFiles` 部分。

```yaml
extraConfigFiles:
  user.yaml: |+
    kafka:  brokerList:    -  <your_kafka_address>:<your_kafka_port>  saslUsername:  saslPassword:  saslMechanisms: PLAIN  securityProtocol: SASL_SSL
```

2. 配置上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 Kafka 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```

## 使用 Helm 配置 RocksMQ

Milvus 独立模式使用 RocksMQ 作为默认消息存储。有关如何使用 Helm 配置 Milvus 的详细步骤，请参阅 [使用 Helm 图表配置 Milvus](configure-helm.md)。有关 RocksMQ 相关配置项的详细信息，请参阅 [RocksMQ 相关配置](configure_rocksmq.md).

- If you start Milvus with RocksMQ and want to change its settings, you can run `helm upgrade -f ` with the changed settings in the following YAML file.

- If you have installed Milvus standalone using Helm with a message store other than RocksMQ and want to change it back to RocksMQ, run `helm upgrade -f ` with the following YAML file after you have flushed all collections and stopped Milvus.

```yaml
extraConfigFiles:
  user.yaml: |+
    rocksmq:  # The path where the message is stored in rocksmq  # please adjust in embedded Milvus: /tmp/milvus/rdb_data  path: /var/lib/milvus/rdb_data  lrucacheratio: 0.06 # rocksdb cache memory ratio  rocksmqPageSize: 67108864 # 64 MB, 64 * 1024 * 1024 bytes, The size of each page of messages in rocksmq  retentionTimeInMinutes: 4320 # 3 days, 3 * 24 * 60 minutes, The retention time of the message in rocksmq.  retentionSizeInMB: 8192 # 8 GB, 8 * 1024 MB, The retention size of the message in rocksmq.  compactionInterval: 86400 # 1 day, trigger rocksdb compaction every day to remove deleted data  # compaction compression type, only support use 0,7.  # 0 means not compress, 7 will use zstd  # len of types means num of rocksdb level.  compressionTypes: [0, 0, 7, 7, 7]
```

<div class="alert warning">

Changing the message store is not recommended. If this is you want to do this, stop all DDL operations, then call the FlushAll API to flush all collections, and finally stop Milvus in the end before you actually change the message store.

</div>

## Configure NATS with Helm

NATS is an experimental message store alternative to RocksMQ. For detailed steps on how to configure Milvus with Helm, refer to [Configure Milvus with Helm Charts](configure-helm.md). For details on RocksMQ-related configuration items, refer to [NATS-related configurations](configure_nats.md).

- If you start Milvus with NATS and want to change its settings, you can run `helm upgrade -f ` with the changed settings in the following YAML file.

- If you have installed Milvus standalone with a message store other than NATS and want to change it to NATS, run `helm upgrade -f ` with the following YAML file after you flushed all collections and stopped Milvus.

```yaml
extraConfigFiles:
  user.yaml: |+
    mq:  type: natsmqnatsmq:  # server side configuration for natsmq.  server:     # 4222 by default, Port for nats server listening.    port: 4222     # /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.    storeDir: /var/lib/milvus/nats     # (B) 16GB by default, Maximum size of the 'file' storage.    maxFileStore: 17179869184     # (B) 8MB by default, Maximum number of bytes in a message payload.    maxPayload: 8388608     # (B) 64MB by default, Maximum number of bytes buffered for a connection applies to client connections.    maxPending: 67108864     # (√ms) 4s by default, waiting for initialization of natsmq finished.    initializeTimeout: 4000     monitor:      # false by default, If true enable debug log messages.      debug: false       # true by default, If set to false, log without timestamps.      logTime: true       # no log file by default, Log file path relative to.. .      logFile:       # (B) 0, unlimited by default, Size in bytes after the log file rolls over to a new one.      logSizeLimit: 0     retention:      # (min) 3 days by default, Maximum age of any message in the P-channel.      maxAge: 4320       # (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.      maxBytes:      # None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.          maxMsgs:
```

<div class="alert note">

**Choose between RocksMQ and NATS?**

RockMQ uses CGO to interact with RocksDB and manages the memory by itself, while the pure-GO NATS embedded in the Milvus installation delegates its memory management to Go's garbage collector (GC).

In the scenario where the data packet is smaller than 64 kb, RocksDB outperforms in terms of memory usage, CPU usage, and response time. On the other hand, if the data packet is greater than 64 kb, NATS excels in terms of response time with sufficient memory and ideal GC scheduling.

Currently, you are advised to use NATS only for experiments.

</div>

## What's next

Learn how to configure other Milvus dependencies with Docker Compose or Helm:

- [Configure Object Storage with Docker Compose or Helm](deploy_s3.md)
- [Configure Meta Storage with Docker Compose or Helm](deploy_etcd.md)
