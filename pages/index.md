
向量索引
===

此主题列出了Milvus支持的各种类型的内存索引，以及它们最适合的场景和用户可以配置的参数，以实现更好的搜索性能。有关磁盘上的索引，请参阅**[磁盘索引](disk_index.md)**。

索引是高效地组织数据的过程，在使相似度搜索有用方面发挥了重要作用，通过大大加速耗时的大型数据集上的查询。

为了提高查询性能，您可以[为每个向量字段指定索引类型](build_index.md)。

Currently, a vector field only supports one index type. Milvus automatically deletes the old index when switching the index type.

ANNS向量索引
--------

大多数由Milvus支持的向量索引类型使用近似最近邻搜索（ANNS）算法。相对于通常非常耗时的精确检索，ANNS的核心思想不再局限于返回最准确的结果，而是只搜索目标的邻居。在可接受的范围内，ANNS通过牺牲准确性来提高检索效率。

根据实现方法，ANNS向量索引可以分为四类：

* 基于树的索引

* 基于图形的索引

* 基于哈希的索引

* 基于量化的索引

Milvus支持的索引
-----------

根据所适用的数据类型，Milvus支持的索引可分为两类：

* 浮点数嵌入的索引：
	+ 对于128维浮点嵌入，它们占用的存储空间为128 * float的大小 = 512字节。而用于浮点嵌入的[距离度量](metric.md)是欧几里得距离（L2）和内积。
	+ 这种类型的索引包括FLAT、IVF_FLAT、IVF_PQ、IVF_SQ8、ANNOY和HNSW。

* 二进制嵌入的索引
	+ 对于128维二进制嵌入，它们占用的存储空间为128 / 8 = 16字节。而用于二进制嵌入的距离度量是Jaccard、Tanimoto、Hamming、Superstructure和Substructure。
	+ 这种类型的索引包括BIN_FLAT和BIN_IVF_FLAT。

以下表格将Milvus支持的索引进行分类：

