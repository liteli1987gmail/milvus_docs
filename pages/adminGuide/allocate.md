---

id: allocate.md
title: 在 Kubernetes 上为 Milvus 分配资源
summary: 学习如何在 Kubernetes 上为 Milvus 分配资源。

---

# 在 Kubernetes 上分配资源

本主题描述了如何在 Kubernetes 上为 Milvus 集群分配资源。

通常，您为生产环境中的 Milvus 集群分配的资源应与机器的工作负载成比例。在分配资源时，还应考虑机器类型。尽管您可以在集群运行时更新配置，但我们建议在[部署集群](install_cluster-helm.md)之前设置这些值。

## 1. 查看可用资源

运行 `kubectl describe nodes` 查看您已配置的实例上的可用资源。

## 2. 分配资源

使用 Helm 为 Milvus 组件分配 CPU 和内存资源。

<div class="alert note">
使用 Helm 升级资源将导致正在运行的 pod 执行滚动更新。
</div>

有两种分配资源的方法：

- [使用命令](allocate.md#使用命令分配资源)
- [在 `YAML` 文件中设置参数](allocate.md#通过设置配置文件分配资源)

### 使用命令分配资源

如果您使用 `--set` 更新资源配置，则需要为每个 Milvus 组件设置资源变量。

<div class="filter">
<a href="#standalone">Milvus 独立部署</a> <a href="#cluster">Milvus 集群部署</a>
</div>

<div class="table-wrapper filter-standalone" markdown="block">

```Shell
helm upgrade my-release milvus/milvus --reuse-values --set standalone.resources.limits.cpu=2 --set standalone.resources.limits.memory=4Gi --set standalone.resources.requests.cpu=0.1 --set standalone.resources.requests.memory=128Mi
```

</div>

<div class="table-wrapper filter-cluster" markdown="block">

```Shell
helm upgrade my-release milvus/milvus --reuse-values --set dataNode.resources.limits.cpu=2 --set dataNode.resources.limits.memory=4Gi --set dataNode.resources.requests.cpu=0.1 --set dataNode.resources.requests.memory=128Mi
```

</div>

### 通过设置配置文件分配资源

您也可以通过在 `resources.yaml` 文件中指定 `resources.requests` 和 `resources.limits` 参数来分配 CPU 和内存资源。

```Yaml
dataNode:
  resources:
    limits:
      cpu: "4"
      memory: "16Gi"
    requests:
      cpu: "1"
      memory: "4Gi"
queryNode:
  resources:
    limits:
      cpu: "4"
      memory: "16Gi"
    requests:
      cpu: "1"
      memory: "4Gi"
```

## 3. 应用配置

运行以下命令将新配置应用到您的 Milvus 集群。

```Shell
helm upgrade my-release milvus/milvus --reuse-values -f resources.yaml
```
<div class="alert note">
如果未指定 <code>resources.limits</code>，则 pod 将消耗所有可用的 CPU 和内存资源。因此，请确保指定 <code>resources.requests</code> 和 <code>resources.limits</code>，以避免在同一个实例上运行的其他任务需要更多内存消耗时资源的过度分配。
</div>

有关管理资源的更多信息，请参见 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

## 接下来做什么

- 您可能还想了解如何：
  - [扩展 Milvus 集群](scaleout.md)
  - [升级 Milvus 集群](upgrade_milvus_cluster-operator.md)
  - [升级 Milvus 独立部署](upgrade_milvus_standalone-operator.md)
- 如果您准备在云上部署您的集群：
  - 学习如何 [使用 Terraform 和 Ansible 在 AWS 上部署 Milvus](aws.md)
  - 学习如何 [使用 Terraform 在 Amazon EKS 上部署 Milvus](eks.md)
  - 学习如何 [在 GCP 上使用 Kubernetes 部署 Milvus 集群](gcp.md)
  - 学习如何 [在 Microsoft Azure 上使用 Kubernetes 部署 Milvus](azure.md)