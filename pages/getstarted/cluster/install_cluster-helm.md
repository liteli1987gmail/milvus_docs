---

id: 使用Helm安装Milvus集群.md
label: Helm
related_key: Kubernetes
order: 1
group: 使用MilvusOperator安装Milvus集群.md
summary: 学习如何在Kubernetes上安装Milvus集群。
title: 使用Helm安装Milvus集群

---

{{tab}}

# 使用Helm安装Milvus集群

本主题描述了如何使用Kubernetes安装Milvus独立部署。

## 先决条件

在安装之前，请检查[硬件和软件要求](../prerequisite-helm.md)。

## 创建K8s集群

如果您已经为生产部署了一个K8s集群，可以跳过这一步，直接进行[为Milvus安装Helm Chart](install_cluster-helm.md#为Milvus安装Helm-Chart)。如果没有，您可以按照以下步骤快速创建一个用于测试的K8s，并使用它通过Helm部署Milvus集群。

{{fragments/create_a_k8s_cluster_using_minikube.md}}

minikube在安装时依赖于默认的StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置StorageClass。有关更多信息，请参见[更改默认的StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```bash
$ kubectl get sc
```

```bash
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 检查默认存储类

Milvus依赖于默认存储类来自动为数据持久性配置卷。运行以下命令以检查存储类：

```bash
$ kubectl get sc
```

命令输出应类似于以下内容：

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## 为Milvus安装Helm Chart

Helm是一个K8s包管理器，可以帮助您快速部署Milvus。

1. 添加Milvus Helm仓库。

```bash
$ helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

<div class="alert note">

Milvus Helm Charts仓库在`https://milvus-io.github.io/milvus-helm/`已被归档，您可以按照以下方式从`https://zilliztech.github.io/milvus-helm/`获取进一步更新：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的helm release
helm upgrade my-release zilliztech/milvus
```

归档的仓库仍然适用于4.0.31及以前的版本。对于后续版本，请使用新的仓库。

</div>

2. 更新本地仓库。

```
$ helm repo update
```

## 启动Milvus

安装Helm chart后，您可以在Kubernetes上启动Milvus。在本节中，我们将指导您完成启动Milvus的步骤。

您应该通过指定发布名称、图表和您希望更改的参数来使用Helm启动Milvus。在本指南中，我们使用<code>my-release</code>作为发布名称。如果您使用不同的发布名称，请在以下命令中将<code>my-release</code>替换为您正在使用的名称。

```bash
$ helm install my-release milvus/milvus
```

- 发布名称应仅包含字母、数字和短划线。发布名称中不允许使用句点。
- 默认命令行安装集群版本的Milvus，同时使用Helm安装Milvus。安装Milvus单机版时需要进一步设置。
- 根据<a href="https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-25">Kuberetes的API迁移指南</a>已弃用，PodDisruptionBudget的<b>policy/v1beta1</b>API版本自v1.25起不再使用。建议您迁移清单和API客户端，改用<b>policy/v1</b>API版本<br>对于仍在Kuberetes v1.25及更高版本上使用<b>policy/v1 beta1</b>API版本PodDisruptionBudget的用户，作为一种解决方法，您可以运行以下命令来安装Milvus：<br>
  <code>helm install my release milvus/milvus--set pulsat.bookkeeper.pdb.usePolicy=false，pulsat.broker.pdb.use Policy=false、pulsat.proxy.pdb.usePolicy=false和pulsat.zookeeper.pdb.usePolicy=false</code>
- 请参阅<a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm图表</a>和<a href=”https://helm.sh/docs/“>Helm</a>了解更多信息。

检查正在运行的pods的状态。

```bash
$ kubectl get pods
```

Milvus启动后，`READY` 列显示所有pods的 `1/1`。

```bash
NAME                                             READY  STATUS   RESTARTS  AGE
my-release-etcd-0                                1/1    Running   0        3m23s
my-release-etcd-1                                1/1    Running   0        3m23s
my-release-etcd-2                                1/1    Running   0        3m23s
my-release-milvus-datacoord-6fd4bd885c-gkzwx     1/1    Running   0        3m23s
my-release-milvus-datanode-68cb87dcbd-4khpm      1/1    Running   0        3m23s
my-release-milvus-indexcoord-5bfcf6bdd8-nmh5l    1/1    Running   0        3m23s
my-release-milvus-indexnode-5c5f7b5bd9-l8hjg     1/1    Running   0        3m24s
my-release-milvus-proxy-6bd7f5587-ds2xv          1/1    Running   0        3m24s
my-release-milvus-querycoord-579cd79455-xht5n    1/1    Running   0        3m24s
my-release-milvus-querynode-5cd8fff495-k6gtg     1/1    Running   0        3m24s
my-release-milvus-rootcoord-7fb9488465-dmbbj     1/1    Running   0        3m23s
my-release-minio-0                               1/1    Running   0        3m23s
my-release-minio-1                               1/1    Running   0        3m23s
my-release-minio-2                               1/1    Running   0        3m23s
my-release-minio-3                               1/1    Running   0        3m23s
my-release-pulsar-autorecovery-86f5dbdf77-lchpc  1/1    Running   0        3m24s
my-release-pulsar-bookkeeper-0                   1/1    Running   0        3m23s
my-release-pulsar-bookkeeper-1                   1/1    Running   0        98s
my-release-pulsar-broker-556ff89d4c-2m29m        1/1    Running   0        3m23s
my-release-pulsar-proxy-6fbd75db75-nhg4v         1/1    Running   0        3m23s
my-release-pulsar-zookeeper-0                    1/1    Running   0        3m23s
my-release-pulsar-zookeeper-metadata-98zbr       0/1   Completed  0        3m24s
```

## 连接Milvus

验证Milvus服务器正在侦听哪个本地端口。将pod名称替换为您自己的名称。

```bash
$ kubectl get pod my-release-milvus-proxy-6bd7f5587-ds2xv --template
='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

打开一个新的终端，运行以下命令将本地端口转发到Milvus使用的端口。或者，省略指定的端口，并使用`：19530`让`kubectl`为您分配一个本地端口，这样您就不必管理端口冲突。

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
Forwarding from 127.0.0.1:27017 -> 19530
```

默认情况下，kubectl转发的端口仅在localhost上侦听。如果您希望Milvus服务器侦听选定的IP或所有地址，请使用标志`address`。

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载 Milvus

跑下面这条命令可以卸载 Milvus.

```bash
$ helm uninstall my-release
```

## 停止 K8s 集群

在不删除您创建的资源的情况下 停止群集 和 minikube 虚拟机。

```bash
$ minikube stop
```

运行"minikube start"以重新启动群集。

## 删除 K8s 集群

<div class="alert note">
Run <code>$ kubectl logs `pod_name`</code> to get the <code>stderr</code> log of the pod before deleting the cluster and all resources.
</div>

删除集群、minikube虚拟机以及您创建的所有资源，包括持久卷。

```bash
$ minikube delete
```

## 接下来是什么

安装Milvus后，您可以：

- 检查[Hello-Milvus](example_code.md)，用不同的SDK运行示例代码，看看Milvus能做什么。

- 学习Milvus的基本操作：
  - [连接到Milvus服务器](manage_connection.md)
  - [创建集合](Create_collection.md)
  - [创建分区](Create_partition.md)
  - [插入数据](Insert_data.md)
  - [进行矢量搜索](search.md)

- [使用Helm Chart升级Milvus](Upgrade_Milvus_cluster-Helm.md)。
- [缩放Milvus集群](scaleout.md)。
- 在云上部署您的Milvu集群：
  - [亚马逊EC2](aws.md)
  - [亚马逊EKS](EKS.md)
- 探索[MilvusDM](migrate_overview.md)，这是一个用于在Milvus中导入和导出数据的开源工具。
- [用普罗米修斯监视Milvus](Monitor.md)。
