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

  ```shell
  $ sudo apt install --no-install-recommends nvidia-headless-545 nvidia-utils-545
  ```

  对于其他操作系统用户，请参考 [官方安装指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#installing-on-ubuntu-and-debian)。

  您可以通过运行以下命令来检查驱动程序是否已正确安装：

  ```shell
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

```
$ minikube start --gpus all
```

### 3. 检查 K8s 集群状态

运行 `$ kubectl cluster-info` 以检查您刚刚创建的 K8s 集群的状态。确保您可以通过 `kubectl` 访问 K8s 集群。如果您尚未在本地安装 `kubectl`，请参见 [在 minikube 中使用 kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

Minikube 在安装时依赖默认的 StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置 StorageClass。有关更多信息，请参见 [更改默认 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```
$ kubectl get sc
```

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 启动带 GPU 工作节点的 Kubernetes 集群

如果您希望使用支持 GPU 的工作节点，可以按照以下步骤创建带有 GPU 工作节点的 K8s 集群。我们建议在带有 GPU 工作节点的 Kubernetes 集群上安装 Milvus，并使用默认存储类进行配置。

### 1. 准备 GPU 工作节点

有关更多信息，请参见 [准备 GPU 工作节点](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#preparing-your-gpu-nodes)。

### 2. 在 Kubernetes 上