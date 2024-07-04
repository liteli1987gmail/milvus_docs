


# Milvus 架构概述

Milvus 是一个专门为相似度搜索和人工智能构建的快速、可靠和稳定的向量数据库，基于流行的向量搜索库，包括 Faiss、Annoy、HNSW 等。Milvus 是为包含数百万、数十亿甚至数万亿向量的密集向量数据集进行相似度搜索而设计的。在继续之前，请熟悉嵌入检索的 [基本原理](/reference/glossary.md)。

Milvus 还支持数据分片、数据持久化、流式数据摄取、向量和标量数据之间的混合搜索以及许多其他高级功能。该平台提供按需性能，并可进行优化，以适应任何嵌入检索场景。我们建议使用 Kubernetes 部署 Milvus，以获得最佳的可用性和弹性。

Milvus 采用共享存储架构，具有计算节点上存储和计算解聚以及横向可扩展性。根据数据平面和控制平面解聚的原则，Milvus 由四个层次组成：访问层、协调器服务、工作节点和存储。这些层在扩展或灾难恢复时相互独立。

![Architecture_diagram](/assets/milvus_architecture.png "Milvus architecture.")


## 接下来的步骤





- 了解更多关于在 Milvus 中的 [计算/存储分层](/reference/architecture/four_layers.md)。
- 了解 Milvus 中的 [主要组件](/reference/architecture/main_components.md)。

