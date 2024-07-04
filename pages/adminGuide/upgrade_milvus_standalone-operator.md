


# 使用 Milvus Operator 升级 Milvus Standalone

本指南介绍如何使用 Milvus Operator 升级你的 Milvus Standalone。

## 升级 Milvus Operator

运行以下命令将 Milvus Operator 的版本升级至 v{{var.milvus_operator_version}}。

```
helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update zilliztech-milvus-operator
helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
```

一旦将 Milvus Operator 升级至最新版本，你有以下选择：

- 要将 Milvus 从 v2.2.3 或更高版本升级至{{var.milvus_release_version}}，你可以 [进行滚动升级](#进行滚动升级)。
- 要将 Milvus 从 v2.2.3 之前的较小版本升级至{{var.milvus_release_version}}，建议你 [通过更改镜像版本升级 Milvus](#通过更改镜像升级Milvus)。
- 要将 Milvus 从 v2.1.x 升级至{{var.milvus_release_version}}，你需要 [迁移元数据](#迁移元数据) 后再进行实际升级。

## 进行滚动升级

自 Milvus 2.2.3 以来，你可以配置 Milvus 协调器以处于主备模式并为其启用滚动升级功能，这样 Milvus 在协调器升级过程中仍然可以响应传入的请求。在之前的版本中，升级期间需要删除并创建协调器，这可能会导致服务的某种停机时间。

基于 Kubernetes 提供的滚动更新功能，Milvus Operator 根据组件之间的依赖关系强制进行有序的部署更新。此外，Milvus 实现了一种机制，确保其组件与依赖于它们的组件在升级过程中保持兼容性，从而大大减少了潜在的服务停机时间。

滚动升级功能默认情况下是禁用的。你需要通过配置文件明确启用它。

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingUpgrade # 默认值，可省略
    image: milvusdb/milvus:v{{var.milvus_release_tag}}
```

在上述配置文件中，将 `spec.components.enableRollingUpdate` 设置为 `true`，将 `spec.components.image` 设置为所需的 Milvus 版本。

默认情况下，Milvus 按顺序执行协调器的滚动升级，逐一替换协调器 Pod 的镜像。为了减少升级时间，考虑将 `spec.components.imageUpdateMode` 设置为 `all`，以使 Milvus 同时替换所有 Pod 的镜像。

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

你可以将 `spec.components.imageUpdateMode` 设置为 `rollingDowngrade`，以使 Milvus 用较低版本替换协调器 Pod 的镜像。

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingDowngrade
    image: milvusdb/milvus:<some-older-version>
```

然后将你的配置保存为一个 YAML 文件（例如 `milvusupgrade.yml`），并将该配置文件应用于你的 Milvus 实例，如下所示：

```shell
kubectl apply -f milvusupgrade.yml
```

## 通过更改镜像升级 Milvus




在通常情况下，你可以通过更改镜像简单地将 Milvus 更新到最新版本。但请注意，以这种方式升级 Milvus 时会有一定的停机时间。

按照如下方式编写配置文件，并将其保存为 **milvusupgrade.yaml**：

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
    name: my-release
labels:
    app: milvus
spec:
  # Omit other fields ...
  components:
   image: milvusdb/milvus:v{{var.milvus_release_tag}}
```

然后运行以下命令进行升级：

```shell
kubectl apply -f milvusupgrade.yaml
```

## 迁移元数据

从 Milvus 2.2.0 开始，元数据与旧版本不兼容。下面的示例假设从 Milvus 2.1.4 升级到 Milvus v{{var.milvus_release_version}}。

### 1. 创建 `.yaml` 文件进行元数据迁移

创建一个元数据迁移文件，以下是示例。你需要在配置文件中指定 `name`、`sourceVersion` 和 `targetVersion`。以下示例中，`name` 设置为 `my-release-upgrade`，`sourceVersion` 设置为 `v2.1.4`，`targetVersion` 设置为 `v{{var.milvus_release_version}}`。这意味着你的 Milvus 实例将从 v2.1.4 升级到 v{{var.milvus_release_version}}。

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
  # below are some omit default values:
  # targetImage: "milvusdb/milvus:v{{var.milvus_release_tag}}"
  # toolImage: "milvusdb/meta-migration:v2.2.0"
  # operation: upgrade
  # rollbackIfFailed: true
  # backupPVC: ""
  # maxRetry: 3
```

### 2. 应用新配置

运行以下命令应用新配置。

```
$ kubectl apply -f https://github.com/zilliztech/milvus-operator/blob/main/config/samples/beta/milvusupgrade.yaml
```



### 3. 检查元数据迁移的状态

运行以下命令检查元数据迁移的状态。

```
kubectl describe milvus release-name
```

输出中的 `ready` 状态表示元数据迁移成功。

或者，你也可以运行 `kubectl get pod` 命令来检查所有的 pod。如果所有的 pod 都是 `ready`，则表示元数据迁移成功。



### 4. 删除 `my-release-upgrade`




当升级成功后，在 YAML 文件中删除 `my-release-upgrade`。

