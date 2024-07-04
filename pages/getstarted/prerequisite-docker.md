


# 使用 Docker Compose 安装要求清单

在安装 Milvus 之前，请检查你的硬件和软件是否满足要求。

## 硬件要求

| 组件        | 要求                                                       |推荐配置| 备注                                                         |
| ----------- | ---------------------------------------------------------- |--------| ------------------------------------------------------------ |
| CPU         | <ul> <li> Intel 第二代 Core CPU 或更高 </li> <li> Apple Silicon </li> </ul> |<ul> <li> 独立部署：4 核或更多 </li> <li> 集群部署：8 核或更多 </li> </ul>|  |
| CPU 指令集   | <ul> <li> SSE4.2 </li> <li> AVX </li> <li> AVX2 </li> <li> AVX-512 </li> </ul> |<ul> <li> SSE4.2 </li> <li> AVX </li> <li> AVX2 </li> <li> AVX-512 </li> </ul> |  Milvus 的向量相似性搜索和索引构建需要 CPU 支持单指令多数据（SIMD）扩展指令集。请确保 CPU 至少支持列表中的一种 SIMD 扩展。详细信息请参见 [支持 AVX 的 CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)。 |
| RAM         | <ul> <li> 独立部署：8G </li> <li> 集群部署：32G </li> </ul>          |<ul> <li> 独立部署：16G </li> <li> 集群部署：128G </li> </ul>            | RAM 的大小取决于数据量的大小。                                 |
| 硬盘        | SATA 3.0 SSD 或更高                                         | NVMe SSD 或更高 | 硬盘的大小取决于数据量的大小。                                |

## 软件要求

| 操作系统           | 软件                                                         | 备注                                                         |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| macOS 10.14 及更高版本 | Docker Desktop                                               | 将 Docker 虚拟机（VM）设置为使用最少 2 个虚拟 CPU（vCPU）和 8 GB 的初始内存。否则，安装可能失败。<br/> 更多信息请参见 [在 Mac 上安装 Docker Desktop](https://docs.docker.com/desktop/mac/install/)。 |
| Linux 平台            | <ul> <li> Docker 19.03 或更高版本 </li> <li> Docker Compose 1.25.1 或更高版本 </li> </ul> | 更多信息请参见 [安装 Docker Engine](https://docs.docker.com/engine/install/) 和 [安装 Docker Compose](https://docs.docker.com/compose/install/)。 |
| 启用 WSL 2 的 Windows 系统 | Docker Desktop                                               | 我们建议你将源代码和其他要绑定到 Linux 容器的数据存储在 Linux 文件系统中而不是 Windows 文件系统中。<br/> 更多信息请参见 [在启用 WSL 2 后端的 Windows 上安装 Docker Desktop](https://docs.docker.com/desktop/windows/install/#wsl-2-backend)。 |

| 软件     | 版本                         | 备注 |
| -------- | --------------------------- | ---- |
| etcd     | 3.5.0                       | 请参阅 [附加磁盘要求](#Additional-disk-requirements)。 |
| MinIO    | RELEASE.2023-03-20T20-16-18Z | |
| Pulsar   | 2.8.2                       | |

### 附加磁盘要求

磁盘性能对于 etcd 至关重要。强烈建议使用本地 NVMe SSD。较慢的磁盘响应可能导致频繁的集群选举，最终会破坏 etcd 服务。

你可以使用 [fio](https://github.com/axboe/fio) 测试磁盘是否符合要求。

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest
```

理想情况下，你的磁盘应达到 500 或以上的 IOPS，并且 99th 百分位的 fsync 延迟应在 10ms 以下。请阅读 etcd [文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks) 以获取更详细的要求。

## 下一步操作



- 如果你的硬件和软件符合要求，你可以：
  - [使用 Docker Compose 安装独立版的 Milvus](/getstarted/standalone/install_standalone-docker.md)
- 有关在安装 Milvus 时可以设置的参数，请参阅 [系统配置](/reference/sys_config/system_configuration.md)。

 