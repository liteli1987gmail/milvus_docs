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

```
$ kubectl get sc
```

```
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

```
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

```
$ helm install my-release milvus/milvus
```

<div class="alert note">
  <ul>
    <li>发布名称应仅包含字母、数字和破折号。发布名称中不允许使用点。</li>
    <li>默认的命令行安装在安装Milvus时安装了Milvus的集群版本。在安装Milvus独立部署时需要进一步设置。</li>
    <li>根据<a href="https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-25">Kubernetes弃用API迁移指南</a>，从v1.25开始，PodDisruptionBudget的<b>policy/v1beta1</b> API版本不再提供服务。建议您将清单和API客户端迁移到使用<b>policy/v1</b> API版本。<br>对于仍在Kubernetes v1.25及更高版本上使用<b>policy/v1beta1</b> API版本的PodDisruptionBudget的用户，可以运行以下命令安装Milvus：<br>
    <code>helm install my-release milvus/milvus --set pulsar.bookkeeper.pdb.usePolicy=false,pulsar.broker.pdb.usePolicy=false,pulsar.proxy.pdb.usePolicy=false,pulsar.z