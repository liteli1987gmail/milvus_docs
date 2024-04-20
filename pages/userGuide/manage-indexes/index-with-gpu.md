---
title: GPU支持下构建索引
---

# GPU支持下构建索引

本指南概述了在Milvus中构建GPU支持的索引的步骤，这可以显著提高高吞吐量和高召回率场景下的搜索性能。有关Milvus支持的GPU索引类型的详细信息，请参阅[GPU索引](gpu_index.md)。

## 为GPU内存控制配置Milvus设置

Milvus使用全局图形内存池来分配GPU内存。

它在[Milvus配置文件](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml#L767-L769)中支持两个参数`initMemSize`和`maxMemSize`。池的大小最初设置为`initMemSize`，并在超过此限制后自动扩展到`maxMemSize`。

默认的`initMemSize`是Milvus启动时可用GPU内存的1/2，而默认的`maxMemSize`等于所有可用的GPU内存。

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

以下示例展示了如何构建不同类型的GPU索引。

### 准备索引参数

在设置GPU索引参数时，定义__index_type__、__metric_type__和__params__：

- __index_type__（字符串）：用于加速向量搜索的索引类型。有效选项包括__GPU_CAGRA__、__GPU_IVF_FLAT__、__GPU_IVF_PQ__和__GPU_BRUTE_FORCE__。

- __metric_type__（字符串）：用于测量向量相似度的度量类型。有效选项是__IP__和__L2__。

- __params__（字典）：特定于索引的构建参数。此参数的有效选项取决于索引类型。

以下是不同索引类型的示例配置：

- __GPU_CAGRA__索引

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

    __params__的可能选项包括：

    - __intermediate_graph_degree__（整数）：通过确定修剪前的图的度数，影响召回率和构建时间。推荐值为__32__或__64__。

    - __graph_degree__（整数）：通过设置修剪后的图的度数，影响搜索性能和召回率。通常，它是__intermediate_graph_degree__的一半。这两个度数之间的较大差异会导致更长的构建时间。它的值必须小于__intermediate_graph_degree__的值。

    - __build_algo__（字符串）：选择修剪前的图生成算法。可能的选项：

        - __IVF_PQ__：提供更高的质量，但构建时间较慢。

        - __NN_DESCENT__：提供更快的构建，可能召回率较低。

    - __cache_dataset_on_device__（字符串，__"true"__ | __"false"__)：决定是否在GPU内存中缓存原始数据集。将其设置为__"true"__可以通过细化搜索结果来提高召回率，而将其设置为__"false"__可以节省GPU内存。

- __GPU_IVF_FLAT__或__GPU_IVF_PQ__索引

    ```python
    index_params = {
        "metric_type": "L2",
        "index_type": "GPU_IVF_FLAT", # 或 GPU_IVF_PQ
        "params": {
            "nlist": 1024
        }
    }
    ```

    __params__选项与在__[IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT)__和__[IVF_PQ](https://milvus.io/docs/index.md#IVF_PQ)__中使用的选项相同。

- __GPU_BRUTE_FORCE__索引

    ```python
    index_params = {
        'index_type': 'GPU_BRUTE_FORCE',
        'metric_type': 'L2',
        'params': {}
    }
    ```

    不需要额外的__params__配置。

### 构建索引

在__index_params__中配置索引参数后，调用