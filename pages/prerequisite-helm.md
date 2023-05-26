
安装要求
===

在安装Milvus之前，请检查您的硬件和软件是否符合要求。

硬件要求
----

| 组件 | 要求 | 推荐配置 | 备注 |
| --- | --- | --- | --- |
| CPU | Intel第二代Core CPU或更高 或 Apple Silicon |  单机部署: 8核或更多 或  集群部署: 16核或更多 | 当前版本的Milvus不支持AMD CPU。 |
| CPU指令集 | SSE4.2 或  AVX 或  AVX2 或  AVX-512 |  SSE4.2 或  AVX 或  AVX2 或  AVX-512 | Milvus中的向量相似性搜索和索引构建需要CPU支持单指令多数据（SIMD）扩展集。请确保CPU支持列出的SIMD扩展集之一。有关更多信息，请参见[支持AVX的CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)。|
| RAM | 集群部署: 64G 或  单机部署: 32G | 单机部署: 16G 或  集群部署: 128G | RAM的大小取决于数据量。 |
| 硬盘 | SATA 3.0 SSD或更高 | NVMe SSD或更高 | 硬盘大小取决于数据量。 |

软件要求
----

建议在Linux平台上运行Kubernetes集群。

kubectl是Kubernetes的命令行工具。使用一个与您的集群相差不超过一个次要版本的kubectl版本。使用最新版本的kubectl有助于避免意外问题。

在本地运行Kubernetes集群时需要minikube。minikube需要Docker作为依赖。在安装Helm之前，请确保您已安装Docker。详见[获取Docker](https://docs.docker.com/get-docker)。

| Operating system | Software | Note |
| --- | --- | --- |
| Linux platforms | * Kubernetes 1.16或更高版本
* kubectl
* Helm 3.0.0或更高版本
* minikube（用于Milvus独立版）
* Docker 19.03或更高版本（用于Milvus独立版）
 | See [Helm文档](https://helm.sh/docs/) for more information. |

| Software | Version | Note |
| --- | --- | --- |
| etcd | 3.5.0 | See [额外磁盘需求](#Additional-disk-requirements). |
| MinIO | RELEASE.2023-03-20T20-16-18Z |  |
| Pulsar | 2.8.2 |  |

### 额外磁盘需求

磁盘性能对于etcd非常关键。强烈建议您使用本地NVMe SSD。较慢的磁盘响应可能会导致频繁的群集选举，最终会降低etcd服务的性能。

要测试您的磁盘是否符合要求，请使用[fio](https://github.com/axboe/fio)。

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest

```

理想情况下，您的磁盘应该达到500 IOPS以上，99th百分位的fsync延迟应该低于10ms。请阅读etcd[文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks)以获取更详细的要求。

下一步是什么
------

* 如果您的硬件和软件符合要求，您可以：

	+ [在Kubernetes上安装单机版Milvus](install_standalone-helm.md)
	+ [在Kubernetes上安装集群版Milvus](install_cluster-helm.md)
* 有关在安装Milvus时可以设置的参数，请参见[系统配置](system_configuration.md)。
