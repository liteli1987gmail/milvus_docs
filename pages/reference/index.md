


# 内存中的索引

本主题列出了 Milvus 支持的各种类型的内存索引，以及它们最适合的场景和用户可以配置的参数，以实现更好的搜索性能。有关磁盘上的索引，请参阅 [磁盘上的索引](/reference/disk_index.md)。

索引是高效组织数据的过程，在大型数据集上极大地加速耗时查询，在使相似性搜索有用方面起着重要作用。

为了提高查询性能，你可以为每个向量字段 [指定索引类型](/userGuide/manage-indexes/index-vector-fields.md)。

<div class="alert note">
目前，一个向量字段仅支持一种索引类型。在切换索引类型时，Milvus 会自动删除旧的索引。
</div>

## ANNS（近似最近邻搜索）向量索引

Milvus 支持的大多数向量索引类型使用近似最近邻搜索（ANNS）算法。与通常非常耗时的精确检索相比，ANNS 的核心思想不再限于返回最准确的结果，而是仅搜索目标的邻居。ANNS 通过在可接受的范围内牺牲准确性来提高检索效率。

根据实现方法，ANNS 向量索引可分为四类：

- 基于树的索引
- 基于图的索引
- 基于哈希的索引
- 基于量化的索引

## Milvus 支持的索引




根据适当的数据类型，Milvus 支持的索引可以分为两类：

- 浮点型嵌入的索引

  - 对于 128 维浮点型嵌入，其占用的存储空间为 128 * float 的大小 = 512 字节。用于浮点型嵌入的距离度量标准为欧几里德距离（L2 范数）和内积。

  - 这些类型的索引包括 FLAT、IVF_FLAT、IVF_PQ、IVF_SQ8、HNSW 和 SCANN（beta 版），用于基于 CPU 的近似最近邻搜索。

- 二进制嵌入的索引

  - 对于 128 维二进制嵌入，其占用的存储空间为 128 / 8 = 16 字节。用于二进制嵌入的距离度量标准为 Jaccard 距离和 Hamming 距离。

  - 这种类型的索引包括 BIN_FLAT 和 BIN_IVF_FLAT。

- 稀疏嵌入的索引

  - 仅支持稀疏嵌入的 `IP`（内积）距离度量标准。

  - 稀疏嵌入的索引类型包括 `SPARSE_INVERTED_INDEX` 和 `SPARSE_WAND`。

下表对 Milvus 支持的索引进行了分类：

<div class="filter">
  <a href="#floating"> 浮点型嵌入 </a>
  <a href="#binary"> 二进制嵌入 </a>
  <a href="#sparse"> 稀疏嵌入 </a>
</div>

<div class="filter-floating table-wrapper">

<table id="floating">
<thead>
  <tr>
    <th> 支持的索引 </th>
    <th> 分类 </th>
    <th> 应用场景 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> FLAT </td>
    <td> N/A </td>
    <td>
      <ul>
        <li> 数据集较小 </li>
        <li> 需要 100%的召回率 </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td> IVF_FLAT </td>
    <td> 基于量化的索引 </td>
    <td>
      <ul>
        <li> 高速查询 </li>
        <li> 要求尽可能高的召回率 </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td> IVF_SQ8 </td>
    <td> 基于量化的索引 </td>
    <td>
      <ul>
        <li> 高速查询 </li>
        <li> 受限内存资源 </li>
        <li> 在召回率上有一定妥协 </li>
      </ul>
    </td>
  </tr>  
  <tr>
    <td> IVF_PQ </td>
    <td> 基于量化的索引 </td>
    <td>
      <ul>
        <li> 非常高速的查询 </li>
        <li> 受限内存资源 </li>
        <li> 在召回率上有较大妥协 </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td> HNSW </td>
    <td> 基于图的索引 </td>
    <td>
      <ul>
        <li> 非常高速的查询 </li>
        <li> 要求尽可能高的召回率 </li>
        <li> 较大的内存资源 </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td> SCANN </td>
    <td> 基于量化的索引 </td>
    <td>
      <ul>
        <li> 非常高速的查询 </li>
        <li> 要求尽可能高的召回率 </li>
 


# FLAT

FLAT 是一种适用于需要完美准确度且依赖相对较小（百万级）数据集的向量相似度搜索应用的索引。FLAT 不对向量进行压缩，并且是唯一能够保证搜索结果完全准确的索引。FLAT 的结果也可以用作与其他召回率不到 100%的索引产生的结果进行比较的基准。

FLAT 之所以准确是因为它采用了一种详尽的搜索方法，也就是说，对于每个查询，目标输入都要与数据集中的每组向量进行比较。这使得 FLAT 成为我们列表中最慢的索引，并且不适合查询大规模向量数据。在 Milvus 中，FLAT 索引不需要任何参数，使用它也不需要数据训练。

