


# 使用 Helm Chart 升级 Milvus 独立版

本指南介绍如何使用 Milvus Helm Charts 升级 Milvus 独立版。

## 检查 Milvus 版本

运行以下命令以检查新的 Milvus 版本。

```
$ helm repo update
$ helm search repo zilliztech/milvus --versions
```

<div class="alert note">

Milvus Helm Charts 仓库 `https://milvus-io.github.io/milvus-helm/` 已经存档，你可以从 `https://zilliztech.github.io/milvus-helm/` 获取进一步的更新，步骤如下：

```shell
helm repo add zilliztech https://zilliztech.github.io/milvus-helm
helm repo update
# 升级现有的Helm发布
helm upgrade my-release zilliztech/milvus
```

存档的仓库仍可用于 4.0.31 版本之前的图表。对于更新版本，请使用新的仓库。

</div>

```                                       
名称                      图表版本    应用版本                         描述
zilliztech/milvus         4.1.29      2.4.0                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.24      2.3.11                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.23      2.3.10                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.22      2.3.10                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.21      2.3.10                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.20      2.3.10                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.18      2.3.10                          Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.18      2.3.9                           Milvus是一个开源的向量数据库 ...                                       
zilliztech/milvus         4.1.17      2.3.8                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.16      2.3.7                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.15      2.3.5                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.14      2.3.6                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.13      2.3.5                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.12      2.3.5                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.11      2.3.4                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.10      2.3.3                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.9       2.3.3                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.8       2.3.2                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.7       2.3.2                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.6       2.3.1                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.5       2.3.1                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.4       2.3.1                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.3       2.3.1                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.2       2.3.1                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.1       2.3.0                           Milvus是一个开源的向量数据库 ...
zilliztech/milvus         4.1.0       2.3.0                           Milvus是一个开源的向量数据库 ...
```

你可以选择以下方式升级 Milvus：

