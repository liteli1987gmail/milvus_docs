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

See [Prepare GPU worker nodes](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#preparing-your-gpu-nodes) for more information.

### 2. Enable GPU support on Kubernetes

See [install nvidia-device-plugin with helm](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#deployment-via-helm) for more information.

After setting up, run `kubectl describe node <gpu-worker-node>` to view the GPU resources. The command output should be similar to the following:

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

Note: In this example, we have set up a GPU worker node with 4 GPU cards.

## Check the default storage class

Milvus relies on the default storage class to automatically provision volumes for data persistence. Run the following command to check storage classes:

```bash
$ kubectl get sc
```

The command output should be similar to the following:

```bash
NAME                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                           Delete          WaitForFirstConsumer   false                  461d
```

## Install Helm Chart for Milvus

Helm is a K8s package manager that can help you deploy Milvus quickly.

1. Add Milvus Helm repository.

```
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

2. Update charts locally.

```
$ helm repo update
```

## Start Milvus

Once you have installed the Helm chart, you can start Milvus on Kubernetes. In this section, we will guide you through the steps to start Milvus with GPU support.

You should start Milvus with Helm by specifying the release name, the chart, and the parameters you expect to change. In this guide, we use <code>my-release</code> as the release name. To use a different release name, replace <code>my-release</code> in the following commands with the one you are using.

Milvus allows you to assign one or more GPU devices to Milvus.

- Assign a single GPU device

  Run the following commands to assign a single GPU device to Milvus:

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

- Assign multiple GPU devices

  Run the following commands to assign multiple GPU devices to Milvus:

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

  In the configuration above, the indexNode and queryNode share two GPUs. To assign different GPUs to the indexNode and the queryNode, you can modify the configuration accordingly by setting `extraEnv` in the configuration file as follows:

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

After Milvus starts, the `READY` column displays `1/1` for all pods.

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

- Check [Hello Milvus](quickstart.md) to run an example code with different SDKs to see what Milvus can do.

- Learn the basic operations of Milvus:
  - [Manage Databases](manage_databases.md)
  - [Manage Collections](manage-collections.md)
  - [Manage Partitions](manage-partitions.md)
  - [Insert, Upsert & Delete](insert-update-delete.md)
  - [Single-Vector Search](single-vector-search.md)
  - [Multi-Vector Search](multi-vector-search.md)

- [Upgrade Milvus Using Helm Chart](upgrade_milvus_cluster-helm.md).
- [Scale your Milvus cluster](scaleout.md).
- Deploy your Milvu cluster on clouds:
  - [Amazon EC2](aws.md)
  - [Amazon EKS](eks.md)
  - [Google Cloud](gcp.md)
  - [Google Cloud Storage](gcs.md)
  - [Microsoft Azure](azure.md)
  - [Microsoft Azure Blob Storage](abs.md)
- Explore [Milvus Backup](milvus_backup_overview.md), an open-source tool for Milvus data backups.
- Explore [Birdwatcher](birdwatcher_overview.md), an open-source tool for debugging Milvus and dynamic configuration updates.
- Explore [Attu](https://milvus.io/docs/attu.md), an open-source GUI tool for intuitive Milvus management.
- [Monitor Milvus with Prometheus](monitor.md).
