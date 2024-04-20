---

id: 使用Helm图表升级Milvus独立部署.md
label: Helm
order: 1
group: upgrade_milvus_standalone-operator.md
related_key: 升级Milvus独立部署
summary: 学习如何使用Helm图表升级Milvus独立部署。
title: 使用Helm图表升级Milvus独立部署

---

{{tab}}

# 使用Helm图表升级Milvus独立部署

本指南描述了如何使用Milvus Helm图表升级您的Milvus独立部署。

## 检查Milvus版本

运行以下命令以检查新版本的Milvus。

```
$ helm repo update
$ helm search repo zilliztech/milvus --versions
```

<div class="alert note">

Milvus Helm Charts仓库位于 `https://milvus-io.github.io/milvus-helm/` 已被归档，您可以从 `https://zilliztech.github.io/milvus-helm/` 获取进一步更新，如下所示：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的helm release
helm upgrade my-release zilliztech/milvus
```

归档的仓库仍然适用于4.0.31之前的图表。对于后续版本，请使用新仓库。

</div>

```
NAME                    CHART VERSION   APP VERSION             DESCRIPTION
zilliztech/milvus       4.1.29          2.4.0                   Milvus是一个构建于...
zilliztech/milvus       4.1.24          2.3.11                  Milvus是一个构建于...
zilliztech/milvus       4.1.23          2.3.10                  Milvus是一个构建于...
...
```

您可以选择以下升级路径之一：

<div style="display: none;">- [执行滚动升级](#conduct-a-rolling-upgrade) 从Milvus v2.2.3及以后的版本升级到v{{var.milvus_release_version}}。</div>

- [使用Helm升级Milvus](#Upgrade-Milvus-using-Helm) 从v2.2.3之前的次要版本升级到v{{var.milvus_release_version}}。

- [迁移元数据](#Migrate-the-metadata) 在从Milvus v2.1.x升级到v{{var.milvus_release_version}}之前。

<div style="display:none;">

## 执行滚动升级

自Milvus 2.2.3起，您可以配置Milvus协调器以活动-备用模式工作，并为它们启用滚动升级功能，以便Milvus可以在协调器升级期间响应传入请求。在以前的版本中，协调器需要在升级期间被移除然后重新创建，这可能会引入服务的某些停机时间。

滚动升级要求协调器以活动-备用模式工作。您可以使用我们提供的[脚本](https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/upgrade/rollingUpdate.sh)配置协调器以活动-备用模式工作并启动滚动升级。

基于Kubernetes提供的滚动更新功能，上述脚本强制按其依赖关系顺序更新部署。此外，Milvus实现了一种机制，以确保其组件在升级期间与依赖它们的组件保持兼容，显著减少了潜在的服务停机时间。

该脚本仅适用于使用Helm安装的Milvus的升级。下面的表格列出了脚本中可用的命令标志。

| 参数       | 描述                                               | 默认值                      | 必需                |
| ---------- | -------------------------------------------------- | --------------------------- | -------------------- |
| `i`        | Milvus实例名称                                      | `None`                      | 是                   |
| `n`        | Milvus安装的命名空间                              | `default`                    | 否                   |
| `t`        | 目标Milvus版本                                    | `None`                      | 是                   |
| `w`        | 新的Milvus镜像标签                               | `milvusdb/milvus:v2.2.3`    | 是                   |
| `o`        | 操作                                               | `update`                    | 否                   |

一旦您确保Milvus实例中的所有部署都处于正常状态。您可以运行以下命令将Milvus实例升级到{{var.milvus_release_version}}。

```shell
sh rollingUpdate.sh -n default -i my-release -o update -t {{var.milvus_release_version}} -w 'milvusdb/milvus:v{{var.milvus_release_tag}}'
```

<div class="alert note">

1. 脚本**不适用于**使用**RocksMQ**安装的Milvus实例。
2. 脚本硬编码了部署的升级顺序，不能更改。
3. 脚本使用 `kubectl patch` 更新部署并使用 `kubectl rollout status` 查看它们的状态。
4. 脚本使用 `kubectl