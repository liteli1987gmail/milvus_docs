---
id: prerequisite-helm.md
label: 在Kubernetes上安装
related_key: Kubernetes
summary: 在使用Helm安装Milvus之前，了解必要的准备工作。
title: Milvus在Kubernetes上的环境检查清单
---

# Milvus在Kubernetes上的环境检查清单

在安装Milvus之前，请检查您的硬件和软件是否满足要求。

## 硬件要求

| 组件           | 要求                                                         | 推荐配置 | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |--------------| ------------------------------------------------------------ |
| CPU                 | <ul><li>Intel 第二代酷睿CPU或更高</li><li>Apple Silicon</li></ul>|<ul><li>单机：4核或更多</li><li>集群：8核或更多</li></ul>|  |
| CPU指令集 | <ul><li>SSE4.2</li><li>AVX</li><li>AVX2</li><li>AVX-512</li></ul> |<ul><li>SSE4.2</li><li>AVX</li><li>AVX2</li><li>AVX-512</li></ul> | Milvus中的向量相似性搜索和索引构建需要CPU支持单指令多数据（SIMD）扩展集。确保CPU至少支持所列SIMD扩展中的一个。有关更多信息，请参见[带有AVX的CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)。|
| RAM                 | <ul><li>单机：8G</li><li>集群：32G</li></ul>       |<ul><li>单机：16G</li><li>集群：128G</li></ul>        | RAM的大小取决于数据量。                  |
| 硬盘          | SATA 3.0 SSD或云存储                                       |NVMe SSD或更高 | 硬盘的大小取决于数据量。           |

## 软件要求

建议您在Linux平台上运行Kubernetes集群。

kubectl是Kubernetes的命令行工具。使用与您的集群相差一个小版本的kubectl版本。使用最新版本的kubectl有助于避免不可预见的问题。

当在本地运行Kubernetes集群时，需要minikube。minikube需要Docker作为依赖。在使用Helm安装Milvus之前，请确保您已安装Docker。有关更多信息，请参见<a href="https://docs.docker.com/get-docker">获取Docker</a>。

| 操作系统 | 软件                                                     | 说明                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Linux平台  | <ul><li>Kubernetes 1.16或更高</li><li>kubectl</li><li>Helm 3.0.0或更高</li><li>minikube（用于Milvus单机）</li><li>Docker 19.03或更高（用于Milvus单机）</li></ul> | 有关更多信息，请参见[Helm文档](https://helm.sh/docs/)。|

| 软件 | 版本                       | 说明 |
| -------- | ----------------------------- | ---- |
| etcd     | 3.5.0                         | 请参见[额外的磁盘要求](#额外的磁盘要求)。 |
| MinIO    |  RELEASE.2023-03-20T20-16-18Z | |
| Pulsar   | 2.8.2                         | |

### 额外的磁盘要求

磁盘性能对etcd至关重要。强烈建议您使用本地NVMe SSD。较慢的磁盘响应可能会导致频繁的集群选举，最终会降低etcd服务的质量。

要测试您的磁盘是否合格，请使用[fio](https://github.com/axboe/fio)。

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest
```

理想情况下，您的磁盘应该达到超过500 IOPS，并且对于99th百分位的fsync延迟低于10ms。有关更详细的要求，请阅读etcd [文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks)。

## 接下来做什么

- 如果您的硬件和软件满足要求，您可以：
  - [在Kubernetes上安装Milvus单机](install_standalone-helm.md)
  - [在Kubernetes上安装Milvus集群](install_cluster-helm.md)

- 有关在安装Milvus时可以设置的参数，请参见[系统配置](system_configuration.md)。