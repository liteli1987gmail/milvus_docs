---
id: knowhere.md
summary: Learn about Knowhere in Milvus.
title: Knowhere
---

# Knowhere

本文介绍 Milvus 的核心向量执行引擎 Knowhere。

## 概述

Knowhere 是 Milvus 的核心向量执行引擎，它整合了几个向量相似性搜索库，包括[Faiss](https://github.com/facebookresearch/faiss)、[Hnswlib](https://github.com/nmslib/hnswlib)和[Annoy](https://github.com/spotify/annoy)。Knowhere 还被设计为支持异构计算。它控制着索引构建和搜索请求在哪种硬件（CPU 或 GPU）上执行。这就是 Knowhere 得名的原因——知道在哪里执行操作。未来版本将支持更多类型的硬件，包括 DPU 和 TPU。

## Knowhere 在 Milvus 架构中的位置

下图展示了 Knowhere 在 Milvus 架构中的位置。

![Knowhere](/knowhere_architecture.png "Knowhere在Milvus架构中的位置。")

最底层是系统硬件。第三方索引库位于硬件之上。然后 Knowhere 通过 CGO 与顶部的索引节点和查询节点进行交互，CGO 允许 Go 包调用 C 代码。

## Knowhere 的优势

以下是 Knowhere 相对于 Faiss 的优势：

#### 支持 BitsetView

Milvus 引入了一个位集机制来实现“软删除”。软删除的向量仍然存在于数据库中，但在进行向量相似性搜索或查询时不会被计算。

位集中的每个位对应一个索引向量。如果位集中的向量被标记为“1”，则意味着该向量已被软删除，并且在向量搜索期间不会被涉及。位集参数应用于 Knowhere 中所有公开的 Faiss 索引查询 API，包括 CPU 和 GPU 索引。

有关位集机制的更多信息，请查看[位集](bitset.md)。

#### 支持多种相似性度量标准对二进制向量进行索引

Knowhere 支持[汉明](metric.md#汉明距离)、[杰卡德](metric.md#杰卡德距离)、[Tanimoto](metric.md#Tanimoto距离)、[超结构](metric.md#超结构)和[子结构](metric.md#子结构)。杰卡德和 Tanimoto 可以用来测量两个样本集之间的相似性，而超结构和子结构可以用来测量化学结构的相似性。

#### 支持 AVX512 指令集

除了 Faiss 已经支持的[AArch64](https://en.wikipedia.org/wiki/AArch64)、[SSE4.2](https://en.wikipedia.org/wiki/SSE4#SSE4.2)和[AVX2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions)指令集外，Knowhere 还支持[AVX512](https://en.wikipedia.org/wiki/AVX-512)，与 AVX2 相比，可以[提高索引构建和查询性能 20%到 30%](https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md)。

#### 自动 SIMD 指令选择

Knowhere 支持在任何 CPU 处理器（包括本地和云平台）上自动调用合适的 SIMD 指令（例如，SIMD SSE、AVX、AVX2 和 AVX512），因此用户在编译期间不需要手动指定 SIMD 标志（例如，“-msse4”）。

Knowhere 是通过重构 Faiss 的代码库构建的。依赖于 SIMD 加速的公共函数（例如，相似性计算）被提取出来。然后对于每个函数，实现四个版本（即 SSE、AVX、AVX2、AVX512），并将每个版本放入单独的源文件中。然后进一步单独编译这些源文件，并使用相应的 SIMD 标志。因此，在运行时，Knowhere 可以自动根据当前 CPU 标志选择最适合的 SIMD 指令，然后使用钩子链接正确的函数指针。

#### 其他性能优化

有关 Knowhere 性能优化的更多信息，请阅读[Milvus: A Purpose-Built Vector Data Management System](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf)。

## Knowhere 代码结构

Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vector indexing.

An index is a data structure independent from the original vector data. Generally, indexing requires four steps: create an index, train data, insert data and build an index. In some AI applications, dataset training is separated from vector search. Data from datasets are first trained and then inserted into a vector database like Milvus for similarity search. For example, open datasets sift1M and sift1B differentiate data for training and data for testing.

However, in Knowhere, data for training and for searching are the same. Knowhere trains all the data in a [segment](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Segments) and then inserts all the trained data and builds an index for them.

#### `DataObj`: base class

`DataObj` is the base class of all data structures in Knowhere. `Size()` is the only virtual method in `DataObj`. The Index class inherits from `DataObj` with a field named "size\_". The Index class also has two virtual methods - `Serialize()` and `Load()`. The `VecIndex` class derived from `Index` is the virtual base class for all vector indexes. `VecIndex` provides methods including `Train()`, `Query()`, `GetStatistics()`, and `ClearStatistics()`.

![base class](../../../assets/Knowhere_base_classes.png "Knowhere base classes.")

Some other index types are listed on the right in the figure above.

- The Faiss index has two base classes: `FaissBaseIndex` for all indexes on float point vectors, and `FaissBaseBinaryIndex` for all indexes on binary vectors.

- `GPUIndex` is the base class for all Faiss GPU indexes.

- `OffsetBaseIndex` is the base class for all self-developed indexes. Given that only vector IDs are stored in an index file, the file size for 128-dimensional vectors can be reduced by 2 orders of magnitude.

#### `IDMAP`: brute-force search

![IDMAP](../../../assets/IDMAP.png "IDMAP code structure.")

Technically speaking, `IDMAP` is not an index, but rather used for brute-force search. When vectors are inserted into the database, neither data training nor index building is required. Searches will be conducted directly on the inserted vector data.

However, for code consistency, `IDMAP` also inherits from the `VecIndex` class with all its virtual interfaces. The usage of `IDMAP` is the same as other indexes.

#### IVF indexes

![IVF](../../../assets/IVF.png "Code structure of IVF indexes.")

The IVF (inverted file) indexes are the most frequently used. The `IVF` class is derived from `VecIndex` and `FaissBaseIndex`, and further extends to `IVFSQ` and `IVFPQ`. `GPUIVF` is derived from `GPUIndex` and `IVF`. Then `GPUIVF` further extends to `GPUIVFSQ` and `GPUIVFPQ`.

`IVFSQHybrid` is a self-developed hybrid index. Coarse quantizer is executed on GPU while search in the bucket on CPU. This type of index can reduce the occurrence of memory copy between CPU and GPU by leveraging the computing power of GPU. `IVFSQHybrid` has the same recall rate as `GPUIVFSQ` but comes with better performance.

The base class structure for binary indexes is relatively simpler. `BinaryIDMAP` and `BinaryIVF` are derived from `FaissBaseBinaryIndex` and `VecIndex`.

#### Third-party indexes

![third-party indexes](../../../assets/third_party_index.png "Code structure of other third-party indexes.")

Currently, only two types of third-party indexes are supported apart from Faiss: tree-based index `Annoy`, and graph-based index `HNSW`. These two common and frequently used third-party indexes are both derived from `VecIndex`.

## Adding indexes to Knowhere

If you want to add new indexes to Knowhere, first you can refer to existing indexes:

- To add quantization-based indexes, refer to `IVF_FLAT`.

- To add graph-based indexes, refer to `HNSW`.

- To add tree-based indexes, refer to `Annoy`.

After referring to the existing index, you can follow the steps below to add a new index to Knowhere.

1. Add the name of the new index in `IndexEnum`. The data type is string.

2. Add data validation check on the new index in the file `ConfAdapter.cpp`. The validation check is mainly to validate the parameters for data training and query.

3. Create a new file for the new index. The base class of the new index should include `VecIndex`, and the necessary virtual interface of `VecIndex`.

4. Add the index building logic for new index in `VecIndexFactory::CreateVecIndex()`.

5. Add unit test under the `unittest` directory.

## What's next

After learning how Knowhere works in Milvus, you might also want to:

- Learn about [the various types of indexes Milvus supports](index.md).
- Learn about [the bitset mechanism](bitset.md).

- Understand [how data are processed](data_processing.md) in Milvus.
