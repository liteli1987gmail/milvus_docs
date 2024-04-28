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

```bash
$ kubectl get sc
```

```bash
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

## 启动带有GPU工作节点的Kubernetes集群

如果您更喜欢使用支持GPU的工作节点，可以按照以下步骤创建带有GPU工作节点的K8s集群。我们建议在带有GPU工作节点的Kubernetes集群上安装Milvus，并使用默认存储类。

### 1. 准备GPU工作节点

有关更多信息，请参见[准备GPU工作节点](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#preparing-your-gpu-nodes)。

### 2. 在Kubernetes上启用GPU支持

有关更多信息，请参见[使用helm安装nvidia-device-plugin](https://gitlab.com/nvidia/kubernetes/device-plugin/-/blob/main/README.md#deployment-via-helm)。

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

### 3. Check the default storage class

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

1. Add Milvus to Helm's repository.

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

2. Update your local chart repository.

```bash
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
  standalone:
    resources:
      requests:
        nvidia.com/gpu: "1"
      limits:
        nvidia.com/gpu: "1"
  EOF
  ```

  ```bash
  $ helm install my-release milvus/milvus --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false -f custom-values.yaml
  ```

- Assign multiple GPU devices

  Run the following commands to assign multiple GPU devices to Milvus:

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
  $ helm install my-release milvus/milvus --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false -f custom-values.yaml
  ```

  <div class="alert note">
  See <a href="https://artifacthub.io/packages/helm/milvus-helm/milvus">Milvus Helm Chart</a> and <a href="https://helm.sh/docs/">Helm</a> for more information.
  </div>

  Check the status of the running pods:

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


