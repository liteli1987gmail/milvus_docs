Milvus架构
====

Milvus采用包括Faiss、Annoy、HNSW等流行向量搜索库，旨在对包含数百万、数十亿甚至数万亿向量的密集向量数据集进行相似度搜索。在继续之前，请熟悉嵌入式检索的[基本原则（basic principles）](glossary.md)。

Milvus还支持数据分片（data sharding）、数据持久性（data persistence）、流式数据摄入、向量和标量之间的混合搜索、时间旅行等许多其他高级功能。该平台可按需提供性能并可优化以适应任何嵌入式检索场景。我们建议使用Kubernetes部署Milvus以获得最佳可用性和弹性。

Milvus采用共享存储架构，对其计算节点实现了存储和计算分离以及水平可扩展性。
遵循数据平面和控制平面分离原则，Milvus包括[四个层（four layers）](four_layers.md)：访问层（access layer）、协调服务（coordinator service）、工作节点（worker node）和存储。这些层在进行扩展或灾难恢复时是相互独立的。

[![Milvus架构图](https://milvus.io/static/0bc2e74d0a1b20bbfb91bdbd03f77e5e/1263b/architecture_diagram.png "Milvus架构图")](https://milvus.io/static/0bc2e74d0a1b20bbfb91bdbd03f77e5e/bbbf7/architecture_diagram.png)

Milvus架构图。

接下来：

* 详细了解Milvus中的[计算/存储分离（Computing/Storage Disaggregation）](four_layers.md)。
* 了解Milvus中的[主要组件（Main Components）](main_components.md)。