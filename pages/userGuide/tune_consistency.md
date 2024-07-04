


# 调整一致性

Milvus 支持在创建集合、进行向量查询和进行向量搜索（目前仅在 PyMilvus 中支持）时设置一致性级别。Milvus 支持四个一致性级别：`Strong`、`Eventual`、`Bounded` 和 `Session`。默认情况下，未指定一致性级别的集合将被设置为 `Bounded` 一致性级别。本文介绍如何调整一致性级别。

## 配置参数

默认情况下，一致性级别被设置为 `Bounded`，在这种级别下，当进行搜索或查询请求时，Milvus 会读取一个更新较少的数据视图（通常是几秒钟之前的数据视图）。你可以通过在创建集合和进行搜索或查询时配置 `consistency_level` 参数来设置一致性级别。参见 [在搜索请求中保证时间戳](https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md) 以了解其背后的机制。

#### 示例

```markdown
By default, the consistency level is set as `Bounded`, under which Milvus reads a less updated data view (usually several seconds earlier) when a search or query request comes. You can set the consistency level by configuring the parameter `consistency_level` while creating a collection and conducting a search or query. See [Guarantee Timestamp in Search Requests](https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md) for the mechanism behind.
```



以下示例将一致性级别设置为“Strong”，这意味着当进行搜索或查询请求时，Milvus 将读取最新的数据视图。在搜索或查询请求中设置的一致性级别会覆盖创建集合时设置的级别。如果在搜索或查询过程中未指定一致性级别，则 Milvus 将采用集合的原始一致性级别。

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

- **进行向量搜索**

```python
result = hello_milvus.search(
        vectors_to_search,
        "embeddings",
        search_params,
        limit=3,
        output_fields=["random"],
        # 搜索将扫描插入Milvus的所有实体。
        consistency_level="Strong",
        )
```

- **进行向量查询**    

```python
res = collection.query(
  expr = "book_id in [2,4,6,8]", 
  output_fields = ["book_id", "book_intro"],
  consistency_level="Strong"
)
```

