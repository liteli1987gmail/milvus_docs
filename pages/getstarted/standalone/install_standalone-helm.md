---

id: 使用Kubernetes安装Milvus独立部署.md
label: Helm
related_key: Helm
order: 2
group: 使用Docker安装Milvus独立部署.md
summary: 学习如何在Kubernetes上安装Milvus独立部署。
title: 使用Kubernetes安装Milvus独立部署

---

{{tab}}

# 使用Kubernetes安装Milvus独立部署

本主题描述了如何使用Kubernetes安装Milvus独立部署。

## 先决条件

在安装之前，请检查[硬件和软件要求](prerequisite-helm.md)。

## 使用minikube创建K8s集群

我们建议使用[minikube](https://minikube.sigs.k8s.io/docs/)在K8s上安装Milvus，这是一个允许您在本地运行K8s的工具。

### 1. 安装minikube

有关更多信息，请参见[安装minikube](https://minikube.sigs.k8s.io/docs/start/)。

### 2. 使用minikube启动K8s集群

安装minikube后，运行以下命令以启动K8s集群。

```
$ minikube start
```

### 3. 检查K8s集群状态

运行 `$ kubectl cluster-info` 以检查您刚刚创建的K8s集群的状态。确保您可以通过 `kubectl` 访问K8s集群。如果您尚未在本地安装 `kubectl`，请参见[在minikube中使用kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

minikube安装时依赖于默认的StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置StorageClass。有关更多信息，请参见[更改默认StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```
$ kubectl get sc
```

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 4. 检查默认存储类

Milvus依赖于默认存储类来自动为数据持久性配置卷。运行以下命令以检查存储类：

```bash
$ kubectl get sc
```

命令输出应类似于以下内容：

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## 安装Milvus的Helm Chart

Helm是一个K8s包管理器，可以帮助您快速部署Milvus。

1. 将Milvus添加到Helm的仓库。

```bash
$ helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

<div class="alert note">

Milvus Helm Charts仓库在 `https://milvus-io.github.io/milvus-helm/` 已被归档，您可以通过以下方式从 `https://zilliztech.github.io/milvus-helm/` 获取进一步更新：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的helm release
helm upgrade my-release zilliztech/milvus
```

归档的仓库仍然适用于4.0.31及以前的版本。对于后续版本，请使用新的仓库。

</div>

2. 更新您的本地仓库。

```bash
$ helm repo update
```

## 启动Milvus

安装了Helm chart后，您可以在Kubernetes上启动Milvus。在本节中，我们将指导您完成启动Milvus的步骤。

您应该通过指定发布名称、图表和您期望更改的参数来使用Helm启动Milvus。在本指南中，我们使用 `<code>my-release</code>` 作为发布名称。如果您使用不同的发布名称，请在以下命令中将 `<code>my-release</code>` 替换为您正在使用的名称。

```bash
$ helm install my-release milvus/milvus --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false
```

<div class="alert note">
请参见 <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> 和 <a href="https://helm.sh/docs/">Helm</a> 以获取更多信息。
</div>

检查正在运行的pods的状态。

```bash
$ kubectl get pods
```

Mil