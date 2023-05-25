在Kubernetes上分配资源
================

本主题描述了如何在Kubernetes上为Milvus集群分配资源。

通常情况下，在生产环境中为Milvus集群分配的资源应该与机器工作负载成比例。在分配资源时还应考虑机器类型。尽管您可以在集群运行时更新配置，但我们建议在[部署集群](install_cluster-helm.md)之前设置这些值。

1. 查看可用资源
---------

运行`kubectl describe nodes`命令，查看您已经创建的实例上的可用资源。

2. 分配资源
-------

使用Helm为Milvus组件分配CPU和内存资源。

Using Helm to upgrade resources will cause the running pods to perform rolling update.

有两种分配资源的方式：

* [使用命令](allocate.md#Allocate-resources-with-commands)

* [在`YAML`文件中设置参数](allocate.md#Allocate-resources-by-setting-configuration-file)

### Allocate resources with commands

如果您使用`--set`更新资源配置，则需要为每个Milvus组件设置资源变量。

[Milvus独立版](#standalone) [Milvus集群](#cluster)

```python
helm upgrade my-release milvus/milvus --reuse-values --set standalone.resources.limits.cpu=2 --set standalone.resources.limits.memory=4Gi --set standalone.resources.requests.cpu=0.1 --set standalone.resources.requests.memory=128Mi

```

```python
helm upgrade my-release milvus/milvus --reuse-values --set dataNode.resources.limits.cpu=2 --set dataNode.resources.limits.memory=4Gi --set dataNode.resources.requests.cpu=0.1 --set dataNode.resources.requests.memory=128Mi

```

### 通过设置配置文件分配资源

您还可以通过在`resources.yaml`文件中指定`resources.requests`和`resources.limits`参数来分配CPU和内存资源。

```python
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

3. 应用配置
-------

运行以下命令将新配置应用到您的Milvus集群中。

```python
helm upgrade my-release milvus/milvus --reuse-values -f resources.yaml

```

If `resources.limits` is not specified, the pods will consume all the CPU and memory resources available. Therefore, ensure to specify `resources.requests` and `resources.limits` to avoid overallocation of resources when other running tasks on the same instance require more memory consumption.

有关管理资源的更多信息，请参阅[Kubernetes文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

接下来是什么
------

* 您可能还想了解如何：
	+ [扩展 Milvus 集群](scaleout.md)
	+ [升级](upgrade.md) 您的 Milvus 实例

* 如果您准备在云上部署Milvus：
	+ 学习如何使用Terraform和Ansible在AWS上部署Milvus
	+ 学习如何使用Terraform在Amazon EKS上部署Milvus
	+ 学习如何在GCP上使用Kubernetes部署Milvus Cluster
	+ 学习如何在Microsoft Azure上使用Kubernetes部署Milvus
