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

<div class="alert note">
  <ul>
    <li>The release name should only contain letters, numbers and dashes. Dots are not allowed in the release name.</li>
    <li>The default command line installs cluster version of Milvus while installing Milvus with Helm. Further setting is needed while installing Milvus standalone.</li>
    <li>According to the <a href="https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-25">deprecated API migration guide of Kuberenetes</a>, the <b>policy/v1beta1</b> API version of PodDisruptionBudget is not longer served as of v1.25. You are suggested to migrate manifests and API clients to use the <b>policy/v1</b> API version instead. <br>As a workaround for users who still use the <b>policy/v1beta1</b> API version of PodDisruptionBudget on Kuberenetes v1.25 and later, you can instead run the following command to install Milvus:<br>
    <code>helm install my-release milvus/milvus --set pulsar.bookkeeper.pdb.usePolicy=false,pulsar.broker.pdb.usePolicy=false,pulsar.proxy.pdb.usePolicy=false,pulsar.zookeeper.pdb.usePolicy=false</code></li> 
    <li>See <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> and <a href="https://helm.sh/docs/">Helm</a> for more information.</li>
  </ul>
</div>

Check the status of the running pods.

```
$ kubectl get pods
```

After Milvus starts, the `READY` column displays `1/1` for all pods.

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

## Connect to Milvus

Verify which local port the Milvus server is listening on. Replace the pod name with your own.

```bash
$ kubectl get pod my-release-milvus-proxy-6bd7f5587-ds2xv --template
='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

Open a new terminal and run the following command to forward a local port to the port that Milvus uses. Optionally, omit the designated port and use `:19530` to let `kubectl` allocate a local port for you so that you don't have to manage port conflicts.

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
Forwarding from 127.0.0.1:27017 -> 19530
```

By default, ports forward by kubectl only listen on localhost. Use flag `address` if you want Milvus server to listen on selected IP or all addresses.

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

- Check [Hello Milvus](example_code.md) to run an example code with different SDKs to see what Milvus can do.

- Learn the basic operations of Milvus:
  - [Connect to Milvus server](manage_connection.md)
  - [Create a collection](create_collection.md)
  - [Create a partition](create_partition.md)
  - [Insert data](insert_data.md)
  - [Conduct a vector search](search.md)

- [Upgrade Milvus Using Helm Chart](upgrade_milvus_cluster-helm.md).
- [Scale your Milvus cluster](scaleout.md).
- Deploy your Milvu cluster on clouds:
  - [Amazon EC2](aws.md)
  - [Amazon EKS](eks.md)
- Explore [MilvusDM](migrate_overview.md), an open-source tool designed for importing and exporting data in Milvus.
- [Monitor Milvus with Prometheus](monitor.md).
