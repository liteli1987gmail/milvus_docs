#操作问题QA

#### 若从Docker Hub下载Milvus Docker镜像失败怎么办？

若从Docker Hub下载Milvus Docker镜像失败，请尝试添加其他注册表镜像。

中国大陆用户可以在 **/etc.docker/daemon.json** 中注册镜像中添加URL "<https://registry.docker-cn.com>"。

```bash
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}

```

#### Docker是安装和运行Milvus的唯一方式吗？

Docker是部署Milvus的一种高效方式，但不是唯一方式。您还可以从源代码部署Milvus。这需要Ubuntu（18.04或更高版本）或CentOS（7或更高版本）。请参阅[构建来自源代码的Milvus](https://github.com/milvus-io/milvus#build-milvus-from-source-code)获得更多信息。

#### 影响召回的主要因素是什么？

召回主要受索引类型和搜索参数的影响。

对于FLAT索引，Milvus在集合内进行全面扫描，回传100％的向量。

对于IVF索引，nprobe参数决定集合内搜索的范围。增加nprobe将增加搜索过的向量的比例和召回率，但会降低查询性能。

对于HNSW索引，ef参数决定图搜索的广度。增加ef将增加图上搜索的点的数量和召回率，但会降低查询性能。

有关更多信息，请参见[向量索引](https://www.zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)。

#### 为什么我的配置文件更改不生效？

Milvus不支持在运行时修改配置文件。您必须重新启动Milvus Docker以使配置文件更改生效。

#### 如何知道Milvus是否成功启动？

如果使用Docker Compose启动Milvus，请运行 `docker ps` 来观察有多少个Docker容器正在运行，并检查Milvus服务是否已正确启动。

对于Milvus独立版，您应该能够观察到至少三个正在运行的Docker容器，一个是Milvus服务，另外两个是etcd管理和存储服务。有关更多信息，请参见[安装Milvus独立版](install_standalone-docker.md)。

#### 为什么日志文件中的时间与系统时间不同？

时间差通常是由于主机计算机未使用世界标准时间（UTC）造成的。

Docker映像内的日志文件默认使用UTC。如果您的主机计算机未使用UTC，则可能会出现此问题。

#### 我应如何知道我的CPU是否支持Milvus？

Milvus的计算操作取决于CPU对SIMD（Single Instruction，Multiple Data）扩展指令集的支持。您的CPU是否支持SIMD扩展指令集对于Milvus内的索引构建和向量相似性搜索至关重要。确保您的CPU至少支持以下SIMD指令集之一：

* SSE4.2
* AVX
* AVX2
* AVX512

运行lscpu命令检查您的CPU是否支持上述SIMD指令集：

```bash
$ lscpu | grep -e sse4_2 -e avx -e avx2 -e avx512

```

#### 为什么Milvus在启动时返回“非法指令”？

Milvus要求您的CPU支持SIMD指令集：SSE4.2、AVX、AVX2或AVX512。CPU必须支持其中至少一个以确保Milvus正常运行。在启动期间返回“非法指令”错误表示您的CPU不支持上述四个指令集中的任何一个。

请参阅[SIMD Instruction Set的CPU支持](prerequisite-docker.md)。

#### 我能在Windows上安装Milvus吗？

可以。您可以通过从源代码编译或二进制包安装Milvus在Windows上安装Milvus。

请参阅[在Windows上运行Milvus](https://milvus.io/blog/2021-11-19-run-milvus-2.0-on-windows.md)以了解如何在Windows上安装Milvus。

#### 在Windows上安装pymilvus时遇到错误，我该怎么办？

不建议在Windows上安装PyMilvus。但如果您必须在Windows上安装PyMilvus但遇到错误，请尝试在[Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index）环境中安装。请参阅[安装Milvus SDK](install-pymilvus.md)以了解有关在Conda环境中安装PyMilvus的更多信息。

#### 我可以在未连接到Internet的情况下部署Milvus吗？

可以。您可以在离线环境中安装Milvus。请参阅[离线安装Milvus](install_offline-docker.md)以了解更多信息。

#### 我在哪里可以找到Milvus生成的日志？

Milvus日志默认会打印到主机计算机的标准输出（stout）和标准错误（stderr），但我们强烈建议在生产环境中将日志重定向到持久卷。要这样做，请更新**milvus.yaml** 中的 `log.file.rootPath`。如果您使用 `milvus-helm` 图表部署Milvus，则还需要通过 `--set log.persistence.enabled=true` 启用日志持久性。

如果您没有更改配置，则使用kubectl日志或docker日志CONTAINER也可以帮助您找到日志。

#### 我可以在将数据插入到段之前创建段的索引吗？

可以。但我们建议在为每个段索引之前按批次插入数据，每个批次不超过256 MB。

#### 我可以在多个Milvus实例之间共享etcd实例吗？

可以。要这样做，您需要在每个Milvus实例的配置文件中将 `etcd.rootPath` 更改为不同的值，然后启动它们。

#### 我可以在多个Milvus实例之间共享Pulsar实例吗？

可以。要这样做，您可以：

* 如果在您的Pulsar实例上启用了多租户，请考虑为每个Milvus实例分配一个单独的租户或命名空间。要这样做，请在您的Milvus实例的配置文件中将 `pulsar.tenant` 或 `pulsar.namespace` 更改为每个实例的唯一值，然后启动它们。
* 如果您不打算在Pulsar实例上启用多租户，请考虑将 `msgChannel.chanNamePrefix.cluster` 在您的Milvus实例的配置文件中更改为每个实例的唯一值，然后启动它们。

#### 我可以在多个Milvus实例之间共享MinIO实例吗？

可以。要这样做，您需要在每个Milvus实例的配置文件中将 `minio.rootPath` 更改为每个实例的唯一值，然后启动它们。

#### 还有其他问题吗？

您可以：

* 在GitHub上查看[Milvus](https://github.com/milvus-io/milvus/issues)。请随时提问、分享想法并帮助其他人。
* 加入我们的[Milvus论坛](https://discuss.milvus.io/)或[Slack频道](https://join.slack.com/t