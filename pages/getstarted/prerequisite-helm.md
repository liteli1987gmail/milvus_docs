


# 在 Kubernetes 上部署 Milvus 前的环境检查清单

在安装 Milvus 之前，请检查你的硬件和软件是否满足要求。

## 硬件要求

| 组件                 | 要求                                                     | 推荐 | 备注                                                         |
| -------------------- | -------------------------------------------------------- | ---- | ------------------------------------------------------------ |
| CPU                  | <ul> <li> Intel 第二代 Core CPU 或更高 </li> <li> Apple Silicon </li> </ul>  | <ul> <li> 独立部署：4 核或更多 </li> <li> 集群：8 核或更多 </li> </ul>         |                                                              |
| CPU 指令集            | <ul> <li> SSE4.2 </li> <li> AVX </li> <li> AVX2 </li> <li> AVX-512 </li> </ul> | <ul> <li> SSE4.2 </li> <li> AVX </li> <li> AVX2 </li> <li> AVX-512 </li> </ul> | Milvus 中的向量相似性搜索和索引构建需要 CPU 对单指令多数据(SIMD)扩展集的支持。请确保 CPU 支持上述指定的任意一种 SIMD 扩展集。有关更多信息，请参见 [支持 AVX 的 CPU](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX) |
| RAM                  | <ul> <li> 独立部署：8G </li> <li> 集群：32G </li> </ul>                 | <ul> <li> 独立部署：16G </li> <li> 集群：128G </li> </ul>                   | RAM 的大小取决于数据量                                       |
| 硬盘          | SATA 3.0 SSD 或 CloudStorage                                       | NVMe SSD 或更高级别                      | 硬盘的大小取决于数据量                                      |

## 软件要求

建议在 Linux 平台上运行 Kubernetes 集群。

kubectl 是 Kubernetes 的命令行工具。请使用与你的集群相差一个较小版本的 kubectl 版本。使用最新版本的 kubectl 有助于避免意外问题。

在本地运行 Kubernetes 集群时，需要 minikube。minikube 要求 Docker 作为依赖项。在使用 Helm 安装 Milvus 之前，请确保你安装了 Docker。有关更多信息，请参见 <a href="https://docs.docker.com/get-docker"> 获取 Docker </a>。

| 操作系统 | 软件                                        | 备注                                                         |
| -------- | ------------------------------------------- | ------------------------------------------------------------ |
| Linux    | <ul> <li> Kubernetes 1.16 或更高版本 </li> <li> kubectl </li> <li> Helm 3.0.0 或更高版本 </li> <li> minikube（用于 Milvus 独立部署）</li> <li> Docker 19.03 或更高版本（用于 Milvus 独立部署）</li> </ul> | 有关更多信息，请参见 [Helm 文档](https://helm.sh/docs/) |

| 软件     | 版本                          | 备注 |
| -------- | ----------------------------- | ---- |
| etcd     | 3.5.0                         | 有关更多磁盘要求，请参见 [附加磁盘要求](#Additional-disk-requirements) |
| MinIO    | RELEASE.2023-03-20T20-16-18Z |      |
| Pulsar   | 2.8.2                         |      |

### 附加磁盘要求

磁盘性能对于 etcd 来说至关重要。强烈建议使用本地 NVMe SSD。较慢的磁盘响应可能会导致频繁的集群选举，最终会降低 etcd 服务性能。

使用 [fio](https://github.com/axboe/fio) 测试磁盘是否符合要求。

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest
```

理想情况下，你的磁盘应达到 500 IOPS 以上，99th 百分位 fsync 延迟应低于 10 毫秒。请阅读 etcd [文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks) 了解更详细的要求。

## 下一步操作



- 如果你的硬件和软件满足要求，你可以：
  - [在 Kubernetes 上安装独立的 Milvus](/getstarted/standalone/install_standalone-helm.md)
  - [在 Kubernetes 上安装 Milvus 集群](/getstarted/cluster/install_cluster-helm.md)

- 查看 [System Configuration](/reference/sys_config/system_configuration.md) 以获取在安装 Milvus 时可以设置的参数。

