


# Knowhere

本主题介绍了 Milvus 的核心向量执行引擎 Knowhere。

## 概述

Knowhere 是 Milvus 的核心向量执行引擎，它集成了几个向量相似性搜索库，包括 [Faiss](https://github.com/facebookresearch/faiss)、[Hnswlib](https://github.com/nmslib/hnswlib) 和 [Annoy](https://github.com/spotify/annoy)。Knowhere 还支持异构计算。它控制在哪个硬件（CPU 或 GPU）上执行索引构建和搜索请求。这就是 Knowhere 得名的原因 - 知道在哪里执行这些操作。未来的版本将支持更多类型的硬件，包括 DPU 和 TPU。

## Milvus 架构中的 Knowhere

下图说明了 Knowhere 在 Milvus 架构中的位置。

![Knowhere](/assets/knowhere_architecture.png "Milvus架构中的Knowhere")

最底层是系统硬件。第三方索引库在硬件之上。然后 Knowhere 通过 CGO 与位于顶部的索引节点和查询节点进行交互，这允许 Go 包调用 C 代码。

## Knowhere 的优势

以下是 Knowhere 相对于 Faiss 的优势。

#### 支持 BitsetView

Milvus 引入了位集（bitset）机制来实现“软删除”。软删除的向量仍然存在于数据库中，但在向量相似性搜索或查询过程中将不会计算。

位集中的每个位对应一个索引向量。如果位集中的某个位设置为“1”，则表示此向量已软删除，并且在向量搜索过程中不会参与计算。bitset 参数适用于 Knowhere 中公开的所有 Faiss 索引查询 API，包括 CPU 和 GPU 索引。

有关位集机制的更多信息，请查看 [bitset](/reference/bitset.md)。

#### 支持对二进制向量进行多种相似性度量的索引

Knowhere 支持 [Hamming](metric.md#Hamming-distance)、[Jaccard](metric.md#Jaccard-distance)、[Tanimoto](metric.md#Tanimoto-distance)、[Superstructure](metric.md#Superstructure) 和 [Substructure](metric.md#Substructure) 等多种相似性度量。Jaccard 和 Tanimoto 可用于衡量两个样本集之间的相似性，而 Superstructure 和 Substructure 可用于衡量化学结构的相似性。

#### 支持 AVX512 指令集

除了 Faiss 已经支持的 [AArch64](https://en.wikipedia.org/wiki/AArch64)、[SSE4.2](https://en.wikipedia.org/wiki/SSE4#SSE4.2) 和 [AVX2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) 指令集之外，Knowhere 还支持 [AVX512](https://en.wikipedia.org/wiki/AVX-512) 指令集，相比 AVX2，可以提高索引构建和查询的性能 20%至 30%。

#### 自动 SIMD 指令选择

Knowhere 支持自动调用适合的 SIMD 指令（如 SIMD SSE、AVX、AVX2 和 AVX512）在任何 CPU 处理器上（包括本地和云平台），因此用户无需在编译时手动指定 SIMD 标志（如“-msse4”）。

Knowhere 通过重构 Faiss 的代码库构建。基于 SIMD 加速的常见函数（如相似性计算）被拆分到单独的函数中。对于每个函数，实现了四个版本（即 SSE、AVX、AVX2 和 AVX512），并且每个版本都被编译成单独的源文件。然后根据对应的 SIMD 标志单独编译源文件。因此，在运行时，Knowhere 可以根据当前的 CPU 标志自动选择最合适的 SIMD 指令，并使用钩子函数链接正确的函数指针。

#### 其他性能优化

有关 Knowhere 性能优化的更多信息，请阅读 [《Milvus：专为向量数据管理而构建的系统》](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf)。

## Knowhere 代码结构

在 Milvus 中，计算主要涉及向量和标量操作。Knowhere 仅处理向量索引操作。

索引是与原始向量数据无关的数据结构。一般情况下，索引需要四个步骤：创建索引、训练数据、插入数据和构建索引。在一些 AI 应用中，数据集的训练与向量搜索是分开的。数据集的数据首先经过训练，然后插入到 Milvus 等向量数据库中进行相似性搜索。例如，开源数据集 sift1M 和 sift1B 区分了用于训练和用于测试的数据。

然而，在 Knowhere 中，用于训练和搜索的数据是相同的。Knowhere 会对一个 [段](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Segments) 中的所有数据进行训练，然后将所有训练数据插入并构建索引。

#### `DataObj`：基类

`DataObj` 是 Knowhere 中所有数据结构的基类。`Size()` 是 `DataObj` 中唯一的虚方法。`Index` 类继承自 `DataObj`，并具有名为“size_”的字段。`Index` 类还有两个虚方法——`Serialize()` 和 `Load()`。从 `Index` 派生的 `VecIndex` 类是所有向量索引的虚基类。`VecIndex` 提供了 `Train()`、`Query()`、`GetStatistics()` 和 `ClearStatistics()` 等方法。

![基类](/assets/Knowhere_base_classes.png "Knowhere基类结构图")

图上右侧列出了其他一些索引类型。

- Faiss 索引有两个基类：用于浮点向量的 `FaissBaseIndex` 和用于二进制向量的 `FaissBaseBinaryIndex`。

- `GPUIndex` 是所有 Faiss GPU 索引的基类。

- `OffsetBaseIndex` 是所有自定义索引的基类。由于索引文件中仅存储向量 ID，对于 128 维向量，可以将文件大小缩减两个数量级。

#### `IDMAP`：暴力搜索

![IDMAP](/assets/IDMAP.png "IDMAP代码结构图")

从技术上讲，`IDMAP` 不是一个索引，而是用于暴力搜索。在将向量插入数据库时，不需要进行数据训练或索引构建。搜索将直接在插入的向量数据上进行。

但是，为了代码一致性，`IDMAP` 也从 `VecIndex` 类继承，并具有其所有虚接口。使用 `IDMAP` 与使用其他索引相同。

#### IVF 索引

![IVF](/assets/IVF.png "IVF索引代码结构图")

IVF（倒排文件）索引是最常用的索引之一。`IVF` 类继承自 `VecIndex` 和 `FaissBaseIndex`，并进一步扩展为 `IVFSQ` 和 `IVFPQ`。`GPUIVF` 继承自 `GPUIndex` 和 `IVF`，然后进一步扩展为 `GPUIVFSQ` 和 `GPUIVFPQ`。

`IVFSQHybrid` 是一种自定义的混合索引。粗量化器在 GPU 上执行，而在桶中进行搜索的操作在 CPU 上执行。这种类型的索引可以通过利用 GPU 的计算能力减少 CPU 和 GPU 之间的内存拷贝次数。`IVFSQHybrid` 具有与 `GPUIVFSQ` 相同的召回率，但性能更好。

二进制索引的基类结构相对较简单。`BinaryIDMAP` 和 `BinaryIVF` 继承自 `FaissBaseBinaryIndex` 和 `VecIndex`。

#### 第三方索引

![第三方索引](/assets/third_party_index.png "其他第三方索引的代码结构")

目前，除了 Faiss 之外，还支持了两种类型的第三方索引：基于树的索引 `Annoy` 和基于图的索引 `HNSW`。这两种常见且经常使用的第三方索引都是从 `VecIndex` 派生的。

## 向 Knowhere 添加索引





如果你想要向 Knowhere 添加新的索引，首先可以参考现有的索引：

- 要添加基于量化的索引，请参考 `IVF_FLAT`。

- 要添加基于图的索引，请参考 `HNSW`。

- 要添加基于树的索引，请参考 `Annoy`。

在参考现有索引之后，你可以按照以下步骤向 Knowhere 中添加一个新的索引。

1. 在 `IndexEnum` 中添加新索引的名称。数据类型为字符串。

2. 在 `ConfAdapter.cpp` 文件中对新索引进行数据验证检查。验证检查主要是用于验证数据训练和查询的参数。

3. 为新索引创建一个新文件。新索引的基类应该包括 `VecIndex` 和 `VecIndex` 的必要虚接口。

4. 在 `VecIndexFactory::CreateVecIndex()` 中添加新索引的索引构建逻辑。

5. 在 `unittest` 目录下添加单元测试。

## 接下来的步骤



After learning how Knowhere works in Milvus, you might also want to:

- Learn about [the various types of indexes Milvus supports](/reference/index.md).
- Learn about [the bitset mechanism](/reference/bitset.md).
- Understand [how data are processed](/reference/architecture/data_processing.md) in Milvus.

