


# 常见运维问题解答

#### 如果无法从 Docker Hub 拉取 Milvus Docker 镜像怎么办？

如果无法从 Docker Hub 拉取 Milvus Docker 镜像，请尝试添加其他镜像源。

中国大陆用户可以将 URL "https://registry.docker-cn.com" 添加到 **/etc.docker/daemon.json** 中的 registry-mirrors 数组中。

```
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```

#### 安装和运行 Milvus 的唯一方式是使用 Docker 吗？

Docker 是部署 Milvus 的一种高效方式，但不是唯一的方式。你也可以从源代码部署 Milvus。这需要 Ubuntu（18.04 或更高版本）或 CentOS（7 或更高版本）。详细信息请参见 [从源代码构建 Milvus](https://github.com/milvus-io/milvus#build-milvus-from-source-code)。

#### 影响召回率的主要因素有哪些？

召回率主要受索引类型和搜索参数的影响。

对于 FLAT 索引，Milvus 在集合中进行全面扫描，返回 100%。

对于 IVF 索引，nprobe 参数确定了在集合中进行搜索的范围。增加 nprobe 可以增加搜索向量和召回率的比例，但会降低查询性能。

对于 HNSW 索引，ef 参数确定了图搜索的广度。增加 ef 可以增加在图上搜索的点的数量和召回率，但会降低查询性能。

更多信息，请参见 [向量索引](https://www.zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)。

#### 为什么对配置文件进行的更改没有生效？

Milvus 不支持在运行时修改配置文件。你必须重新启动 Milvus Docker 才能使配置文件更改生效。

#### 如何知道 Milvus 是否成功启动？

如果使用 Docker Compose 启动了 Milvus，请运行 `docker ps` 来观察有多少个 Docker 容器正在运行并检查 Milvus 服务是否已正确启动。

对于 Milvus 独立版，你应该能够观察到至少三个正在运行的 Docker 容器，一个是 Milvus 服务，另外两个是 etcd 管理和存储服务。更多信息，请参见 [安装 Milvus 独立版](/getstarted/standalone/install_standalone-docker.md)。

#### 日志文件中的时间与系统时间不同怎么办？

时间差通常是由于主机机器不使用协调世界时（UTC）造成的。

Docker 映像内部的日志文件默认使用 UTC。如果你的主机机器不使用 UTC，可能会出现此问题。

#### 如何知道我的 CPU 是否支持 Milvus？

{{fragments/cpu_support.md}}

#### 启动时为什么 Milvus 返回“illegal instruction”错误？

Milvus 要求你的 CPU 支持 SIMD 指令集：SSE4.2、AVX、AVX2 或 AVX512。CPU 必须至少支持其中之一，以确保 Milvus 正常运行。在启动过程中返回“illegal instruction”错误意味着你的 CPU 不支持上述四个指令集中的任何一个。

参见 [CPU 对 SIMD 指令集的支持](/getstarted/prerequisite-docker.md)。

#### 我可以在 Windows 上安装 Milvus 吗？

可以。你可以通过从源代码编译或使用二进制包在 Windows 上安装 Milvus。

请参见 [在 Windows 上运行 Milvus](https://milvus.io/blog/2021-11-19-run-milvus-2.0-on-windows.md) 了解如何在 Windows 上安装 Milvus。

#### 在 Windows 上安装 pymilvus 时遇到错误，该怎么办？

不建议在 Windows 上安装 PyMilvus。但如果你必须在 Windows 上安装 PyMilvus 但遇到错误，请尝试在 [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) 环境中安装它。有关如何在 Conda 环境中安装 PyMilvus 的更多信息，请参见 [安装 Milvus SDK](install-pymilvus.md)。

#### 在断网的情况下可以部署 Milvus 吗？

可以。你可以在离线环境中安装 Milvus。有关更多信息，请参见 [离线安装 Milvus](/getstarted/offline/install_offline-helm.md)。

#### 我在哪里可以找到 Milvus 生成的日志？

Milvus 的日志默认打印到标准输出（stdout）和标准错误输出（stderr），但我们强烈建议将日志重定向到持久卷中以用于生产环境。要这样做，请更新 **milvus.yaml** 中的 `log.file.rootPath`。如果你使用 `milvus-helm` 图表部署 Milvus，你还需要通过 `--set log.persistence.enabled=true` 启用日志持久化。 

如果你未更改配置，请使用 kubectl logs <pod-name> 或 docker logs CONTAINER 来查找日志。

#### 是否可以在插入数据之前为段创建索引？

是的，可以。但我们建议在为每个段创建索引之前，将数据分批插入，每个批次的数据不应超过 256 MB。

#### 是否可以在多个 Milvus 实例之间共享一个 etcd 实例？

是的，你可以在多个 Milvus 实例之间共享一个 etcd 实例。要做到这一点，你需要在每个 Milvus 实例的配置文件中将 `etcd.rootPath` 更改为不同的值，然后再启动它们。

#### 是否可以在多个 Milvus 实例之间共享一个 Pulsar 实例？
 


# 


是的，你可以将一个 Pulsar 实例共享给多个 Milvus 实例。为此，你可以使用以下方法：

- 如果你的 Pulsar 实例启用了多租户，考虑为每个 Milvus 实例分配一个单独的租户或命名空间。为此，在启动 Milvus 实例之前，你需要在 Milvus 实例的配置文件中将 `pulsar.tenant` 或 `pulsar.namespace` 更改为每个实例的唯一值。
- 如果你不打算在 Pulsar 实例上启用多租户功能，请在启动每个 Milvus 实例之前，在其配置文件中将 `msgChannel.chanNamePrefix.cluster` 更改为每个实例的唯一值。

#### 我可以将一个 MinIO 实例共享给多个 Milvus 实例吗？

是的，你可以将一个 MinIO 实例共享给多个 Milvus 实例。为此，在启动每个 Milvus 实例之前，在各自的配置文件中将 `minio.rootPath` 更改为每个 Milvus 实例的唯一值。

#### 仍然有问题吗？



你可以：

- 查看 [Milvus](https://github.com/milvus-io/milvus/issues) 的 GitHub 页面。欢迎提问、分享想法和帮助他人。
- 加入我们的 [Milvus 讨论区](https://discuss.milvus.io/) 或 [Slack 频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk) 寻求支持并与我们的开源社区互动。