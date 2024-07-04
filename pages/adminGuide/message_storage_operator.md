


# 使用 Milvus Operator 配置消息存储

Milvus 使用 RocksMQ、Pulsar 或 Kafka 来管理最近更改的日志、输出流日志并提供日志订阅。本主题介绍了如何在使用 Milvus Operator 安装 Milvus 时配置消息存储依赖项。有关更多详细信息，请参阅 Milvus Operator 存储库中的 [使用 Milvus Operator 配置消息存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/message-storage.md)。

本主题假设你已部署了 Milvus Operator。

<div class="alert note"> 有关更多信息，请参阅 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md"> 部署 Milvus Operator </a>。 </div>

你需要为使用 Milvus Operator 启动 Milvus 集群指定一个配置文件。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

你只需要编辑 `milvus_cluster_default.yaml` 中的代码模板以配置第三方依赖项。以下各节介绍了如何配置对象存储、etcd 和 Pulsar。

## 开始之前
下表显示了 RocksMQ、NATS、Pulsar 和 Kafka 是否在 Milvus 独立模式和集群模式下支持。

|                 | RocksMQ | NATS   | Pulsar | Kafka |
|:---------------:|:-------:|:------:|:------:|:-----:|
| 独立模式         |    ✔️    |    ✔️   |   ✔️    |   ✔️   |
|   集群模式      |    ✖️    |    ✖️   |   ✔️    |   ✔️   |

对于指定消息存储还存在其他限制：
- 一个 Milvus 实例只支持一个消息存储。但是，我们仍然与为一个实例设置多个消息存储保持向后兼容。优先级如下：
  - 独立模式：RocksMQ（默认）> Pulsar > Kafka
  - 集群模式：Pulsar（默认）> Kafka
  - 2.3 版本引入的 Nats 不参与这些优先级规则以保持向后兼容性。
- 在 Milvus 系统运行时无法更改消息存储。
- 仅支持 Kafka 2.x 或 3.x 版本。

## 配置 RocksMQ
RocksMQ 是 Milvus 独立模式下的默认消息存储。

<div class="alert note">

目前，你只能在 Milvus 独立模式下使用 Milvus Operator 配置 RocksMQ 作为消息存储。

</div>

#### 示例 

以下示例配置了一个 RocksMQ 服务。 

```YAML
apiVersion: milvus.io/v1alpha1
kind: Milvus
metadata:
  name: milvus
spec:
  dependencies: {}
  components: {}
  config: {}
```

## 配置 NATS

NATS 是 NATS 的替代消息存储。

#### 示例



以下示例配置了一个 NATS 服务。

```YAML
apiVersion: milvus.io/v1alpha1
kind: Milvus
metadata:
  name: milvus
spec:
  dependencies: 
    msgStreamType: 'natsmq'
    natsmq:
      # 用于natsmq的服务器端配置。
      server: 
        # 默认为4222，nats服务器监听的端口。
        port: 4222 
        # 默认为/var/lib/milvus/nats，nats的JetStream存储目录。
        storeDir: /var/lib/milvus/nats 
        # 默认为16GB，'file'存储的最大大小。
        maxFileStore: 17179869184 
        # 默认为8MB，消息负载的最大字节数。
        maxPayload: 8388608 
        # 默认为64MB，连接的最大缓冲字节数，适用于客户端连接。
        maxPending: 67108864 
        # 默认为4s，等待natsmq完成初始化的超时时间。
        initializeTimeout: 4000 
        monitor:
          # 默认为false，如果设置为true，则启用调试日志消息。
          debug: false 
          # 默认为true，如果设置为false，则无需时间戳记录日志。
          logTime: true 
          # 默认为空，记录文件的路径。
          logFile: 
          # 默认为0，无限制大小，日志文件达到此大小后将滚动到新文件。
          logSizeLimit: 0 
        retention:
          # 默认为3天，P通道中任何消息的最大保存时间。
          maxAge: 4320 
          # 默认为None，单个P通道可容纳的字节数。如果P通道超过此大小，则删除最旧的消息。
          maxBytes:
          # 默认为None，单个P通道可包含的消息数。如果P通道超过此限制，则删除最旧的消息。
          maxMsgs: 
  components: {}
  config: {}
```

要从 RocksMQ 迁移消息存储到 NATS，请按照以下步骤进行操作：

1. 停止所有 DDL 操作。
2. 调用 FlushAll API，然后在 API 调用执行完成后停止 Milvus。
3. 将 `msgStreamType` 更改为 `natsmq`，并对 `spec.dependencies.natsmq` 中的 NATS 设置进行必要的更改。
4. 再次启动 Milvus 并检查以下内容：

    - 日志中是否存在一条记录 `mqType=natsmq`。
    - 在指定的 `spec.dependencies.natsmq.server.storeDir` 目录中是否存在名为 `jetstream` 的目录。

5. （可选）备份并清理 RocksMQ 存储目录中的数据文件。

<div class="alert note">

**在 RocksMQ 和 NATS 之间进行选择？**

RockMQ 使用 CGO 与 RocksDB 进行交互，并通过自身管理内存，而 Milvus 安装中的纯 Go NATS 将其内存管理委托给 Go 的垃圾收集器（GC）。

