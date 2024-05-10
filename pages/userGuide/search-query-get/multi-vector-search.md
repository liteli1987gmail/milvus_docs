---
id: multi-vector-search.md
order: 2
summary: This guide demonstrates how to perform multi-vector search in Milvus and understand the reranking of results.
title: Multi-Vector Search
---

# 多向量搜索

## 概述

自 Milvus 2.4 版本起，我们引入了多向量支持和混合搜索框架，这意味着用户可以将多个向量字段（最多 10 个）带入单个集合中。不同的向量字段可以代表不同的方面、不同的嵌入模型，甚至可以是描述同一实体的不同模态的数据，这极大地扩展了信息的丰富性。此功能在全面搜索场景中特别有用，例如基于图片、声音、指纹等多种属性识别向量库中最相似的人。

多向量搜索允许在不同的向量字段上执行搜索请求，并使用重新排序策略（如互反排名融合（RRF）和加权评分）结合结果。要了解更多关于重新排序策略的信息，请参考[重新排序](reranking.md)。

在本教程中，您将学习如何：

- 为不同向量字段的相似性搜索创建多个 `AnnSearchRequest` 实例；
- 配置重新排序策略以组合和重新排序来自多个 `AnnSearchRequest` 实例的搜索结果；
- 使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法执行多向量搜索。

<div class="alert note">

