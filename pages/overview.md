Milvus向量数据库安装、使用全中文文档教程
==

本页面旨在通过回答几个问题，为您提供Milvus的概述。阅读本页面后，您将了解什么是Milvus，它是如何工作的，以及关键概念、为什么使用Milvus、支持的索引和指标、示例应用程序、架构和相关工具。

什么是Milvus向量数据库？
---------------

Milvus是在2019年创建的，其唯一目标是存储、索引和管理由深度神经网络和其他机器学习（ML）模型生成的大规模[嵌入向量](#Embedding-vectors)。

作为一个专门设计用于处理输入向量查询的数据库，它能够处理万亿级别的向量索引。与现有的关系型数据库主要处理遵循预定义模式的结构化数据不同，Milvus从底层设计用于处理从[非结构化数据](#Unstructured-data)转换而来的嵌入向量。

随着互联网的发展和演变，非结构化数据变得越来越常见，包括电子邮件、论文、物联网传感器数据、Facebook照片、蛋白质结构等等。为了使计算机能够理解和处理非结构化数据，使用嵌入技术将它们转换为向量。Milvus存储和索引这些向量。Milvus能够通过计算它们的相似距离来分析两个向量之间的相关性。如果两个嵌入向量非常相似，则意味着原始数据源也很相似。

[![Workflow](https://milvus.io/static/3b65292e6a7d800168c56ecfd8f7109e/0a251/milvus_workflow.jpg "Milvus workflow.")](https://milvus.io/static/3b65292e6a7d800168c56ecfd8f7109e/1b5bd/milvus_workflow.jpg)

Milvus workflow.

关键概念
----

如果您对向量数据库和相似度搜索的世界还不熟悉，请阅读以下关键概念的解释，以更好地理解。

了解更多关于[Milvus词汇表](glossary.md)。

### 非结构化数据

非结构化数据包括图像、视频、音频和自然语言等信息，这些信息不遵循预定义的模型或组织方式。这种数据类型占据了世界数据的约80%，可以使用各种人工智能（AI）和机器学习（ML）模型将其转换为向量。

### 嵌入向量

嵌入向量是对非结构化数据（如电子邮件、物联网传感器数据、Instagram照片、蛋白质结构等）的特征抽象。数学上，嵌入向量是一个浮点数或二进制数的数组。现代的嵌入技术被用于将非结构化数据转换为嵌入向量。

### 向量相似度搜索

向量相似度搜索是将向量与数据库进行比较，以找到与查询向量最相似的向量的过程。使用近似最近邻搜索算法加速搜索过程。如果两个嵌入向量非常相似，那么原始数据源也是相似的。

为什么选择Milvus？
------------

* 在处理大规模数据集的向量搜索时具有高性能。

* 开发者优先的社区，提供多语言支持和工具链。

* 云扩展性和高可靠性，即使出现故障也不会受到影响。

* 通过将标量过滤与向量相似度搜索配对，实现混合搜索。

支持哪些索引和度量？
----------

索引是数据的组织单位。在搜索或查询插入的实体之前，必须声明索引类型和相似度度量。**如果您未指定索引类型，则Milvus将默认使用暴力搜索。**

### 索引类型

大多数由Milvus支持的向量索引类型使用近似最近邻搜索（ANNS），包括：

* **FLAT**：FLAT最适合于在小规模，百万级数据集上寻求完全准确和精确的搜索结果的场景。

* **IVF_FLAT**：IVF_FLAT是一种量化索引，最适合于在精度和查询速度之间寻求理想平衡的场景。

* **IVF_SQ8**：IVF_SQ8是一种量化索引，最适合于在磁盘、CPU和GPU内存消耗非常有限的场景中显著减少资源消耗。

* **IVF_PQ**：IVF_PQ是一种量化索引，最适合于在高查询速度的情况下以牺牲精度为代价的场景。

* **HNSW**：HNSW是一种基于图形的索引，最适合于对搜索效率有很高需求的场景。

* **ANNOY**：ANNOY是一种基于树形结构的索引，最适合于寻求高召回率的场景。

请参阅[向量索引](index.md)以了解更多详细信息。

### 相似度度量

在 Milvus 中，相似度度量用于衡量向量之间的相似性。选择一个好的距离度量方法可以显著提高分类和聚类的性能。根据输入数据的形式，选择特定的相似度度量方法可以获得最优的性能。

对于浮点嵌入，通常使用以下指标：

* **欧氏距离（L2）**：该指标通常用于计算机视觉领域（CV）。

* **内积（IP）**：该指标通常用于自然语言处理领域（NLP）。

在二元嵌入中广泛使用的度量标准包括：

* **哈明距离**：这个度量标准通常用于自然语言处理（NLP）领域。

* **杰卡德距离**：这个度量标准通常用于分子相似性搜索领域。

* **塔尼莫托距离**：这个度量标准通常用于分子相似性搜索领域。

* **超结构距离**：这个度量标准通常用于搜索分子的类似超结构。

* **亚结构距离**：这个度量标准通常用于搜索分子的类似亚结构。

更多信息请参见[相似性度量标准](metric.md#floating)。

示例应用
----

Milvus使得向应用中添加相似性搜索变得容易。Milvus的示例应用包括：

* [图像相似性搜索](image_similarity_search.md)：使图像可搜索，并即时返回来自大型数据库中最相似的图像。

* [视频相似性搜索](video_similarity_search.md)：通过将关键帧转换为向量，然后将结果输入Milvus，可以在几乎实时的时间内搜索和推荐数十亿个视频。

* [音频相似性搜索](audio_similarity_search.md)：快速查询大量音频数据，如语音、音乐、音效和表面相似的声音。

* [分子相似性搜索](molecular_similarity_search.md)：针对指定分子进行极快的相似性搜索、子结构搜索或超结构搜索。

* [推荐系统](recommendation_system.md)：根据用户行为和需求推荐信息或产品。

* [问答系统](question_answering_system.md)：交互式数字问答聊天机器人，自动回答用户的问题。

* [DNA序列分类](dna_sequence_classification.md)：通过比较相似的DNA序列，在毫秒级别准确地分类一个基因。

* [文本搜索引擎](text_search_engine.md)：通过将关键字与文本数据库进行比较，帮助用户找到他们正在寻找的信息。

请查看[Milvus教程](https://github.com/milvus-io/bootcamp/tree/master/solutions)和[Milvus采用者](milvus_adopters.md)，了解更多Milvus应用场景。

Milvus的设计原理是什么？
---------------

作为云原生向量数据库，Milvus的设计通过分离存储与计算来实现。为了增强弹性和灵活性，Milvus中的所有组件都是无状态的。

系统分为四个层次：

* 访问层：访问层由一组无状态代理组成，作为系统的前层和用户端点。

* 协调器服务：协调器服务将任务分配给工作节点，并充当系统的大脑。

* 工作节点：工作节点是系统的手臂和腿部，是执行来自协调器服务的指令并执行用户触发的DML/DDL命令的“哑执行者”。

* 存储：存储是系统的骨头，负责数据持久化。它包括元数据存储、日志代理和对象存储。

有关更多信息，请参见[架构概述](architecture_overview.md)。

[![Architecture](https://milvus.io/static/7a0dfbdf7722f8e63278244f984d353f/0a251/architecture_02.jpg "Milvus architecure.")](https://milvus.io/static/7a0dfbdf7722f8e63278244f984d353f/52173/architecture_02.jpg)

Milvus architecure.

开发人员工具
------

Milvus受到丰富的API和工具的支持，以便促进DevOps。

### API访问

Milvus有客户端库，包装在Milvus API之上，可用于从应用程序代码以编程方式插入、删除和查询数据：

* [PyMilvus](https://github.com/milvus-io/pymilvus)

* [Node.js SDK](https://github.com/milvus-io/milvus-sdk-node)

* [Go SDK](https://github.com/milvus-io/milvus-sdk-go)

* [Java SDK](https://github.com/milvus-io/milvus-sdk-java)

我们正在努力支持更多的客户端库。如果您想做出贡献，请前往[Milvus项目](https://github.com/milvus-io)的相应仓库。

### Milvus生态系统工具

Milvus生态系统提供了一些有用的工具，包括：

* [Milvus CLI](https://github.com/zilliztech/milvus_cli#overview)

* [Attu](https://github.com/zilliztech/attu)，一个用于Milvus的图形化管理系统。

* [MilvusDM](migrate_overview.md)（Milvus数据迁移），一个专门设计用于与Milvus导入和导出数据的开源工具。

* [Milvus大小估算工具](https://milvus.io/tools/sizing/)，它可以帮助您估算各种索引类型下所需向量数量的原始文件大小、内存大小和稳定磁盘大小。

接下来是什么
------

* 通过3分钟教程入门：
	+ [Hello Milvus](example_code.md)

* 为您的测试或生产环境安装Milvus：
	+ [安装前提条件](prerequisite-docker.md)
	+ [安装Milvus Standalone](install_standalone-docker.md)

* 如果您对 Milvus 的设计细节感兴趣：
	+ 阅读有关[Milvus 架构](architecture_overview.md)的内容
