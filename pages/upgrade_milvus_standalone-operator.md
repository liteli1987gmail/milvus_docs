使用Milvus Operator升级Milvus独立部署
=============================

> [Milvus Operator](upgrade_milvus_standalone-operator.md)[Helm](upgrade_milvus_standalone-helm.md)[Docker Compose](upgrade_milvus_standalone-docker.md)

本指南介绍如何使用Milvus Operator升级你的Milvus独立部署。

升级Milvus运算符
-----------

运行以下命令将您的Milvus运算符版本升级到v0.7.12。

```bash
helm repo add milvus-operator https://milvus-io.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade milvus-operator milvus-operator/milvus-operator

```

一旦您将Milvus运算符升级到最新版本，您有以下选择：

* 如果您要将Milvus从v2.2.3或更高版本升级到2.2.8，则可以[进行滚动升级](#Conduct-a-rolling-upgrade)。

* 如果您要将Milvus从v2.2.3之前的小版本升级到2.2.8，建议您通过更改其镜像版本[升级Milvus](#Upgrade-Milvus-by-changing-its-image)。

* 如果您要将Milvus从v2.1.x升级到2.2.8，在实际升级之前，您需要[迁移元数据](#Migrate-the-metadata)。

进行滚动升级
------

从Milvus 2.2.3版本开始，您可以配置Milvus协调器以工作在主备模式，并为它们启用滚动升级功能，以便Milvus在协调器升级期间响应传入请求。 在以前的版本中，协调器需要在升级期间被删除，然后重新创建，这可能会引入一定的服务停机时间。

基于Kubernetes提供的滚动更新能力，Milvus操作员根据它们的依赖关系强制执行部署的有序更新。 此外，Milvus实现了一种机制，以确保其组件在升级期间保持与依赖它们的组件兼容，从而显着减少潜在的服务停机时间。

滚动升级功能默认处于禁用状态。 您需要通过配置文件明确启用它。

```bash
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

在上述配置文件中，将`spec.components.enableRollingUpdate`设置为`true`，并将`spec.components.image`设置为所需的Milvus版本。

默认情况下，Milvus以有序方式对协调器进行滚动升级，其中它一个接一个地替换协调器pod图像。 为了减少升级时间，请考虑将`spec.components.imageUpdateMode`设置为`all`，以便Milvus同时替换所有pod图像。

```bash
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

您可以将`spec.components.imageUpdateMode`设置为`rollingDowngrade`，以便Milvus将协调器pod图像替换为较低版本。

```bash
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

然后将您的配置保存为YAML文件（例如，`milvusupgrade.yml`），并将此配置文件应用于您的Milvus实例，如下所示：

```bash
kubectl apply -f milvusupgrade.yml

```

通过更改图像升级Milvus
--------------

在正常情况下，您可以通过更改图像将Milvus升级到最新版本。但是，请注意，在此方式升级Milvus时将会有一定的停机时间。

按以下方式组成配置文件并将其保存为**milvusupgrade.yaml**：

```bash
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

```bash
kubectl apply -f milvusupgrade.yaml

```

迁移元数据
-----

从Milvus 2.2.0开始，元数据与之前的版本不兼容。以下示例代码片段假设从Milvus 2.1.4升级到Milvus v2.2.8。

### 1. 为元数据迁移创建`.yaml`文件

创建元数据迁移文件。以下是一个示例。您需要在配置文件中指定`name`、`sourceVersion`和`targetVersion`。以下示例将`name`设置为`my-release-upgrade`，`sourceVersion`设置为`v2.1.4`，`targetVersion`设置为`v2.2.8`。这意味着您的Milvus实例将从v2.1.4升级到v2.2.8。

```bash
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

运行以下命令应用新配置。

```bash
$ kubectl apply -f https://github.com/milvus-io/milvus-operator/blob/main/config/samples/beta/milvusupgrade.yaml

```

### 3. 检查元数据迁移的状态

运行以下命令检查元数据迁移的状态。

```bash
kubectl describe milvus release-name

```

输出中的`ready`状态表示元数据迁移成功。

或者，您也可以运行`kubectl get pod`检查所有的pod。如果所有的pod都是`ready`状态，则元数据迁移成功。

### 4. 删除 `my-release-upgrade`

升级成功后，请在 YAML 文件中删除 `my-release-upgrade`。

