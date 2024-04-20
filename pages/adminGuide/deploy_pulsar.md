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
    pulsar:
      address: localhost # Pulsar 的地址
      port: 6650 # Pulsar 的端口
      webport: 80 # Pulsar 的 Web 端口，如果直接连接而不需要代理，则应使用 8080
      maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar 中每条消息的最大大小
      tenant: public
      namespace: default    
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
    kafka:
      brokerList:
        -  <your_kafka_address>:<your_kafka_port>
      saslUsername:
      saslPassword:
      saslMechanisms: PLAIN
      securityProtocol: SASL_SSL    
```

2. 配置上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 Kafka 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```

## 使用 Helm 配置 RocksMQ

Milvus 独立模式使用 RocksMQ 作为默认消息存储。有关如何使用 Helm 配置 Milvus 的详细步骤，请参阅 [使用 Helm 图表配置 Milvus](configure-helm.md)。有关 RocksMQ 相关配置项的详细信息，请参阅 [RocksMQ 相关配置](configure_rocksmq.md