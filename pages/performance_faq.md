性能常见问题
======

#### 如何为IVF索引设置`nlist`和`nprobe`？

设置`nlist`取决于具体情况。一般而言，建议将`nlist`的值设置为`4×sqrt（n）`，其中`n`是一个段中实体的总数。

每个分段的大小由`datacoord.segment.maxSize`参数确定，默认设置为512 MB。一个分段中的实体总数可以通过将`datacoord.segment.maxSize`除以每个实体的大小来估计。

设置`nprobe`是特定数据集和场景的，需要在准确性和查询性能之间进行权衡。我们建议通过反复实验找到理想值。

以下图表是在sift50m数据集和IVF_SQ8索引上运行的测试结果，比较了不同的`nlist`/`nprobe`对的召回率和查询性能。

[![Accuracy test](https://milvus.io/static/9c3941c1b94c04923daef6cfcd21d9d0/cd4d8/accuracy_nlist_nprobe.png "Accuracy test.")](https://milvus.io/static/9c3941c1b94c04923daef6cfcd21d9d0/cd4d8/accuracy_nlist_nprobe.png)

Accuracy test.

[![Performance test](https://milvus.io/static/8a3c2d1b97c803820645194cbbca8319/7bff9/performance_nlist_nprobe.png "Performance test.")](https://milvus.io/static/8a3c2d1b97c803820645194cbbca8319/7bff9/performance_nlist_nprobe.png)

Performance test.

#### 为什么有时查询较小的数据集需要更长时间？

查询操作是在段上进行的，索引可减少查询段所需的时间。如果某个段尚未被索引，Milvus将在原始数据上进行暴力搜索，从而大大增加查询时间。

因此，通常在小数据集（集合）上查询需要更长时间，因为它尚未构建索引，其段的大小尚未达到`rootCoord.minSegmentSizeToEnableindex`设置的索引构建阈值。调用`create_index()`来强制Milvus索引已达到阈值但尚未自动索引的段，从而显著提高查询性能。

#### What factors impact CPU usage?

CPU的使用率会在建立索引或运行查询时增加。一般来说，除了使用Annoy（只运行在单个线程上），索引构建是CPU密集型的。

运行查询时，CPU使用率受`nq`和`nprobe`的影响。当`nq`和`nprobe`较小时，并发性较低，CPU使用率保持较低。

#### 同时插入数据和搜索会影响查询性能吗？

插入操作并不占用CPU资源。但是，由于新的段可能尚未达到索引构建的阈值，Milvus会采用暴力搜索——这会显著影响查询性能。

`rootcoord.minSegmentSizeToEnableIndex`参数确定了段的索引构建阈值，默认设置为1024行。请参阅[系统配置](system_configuration.md)获取更多信息。

#### 还有问题吗？

你可以：

* 在GitHub上查看[Milvus](https://github.com/milvus-io/milvus/issues)。随时提问、分享想法并帮助其他人。

* 加入我们的[Slack频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)，寻求支持并与我们的开源社区互动。
