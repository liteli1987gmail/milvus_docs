


# 使用 Milvus Operator 升级 Milvus 集群

本指南描述了如何使用 Milvus Operator 升级你的 Milvus 集群。

## 升级你的 Milvus Operator

运行以下命令将你的 Milvus Operator 版本升级为 v{{var.milvus_operator_version}}。

```
helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update zilliztech-milvus-operator
helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
```

一旦你将 Milvus Operator 升级到最新版本，你有以下选择：

- 如果要将 Milvus 从 v2.2.3 或更高版本升级到 {{var.milvus_release_version}}，你可以 [执行滚动升级](#执行滚动升级)。
- 如果要将 Milvus 从 v2.2.3 之前的次要版本升级到 {{var.milvus_release_version}}，建议你 [通过更改其镜像版本升级 Milvus](#通过更改镜像升级-milvus)。
- 如果要将 Milvus 从 v2.1.x 升级到 {{var.milvus_release_version}}，你需要在实际升级之前 [迁移元数据](#迁移元数据)。

## 执行滚动升级

自 Milvus 2.2.3 起，你可以将 Milvus 协调器配置为工作在主备模式下，并为它们启用滚动升级功能，以便在协调器升级期间 Milvus 能够响应传入请求。在之前的版本中，协调器在升级过程中需要被移除并重新创建，这可能会引入一定的服务停机时间。

基于 Kubernetes 提供的滚动更新能力，Milvus Operator 根据依赖关系强制有序地更新部署。另外，Milvus 实现了一种机制，确保在升级过程中其组件与依赖它们的组件保持兼容，大大减少了潜在的服务停机时间。

滚动升级功能默认处于禁用状态。你需要通过配置文件来显式启用它。

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingUpgrade # 默认值，可以省略
    image: milvusdb/milvus:v{{var.milvus_release_tag}}
```

在上述配置文件中，将 `spec.components.enableRollingUpdate` 设置为 `true`，将 `spec.components.image` 设置为所需的 Milvus 版本。

默认情况下，Milvus 以有序方式对协调器执行滚动升级，依次替换协调器 Pod 镜像。为了减少升级时间，考虑将 `spec.components.imageUpdateMode` 设置为 `all`，使 Milvus 同时替换所有 Pod 镜像。

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: all
    image: milvusdb/milvus:v{{var.milvus_release_tag}}
```

你还可以将 `spec.components.imageUpdateMode` 设置为 `rollingDowngrade`，让 Milvus 用较低版本替换协调器 Pod 镜像。

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingDowngrade
    image: milvusdb/milvus:<一些旧的版本>
```

然后将配置保存为 YAML 文件（例如 `milvusupgrade.yml`），并将此配置文件应用到你的 Milvus 实例，如下所示：

```shell
kubectl apply -f milvusupgrade.yml
```

## 通过更改镜像升级 Milvus

 


## Migrate the metadata

自 Milvus 2.2.0 版本开始，元数据与之前版本不兼容。以下示例假设将 Milvus 2.1.4 版本升级到 Milvus v{{var.milvus_release_version}} 版本。

### 1. 创建 `.yaml` 元数据迁移文件

创建元数据迁移文件，示例如下。需要在配置文件中指定 `name`、`sourceVersion` 和 `targetVersion`。以下示例中将 `name` 设置为 `my-release-upgrade`，`sourceVersion` 设置为 `v2.1.4`，`targetVersion` 设置为 `v{{var.milvus_release_version}}`。这意味着将从 v2.1.4 版本升级到 v{{var.milvus_release_version}} 版本。

```
apiVersion: milvus.io/v1beta1
kind: MilvusUpgrade
metadata:
  name: my-release-upgrade
spec:
  milvus:
    namespace: default
    name: my-release
  sourceVersion: "v2.1.4"
  targetVersion: "v{{var.milvus_release_version}}"
  #以下是一些省略的默认值：
  # targetImage: "milvusdb/milvus:v{{var.milvus_release_tag}}"
  # toolImage: "milvusdb/meta-migration:v2.2.0"
  # operation: upgrade
  # rollbackIfFailed: true
  # backupPVC: ""
  # maxRetry: 3
```

### 2. 应用新的配置

运行以下命令应用新的配置。

```shell
$ kubectl apply -f https://github.com/zilliztech/milvus-operator/blob/main/config/samples/beta/milvusupgrade.yaml
```

### 3. 检查元数据迁移的状态

运行以下命令检查元数据迁移的状态。

```shell
kubectl describe milvus release-name
```

输出中的 `ready` 状态表示元数据迁移成功。

或者，你也可以运行 `kubectl get pod` 来检查所有的 pod。如果所有的 pod 都是 `ready` 状态，表示元数据迁移成功。

### 4. 删除 `my-release-upgrade`




当升级成功后，在 YAML 文件中删除 `my-release-upgrade`。

