---
id: main_components.md
summary: Learn about the main components in Milvus standalone and cluster.
title: Main Components
---

# 主要组件

运行 Milvus 有两种模式：独立模式和集群模式。这两种模式具有相同的功能。你可以根据你的数据集大小、流量数据等选择最适合你的模式。目前，Milvus 独立模式不能在线升级到 Milvus 集群模式。

## Milvus 独立模式

Milvus 独立模式包括三个组件：

- **Milvus:** 核心功能组件。

- **etcd:** 元数据引擎，用于访问和存储 Milvus 内部组件的元数据，包括代理、索引节点等。

- **MinIO:** 存储引擎，负责 Milvus 的数据持久化。

![独立架构](/public/assets/standalone_architecture.jpg "Milvus 独立架构。")

## Milvus 集群模式

**Milvus 集群** 包括八个微服务组件和三个第三方依赖。所有微服务都可以在 Kubernetes 上独立部署。

### 微服务组件

- Root coord
- 代理 (Proxy)
- Query coord
- Query node
- Index coord
- Index node
- Data coord
- Data node

### 第三方依赖

- **etcd:** 在集群中存储各种组件的元数据。
- **MinIO:** 负责集群中大型文件的数据持久化，如索引和二进制日志文件。
- **Pulsar:** 管理最近的变更操作日志，输出流日志，并提供日志发布-订阅服务。

![分布式架构](/public/assets/distributed_architecture.jpg "Milvus 集群架构。")

## 接下来

- 阅读 [计算/存储解耦](four_layers.md) 以了解 Milvus 的机制和设计原则。
