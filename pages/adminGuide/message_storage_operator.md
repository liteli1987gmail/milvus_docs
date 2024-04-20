
---
title:  使用 Milvus Operator 配置消息存储
---

# 使用 Milvus Operator 配置消息存储

Milvus 使用 RocksMQ、Pulsar 或 Kafka 来管理最近更改的日志、输出流日志和提供日志订阅。本主题介绍如何在安装 Milvus 时使用 Milvus Operator 配置消息存储依赖项。有关更多详细信息，请参阅 Milvus Operator 存储库中的 [使用 Milvus Operator 配置消息存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/message-storage.md)。

本主题假设您已经部署了 Milvus Operator。

<div class="alert note">有关更多信息，请参见 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md">部署 Milvus Operator</a>。</div>

您需要指定一个配置文件，使用 Milvus Operator 启动 Milvus 集群。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

您只需要编辑 `milvus_cluster_default.yaml` 中的代码模板，以配置第三方依赖项。以下各节分别介绍如何配置对象存储、etcd 和 Pulsar。

## 开始之前
下面的表格显示了 RocksMQ、NATS、Pulsar 和 Kafka 在 Milvus 独立和集群模式中的支持情况。

|                 | RocksMQ | NATS   | Pulsar | Kafka |
|:---------------:|:-------:|:------:|:------:|:-----:|
| 独立模式        |    ✔️    |    ✔️   |   ✔️    |   ✔️   |
|   集群模式       |    ✖️    |    ✖️   |   ✔️    |   ✔️   |

指定消息存储还有一些其他限制：
- 每个 Milvus 实例仅支持一个消息存储。但我们仍然对一个实例设置多个消息存储保持向后兼容性。优先级如下：
  - 独立模式：RocksMQ（默认）> Pulsar > Kafka
  - 集群模式：Pulsar（默认）> Kafka
  - 在 2.3 版本中引入的 Nats 不参与这些优先级规则，以保持向后兼容性。
- Milvus 系统运行时不能更改消息存储。
- 仅支持 Kafka 2.x 或 3.x 版本。

## 配置 RocksMQ
RocksMQ 是 Milvus 独立模式下的默认消息存储。

<div class="alert note">

目前，您只能使用 Milvus Operator 将 RocksMQ 配置为 Milvus 独立的消息存储。

</div>

#### 示例

以下示例配置了 RocksMQ 服务。

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

以下示例配置了 NATS 服务。

```YAML
apiVersion: milvus.io/v1alpha1
kind: Milvus
metadata:
  name: milvus
spec:
  dependencies: 
    msgStreamType: 'natsmq'
    natsmq:
      # 服务器端配置，用于 natsmq。
      server: 
        # 默认为 4222，NATS 服务器侦听的端口。
        port: 4222 
        # 默认为 /var/lib/milvus/nats，用于 JetStream 存储 NATS 的目录。
        storeDir: /var/lib/milvus/nats 
        # 默认为 16GB，'file' 存储的最大大小。
        maxFileStore: 17179869184 
        # 默认为 8MB，消息负载的最大字节数。
        maxPayload: 8388608 
        # 默认为 64MB，适用于客户端连接的缓冲区的最大字节数。
        maxPending: 67108864 
        # 默认为 (√ms) 4s，等待 natsmq 初始化完成。
        initializeTimeout: 4000 
        monitor:
          # 默认为 false，如果为 true 则启用调试日志消息。
          debug: false 
          # 默认为 true，如果设置为 false，则不带时间戳记录日志。
          logTime: true 
          # 默认没有日志文件，日志文件路径相对于 ..。
          logFile: 
          # 默认为 (B) 0，无限制，默认情况下日志文件滚动到新文件后的大小（字节）。
          logSizeLimit: 0 
        retention:
          # 默认为 (min) 3 天，P-channel 中任何消息的最大年龄。
          maxAge: 4320 
          # 默认为 (B