- 搜索参数

  | 参数          | 描述                                | 范围                                |
  | ------------- | ----------------------------------- | ----------------------------------- |
  | `metric_type` | [可选] 所选择的距离度量方式。 | 参见 [Supported Metrics](/reference/metric.md)。 |

### IVF_FLAT




I provide markdown document translation services. I will only translate the titles, paragraphs, and list contents in the markdown syntax. Camel case and underscore words do not need to be translated. Please retain the markdown syntax punctuation. After translating, I will replace the original content with the result and return it to you.

IVF_FLAT divides vector data into `nlist` cluster units, and then compares distances between the target input vector and the center of each cluster. Depending on the number of clusters the system is set to query (`nprobe`), similarity search results are returned based on comparisons between the target input and the vectors in the most similar cluster(s) only — drastically reducing query time.

By adjusting `nprobe`, an ideal balance between accuracy and speed can be found for a given scenario. Results from the [IVF_FLAT performance test](https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing) demonstrate that query time increases sharply as both the number of target input vectors (`nq`), and the number of clusters to search (`nprobe`), increase.

IVF_FLAT is the most basic IVF index, and the encoded data stored in each unit is consistent with the original data.

- Index building parameters

   | Parameter | Description             | Range      | Default Value |
   | --------- | ----------------------- | ---------- | ------------- |
   | `nlist`   | Number of cluster units | [1, 65536] | 128 |

- Search parameters

  - Common search

    | Parameter                  | Description                                             | Range      | Default Value |
    |----------------------------|---------------------------------------------------------|------------|---------------|
    | `nprobe`                   | Number of units to query                                | [1, nlist] | 8             |

  - Range search

    | Parameter                  | Description                                             | Range      | Default Value |
    |----------------------------|---------------------------------------------------------|------------|---------------|
    | `max_empty_result_buckets` | Maximum number of buckets not returning any search results.<br/> This is a range-search parameter and terminates the search process whilst the number of consecutive empty buckets reaches the specified value.<br/> Increasing this value can improve recall rate at the cost of increased search time. | [1, 65535] | 2  |

### IVF_SQ8

IVF_FLAT does not perform any compression, so the index files it produces are roughly the same size as the original, raw non-indexed vector data. For example, if the original 1B SIFT dataset is 476 GB, its IVF_FLAT index files will be slightly smaller (~470 GB). Loading all the index files into memory will consume 470 GB of storage.

When disk, CPU, or GPU memory resources are limited, IVF_SQ8 is a better option than IVF_FLAT. This index type can convert each FLOAT (4 bytes) to UINT8 (1 byte) by performing Scalar Quantization (SQ). This reduces disk, CPU, and GPU memory consumption by 70–75%. For the 1B SIFT dataset, the IVF_SQ8 index files require just 140 GB of storage.

- Index building parameters

   | Parameter | Description             | Range      |
   | --------- | ----------------------- | ---------- |
   | `nlist`   | Number of cluster units | [1, 65536] |

- Search parameters

  - Common search

    | Parameter | Description              | Range           | Default Value |
    | --------- | ------------------------ | --------------- | ------------- |
    | `nprobe`  | Number of units to query | [1, nlist]      | 8 |

  - Range search

    | Parameter                  | Description                                             | Range      | Default Value |
    |----------------------------|---------------------------------------------------------|------------|---------------|
    | `max_empty_result_buckets` | Maximum number of buckets not returning any search results.<br/> This is a range-search parameter and terminates the search process whilst the number of consecutive empty buckets reaches the specified value.<br/> Increasing this value can improve recall rate at the cost of increased search time. | [1, 65535] | 2  |

### IVF_PQ

`PQ` (Product Quantization) uniformly decomposes the original high-dimensional vector space into Cartesian products of `m` low-dimensional vector spaces, and then quantizes the decomposed low-dimensional vector spaces. Instead of calculating the distances between the target vector and the center of all the units, product quantization enables the calculation of distances between the target vector and the clustering center of each low-dimensional space and greatly reduces the time complexity and space complexity of the algorithm.

IVF\_PQ performs IVF index clustering before quantizing the product of vectors. Its index file is even smaller than IVF\_SQ8, but it also causes a loss of accuracy during searching vectors.

<div class="alert note">

Index building parameters and search parameters vary with Milvus distribution. Select your Milvus distribution first.

</div>

- Index building parameters

  | Parameter | Description                               | Range               |
  | --------- | ----------------------------------------- | ------------------- |
  | `nlist`   | Number of cluster units                   | [1, 65536]          |
  | `m`       | Number of factors of product quantization | `dim mod m == 0` |
  | `nbits`   | [Optional] Number of bits in which each low-dimensional vector is stored. | [1, 16] (8 by default) |

