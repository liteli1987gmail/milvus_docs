Milvus 使用 Pulsar 或 Kafka 来管理最近更改的日志、输出流日志并提供日志订阅。Pulsar 是默认的消息存储系统。本主题介绍如何使用 Docker Compose 或 Helm 配置消息存储。

您可以使用 [Docker Compose](https://docs.docker.com/get-started/overview/) 或在 K8s 上配置 Pulsar 并在 K8s 上配置 Kafka。

使用 Docker Compose 配置 Pulsar
------------------------

### 1. 配置 Pulsar

要使用 Docker Compose 配置 Pulsar，请在 milvus/configs 路径下的 milvus.yaml 文件中提供 `pulsar` 部分的值。

```
pulsar:
  address: localhost # Pulsar 的地址
  port: 6650 # Pulsar 的端口
  maxMessageSize: 5242880 # 5 * 1024 * 1024 字节，Pulsar 中每个消息的最大长度。

```

有关更多信息，请参阅 [与 Pulsar 相关的配置](configure_pulsar.md)。

### 2. 运行 Milvus

运行以下命令以启动使用 Pulsar 配置的 Milvus。

```
docker-compose up

```

只有在 Milvus 启动后，配置才会生效。有关更多信息，请参阅 [启动 Milvus](https://milvus.io/docs/install_standalone-docker.md#Start-Milvus)。

在 K8s 上配置 Pulsar
-----------------------

（文档未给出配置步骤）

### 在K8s上配置Pulsar

对于在K8s上的Milvus集群，您可以在启动Milvus的同一命令中配置Pulsar。或者，您可以在启动Milvus之前，在[milvus-helm](https://github.com/milvus-io/milvus-helm)存储库中的/charts/milvus路径下使用values.yml文件配置Pulsar。

下表列出了在YAML文件中配置Pulsar的键。

| Key | Description | Value |
| --- | --- | --- |
| `pulsar.enabled` | Enables or disables Pulsar. | `true`/`false` |
| `externalPulsar.enabled` | Enables or disables external Pulsar. | `true`/`false` |
| `externalPulsar.host` | The endpoint to access external Pulsar. |  |
| `externalPulsar.port` | The port to access external Pulsar. |  |

#### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `pulsar` 部分。

```
pulsar:
  enabled: false

```

2. 在 `values.yaml` 文件中使用您的值配置 `externalPulsar` 部分。

```
externalPulsar:
  enabled: true
  host: <your_pulsar_IP>
  port: <your_pulsar_port>

```

3. 在配置完上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 Pulsar 配置的 Milvus。

```
helm install <your_release_name> milvus/milvus -f values.yaml

```

#### 使用命令

运行以下命令，使用您的值安装 Milvus 并配置 Pulsar。

```
helm install <your_release_name> milvus/milvus --set cluster.enabled=true --set pulsar.enabled=false --set externalPulsar.enabled=true --set externalPulsar.host=<your_pulsar_IP> --set externalPulsar.port=<your_pulsar_port>

```

### 在 K8s 上配置 Kafka

对于在 K8s 上的 Milvus 集群，您可以在启动 Milvus 的同一命令中配置 Kafka。或者，在启动 Milvus 之前，您可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库中 /charts/milvus 路径下的 values.yml 文件中配置 Kafka。

以下表格列出了在 YAML 文件中配置 Pulsar 的键。

| Key | Description | Value |
| --- | --- | --- |
| `kafka.enabled` | Enables or disables Kafka. | `true`/`false` |
| `externalKafka.enabled` | Enables or disables external Kafka. | `true`/`false` |
| `externalKafka.brokerlist` | The brokerlist to access external Kafka. |  |

The following table lists the mandatory configurations for external Kafka. Set them in Kafka configurations.

| Key | Description | Value |
| --- | --- | --- |
| `max.request.size` | The maximum size of a request in bytes. | `5242880` |
| `message.max.bytes` | The largest record batch size allowed by Kafka. | `10485760` |
| `auto.create.topics.enable` | Enable auto creation of topic on the server. | `true` |
| `num.partitions` | The default number of log partitions per topic. | `1` |

#### 使用 YAML 文件

1. 如果要使用 Kafka 作为消息存储系统，请在 `values.yaml` 文件中配置 `kafka` 部分。

```
kafka:
  enabled: true
  name: kafka
  replicaCount: 3
  image:
    repository: bitnami/kafka
    tag: 3.1.0-debian-10-r52

```

2. 如果要使用外部 Kafka 作为消息存储系统，请在 `values.yaml` 文件中使用您的值配置 `externalKafka` 部分。

```
externalKafka:
  enabled: true
  brokerList: <your_kafka_IP>:<your_kafka_port>

```

3. 在配置完上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 Kafka 配置的 Milvus。

```
helm install <your_release_name> milvus/milvus -f values.yaml

```

#### 使用命令

要安装 Milvus 并配置 Kafka，请使用您的值运行以下命令。

```
helm install <your_release_name> milvus/milvus --set cluster.enabled=true --set pulsar.enabled=false --set kafka.enabled=true

```

要安装 Milvus 并配置外部 Kafka，请使用您的值运行以下命令。

```
helm install <your_release_name> milvus/milvus --set cluster.enabled=true --set pulsar.enabled=false --set externalKafka.enabled=true --set externalKafka.brokerlist=<your_kafka_IP>:<your_kafka_port>

```

下一步
----------

了解如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：

* [使用 Docker Compose 或 Helm 配置对象存储](deploy_s3.md)
* [使用 Docker Compose 或 Helm 配置元数据存储](deploy_etcd.md)