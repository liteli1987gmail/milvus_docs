

# 在 Kubernetes 上分配资源

本主题介绍了如何在 Kubernetes 上为 Milvus 集群分配资源。

通常，在生产中为 Milvus 集群分配的资源应与机器工作负载成比例。在分配资源时，你还应考虑机器类型。虽然你可以在集群运行时更新配置，但我们建议在 [部署集群](/getstarted/cluster/install_cluster-helm.md) 之前设置这些值。

## 1. 查看可用资源

运行 `kubectl describe nodes` 命令以查看你已分配资源的实例上的可用资源。

## 2. 分配资源

使用 Helm 将 CPU 和内存资源分配给 Milvus 组件。

<div class="alert note">
使用 Helm 升级资源会导致正在运行的 Pod 执行滚动更新。
</div>

有两种分配资源的方式：

- [使用命令](allocate.md#使用命令分配资源)
- [在 `YAML` 文件中设置参数](allocate.md#通过设置配置文件分配资源)


### 使用命令分配资源

如果你使用 `--set` 来更新资源配置，则需要为每个 Milvus 组件设置资源变量。

<div class="filter">
<a href="#standalone"> Milvus 独立模式 </a> <a href="#cluster"> Milvus 集群模式 </a>
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

你还可以通过在 `resources.yaml` 文件中指定参数 `resources.requests` 和 `resources.limits` 来分配 CPU 和内存资源。

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

运行以下命令将新配置应用于你的 Milvus 集群。

```Shell
helm upgrade my-release milvus/milvus --reuse-values -f resources.yaml
```
<div class="alert note">
如果未指定 <code> resources.limits </code>，Pod 将使用所有可用的 CPU 和内存资源。因此，请确保指定 <code> resources.requests </code> 和 <code> resources.limits </code>，以避免当同一实例上的其他运行任务需要更多内存消耗时资源过分分配问题。
</div>

有关更多有关资源管理的信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

## 下一步操作

了解如何使用 Kubernetes 部署 Milvus 集群。



- 你可能还想学习如何：
  - [扩展 Milvus 集群](/adminGuide/scaleout.md)
  - [升级 Milvus 集群](/adminGuide/upgrade_milvus_cluster-operator.md)
  - [升级 Milvus 独立部署](/adminGuide/upgrade_milvus_standalone-operator.md)
- 如果你准备在云上部署你的集群：
  - 学习如何使用 Terraform 和 Ansible 在 AWS 上部署 Milvus（aws.md）
  - 学习如何使用 Terraform 在 Amazon EKS 上部署 Milvus（eks.md）
  - 学习如何在 GCP 上使用 Kubernetes 部署 Milvus 集群（gcp.md）
  - 学习如何在 Microsoft Azure 上使用 Kubernetes 部署 Milvus（azure.md）
