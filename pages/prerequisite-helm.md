
安装要求
===

在安装Milvus之前，请检查您的硬件和软件是否符合要求。

硬件要求
----

| Component | Requirement | Recommendation | Note |
| --- | --- | --- | --- |
| CPU | * 英特尔第二代酷睿CPU或更高
* Apple Silicon
 | * 独立部署: 8核或更多
* 集群部署: 16核或更多
 | Current version of Milvus does not support AMD CPUs. |
| CPU instruction set | * SSE4.2
* AVX
* AVX2
* AVX-512
 | * SSE4.2
* AVX
* AVX2
* AVX-512
 | Vector similarity search and index building within Milvus require CPU's support of single instruction, multiple data (SIMD) extension sets. Ensure that the CPU supports at least one of the SIMD extensions listed. See [支持AVX的CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX) for more information. |
| RAM | * 独立部署: 16G
* 集群部署: 64G
 | * 独立部署: 32G
* 集群部署: 128G
 | The size of RAM depends on the data volume. |
| Hard drive | SATA 3.0 SSD or higher | NVMe SSD or higher | The size of hard drive depends on the data volume. |

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

```
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest

```

理想情况下，您的磁盘应该达到500 IOPS以上，99th百分位的fsync延迟应该低于10ms。请阅读etcd[文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks)以获取更详细的要求。

下一步是什么
------

* If your hardware and software meet the requirements, you can:

	+ [Install Milvus standalone on Kubernetes](install_standalone-helm.md)
	+ [Install Milvus cluster on Kubernetes](install_cluster-helm.md)
* See [System Configuration](system_configuration.md) for parameters you can set while installing Milvus.
