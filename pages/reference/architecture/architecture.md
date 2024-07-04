


# 架构

作为一个云原生的向量数据库，Milvus 通过设计将存储和计算分离。为了增强弹性和灵活性，Milvus 中的所有组件都是无状态的。

- [Milvus 架构概述](/reference/architecture/architecture_overview.md): Milvus 采用共享存储架构，具有存储/计算分离和可扩展性的计算节点。

- [存储/计算分离](/reference/architecture/four_layers.md): Milvus 由四个相互独立的层组成，这些层在可扩展性和灾难恢复方面是相互独立的。

- [主要组件](/reference/architecture/main_components.md): Milvus 独立版包含三个组件，而 Milvus 集群版包含八个微服务组件和三个第三方依赖。

- [数据处理](/reference/architecture/data_processing.md): 对 Milvus 中数据插入、索引构建和数据查询的实现进行详细描述。