- Search parameters

  - Common search

    | Parameter | Description              | Range           | Default Value |
    | --------- | ------------------------ | --------------- | ------------- |
    | `nprobe`  | Number of units to query | [1, nlist]      | 8 |

  - Range search

    | Parameter                  | Description                                             | Range      | Default Value |
    |----------------------------|---------------------------------------------------------|------------|---------------|
    | `max_empty_result_buckets` | Maximum number of buckets not returning any search results.<br/> This is a range-search parameter and terminates the search process whilst the number of consecutive empty buckets reaches the specified value.<br/> Increasing this value can improve recall rate at the cost of increased search time. | [1, 65535] | 2  |

### SCANN
 

        
  SCANN（Score-aware quantization loss）在向量聚类和产品量化方面与 IVF_PQ 类似。它们之间的区别在于产品量化的实现细节和 SIMD（单指令/多数据）的使用以实现高效计算。

- 索引构建参数

  | 参数             | 描述                                              | 范围                     |
  |-----------------|------------------------------------------------|-------------------------|
  | `nlist`         | 聚类单元的数量                                      | [1, 65536]              |
  | `with_raw_data` | 是否在索引中包含原始数据                                | `True` 或 `False`，默认为 `True` |

  <div class="alert note">

  与 IVF_PQ 不同，默认值适用于 `m` 和 `nbits` 以优化性能。

  </div>

- 搜索参数

  - 常规搜索

    | 参数         | 描述                                                     | 范围             | 默认值       |
    | --------- | ------------------------------------------------------- | --------------- | ----------- |
    | `nprobe`  | 要查询的单元数量                                           | [1, nlist] |               |
    | `reorder_k` | 要查询的候选单元数量                                         | [`top_k`, ∞] | |

  - 范围搜索

    | 参数                     | 描述                                                                 | 范围             | 默认值         |
    |------------------------|--------------------------------------------------------------------|-----------------|----------------|
    | `max_empty_result_buckets` | 不返回任何搜索结果的最大桶的数量。<br/> 这是一个用于范围搜索的参数，当连续空桶的数量达到指定值时，搜索过程会终止。<br/> 增加此值可以提高召回率，但会增加搜索时间。 | [1, 65535] | 2                  |

### HNSW

HNSW（Hierarchical Navigable Small World Graph）是一种基于图的索引算法。它根据一定的规则为图像构建了一个多层导航结构。在这个结构中，上层更稀疏，节点之间的距离更远；下层更密集，节点之间的距离更近。搜索从最上层开始，在该层找到距离目标最近的节点，然后进入下一层开始另一次搜索。经过多次迭代，可以快速接近目标位置。

为了提高性能，HNSW 限制了图每一层节点的最大度数为 `M`。此外，你可以使用 `efConstruction`（在构建索引时）或 `ef`（在搜索目标时）来指定搜索范围。

- 索引构建参数

  | 参数            | 描述                                           | 范围             |
  |----------------|------------------------------------------------|-----------------|
  | `M`              | 节点的最大度数                                     | (2, 2048)        |
  | `efConstruction` | 在索引时间内用于最近邻居的动态列表的大小。越高的 `efConstruction` 可以提高索引质量，但会增加索引时间。| (1, int_max) |

- 搜索参数

  | 参数      | 描述                                     | 范围           |
  | --------- | --------------------------------------- | --------------- |
  | `ef`      | 在搜索时间内用于最近邻居的动态列表的大小。越高的 `ef` 可以获得更准确但更慢的搜索结果。 | [1, int_max] |

### BIN_FLAT

该索引与 FLAT 完全相同，只是它只适用于二进制嵌入。

对于需要完全准确性并依赖相对较小（百万级）数据集的向量相似性搜索应用程序，BIN_FLAT 索引是一个很好的选择。BIN_FLAT 不会压缩向量，并且是唯一可以保证精确搜索结果的索引。BIN_FLAT 的结果还可以用作与其他召回率低于 100%的索引生成的结果进行比较的基准。

BIN_FLAT 之所以准确，是因为它采用了穷举搜索的方法，这意味着对于每个查询，将目标输入与数据集中的向量进行比较。这使得 BIN_FLAT 成为我们列表中最慢的索引，并且不适用于查询大规模向量数据。在 Milvus 中，BIN_FLAT 索引没有参数，并且使用它不需要数据训练或额外存储。

- 搜索参数

  | 参数          | 描述                                                 | 范围                                  |
  | ------------- | --------------------------------------------------- | -------------------------------------- |
  | `metric_type` | [可选] 所选距离度量。                                 | 查看 [支持的度量](/reference/metric.md)。                     |

