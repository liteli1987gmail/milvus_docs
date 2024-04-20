# 重新排名

Milvus 通过 [hybrid_search()](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) API 实现了多向量搜索功能，结合了复杂的重新排名策略，以优化来自多个 `AnnSearchRequest` 实例的搜索结果。本主题涵盖了重新排名过程，解释了其重要性以及在 Milvus 中实现不同重新排名策略的方法。

## 概述

在多向量搜索中，重新排名是一个关键步骤，它整合了来自几个向量字段的结果，确保最终输出的相关性和准确优先级。目前，Milvus 提供了两种重新排名策略：

- `WeightedRanker`：根据每个向量字段的重要性分配权重；

- `RRFRanker`：采用互惠排名融合（RFF）方法。

下图展示了在 Milvus 中执行多向量搜索的过程，并突出了重新排名在该过程中的作用。

<img src="/multi-vector-rerank.png" alt="reranking_process" width="300"/>

## 加权评分（WeightedRanker）

加权评分重新排名策略为每个 `AnnSearchRequest` 的结果分配不同的权重，反映了每个单独向量字段与搜索的相关性或信心。

当每个向量字段的相关性不同时，`WeightedRanker` 是首选策略。该方法允许您通过为它们分配更高的权重来强调某些向量字段。分配的权重修改了每个向量字段结果的原始分数（距离或相似度）。例如，在多模态搜索中，文本描述可能比图像中的颜色分布被认为更重要。

Milvus 中加权评分算法的输入是一组对应于每个 `AnnSearchRequest` 结果的权重，格式为 `WeightedRanker(value1, value2, ..., valueN)`。这些权重值代表了该特定 `AnnSearchRequest` 与其他请求相比的重要性或相关性。对于每个 `AnnSearchRequest` 结果，其原始分数（如距离或相似度）乘以相应的权重。这有助于根据分配的权重增强或减少 `AnnSearchRequest` 结果的影响。然后，所有 `AnnSearchRequest` 实例的分数被聚合以产生最终的排名结果列表。权重值较高的 `AnnSearchRequest` 将对最终分数贡献更多，而权重值较低的将影响较小。

要使用此策略，请应用一个 `WeightedRanker` 实例，并通过传入可变数量的数字参数来设置权重值。

```python
from pymilvus import WeightedRanker

# 使用 WeightedRanker 结合指定权重组合结果
rerank = WeightedRanker(0.8, 0.8, 0.7) 
```

请注意：

- 每个权重值的范围从 0（最不重要）到 1（最重要），影响最终聚合分数。

- 在 `WeightedRanker` 中提供的权重值总数应等于您之前创建的 `AnnSearchRequest` 实例的数量。

## 互惠排名融合（RRFRanker）

RRF 是一种基于它们排名的倒数的数据融合方法。这是一种平衡每个向量字段影响力的有效方式，特别是当没有明确的优先级时。当您想要平等考虑所有向量字段或对每个字段的相对重要性不确定时，通常使用此策略。

`RRFRanker` 算法根据其排名的倒数加上一个阻尼因子 `k` 为每个结果分配分数。排名 `i` 是结果在其 `AnnSearchRequest` 中的位置，从 0 开始。然后，这个分数被计算为 `1 / (k + i + 1)`，其中阻尼因子 `k` 有助于控制随着排名的增加分数下降的速度。较大的 `k` 值意味着分数下降得更慢。然后，这些互惠排名分数被聚合在所有 `AnnSearchRequest` 结果上，以产生最终的排名结果列表。

要使用此策略，请应用一个 `RRFRanker` 实例。

```python
from pymilvus import RRFRanker

# 默认 k 值为 60
ranker = RRFRanker()

# 或指定 k 值
ranker = RRFRanker(k=100)
```

RRF 允许在不指定显式权重的情况下平衡跨领域的影响。由多个字段同意的顶级匹配项将在最终排名中优先考虑。