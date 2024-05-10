---
title: GPU支持下构建索引
---

# GPU 支持下构建索引

本指南概述了在 Milvus 中构建 GPU 支持的索引的步骤，这可以显著提高高吞吐量和高召回率场景下的搜索性能。有关 Milvus 支持的 GPU 索引类型的详细信息，请参阅[GPU 索引](gpu_index.md)。

## 为 GPU 内存控制配置 Milvus 设置

Milvus 使用全局图形内存池来分配 GPU 内存。

它在[Milvus 配置文件](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml#L767-L769)中支持两个参数`initMemSize`和`maxMemSize`。池的大小最初设置为`initMemSize`，并在超过此限制后自动扩展到`maxMemSize`。

默认的`initMemSize`是 Milvus 启动时可用 GPU 内存的 1/2，而默认的`maxMemSize`等于所有可用的 GPU 内存。

```yaml
#当使用GPU索引时，Milvus将使用内存池以避免频繁的内存分配和释放。
#在这里，您可以设置内存池占用的内存大小，单位为MB。
#请注意，当实际内存需求超过由maxMemSize设置的值时，Milvus可能会崩溃。
#如果initMemSize和MaxMemSize都设置为零，
#Milvus将自动初始化一半的可用GPU内存，
#maxMemSize将整个可用GPU内存作为默认值。
gpu:
  initMemSize: 0 #设置初始内存池大小。
  maxMemSize: 0 #maxMemSize设置最大内存使用限制。当内存使用量超过initMemSize时，Milvus将尝试扩展内存池。
```

## 构建索引

以下示例展示了如何构建不同类型的 GPU 索引。

### 准备索引参数

在设置 GPU 索引参数时，定义**index_type**、**metric_type**和**params**：

- **index_type**（字符串）：用于加速向量搜索的索引类型。有效选项包括**GPU_CAGRA**、**GPU_IVF_FLAT**、**GPU_IVF_PQ**和**GPU_BRUTE_FORCE**。

- **metric_type**（字符串）：用于测量向量相似度的度量类型。有效选项是**IP**和**L2**。

- **params**（字典）：特定于索引的构建参数。此参数的有效选项取决于索引类型。

以下是不同索引类型的示例配置：

- **GPU_CAGRA**索引

  ```python
  index_params = {
      "metric_type": "L2",
      "index_type": "GPU_CAGRA",
      "params": {
          'intermediate_graph_degree': 64,
          'graph_degree': 32
      }
  }
  ```

  **params**的可能选项包括：

  - **intermediate_graph_degree**（整数）：通过确定修剪前的图的度数，影响召回率和构建时间。推荐值为**32**或**64**。

  - **graph_degree**（整数）：通过设置修剪后的图的度数，影响搜索性能和召回率。通常，它是**intermediate_graph_degree**的一半。这两个度数之间的较大差异会导致更长的构建时间。它的值必须小于**intermediate_graph_degree**的值。

  - **build_algo**（字符串）：选择修剪前的图生成算法。可能的选项：

    - **IVF_PQ**：提供更高的质量，但构建时间较慢。

    - **NN_DESCENT**：提供更快的构建，可能召回率较低。

  - **cache_dataset_on_device**（字符串，**"true"** | **"false"**)：决定是否在 GPU 内存中缓存原始数据集。将其设置为**"true"**可以通过细化搜索结果来提高召回率，而将其设置为**"false"**可以节省 GPU 内存。

