


# 主要组件

运行 Milvus 有两种模式：独立模式和集群模式。这两种模式共享相同的功能。你可以根据数据集大小、流量数据等选择最适合你的模式。目前，Milvus 独立模式无法“在线”升级为 Milvus 集群。

## Milvus 独立模式

Milvus 独立模式包括三个组件：

- **Milvus：** 核心功能组件。

- **etcd：** 元数据引擎，用于访问和存储 Milvus 内部组件的元数据，包括代理、索引节点等。

- **MinIO：** 存储引擎，负责 Milvus 的数据持久化。

![独立模式架构](/assets/standalone_architecture.jpg "Milvus独立模式架构。")

## Milvus 集群模式

**Milvus 集群模式** 包括八个微服务组件和三个第三方依赖项。所有微服务组件可以独立于彼此部署在 Kubernetes 上。

### 微服务组件

- 根协调者
- 代理
- 查询协调者
- 查询节点
- 索引协调者
- 索引节点
- 数据协调者
- 数据节点

### 第三方依赖项

- **etcd：** 存储集群中各个组件的元数据。
- **MinIO：** 负责集群中大文件的数据持久化，例如索引和二进制日志文件。
- **Pulsar：** 管理最近的变更操作日志，输出流式日志，并提供日志发布-订阅服务。

![集群模式架构](/assets/distributed_architecture.jpg "Milvus集群模式架构。")

## 接下来做什么






- 阅读 [Computing/Storage Disaggregation](/reference/architecture/four_layers.md) 以了解 Milvus 的机制和设计原则。
