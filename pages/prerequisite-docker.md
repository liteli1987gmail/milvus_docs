Milvus使用Docker Compose的环境检查清单
=============================

在安装Milvus之前，请检查您的硬件和软件是否符合要求。

硬件要求
----

| Component | Requirement | Recommendation | Note |
| --- | --- | --- | --- |
| CPU | * Intel 第二代 Core CPU 或更高版本
* Apple Silicon
 | * 独立部署：8 核或更多
* 集群部署：16 核或更多
 | Current version of Milvus does not support AMD CPUs. |
| CPU instruction set | * SSE4.2
* AVX
* AVX2
* AVX-512
 | * SSE4.2
* AVX
* AVX2
* AVX-512
 | Vector similarity search and index building within Milvus require CPU's support of single instruction, multiple data (SIMD) extension sets. Ensure that the CPU supports at least one of the SIMD extensions listed. See [支持 AVX 的 CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX) for more information. |
| RAM | * 独立部署：16G
* 集群部署：64G
 | * 独立部署：32G
* 集群部署：128G
 | The size of RAM depends on the data volume. |
| Hard drive | SATA 3.0 SSD or higher | NVMe SSD or higher | The size of hard drive depends on the data volume. |

软件需求
----

| Operating system | Software | Note |
| --- | --- | --- |
| macOS 10.14 or later | Docker Desktop | Set the Docker virtual machine (VM) to use a minimum of 2 virtual CPUs (vCPUs) and 8 GB of initial memory. Otherwise, installation might fail. See [在Mac上安装Docker桌面版](https://docs.docker.com/desktop/mac/install/) for more information. |
| Linux platforms | * Docker 19.03或更高版本
* Docker Compose 1.25.1或更高版本
 | See [安装Docker引擎](https://docs.docker.com/engine/install/) and [安装Docker Compose](https://docs.docker.com/compose/install/) for more information. |
| Windows with WSL 2 enabled | Docker Desktop | We recommend that you store source code and other data bind-mounted into Linux containers in the Linux file system instead of the Windows file system.See [在Windows上使用WSL 2后端安装Docker桌面版](https://docs.docker.com/desktop/windows/install/#wsl-2-backend) for more information. |

| Software | Version | Note |
| --- | --- | --- |
| etcd | 3.5.0 | See [额外的磁盘要求](#Additional-disk-requirements). |
| MinIO | RELEASE.2023-03-20T20-16-18Z |  |
| Pulsar | 2.8.2 |  |

### 额外的磁盘要求

磁盘性能对于etcd非常重要。强烈建议使用本地NVMe SSD。较慢的磁盘响应可能导致频繁的集群选举，最终会降低etcd服务的性能。

使用[fio](https://github.com/axboe/fio)测试您的磁盘是否合格。

```
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
