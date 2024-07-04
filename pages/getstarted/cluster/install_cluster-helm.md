


# 使用 Helm 安装 Milvus 集群

这个主题介绍了如何使用 Kubernetes 安装 Milvus 的独立版本。

## 准备条件

在安装之前，请先检查硬件和软件 [要求](/getstarted/prerequisite-helm.md)。

## 创建一个 K8s 集群

如果你已经为生产部署了 K8s 集群，可以跳过此步骤，直接进入 [安装 Milvus 的 Helm 图表](install_cluster-helm.md#Install-Helm-Chart-for-Milvus)。否则，你可以按照以下步骤快速创建一个用于测试的 K8s 集群，然后使用它来部署一个 Milvus 集群。

{{fragments/create_a_k8s_cluster_using_minikube.md}}

当安装 minikube 时，默认会有一个对 default StorageClass 的依赖。使用以下命令检查依赖关系。其他安装方法需要手动配置 StorageClass。有关更多信息，请参阅 [更改默认的 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```
$ kubectl get sc
```

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 检查默认的存储类别

Milvus 在自动为数据持久化提供卷时，依赖于默认的存储类别。运行以下命令检查存储类别：

```bash
$ kubectl get sc
```

命令输出应类似于以下内容：

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## 安装 Milvus 的 Helm 图表

Helm 是一个 K8s 包管理器，可以帮助你快速部署 Milvus。

1. 添加 Milvus 的 Helm 存储库。

```
$ helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

<div class="alert note">

Milvus 的 Helm Charts 存储库 `https://milvus-io.github.io/milvus-helm/` 已归档，你可以从 `https://zilliztech.github.io/milvus-helm/` 获取进一步的更新，具体操作如下：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的helm release
helm upgrade my-release zilliztech/milvus
```

归档的存储库仍可用于 4.0.31 之前的版本。对于更新的版本，请使用新的存储库。

</div>

2. 更新本地图表。

```
$ helm repo update
```

## 启动 Milvus





一旦你安装了 Helm 图表，你可以在 Kubernetes 上启动 Milvus。在本节中，我们将指导你完成启动 Milvus 的步骤。

你应该通过指定发布名称、图表和预期更改的参数来使用 Helm 启动 Milvus。在本指南中，我们使用 <code> my-release </code> 作为发布名称。要使用不同的发布名称，请将下面的命令中的 <code> my-release </code> 替换为你正在使用的命令。

```
$ helm install my-release milvus/milvus
```

<div class="alert note">
  <ul>
    <li> 发布名称只能包含字母、数字和连字符。发布名称中不允许使用句点。</li>
    <li> 在使用 Helm 安装 Milvus 时，默认命令行安装的是 Milvus 的集群版本。在安装 Milvus 时需要进一步进行设置，以安装 Milvus 的独立版本。</li>
    <li> 根据 Kubernetes 的 <a href="https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-25"> 弃用的 API 迁移指南 </a>，从 v1.25 开始，PodDisruptionBudget 的 API 版本 <b> policy/v1beta1 </b> 不再提供服务。建议你将清单和 API 客户端迁移到使用 <b> policy/v1 </b> API 版本。 <br> 作为在 Kubernetes v1.25 及更高版本上仍然使用 PodDisruptionBudget 的 <b> policy/v1beta1 </b> API 版本的用户的解决方法，你可以使用以下命令安装 Milvus：<br>
    <code> helm install my-release milvus/milvus --set pulsar.bookkeeper.pdb.usePolicy = false, pulsar.broker.pdb.usePolicy = false, pulsar.proxy.pdb.usePolicy = false, pulsar.zookeeper.pdb.usePolicy = false </code> </li>
    <li> 有关更多信息，请参见 <a href="https://artifacthub.io/packages/helm/milvus/milvus"> Milvus Helm 图表 </a> 和 <a href="https://helm.sh/docs/"> Helm </a>。</li>
  </ul>
</div>

检查运行的 pod 的状态。

```
$ kubectl get pods
```

Milvus 启动后，所有 pod 的 `READY` 列将显示为 `1/1`。

```
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

## 连接到 Milvus

验证 Milvus 服务器侦听的本地端口。将 pod 名称替换为你自己的名称。

```bash
$ kubectl get pod my-release-milvus-proxy-6bd7f5587-ds2xv --template
='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

打开一个新的终端并运行以下命令，将本地端口转发到 Milvus 使用的端口。可选地，省略指定的端口并使用 `:19530`，让 `kubectl` 为你分配一个本地端口，这样你就不必管理端口冲突。

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
Forwarding from 127.0.0.1:27017 -> 19530
```

默认情况下，kubectl 转发的端口仅在本地主机上侦听。如果希望 Milvus 服务器侦听所选的 IP 或所有地址，请使用 `address` 标志。

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载 Milvus

运行以下命令以卸载 Milvus。

```bash
$ helm uninstall my-release
```

## 停止 K8s 集群

停止集群和 minikube 虚拟机，而不删除你创建的资源。

```bash
$ minikube stop
```

运行 `minikube start` 以重新启动集群。

## 删除 K8s 集群





<div class="alert note">
运行 <code>$ kubectl logs `pod_name`</code > 命令获取删除集群和所有资源之前，pod 的标准错误日志。
</div>

删除集群，minikube 虚拟机和包括持久卷在内的所有资源。

```bash
$ minikube delete
```

## 接下来做什么


安装 Milvus 后，你可以：

- 查阅 [Hello Milvus](/getstarted/quickstart.md)，使用不同 SDK 运行示例代码，了解 Milvus 的功能。

- 学习 Milvus 的基本操作：
  - [管理数据库](管理数据库.md)
  - [管理集合](管理集合.md)
  - [管理分区](管理分区.md)
  - [插入、上插和删除](插入、更新和删除.md)
  - [单向量搜索](单向量搜索.md)
  - [多向量搜索](多向量搜索.md)

- [使用 Helm Chart 升级 Milvus 集群](使用Helm Chart升级Milvus集群.md)。
- [扩展你的 Milvus 集群](扩展Milvus集群.md)。
- 在云端部署你的 Milvus 集群：
  - [Amazon EC2](部署到Amazon EC2.md)
  - [Amazon EKS](部署到Amazon EKS.md)
  - [Google Cloud](部署到Google Cloud.md)
  - [Google Cloud Storage](部署到Google Cloud Storage.md)
  - [Microsoft Azure](部署到Microsoft Azure.md)
  - [Microsoft Azure Blob Storage](部署到Microsoft Azure Blob Storage.md)
- 探索 [Milvus 备份](Milvus备份概述.md)，一个用于 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](Birdwatcher概述.md)，一个用于调试 Milvus 和动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，一个用于直观管理 Milvus 的开源 GUI 工具。
- [使用 Prometheus 监控 Milvus](监控.md)。