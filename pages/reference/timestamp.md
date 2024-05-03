---
id: timestamp.md
title: Timestamp in Milvus
summary: Learn about the concept of timestamp and the four main timestamp-related parameters in the Milvus vector database.
---

# 时间戳

本文解释了时间戳的概念，并介绍了 Milvus 向量数据库中的四个主要与时间戳相关的参数。

## 概述

Milvus 是一个向量数据库，可以搜索和查询从非结构化数据转换而来的向量。在进行数据操作语言（DML）操作时，包括[数据插入和删除](https://milvus.io/docs/v2.1.x/data_processing.md)，Milvus 会为参与操作的实体分配时间戳。因此，Milvus 中的所有实体都有一个时间戳属性。同一 DML 操作中的实体批次共享相同的时间戳值。

## 时间戳参数

在 Milvus 中进行向量相似性搜索或查询时，会涉及几个与时间戳相关的参数。

- `Guarantee_timestamp`

- `Service_timestamp`

- `Graceful_time`

- `Travel_timestamp`

### `Guarantee_timestamp`

`Guarantee_timestamp` 是一种时间戳，用于确保在进行向量相似性搜索或查询时，所有在 `Guarantee_timestamp` 之前由 DML 操作更新的数据都是可见的。例如，如果您在下午 3 点插入了一批数据，又在下午 5 点插入了另一批数据，而在向量相似性搜索中设置了 `Guarantee_timestamp` 为下午 6 点。这意味着分别在下午 3 点和 5 点插入的两批数据应该被包含在搜索中。

如果未配置 `Guarantee_timestamp`，Milvus 会自动取搜索请求发起时的时间点。因此，搜索是在包含 DML 操作所有数据更新之前的数据视图上进行的。

为了免去您理解 Milvus 内部的 [TSO](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md) 的麻烦，作为用户，您不需要直接配置 `Guarantee_timestamp` 参数。您只需要选择 [一致性级别](https://milvus.io/docs/v2.1.x/consistency.md)，Milvus 会自动为您处理 `Guarantee_timestamp` 参数。每个一致性级别对应一个特定的 `Guarantee_timestamp` 值。

![Guarantee_Timestamp](/Guarantee_Timestamp.png "保证时间戳的示意图。")。

#### 示例

如上图所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:00`（为简化起见，本示例中的时间戳以物理时间表示）。当您进行搜索或查询时，所有在 2021-08-26T18:15:00 之前的数据都会被搜索或查询。

### `Service_timestamp`

`Service_timestamp` 是一种由 Milvus 中的查询节点自动生成和管理的时间戳。它用于指示查询节点执行了哪些 DML 操作。

查询节点管理的数据可以分为两种类型：

- 历史数据（或称为批量数据）

- 增量数据（或称为流数据）。

在 Milvus 中，您需要在进行搜索或查询之前加载数据。因此，在集合中的批量数据在搜索或查询请求发出之前由查询节点加载。然而，流数据是实时插入或从 Milvus 中删除的，这要求查询节点保持 DML 操作和搜索或查询请求的时间线。因此，查询节点使用 `Service_timestamp` 来保持这样的时间线。`Service_timestamp` 可以被视为某些数据可见的时间点，因为查询节点可以确保在 `Service_timestamp` 之前的所有 DML 操作都已完成。

当有传入的搜索或查询请求时，查询节点会比较 `Service_timestamp` 和 `Guarantee_timestamp` 的值。主要有两种情况。

![Service_Timestamp](/Service_Timestamp.png "比较保证时间戳和服务时间戳的值。")。

#### 场景 1：`Service_timestamp` >= `Guarantee_timestamp`

如图 1 所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:00`。当 `Service_timestamp` 的值增长到 `2021-08-26T18:15:01` 时，这意味着所有在这个时间点之前的 DML 操作都已由查询节点执行并完成，包括那些在 `Guarantee_timestamp` 指示的时间之前的操作。因此，搜索或查询请求可以立即执行。

#### 场景 2：`Service_timestamp` < `Guarantee_timestamp`

As shown in the figure 2 , the value of `Guarantee_timestamp` is set as `2021-08-26T18:15:01`, and `Graceful_time` as `2s`. The current value of `Service_timestamp` is only `2021-08-26T18:14:54`. This means that the expected DML operations are not completed yet and even given the 2 second of graceful time, data invisibility is still intolerable. Therefore, the query node needs to put off the search or query request until certain DML requests are completed (i.e. when `Service_timestamp` + `Graceful_time` >= `Guarantee_timestamp`).

## What's next

- Learn how [guarantee timestamp enables tunable consistency in Milvus](consistency.md)
