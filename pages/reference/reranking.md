


# Reranking

Milvus 使用 [hybrid_search()](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) API 实现多向量搜索功能，其中包括了高级的重新排序策略来细化来自多个 `AnnSearchRequest` 实例的搜索结果。本主题介绍了重新排序的过程，解释了它的重要性以及 Milvus 中不同重新排序策略的实现方式。

## 概述

多向量搜索中的重新排序是一个关键步骤，它将来自多个向量字段的结果进行整合，确保最终的输出结果是相关且准确排序的。目前，Milvus 提供了两种重新排序策略：

- `WeightedRanker`：根据每个向量字段的重要性分配权重；

- `RRFRanker`：采用倒数排序融合（RFF）方法。

下图展示了在 Milvus 中执行多向量搜索的过程，并突出了重新排序在此过程中的作用。

<img src="/assets/multi-vector-rerank.png" alt="reranking_process" width="300"/>

## 加权评分（WeightedRanker）

加权评分的重新排序策略为每个 `AnnSearchRequest` 的结果分配不同的权重，反映了每个单独向量字段与搜索的相关性的重要性或置信度。

当每个向量字段的相关性不同时，选择使用 `WeightedRanker` 策略。该方法允许你通过为它们分配较高的权重来强调某些向量字段，从而凸显它们的重要性。分配的权重会修改来自向量字段的每个结果的原始评分（距离或相似性）。例如，在多模态搜索中，文本描述可能被认为比图像的颜色分布更重要。

在 Milvus 中的加权评分算法接受一组与每个 `AnnSearchRequest` 结果相对应的权重作为输入，格式为 `WeightedRanker(value1, value2, ..., valueN)`。这些权重值表示与其他结果相比，该特定 `AnnSearchRequest` 的重要性或相关性。对于每个 `AnnSearchRequest` 的结果，将其原始评分（如距离或相似性）乘以相应的权重。这样会根据其分配的权重来增强或减小 `AnnSearchRequest` 结果的影响。然后，将评分聚合到所有 `AnnSearchRequest` 实例中，以生成最终的排序结果列表。具有较高权重值的 `AnnSearchRequest` 会对最终的评分产生更大的贡献，而具有较低权重值的 `AnnSearchRequest` 则会影响较小。

要使用此策略，请应用 `WeightedRanker` 实例，并通过传递多个数字参数来设置权重值。

```python
from pymilvus import WeightedRanker

# 使用 WeightedRanker 来结合指定权重的结果
rerank = WeightedRanker(0.8, 0.8, 0.7) 
```

请注意：

- 每个权重值的范围为 0（最不重要）到 1（最重要），它会影响最终聚合得分。

- 在 `WeightedRanker` 中提供的权重值的总数应与之前创建的 `AnnSearchRequest` 实例的数量相等。

## 倒数排序融合（RRFRanker）



RRF 是一种数据融合方法，它根据排名的倒数来组合排名列表。当没有明确的重要性先后顺序时，它是一种有效的平衡每个向量场影响的方式。通常在你希望平等考虑所有向量场或对每个字段的相对重要性存在不确定性时使用此策略。

`RRFRanker` 算法根据排名的倒数加上阻尼因子 `k` 为每个结果分配一个分数。排名 `i` 是结果在其 `AnnSearchRequest` 中的位置，从 0 开始计数。然后根据公式 `1 / (k + i + 1)` 计算出此分数，其中阻尼因子 `k` 有助于控制随着排名增加分数的降低速度。较大的 `k` 值意味着分数降低得更慢。然后将这些倒数排名分数聚合到所有 `AnnSearchRequest` 结果中，以产生最终的排名结果列表。

要使用此策略，请应用 `RRFRanker` 实例。

```python
from pymilvus import RRFRanker

# 默认的k值为60
ranker = RRFRanker()

# 或指定k值
ranker = RRFRanker(k=100)
```

RRF 允许在不指定显式权重的情况下平衡字段之间的影响。在最终的排名中，将优先考虑多个字段达成一致的前几个匹配项。

