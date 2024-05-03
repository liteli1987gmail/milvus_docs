---
id: operational_faq.md
summary: 常见操作问题解答.
title: Operational FAQ
---

# 常见操作问题解答

## 目录

<!-- TOC -->

<!-- /TOC -->

### 如果我无法从 Docker Hub 拉取 Milvus Docker 镜像怎么办？

如果你无法从 Docker Hub 拉取 Milvus Docker 镜像，尝试添加其他注册表镜像。

中国大陆的用户可以在 **/etc/docker/daemon.json** 中的 registry-mirrors 数组中添加 URL "https://registry.docker-cn.com"。

```json
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```

### Docker 是安装和运行 Milvus 的唯一方式吗？

Docker 是部署 Milvus 的有效方式，但不是唯一方式。你也可以从源代码部署 Milvus。这需要 Ubuntu（18.04 或更高版本）或 CentOS（7 或更高版本）。更多信息，请参见 [从源代码构建 Milvus](https://github.com/milvus-io/milvus#build-milvus-from-source-code)。

### 影响召回率的主要因素是什么？

召回率主要受索引类型和搜索参数的影响。

对于 FLAT 索引，Milvus 在集合内进行全面扫描，召回率为 100%。

对于 IVF 索引，nprobe 参数决定了在集合内搜索的范围。增加 nprobe 可以增加搜索的向量比例和召回率，但会降低查询性能。

对于 HNSW 索引，ef 参数决定了图形搜索的广度。增加 ef 可以增加在图形上搜索的点的数量和召回率，但会降低查询性能。

更多信息，请参见 [向量索引](https://www.zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)。

### 为什么我对配置文件的更改没有生效？

Milvus 不支持在运行时修改配置文件。你必须重启 Milvus Docker，配置文件的更改才能生效。

### 我如何知道 Milvus 是否已成功启动？

如果使用 Docker Compose 启动 Milvus，运行 `docker ps` 查看正在运行的 Docker 容器数量，并检查 Milvus 服务是否已正确启动。

对于独立部署的 Milvus，你应该能够观察到至少三个正在运行的 Docker 容器，其中一个是 Milvus 服务，另外两个是 etcd 管理和存储服务。更多信息，请参见 [安装独立部署的 Milvus](install_standalone-docker.md)。

### 日志文件中的时间与系统时间为什么不同？

时间差异通常是因为宿主机不使用协调世界时（UTC）。

Docker 镜像内的日志文件默认使用 UTC。如果你的宿主机不使用 UTC，可能会出现这个问题。

### 如何知道我的 CPU 是否支持 Milvus？

{{fragments/cpu_support.md}}

### 为什么 Milvus 在启动时返回 `illegal instruction`？

Milvus 需要你的 CPU 支持 SIMD 指令集：SSE4.2、AVX、AVX2 或 AVX512。CPU 必须至少支持这些中的一个，以确保 Milvus 正常运行。如果在启动时返回了 `illegal instruction` 错误，这表明你的 CPU 不支持上述四种指令集中的任何一种。

请参见 [CPU 对 SIMD 指令集的支持](prerequisite-docker.md)。

### 我可以安装 Milvus 在 Windows 上吗？

可以。你可以通过从源代码编译或从二进制包安装在 Windows 上安装 Milvus。

请参见 [在 Windows 上运行 Milvus](https://milvus.io/blog/2021-11-19-run-milvus-2.0-on-windows.md) 了解如何在 Windows 上安装 Milvus。

### 在 Windows 上安装 pymilvus 时出现错误怎么办？

不建议在 Windows 上安装 PyMilvus。但如果你不得不在 Windows 上安装 PyMilvus 并且遇到了错误，尝试在 [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) 环境中安装它。有关如何在 Conda 环境中安装 PyMilvus 的更多信息，请参见 [安装 Milvus SDK](install-pymilvus.md)。

### 我可以断开互联网连接后部署 Milvus 吗？

可以。你可以在离线环境中安装 Milvus。更多信息，请参见 [离线安装 Milvus](install_offline-helm.md)。

### 我在哪里可以找到 Milvus 生成的日志？

默认情况下，Milvus 日志会打印到 stout（标准输出）和 stderr（标准错误），但我们强烈建议在生产环境中将日志重定向到持久卷。为此，更新 **milvus.yaml** 中的 `log.file.rootPath`。如果你使用 `milvus-helm` 图表部署 Milvus，你还需要通过 `--set log.persistence.enabled=true` 首先启用日志持久性。
如果你没有更改配置，使用 kubectl logs <pod-name> 或 docker logs CONTAINER 也可以帮助你找到日志。

#### 在插入数据之前，我可以为段创建索引吗？

可以。但我们建议在为每个数据段创建索引之前，分批插入数据，每批不应超过 256 MB。

#### 能否在多个 Milvus 实例之间共享一个 etcd 实例？

可以，您可以在多个 Milvus 实例之间共享一个 etcd 实例。为此，在启动每个 Milvus 实例之前，需要在每个实例的配置文件中将 `etcd.rootPath` 更改为单独的值。

#### 我可以在多个 Milvus 实例之间共享一个 Pulsar 实例吗？

可以，你可以在多个 Milvus 实例之间共享一个 Pulsar 实例。为此，您可以

- 如果在 Pulsar 实例上启用了多租户，考虑为每个 Milvus 实例分配一个单独的租户或命名空间。为此，你需要在启动 Milvus 实例之前，将其配置文件中的 `pulsar.tenant` 或 `pulsar.namespace` 更改为每个实例的唯一值。
- 如果不打算在 Pulsar 实例上启用多租户，请考虑在启动 Milvus 实例之前，将其配置文件中的 `msgChannel.chanNamePrefix.cluster` 更改为每个实例的唯一值。

#### 我可以在多个 Milvus 实例之间共享 MinIO 实例吗？

可以，您可以在多个 Milvus 实例之间共享一个 MinIO 实例。为此，您需要在启动每个 Milvus 实例之前，在每个实例的配置文件中将 `minio.rootPath` 更改为唯一值。

#### 仍有问题？

您可以

- 查看 GitHub 上的 [Milvus](https://github.com/milvus-io/milvus/issues)。随时提问、分享想法并帮助他人。
- 加入我们的[Milvus 论坛](https://discuss.milvus.io/) 或[Slack 频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk) 以寻求支持并参与我们的开源社区。