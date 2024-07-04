

# 使用 GPU 进行索引

本指南介绍了如何在 Milvus 中使用 GPU 支持构建索引，以提高搜索性能。

## 配置 Milvus 中的 GPU 内存控制设置

Milvus 使用全局图形内存池来分配 GPU 内存。

它在 [Milvus 配置文件](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml#L767-L769) 中支持两个参数 `initMemSize` 和 `maxMemSize`。内存池的大小初始设置为 `initMemSize`，在超过此限制后，将自动扩展为 `maxMemSize`。

默认的 `initMemSize` 为 Milvus 启动时可用 GPU 内存的 1/2，而默认的 `maxMemSize` 等于所有可用的 GPU 内存。

```yaml
# 使用GPU索引时，Milvus将使用内存池来避免频繁的内存分配和释放。
# 在此处，你可以设置内存池占用的内存大小，单位为MB。
# 请注意，当实际内存需求超过maxMemSize设置的值时，Milvus有可能崩溃。
# 如果initMemSize和MaxMemSize都设置为零，
# Milvus将自动初始化可用GPU内存的一半，
# 默认情况下，maxMemSize的值为全部可用的GPU内存。
gpu:
  initMemSize: 0  # 设置初始内存池大小。
  maxMemSize: 0   # maxMemSize设置最大的内存使用限制。当内存使用超过initMemSize时，Milvus将尝试扩展内存池。
```

## 构建索引

以下示例演示了如何构建不同类型的 GPU 索引。

### 准备索引参数




在设置 GPU 索引参数时，定义 __index_type__、__metric_type__ 和 __params__：

- __index_type__ (_string_): 用于加速向量搜索的索引类型。有效选项包括 __GPU_CAGRA__, __GPU_IVF_FLAT__, __GPU_IVF_PQ__ 和 __GPU_BRUTE_FORCE__。

- __metric_type__ (_string_): 用于衡量向量相似度的指标类型。有效选项为 __IP__ 和 __L2__。

- __params__(_dict_): 索引特定的建立参数。此参数的有效选项取决于索引类型。

以下是不同索引类型的示例配置:

- __GPU_CAGRA__ 索引

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

    __params__ 的可选项包括:

    - __intermediate_graph_degree__ (_int_): 影响召回率和建索时间，确定修剪前图的度数。建议值为 __32__ 或 __64__。

    - __graph_degree__ (_int_): 通过设置修剪后的图的度数来影响搜索性能和召回率。通常，它是 __intermediate_graph_degree__ 的一半。这两个度数之间的差异越大，建索时间越长。它的值必须小于 __intermediate_graph_degree__ 的值。

    - __build_algo__ (_string_): 在修剪前选择生成图的算法。可能的选项: 

        - __IVF_PQ__: 提供更高的质量但建索时间较慢。

        - __NN_DESCENT__: 提供更快速的建索，但可能召回率较低。

    - __cache_dataset_on_device__ (_string_, __"true"__ | __"false"__): 决定是否将原始数据集缓存在 GPU 内存中。将其设置为 __"true"__ 可以通过优化搜索结果来改善召回率，将其设置为 __"false"__ 可以节省 GPU 内存。

- __GPU_IVF_FLAT__ 或 __GPU_IVF_PQ__ 索引

    ```python
    index_params = {
        "metric_type": "L2",
        "index_type": "GPU_IVF_FLAT", # 或者 GPU_IVF_PQ
        "params": {
            "nlist": 1024
        }
    }
    ```

    __params__ 的选项与 __[IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT)__ 和 __[IVF_PQ](https://milvus.io/docs/index.md#IVF_PQ)__ 中使用的选项相同。

- __GPU_BRUTE_FORCE__ 索引

    ```python
    index_params = {
        'index_type': 'GPU_BRUTE_FORCE',
        'metric_type': 'L2',
        'params': {}
    }
    ```

    不需要额外的 __params__ 配置。

### 建立索引

在 __index_params__ 中配置索引参数后，调用 `create_index()` 方法来建立索引。

```python
# 获取现有的集合
collection = Collection("YOUR_COLLECTION_NAME")

collection.create_index(
    field_name="vector", # 建立索引的向量字段的名称
    index_params=index_params
)
```

## 搜索

建立 GPU 索引后，下一步是在进行搜索之前准备搜索参数。

### 准备搜索参数



以下是不同索引类型的示例配置：

- GPU_BRUTE_FORCE 索引

    ```python
    search_params = {
        "metric_type": "L2",
        "params": {}
    }
    ```

    不需要额外的 params 配置。

- GPU_CAGRA 索引

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

    关键的搜索参数包括：

    - itopk_size：确定在搜索期间保留的中间结果的大小。较大的值可能会牺牲搜索性能以提高召回率。它应该至少等于最终的 top-k (limit) 值，并且通常是 2 的幂次方（例如，16、32、64、128）。

    - search_width：指定在搜索期间进入 CAGRA 图的入口点数。增加此值可以增强召回率，但可能会影响搜索性能。

    - min_iterations / max_iterations：这些参数控制搜索迭代过程。默认情况下，它们设置为 0，CAGRA 会根据 itopk_size 和 search_width 自动确定迭代次数。手动调整这些值可以帮助平衡性能和准确性。

    - team_size：指定用于在 GPU 上计算度量距离的 CUDA 线程数。常见的值是 2 的幂次方，最多是 32（例如 2、4、8、16、32）。它对搜索性能影响较小。默认值为 0，Milvus 会根据向量维度自动选择 team_size。

- GPU_IVF_FLAT 或 GPU_IVF_PQ 索引

    ```python
    search_params = {
        "metric_type": "L2", 
        "params": {"nprobe": 10}
    }
    ```

    这两种索引类型的搜索参数与 [IVF_FLAT](https://milvus.io/docs/index.md#IVF_FLAT) 和 [IVF_PQ](https://milvus.io/docs/index.md#IVF_PQ) 中使用的参数类似。有关更多信息，请参阅 [进行向量相似性搜索](https://milvus.io/docs/search.md#Prepare-search-parameters)。

### 执行搜索

使用 `search()` 方法在 GPU 索引上执行向量相似性搜索。

```python
# 加载数据到内存
collection.load()

collection.search(
    data=[[query_vector]], # 查询向量
    anns_field="vector", # 向量字段的名称
    param=search_params,
    limit=100 # 返回结果的数量
)
```

## 限制

使用 GPU 索引时，请注意以下限制：

- 对于 GPU_IVF_FLAT，limit 的最大值为 256。

- 对于 GPU_IVF_PQ 和 GPU_CAGRA，limit 的最大值为 1024。

- 在 GPU_BRUTE_FORCE 上，limit 没有明确定义的限制，但建议不要超过 4096，以避免潜在的性能问题。

- 目前，GPU 索引不支持 COSINE 距离。如果需要 COSINE 距离，数据应该先归一化，然后可以使用内积 (IP) 距离作为替代。

- GPU 索引的 OOM 保护支持不完全，过多的数据可能导致 QueryNode 崩溃。

- GPU 索引不支持诸如 [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search) 和 [分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search) 之类的搜索功能。

## 常见问题解答

当应该使用 GPU 索引？
  
  GPU 索引在需要高吞吐量或高召回率的情况下特别有益。例如，在处理大批量数据时，GPU 索引的吞吐量可以超过 CPU 索引 100 倍。在较小批量的情况下，GPU 索引在性能方面仍然明显优于 CPU 索引。此外，如果需要快速插入数据，在构建索引过程中加入 GPU 可以大大加快速度。

在哪些情况下最适合使用像 CAGRA、GPU_IVF_PQ、GPU_IVF_FLAT 和 GPU_BRUTE_FORCE 等 GPU 索引？

  CAGRA 索引适用于需要提高性能的情况，尽管会消耗更多内存。对于注重内存保留的环境，GPU_IVF_PQ 索引可以帮助减少存储需求，但这会带来更高的精度损失。GPU_IVF_FLAT 索引作为一种平衡的选择，在性能和内存使用之间做出妥协。最后，GPU_BRUTE_FORCE 索引专为穷举搜索操作设计，通过执行遍历搜索来保证召回率为 1。