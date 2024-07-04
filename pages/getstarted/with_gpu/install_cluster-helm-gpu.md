---
id: install_cluster-helm-gpu.md
label: 集群 (Helm)
related_key: Kubernetes
order: 2
group: install_standalone-helm-gpu.md
summary: 学习如何在 Kubernetes 上安装 Milvus 集群。
title: 安装支持 GPU 的 Milvus 集群
---

{{tab}}

# 安装支持 GPU 的 Milvus 集群

得益于 NVIDIA 的贡献，Milvus 现在可以使用 GPU 设备来构建索引和执行 ANN 搜索。本指南将向您展示如何在您的机器上安装支持 GPU 的 Milvus。

## 前提条件

在安装支持 GPU 的 Milvus 之前，请确保您具备以下前提条件：

- 您的 GPU 设备的计算能力为 7.0、7.5、8.0、8.6、8.9、9.0。要检查您的 GPU 设备是否满足要求，请查看 NVIDIA 开发者网站上的 [您的 GPU 计算能力](https://developer.nvidia.com/cuda-gpus)。

- 您已在 [支持的 Linux 发行版](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#linux-distributions) 之一上为您的 GPU 设备安装了 NVIDIA 驱动程序，然后按照 [本指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) 安装了 NVIDIA Container Toolkit。

  对于 Ubuntu 22.04 用户，您可以使用以下命令安装驱动程序和容器工具包：

  ```bash
  $ sudo apt install --no-install-recommends nvidia-headless-545 nvidia-utils-545
  ```

  对于其他操作系统用户，请参考 [官方安装指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#installing-on-ubuntu-and-debian)。

  您可以通过运行以下命令来检查驱动程序是否已正确安装：

  ```bash
  $ modinfo nvidia | grep "^version"
  version:        545.29.06
  ```

  建议您使用 545 及以上版本的驱动程序。

- 您已安装了 Kubernetes 集群，并且 `kubectl` 命令行工具已配置为与您的集群通信。建议在至少有两个不作为控制平面主机的节点的集群上运行本教程。

## 创建 K8s 集群

如果您已经为生产部署了 K8s 集群，您可以跳过这一步，直接进行 [为 Milvus 安装 Helm Chart](install_cluster-helm.md#Install-Helm-Chart-for-Milvus)。如果没有，您可以按照以下步骤快速创建一个 K8s 用于测试，然后使用它来使用 Helm 部署支持 GPU 的 Milvus 集群。

### 1. 安装 minikube

有关更多信息，请参见 [安装 minikube](https://minikube.sigs.k8s.io/docs/start/)。

### 2. 使用 minikube 启动 K8s 集群

安装 minikube 后，运行以下命令以启动 K8s 集群。

```bash
$ minikube start --gpus all
```

### 3. 检查 K8s 集群状态

运行 `$ kubectl cluster-info` 以检查您刚刚创建的 K8s 集群的状态。确保您可以通过 `kubectl` 访问 K8s 集群。如果您尚未在本地安装 `kubectl`，请参见 [在 minikube 中使用 kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

Minikube 在安装时依赖默认的 StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置 StorageClass。有关更多信息，请参见 [更改默认 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```bash
$ kubectl get sc
```

```bash
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 启动带 GPU 工作节点的 Kubernetes 集群

如果您希望使用支持 GPU 的工作节点，可以按照以下步骤创建带有 GPU 工作节点的 K8s 集群。我们建议在带有 GPU 工作节点的 Kubernetes 集群上安装 Milvus，并使用默认存储类进行配置。

### 1. 准备 GPU 工作节点

更多详情请查阅 [Prepare GPU worker nodes](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#preparing-your-gpu-nodes) 

### 2. 在Kubernetes上启用GPU支持

更多详情请查阅 [install nvidia-device-plugin with helm](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#deployment-via-helm) 

设置后，运行`kubectl describe node＜gpu worker node＞`以查看gpu资源。命令输出应类似于以下内容：

```bash
Capacity:
  ...
  nvidia.com/gpu:     4
  ...
Allocatable:
  ...
  nvidia.com/gpu:     4
  ...
```

注意：在这个例子中，我们已经用4个GPU卡设置了一个GPU工作节点。

## 检查默认存储类

Milvus依靠默认存储类来自动为数据持久性提供卷。运行以下命令以检查存储类：

```bash
$ kubectl get sc
```

命令输出应类似于以下内容：

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## 为Milvus安装Helm图表

Helm是一个K8s包管理器，可以帮助您快速部署Milvus。

1. 添加Milvus Helm库。

```bash
$ helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

<div class="alert note">

The Milvus Helm Charts repo at `https://milvus-io.github.io/milvus-helm/` has been archived and you can get further updates from `https://zilliztech.github.io/milvus-helm/` as follows:

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# upgrade existing helm release
helm upgrade my-release zilliztech/milvus
```

The archived repo is still available for the charts up to 4.0.31. For later releases, use the new repo instead.

</div>

2. 更新本地图表。

```bash
$ helm repo update
```

## 开始Milvus

一旦你安装了Helm图表，你就可以在Kubernetes上启动Milvus了。在本节中，我们将指导您完成使用GPU支持启动Milvus的步骤。
您应该通过指定发布名称、图表和期望更改的参数来启动带有Helm的Milvus。在本指南中，我们使用<code>my release</code>作为发布名称。要使用不同的版本名称，请将以下命令中的<code>my release</code>替换为您正在使用的命令。
Milvus允许您将一个或多个GPU设备分配给Milvus。

- 分配单个GPU设备

运行以下命令将单个GPU设备分配给Milvus：

  ```bash
  cat <<EOF > custom-values.yaml
  indexNode:
    resources:
      requests:
        nvidia.com/gpu: "1"
      limits:
        nvidia.com/gpu: "1"
  queryNode:
    resources:
      requests:
        nvidia.com/gpu: "1"
      limits:
        nvidia.com/gpu: "1"
  EOF
  ```

  ```bash
  $ helm install my-release milvus/milvus -f custom-values.yaml
  ```

- 分配多个GPU设备

运行以下命令将多个GPU设备分配给Milvus：

  ```bash
  cat <<EOF > custom-values.yaml
  indexNode:
    resources:
      requests:
        nvidia.com/gpu: "2"
      limits:
        nvidia.com/gpu: "2"
  queryNode:
    resources:
      requests:
        nvidia.com/gpu: "2"
      limits:
        nvidia.com/gpu: "2"
  EOF
  ```

在上面的配置中，indexNode和queryNode共享两个GPU。要为indexNode和queryNode分配不同的GPU，您可以通过在配置文件中设置`extraEnv`来相应地修改配置，如下所示：

  ```bash
  cat <<EOF > custom-values.yaml
  indexNode:
    resources:
      requests:
        nvidia.com/gpu: "1"
      limits:
        nvidia.com/gpu: "1"
    extraEnv:
      - name: CUDA_VISIBLE_DEVICES
        value: "0"
  queryNode:
    resources:
      requests:
        nvidia.com/gpu: "1"
      limits:
        nvidia.com/gpu: "1"
    extraEnv:
      - name: CUDA_VISIBLE_DEVICES
        value: "1"
  EOF
  ```

  ```bash
  $ helm install my-release milvus/milvus -f custom-values.yaml
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

  ```bash
  $ kubectl get pods
  ```
Milvus启动后， `READY` 列显示 pods 的`1/1`。

```text
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

默认情况下，kubectl转发的端口仅在localhost上侦听。如果您希望Milvus服务器侦听选定的IP或所有地址，请使用标志`address`

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载 Milvus

可以跑以下命令卸载 Milvus.

```bash
$ helm uninstall my-release
```

## 停止 K8s 集群

在不删除您创建的资源的情况下停止群集和minikube虚拟机。

```bash
$ minikube stop
```

运行 `minikube start` 以重新启动群集。

## 删除 K8s 集群

<div class="alert note">
Run <code>$ kubectl logs `pod_name`</code> to get the <code>stderr</code> log of the pod before deleting the cluster and all resources.
</div>

删除集群、minikube虚拟机以及您创建的所有资源，包括持久卷。

```bash
$ minikube delete
```
##接下来是什么

安装Milvus后，您可以：

- 检查[Hello-Milvus](/getstarted/quickstart.md)，用不同的SDK运行一个示例代码，看看Milvus能做什么。

- 学习Milvus的基本操作：
  - [管理数据库](Manage_Databases.md)
  - [管理集合](Manage-Collections.md)
  - [管理分区](Manage Partitions.md)
  - [插入、更新和删除](Insert-update-Delete.md)
  - [单矢量搜索](singlevectorsearch.md)
  - [多矢量搜索](Multi-vvector Search.md)

- [使用Helm Chart升级Milvus](Upgrade_Milvus_cluster-Helm.md)。
- [缩放Milvus集群](/adminGuide/scaleout.md)。
- 在云上部署您的Milvu集群：
  - [亚马逊EC2](/adminGuide/clouds/aws/aws.md)
  - [亚马逊EKS](EKS.md)
  - [谷歌云](/adminGuide/clouds/gcp/gcp.md)
  - [谷歌云存储](/adminGuide/clouds/gcp/gcs.md)
  - [Microsoft Azure](Azure.md)
  - [Microsoft Azure Blob存储](/adminGuide/clouds/azure/abs.md)
  
- 探索[Milvus Backup](Milvus_Backup_overview.md)，一个用于Milvus数据备份的开源工具。
- 探索[Birdwatcher](Birdwatcher_overview.md)，这是一个用于调试Milvus和动态配置更新的开源工具。
- 浏览[Attu](https://milvus.io/docs/attu.md)，一个用于直观Milvus管理的开源GUI工具。
- [用普罗米修斯监视Milvus](Monitor.md)。
