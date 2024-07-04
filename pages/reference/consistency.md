

# 一致性

本主题介绍了 Milvus 中四个一致性级别及其最适用的场景。还介绍了在 Milvus 中确保一致性的机制。

## 概述

分布式数据库中的一致性特指在给定时间写入或读取数据时，确保每个节点或复制品对数据具有相同的视图的属性。

Milvus 支持四个一致性级别：强一致性、有界 staleness、会话一致性和最终一致性。Milvus 的默认一致性级别是有界 staleness。在进行 [单向量搜索](/userGuide/search-query-get/single-vector-search.md)、[多向量搜索](/userGuide/search-query-get/multi-vector-search.md) 或 [查询](/userGuide/search-query-get/get-and-scalar-query.md) 时，你可以轻松调整一致性级别，使其最适合你的应用程序。

## 一致性级别

根据 [PACELC 定理](https://en.wikipedia.org/wiki/PACELC_theorem) 的定义，分布式数据库必须在一致性、可用性和延迟之间进行权衡。高一致性意味着高准确性，但也意味着较高的搜索延迟，而低一致性则意味着快速的搜索速度，但可能会导致数据可见性的某种损失。因此，不同的一致性级别适用于不同的场景。

以下是 Milvus 支持的四个一致性级别及其适用的场景的区别说明。

### 强一致性

强一致性是最高和最严格的一致性级别。它确保用户可以读取最新版本的数据。

![Strong consistency](/assets/Consistency_Strong.png "Strong consistency的示意图。")

根据 PACELC 定理，如果将一致性级别设置为 strong，则会增加延迟。因此，我们建议在功能测试期间选择 strong 一致性以确保测试结果的准确性。强一致性也最适用于对数据一致性要求严格而不考虑搜索速度的应用程序。一个例子可以是处理订单支付和账单的在线金融系统。

### 有界 staleness

有界 staleness（有界陈旧性）允许在一定时间内存在数据不一致。但一般情况下，在该时间段之外的时间内，数据总是全局一致的。

![Bounded staleness consistency](/assets/Consistency_Bounded.png "有界 staleness一致性的示意图。")

有界 staleness 适用于需要控制搜索延迟并且可以接受零星数据不可见性的场景。例如，在视频推荐引擎等推荐系统中，数据不可见性有时对总的召回率影响较小，但可以显着提升推荐系统的性能。

### 会话一致性

会话一致性保证在同一会话中，所有数据写入在读取时可以立即感知到。换句话说，当你通过一个客户端写入数据时，新插入的数据可以立即被搜索到。

![Session consistency](/assets/Consistency_Session.png "会话一致性的示意图。")

我们建议在需要同一会话中的数据一致性的场景中选择会话一致性级别。一个例子可以是从图书馆系统中删除图书条目的数据，在确认删除并刷新页面（一个不同的会话）后，搜索结果中不应再显示该书。

### 最终一致性

读取和写入的顺序没有保证，并且在不进行进一步的写操作的情况下，复制品最终会收敛到相同的状态。在 "最终一致性" 的一致性下，复制品使用最新更新的值来处理读请求。最终一致性是四个级别中最弱的。

![Eventual consistency](/assets/Consistency_Eventual.png "最终一致性的示意图。")

不过，根据 PACELC 定理，牺牲一致性可以极大地缩短搜索延迟。因此，最终一致性最适用于对数据一致性要求不高但需要快速搜索性能的场景。一个例子可以是以最终一致性级别检索亚马逊产品的评论和评分。

## 保证时间戳

Milvus 通过引入 [保证时间戳](https://github.com/milvus-io/milvus/blob/f3f46d3bb2dcae2de0bdb7bc0f7b20a72efceaab/docs/developer_guides/how-guarantee-ts-works.md)（GuaranteeTs）来实现不同的一致性级别。

保证时间戳用于通知查询节点，在执行查询请求之前，需要等待所有早于保证时间戳的数据可见。当你指定一致性级别时，一致性级别将映射到特定的保证时间戳值。不同的保证时间戳值对应不同的一致性级别：

- **强一致性**：保证时间戳设置为与最新系统时间戳相同，并且查询节点在处理搜索或查询请求之前等待，直到可以看到最新的系统时间戳之前的所有数据。

- **有界 staleness**：保证时间戳相对于最新系统时间戳较小，并且查询节点在可容忍的、不太新的数据视图上进行搜索。

- **会话一致性**：客户端使用最新写操作的时间戳作为保证时间戳，以便每个客户端至少可以检索由同一客户端插入的数据。

- **最终一致性**：保证时间戳设置为非常小的值，以跳过一致性检查。查询节点在现有数据视图上立即进行搜索。

有关 Milvus 中确保不同一致性级别的机制的更多信息，请参见 [如何工作](https://github.com/milvus-io/milvus/blob/f3f46d3bb2dcae2de0bdb7bc0f7b20a72efceaab/docs/developer_guides/how-guarantee-ts-works.md)。

## 下一步操作






- 学习如何在以下情况下调整一致性级别：
  - [进行单值搜索](/userGuide/search-query-get/single-vector-search.md)
  - [进行多值搜索](/userGuide/search-query-get/multi-vector-search.md)
  - [进行标量查询](/userGuide/search-query-get/get-and-scalar-query.md)

