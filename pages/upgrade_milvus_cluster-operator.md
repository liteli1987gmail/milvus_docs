[Milvus Operator](upgrade_milvus_cluster-operator.md)[Helm](upgrade_milvus_cluster-helm.md)
使用Milvus Operator升级Milvus集群
===========================

本指南介绍如何使用Milvus Operator升级Milvus集群。

升级Milvus Operator
-----------------

运行以下命令将Milvus Operator版本升级至v0.7.12。

```
helm repo add milvus-operator https://milvus-io.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade milvus-operator milvus-operator/milvus-operator

```

一旦您将Milvus Operator升级到最新版本，您就有以下选择：

* 要将Milvus从v2.2.3或更高版本升级到2.2.8，您可以[进行滚动升级](#Conduct-a-rolling-upgrade)。

* 从v2.2.3之前的小版本升级Milvus到2.2.8，建议通过更改其镜像版本[升级Milvus](#Upgrade-Milvus-by-changing-its-image)。

* 从v2.1.x升级到2.2.8的Milvus之前，需要[迁移元数据](#Migrate-the-metadata)。

进行滚动升级
------

从Milvus 2.2.3开始，您可以配置Milvus协调器以工作在主备模式，并为它们启用滚动升级功能，以便Milvus可以在协调器升级期间响应传入的请求。在之前的版本中，协调器需要在升级期间被删除并重新创建，这可能会引入某些服务停机时间。

基于Kubernetes提供的滚动更新功能，Milvus操作员根据它们的依赖性强制执行部署的有序更新。此外，Milvus实现了一种机制，以确保在升级期间其组件与依赖于它们的组件保持兼容，从而显著减少潜在的服务停机时间。

滚动升级功能默认处于禁用状态。您需要通过配置文件明确启用它。

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingUpgrade # Default value, can be omitted
    image: milvusdb/milvus:v2.2.8

```

在上述配置文件中，将`spec.components.enableRollingUpdate`设置为`true`，将`spec.components.image`设置为所需的Milvus版本。

默认情况下，Milvus按有序方式对协调器进行滚动升级，依次替换协调器pod镜像。为了缩短升级时间，考虑将`spec.components.imageUpdateMode`设置为`all`，以便Milvus同时替换所有pod镜像。

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: all
    image: milvusdb/milvus:v2.2.8

```

您可以将`spec.components.imageUpdateMode`设置为`rollingDowngrade`，以使Milvus用较低的版本替换协调器pod镜像。

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
spec:
  components:
    enableRollingUpdate: true
    imageUpdateMode: rollingDowngrade
    image: milvusdb/milvus:<some-old-version>

```

然后将您的配置保存为一个YAML文件（例如`milvusupgrade.yml`），并将此配置文件应用于您的Milvus实例，如下所示：

```
kubectl apply -f milvusupgrade.yml

```

通过更改镜像升级 Milvus
---------------

一般情况下，您可以通过更改镜像来将 Milvus 升级到最新版本。但是请注意，在以这种方式升级 Milvus 时，将会有一定的停机时间。

请按照以下方式编写配置文件，并将其保存为**milvusupgrade.yaml**：

```
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
name: my-release
labels:
app: milvus
spec:
  # Omit other fields ...
  components:
   image: milvusdb/milvus:v2.2.8

```

然后运行以下命令执行升级：

```
kubectl apply -f milvusupgrade.yaml

```

迁移元数据
-----

从 Milvus 2.2.0 版本开始，元数据与早期版本不兼容。以下示例片段假设从 Milvus 2.1.4 升级到 Milvus 2.2.8。

### 1. 为元数据迁移创建一个`.yaml`文件

创建一个元数据迁移文件。以下是一个例子。你需要在配置文件中指定`name`、`sourceVersion`和`targetVersion`。以下示例将`name`设置为`my-release-upgrade`，`sourceVersion`设置为`v2.1.4`，`targetVersion`设置为`v2.2.8`。这意味着你的Milvus集群将从v2.1.4升级到v2.2.8。

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
  targetVersion: "v2.2.8"
  # below are some omit default values:
  # targetImage: "milvusdb/milvus:v2.2.8"
  # toolImage: "milvusdb/meta-migration:v2.2.0"
  # operation: upgrade
  # rollbackIfFailed: true
  # backupPVC: ""
  # maxRetry: 3

```

### 2. 应用新配置

运行以下命令以应用新配置。

```
$ kubectl apply -f https://github.com/milvus-io/milvus-operator/blob/main/config/samples/beta/milvusupgrade.yaml

```

### 3. 检查元数据迁移的状态

运行以下命令检查元数据迁移的状态。

```
kubectl describe milvus release-name

```

输出中的`ready`状态表示元数据迁移成功。

或者，您也可以运行`kubectl get pod`来检查所有pod。如果所有的pod都是`ready`，则表示元数据迁移成功。

### 4. Delete `my-release-upgrade`

当升级成功后，请在YAML文件中删除 `my-release-upgrade` 。

