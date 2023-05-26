扩展Milvus集群
==========

Milvus支持水平扩展其组件。这意味着您可以根据自己的需求增加或减少每种类型的工作节点。

本主题介绍如何扩展和缩小Milvus集群。我们假设您在扩展之前已经[安装了Milvus集群](install_cluster-helm.md)。此外，在开始之前，我们建议熟悉[Milvus架构](architecture_overview.md)。

本教程以增加三个查询节点为例进行水平扩展。如需对其他类型的节点进行扩展，请在命令行中将“queryNode”替换为相应的节点类型。

什么是水平扩展？
---------------------------

水平扩展包括扩展和收缩。

### 扩展

扩展是指增加集群中的节点数量。与升级不同，扩展不需要向集群中的一个节点分配更多资源。相反，扩展是通过添加更多的节点来水平扩展集群。

[![Scaleout](https://milvus.io/static/174b88b9a22b805739fa08c6961ca56f/0a251/scale_out.jpg "Scaleout illustration.")](https://milvus.io/static/174b88b9a22b805739fa08c6961ca56f/09f71/scale_out.jpg)

Scaleout illustration.

[![Scaleup](https://milvus.io/static/d34823881de95423e1eb82d593b49ab2/0a251/scale_up.jpg "Scaleup illustration.")](https://milvus.io/static/d34823881de95423e1eb82d593b49ab2/09f71/scale_up.jpg)

Scaleup illustration.

根据[Milvus架构](architecture_overview.md)，无状态的工作节点包括查询节点、数据节点、索引节点和代理。因此，您可以根据业务需求和应用场景扩展这些类型的节点。您可以手动或自动扩展Milvus集群。

通常情况下，如果您创建的Milvus集群超负荷使用，您需要进行扩展。以下是您可能需要扩展Milvus集群的一些典型情况：

* CPU和内存利用率在一段时间内很高。

* 查询吞吐量变得更高了。

* 需要更高速度的索引。

* 需要处理大量大型数据集。

* 需要确保Milvus服务的高可用性。

### 缩小规模

缩容是指减少集群中节点的数量。一般来说，如果Milvus集群处于低利用率状态，您需要缩小它。以下是一些Typical情况，您需要缩小Milvus集群：

* 一段时间内CPU和内存利用率较低。

* 查询吞吐量变低。

* 不需要更高速度的索引。

* 要处理的数据集较小。

我们不推荐大幅度减少worker节点的数量。例如，如果集群中有五个数据节点，我们建议一次只减少一个数据节点，以确保服务可用性。如果在第一次缩容尝试后服务仍然可用，则可以继续进一步减少数据节点的数量。

先决条件
----

运行`kubectl get pods`获取您创建的Milvus集群中组件及其工作状态的列表。

```bash
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

Milvus仅支持添加Worker节点，不支持添加协调者组件。

扩展 Milvus 集群
------------

您可以手动或自动缩放 Milvus 集群。如果启用了自动缩放，当 CPU 和内存资源消耗达到您设置的值时，Milvus 集群将自动收缩或扩展。

目前，Milvus 2.1.0 仅支持手动缩放。

#### 扩展

执行 `helm upgrade my-release milvus/milvus --set queryNode.replicas=3 --reuse-values` 命令手动扩展查询节点。

如果成功，将会添加三个正在运行的查询节点Pods，如以下示例所示。

```bash
NAME                                            READY   STATUS    RESTARTS   AGE
my-release-etcd-0                               1/1     Running   0          2m
my-release-milvus-datacoord-7b5d84d8c6-rzjml    1/1     Running   0          2m
my-release-milvus-datanode-665d4586b9-525pm     1/1     Running   0          2m
my-release-milvus-indexcoord-9669d5989-kr5cm    1/1     Running   0          2m
my-release-milvus-indexnode-b89cc5756-xbpbn     1/1     Running   0          2m
my-release-milvus-proxy-7cbcc8ffbc-4jn8d        1/1     Running   0          2m
my-release-milvus-pulsar-6b9754c64d-4tg4m       1/1     Running   0          2m
my-release-milvus-querycoord-75f6c789f8-j28bg   1/1     Running   0          2m
my-release-milvus-querynode-7c7779c6f8-czq9f    1/1     Running   0          5s
my-release-milvus-querynode-7c7779c6f8-jcdcn    1/1     Running   0          5s
my-release-milvus-querynode-7c7779c6f8-pnjzh    1/1     Running   0          2m
my-release-milvus-rootcoord-75585dc57b-cjh87    1/1     Running   0          2m
my-release-minio-5564fbbddc-9sbgv               1/1     Running   0          2m

```

#### 缩小规模

运行`helm upgrade my-release milvus/milvus --set queryNode.replicas=1 --reuse-values`以缩小查询节点的规模。

如果成功，查询节点上的三个运行中的pod将减少为一个，如下面的示例所示。

```bash
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

下一步
---

* 如果您想学习如何监控Milvus服务并创建警报：

	+ 学习[在Kubernetes上使用Prometheus Operator监控Milvus](monitor.md)

* 如果您准备在云上部署您的集群：

	+ 学习如何使用Terraform和Ansible在AWS上部署Milvus：[在AWS上部署Milvus](aws.md)
	+ 学习如何使用Terraform在Amazon EKS上部署Milvus：[在Amazon EKS上部署Milvus](eks.md)
	+ 学习如何使用Kubernetes在GCP上部署Milvus集群：[在GCP上部署Milvus集群](gcp.md)
	+ 学习如何使用Kubernetes在Microsoft Azure上部署Milvus：[在Microsoft Azure上部署Milvus](azure.md)

* 如果您正在寻找如何分配资源的说明：

	+ [在Kubernetes上分配资源](allocate.md#standalone)
