

## 使用 Docker Compose 或 Helm 配置消息存储

Milvus 使用 Pulsar 或 Kafka 来管理最近更改的日志、输出流日志和提供日志订阅。Pulsar 是默认的消息存储系统。本文介绍如何使用 Docker Compose 或 Helm 配置消息存储。

可以使用 [Docker Compose](https://docs.docker.com/get-started/overview/) 或 K8s 来配置 Pulsar，并在 K8s 上配置 Kafka。

## 使用 Docker Compose 配置 Pulsar

### 1. 配置 Pulsar

要使用 Docker Compose 配置 Pulsar，请在 milvus/configs 路径下的 `milvus.yaml` 文件中为 `pulsar` 部分提供你的值。

```
pulsar:
  address: localhost # Pulsar的地址
  port: 6650 # Pulsar的端口
  maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar中每个消息的最大大小。
```

更多信息请参考 [Pulsar 相关配置](/reference/sys_config/configure_pulsar.md)。

### 2. 运行 Milvus

运行以下命令启动使用 Pulsar 配置的 Milvus。

```
docker compose up
```

<div class="alert note"> 只有在 Milvus 启动后配置才会生效。更多信息请参考 <a href=https://milvus.io/docs/install_standalone-docker.md#Start-Milvus> 启动 Milvus </a>。</div>

## 使用 Helm 配置 Pulsar

对于在 K8s 上的 Milvus 集群，可以在启动 Milvus 时使用相同的命令配置 Pulsar。此外，还可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 仓库的/charts/milvus 路径下使用 `values.yml` 文件配置 Pulsar，然后再启动 Milvus。

有关使用 Helm 配置 Milvus 的详细信息，请参考 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。有关 Pulsar 相关配置项的详细信息，请参考 [Pulsar 相关配置](/reference/sys_config/configure_pulsar.md)。

### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `externalConfigFiles` 部分。

```yaml
extraConfigFiles:
  user.yaml: |+
    pulsar:
      address: localhost # Pulsar的地址
      port: 6650 # Pulsar的端口
      webport: 80 # Pulsar的Web端口，如果直接连接而不使用代理，应使用8080
      maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar中每个消息的最大大小。
      tenant: public
      namespace: default    
```

2. 在配置了上述部分并保存了 `values.yaml` 文件后，运行以下命令来安装使用 Pulsar 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```

## 使用 Helm 配置 Kafka

对于在 K8s 上的 Milvus 集群，可以在启动 Milvus 时使用相同的命令配置 Kafka。此外，还可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 仓库的/charts/milvus 路径下使用 `values.yml` 文件配置 Kafka，然后再启动 Milvus。

有关使用 Helm 配置 Milvus 的详细信息，请参考 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。有关 Kafka 相关配置项的详细信息，请参考 [Kafka 相关配置](/reference/sys_config/configure_kafka.md)。

### 使用 YAML 文件

1. 如果要将 Kafka 作为消息存储系统，请在 `values.yaml` 文件中配置 `externalConfigFiles` 部分。

```yaml
extraConfigFiles:
  user.yaml: |+
    kafka:
      brokerList:
        -  <your_kafka_address>:<your_kafka_port>
      saslUsername:
      saslPassword:
      saslMechanisms: PLAIN
      securityProtocol: SASL_SSL    
```

2. 在配置了上述部分并保存了 `values.yaml` 文件后，运行以下命令来安装使用 Kafka 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```

## 使用 Helm 配置 RocksMQ



Milvus standalone 使用 RocksMQ 作为默认的消息存储。有关如何使用 Helm 配置 Milvus 的详细步骤，请参阅 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。有关 RocksMQ 相关的配置项的详细信息，请参阅 [RocksMQ 相关配置](/reference/sys_config/configure_rocksmq.md)。

- 如果你使用 RocksMQ 启动 Milvus 并希望更改其设置，请在下面的 YAML 文件中使用更改后的设置运行 `helm upgrade -f`。

- 如果你已经使用 Helm 将 Milvus standalone 安装为除 RocksMQ 之外的消息存储并希望将其更改回 RocksMQ，请在清空所有集合并停止 Milvus 后，使用以下 YAML 文件运行 `helm upgrade -f`。

```yaml
extraConfigFiles:
  user.yaml: |+
    rocksmq:
      # 消息在rocksmq中存储的路径
      # 在embedded Milvus中调整路径：/tmp/milvus/rdb_data
      path: /var/lib/milvus/rdb_data
      lrucacheratio: 0.06 # rocksdb缓存内存比例
      rocksmqPageSize: 67108864 # 64 MB, 64 * 1024 * 1024字节，rocksmq中每个消息页的大小
      retentionTimeInMinutes: 4320 # 3天，3 * 24 * 60分钟，rocksmq中消息的保留时间。
      retentionSizeInMB: 8192 # 8 GB，8 * 1024 MB，rocksmq中消息的保留大小。
      compactionInterval: 86400 # 1天，每天触发rocksdb压缩，删除已删除的数据
      # 压缩类型，仅支持使用0、7。
      # 0表示不压缩，7表示使用zstd
      # types的长度表示rocksdb级别的数量。
      compressionTypes: [0, 0, 7, 7, 7]    
```

<div class="alert warning">

不建议更改消息存储。如果你确实要更改，请停止所有 DDL 操作，然后调用 FlushAll API 来清空所有集合，在实际更改消息存储之前最后停止 Milvus。

</div>

## 使用 Helm 配置 NATS

NATS 是 RocksMQ 的实验性消息存储替代方案。有关使用 Helm 配置 Milvus 的详细步骤，请参阅 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。有关 NATS 相关的配置项的详细信息，请参阅 [NATS 相关配置](/reference/sys_config/configure_nats.md)。

- 如果你使用 NATS 启动 Milvus 并希望更改其设置，请在下面的 YAML 文件中使用更改后的设置运行 `helm upgrade -f`。

- 如果你已经使用不同于 NATS 的消息存储单独安装了 Milvus 并希望将其更改为 NATS，请在清空所有集合并停止 Milvus 后，使用以下 YAML 文件运行 `helm upgrade -f`。

```yaml
extraConfigFiles:
  user.yaml: |+
    mq:
      type: natsmq
    natsmq:
      # natsmq的服务器端配置。
      server: 
        # 默认为4222，nats服务器监听的端口。
        port: 4222 
        # 默认为/var/lib/milvus/nats，用于nats的JetStream存储目录。
        storeDir: /var/lib/milvus/nats 
        # (B) 默认为16GB，'文件'存储的最大大小。
        maxFileStore: 17179869184 
        # (B) 默认为8MB，消息负载中的最大字节数。
        maxPayload: 8388608 
        # (B) 默认为64MB，连接应用于客户端连接的最大字节数缓冲。
        maxPending: 67108864 
        # (√ms) 默认为4s，等待natsmq初始化完成。
        initializeTimeout: 4000 
        monitor:
          # 默认为false，如果为true，则启用调试日志消息。
          debug: false 
          # 默认为true，如果设置为false，则记录时没有时间戳。
          logTime: true 
          # 默认没有日志文件，相对于..的日志文件路径。。
          logFile: 
          # (B) 默认为0，没有限制，日志文件达到此大小后将滚动到新文件。
          logSizeLimit: 0 
        retention:
          # (min) 默认为3天，P通道中任何消息的最大年龄。
          maxAge: 4320 
          # (B) 默认为无，单个P通道可以包含多少字节。如果P通道超过此大小，则删除最旧的消息。
          maxBytes:
          # 默认为无，单个P通道可能包含多少个消息。如果P通道超过此限制，则删除最旧的消息。    
          maxMsgs: 
```

<div class="alert note">

**在 RocksMQ 和 NATS 之间选择？**

RockMQ 使用 CGO 与 RocksDB 进行交互，并通过自身管理内存，而 Milvus 安装中的纯 Go NATS 将其内存管理委托给 Go 的垃圾收集器（GC）。

在数据包小于 64 KB 的情况下，RocksDB 在内存使用、CPU 使用和响应时间方面优于 NATS。另一方面，如果数据包大于 64 KB，则在具有足够内存和理想 GC 调度的情况下，NATS 在响应时间方面表现出色。

目前，建议仅将 NATS 用于实验。

</div>

## 下一步



了解如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：
- [使用 Docker Compose 或 Helm 配置对象存储](/adminGuide/deploy_s3.md)
- [使用 Docker Compose 或 Helm 配置元数据存储](/adminGuide/deploy_etcd.md)
