---
id: overview.md
title: 什么是 Milvus
related_key: Milvus 概览
summary: Milvus 是一个开源向量数据库，专为 AI 应用开发、嵌入向量相似性搜索和 MLOps 设计。
---

# 引言

本页面旨在回答几个问题，为您提供 Milvus 的概览。阅读本页面后，您将了解 Milvus 是什么、它的工作原理，以及关键概念、为什么使用 Milvus、支持的索引和度量、示例应用、架构和相关工具。

## Milvus 向量数据库是什么？

Milvus 创建于 2019 年，其唯一目标是存储、索引和管理由深度神经网络和其他机器学习（ML）模型生成的大量[嵌入向量](#嵌入向量)。

作为一个专门设计用于处理输入向量查询的数据库，它能够在万亿规模上对向量进行索引。与主要处理遵循预定义模式的结构化数据的现有关系数据库不同，Milvus 从底层设计上就用于处理从[非结构化数据](#非结构化数据)转换而来的嵌入向量。

随着互联网的增长和演变，非结构化数据变得越来越普遍，包括电子邮件、论文、IoT 传感器数据、Facebook 照片、蛋白质结构等。为了让计算机理解和处理非结构化数据，这些数据使用嵌入技术转换为向量。Milvus 存储和索引这些向量。Milvus 能够通过计算它们的相似性距离来分析两个向量之间的相关性。如果两个嵌入向量非常相似，这意味着原始数据源也是相似的。

![工作流程](/assets/milvus_workflow.jpeg "Milvus 工作流程。")

## 关键概念

如果您是向量数据库和相似性搜索领域的新手，请阅读以下关键概念的解释，以获得更好的理解。

了解更多关于 [Milvus 术语表](glossary.md)。

### 非结构化数据

非结构化数据包括图像、视频、音频和自然语言，是一种不遵循预定义模型或组织方式的信息。这种数据类型约占世界数据的 80%，可以使用各种人工智能（AI）和机器学习（ML）模型转换为向量。

### 嵌入向量

嵌入向量是对非结构化数据（如电子邮件、IoT 传感器数据、Instagram 照片、蛋白质结构等）的特征抽象。从数学上讲，嵌入向量是一个浮点数或二进制数组。现代嵌入技术用于将非结构化数据转换为嵌入向量。

### 向量相似性搜索

向量相似性搜索是将向量与数据库进行比较以查找与查询向量最相似的向量的过程。近似最近邻（ANN）搜索算法用于加速搜索过程。如果两个嵌入向量非常相似，这意味着原始数据源也是相似的。

## 为什么选择 Milvus？

- 在大量数据集上进行向量搜索时具有高性能。
- 开发者优先的社区，提供多语言支持和工具链。
- 即使在中断事件中也具有云可扩展性和高可靠性。
- 通过将标量过滤与向量相似性搜索配对实现混合搜索。

## 支持哪些索引和度量？

索引是数据的组织单位。在搜索或查询插入的实体之前，您必须声明索引类型和相似性度量。**如果您不指定索引类型，Milvus 将默认执行暴力搜索。**

### 索引类型

Milvus 支持的大多数向量索引类型使用近似最近邻搜索（ANNS），包括：

- **FLAT**：FLAT 最适合于寻求在小型、百万规模数据集上获得完全精确和精确搜索结果的场景。
- **IVF_FLAT**：IVF_FLAT 是一种基于量化的索引，最适合于寻求在准确性和查询速度之间实现理想平衡的场景。还有一个 GPU 版本 **GPU_IVF_FLAT**。
- **IVF_SQ8**：IVF_SQ8 是一种基于量化的索引，最适合于寻求在磁盘、CPU 和 GPU 内存消耗非常有限的情况下显著降低资源消耗的场景。
- **IVF_PQ**：IVF_PQ 是一种基于量化的索引，最适合于寻求即使以牺牲准确性为代价也要实现高查询速度的场景。还有一个 GPU 版本 **GPU_IVF_PQ**。
- **HNSW**：HNSW 是一种基于图的索引，最适合于对搜索效率有高需求的场景。

有关更多详细信息，请参见 [向量索引](index.md)。

### 相似性度量
在 Milvus 中，相似度量用于衡量向量之间的相似性。选择一个好的距离度量有助于显著提高分类和聚类性能。根据输入数据的形式，选择特定的相似性度量以获得最佳性能。

广泛用于浮点嵌入的指标包括

- 欧氏距离（L2）**： 该指标通常用于计算机视觉（CV）领域。
- 内积（IP）**： 该指标通常用于自然语言处理 (NLP) 领域。
  广泛用于二进制嵌入的度量包括
- 哈明**： 自然语言处理（NLP）领域通常使用该度量。
- **贾卡**： 该度量通常用于分子相似性搜索领域。

更多信息，请参阅 [Similarity Metrics](metric.md#floating)。

## 应用实例

Milvus 可以让您轻松地将相似性搜索添加到您的应用程序中。Milvus 的应用实例包括

- [图像相似性搜索](/tutorials/image_similarity_search.md)： 可搜索图像，并从海量数据库中即时返回最相似的图像。
- [视频相似性搜索](/tutorials/video_similarity_search.md)： 通过将关键帧转换成向量，然后将结果输入 Milvus，可以近乎实时地搜索和推荐数十亿部视频。
- [音频相似性搜索](/tutorials/audio_similarity_search.md)： 快速查询海量音频数据，如语音、音乐、音效和表面相似声音。
- [推荐系统](/tutorials/recommend_system.md)： 根据用户行为和需求推荐信息或产品。
- [问题解答系统](/tutorials/question_answering_system.md)： 自动回答用户问题的交互式数字 QA 聊天机器人。
- [DNA 序列分类](/tutorials/dna_sequence_classification.md)： 通过比较相似的 DNA 序列，在几毫秒内准确地整理出基因的分类。
- [文本搜索引擎](/tutorials/text_search_engine.md)： 通过比较文本数据库中的关键词，帮助用户找到所需的信息。

有关 Milvus 的更多应用场景，请参阅 [Milvus tutorials](https://github.com/milvus-io/bootcamp/tree/master/solutions) 和 [Milvus Adopters](milvus_adopters.md) 。

## Milvus 是如何设计的？

作为云原生向量数据库，Milvus 在设计上将存储和计算分离开来。为了增强弹性和灵活性，Milvus 的所有组件都是无状态的。

系统分为四个层次：

- 访问层： 访问层由一组无状态代理组成，是系统的前端层，也是用户的终端。
- 协调服务： 协调服务将任务分配给工作节点，是系统的大脑。
- 工作节点： 工作节点就像手和脚，是哑执行器，遵循协调器服务的指令，执行用户触发的 DML/DDL 命令。
- 存储器： 存储是系统的骨骼，负责数据持久性。它包括元存储、日志代理和对象存储。

更多信息，请参阅[架构概述](architecture_overview.md)。

![架构](/assets/milvus_architecture.png "Milvus architecure.")

## 开发工具

Milvus 由丰富的 API 和工具支持，以促进 DevOps。

### API 访问

Milvus 在 Milvus API 的基础上封装了客户端库，可用于从应用程序代码中以编程方式插入、删除和查询数据：

- [PyMilvus](https://github.com/milvus-io/pymilvus)
- [Node.js SDK](https://github.com/milvus-io/milvus-sdk-node)
- [Go SDK](https://github.com/milvus-io/milvus-sdk-go)
- [Java SDK](https://github.com/milvus-io/milvus-sdk-java)

我们正在努力启用更多新的客户端库。如果您想贡献自己的力量，请访问[Milvus 项目](https://github.com/milvus-io) 的相应资源库。

### Milvus 生态系统工具

Milvus 生态系统提供的有用工具包括

- [Milvus CLI](https://github.com/zilliztech/milvus_cli#overview)
- [Milvus的图形管理系统 Attu](https://github.com/zilliztech/attu)。
- [MilvusDM](migrate_overview.md)（Milvus 数据迁移），这是一个开源工具，专门用于使用 Milvus 导入和导出数据。
- [Milvus sizing tool](https://milvus.io/tools/sizing/)，它可以帮助你估算指定数量、各种索引类型的向量所需的原始文件大小、内存大小和稳定磁盘大小。

## 下一步

- 从 3 分钟教程开始：
  - [你好，Milvus](/getstarted/quickstart.md)
- 为你的测试或生产环境安装 Milvus：
  - [安装前提条件](/getstarted/prerequisite-docker.md)
  - [安装 Milvus 单机版](/getstarted/install_standalone-docker.md)
- 如果你有兴趣深入了解 Milvus 的设计细节：
  - [阅读Milvus 架构](/getstarted/architecture_overview.md)
