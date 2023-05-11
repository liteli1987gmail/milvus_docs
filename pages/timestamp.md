时间戳
===

本主题解释了时间戳的概念，并介绍了Milvus向量数据库中的四个主要与时间戳相关的参数。

概述
--

Milvus是一种向量数据库，可以搜索和查询从非结构化数据转换而来的向量。在进行数据操作语言（DML）操作时，包括[数据插入和删除](https://milvus.io/docs/v2.1.x/data_processing.md)，Milvus会为参与操作的实体分配时间戳。因此，Milvus中的所有实体都具有时间戳属性。而同一DML操作中的实体批次共享相同的时间戳值。

时间戳参数
-----

在Milvus中进行向量相似度搜索或查询时，涉及到多个与时间戳相关的参数。

* `Guarantee_timestamp`

* `Service_timestamp`

* `Graceful_time`

* `Travel_timestamp`

### `Guarantee_timestamp`

`Guarantee_timestamp`是一种用于保证在进行向量相似度搜索或查询时，所有DML操作之前的数据更新都能被检索到的时间戳类型。例如，如果您在下午3点插入了一批数据，下午5点插入了另一批数据，并且在进行向量相似度搜索时将`Guarantee_timestamp`的值设置为晚上6点。这意味着在下午3点和5点分别插入的两批数据都应该参与搜索。

如果没有配置`Guarantee_timestamp`，Milvus会自动采用搜索请求发出时的时间点。因此，搜索是在执行搜索之前进行所有数据更新的DML操作的数据视图上进行的。

为了避免您理解Milvus内部的[TSO](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md)的麻烦，作为用户，您不必直接配置`Guarantee_timestamp`参数。您只需要选择[一致性级别](https://milvus.io/docs/v2.1.x/consistency.md)，Milvus会自动为您处理`Guarantee_timestamp`参数。每个一致性级别对应一个特定的`Guarantee_timestamp`值。

[![Guarantee_Timestamp](https://milvus.io/static/fcad5e70dbff13eab78797268c8ed86c/1263b/Guarantee_Timestamp.png "An illustration of guarantee timestamp.")](https://milvus.io/static/fcad5e70dbff13eab78797268c8ed86c/af7a3/Guarantee_Timestamp.png)

An illustration of guarantee timestamp.
.

#### 示例

如上图所示，`Guarantee_timestamp` 的值被设置为 `2021-08-26T18:15:00`（为了简化，本示例中的时间戳是用实际时间表示的）。当您进行搜索或查询时，将搜索或查询 2021-08-26T18:15:00 之前的所有数据。

### `Service_timestamp`

`Service_timestamp` 是 Milvus 中由查询节点自动生成和管理的一种时间戳。它用于指示查询节点执行的 DML 操作。

查询节点管理的数据可以分为两类：

* 历史数据（也称为批量数据）

* 增量数据（也称为流式数据）

在 Milvus 中，您需要在进行搜索或查询之前加载数据。因此，在发出搜索或查询请求之前，查询节点会加载集合中的批量数据。然而，流式数据是动态插入或删除到 Milvus 中的，这需要查询节点保留 DML 操作和搜索或查询请求的时间线。因此，查询节点使用 `Service_timestamp` 来保持这样的时间线。`Service_timestamp` 可以被视为某些数据可见的时间点，因为查询节点可以确保在 `Service_timestamp` 之前完成所有的 DML 操作。

当有搜索或查询请求时，查询节点会比较`Service_timestamp`和`Guarantee_timestamp`的值。主要有两种情况。

[![Service_Timestamp](https://milvus.io/static/557b436a5c2eefe6c2b0c031ca72517f/1263b/Service_Timestamp.png "Comparing the values of guarantee timestamp and service timestamp.")](https://milvus.io/static/557b436a5c2eefe6c2b0c031ca72517f/56508/Service_Timestamp.png)

Comparing the values of guarantee timestamp and service timestamp.
.

#### 情况1：`Service_timestamp` >= `Guarantee_timestamp`

如图1所示，`Guarantee_timestamp`的值设置为`2021-08-26T18:15:00`。当`Service_timestamp`的值增长到`2021-08-26T18:15:01`时，这意味着查询节点已经执行并完成了此时间点之前的所有DML操作，包括`Guarantee_timestamp`所指示的时间之前的所有DML操作。因此，搜索或查询请求可以立即执行。

#### 情景2：`Service_timestamp` < `Guarantee_timestamp`

如图2所示，`Guarantee_timestamp`的值被设置为`2021-08-26T18:15:00`，而当前`Service_timestamp`的值仅为`2021-08-26T18:14:55`。这意味着只有在`2021-08-26T18:14:55`之前执行并完成的DML操作，留下了在此时间点之后但在`Guarantee_timestamp`之前的部分未完成的DML操作。如果在这个时间点执行搜索或查询，那么一些所需的数据是不可见和不可用的，严重影响搜索或查询结果的准确性。因此，查询节点需要推迟搜索或查询请求，直到`Guarantee_timestamp`之前的DML操作完成（即`Service_timestamp` >= `Guarantee_timestamp`）。

### `Graceful_time`

技术上讲，`Graceful_time` 不是一个时间戳，而是一个时间段（例如 100 毫秒）。但是，`Graceful_time` 值得一提，因为它与 `Guarantee_timestamp` 和 `Service_timestamp` 有着密切的关系。 `Graceful_time` 是 Milvus 配置文件中的可配置参数，用于指示可以容忍某些数据变得可见之前的时间段。简言之，在 `Graceful_time` 中未完成的 DML 操作是可以被容忍的。

当有一个搜索或查询请求到来时，有两种情况。

[![Graceful_Time](https://milvus.io/static/a7b2664811088e308a5b1fd6493f86c7/1263b/Graceful_Time.png "Comparing the values of service timestamp, graceful time, and guarantee timestamp.")](https://milvus.io/static/a7b2664811088e308a5b1fd6493f86c7/cc39a/Graceful_Time.png)

Comparing the values of service timestamp, graceful time, and guarantee timestamp.
.

#### 场景1： `Service_timestamp` + `Graceful_time` >= `Guarantee_timestamp`

如图1所示，`Guarantee_timestamp`的值设置为`2021-08-26T18:15:01`，`Graceful_time`的值为`2s`。`Service_timestamp`的值增长到`2021-08-26T18:15:00`。虽然`Service_timestamp`的值仍然小于`Guarantee_timestamp`的值，并且在`2021-08-26T18:15:01`之前的所有DML操作尚未完成，但是数据的不可见性可以容忍2秒钟，如`Graceful_time`中所示。因此，传入的搜索或查询请求可以立即执行。

#### 场景2：`Service_timestamp` + `Graceful_time` < `Guarantee_timestamp`

如图2所示，`保证时间戳`的值被设置为`2021-08-26T18:15:01`，`优雅时间`被设置为`2s`。当前`服务时间戳`的值只有`2021-08-26T18:14:54`。这意味着期望的DML操作尚未完成，即使给予2秒的优雅时间，数据不可见性仍然无法容忍。因此，查询节点需要推迟搜索或查询请求，直到某些DML请求完成（即当`服务时间戳` + `优雅时间` >= `保证时间戳`时）。

### `Travel_timestamp`

`Travel_timestamp` 是一种可配置的时间戳类型，用于指示搜索或查询需要在某个时间点之前在数据视图上进行。 `Travel_timestamp` 可以看作是数据快照。而使用[时光穿梭搜索](timetravel.md)意味着在由`Travel_timestamp`的值指示的数据快照上进行搜索或查询。在`Travel_timestamp`之后进行的所有DML操作都不涉及搜索或查询。

当有查询请求时，假设`Service_timestamp` > `Guarantee_timestamp`。

[![Travel_Timestamp](https://milvus.io/static/590d05cf1ed4ec724148cb55f893de4d/1263b/Travel_Timestamp.png "An illustration of time travel timestamp.")](https://milvus.io/static/590d05cf1ed4ec724148cb55f893de4d/56508/Travel_Timestamp.png)

An illustration of time travel timestamp.
.

`Guarantee_timestamp`的值与时光旅行功能无关。

如上图所示，`Guarantee_timestamp`的值设置为`2021-08-26T18:14:55`。而`Service_timestamp`增长到`2021-08-26T18:15:01`，意味着在此时间点之后执行和完成更多的DML操作。然而，无论`Travel_timestamp`的值是`2021-08-26T18:14:56`还是`2021-08-26T18:14:54`，只有在`Travel_timestamp`之前的数据才会被搜索或查询。

接下来是什么
------

* 了解如何使用[保证时间戳在Milvus中实现可调节的一致性](consistency.md)

* 了解如何使用[时间旅行进行搜索](timetravel.md)
