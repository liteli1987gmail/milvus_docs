


# 用 Kubernetes 安装独立运行的 Milvus

本主题描述了如何使用 Kubernetes 安装独立运行的 Milvus。

## 先决条件

在安装之前，请先检查硬件和软件的 [要求](/getstarted/prerequisite-helm.md)。

## 使用 minikube 创建 K8s 集群

我们推荐使用 [minikube](https://minikube.sigs.k8s.io/docs/) 在 K8s 上安装 Milvus，它是一个允许你在本地运行 K8s 的工具。

### 1. 安装 minikube

参考 [安装 minikube](https://minikube.sigs.k8s.io/docs/start/) 获取更多信息。

### 2. 使用 minikube 启动 K8s 集群

安装 minikube 后，运行以下命令以启动 K8s 集群。

```
$ minikube start
```

### 3. 检查 K8s 集群状态

运行 `$ kubectl cluster-info` 检查刚刚创建的 K8s 集群的状态。确保你可以通过 `kubectl` 访问 K8s 集群。如果你尚未在本地安装 `kubectl`，请参阅 [在 minikube 内使用 kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

minikube 在安装时有一个默认的 StorageClass 依赖项。通过以下命令来检查依赖项。其他安装方法需要手动配置 StorageClass。更多信息请参阅 [更改默认的 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```
$ kubectl get sc
```

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard（默认）      k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 4. 检查默认的存储类

Milvus 依赖于默认的存储类来自动为数据持久化提供卷。运行以下命令来检查存储类：

```bash
$ kubectl get sc
```

命令输出应类似于以下内容：

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path（默认）      rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## 安装 Milvus 的 Helm Chart

Helm 是一个 K8s 包管理器，可以帮助你快速部署 Milvus。

1. 将 Milvus 添加到 Helm 的存储库。

```bash
$ helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

<div class="alert note">

Milvus Helm Charts 存储库  `https://milvus-io.github.io/milvus-helm/` 已归档，并且你可以从 `https://zilliztech.github.io/milvus-helm/` 获取进一步的更新，操作如下所示：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的helm发布
helm upgrade my-release zilliztech/milvus
```

存档的存储库仍然可用于版本 4.0.31 之前的图表。对于更高版本，请使用新存储库。

</div>

2. 更新你的本地图表存储库。

```bash
$ helm repo update
```

## 启动 Milvus




如果已经安装了 Helm charts，你可以在 Kubernetes 上启动 Milvus。在本节中，我们将引导你完成启动 Milvus 的步骤。

你可以通过指定发布名称、图表和你期望更改的参数来使用 Helm 启动 Milvus。在本指南中，我们使用 `my-release` 作为发布名称。如果要使用不同的发布名称，请在以下命令中将 `my-release` 替换为你使用的名称。

```bash
$ helm install my-release milvus/milvus --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false
```

<div class="alert note">
有关更多信息，请参见 <a href="https://artifacthub.io/packages/helm/milvus/milvus"> Milvus Helm Chart </a> 和 <a href="https://helm.sh/docs/"> Helm </a>。
</div>

检查正在运行的 Pod 的状态。

```bash
$ kubectl get pods
```

Milvus 启动后，所有 Pod 的 `READY` 列将显示为 `1/1`。

```text
NAME                                               READY   STATUS      RESTARTS   AGE
my-release-etcd-0                                  1/1     Running     0          30s
my-release-milvus-standalone-54c4f88cb9-f84pf      1/1     Running     0          30s
my-release-minio-5564fbbddc-mz7f5                  1/1     Running     0          30s
```

## 连接到 Milvus

验证 Milvus 服务器侦听的本地端口。将 Pod 名称替换为你自己的名称。

```bash
$ kubectl get pod my-release-milvus-standalone-54c4f88cb9-f84pf --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
```

```
19530
```

打开一个新终端并运行以下命令，将本地端口转发到 Milvus 使用的端口。可以选择省略指定的端口，使用 `:19530` 让 `kubectl` 为你分配一个本地端口，这样你就不必管理端口冲突。

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
```

```
Forwarding from 127.0.0.1:27017 -> 19530
```

默认情况下，kubectl 转发的端口仅在本地主机上侦听。如果要让 Milvus 服务器在所选 IP 或所有地址上侦听，请使用 `address` 标志。

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载 Milvus

运行以下命令卸载 Milvus。

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
在删除集群和所有资源之前，运行 <code>$ kubectl logs `pod_name`</code > 获取 pod 的 < code > stderr </code > 日志。
</div>

删除集群、minikube 虚拟机和所有你创建的资源，包括持久卷。

```bash
$ minikube delete
```

## 接下来的步骤



自己安装了 Milvus 后，你可以：
		
- 查看 [Hello Milvus](/getstarted/quickstart.md) 以了解如何使用不同的 SDK 运行示例代码，看看 Milvus 能做什么。

- 学习 Milvus 的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- [使用 Helm 图表升级 Milvus](/adminGuide/upgrade_milvus_standalone-helm.md)。
- 探索 [Milvus Backup](/userGuide/tools/milvus_backup_overview.md)，这是一个用于 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，这是一个用于调试 Milvus 和动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，这是一个直观的 Milvus 管理工具，是开源的 GUI 工具。
- [使用 Prometheus 监控 Milvus](/adminGuide/monitor/monitor.md)。

