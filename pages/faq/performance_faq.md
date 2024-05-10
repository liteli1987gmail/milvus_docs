---
id: performance_faq.md
summary: 寻找关于搜索性能、性能增强和其他与性能相关的问题的常见问题答案。
title: 性能FAQ
---
# 性能FAQ

<!-- TOC -->

<!-- /TOC -->

#### 如何为IVF索引设置`nlist`和`nprobe`？

设置`nlist`是特定于场景的。作为经验法则，推荐的`nlist`值是`4 × sqrt(n)`，其中`n`是一个段中实体的总数。

每个段的大小由`datacoord.segment.maxSize`参数确定，默认设置为512 MB。一个段中的实体总数n可以通过将`datacoord.segment.maxSize`除以每个实体的大小来估计。

设置`nprobe`是特定于数据集和场景的，并且涉及到准确性和查询性能之间的权衡。我们建议通过重复实验找到理想的值。

下面的图表是在sift50m数据集和IVF_SQ8索引上运行的测试结果，比较了不同的`nlist`/`nprobe`对的召回率和查询性能。

![准确性测试](/assets/accuracy_nlist_nprobe.png "准确性测试。")
![性能测试](/assets/performance_nlist_nprobe.png "性能测试。")

#### 为什么在较小的数据集上查询有时需要更长时间？

查询操作是在段上进行的。索引减少了查询段所需的时间。如果一个段没有被索引，Milvus会退回到对原始数据的暴力搜索——显著增加查询时间。

因此，通常在小数据集（集合）上查询需要更长时间，因为它没有建立索引。这是因为其段的大小还没有达到由`rootCoord.minSegmentSizeToEnableindex`设置的索引构建阈值。调用`create_index()`可以强制Milvus对已达到阈值但尚未自动索引的段进行索引，显著提高查询性能。

#### 什么因素影响CPU使用率？

当Milvus正在构建索引或运行查询时，CPU使用率会增加。一般来说，除了使用Annoy时（它在单个线程上运行），索引构建是CPU密集型的。

在运行查询时，CPU使用率受`nq`和`nprobe`的影响。当`nq`和`nprobe`很小时，并发性低，CPU使用率保持在较低水平。

#### 同时插入数据和搜索是否会影响查询性能？

插入操作不是CPU密集型的。然而，由于新段可能还没有达到索引构建的阈值，Milvus会退回到暴力搜索——显著影响查询性能。

`rootcoord.minSegmentSizeToEnableIndex`参数决定了段的索引构建阈值，默认设置为1024行。有关更多信息，请参见[系统配置](system_configuration.md)。

#### 还有问题吗？

你可以：

- 在GitHub上查看[Milvus](https://github.com/milvus-io/milvus/issues)。随时提问，分享想法，并帮助他人。
- 加入我们的[Slack频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)以获得支持并参与我们的开源社区。