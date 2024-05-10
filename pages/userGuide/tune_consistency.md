---
id: tune_consistency.md
related_key: tune consistency
title: Tune Consistency
summary: Learn how to tune consistency level in Milvus.
---

# 调整一致性

Milvus 在创建集合、执行向量查询和执行向量搜索（目前仅在 PyMilvus 上）时支持设置一致性级别。Milvus 支持四种一致性级别：`Strong`（强一致性）、`Eventual`（最终一致性）、`Bounded`（有界一致性）和 `Session`（会话一致性）。默认情况下，如果没有指定一致性级别，创建的集合将设置为 `Bounded`（有界一致性）。本主题描述了如何调整一致性。

## 配置参数

默认情况下，一致性级别设置为 `Bounded`，在这种级别下，当搜索或查询请求到达时，Milvus 会读取一个不太更新的数据视图（通常是几秒钟前的数据）。您可以通过在创建集合和执行搜索或查询时配置 `consistency_level` 参数来设置一致性级别。有关背后的机制，请参见[搜索请求中的保证时间戳](https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md)。

<table class="language-python">
        <thead>
        <tr>
            <th>参数</th>
            <th>描述</th>
            <th>选项</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><code>consistency_level</code></td>
            <td>要创建的集合的一致性级别。</td>
            <td>
                <ul>
                    <li><code>Strong</code></li>
                    <li><code>Bounded</code></li>
                    <li><code>Session</code></li>
                    <li><code>Eventually</code></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

#### 示例

以下示例将一致性级别设置为 `Strong`，这意味着 Milvus 将在搜索或查询请求到达的确切时间点读取最新更新的数据视图。在搜索或查询请求中设置的一致性级别将覆盖创建集合时设置的一致性级别。在搜索或查询期间没有指定一致性级别，Milvus 将采用集合的原始一致性级别。

- **创建集合**

```python
from pymilvus import Collection
collection = Collection(
    name=collection_name,
    schema=schema,
    using='default',
    shards_num=2,
    consistency_level="Strong"
    )
```

- **执行向量搜索**

```python
result = hello_milvus.search(
        vectors_to_search,
        "embeddings",
        search_params,
        limit=3,
        output_fields=["random"],
        # search will scan all entities inserted into Milvus.
        consistency_level="Strong",
        )
```

- **执行向量查询**

```python
res = collection.query(
  expr = "book_id in [2,4,6,8]",
  output_fields = ["book_id", "book_intro"],
  consistency_level="Strong"
)
```
