
Knowhere
===

本主题介绍Milvus的核心向量执行引擎Knowhere。

概述
--

Knowhere 是 Milvus 的核心向量执行引擎，集成了多个向量相似度搜索库，包括 [Faiss](https://github.com/facebookresearch/faiss)、[Hnswlib](https://github.com/nmslib/hnswlib) 和 [Annoy](https://github.com/spotify/annoy)。Knowhere 还支持异构计算。它控制在哪些硬件（CPU 或 GPU）上执行索引构建和搜索请求。这就是 Knowhere 的名字的由来 - 知道在哪里执行操作。未来的版本还将支持更多类型的硬件，包括 DPU 和 TPU。

Knowhere 在 Milvus 架构中的作用
------------------------

下图说明了Knowhere在Milvus架构中的位置。

[![Knowhere](https://milvus.io/static/6b70b45e744c7e5cec02b534fd91055f/1263b/knowhere_architecture.png "Knowhere in the Milvus architecture.")](https://milvus.io/static/6b70b45e744c7e5cec02b534fd91055f/bbbf7/knowhere_architecture.png)

Knowhere in the Milvus architecture.

最底层是系统硬件，第三方索引库位于硬件之上。然后，Knowhere通过CGO与顶部的索引节点和查询节点交互，这允许Go包调用C代码。

Knowhere优势
----------

以下是Knowhere相对于Faiss的优势。

#### 支持BitsetView

Milvus引入了位图机制实现"软删除"。软删除的向量仍然存在于数据库中，但在向量相似度搜索或查询过程中不会被计算。

位图中的每个位对应于一个索引向量。如果位图中的向量被标记为"1"，则表示该向量已被软删除，在向量搜索中不会涉及该向量。bitset参数适用于所有在Knowhere中公开的Faiss索引查询API，包括CPU和GPU索引。

有关位图机制的更多信息，请查看[位图](bitset.md)。

#### Support for multiple similarity metrics for indexing binary vectors

Knowhere supports [Hamming](metric.md#Hamming-distance), [Jaccard](metric.md#Jaccard-distance), [Tanimoto](metric.md#Tanimoto-distance), [Superstructure](metric.md#Superstructure), and [Substructure](metric.md#Substructure). Jaccard and Tanimoto can be used to measure the similarity between two sample sets while Superstructure and Substructure can be used to measure the similarity of chemical structures.

#### Support for AVX512 instruction set

除了[AArch64](https://zh.wikipedia.org/wiki/AArch64)、[SSE4.2](https://zh.wikipedia.org/wiki/SSE4#SSE4.2)和[AVX2](https://zh.wikipedia.org/wiki/Advanced_Vector_Extensions)之外，Faiss 已经支持的指令集，Knowhere 还支持[AVX512](https://zh.wikipedia.org/wiki/AVX-512)，可以相对于AVX2提高20%至30%的索引构建和查询性能。

#### 自动SIMD指令选择

Knowhere支持在任何CPU处理器（包括本地和云平台）上自动调用适当的SIMD指令（例如SIMD SSE，AVX，AVX2和AVX512），因此用户在编译时无需手动指定SIMD标志（例如“-msse4”）。

Knowhere是通过重构Faiss的代码库而构建的。依赖于 SIMD 加速的常见函数（例如，相似性计算）被分解出来。然后，针对每个函数，实现了四个版本（即 SSE、AVX、AVX2、AVX512），每个版本都放在一个单独的源文件中。然后，使用相应的 SIMD 标志单独编译源文件。因此，在运行时，Knowhere 可以基于当前的 CPU 标志自动选择最适合的 SIMD 指令，然后使用 hooking 链接正确的函数指针。

#### 其他性能优化

Read [Milvus: A Purpose-Built Vector Data Management System](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf) for more about Knowhere's performance optimization.

Knowhere code structure
-----------------------

Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vector indexing.

索引是一种独立于原始向量数据的数据结构。通常，索引需要四个步骤：创建索引，训练数据，插入数据和构建索引。在一些人工智能应用中，数据集训练与向量搜索分开。来自数据集的数据首先进行训练，然后插入到像Milvus这样的向量数据库中进行相似度搜索。例如，开放数据集sift1M和sift1B区分了用于训练和测试的数据。

然而，在Knowhere中，用于训练和搜索的数据是相同的。Knowhere在一个[段](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Segments)中训练所有的数据，然后将所有训练数据插入并为它们构建索引。

#### `DataObj`：基类

`DataObj` is the base class of all data structures in Knowhere. `Size()` is the only virtual method in `DataObj`. The Index class inherits from `DataObj` with a field named "size_". The Index class also has two virtual methods - `Serialize()` and `Load()`. The `VecIndex` class derived from `Index` is the virtual base class for all vector indexes. `VecIndex` provides methods including `Train()`, `Query()`, `GetStatistics()`, and `ClearStatistics()`.

[![base class](https://milvus.io/static/647a0d4e1b5303d1395cb8f3c86aa111/1263b/Knowhere_base_classes.png "Knowhere base classes.")](https://milvus.io/static/647a0d4e1b5303d1395cb8f3c86aa111/bbbf7/Knowhere_base_classes.png)

Knowhere base classes.

Some other index types are listed on the right in the figure above.

* The Faiss index has two base classes: `FaissBaseIndex` for all indexes on float point vectors, and `FaissBaseBinaryIndex` for all indexes on binary vectors.
* `GPUIndex` is the base class for all Faiss GPU indexes.
* `OffsetBaseIndex`是所有自研索引的基类。由于索引文件中仅存储向量ID，因此128维向量的文件大小可以降低2个数量级。

#### `IDMAP`：暴力搜索

[![IDMAP](https://milvus.io/static/74fae2b0a2c28c429af1c1af40686653/1263b/IDMAP.png "IDMAP code structure.")](https://milvus.io/static/74fae2b0a2c28c429af1c1af40686653/bbbf7/IDMAP.png)

IDMAP code structure.

从技术上讲，`IDMAP`不是一个索引，而是用于暴力搜索。当向数据库中插入向量时，不需要进行数据训练或索引构建。搜索将直接在插入的向量数据上进行。

然而，为了代码的一致性，`IDMAP`也从`VecIndex`类继承了所有虚拟接口。使用`IDMAP`与其他索引相同。

#### IVF索引

[![IVF](https://milvus.io/static/74fae2b0a2c28c429af1c1af40686653/1263b/IDMAP.png "Code structure of IVF indexes.")](https://milvus.io/static/74fae2b0a2c28c429af1c1af40686653/bbbf7/IDMAP.png)

Code structure of IVF indexes.

倒排索引（IVF）是最常用的索引。 `IVF` 类派生自 `VecIndex` 和 `FaissBaseIndex`，并进一步扩展为 `IVFSQ` 和 `IVFPQ`。 `GPUIVF` 派生自 `GPUIndex` 和 `IVF`。然后，`GPUIVF` 进一步扩展为 `GPUIVFSQ` 和 `GPUIVFPQ`。

`IVFSQHybrid` 是一种自主开发的混合索引。粗糙的量化器在 GPU 上执行，而在 CPU 上执行桶中的搜索。这种类型的索引可以利用 GPU 的计算能力，减少 CPU 和 GPU 之间的内存复制发生。 `IVFSQHybrid` 具有与 `GPUIVFSQ` 相同的召回率，但性能更佳。

二进制索引的基类结构相对较简单。 `BinaryIDMAP` 和 `BinaryIVF` 派生自 `FaissBaseBinaryIndex` 和 `VecIndex`。

#### 第三方索引

[![third-party indexes](https://milvus.io/static/99ec20edb132c990034153f17cbe66a7/1263b/third_party_index.png "Code structure of other third-party indexes.")](https://milvus.io/static/99ec20edb132c990034153f17cbe66a7/bbbf7/third_party_index.png)

Code structure of other third-party indexes.

目前，除了Faiss以外，仅支持两种类型的第三方索引：基于树的索引`Annoy`和基于图的索引`HNSW`。这两种常见且经常使用的第三方索引都源于`VecIndex`。

向Knowhere添加索引
-------------

If you want to add new indexes to Knowhere, first you can refer to existing indexes:

* To add quantization-based indexes, refer to `IVF_FLAT`.
* To add graph-based indexes, refer to `HNSW`.
* To add tree-based indexes, refer to `Annoy`.

After referring to the existing index, you can follow the steps below to add a new index to Knowhere.

1. Add the name of the new index in `IndexEnum`. The data type is string.
2. Add data validation check on the new index in the file `ConfAdapter.cpp`. The validation check is mainly to validate the parameters for data training and query.
- 为新索引创建一个新文件。新索引的基类应该包括`VecIndex`，以及`VecIndex`的必要虚接口。

- 在`VecIndexFactory::CreateVecIndex()`中添加新索引的构建逻辑。

- 在`unittest`目录下添加单元测试。

接下来做什么
------

After learning how Knowhere works in Milvus, you might also want to:

* Learn about [the various types of indexes Milvus supports](index.md).
* Learn about [the bitset mechanism](bitset.md).
* Understand [how data are processed](data_processing.md) in Milvus.
