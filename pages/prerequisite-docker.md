Milvus使用Docker Compose的环境检查清单
=============================

在安装Milvus之前，请检查您的硬件和软件是否符合要求。

硬件要求
----

| 组件 | 要求 | 推荐配置 | 备注 |
| --- | --- | --- | --- |
| CPU | Intel第二代Core CPU或更高 或 Apple Silicon | 单机部署: 8核或更多 或 集群部署: 16核或更多 | 当前版本的Milvus不支持AMD CPU。 |
| CPU指令集 | SSE4.2 或 AVX 或 AVX2 或 AVX-512 | SSE4.2 或AVX 或AVX2 或AVX-512 | Milvus中的向量相似性搜索和索引构建需要CPU支持单指令多数据（SIMD）扩展集。请确保CPU支持列出的SIMD扩展集之一。有关更多信息，请参见[支持AVX的CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)。|
| RAM | 集群部署: 64G 或 单机部署: 32G | 单机部署: 16G 或 集群部署: 128G | RAM的大小取决于数据量。 |
| 硬盘 | SATA 3.0 SSD或更高 | NVMe SSD或更高 | 硬盘大小取决于数据量。 |

软件需求
----

| 操作系统 | 软件 | 备注 |
| --- | --- | --- |
| macOS 10.14或更高版本 | Docker桌面版 | 将Docker虚拟机（VM）设置为使用至少2个虚拟CPU（vCPUs）和8GB初始内存。否则，安装可能会失败。有关更多信息，请参见[在Mac上安装Docker桌面版](https://docs.docker.com/desktop/mac/install/)。 |
| Linux平台 |  Docker 19.03或更高版本或Docker Compose 1.25.1或更高版本| 有关更多信息，请参见[安装Docker引擎](https://docs.docker.com/engine/install/)和[安装Docker Compose](https://docs.docker.com/compose/install/)。 |
| 启用WSL 2的Windows | Docker桌面版 | 我们建议您将绑定到Linux容器中的源代码和其他数据存储在Linux文件系统中，而不是Windows文件系统中。有关更多信息，请参见[在Windows上使用WSL 2后端安装Docker桌面版](https://docs.docker.com/desktop/windows/install/#wsl-2-backend)。 |

| Software | Version | Note |
| --- | --- | --- |
| etcd | 3.5.0 | See [额外的磁盘要求](#Additional-disk-requirements). |
| MinIO | RELEASE.2023-03-20T20-16-18Z |  |
| Pulsar | 2.8.2 |  |

### 额外的磁盘要求

磁盘性能对于etcd非常重要。强烈建议使用本地NVMe SSD。较慢的磁盘响应可能导致频繁的集群选举，最终会降低etcd服务的性能。

使用[fio](https://github.com/axboe/fio)测试您的磁盘是否合格。

```python
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest

```

理想情况下，您的磁盘应达到超过500 IOPS，在99th百分位数的fsync延迟低于10ms。阅读etcd的[文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks)以了解更详细的要求。

接下来是什么
------

* 如果您的硬件和软件满足要求，您可以：

	+ [使用Docker Compose安装Milvus独立版本](install_standalone-docker.md)
	+ [使用Docker Compose安装Milvus集群版](install_cluster-docker.md)

* 有关在安装Milvus时可以设置的参数，请参见[系统配置](system_configuration.md)。
