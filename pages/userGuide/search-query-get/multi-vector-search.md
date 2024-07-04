
                
# 多向量搜索

自 Milvus 2.4 版本以来，我们引入了多向量支持和混合搜索框架，这意味着用户可以将多个向量字段（最多 10 个）引入单个集合中。不同的向量字段可以表示不同的方面、不同的嵌入模型甚至是表征同一实体的不同的数据形态，这极大地扩展了信息的丰富性。这个特性在综合搜索场景中特别有用，比如基于各种属性（如图片、声音、指纹等）在向量库中识别最相似的人。

多向量搜索可以对多个向量字段执行搜索请求，并使用重新排序策略（如 Reciprocal Rank Fusion (RRF)和 Weighted Scoring）合并结果。要了解更多关于重新排序策略的信息，请参考 [Reranking](/reference/reranking.md)。

在本教程中，你将学习如何：

- 为不同的向量字段创建多个 `AnnSearchRequest` 实例来进行相似度搜索；

- 配置重新排序策略，从多个 `AnnSearchRequest` 实例中合并和重新排序搜索结果；

- 使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法执行多向量搜索。

<div class="alert note">

本页上的代码片段使用 [PyMilvus ORM 模块](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md) 与 Milvus 进行交互。新的 [MilvusClient SDK](https://milvus.io/api-reference/pymilvus/v2.4.x/About.md) 的代码片段即将推出。

</div>


# 准备工作

在开始多向量搜索之前，请确保你拥有一个具有多个向量字段的集合。

以下是创建一个名为 `test_collection` 的集合，并在其中插入随机实体的示例。

```python
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
import random

# 连接到Milvus
connections.connect(
    host="10.102.7.3", # 用你的Milvus服务器IP替换
    port="19530"
)

# 创建模式
fields = [
    FieldSchema(name="film_id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="filmVector", dtype=DataType.FLOAT_VECTOR, dim=5), # 用于电影向量的向量字段
    FieldSchema(name="posterVector", dtype=DataType.FLOAT_VECTOR, dim=5)] # 用于海报向量的向量字段

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

# 生成要插入的随机实体
entities = []

for _ in range(1000):
    # 为模式中的每个字段生成随机值
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

## 步骤 1：创建多个 AnnSearchRequest 实例



# A multi-vector search

使用 `hybrid_search()` API 可以一次性执行多个 ANN 搜索请求。每个 `AnnSearchRequest` 代表一个特定向量字段上的单个搜索请求。

以下示例创建了两个 `AnnSearchRequest` 实例，以在两个向量字段上执行单独的相似性搜索。

```python
from pymilvus import AnnSearchRequest

# 为filmVector创建ANN搜索请求1
query_filmVector = [[0.8896863042430693, 0.370613100114602, 0.23779315077113428, 0.38227915951132996, 0.5997064603128835]]

search_param_1 = {
    "data": query_filmVector,  # 查询向量
    "anns_field": "filmVector",  # 向量字段名
    "param": {
        "metric_type": "L2",  # 此参数值必须与集合模式中使用的参数值相同
        "params": {"nprobe": 10}
    },
    "limit": 2  # 此AnnSearchRequest返回的搜索结果数量
}
request_1 = AnnSearchRequest(**search_param_1)

# 为posterVector创建ANN搜索请求2
query_posterVector = [[0.02550758562349764, 0.006085637357292062, 0.5325251250159071, 0.7676432650114147, 0.5521074424751443]]
search_param_2 = {
    "data": query_posterVector,  # 查询向量
    "anns_field": "posterVector",  # 向量字段名
    "param": {
        "metric_type": "L2",  # 此参数值必须与集合模式中使用的参数值相同
        "params": {"nprobe": 10}
    },
    "limit": 2  # 此AnnSearchRequest返回的搜索结果数量
}
request_2 = AnnSearchRequest(**search_param_2)

# 将这两个请求作为一个列表存储在`reqs`中
reqs = [request_1, request_2]
```

参数：

- `AnnSearchRequest`（_object_）

    表示 ANN 搜索请求的类。每个混合搜索可以同时包含 1 到 1024 个 `ANNSearchRequest` 对象。

- `data`（_list_）

    要在单个 `AnnSearchRequest` 中搜索的查询向量。目前，该参数只接受包含单个查询向量的列表，例如 `[[0.5791814851218929, 0.5792985702614121, 0.8480776460143558, 0.16098005945243, 0.2842979317256803]]`。将来，该参数将扩展为接受多个查询向量。

- `anns_field`（_string_）

    在单个 `AnnSearchRequest` 中使用的向量字段的名称。

- `param`（_dict_）

    单个 `AnnSearchRequest` 的搜索参数字典。这些搜索参数与单向量搜索的参数完全相同。有关更多信息，请参见 [搜索参数](https://milvus.io/docs/single-vector-search.md#Search-parameters)。

- `limit`（_int_）

    单个 `ANNSearchRequest` 中包含的最大搜索结果数。

    此参数仅影响单个 `ANNSearchRequest` 内返回的搜索结果数量，并不决定 `hybrid_search` 调用返回的最终结果。在混合搜索中，最终结果是通过合并和重新排名来自多个 `ANNSearchRequest` 实例的结果来确定的。

## 步骤 2：配置重新排名策略

在创建 `AnnSearchRequest` 实例之后，配置重新排名策略以合并和重新排名结果。目前有两种选项：`WeightedRanker` 和 `RRFRanker`。有关重新排序策略的更多信息，请参见 [重新排序](/reference/reranking.md)。

- 使用加权评分

    使用 `WeightedRanker` 为每个向量字段搜索结果分配权重，以对结果进行重要性排序。如果你优先考虑某些向量字段，可以通过 `WeightedRanker(value1, value2, ..., valueN)` 在组合搜索结果中反映出来。

    ```python
    from pymilvus import WeightedRanker
    # 使用WeightedRanker结合指定的权重来组合结果
    # 将0.8的权重分配给文本搜索，将0.2的权重分配给图像搜索
    rerank = WeightedRanker(0.8, 0.2)  
    ```

    使用 `WeightedRanker` 时，请注意：

  - 每个权重值的范围是从 0（最不重要）到 1（最重要），会影响最终的聚合评分。
  - 在 `WeightedRanker` 中提供的权重值的总数应该等于你创建的 `AnnSearchRequest` 实例的数量。

- 使用倒数排名融合（RFF）

    ```python
    # 或者，使用RRFRanker进行倒数排名融合重新排序
    from pymilvus import RRFRanker
    
    rerank = RRFRanker()
    ```

## 步骤 3：执行混合搜索



## 使用 `hybrid_search()` 方法执行多向量搜索

通过设置 `AnnSearchRequest` 实例和重新排序策略，可以使用 `hybrid_search()` 方法执行多向量搜索。

```python
# 在进行多向量搜索之前，将集合加载到内存中。
collection.load()

res = collection.hybrid_search(
    reqs, # 在步骤1中创建的AnnSearchRequest对象的列表
    rerank, # 在步骤2中指定的重排序策略
    limit=2 # 返回的最终搜索结果数量
)

print(res)
```

参数：

- `reqs`（_list_）

  一个包含搜索请求的列表，每个请求都是一个 `ANNSearchRequest` 对象。每个请求可以对应不同的向量字段和不同的搜索参数集。

- `rerank`（_object_）

  用于混合搜索的重新排序策略。可能的值：`WeightedRanker(value1, value2, ..., valueN)` 和 `RRFRanker()`。

    有关重新排序策略的更多信息，请参见 [Reranking](/reference/reranking.md)。

- `limit`（_int_）

    混合搜索返回的最终结果的最大数量。

输出类似于以下内容：

```python
["['id: 844, distance: 0.006047376897186041, entity: {}', 'id: 876, distance: 0.006422005593776703, entity: {}']"]
```

## 限制

- 通常，每个集合默认允许多达 4 个向量字段。但是，你可以调整 `proxy.maxVectorFieldNum` 配置以扩展集合中的最大向量字段数量，最大限制为每个集合 10 个向量字段。有关更多信息，请参见 [代理相关配置](https://milvus.io/docs/configure_proxy.md#Proxy-related-Configurations)。

- 部分索引或加载的向量字段将导致错误。

- 目前，在混合搜索中，每个 `AnnSearchRequest` 只能携带一个查询向量。

## 常见问题解答



- **在哪种情况下建议使用多向量搜索？**

    多向量搜索在需要高准确性的复杂情况下是理想的选择，特别是当一个实体可以由多个不同的向量表示时。这适用于同样的数据（比如句子）通过不同的嵌入模型进行处理，或者将多模态信息（如个体的图像、指纹和语音）转换为不同的向量格式的情况。通过为这些向量分配权重，它们的组合影响可以显著丰富召回并改善搜索结果的有效性。

- **加权排序器如何对不同向量字段之间的距离进行归一化？**

    加权排序器使用分配给每个字段的权重对向量字段之间的距离进行归一化。它根据权重计算每个向量字段的重要性，优先考虑那些权重较高的字段。建议在 ANN 搜索请求中使用相同的度量类型以确保一致性。这种方法确保了被认为更重要的向量对整体排序产生更大的影响。

- **是否可以使用 Cohere Ranker 或 BGE Ranker 等替代排序器？**

    目前，仅支持提供的排序器。计划在未来的更新中加入其他排序器。

- **是否可以同时进行多个混合搜索操作？**

    是的，支持同时执行多个混合搜索操作。

- **我可以在多个 AnnSearchRequest 对象中使用相同的向量字段进行混合搜索吗？**

    在技术上，可以在多个 AnnSearchRequest 对象中使用相同的向量字段进行混合搜索。对于混合搜索而言，不需要使用多个向量字段。
