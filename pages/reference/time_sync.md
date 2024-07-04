


# 时间同步

本文介绍了 Milvus 中的时间同步机制。

## 概述

Milvus 中的事件可以一般分为两类：

- 数据定义语言(DDL)事件：创建/删除集合，创建/删除分区等。

- 数据操作语言(DML)事件：插入，搜索等。

无论是 DDL 事件还是 DML 事件，任何事件都会被标记上一个时间戳，以指示事件发生的时间。

假设有两个用户按照下表所示的时间顺序在 Milvus 中发起一系列的 DML 和 DDL 事件。

| 时间戳 |                  用户 1                       |                 用户 2               |
|:---------:|:----------------------------------------:|:--------------------------------------:|
|     t0    |    创建了一个名为 `C0` 的集合                |                    /                   |
|     t2    |                     /                    | 在集合 `C0` 上进行了搜索                   |
|     t5    | 将数据 `A1` 插入到集合 `C0` 中               |                    /                   |
|     t7    |                     /                    | 在集合 `C0` 上进行了搜索                   |
|    t10    | 将数据 `A2` 插入到集合 `C0` 中               |                    /                   |
|    t12    |                     /                    | 在集合 `C0` 上进行了搜索                   |
|    t15    |  从集合 `C0` 中删除了数据 `A1`               |                    /                   |
|    t17    |                     /                    | 在集合 `C0` 上进行了搜索                   |

理想情况下，用户 2 应该能够看到：

- 在 `t2` 时刻，集合 `C0` 为空。

- 在 `t7` 时刻，数据 `A1` 可见。

- 在 `t12` 时刻，既有数据 `A1` 又有 `A2` 可见。

- 在 `t17` 时刻，只有数据 `A2` 可见（因为数据 `A1` 在这个时间点之前已被从集合中删除）。

当只有一个单节点时，这种理想情况可以很容易实现。但是，Milvus 是一个分布式向量数据库，为了确保不同节点上的所有 DML 和 DDL 操作保持有序，Milvus 需要解决以下两个问题：

1. 如果用户 1 和用户 2 在不同的节点上，它们之间的时间时钟可能不同。例如，如果用户 2 落后用户 1 24 小时，那么用户 2 在第二天以前无法看到用户 1 的所有操作。

2. 可能存在网络延迟。如果用户 2 在 `t17` 时刻在集合 `C0` 上进行搜索，Milvus 应该能够保证在 `t17` 之前的所有操作都已成功处理和完成。如果由于网络延迟导致在 `t15` 时刻的删除操作被延迟，那么当在 `t17` 时刻进行搜索时，用户 2 仍然有可能看到本应该被删除的数据 `A1`。

因此，Milvus 采用了一个时间同步系统（timetick）来解决这些问题。

## 时间戳预言机 (TSO)

为了解决前面提到的第一个问题，Milvus（与其他分布式系统一样）提供了一个时间戳预言机(TSO)服务。这意味着 Milvus 中的所有事件都必须由 TSO 分配一个时间戳，而不是由本地时钟分配。

TSO 服务由 Milvus 中的根协调器提供。客户端可以在单个时间戳分配请求中分配一个或多个时间戳。

TSO 时间戳是一种 `uint64` 类型的值，它由物理部分和逻辑部分组成。下图展示了时间戳的格式。

![TSO_Timestamp](/assets/TSO_Timestamp.png "TSO timestamp.").

如图所示，开头的 46 位是物理部分，即以毫秒为单位的 UTC 时间。最后的 18 位是逻辑部分。

## 时间同步系统 (timetick)



This section uses the example of a data insertion operation to explain the time synchronization mechanism in Milvus.

当代理从 SDK 接收到数据插入请求时，它根据主键的哈希值将插入消息分成不同的消息流（`MsgStream`）。

每个插入消息（`InsertMsg`）在发送到 `MsgStream` 之前被分配一个时间戳。

<div class="alert note">
  <code> MsgStream </code> 是消息队列的封装，Milvus 2.0 默认使用 Pulsar。
</div>

![timesync_proxy_insert_msg](/assets/timesync_proxy_insert_msg.png "从多个代理插入数据到MsgStreams的示例。")

一个总体原则是在 `MsgStream` 中，来自同一个代理的 `InsertMsgs` 的时间戳必须是递增的。但是，对于来自不同代理的 `InsertMsgs` 没有这样的规定。

下图是 `MsgStream` 中 `InsertMsgs` 的示例。代码片段包含五个 `InsertMsgs`，其中三个来自 `Proxy1`，其余两个来自 `Proxy2`。

![msgstream](/assets/msgstream.png "具有五个InsertMsgs的MsgStream的示例。")

来自 `Proxy1` 的三个 `InsertMsgs` 的时间戳是递增的，`Proxy2` 的两个 `InsertMsgs` 也是如此。然而，`Proxy1` 和 `Proxy2` 的 `InsertMsgs` 之间没有特定的顺序。

一个可能的情况是，在从 `Proxy2` 读取时间戳为 `110` 的消息时，Milvus 发现来自 `Proxy1` 的时间戳为 `80` 的消息仍然存在于 `MsgStream` 中。因此，Milvus 引入了一个时间同步系统（timetick），以确保在从 `MsgStream` 中读取消息时，所有较小时间戳值的消息必须被消费。

![time_synchronization](/assets/time_synchronization.png "Milvus中的时间同步系统。")

如上图所示，

- 每个代理定期（默认为每 200 毫秒）将 `MsgStream` 中最新 `InsertMsg` 的最大时间戳值报告给根协调器。

- 根协调器确定该 `MsgStream` 上的最小时间戳值，不管 `InsertMsgs` 属于哪个代理。然后根协调器将该最小时间戳插入 `MsgStream`。此时间戳也称为 timetick。

- 当消费者组件读取根协调器插入的 timetick 时，它们会理解已经消费了所有较小时间戳值的插入消息。因此，相关请求可以安全地执行而不会中断顺序。

下图是具有插入 timetick 的 `Msgstream` 示例。

![timetick](/assets/timetick.png "具有插入timetick的Msgstream。")

`MsgStream` 根据时间标记批处理消息，以确保输出消息符合时间戳的要求。

## 下一步做什么



- 学习有关 [timestamp](/reference/timestamp.md) 的概念。
- 在 Milvus 中了解 [数据处理工作流程](/reference/architecture/data_processing.md)。

