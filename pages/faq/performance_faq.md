


# 性能常见问题解答

<!-- TOC -->


<!-- /TOC -->

#### 如何设置 IVF 索引的 `nlist` 和 `nprobe`？

设置 `nlist` 是根据具体情况而定的。一个经验法则是，`nlist` 的推荐值为 `4 × sqrt(n)`，其中 `n` 是段中实体的总数。

每个段的大小由 `datacoord.segment.maxSize` 参数决定，默认设置为 512 MB。段中实体的总数 `n` 可以通过将 `datacoord.segment.maxSize` 除以每个实体的大小来估计。

设置 `nprobe` 是特定于数据集和场景的，并涉及准确性和查询性能之间的权衡。我们建议通过反复实验找到最佳值。

下面的图表是在 sift50m 数据集和 IVF_SQ8 索引上运行的测试结果，比较了不同 `nlist`/`nprobe` 对的召回率和查询性能。

![准确性测试](/assets/accuracy_nlist_nprobe.png "准确性测试")
![性能测试](/assets/performance_nlist_nprobe.png "性能测试")

#### 为什么在较小的数据集上查询有时会花费更长的时间？

查询操作是在段上进行的。索引可以减少查询段所需的时间。如果一个段没有被索引，Milvus 会对原始数据进行暴力搜索，从而大大增加查询时间。

因此，在小数据集（集合）上查询通常会花费更长的时间，因为它没有构建索引。这是因为其段的大小尚未达到 `rootCoord.minSegmentSizeToEnableindex` 设置的索引构建阈值。调用 `create_index()` 方法会强制 Milvus 对已达到阈值但尚未被自动索引的段进行索引，从而显著提高查询性能。

#### 哪些因素会影响 CPU 使用率？

当 Milvus 构建索引或运行查询时，CPU 使用率会增加。一般情况下，除了使用 Annoy 在单个线程上运行之外，索引构建都是 CPU 密集型的。

在运行查询时，CPU 使用率受到 `nq` 和 `nprobe` 的影响。当 `nq` 和 `nprobe` 较小时，并发性较低，CPU 使用率也较低。

#### 同时插入数据和查询是否会影响查询性能？

插入操作不会消耗大量 CPU 资源。然而，由于新段可能尚未达到索引构建的阈值，Milvus 会采用暴力搜索的方式，从而严重影响查询性能。

`rootcoord.minSegmentSizeToEnableIndex` 参数确定段的索引构建阈值，默认设置为 1024 行。有关更多信息，请参阅 [系统配置](/reference/sys_config/system_configuration.md)。

#### 还有其他问题吗？







你可以：

- 在 GitHub 上查看 [Milvus](https://github.com/milvus-io/milvus/issues)。请随时提问，分享想法并帮助他人。
- 加入我们的 [Slack 频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)，获取支持并与我们的开源社区互动。

