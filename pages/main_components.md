Milvus 有两种运行模式：独立模式和集群模式。这两种模式共享相同的功能。您可以选择最适合您的数据集大小、流量数据等的模式。目前，Milvus 独立模式无法“在线”升级到 Milvus 集群。

Milvus 独立模式
-----------------

Milvus 独立模式包括三个组件：

* **Milvus：**核心的功能组件。
* **etcd：**元数据引擎，负责访问和存储 Milvus 的内部组件的元数据，包括代理、索引节点等。
* **MinIO：**存储引擎，负责 Milvus 的数据持久化。

[![Standalone_architecture](https://milvus.io/static/22c93b85a150b10a2791cc4aaeabe475/0a251/standalone_architecture.jpg "Milvus 独立模式架构。")](https://milvus.io/static/22c93b85a150b10a2791cc4aaeabe475/dcc81/standalone_architecture.jpg)

Milvus 独立模式架构图。

Milvus 集群模式
---------------

**Milvus 集群模式**包括八个微服务组件和三个第三方依赖项。所有微服务可以独立于 Kubernetes 部署。

### 微服务组件

* 根协调器
* 代理
* 查询协调器
* 查询节点
* 索引协调器
* 索引节点
* 数据协调器
* 数据节点

### 第三方依赖

* **etcd：**存储集群中各组件的元数据。

* **MinIO：**负责集群中大文件的数据持久化，例如索引和二进制日志文件。

* **Pulsar：**管理最近的变异操作日志，输出流日志，并提供日志发布订阅服务。

[![Distributed_architecture](https://milvus.io/static/3f6494a221ad7747a166d851ae4b11c1/0a251/distributed_architecture.jpg "Milvus 集群模式架构。")](https://milvus.io/static/3f6494a221ad7747a166d
