


# 缩放 Milvus 集群

Milvus 支持对其组件进行水平缩放。这意味着你可以根据自己的需求增加或减少每种类型的工作节点数量。

本主题介绍了如何缩放 Milvus 集群。我们假设你在缩放之前已经 [安装了 Milvus 集群](/getstarted/cluster/install_cluster-helm.md)。此外，我们建议你在开始之前熟悉一下 [Milvus 架构](/reference/architecture/architecture_overview.md)。

本教程以扩展三个查询节点为例。要扩展其他类型的节点，请在命令行中将 `queryNode` 替换为相应的节点类型。

## 什么是水平缩放？

水平缩放包括缩放扩展和缩放收缩。

### 扩展缩放
扩展缩放是指增加集群中的节点数量。与升级扩展不同，扩展缩放不需要将更多资源分配给集群中的一个节点。相反，扩展缩放通过添加更多节点来水平扩展集群。

![扩展缩放](/assets/scale_out.jpg "扩展缩放说明.")

![升级扩展](/assets/scale_up.jpg "升级扩展说明.")

根据 [Milvus 架构](/reference/architecture/architecture_overview.md)，无状态的工作节点包括查询节点、数据节点、索引节点和代理节点。因此，你可以扩展这些类型的节点以满足业务需求和应用场景。你可以手动或自动扩展 Milvus 集群。

通常情况下，如果你的 Milvus 集群过度使用，你将需要扩展它。以下是一些可能需要扩展 Milvus 集群的典型情况：
- CPU 和内存利用率在一段时间内很高。
- 查询吞吐量变得更高。
- 需要更高的索引速度。
- 需要处理大量大型数据集。
- 需要确保 Milvus 服务的高可用性。

### 收缩缩放
收缩缩放是指减少集群中的节点数量。通常情况下，如果你的 Milvus 集群的利用率较低，你将需要缩小它。以下是一些可能需要缩小 Milvus 集群的典型情况：
- CPU 和内存利用率在一段时间内很低。
- 查询吞吐量变得更低。
- 不需要更快的索引速度。
- 需要处理的数据集的大小较小。

<div class="alert note">
我们不建议大幅度减少工作节点的数量。例如，如果集群中有五个数据节点，我们建议每次减少一个数据节点以确保服务的可用性。如果在首次缩减尝试后服务可用，你可以继续减少数据节点的数量。
</div>

## 先决条件

运行 `kubectl get pods` 命令，获取已创建的 Milvus 集群中的组件及其工作状态的列表。

```
NAME                                            READY   STATUS       RESTARTS   AGE
my-release-etcd-0                               1/1     Running      0          1m
my-release-milvus-datacoord-7b5d84d8c6-rzjml    1/1     Running      0          1m
my-release-milvus-datanode-665d4586b9-525pm     1/1     Running      0          1m
my-release-milvus-indexcoord-9669d5989-kr5cm    1/1     Running      0          1m
my-release-milvus-indexnode-b89cc5756-xbpbn     1/1     Running      0          1m
my-release-milvus-proxy-7cbcc8ffbc-4jn8d        1/1     Running      0          1m
my-release-milvus-pulsar-6b9754c64d-4tg4m       1/1     Running      0          1m
my-release-milvus-querycoord-75f6c789f8-j28bg   1/1     Running      0          1m
my-release-milvus-querynode-7c7779c6f8-pnjzh    1/1     Running      0          1m
my-release-milvus-rootcoord-75585dc57b-cjh87    1/1     Running      0          1m
my-release-minio-5564fbbddc-9sbgv               1/1     Running      0          1m 
```

<div class="alert note">
Milvus 仅支持添加工作节点，并不支持添加协调组件。
</div>

## 缩放 Milvus 集群

你可以手动或自动缩放 Milvus 集群。如果启用了自动缩放功能，则当 CPU 和内存资源消耗达到你设置的值时，Milvus 集群将自动收缩或扩展。

目前，Milvus 2.1.0 仅支持手动缩放。

#### 扩展缩放



使用 "helm upgrade my-release milvus/milvus --set queryNode.replicas = 3 --reuse-values" 手动扩展查询节点。

如果成功，查询节点上将添加三个运行中的 Pod，如以下示例所示。

```
NAME                                            READY   STATUS    RESTARTS   AGE
my-release-etcd-0                               1/1     Running  0          2m
my-release-milvus-datacoord-7b5d84d8c6-rzjml    1/1     Running  0          2m
my-release-milvus-datanode-665d4586b9-525pm     1/1     Running  0          2m
my-release-milvus-indexcoord-9669d5989-kr5cm    1/1     Running  0          2m
my-release-milvus-indexnode-b89cc5756-xbpbn     1/1     Running  0          2m
my-release-milvus-proxy-7cbcc8ffbc-4jn8d        1/1     Running  0          2m
my-release-milvus-pulsar-6b9754c64d-4tg4m       1/1     Running  0          2m
my-release-milvus-querycoord-75f6c789f8-j28bg   1/1     Running  0          2m
my-release-milvus-querynode-7c7779c6f8-czq9f    1/1     Running  0          5s
my-release-milvus-querynode-7c7779c6f8-jcdcn    1/1     Running  0          5s
my-release-milvus-querynode-7c7779c6f8-pnjzh    1/1     Running  0          2m
my-release-milvus-rootcoord-75585dc57b-cjh87    1/1     Running  0          2m
my-release-minio-5564fbbddc-9sbgv               1/1     Running  0          2m
```

#### 缩小规模

使用 `helm upgrade my-release milvus/milvus --set queryNode.replicas=1 --reuse-values` 来缩小查询节点。

如果成功，查询节点上的三个运行中的 Pod 将减少到一个，如以下示例所示。

```
NAME                                            READY   STATUS    RESTARTS   AGE
my-release-etcd-0                               1/1     Running   0          2m
my-release-milvus-datacoord-7b5d84d8c6-rzjml    1/1     Running   0          2m
my-release-milvus-datanode-665d4586b9-525pm     1/1     Running   0          2m
my-release-milvus-indexcoord-9669d5989-kr5cm    1/1     Running   0          2m
my-release-milvus-indexnode-b89cc5756-xbpbn     1/1     Running   0          2m
my-release-milvus-proxy-7cbcc8ffbc-4jn8d        1/1     Running   0          2m
my-release-milvus-pulsar-6b9754c64d-4tg4m       1/1     Running   0          2m
my-release-milvus-querycoord-75f6c789f8-j28bg   1/1     Running   0          2m
my-release-milvus-querynode-7c7779c6f8-pnjzh    1/1     Running   0          2m
my-release-milvus-rootcoord-75585dc57b-cjh87    1/1     Running   0          2m
my-release-minio-5564fbbddc-9sbgv               1/1     Running   0          2m
```

## 下一步
 


- 如果你想了解如何监视 Milvus 服务并创建警报：
  - 学习 [使用 Prometheus Operator 在 Kubernetes 上监视 Milvus](/adminGuide/monitor/monitor.md)

- 如果你准备在云上部署集群：
  - 学习如何使用 Terraform 和 Ansible 在 AWS 上部署 Milvus](aws.md)
  - 学习如何使用 Terraform 在 Amazon EKS 上部署 Milvus](eks.md)
  - 学习如何使用 Kubernetes 在 GCP 上部署 Milvus 集群](gcp.md)
  - 学习如何使用 Kubernetes 在 Microsoft Azure 上部署 Milvus](azure.md)

- 如果你想了解如何分配资源的说明：
  - [在 Kubernetes 上分配资源](allocate.md#standalone)

