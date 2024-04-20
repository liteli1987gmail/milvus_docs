---
title: Milvus与Docker Compose的环境检查清单
---

# Milvus与Docker Compose的环境检查清单

在安装Milvus之前，请检查您的硬件和软件是否满足要求。

## 硬件要求

| 组件           | 要求                                                         | 推荐            | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |--------------| ------------------------------------------------------------ |
| CPU                 | <ul><li>Intel第2代Core CPU或更高</li><li>Apple Silicon</li></ul>  |<ul><li>单机：4核或更多</li><li>集群：8核或更多</li></ul>|  |
| CPU指令集 | <ul><li>SSE4.2</li><li>AVX</li><li>AVX2</li><li>AVX-512</li></ul> |<ul><li>SSE4.2</li><li>AVX</li><li>AVX2</li><li>AVX-512</li></ul> |  在Milvus中进行矢量相似性搜索和索引构建需要CPU支持单指令多数据（SIMD）扩展集。确保CPU至少支持所列SIMD扩展中的一种。有关更多信息，请参见[具有AVX的CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)。 |
| RAM                 | <ul><li>单机：8G</li><li>集群：32G</li></ul>       |<ul><li>单机：16G</li><li>集群：128G</li></ul>        | RAM的大小取决于数据量。                  |
| 硬盘          | SATA 3.0 SSD或更高                                       | NVMe SSD或更高 | 硬盘的大小取决于数据量。           |

## 软件要求

| 操作系统           | 软件                                                     | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| macOS 10.14或更高       | Docker Desktop                                               | 将Docker虚拟机（VM）设置为使用至少2个虚拟CPU（vCPU）和8 GB的初始内存。否则，安装可能会失败。有关更多信息，请参见[在Mac上安装Docker Desktop](https://docs.docker.com/desktop/mac/install/)。 |
| Linux平台            | <ul><li>Docker 19.03或更高</li><li>Docker Compose 1.25.1或更高</li></ul> | 有关更多信息，请参见[安装Docker Engine](https://docs.docker.com/engine/install/)和[安装Docker Compose](https://docs.docker.com/compose/install/)。 |
| 启用WSL 2的Windows | Docker Desktop                                               | 我们建议您将源代码和其他绑定到Linux容器中的数据存储在Linux文件系统中，而不是Windows文件系统中。有关更多信息，请参见[在Windows上安装Docker Desktop，后端为WSL 2](https://docs.docker.com/desktop/windows/install/#wsl-2-backend)。 |

| 软件 | 版本                       | 说明 |
| -------- | ----------------------------- | ---- |
| etcd     | 3.5.0                         |  有关更多磁盘要求，请参见[额外的磁盘要求](#额外的磁盘要求)。 |
| MinIO    |  RELEASE.2023-03-20T20-16-18Z | |
| Pulsar   | 2.8.2                         | |

### 额外的磁盘要求

磁盘性能对etcd至关重要。强烈建议您使用本地NVMe SSD。较慢的磁盘响应可能会导致频繁的集群选举，这最终会降低etcd服务的质量。

要测试您的磁盘是否合格，请使用[fio](https://github.com/axboe/fio)。

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest
```

理想情况下，您的磁盘应达到每秒超过500次IOPS，并在99th百分位的fsync延迟下低于10ms。有关更详细的要求，请阅读etcd [文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks)。

## 接下来是什么

- 如果您的硬件和软件满足要求，您可以：
  - [使用Docker Compose安装Milvus单机](install_standalone-docker.md)

- 有关在安装Milvus时可以设置的参数，请参见[系统配置](system_configuration.md)。