[浮点数嵌入](#floating) [二进制嵌入](#binary)

| Supported index | Classification | Scenario |
| --- | --- | --- |
| FLAT | N/A | * 相对较小的数据集

* 需要100％的召回率
 |
| IVF_FLAT | Quantization-based index | * 高速查询

* 需要尽可能高的召回率
 |
| IVF_SQ8 | Quantization-based index | * 高速查询

* 有限的内存资源

* 接受召回率的微小妥协
 |
| IVF_PQ | Quantization-based index | * 非常高速的查询

* 有限的内存资源

* 可以接受召回率的相当大的妥协
 |
| HNSW | Graph-based index | * 高速的查询

* 需要尽可能高的召回率

* 大量的内存资源
 |
| ANNOY | Tree-based index | * 低维向量
 |

### FLAT

对于需要完美准确性并且依赖相对较小（百万级别）数据集的向量相似性搜索应用程序，FLAT索引是一个很好的选择。FLAT不压缩向量，并且是唯一可以保证精确搜索结果的索引。FLAT的结果也可以用作与其他召回率不到100％的索引产生的结果进行比较的参考点。

FLAT是准确的，因为它采用了详尽的搜索方法，这意味着对于每个查询，目标输入与数据集中的每个向量进行比较。这使得FLAT成为我们列表中最慢的索引，不适合查询大规模向量数据。在Milvus中没有FLAT索引的参数，并且使用它不需要数据训练或额外的存储。

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `metric_type` | [可选]所选的距离度量。 | 见[支持的度量](metric.md)。 |

### IVF_FLAT

IVF_FLAT 将向量数据分成 `nlist` 个聚类单元，然后比较目标输入向量与每个聚类中心之间的距离。根据系统设置的查询聚类数目(`nprobe`)，只有与目标输入向量在最相似的聚类中的向量之间进行比较，才会返回相似性搜索结果——从而大大减少查询时间。

通过调整 `nprobe`，可以在给定情况下找到精度和速度之间的理想平衡。来自[IVF_FLAT性能测试](https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)的结果表明，随着目标输入向量的数目(`nq`)和要搜索的聚类数目(`nprobe`)的增加，查询时间急剧增加。

IVF_FLAT 是最基本的 IVF 索引，每个单元中存储的编码数据与原始数据一致。

* Index building parameters

| Parameter | Description | Range |
| --- | --- | --- |
| `nlist` | Number of cluster units | [1, 65536] |

* Search parameters

| Parameter | Description | Range |
| --- | --- | --- |
| `nprobe` | Number of units to query | CPU: [1, nlist]  GPU: [1, min(2048, nlist)] |

### IVF_SQ8

IVF_FLAT不进行任何压缩，因此它生成的索引文件与原始的非索引向量数据大小大致相同。例如，如果原始的1B SIFT数据集大小为476 GB，则其IVF_FLAT索引文件大小稍大（约为470 GB）。将所有索引文件加载到内存中将消耗470 GB的存储空间。

当磁盘、CPU或GPU内存资源受限时，IVF_SQ8比IVF_FLAT更好。该索引类型可以通过执行标量量化将每个FLOAT（4字节）转换为UINT8（1字节）。这将减少70-75%的磁盘、CPU和GPU内存消耗。对于1B SIFT数据集，IVF_SQ8索引文件只需要140 GB的存储空间。

* 索引构建参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `nlist` | 簇单元数 | [1, 65536] |

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `nprobe` | 要查询的单元数 | CPU：[1，nlist] GPU：[1，min（2048，nlist）] |

### IVF_PQ

`PQ`（Product Quantization，产品量化）将原始高维向量空间等分为 `m` 个低维向量空间的笛卡尔积，然后对这些低维向量空间进行量化。与计算目标向量与所有单元的中心点之间的距离不同，产品量化使得可以计算目标向量与每个低维空间的聚类中心之间的距离，并大大降低了算法的时间复杂度和空间复杂度。

IVF_PQ在量化向量的积之前执行IVF索引聚类。它的索引文件甚至比IVF_SQ8更小，但也会在搜索向量时导致精度损失。

Index building parameters and search parameters vary with Milvus distribution. Select your Milvus distribution first.

* 索引构建参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `nlist` | 聚类单元的数量 | [1, 65536] |
| `m` | 积量化的因子数 | `dim` ≡ 0 (mod `m`) |
| `nbits` | [可选]每个低维向量存储的位数。 | [1, 16]（默认为8） |

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `nprobe` | 查询的单元数 | [1, nlist] |

### HNSW

HNSW (Hierarchical Navigable Small World Graph) 是一种基于图形的索引算法。它根据某些规则为图像构建多层导航结构。在这个结构中，上层更稀疏，节点之间的距离更远；而下层更密集，节点之间的距离更近。搜索从最上层开始，找到最接近目标的节点，在这一层中，然后进入下一层开始另一个搜索。经过多次迭代，它可以快速接近目标位置。

为了提高性能，HNSW 限制了图的每一层节点的最大度数为`M`。此外，您可以使用`efConstruction`（在构建索引时）或`ef`（在搜索目标时）来指定搜索范围。

* 索引构建参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `M` | 节点的最大度数 | [4, 64] |
| `efConstruction` | 搜索范围 | [8, 512] |

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `ef` | 搜索范围 | [`top_k`, 32768] |

### ANNOY

ANNOY（Approximate Nearest Neighbors Oh Yeah）是一种索引，它使用超平面将高维空间划分为多个子空间，然后将它们存储在树结构中。

ANNOY只需要调整两个主要参数：树的数量`n_trees`和搜索时要检查的节点数量`search_k`。

* `n_trees` 是在构建时提供的，影响构建时间和索引大小。更大的值将给出更准确的结果，但索引将更大。

* `search_k` 是在运行时提供的，影响搜索性能。更大的值将给出更准确的结果，但返回结果需要更长时间。

如果没有提供 `search_k`，它将默认为 `n * n_trees`，其中 `n` 是近似最近邻居的数量。否则，`search_k` 和 `n_trees` 大致独立，即如果保持 `search_k` 不变，则 `n_trees` 的值不会影响搜索时间，反之亦然。基本上建议根据可以承受的内存量将 `n_trees` 设置得尽可能大，并根据查询的时间限制将 `search_k` 设置得尽可能大。

* 索引构建参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `n_trees` | 树的数量。 | [1, 1024] |

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `search_k` | 控制搜索范围的参数。 | [k, inf] |

| Supported index | Classification | Scenario |
| --- | --- | --- |
| BIN_FLAT | N/A | * 相对较小的数据集

* 需要100％的召回率
 |
| BIN_IVF_FLAT | Quantization-based index | * 高速查询

* 需要尽可能高的召回率
 |

### BIN_FLAT

此索引与FLAT完全相同，只能用于二进制嵌入。

对于需要完美准确率并依赖相对较小（百万级别）数据集的向量相似度搜索应用程序，BIN_FLAT索引是一个不错的选择。BIN_FLAT不压缩向量，是唯一可以保证精确搜索结果的索引。BIN_FLAT的结果也可以用作其他具有不足100%召回率的索引产生的结果的比较基准。

BIN_FLAT之所以准确，是因为它采用了详尽的搜索方法，这意味着对于每个查询，目标输入会与数据集中的每个向量进行比较。这使得BIN_FLAT成为我们列表中最慢的索引，不适合查询大规模向量数据。Milvus中没有BIN_FLAT索引的参数，并且使用它不需要数据训练或额外的存储。

* 搜索参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `metric_type` | [可选]选择的距离度量。 | 见[支持的度量](metric.md)。 |

### BIN_IVF_FLAT

这个索引与IVF_FLAT完全相同，只能用于二进制嵌入。

BIN_IVF_FLAT将向量数据分成`nlist`个聚类单元，然后比较目标输入向量与每个聚类中心之间的距离。根据系统设置的查询聚类数(`nprobe`)，仅基于最相似聚类中的向量与目标输入的比较返回相似性搜索结果，从而大大缩短查询时间。

通过调整`nprobe`，可以在给定的情况下找到精度和速度之间的理想平衡。随着目标输入向量数(`nq`)和要搜索的聚类数(`nprobe`)的增加，查询时间急剧增加。

BIN_IVF_FLAT是最基本的BIN_IVF索引，每个单元中存储的编码数据与原始数据一致。

* 索引构建参数

| 参数 | 描述 | 范围 |
| --- | --- | --- |
| `nlist` | 聚类单元数 | [1, 65536] |
* Search parameters

| Parameter | Description | Range |
| --- | --- | --- |
| `nprobe` | Number of units to query | CPU: [1, nlist]  GPU: [1, min(2048, nlist)] |

FAQ
---

What is the difference between FLAT index and IVF_FLAT index?
IVF_FLAT索引将向量空间划分为`nlist`个簇。如果保持默认值`nlist`为16384，则Milvus将比较目标向量与所有16384个簇的中心之间的距离，以获取`nprobe`个最近的簇。然后Milvus将比较目标向量与所选簇中的向量之间的距离，以获取最近的向量。与IVF_FLAT不同，FLAT直接比较目标向量与每个向量之间的距离。

因此，当向量总数约等于`nlist`时，IVF_FLAT和FLAT在所需计算方式和搜索性能方面几乎没有差异。但是，随着向量数量增加到`nlist`的两倍、三倍或n倍，IVF_FLAT索引开始显示出越来越大的优势。

有关更多信息，请参见[在Milvus中选择索引的方法](https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212)。

下一步操作
-----

* 了解Milvus支持的[相似度度量](metric.md)。