在数据包小于 64 kb 的情况下，RocksDB 在内存使用、CPU 使用和响应时间方面表现优异。另一方面，如果数据包大于 64 kb，则在具有足够内存和理想的 GC 调度的情况下，NATS 在响应时间方面表现优异。

目前，建议仅在实验中使用 NATS。

</div>

## 配置 Pulsar

Pulsar 管理最近更改的日志，输出流日志，并提供日志订阅功能。支持在 Milvus 独立模式和 Milvus 集群模式下配置 Pulsar 作为消息存储。但是，在使用 Milvus Operator 时，只能为 Milvus 集群配置 Pulsar 作为消息存储。在 `spec.dependencies.pulsar` 下添加必需的字段来配置 Pulsar。

`pulsar` 支持 `external` 和 `inCluster` 模式。

### 外部 Pulsar

`external` 表示使用外部 Pulsar 服务。
用于配置外部 Pulsar 服务的字段包括：

- `external`： `true` 表示 Milvus 使用外部 Pulsar 服务。
- `endpoints`：Pulsar 的端点。

#### 示例





以下示例配置了一个外部的 Pulsar 服务。

```YAML
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  dependencies: # 可选项
    pulsar: # 可选项    
      # 是否（=true）使用指定字段endpoints中的已存在的外部Pulsar，
      # 或者（=false）在相同Kubernetes集群中为Milvus创建一个新的Pulsar。
      external: true # 可选项，默认为false
      # 如果external=true，则为外部Pulsar的端点
      endpoints:
      - 192.168.1.1:6650
  components: {}
  config: {}           
```

### 内部 Pulsar

`inCluster` 表示在启动 Milvus 集群时，在集群中自动启动 Pulsar 服务。

#### 示例 

以下示例配置了一个内部 Pulsar 服务。

```YAML
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  dependencies:
    pulsar:
      inCluster:
        values:
          components:
            autorecovery: false
          zookeeper:
            replicaCount: 1
          bookkeeper:
            replicaCount: 1
            resoureces:
              limit:
                cpu: '4'
              memory: 8Gi
            requests:
              cpu: 200m
              memory: 512Mi
          broker:
            replicaCount: 1
            configData:
              ## 由于bookkeeper没有持久性而运行，
              ## 启用“autoSkipNonRecoverableData”
              autoSkipNonRecoverableData: "true"
              managedLedgerDefaultEnsembleSize: "1"
              managedLedgerDefaultWriteQuorum: "1"
              managedLedgerDefaultAckQuorum: "1"
          proxy:
            replicaCount: 1
  components: {}
  config: {}            
```

<div class="alert note"> 此示例指定了 Pulsar 每个组件的副本数量、Pulsar BookKeeper 的计算资源以及其他配置项。</div>

<div class="alert note"> 在 <a href="https://artifacthub.io/packages/helm/apache/pulsar/2.7.8?modal=values"> values.yaml </a> 中查找配置内部 Pulsar 服务的完整配置项。根据上述示例，在 <code> pulsar.inCluster.values </code> 下添加所需的配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，执行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 配置 Kafka

在 Milvus 集群中，Pulsar 是默认的消息存储。如果要使用 Kafka，可以添加可选字段 `msgStreamType` 来配置 Kafka。

`kafka` 支持 `external` 和 `inCluster`。

### 外部 Kafka

`external` 表示使用外部的 Kafka 服务。

用于配置外部 Kafka 服务的字段包括：

- `external`：当值为 `true` 时，表示 Milvus 使用外部的 Kafka 服务。
- `brokerList`：用于发送消息的 broker 列表。

#### 示例



以下示例配置外部 Kafka 服务。

```
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  config:
    kafka:
      # securityProtocol支持：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL
      securityProtocol: PLAINTEXT
      # saslMechanisms支持：PLAIN、SCRAM-SHA-256、SCRAM-SHA-512
      saslMechanisms: PLAIN
      saslUsername: ""
      saslPassword: ""
  # 省略其他字段...
  dependencies:
    # 省略其他字段...
    msgStreamType: "kafka"
    kafka:
      external: true
      brokerList: 
        - "kafkaBrokerAddr1:9092"
        - "kafkaBrokerAddr2:9092"
        # ...
```
> SASL 配置在 operator v0.8.5 或更高版本中受支持。

### 内部 Kafka

`inCluster` 表示在启动一个 Milvus 集群时，集群中会自动启动一个 Kafka 服务。

#### 示例

以下示例配置一个内部 Kafka 服务。

```
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec: 
  dependencies:
    msgStreamType: "kafka"
    kafka:
      inCluster: 
        values: {} # 可在https://artifacthub.io/packages/helm/bitnami/kafka中查找values
  components: {}
  config: {}
```

在此处查找配置内部 Kafka 服务的完整配置项 [here](https://artifacthub.io/packages/helm/bitnami/kafka)，根据需求在 `kafka.inCluster.values` 下添加配置项。

假设配置文件名为 `milvuscluster.yaml`，执行以下命令应用配置。

```
kubectl apply -f milvuscluster.yaml
```

## 下一步操作



学习如何使用 Milvus Operator 配置 Milvus 的其他依赖项：

- [使用 Milvus Operator 配置对象存储](/adminGuide/object_storage_operator.md)
- [使用 Milvus Operator 配置元数据存储](/adminGuide/meta_storage_operator.md)