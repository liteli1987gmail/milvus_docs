# Knowhere

本文介绍Milvus的核心向量执行引擎Knowhere。

## 概述

Knowhere是Milvus的核心向量执行引擎，它整合了几个向量相似性搜索库，包括[Faiss](https://github.com/facebookresearch/faiss)、[Hnswlib](https://github.com/nmslib/hnswlib)和[Annoy](https://github.com/spotify/annoy)。Knowhere还被设计为支持异构计算。它控制着索引构建和搜索请求在哪种硬件（CPU或GPU）上执行。这就是Knowhere得名的原因——知道在哪里执行操作。未来版本将支持更多类型的硬件，包括DPU和TPU。

## Knowhere在Milvus架构中的位置

下图展示了Knowhere在Milvus架构中的位置。

![Knowhere](/knowhere_architecture.png "Knowhere在Milvus架构中的位置。")

最底层是系统硬件。第三方索引库位于硬件之上。然后Knowhere通过CGO与顶部的索引节点和查询节点进行交互，CGO允许Go包调用C代码。

## Knowhere的优势

以下是Knowhere相对于Faiss的优势：

#### 支持BitsetView

Milvus引入了一个位集机制来实现“软删除”。软删除的向量仍然存在于数据库中，但在进行向量相似性搜索或查询时不会被计算。

位集中的每个位对应一个索引向量。如果位集中的向量被标记为“1”，则意味着该向量已被软删除，并且在向量搜索期间不会被涉及。位集参数应用于Knowhere中所有公开的Faiss索引查询API，包括CPU和GPU索引。

有关位集机制的更多信息，请查看[位集](bitset.md)。

#### 支持多种相似性度量标准对二进制向量进行索引

Knowhere支持[汉明](metric.md#汉明距离)、[杰卡德](metric.md#杰卡德距离)、[Tanimoto](metric.md#Tanimoto距离)、[超结构](metric.md#超结构)和[子结构](metric.md#子结构)。杰卡德和Tanimoto可以用来测量两个样本集之间的相似性，而超结构和子结构可以用来测量化学结构的相似性。

#### 支持AVX512指令集

除了Faiss已经支持的[AArch64](https://en.wikipedia.org/wiki/AArch64)、[SSE4.2](https://en.wikipedia.org/wiki/SSE4#SSE4.2)和[AVX2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions)指令集外，Knowhere还支持[AVX512](https://en.wikipedia.org/wiki/AVX-512)，与AVX2相比，可以[提高索引构建和查询性能20%到30%](https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md)。

#### 自动SIMD指令选择

Knowhere支持在任何CPU处理器（包括本地和云平台）上自动调用合适的SIMD指令（例如，SIMD SSE、AVX、AVX2和AVX512），因此用户在编译期间不需要手动指定SIMD标志（例如，“-msse4”）。

Knowhere是通过重构Faiss的代码库构建的。依赖于SIMD加速的公共函数（例如，相似性计算）被提取出来。然后对于每个函数，实现四个版本（即SSE、AVX、AVX2、AVX512），并将每个版本放入单独的源文件中。然后进一步单独编译这些源文件，并使用相应的SIMD标志。因此，在运行时，Knowhere可以自动根据当前CPU标志选择最适合的SIMD指令，然后使用钩子链接正确的函数指针。

#### 其他性能优化

有关Knowhere性能优化的更多信息，请阅读[Milvus: A Purpose-Built Vector Data Management System](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf)。

## Knowhere代码结构

Milvus中的计算主要涉及向量和标量操作。Knowhere只处理向量索引上的操作。

索引是独立于原始向量数据的数据结构。通常，索引需要四个步骤：创建索引、训练数据、插入数据和构建索引。在某些AI应用中，数据集训练与向量搜索是分开的。来自数据集的数据首先被训练，然后插入到像Milvus这样的向量数据库中进行相似性搜索。例如，开放数据集sift1M和sift1B将训练数据和测试数据分开。

然而，在Knowhere中，训练数据和搜索数据是相同的。Knowhere在一个[段](https://milvus.io/blog