<div style="display: none;"> 从 Milvus v2.2.3 及更高版本升级到 v{{var.milvus_release_version}}进行 [滚动升级](#conduct-a-rolling-upgrade)。</div>

- 通过 Helm 升级 Milvus 进行 [升级](#Upgrade-Milvus-using-Helm)，从 v2.2.3 之前的较小版本升级到 v{{var.milvus_release_version}}。

- 在升级之前，从 Milvus v2.1.x 迁移元数据到 v{{var.milvus_release_version}}。

<div style="display:none;">

## 进行滚动升级
 


## Milvus 2.2.3 以后的版本支持滚动升级

自 Milvus 2.2.3 版本开始，你可以配置 Milvus 协调者工作在主备模式，并为协调者启用滚动升级功能，这样 Milvus 就可以在协调者升级期间响应传入的请求。在之前的版本中，升级过程需要删除并重新创建协调者，这可能导致服务停机。

滚动升级要求协调者以主备模式工作。你可以使用 [我们提供的脚本](https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/upgrade/rollingUpdate.sh) 将协调者配置为主备模式，并启动滚动升级。

基于 Kubernetes 提供的滚动更新功能，上述脚本按照组件的依赖关系强制执行部署的有序更新。此外，Milvus 实现了一种机制，确保其组件在升级过程中与依赖于它们的组件保持兼容，显著降低了潜在的服务停机时间。

该脚本仅适用于使用 Helm 安装的 Milvus 的升级。以下表格列出了脚本中可用的命令标志。

| 参数   | 描述                                         | 默认值                          | 是否必需             |
| ------ | ----------------------------------------------| -------------------------------| -------------------- |
| `i`    | Milvus 实例名称                               | `None`                          | 是                   |
| `n`    | Milvus 安装的命名空间                         | `default`                       | 否                   |
| `t`    | 目标 Milvus 版本                               | `None`                          | 是                   |
| `w`    | 新的 Milvus 镜像标签                           | `milvusdb/milvus:v2.2.3`        | 是                   |
| `o`    | 操作                                          | `update`                        | 否                   |

确保你的 Milvus 实例中的所有部署状态正常后，你可以运行以下命令将 Milvus 实例升级到 {{var.milvus_release_version}} 版本。

```shell
sh rollingUpdate.sh -n default -i my-release -o update -t {{var.milvus_release_version}} -w 'milvusdb/milvus:v{{var.milvus_release_tag}}'
```

<div class="alert note">

1. 该脚本 **不适用于** 使用 **RocksMQ** 安装的 Milvus 实例。
2. 该脚本硬编码了部署的升级顺序，无法更改。
3. 该脚本使用 `kubectl patch` 更新部署，并使用 `kubectl rollout status` 监视其状态。
4. 该脚本使用 `kubectl patch` 将部署的 `app.kubernetes.io/version` 标签更新为命令中 `-t` 标志之后指定的标签。

</div>
    
</div>

## 使用 Helm 升级 Milvus

要从 v2.2.3 之前的较小版本升级 Milvus 到最新版本，请运行以下命令：

```shell
helm repo update
helm upgrade my-release milvus/milvus --reuse-values --version={{var.milvus_helm_chart_version}} # 在这里使用 Helm chart 版本
```

在上述命令中使用 Helm chart 版本。有关如何获取 Helm chart 版本的详细信息，请参阅 [检查 Milvus 版本](#检查-Milvus-版本)。

## 迁移元数据

自 Milvus 2.2.0 版本开始，元数据与之前的版本不兼容。下面的示例代码段假设从 Milvus 2.1.4 版本升级到 Milvus 2.2.0 版本。

### 1. 检查 Milvus 版本

运行 `$ helm list` 命令检查你的 Milvus 应用版本。你可以看到 `APP VERSION` 为 2.1.4。

```
NAME             	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART        	APP VERSION     
my-release      	default  	1       	2022-11-21 15:41:25.51539 +0800 CST    	deployed	milvus-3.2.18	2.1.4
```

### 2. 检查运行中的 Pod

运行 `$ kubectl get pods` 命令检查运行中的 Pod。你可以看到以下输出。

```
NAME                                            READY   STATUS    RESTARTS   AGE
my-release-etcd-0                               1/1     Running   0          84s
my-release-milvus-standalone-75c599fffc-6rwlj   1/1     Running   0          84s
my-release-minio-744dd9586f-qngzv               1/1     Running   0          84s
```

### 3. 检查镜像标签

检查 Pod `my-release-milvus-proxy-6c548f787f-scspp` 的镜像标签。你可以看到你的 Milvus 集群的版本为 v2.1.4。

```shell
$ kubectl get pods my-release-milvus-proxy-6c548f787f-scspp -o=jsonpath='{$.spec.containers[0].image}'
# milvusdb/milvus:v2.1.4
```

### 4. 迁移元数据



Milvus 2.2 的一个重大变化是段索引的元数据结构。因此，在将 Milvus 从 v2.1.x 升级到 v2.2.0 时，你需要使用 Helm 迁移元数据。这里有一个 [迁移脚本](https://github.com/milvus-io/milvus/blob/master/deployments/migrate-meta/migrate.sh)，你可以使用它安全地迁移你的元数据。

此脚本仅适用于安装在 K8s 集群上的 Milvus。如果在过程中发生错误，请先使用回滚操作回滚到以前的版本。

下表列出了你可以用来进行元数据迁移的操作：

| 参数         | 描述                                                             | 默认值                             | 是否必须               |
| ------------ | ---------------------------------------------------------------- | ------------------------------ | ---------------------- |
| `i`          | Milvus 实例名称                                                   | `None`                           | 是                     |
| `n`          | Milvus 安装的命名空间                                           | `default`                        | 否                     |
| `s`          | 源 Milvus 版本                                                   | `None`                           | 是                     |
| `t`          | 目标 Milvus 版本                                                 | `None`                           | 是                     |
| `r`          | Milvus 元数据的根路径                                           | `by-dev`                         | 否                     |
| `w`          | 新的 Milvus 镜像标签                                               | `milvusdb/milvus:v2.2.0`         | 否                     |
| `m`          | 元数据迁移镜像标签                                               | `milvusdb/meta-migration:v2.2.0` | 否                     |
| `o`          | 元数据迁移操作                                                 | `migrate`                         | 否                     |
| `d`          | 迁移完成后是否删除迁移 pod                                        | `false`                          | 否                     |
| `c`          | 元数据迁移 pvc 使用的存储类                                        | `默认存储类`                        | 否                     |
| `e`          | Milvus 使用的 etcd 端点                                          | `与Milvus一起安装的etcd svc`       | 否                     |

#### 1. 迁移元数据

1. 下载 [迁移脚本](https://github.com/milvus-io/milvus/blob/master/deployments/migrate-meta/migrate.sh)。
2. 停止 Milvus 组件。Milvus etcd 中的任何活动会话都可能导致迁移失败。
3. 为 Milvus 元数据创建备份。
4. 迁移 Milvus 元数据。
5. 使用新镜像启动 Milvus 组件。

#### 2. 将 Milvus 从 v2.1.x 升级到{{var.milvus_release_version}}




以下命令假设你将 Milvus 从 v2.1.4 升级到{{var.milvus_release_version}}，请根据你的需求更改版本。

1. 指定 Milvus 实例名称、源 Milvus 版本和目标 Milvus 版本。

    ```
    ./migrate.sh -i my-release -s 2.1.4 -t {{var.milvus_release_version}}
    ```

2. 如果你的 Milvus 未安装在默认的 K8s 命名空间中，请使用 `-n` 指定命名空间。

    ```
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}}
    ```

3. 如果你的 Milvus 是使用自定义的 `rootpath` 安装的，请使用 `-r` 指定根路径。

    ```
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}} -r by-dev
    ```

4. 如果你的 Milvus 是使用自定义的 `image` 安装的，请使用 `-w` 指定镜像标签。

    ```
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}} -r by-dev -w milvusdb/milvus:v{{var.milvus_release_tag}}
    ```

5. 如果要在迁移完成后自动删除迁移 Pod，请设置 `-d true`。

    ```
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}} -w milvusdb/milvus:v{{var.milvus_release_tag}} -d true
    ```

6. 如果迁移失败，请回滚并重新迁移。

    ```
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}} -r by-dev -o rollback -w milvusdb/milvus:v2.1.1
    ./migrate.sh -i my-release -n milvus -s 2.1.4 -t {{var.milvus_release_version}} -r by-dev -o migrate -w milvusdb/milvus:v{{var.milvus_release_tag}}
    ```
    
