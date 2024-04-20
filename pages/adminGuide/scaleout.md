---
title:  扩展 Milvus 集群
---

# 扩展 Milvus 集群

Milvus 支持其组件的水平扩展。这意味着您可以根据需要增加或减少每种类型的工作节点数量。

本文介绍如何扩展和缩减 Milvus 集群。我们假设您在扩展之前已经[安装了 Milvus 集群](install_cluster-helm.md)。此外，在开始之前，我们建议您熟悉[Milvus 架构](architecture_overview.md)。

本教程以扩展三个查询节点为例。要扩展其他类型的节点，请在命令行中将 `queryNode` 替换为相应的节点类型。

## 什么是水平扩展？

水平扩展包括扩展和缩减。

### 扩展
扩展是指增加集群中的节点数量。与升级不同，扩展不需要您为集群中的一个节点分配更多资源。相反，扩展通过添加更多节点水平扩展集群。

![扩展](/scale_out.jpg "扩展说明图。")

![升级](/scale_up.jpg "升级说明图。")

根据[Milvus 架构](architecture_overview.md)，无状态工作节点包括查询节点、数据节点、索引节点和代理。因此，您可以根据业务需求和应用场景扩展这些类型的节点。您可以手动或自动扩展 Milvus 集群。

通常，如果创建的 Milvus 集群过载，您将需要扩展 Milvus 集群。以下是您可能需要扩展 Milvus 集群的一些典型情况：
- CPU 和内存使用率长时间处于高位。
- 查询吞吐量增加。
- 需要更高的索引速度。
- 需要处理大量大型数据集。
- 需要确保 Milvus 服务的高可用性。

### 缩减
缩减是指减少集群中的节点数量。通常，如果创建的 Milvus 集群欠载，您将需要缩减 Milvus 集群。以下是您需要缩减 Milvus 集群的一些典型情况：
- CPU 和内存使用率长时间处于低位。
- 查询吞吐量减少。
- 不需要更高的索引速度。
- 要处理的数据集大小较小。

<div class="alert note">
我们不建议大幅度减少工作节点的数量。例如，如果集群中有五个数据节点，我们建议一次减少一个数据节点，以确保服务可用性。如果在第一次缩减尝试后服务可用，您可以继续进一步减少数据节点的数量。</div>

## 先决条件

运行 `kubectl get pods` 以获取您创建的 Milvus 集群中组件及其工作状态的列表。

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
Milvus 仅支持添加工作节点，不支持添加协调者组件。</div>

## 扩展 Milvus 集群

您可以手动或自动地在 Milvus 集群中进行缩减。如果启用了自动扩展，当 CPU 和内存资源消耗达到您设置的值时，Milvus 集群将自动缩小或扩展。

目前，Milvus 2.1.0 仅支持手动扩展和缩减。

#### 扩展

运行 `helm upgrade my-release milvus/milvus --set queryNode.replicas=3 --reuse-values` 手动扩展查询节点。

如果成功，将添加三个运行中的查询节点 pod，如下例所示。

```
NAME                                            READY   STATUS    RESTARTS   AGE
my