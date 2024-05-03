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

- 如果你用 RocksMQ 启动 Milvus 并想更改它的设置，你可以运行 `helm upgrade -f ` 并在下面的 YAML 文件中修改设置。

- 如果你使用 Helm 独立安装了 Milvus，并使用了 RocksMQ 以外的消息存储空间，但想把它改回 RocksMQ，可以在刷新所有集合并停止 Milvus 后，使用下面的 YAML 文件运行 `helm upgrade -f `。

```yaml
extraConfigFiles：
user.yaml： |+
rocksmq：  # 在 rocksmq 中存储信息的路径 # 请在嵌入式中调整 Milvus: /tmp/milvus/rdb_data path： /var/lib/milvus/rdb_data lrucacheratio: 0.06 # rocksdb 缓存内存比率 rocksmqPageSize: 67108864 # 64 MB，64 * 1024 * 1024 字节，rocksmq 中每页邮件的大小 retentionTimeInMinutes： retentionSizeInMB: 8192 # 8 GB, 8 * 1024 MB, 在 rocksmq 中保存邮件的大小。 compactionInterval: 86400 # 1 day, 每天触发 rocksdb 压缩，删除已删除的数据 # 压缩类型，只支持使用 0、7。 # 压缩类型： [0, 0, 7, 7, 7]
```

<div class="alert warning">

Changing the message store is not recommended. If this is you want to do this, stop all DDL operations, then call the FlushAll API to flush all collections, and finally stop Milvus in the end before you actually change the message store.

</div>

## 使用 Helm 配置 NATS

NATS 是 RocksMQ 的实验性消息存储替代品。关于如何用 Helm 配置 Milvus 的详细步骤，请参阅 [Configure Milvus with Helm Charts](configure-helm.md)。有关 RocksMQ 相关配置项的详情，请参阅 [NATS 相关配置](configure_nats.md)。

- 如果你用 NATS 启动 Milvus 并想更改它的设置，你可以运行 `helm upgrade -f ` 并在下面的 YAML 文件中修改设置。

- 如果使用 NATS 以外的消息存储安装了 Milvus 单机版，并希望将其更改为 NATS，可在刷新所有集合并停止 Milvus 后，使用以下 YAML 文件运行 `helm upgrade -f `。

```yaml
extraConfigFiles:
  user.yaml: |+
    mq:
      type: natsmq
    natsmq:
      # server side configuration for natsmq.
      server: 
        # 4222 by default, Port for nats server listening.
        port: 4222 
        # /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.
        storeDir: /var/lib/milvus/nats 
        # (B) 16GB by default, Maximum size of the 'file' storage.
        maxFileStore: 17179869184 
        # (B) 8MB by default, Maximum number of bytes in a message payload.
        maxPayload: 8388608 
        # (B) 64MB by default, Maximum number of bytes buffered for a connection applies to client connections.
        maxPending: 67108864 
        # (√ms) 4s by default, waiting for initialization of natsmq finished.
        initializeTimeout: 4000 
        monitor:
          # false by default, If true enable debug log messages.
          debug: false 
          # true by default, If set to false, log without timestamps.
          logTime: true 
          # no log file by default, Log file path relative to.. .
          logFile: 
          # (B) 0, unlimited by default, Size in bytes after the log file rolls over to a new one.
          logSizeLimit: 0 
        retention:
          # (min) 3 days by default, Maximum age of any message in the P-channel.
          maxAge: 4320 
          # (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.
          maxBytes:
          # None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.    
          maxMsgs: 
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
