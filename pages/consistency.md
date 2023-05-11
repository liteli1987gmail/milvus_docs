# Milvus 一致性级别

本主题介绍了 Milvus 的四个一致性级别以及它们最适合的场景。同时还介绍了确保 Milvus 一致性的机制。

概述
---------

分布式数据库中的一致性特指在给定时间写入或读取数据时，确保每个节点或副本具有相同的数据视图的属性。

Milvus 支持四个一致性级别：强一致性（Strong）、有界陈旧性（Bounded Staleness）、会话（Session）和最终一致性（Eventually）。Milvus 的默认一致性级别为有界陈旧性。您可以在进行 [向量相似度搜索](search.md) 或 [查询](query.md) 时轻松调整一致性级别以适应您的应用程序。

一致性级别
-----------------

根据 [PACELC](https://en.wikipedia.org/wiki/PACELC_theorem) 定理的定义，分布式数据库必须在一致性、可用性和延迟之间进行权衡。高一致性意味着高准确性但也意味着高搜索延迟，而低一致性则导致较快的搜索速度但是可能会牺牲数据可见性。因此，不同的一致性级别适用于不同的场景。

以下介绍了 Milvus 支持的四个一致性级别之间的区别及它们各自适用的场景。

### 强一致性（Strong）

强一致性是最高和最严格的一致性级别。它确保用户可以读取数据的最新版本。

[![Strong consistency](https://milvus.io/static/3b1cc27270d738f7c0d6009c08b72067/1263b/Consistency_Strong.png "An illustration of strong consistency.")](https://milvus.io/static/3b1cc27270d738f7c0d6009c08b72067/5fc41/Consistency_Strong.png)

强一致性的图示。

根据 PACELC 定理，如果一致性级别设置为强一致性，则延迟会增加。因此，我们建议在功能测试期间选择强一致性以确保测试结果的准确性。同时，强一致性也最适合那些在数据一致性上有严格要求但能够忍受搜索速度减慢的应用程序，例如在线金融系统处理订单支付和结算。

### 有界陈旧性（Bounded Staleness）

有界陈旧性，顾名思义，允许在一定时间内数据不一致。然而，通常情况下，在该时间段之外的数据是全局一致的。

[![Bounded staleness consistency](https://milvus.io/static/abf64dacad2cec0352b2274311b2e814/1263b/Consistency_Bounded.png "An illustration of bounded staleness consistency.")](https://milvus.io/static/abf64dacad2cec0352b2274311b2e814/88bf1/Consistency_Bounded.png)

有界陈旧性的图示。

有界 staleness 适用于需要控制搜索延迟并可以接受偶尔数据不可见的情况。例如，在像视频推荐引擎这样的推荐系统中，数据不可见有时对整体召回率影响很小，但可以显著提高推荐系统的性能。

### Session

Session 确保同一会话中的所有数据写入可以立即在读取中感知。换句话说，当您通过一个客户端写入数据时，新插入的数据立即变得可搜索。

[![Session consistency](https://milvus.io/static/d32f8569e2d9a00a478af9dc88054c80/1263b/Consistency_Session.png "An illustration of session consistency.")](https://milvus.io/static/d32f8569e2d9a00a478af9dc88054c80/88bf1/Consistency_Session.png)

An illustration of session consistency.

我们建议在需要高一致性的情况下选择会话一致性级别。例如，从图书馆系统中删除书目录数据后，在确认删除并刷新页面（另一个会话）后，搜索结果中不应再显示该书。

### 最终一致性（Eventually）

读取和写入操作没有保证的顺序，副本（replicas）最终会收敛到相同的状态，前提是没有进行更多的写入操作。在“最终一致性”（eventually）的一致性级别下，副本会从最新更新值开始处理读请求。最终一致性是四种级别中最弱的。

[![Eventual consistency](https://milvus.io/static/28ae7189475745fc662fae4acbf06ab3/1263b/Consistency_Eventual.png "An illustration of eventually consistent.")](https://milvus.io/static/28ae7189475745fc662fae4acbf06ab3/88bf1/Consistency_Eventual.png)

最终一致性的图示。

然而，根据 PACELC 定理，通过牺牲一致性可以大大缩短搜索延迟。因此，最终一致性最适合那些并不需要高度数据一致性但要求极快的搜索性能的场景，例如在 Amazon 上检索产品的评论和评级。

保证时间戳
--------------------

Milvus 通过引入“保证时间戳”（Guarantee timestamp）（[GuaranteeTs](https://github.com/milvus-io/milvus/blob/f3f46d3bb2dcae2de0bdb7bc0f7b20a72efceaab/docs/developer_guides/how-guarantee-ts-works.md)）来实现不同的一致性级别。

GuaranteeTs 用于通知查询节点，查询或搜索请求无法执行，直到查询节点可以看到该时间戳之前的所有数据。当指定一致性级别时，一致性级别将被映射到特定的 GuaranteeTs 值。不同的 GuaranteeTs 值对应不同的一致性级别：

* **强一致性（Strong）**：GuaranteeTs 设置为与最新的系统时间戳相同，并且查询节点在处理搜索或查询请求之前必须等待可以查看最新的系统时间戳之前的所有数据。

* **有界陈旧性（Bounded Staleness）**：GuaranteeTs 相对最新的系统时间戳设置较小，查询节点在一个可容忍的较不更新的数据视图上进行搜索。

* **会话（Session）**：客户端使用最新写入操作的时间戳作为 GuaranteeTs，以便每个客户端至少可以检索由同一客户端插入的数据。

* **最终一致性（Eventually）**：GuaranteeTs 被设置为一个非常小的值以跳过一致性检查。查询节点立即在现有数据视图上进行搜索。

有关 Milvus 中不同一致性级别的机制的详细信息，请参见 [如何使用 GuaranteeTs](https://github.com/milvus-io/milvus/blob/f3f46d3bb2dcae2de0bdb7bc0f7b20a72efceaab/docs/developer_guides/how-guarantee-ts-works.md) 和 [关于时间同步的所有内容](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/milvus_timesync_en.md?from=from_parent_mindnote)。
接下来是什么
------

* 学习如何在以下情况下调整一致性级别：
	+ [进行向量相似性搜索](search.md)
	+ [进行向量查询](query.md)