- **GPU_IVF_FLAT**或**GPU_IVF_PQ**索引

  ```python
  index_params = {
      "metric_type": "L2",
      "index_type": "GPU_IVF_FLAT", # 或 GPU_IVF_PQ
      "params": {
          "nlist": 1024
      }
  }
  ```

  **params**选项与在**[IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT)**和**[IVF_PQ](https://milvus.io/docs/index.md#IVF_PQ)**中使用的选项相同。

- **GPU_BRUTE_FORCE**索引

  ```python
  index_params = {
      'index_type': 'GPU_BRUTE_FORCE',
      'metric_type': 'L2',
      'params': {}
  }
  ```

  不需要额外的**params**配置。

### Build index

After configuring the index parameters in **index_params**, call the `create_index()` method to build the index.

```python
# Get an existing collection
collection = Collection("YOUR_COLLECTION_NAME")

collection.create_index(
    field_name="vector", # Name of the vector field on which an index is built
    index_params=index_params
)
```

## Search

Once you have built your GPU index, the next step is to prepare the search parameters before conducting a search.

### Prepare search parameters

Below are example configurations for different index types:

- **GPU_BRUTE_FORCE** index

  ```python
  search_params = {
      "metric_type": "L2",
      "params": {}
  }
  ```

  No additional **params** configurations are required.

- **GPU_CAGRA** index

  ```python
  search_params = {
      "metric_type": "L2",
      "params": {
          "itopk_size": 128,
          "search_width": 4,
          "min_iterations": 0,
          "max_iterations": 0,
          "team_size": 0
      }
  }
  ```

  Key search parameters include:

  - **itopk_size**: Determines the size of intermediate results kept during the search. A larger value may improve recall at the expense of search performance. It should be at least equal to the final top-k (**limit**) value and is typically a power of 2 (e.g., 16, 32, 64, 128).

  - **search_width**: Specifies the number of entry points into the CAGRA graph during the search. Increasing this value can enhance recall but may impact search performance.

  - **min_iterations** / **max_iterations**: These parameters control the search iteration process. By default, they are set to **0**, and CAGRA automatically determines the number of iterations based on **itopk_size** and **search_width**. Adjusting these values manually can help balance performance and accuracy.

  - **team_size**: Specifies the number of CUDA threads used for calculating metric distance on the GPU. Common values are a power of 2 up to 32 (e.g. 2, 4, 8, 16, 32). It has a minor impact on search performance. The default value is **0**, where Milvus automatically selects the **team_size** based on the vector dimension.

- **GPU_IVF_FLAT** or **GPU_IVF_PQ** index

  ```python
  search_params = {
      "metric_type": "L2",
      "params": {"nprobe": 10}
  }
  ```

  Search parameters for these two index types are similar to those used in **[IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT) and [IVF_PQ](https://milvus.io/docs/index.md#IVF_PQ)**. For more information, refer to [Conduct a Vector Similarity Search](https://milvus.io/docs/search.md#Prepare-search-parameters).

### Conduct a search

Use the `search()` method to perform a vector similarity search on the GPU index.

```python
# Load data into memory
collection.load()

collection.search(
    data=[[query_vector]], # Your query vector
    anns_field="vector", # Name of the vector field
    param=search_params,
    limit=100 # Number of the results to return
)
```

## Limits

When using GPU indexes, be aware of certain constraints:

- For **GPU_IVF_FLAT**, the maximum value for **limit** is 256.

- For **GPU_IVF_PQ** and **GPU_CAGRA**, the maximum value for **limit** is 1024.

- While there is no set limit for **limit** on **GPU_BRUTE_FORCE**, it is recommended not to exceed 4096 to avoid potential performance issues.

- Currently, GPU indexes do not support COSINE distance. If COSINE distance is required, data should be normalized first, and then inner product (IP) distance can be used as a substitute.

- Loading OOM protection for GPU indexes is not fully supported, too much data might lead to QueryNode crashes.

- GPU indexes do not support search functions like [range search](https://milvus.io/docs/single-vector-search.md#Range-search) and [grouping search](https://milvus.io/docs/single-vector-search.md#Grouping-searchh).

## FAQ

- **When is it appropriate to utilize a GPU index?**

  A GPU index is particularly beneficial in situations that demand high throughput or high recall. For instance, when dealing with large batches, the throughput of GPU indexing can surpass that of CPU indexing by as much as 100 times. In scenarios with smaller batches, GPU indexes still significantly outshine CPU indexes in terms of performance. Furthermore, if there's a requirement for rapid data insertion, incorporating a GPU can substantially speed up the process of building indexes.

- **In which scenarios are GPU indexes like CAGRA, GPU_IVF_PQ, GPU_IVF_FLAT, and GPU_BRUTE_FORCE most suitable?**

  CAGRA indexes are ideal for scenarios that demand enhanced performance, albeit at the cost of consuming more memory. For environments where memory conservation is a priority, the **GPU_IVF_PQ** index can help minimize storage requirements, though this comes with a higher loss in precision. The **GPU_IVF_FLAT** index serves as a balanced option, offering a compromise between performance and memory usage. Lastly, the **GPU_BRUTE_FORCE** index is designed for exhaustive search operations, guaranteeing a recall rate of 1 by performing traversal searches.
