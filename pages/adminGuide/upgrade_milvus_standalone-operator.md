---

id: 使用Milvus Operator升级Milvus独立部署.md
label: Milvus Operator
order: 0
group: 使用Milvus Operator升级Milvus独立部署.md
related_key: 使用Milvus Operator升级Milvus独立部署
summary: 学习如何使用Milvus Operator升级Milvus独立部署。
title: 使用Milvus Operator升级Milvus独立部署

---

{{tab}}

# 使用Milvus Operator升级Milvus独立部署

本指南描述了如何使用Milvus Operator升级您的Milvus独立部署。

## 升级您的Milvus Operator

运行以下命令，将您的Milvus Operator版本升级到v{{var.milvus_operator_version}}。

```
helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update zilliztech-milvus-operator
helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
```

一旦您将Milvus Operator升级到最新版本，您有以下选择：

- 要将Milvus从v2.2.3或更高版本升级到{{var.milvus_release_version}}，您可以[执行滚动升级](#执行滚动升级)。
- 要将Milvus从v2.2.3之前的次要版本升级到{{var.milvus_release_version}}，建议您[通过更改其镜像版本来升级Milvus](#通过更改其镜像版本来升级Milvus)。
- 要从v2.1.x升级到{{var.milvus_release_version}}，您需要在实际升级之前[迁移元数据](#迁移元数据)。

## 执行滚动升级

从Milvus 2.2.3开始，您可以配置Milvus协调器以在活动-备用模式下工作，并为它们启用滚动升级功能，以便Milvus可以在协调器升级期间响应传入请求。在以前的版本中，协调器需要在升级期间被移除然后重新创建，这可能会引入服务的某些停机时间。

基于Kubernetes提供的滚动更新能力，Milvus Operator根据其依赖关系强制执行部署的有序更新。此外，Milvus实现了一种机制，以确保其组件在升级期间与依赖它们的组件保持兼容，显著减少了潜在的服务停机时间。

滚动升级功能默认处于禁用状态。您需要通过配置文件明确启用它。

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

在上述配置文件中，将`spec.components.enableRollingUpdate`设置为`true`，并将`spec.components.image`设置为所需的Milvus版本。

默认情况下，Milvus以有序的方式对协调器执行滚动升级，依次替换协调器pod镜像。为了减少升级时间，请考虑将`spec.components.imageUpdateMode`设置为`all`，以便Milvus同时替换所有pod镜像。

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

您可以将`spec.components.imageUpdateMode`设置为`rollingDowngrade`，以使Milvus用较低版本的替换协调器pod镜像。

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

然后，将您的配置保存为YAML文件（例如，`milvusupgrade.yml`），并按照以下方式将此配置文件应用于您的Milvus实例：

```shell
kubectl apply -f milvusupgrade.yml
```

## 通过更改其镜像版本来升级Milvus

在正常情况下，您可以通过更改其镜像简单地将Milvus更新到最新版本。但是，请注意，以这种方式升级Milvus时会有一定的停机时间。

按照以下方式编写配置文件并将其保存为**milvusupgrade.yaml**：

```yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
    name: my-release
labels:
    app: milvus
spec:
  # 省略其他字段...
  components:
   image: milvusdb/milvus:v{{var.milvus_release_tag}}
```

然后运行以下命令以执行升级：

```shell
kubectl apply -f milvusupgrade.yaml
```

##