### BIN_IVF_FLAT

该索引与 IVF_FLAT 完全相同，只是它只适用于二进制嵌入。

BIN_IVF_FLAT 将向量数据划分为 `nlist` 个聚类单元，然后比较目标输入向量与每个聚类中心之间的距离。根据系统设置的要查询的聚类数（`nprobe`），基于目标输入与最相似的聚类中的向量的比较返回相似性搜索结果，从而大大减少了查询时间。

通过调整 `nprobe`，可以在给定的场景中找到准确性和速度之间的理想平衡。随着目标输入向量的数量（`nq`）和要搜索的聚类数（`nprobe`）的增加，查询时间急剧增加。

BIN_IVF_FLAT 是最基本的 BIN_IVF 索引，每个单元存储的编码数据与原始数据一致。

- 索引构建参数

  | 参数      | 描述                                     | 范围           |
  | --------- | --------------------------------------- | ----------------- |
  | `nlist`   | 聚类单元的数量                             | [1, 65536]        |

- 搜索参数

  - 常规搜索

    | 参数       | 描述                                      | 范围                  | 默认值           |
    | --------- | ---------------------------------------- | --------------------- | ---------------- |
    | `nprobe`  | 要查询的单元数量                            | [1, nlist]    | 8           |

  - 范围搜索

    | 参数                     | 描述                                                                 | 范围                  | 默认值         |
    |----------------------------|--------------------------------------------------------------------|------------|---------------|
    | `max_empty_result_buckets` | 不返回任何搜索结果的最大桶的数量。<br/> 这是一个用于范围搜索的参数，当连续空桶的数量达到指定值时，搜索过程会终止。<br/> 增加此值可以提高召回率，但会增加搜索时间。 | [1, 65535]        | 2              |
  
### SPARSE_INVERTED_INDEX

每个维度维护一个具有非零值的向量列表。在搜索过程中，Milvus 遍历查询向量的每个维度，并为在这些维度上具有非零值的向量计算得分。

- 索引构建参数

  | 参数                 | 描述                                                         | 范围       |
  | -------------------- | ------------------------------------------------------------ | ---------- |
  | `drop_ratio_build`   | 在构建索引过程中排除的小向量值的比例。此选项可以通过在构建索引时忽略小值来微调索引过程，以在效率和准确性之间进行权衡。 | [0, 1]     |

- 搜索参数

  | 参数                 | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 范围     |
  | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
  | `drop_ratio_search`  | 在搜索过程中排除的小向量值的比例。此选项允许通过指定查询向量中最小值的比例来微调搜索过程，以平衡搜索精度和性能。对于设置较小的 `drop_ratio_search` 值，这些小值对最终得分的贡献较小。通过忽略一些小值，可以提高搜索性能，对准确性的影响很小。 | [0, 1]   |

### SPARSE_WAND

此索引与 `SPARSE_INVERTED_INDEX` 类似，但在搜索过程中利用了 [Weak-AND](https://dl.acm.org/doi/10.1145/956863.956944) 算法，进一步减少了完整 IP 距离计算的次数。

根据我们的测试，`SPARSE_WAND` 在速度方面通常优于其他方法。然而，随着向量密度的增加，其性能可能会迅速下降。为了解决这个问题，引入一个非零的 `drop_ratio_search` 可以显著提高性能，同时只带来很小的精度损失。有关更多信息，请参阅 [稀疏向量](/reference/sparse_vector.md)。

- 索引构建参数

  | 参数                 | 描述                                                         | 范围       |
  | -------------------- | ------------------------------------------------------------ | ---------- |
  | `drop_ratio_build`   | 在构建索引过程中排除的小向量值的比例。此选项可以通过在构建索引时忽略小值来微调索引过程，以在效率和准确性之间进行权衡。 | [0, 1]     |

- 搜索参数

  | 参数                 | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 范围     |
  | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
  | `drop_ratio_search`  | 在搜索过程中排除的小向量值的比例。此选项允许通过指定查询向量中最小值的比例来微调搜索过程，以平衡搜索精度和性能。对于设置较小的 `drop_ratio_search` 值，这些小值对最终得分的贡献较小。通过忽略一些小值，可以提高搜索性能，对准确性的影响很小。 | [0, 1]   |

## 常见问题

<details>
<summary> <font color="#4fc4f9"> FLAT 索引和 IVF_FLAT 索引之间有什么区别？</font> </summary>
{{fragments/faq_flat_ivfflat.md}}
</details>

## 接下来是什么


# 
- 了解更多关于 Milvus 支持的 [相似度度量](/reference/metric.md)。

