

Attu搜索数据
===

本主题介绍了如何使用Attu搜索数据。

进行向量相似性搜索
------------------------

基于正常的向量相似性搜索，您可以执行带有时间旅行的搜索的混合搜索。

### 加载集合到内存

Milvus中的所有CRUD操作都在内存中执行。 在进行向量相似性搜索之前，请将集合加载到内存中。有关更多指令，请参见[加载集合](attu_collection.md#Load-a-collection) 。

[![查询数据](https://milvus.io/static/ae52361a190f9f5e7dcf60e2a8a3e241/1263b/insight_search1.png "Attu中的搜索页面。")](https://milvus.io/static/ae52361a190f9f5e7dcf60e2a8a3e241/bbbf7/insight_search1.png)

Attu中的搜索页面。

### 设置搜索参数

- 在**选择集合和向量字段**下拉列表中选择要搜索的集合和向量字段。

- 在**输入向量值**字段中，输入一个与所选字段具有相同维度的向量（或向量）作为要搜索的目标向量。

- 在**设置搜索参数**部分，指定要用于索引和其他搜索相关参数的具体参数。

[![Search Data](https://milvus.io/static/268d322b4f5c695c08eaa529a614bae6/1263b/insight_search2.png "Set search parameters.")](https://milvus.io/static/268d322b4f5c695c08eaa529a614bae6/bbbf7/insight_search2.png)

Set search parameters.

### 高级筛选和混合搜索（可选）

点击**高级筛选**，弹出**高级筛选**对话框。您可以使用**AND**或**OR**运算符将多个条件组合成复合条件。随着条件的任何更改，筛选表达式会自动更新。有关更多信息，请参见[布尔表达式规则](boolean.md)。

[![Search Data](https://milvus.io/static/c782997e82e554ae55f51668b2aad936/1263b/insight_search3.png "Advanced filter.")](https://milvus.io/static/c782997e82e554ae55f51668b2aad936/bbbf7/insight_search3.png)

Advanced filter.

### 搜索时间旅行（可选）

Milvus维护所有数据插入和删除操作的时间线。它允许用户在搜索中指定一个时间戳，以检索指定时间点的数据视图。

- 点击**时间旅行**，在弹出的对话框中选择一个时间点。

[![Search Data](https://milvus.io/static/4519079c37cd723055f211ecc798b592/1263b/insight_search4.png "Time Travel.")](https://milvus.io/static/4519079c37cd723055f211ecc798b592/bbbf7/insight_search4.png)

Time Travel.

- 在**TopK**下拉列表中指定要返回的搜索结果数量。

- 点击**搜索**以检索最近的搜索结果，这些结果指示最相似的向量。

[![Search Data](https://milvus.io/static/e2afd5c60fe18c2f27ad5856f1e1ae52/1263b/insight_search5.png "Search results.")](https://milvus.io/static/e2afd5c60fe18c2f27ad5856f1e1ae52/bbbf7/insight_search5.png)

Search results.

[![Search Data](https://milvus.io/static/a73e8ee0deab2dd33b4865ed1c630f9b/1263b/insight_search6.png "No search results.")](https://milvus.io/static/a73e8ee0deab2dd33b4865ed1c630f9b/bbbf7/insight_search6.png)

No search results.