本页上的代码片段使用 [PyMilvus ORM 模块](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md) 与 Milvus 交互。使用新的 [MilvusClient SDK](https://milvus.io/api-reference/pymilvus/v2.4.x/About.md) 的代码片段将很快提供。

</div>

## 准备工作

在开始多向量搜索之前，请确保您有一个包含多个向量字段的集合。

以下是创建一个名为 `test_collection` 的集合的示例，该集合包含两个向量字段 `filmVector` 和 `posterVector`，并将随机实体插入其中。

```python
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
import random

# 连接到 Milvus
connections.connect(
    host="10.102.7.3", # 替换为您的 Milvus 服务器 IP
    port="19530"
)

# 创建 schema
fields = [
    FieldSchema(name="film_id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="filmVector", dtype=DataType.FLOAT_VECTOR, dim=5), # 电影向量字段
    FieldSchema(name="posterVector", dtype=DataType.FLOAT_VECTOR, dim=5)] # 海报向量字段

schema = CollectionSchema(fields=fields,enable_dynamic_field=False)

# 创建集合
collection = Collection(name="test_collection", schema=schema)

# 为每个向量字段创建索引
index_params = {
    "metric_type": "L2",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 128},
}

collection.create_index("filmVector", index_params)
collection.create_index("posterVector", index_params)

# 生成随机实体以插入
entities = []

for _ in range(1000):
    # 为 schema 中的每个字段生成随机值
    film_id = random.randint(1, 1000)
    film_vector = [ random.random() for _ in range(5) ]
    poster_vector = [ random.random() for _ in range(5) ]

    # 为每个实体创建一个字典
    entity = {
        "film_id": film_id,
        "filmVector": film_vector,
        "posterVector": poster_vector
    }

    # 将实体添加到列表中
    entities.append(entity)

collection.insert(entities)
```

## 第 1 步：创建多个 AnnSearchRequest 实例

多向量搜索使用 `hybrid_search()` API 在单个调用中执行多个 ANN 搜索请求。每个 `AnnSearchRequest` 代表对特定向量字段的单个搜索请求。

以下示例创建了两个 `AnnSearchRequest` 实例，以对两个向量字段执行单独的相似性搜索。

```python
from pymilvus import AnnSearchRequest

# 创建针对 filmVector 的 ANN 搜索请求 1
query_filmVector = [[0.8896863042430693, 0.370613100114602, 0.23779315077113428, 0.38227915951132996, 0.5997064603128835]]

search_param_1 = {
    "data": query_filmVector, # 查询向量
    "anns_field": "filmVector", # 向量字段名称
    "param": {
        "metric_type": "L2", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 2 # Number of search results to return in this AnnSearchRequest
}
request_1 = AnnSearchRequest(**search_param_1)

# Create ANN search request 2 for posterVector
query_posterVector = [[0.02550758562349764, 0.006085637357292062, 0.5325251250159071, 0.7676432650114147, 0.5521074424751443]]
search_param_2 = {
    "data": query_posterVector, # Query vector
    "anns_field": "posterVector", # Vector field name
    "param": {
        "metric_type": "L2", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 2 # Number of search results to return in this AnnSearchRequest
}
request_2 = AnnSearchRequest(**search_param_2)

# Store these two requests as a list in `reqs`
reqs = [request_1, request_2]
```

Parameters:

- `AnnSearchRequest` (_object_)

  A class representing an ANN search request. Each hybrid search can contain 1 to 1,024 `ANNSearchRequest` objects at a time.

- `data` (_list_)

  The query vector to search in a single `AnnSearchRequest`. Currently, this parameter accepts a list containing only a single query vector, for example, `[[0.5791814851218929, 0.5792985702614121, 0.8480776460143558, 0.16098005945243, 0.2842979317256803]]`. In the future, this parameter will be expanded to accept multiple query vectors.

- `anns_field` (_string_)

  The name of the vector field to use in a single `AnnSearchRequest`.

- `param` (_dict_)

  A dictionary of search parameters for a single `AnnSearchRequest`. These search parameters are identical to those for a single-vector search. For more information, refer to [Search parameters](https://milvus.io/docs/single-vector-search.md#Search-parameters).

- `limit` (_int_)

  The maximum number of search results to include in a single `ANNSearchRequest`.

  This parameter only affects the number of search results to return within an individual `ANNSearchRequest`, and it does not decide the final results to return for a `hybrid_search` call. In a hybrid search, the final results are determined by combining and reranking the results from multiple `ANNSearchRequest` instances.

## Step 2: Configure a Reranking Strategy

After creating `AnnSearchRequest` instances, configure a reranking strategy to combine and rerank the results. Currently, there are two options: `WeightedRanker` and `RRFRanker`. For more information about reranking strategies, refer to [Reranking](reranking.md).

- Use weighted scoring

  The `WeightedRanker` is used to assign importance to the results from each vector field search with specified weights. If you prioritize some vector fields over others, `WeightedRanker(value1, value2, ..., valueN)` can reflect this in the combined search results.

  ```python
  from pymilvus import WeightedRanker
  # Use WeightedRanker to combine results with specified weights
  # Assign weights of 0.8 to text search and 0.2 to image search
  rerank = WeightedRanker(0.8, 0.2)
  ```

  When using `WeightedRanker`, note that:

  - Each weight value ranges from 0 (least important) to 1 (most important), influencing the final aggregated score.
  - The total number of weight values provided in `WeightedRanker` should equal the number of `AnnSearchRequest` instances you have created.

- Use Reciprocal Rank Fusion (RFF)

  ```python
  # Alternatively, use RRFRanker for reciprocal rank fusion reranking
  from pymilvus import RRFRanker

  rerank = RRFRanker()
  ```

## Step 3: Perform a Hybrid Search

With the `AnnSearchRequest` instances and reranking strategy set, use the `hybrid_search()` method to perform the multi-vector search.

```python
# Before conducting multi-vector search, load the collection into memory.
collection.load()

res = collection.hybrid_search(
    reqs, # List of AnnSearchRequests created in step 1
    rerank, # Reranking strategy specified in step 2
    limit=2 # Number of final search results to return
)

print(res)
```

Parameters:

- `reqs` (_list_)

  A list of search requests, where each request is an `ANNSearchRequest` object. Each request can correspond to a different vector field and a different set of search parameters.

- `rerank` (_object_)

  The reranking strategy to use for hybrid search. Possible values: `WeightedRanker(value1, value2, ..., valueN)` and `RRFRanker()`.

  For more information about reranking strategies, refer to [Reranking](reranking.md).

- `limit` (_int_)

  The maximum number of final results to return in the hybrid search.

The output is similar to the following:

```python
["['id: 844, distance: 0.006047376897186041, entity: {}', 'id: 876, distance: 0.006422005593776703, entity: {}']"]
```

## Limits

- Typically, each collection has a default allowance of up to 4 vector fields. However, you have the option to adjust the `proxy.maxVectorFieldNum` configuration to expand the maximum number of vector fields in a collection, with a maximum limit of 10 vector fields per collection. See [Proxy-related Configurations](https://milvus.io/docs/configure_proxy.md#Proxy-related-Configurations) for more.

- Partially indexed or loaded vector fields in a collection will result in an error.

- Currently, each `AnnSearchRequest` in a hybrid search can carry one query vector only.

## FAQ

- **In which scenario is multi-vector search recommended?**

  Multi-vector search is ideal for complex situations demanding high accuracy, especially when an entity can be represented by multiple, diverse vectors. This applies to cases where the same data, such as a sentence, is processed through different embedding models or when multimodal information (like images, fingerprints, and voiceprints of an individual) is converted into various vector formats. By assigning weights to these vectors, their combined influence can significantly enrich recall and improve the effectiveness of search results.

- **How does a weighted ranker normalize distances between different vector fields?**

  A weighted ranker normalizes the distances between vector fields using assigned weights to each field. It calculates the importance of each vector field according to its weight, prioritizing those with higher weights. It's advised to use the same metric type across ANN search requests to ensure consistency. This method ensures that vectors deemed more significant have a greater influence on the overall ranking.

- **Is it possible to use alternative rankers like Cohere Ranker or BGE Ranker?**

  Currently, only the provided rankers are supported. Plans to include additional rankers are underway for future updates.

- **Is it possible to conduct multiple hybrid search operations at the same time?**

  Yes, simultaneous execution of multiple hybrid search operations is supported.

- **Can I use the same vector field in multiple AnnSearchRequest objects to perform hybrid searches?**

  Technically, it is possible to use the same vector field in multiple AnnSearchRequest objects for hybrid searches. It is not necessary to have multiple vector fields for a hybrid search.
