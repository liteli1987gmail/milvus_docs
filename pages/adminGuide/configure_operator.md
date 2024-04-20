---
title: 使用 Milvus Operator 配置 Milvus
---

# 使用 Milvus Operator 配置 Milvus

在生产环境中，您需要根据机器类型和工作负载为 Milvus 集群分配资源。您可以在部署期间配置，也可以在集群运行时更新配置。

本主题介绍如何在使用 Milvus Operator 安装 Milvus 集群时进行配置。

本主题假设您已经部署了 Milvus Operator。有关更多信息，请参见 [部署 Milvus Operator](install_cluster-milvusoperator.md)。

使用 Milvus Operator 配置 Milvus 集群包括：
- 全局资源配置
- 私有资源配置

<div class="alert note">
私有资源配置将覆盖全局资源配置。如果您同时全局配置了资源并指定了某个组件的私有资源，那么该组件将首先优先响应私有配置。
</div>

## 配置全局资源

使用 Milvus Operator 启动 Milvus 集群时，您需要指定一个配置文件。这里的示例使用了默认配置文件。

```yaml
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

配置文件的详细信息如下：

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
```

字段 `spec.components` 包括了所有 Milvus 组件的全局和私有资源配置。以下是四个常用于配置全局资源的字段：
- `image`：使用的 Milvus docker 镜像。
- `resources`：分配给每个组件的计算资源。
- `tolerations` 和 `nodeSelector`：K8s 集群中每个 Milvus 组件的调度规则。有关更多信息，请参见 [tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) 和 [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)。
- `env`：环境变量。

如果您想配置更多字段，请查看 [这里](https://pkg.go.dev/github.com/zilliztech/milvus-operator/apis/milvus.io/v1beta1#ComponentSpec) 的文档。

要为 Milvus 集群配置全局资源，请创建一个 `milvuscluster_resource.yaml` 文件。

### 示例

以下示例为 Milvus 集群配置全局资源。

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2.1.0
    nodeSelector: {}
    tolerations: {}
    env: {}
    resources:
      limits:
        cpu: '4'
        memory: 8Gi
      requests:
        cpu: 200m
        memory: 512Mi
```

运行以下命令以应用新配置：

```
kubectl apply -f milvuscluster_resource.yaml
```

<div class="alert note">
如果 K8s 集群中存在名为 <code>my-release</code> 的 Milvus 集群，则集群资源将根据配置文件进行更新。否则，将创建一个新的 Milvus 集群。
</div>

## 配置私有资源

最初在 Milvus 2.0 中，一个 Milvus 集群包括七个组件：代理、根协调器、数据协调器、查询协调器、索引节点、数据节点和查询节点。然而，随着 Milvus 2.1.0 的发布，引入了一个新的组件，mix coord，它包括所有协调器组件。因此，启动 mix coord 意味着您不需要安装和启动其他协调器，包括根协调器、数据协调器和查询协调器。

用于配置每个组件的常见字段包括：
- `replica`：每个组件的副本数量。
- `port`：每个组件的监听端口号。
- 全局资源配置中的四个常用字段：`image`、`env`、`nodeSelector`、`tolerations`、`resources`（见上文）。有关更多可配置字段，请单击 [此文档](https://pkg.go.dev/github.com/zilliztech/milvus-operator/apis/milvus.io/v1beta1#MilvusComponents) 中的每个组件。

<div class="alert note">
此外，在配置代理时，还有一个额外的字段称为 `serviceType`。此字段定义了 Milvus 在 K8s 集群中提供的服务类型。
</div>

要为特定组件配置资源，请首先在 `spec.componets` 字段下添加组件名称，然后配置其私有