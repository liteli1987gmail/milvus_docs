


# 规模化依赖关系

Milvus 依赖于各种组件，如 MinIO、Kafka、Pulsar 和 etcd。对这些组件进行规模化操作可以增强 Milvus 适应不同需求的能力。

对于 Milvus Operator 用户，请参考 [管理 Milvus Operator 的依赖关系](/adminGuide/manage_dependencies.md)

## 规模化 MinIO

### 增加每个 MinIO pod 的资源

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

你还可以通过手动更改每个 MioIO Persistent Volume Claim（PVC）的 `spec.resources.requests.storage` 值，以增加 MioIO 集群的磁盘容量。请注意，你的默认存储类应允许容量扩展。

### 添加额外的 MinIO 服务器池（推荐）

建议为 Milvus 实例添加额外的 MioIO 服务器池。

```yaml
# new-values.yaml
minio:
  zones: 2
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

这将向你的 MinIO 集群添加一个额外的服务器池，允许 Milvus 根据每个服务器池的空闲磁盘容量向 MinIO 服务器池中写入。例如，如果一个由三个池组成的组具有总共 10 TiB 的自由空间，并分布在以下各个池中：

|        | 剩余空间 | 写入概率 |
|--------|------------|------------------|
| Pool A | 3 TiB      | 30% (3/10)       |
| Pool B | 2 TiB      | 20% (2/10)       |
| Pool C | 5 TiB      | 50% (5/10)       |

<div class="alert note">

MinIO 不会自动在新的服务器池中重新平衡对象。如果需要，你可以手动使用 `mc admin rebalance` 命令启动重新平衡过程。

</div>

## Kafka

### 增加每个 Kafka broker pod 的资源

通过调整每个 broker pod 的 CPU 和内存资源，增强 Kafka broker 的能力。

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

你还可以通过手动更改每个 Kafka Persistent Volume Claim（PVC）的 `spec.resources.requests.storage` 值，以增加 Kafka 集群的磁盘容量。确保你的默认存储类允许卷扩展。

### 添加额外的 Kafka broker 池（推荐）




You are advised to add an extra Kafka server pool for your Milvus instance.

```yaml
# new-values.yaml
kafka:
  replicaCount: 4
```

After saving the file, apply the changes with the following command:

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

This will add an extra broker to your Kafka cluster. 

<div class="alert note">

Kafka does not automatically rebalance topics across all brokers. Manually rebalance topics/partitions across all Kafka brokers using `bin/kafka-reassign-partitions.sh` after logging into each Kafka broker pod if needed.

</div>

## Pulsar

Pulsar separates computation and storage. You can independently increase the capacity of Pulsar brokers (computation) and Pulsar bookies (storage).

## 增加每个 Pulsar broker pod 的资源

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

## 增加每个 Pulsar bookie pod 的资源

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

你还可以通过手动更改每个 Pulsar bookie 的持久卷索取（PVC）的 `spec.resources.requests.storage` 值来增加 Pulsar 集群的磁盘容量。请注意，你的默认存储类应允许卷扩展。

Pulsar bookie pod 有两种类型的存储：`journal` 和 `legers`。对于 `journal` 类型的存储，建议使用 `ssd` 或 `gp3` 作为存储类。

### 添加额外的 Pulsar broker pod

```yaml
# new-values.yaml
pulsar:
  broker:
    replicaCount: 3
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

### 添加额外的 Pulsar bookie pod（推荐）

```yaml
# new-values.yaml
pulsar:
  bookkeeper:
    replicaCount: 3
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

## etcd




### 增加每个 etcd pod 的资源（推荐）

```yaml
# new-values.yaml
etcd:
  resources:
     limits:
       cpu: 2
       memory: 8Gi
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

### 添加额外的 etcd pods






总的 etcd pod 数量应该是奇数。

```yaml
# new-values.yaml
etcd:
  replicaCount: 5
```

保存文件后，使用以下命令应用更改：

```shell
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```
