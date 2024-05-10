---
id: gpu_index.md
related_key: gpu_index
summary: GPU index mechanism in Milvus.
title: GPU Index
---

# GPU 索引

Milvus 支持多种 GPU 索引类型，以加速搜索性能和效率，特别是在高吞吐量、低延迟和高召回率的场景中。本主题提供了 Milvus 支持的 GPU 索引类型的概述，它们的适用用例以及性能特性。有关使用 GPU 构建索引的信息，请参考[Index with GPU](index-with-gpu.md)。

GPU 加速可以大大提高 Milvus 的搜索性能和效率，特别是在高吞吐量、低延迟和高召回率的场景中，并且对大型 nq 批处理搜索场景也非常友好。

![performance](/public/assets/gpu_index.png)

Milvus 的 GPU 支持由 Nvidia [RAPIDS](https://rapids.ai/)团队提供。以下是 Milvus 当前支持的 GPU 索引类型。

## GPU_CAGRA

GPU_CAGRA 是基于图的索引，针对 GPU 进行了优化，在推理 GPU 上表现良好。它最适合查询数量较少的情况，在这种情况下，使用较低内存频率训练 GPU 可能无法获得最佳结果。

- 索引构建参数

  | 参数                        | 描述                                                                                                                                                                          | 默认值               |
  | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
  | `intermediate_graph_degree` | 通过确定修剪前图的度数，影响召回率和构建时间。推荐值是`32`或`64`。                                                                                                            | <code>128</code>     |
  | `graph_degree`              | 通过设置修剪后图的度数，影响搜索性能和召回率。这两个度数之间的差异越大，构建时间越长。它的值必须小于**intermediate_graph_degree**的值。                                       | <code>64</code>      |
  | `build_algo`                | 选择修剪前图生成算法。可能的值：</br><code>IVF_PQ</code>：提供更高的质量，但构建时间更慢。</br> <code>NN_DESCENT</code>：提供更快的构建，但可能召回率较低。                   | <code>IVF_PQ</code>  |
  | `cache_dataset_on_device`   | 决定是否在 GPU 内存中缓存原始数据集。可能的值：</br><code>"true"</code>：缓存原始数据集以通过细化搜索结果提高召回率。</br> <code>"false"</code>：不缓存原始数据集以节省内存。 | <code>"false"</code> |

- 搜索参数

  | 参数                                | 描述                                                                                                                                                                               | 默认值 |
  | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
  | `itopk_size`                        | 确定搜索期间保留的中间结果的大小。较大的值可能会提高召回率，但可能会影响搜索性能。它应该至少等于最终的 top-k（限制）值，并且通常是 2 的幂（例如，16, 32, 64, 128）。               | Empty  |
  | `search_width`                      | 指定搜索期间进入 CAGRA 图的入口点数量。增加此值可以提高召回率，但可能会影响搜索性能。                                                                                              | Empty  |
  | `min_iterations` / `max_iterations` | 控制搜索迭代过程。默认情况下，它们设置为`0`，并且 CAGRA 根据`itopk_size`和`search_width`自动确定迭代次数。手动调整这些值可以帮助平衡性能和准确性。                                 | `0`    |
  | `team_size`                         | 指定用于在 GPU 上计算度量距离的 CUDA 线程数量。常见值是 2 的幂，最高可达 32（例如 2, 4, 8, 16, 32）。它对搜索性能有轻微影响。默认值是`0`，Milvus 根据向量维度自动选择`team_size`。 | `0`    |

## GPU_IVF_FLAT

与[IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT)类似，GPU_IVF_FLAT 也将向量数据分成`nlist`个簇单元，然后比较目标输入向量和每个簇的中心之间的距离。根据系统设置的要查询的簇数量（`nprobe`），仅基于目标输入和最相似簇中的向量之间的比较返回相似性搜索结果，从而大大减少了查询时间。

通过调整`nprobe`，可以在给定场景中找到准确性和速度之间的理想平衡。来自[IVF_FLAT 性能测试](https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)的结果表明，随着目标输入向量（`nq`）的数量和要搜索的簇（`nprobe`）的数量的增加，查询时间急剧增加。

GPU_IVF_FLAT is the most basic IVF index, and the encoded data stored in each unit is consistent with the original data.

When conducting searches, note that you can set the top-K up to 256 for any search against a GPU_IVF_FLAT-indexed collection.

- Index building parameters

  | Parameter | Description             | Range      | Default Value |
  | --------- | ----------------------- | ---------- | ------------- |
  | `nlist`   | Number of cluster units | [1, 65536] | 128           |

- Search parameters

  - Common search

    | Parameter | Description              | Range      | Default Value |
    | --------- | ------------------------ | ---------- | ------------- |
    | `nprobe`  | Number of units to query | [1, nlist] | 8             |

- Limits on search

  | Parameter | Range  |
  | --------- | ------ |
  | `top-K`   | <= 256 |

## GPU_IVF_PQ

`PQ` (Product Quantization) uniformly decomposes the original high-dimensional vector space into Cartesian products of `m` low-dimensional vector spaces, and then quantizes the decomposed low-dimensional vector spaces. Instead of calculating the distances between the target vector and the center of all the units, product quantization enables the calculation of distances between the target vector and the clustering center of each low-dimensional space and greatly reduces the time complexity and space complexity of the algorithm.

IVF_PQ performs IVF index clustering before quantizing the product of vectors. Its index file is even smaller than IVF_SQ8, but it also causes a loss of accuracy during searching vectors.

<div class="alert note">

Index building parameters and search parameters vary with Milvus distribution. Select your Milvus distribution first.

When conducting searches, note that you can set the top-K up to 8192 for any search against a GPU_IVF_FLAT-indexed collection.

</div>

- Index building parameters

  | Parameter | Description                                                               | Range            | Default Value |
  | --------- | ------------------------------------------------------------------------- | ---------------- | ------------- |
  | `nlist`   | Number of cluster units                                                   | [1, 65536]       | 128           |
  | `m`       | Number of factors of product quantization                                 | `dim mod m == 0` | 4             |
  | `nbits`   | [Optional] Number of bits in which each low-dimensional vector is stored. | [1, 16]          | 8             |

- Search parameters

  - Common search

    | Parameter | Description              | Range      | Default Value |
    | --------- | ------------------------ | ---------- | ------------- |
    | `nprobe`  | Number of units to query | [1, nlist] | 8             |

- Limits on search

  | Parameter | Range   |
  | --------- | ------- |
  | `top-K`   | <= 1024 |

## GPU_BRUTE_FORCE

GPU_BRUTE_FORCE is tailored for cases where extremely high recall is crucial, guaranteeing a recall of 1 by comparing each query with all vectors in the dataset. It only requires the metric type (`metric_type`) and top-k (`limit`) as index building and search parameters.

For GPU_BRUTE_FORCE, no addition index building parameters or search parameters are required.

## Conclusion

Currently, Milvus loads all indexes into GPU memory for efficient search operations. The amount of data that can be loaded depends on the size of the GPU memory:

- **GPU_CAGRA**: Memory usage is approximately 1.8 times that of the original vector data.
- **GPU_IVF_FLAT** and **GPU_BRUTE_FORCE**: Requires memory equal to the size of the original data.
- **GPU_IVF_PQ**: Utilizes a smaller memory footprint, which depends on the compression parameter settings.
