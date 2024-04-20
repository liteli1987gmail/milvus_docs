---

id: 安装支持GPU的Milvus独立部署.md
label: 独立部署 (Helm)
order: 0
group: 安装支持GPU的Milvus独立部署.md
related_key: Docker
summary: 了解在Docker中安装Milvus之前所需的准备工作。
title: 安装支持GPU的Milvus独立部署

---

{{tab}}

# 安装支持GPU的Milvus独立部署

得益于NVIDIA的贡献，Milvus现在可以使用GPU设备来构建索引和执行ANN搜索。本指南将向您展示如何在您的机器上安装支持GPU的Milvus。

## 前提条件

在安装支持GPU的Milvus之前，请确保您具备以下前提条件：

- 您的GPU设备的计算能力为7.0、7.5、8.0、8.6、8.9、9.0。要检查您的GPU设备是否满足要求，请查看NVIDIA开发者网站上的[您的GPU计算能力](https://developer.nvidia.com/cuda-gpus)。

- 您已在[支持的Linux发行版](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#linux-distributions)之一上安装了适用于您的GPU设备的NVIDIA驱动程序，然后按照[本指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)安装了NVIDIA容器工具包。

  对于Ubuntu 22.04用户，您可以使用以下命令安装驱动程序和容器工具包：

  ```shell
  $ sudo apt install --no-install-recommends nvidia-headless-545 nvidia-utils-545
  ```

  对于其他操作系统用户，请参考[官方安装指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#installing-on-ubuntu-and-debian)。

  您可以通过运行以下命令来检查驱动程序是否已正确安装：

  ```shell
  $ modinfo nvidia | grep "^version"
  version:        545.29.06
  ```

  建议您使用545及以上版本的驱动程序。

- 您已安装了Kubernetes集群，并且`kubectl`命令行工具已配置为与您的集群通信。建议在至少有两个不作为控制平面主机的节点的集群上运行本教程。

## 使用minikube创建K8s集群

我们建议使用[minikube](https://minikube.sigs.k8s.io/docs/)在K8s上安装Milvus，这是一个允许您在本地运行K8s的工具。

### 1. 安装minikube

有关更多信息，请参见[安装minikube](https://minikube.sigs.k8s.io/docs/start/)。

### 2. 使用minikube启动K8s集群

安装minikube后，运行以下命令以启动K8s集群。

```
$ minikube start --gpus all
```

### 3. 检查K8s集群状态

运行`$ kubectl cluster-info`以检查您刚刚创建的K8s集群的状态。确保您可以通过`kubectl`访问K8s集群。如果您尚未在本地安装`kubectl`，请参见[在minikube中使用kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

Minikube在安装时依赖于默认的StorageClass。通过运行以下命令检查依赖性。其他安装方法需要手动配置StorageClass。有关更多信息，请参见[更改默认StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。

```
$ kubectl get sc
```

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 启动带有GPU工作节点的Kubernetes集群

如果您更喜欢使用支持GPU的工作节点，可以按照以下步骤创建带有GPU工作节点的K8s集群。我们建议在带有GPU工作节点的Kubernetes集群上安装Milvus，并使用默认存储类。

### 1. 准备GPU工作节点

有关更多信息，请参见[准备GPU工作节点](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#preparing-your-gpu-nodes)。

### 2. 在Kubernetes上启用GPU支持

有关更多信息，请参见[使用helm安装nvidia-device-plugin](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#deployment-via-helm)。

设置完成后，运行`kubectl describe node <gpu-worker-node>`以查看GPU资源。命令