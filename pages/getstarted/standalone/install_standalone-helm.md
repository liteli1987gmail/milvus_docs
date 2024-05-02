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

```bash
$ minikube start
```

### 3. 检查K8s集群状态

运行 `$ kubectl cluster-info` 以检查您刚刚创建的K8s集群的状态。确保您可以通过 `kubectl` 访问K8s集群。如果您尚未在本地安装 `kubectl`，请参见[在minikube中使用kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

minikube安装时依赖于默认的StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置StorageClass。有关更多信息，请参见[更改默认StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```bash
$ kubectl get sc
```

```bash
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

```bash
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


After Milvus starts, the `READY` column displays `1/1` for all pods.

```text
NAME                                               READY   STATUS      RESTARTS   AGE
my-release-etcd-0                                  1/1     Running     0          30s
my-release-milvus-standalone-54c4f88cb9-f84pf      1/1     Running     0          30s
my-release-minio-5564fbbddc-mz7f5                  1/1     Running     0          30s
```

## Connect to Milvus

Verify which local port the Milvus server is listening on. Replace the pod name with your own.

```bash
$ kubectl get pod my-release-milvus-standalone-54c4f88cb9-f84pf --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
```

```
19530
```

Open a new terminal and run the following command to forward a local port to the port that Milvus uses. Optionally, omit the designated port and use `:19530` to let `kubectl` allocate a local port for you so that you don't have to manage port conflicts.

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
```

```
Forwarding from 127.0.0.1:27017 -> 19530
```

By default, ports forwarded by kubectl only listen on localhost. Use flag `address` if you want Milvus server to listen on selected IP or all addresses.

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## Uninstall Milvus

Run the following command to uninstall Milvus.

```bash
$ helm uninstall my-release
```

## Stop the K8s cluster

Stop the cluster and the minikube VM without deleting the resources you created.

```bash
$ minikube stop
```

Run `minikube start` to restart the cluster.

## Delete the K8s cluster

<div class="alert note">
Run <code>$ kubectl logs `pod_name`</code> to get the <code>stderr</code> log of the pod before deleting the cluster and all resources.
</div>

Delete the cluster, the minikube VM, and all resources you created including persistent volumes.

```bash
$ minikube delete
```

## What's next

Having installed Milvus, you can:

- Check [Hello Milvus](quickstart.md) to run an example code with different SDKs to see what Milvus can do.

- Learn the basic operations of Milvus:
  - [Manage Databases](manage_databases.md)
  - [Manage Collections](manage-collections.md)
  - [Manage Partitions](manage-partitions.md)
  - [Insert, Upsert & Delete](insert-update-delete.md)
  - [Single-Vector Search](single-vector-search.md)
  - [Multi-Vector Search](multi-vector-search.md)

- [Upgrade Milvus Using Helm Chart](upgrade_milvus_standalone-helm.md).
- Explore [Milvus Backup](milvus_backup_overview.md), an open-source tool for Milvus data backups.
- Explore [Birdwatcher](birdwatcher_overview.md), an open-source tool for debugging Milvus and dynamic configuration updates.
- Explore [Attu](https://milvus.io/docs/attu.md), an open-source GUI tool for intuitive Milvus management.
- [Monitor Milvus with Prometheus](monitor.md).
