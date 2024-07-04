


# 时间戳

本主题介绍了时间戳的概念，并介绍了 Milvus 向量数据库中的四个主要与时间戳相关的参数。

## 概述

Milvus 是一个可以搜索和查询从非结构化数据转换而来的向量的向量数据库。在进行数据操作语言（DML）操作（包括 [数据插入和删除](/reference/architecture/data_processing.md)）时，Milvus 会为参与操作的实体分配时间戳。因此，Milvus 中的所有实体都具有时间戳属性。同一 DML 操作中的实体批次共享相同的时间戳值。

## 时间戳参数

在 Milvus 中进行向量相似性搜索或查询时，涉及几个与时间戳相关的参数。

- `Guarantee_timestamp`

- `Service_timestamp`

- `Graceful_time`

- `Travel_timestamp`

### `Guarantee_timestamp`

`Guarantee_timestamp` 是一种时间戳类型，用于确保在进行向量相似性搜索或查询时，`Guarantee_timestamp` 之前的所有 DML 操作的数据更新都可见。例如，如果在下午 3 点插入了一批数据，下午 5 点又插入了一批数据，并且在向量相似性搜索期间将 `Guarantee_timestamp` 的值设置为下午 6 点。这意味着应该将下午 3 点和下午 5 点插入的两批数据包括在搜索中。

如果没有配置 `Guarantee_timestamp`，Milvus 会自动采用搜索请求的时刻。因此，搜索是在所有数据更新的数据视图上进行的，这些数据更新是通过 DML 操作进行的。

为了避免你理解 Milvus 内部的 [TSO](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md) 的麻烦，作为用户，你不必直接配置 `Guarantee_timestamp` 参数。你只需要选择 [一致性级别](/reference/consistency.md)，Milvus 会自动处理 `Guarantee_timestamp` 参数。每个一致性级别对应于一定的 `Guarantee_timestamp` 值。

![Guarantee_Timestamp](/assets/Guarantee_Timestamp.png "保证时间戳的示意图")。

#### 示例

如上图所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:00`（为简单起见，此示例中的时间戳由物理时间表示）。当你进行搜索或查询时，会搜索或查询 `2021-08-26T18:15:00` 之前的所有数据。

### `Service_timestamp`

`Service_timestamp` 是由 Milvus 中的查询节点自动生成和管理的一种时间戳类型。它用于指示查询节点执行的 DML 操作。

查询节点管理的数据可以分为两种类型：

- 历史数据（也称为批量数据）

- 增量数据（也称为流数据）。

在 Milvus 中，在执行搜索或查询请求之前，你需要加载数据。因此，在进行搜索或查询请求之前，查询节点会将集合中的批量数据加载到内存中。然而，流数据是在 Milvus 中实时插入或删除的，这要求查询节点保持 DML 操作和搜索或查询请求的时间线。因此，查询节点使用 `Service_timestamp` 来保持这样的时间线。`Service_timestamp` 可以看作是在查询节点保证所有 DML 操作执行完成的时间点。

当有搜索或查询请求到来时，查询节点会比较 `Service_timestamp` 和 `Guarantee_timestamp` 的值。主要有两种情况。

![Service_Timestamp](/assets/Service_Timestamp.png "比较保证时间戳和服务时间戳的值")。

#### 情况 1：`Service_timestamp` >= `Guarantee_timestamp`

如图 1 所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:00`。当 `Service_timestamp` 的值增长到 `2021-08-26T18:15:01` 时，意味着查询节点已执行和完成该时间点之前的所有 DML 操作，包括 `Guarantee_timestamp` 指示的时间之前的所有 DML 操作。因此，可以立即执行搜索或查询请求。

#### 情况 2：`Service_timestamp` < `Guarantee_timestamp`

如图 2 所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:00`，当前的 `Service_timestamp` 值只有 `2021-08-26T18:14:55`。这意味着只有 `2021-08-26T18:14:55` 之前的 DML 操作已执行和完成，但 `Guarantee_timestamp` 之后但是 `Service_timestamp` 之前的部分 DML 操作尚未完成。如果此时执行搜索或查询，部分需要的数据尚不可见和不可用，严重影响搜索或查询结果的准确性。因此，查询节点需要推迟搜索或查询请求，直到 `guarantee_timestamp` 之前的 DML 请求完成（即 `Service_timestamp` >= `Guarantee_timestamp` 时）。

### `Graceful_time`

从技术上讲，`Graceful_time` 不是一个时间戳，而是一个时间段（例如 100 毫秒）。但是，值得一提的是，`Graceful_time` 与 `Guarantee_timestamp` 和 `Service_timestamp` 密切相关。`Graceful_time` 是 Milvus 配置文件中的一个可配置参数。它用于指示在某些数据变为可见之前可以容忍的时间段。简而言之，在 `Graceful_time` 期间未完成的 DML 操作可以被容忍。

当有搜索或查询请求到来时，有两种情况。

![Graceful_Time](/assets/Graceful_Time.png "比较服务时间戳、优雅时间和保证时间戳的值")。

#### 情况 1：`Service_timestamp` + `Graceful_time` >= `Guarantee_timestamp`

如图 1 所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:01`，`Graceful_time` 的值为 `2s`。`Service_timestamp` 的值增长到 `2021-08-26T18:15:00`。尽管 `Service_timestamp` 的值仍然小于 `Guarantee_timestamp` 的值，并且在 `2021-08-26T18:15:01` 之前并没有执行完成的 DML 操作，但由于 `Graceful_time` 的值指示了可以容忍 2 秒钟的数据不可见性，因此可以立即执行即将到来的搜索或查询请求。

#### 情况 2：`Service_timestamp` + `Graceful_time` < `Guarantee_timestamp`

如图 2 所示，`Guarantee_timestamp` 的值设置为 `2021-08-26T18:15:01`，`Graceful_time` 的值为 `2s`。当前的 `Service_timestamp` 值只有 `2021-08-26T18:14:54`。这意味着预期的 DML 操作尚未完成，即使给予了 2 秒钟的优雅时间，数据不可见性仍然是不可容忍的。因此，查询节点需要推迟搜索或查询请求，直到某些 DML 请求完成（即 `Service_timestamp` + `Graceful_time` >= `Guarantee_timestamp` 时）。

## 下一步操作





- 学习如何在 Milvus 中使用保证时间戳来实现可调整的一致性（consistency.md）


