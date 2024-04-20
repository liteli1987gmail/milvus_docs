---
id: scale-dependencies.md
title: 扩展依赖
---

# 扩展 Milvus 依赖

Milvus 依赖于各种组件，如 MinIO、Kafka、Pulsar 和 etcd。扩展这些组件可以提高 Milvus 适应不同需求的能力。

对于 Milvus Operator 用户，请同时参考 [Milvus Operator 的依赖管理](manage_dependencies.md)。

## 扩展 MinIO

### 为每个 MinIO pod 增加资源

Milvus 使用的对象存储系统 MinIO 可以为每个 pod 增加 CPU 和内存资源。

```yaml
# new-values.yaml
minio:
  resources:
     limits:
       cpu: 2
       memory: 8Gi
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

您还可以通过手动更改每个 MinIO 持久卷声明（PVC）的 `spec.resources.requests.storage` 值来增加 MinIO 集群的磁盘容量。请注意，您的默认存储类应该允许卷扩展。

### 添加额外的 MinIO 服务器池（推荐）

建议为您的 Milvus 实例添加额外的 MinIO 服务器池。

```yaml
# new-values.yaml
minio:
  zones: 2
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

这将向您的 MinIO 集群添加一个额外的服务器池，允许 Milvus 根据每个服务器池的空闲磁盘容量写入 MinIO 服务器池。例如，如果一组三个池的总空闲空间为 10 TiB，分布在各个池中如下：

|        | 空闲空间 | 写入可能性 |
|--------|------------|------------|
| 池 A  | 3 TiB     | 30% (3/10) |
| 池 B  | 2 TiB     | 20% (2/10) |
| 池 C  | 5 TiB     | 50% (5/10) |

<div class="alert note">

MinIO 不会自动在新的服务器池之间重新平衡对象。如果需要，您可以使用 `mc admin rebalance` 手动启动重新平衡程序。

</div>

## Kafka

### 为每个 Kafka 代理 pod 增加资源

通过调整每个代理 pod 的 CPU 和内存资源来增强 Kafka 代理的容量。

```yaml
# new-values.yaml
kafka:
  resources:
     limits:
        cpu: 2
        memory: 12Gi
```

保存文件后，使用以下命令应用更改：

```bash
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

您还可以通过手动更改每个 Kafka 持久卷声明（PVC）的 `spec.resources.requests.storage` 值来增加 Kafka 集群的磁盘容量。确保您的默认存储类允许卷扩展。

## 添加额外的 Kafka 代理池（推荐）

建议为您的 Milvus 实例添加额外的 Kafka 服务器池。

```yaml
# new-values.yaml
kafka:
  replicaCount: 4
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

这将向您的 Kafka 集群添加一个额外的代理。

<div class="alert note">

Kafka 不会自动在所有代理之间重新平衡主题。如果需要，可以使用 `bin/kafka-reassign-partitions.sh` 在登录到每个 Kafka 代理 pod 后手动重新平衡主题/分区。

</div>

## Pulsar

Pulsar 将计算和存储分开。您可以独立增加 Pulsar 代理（计算）和 Pulsar bookies（存储）的容量。

## 为每个 Pulsar 代理 pod 增加资源

```yaml
# new-values.yaml
pulsar:
  broker:
    resources:
       limits:
         cpu: 4
         memory: 16Gi
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

## 为每个 Pulsar bookie pod 增加资源

```yaml
# new-values.yaml
pulsar:
  bookkeeper:
    resources:
       limits:
         cpu: 4
         memory: 16Gi
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

您还可以通过手动更改每个 Puls