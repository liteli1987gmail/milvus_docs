时间同步
====

本主题介绍了Milvus中的时间同步机制。

概述
--

Milvus 中的事件可以一般地分为两类：

* 数据定义语言（DDL）事件：创建/删除集合、创建/删除分区等。

* 数据操作语言（DML）事件：插入、搜索等。

任何事件，无论是 DDL 还是 DML 事件，都标记有一个时间戳，可以指示此事件发生的时间。

假设有两个用户按照以下表格中的时间顺序在Milvus中发起一系列的DML和DDL事件。

| Timestamp | User 1 | User 2 |
| --- | --- | --- |
| t0 | Created a collection named `C0`. | / |
| t2 | / | Conducted a search on collection `C0`. |
| t5 | Inserted data `A1` into collection `C0`. | / |
| t7 | / | Conducted a search on collection `C0`. |
| t10 | Inserted data `A2` into collection `C0`. | / |
| t12 | / | Conducted a search on collection `C0` |
| t15 | Deleted data `A1` from collection `C0`. | / |
| t17 | / | Conducted a search on collection `C0` |

理想情况下，用户2应该能够看到：

* `t2`时刻，一个空的集合`C0`。

* `t7`时刻，数据`A1`。

* `t12`时刻，两个数据`A1`和`A2`。

* `t17`时刻，只有数据`A2`（因为数据`A1`在这个时间点之前已经从集合中删除）。

当只有一个单一节点时，可以轻松实现这种理想情况。然而，Milvus是一个分布式向量数据库，为了确保不同节点中的所有DML和DDL操作的顺序保持一致，Milvus需要解决以下两个问题：

- 如果上述示例中的两个用户位于不同节点上，则它们的时间时钟不同。例如，如果用户2比用户1慢24小时，则用户1的所有操作在第二天之前对用户2不可见。

- 网络延迟可能会存在。如果用户2在时间点对集合`C0`进行搜索，Milvus应该能够保证在之前的所有操作都已成功处理并完成。如果由于网络延迟导致的删除操作延迟，那么当用户2在进行搜索时，很可能仍然可以看到本应删除的数据`A1`。

因此，Milvus采用时间同步系统（timetick）来解决这些问题。

时间戳oracle（TSO）
--------------

解决上一节中提到的第一个问题，Milvus 像其他分布式系统一样，提供了一种时间戳服务（TSO）。这意味着 Milvus 中的所有事件都必须分配一个来自 TSO 而不是本地时钟的时间戳。

TSO 服务由 Milvus 的根协调器提供。客户端可以在单个时间戳分配请求中分配一个或多个时间戳。

TSO 时间戳是一种 uint64 类型的值，由物理部分和逻辑部分组成。下图展示了时间戳的格式。

[![TSO_Timestamp](https://milvus.io/static/e540845fc62f2bee867cfa515146b312/a0d62/TSO_Timestamp.png "TSO timestamp.")](https://milvus.io/static/e540845fc62f2bee867cfa515146b312/a0d62/TSO_Timestamp.png)

TSO timestamp.
.

如图所示，前面的 46 位是物理部分，即 UTC 时间的毫秒数。最后的 18 位是逻辑部分。

时间同步系统（时间戳）
-----------

本节以数据插入操作为例，解释Milvus中的时间同步机制。

当代理从SDK接收到数据插入请求时，根据主键的哈希值将插入消息分成不同的消息流（`MsgStream`）。

每个插入消息（`InsertMsg`）在发送到`MsgStream`之前被分配一个时间戳。

`MsgStream` is a wrapper of the message queue, which is Pulsar by default in Milvus 2.0.

[![timesync_proxy_insert_msg](https://milvus.io/static/389b474c46f5e736517685cbcdec852e/8b7fc/timesync_proxy_insert_msg.png "An example of inserting data from multiple proxies to MsgStreams.")](https://milvus.io/static/389b474c46f5e736517685cbcdec852e/8b7fc/timesync_proxy_insert_msg.png)

An example of inserting data from multiple proxies to MsgStreams.

一个常规原则是，在`MsgStream`中，来自同一代理的`InsertMsgs`的时间戳必须是递增的。然而，对于来自不同代理的`InsertMsgs`，没有这样的规则。

以下图示是`MsgStream`中`InsertMsgs`的示例。片段包含五个`InsertMsgs`，其中三个来自`Proxy1`，其余来自`Proxy2`。

[![msgstream](https://milvus.io/static/e35875b65dc64209b305824dff776828/1263b/msgstream.png "An example of a MsgStream with five InsertMsgs.")](https://milvus.io/static/e35875b65dc64209b305824dff776828/b8bbf/msgstream.png)

An example of a MsgStream with five InsertMsgs.

来自`Proxy1`的三个`InsertMsgs`的时间戳是递增的，两个来自`Proxy2`的`InsertMsgs`也是如此。然而，`Proxy1`和`Proxy2`的`InsertMsgs`之间没有特定的顺序。

一种可能的情况是，在从`Proxy2`读取消息时间戳为`110`时，Milvus发现来自`Proxy1`的时间戳为`80`的消息仍然在`MsgStream`中。因此，Milvus引入了一个时间同步系统timetick，以确保在从`MsgStream`读取消息时，所有较小时间戳值的消息都必须被消耗。

[![time_synchronization](https://milvus.io/static/cbda30c3848b9a8941b7040f65e517bd/1263b/time_synchronization.png "The time synchronization system in Milvus.")](https://milvus.io/static/cbda30c3848b9a8941b7040f65e517bd/e0690/time_synchronization.png)

The time synchronization system in Milvus.

如上图所示，

* 每个代理定期（默认情况下每200毫秒）向根协调器报告`MsgStream`中最新`InsertMsg`的最大时间戳值。

* 根协调器确定此`Msgstream`上的最小时间戳值，无论`InsertMsgs`属于哪个代理。然后根协调器将此最小时间戳插入`Msgstream`。此时间戳也称为timetick。

* 当消费者组件读取根协调器插入的时间刻度时，它们会理解所有时间戳值较小的插入消息已被消费。因此，相关请求可以安全执行，而不会中断顺序。

下图是插入时间刻度的 `Msgstream` 的示例。

[![timetick](https://milvus.io/static/da158edae1eb5c571937f80387840969/1263b/timetick.png "Msgstream with a timetick inserted.")](https://milvus.io/static/da158edae1eb5c571937f80387840969/a365f/timetick.png)

Msgstream with a timetick inserted.

`MsgStream` 根据时间刻度批量处理消息，以确保输出消息满足时间戳的要求。

下一步
---

* 了解[时间戳](timestamp.md)的概念。

* 了解 Milvus 中的[数据处理工作流程](data_processing.md)。
