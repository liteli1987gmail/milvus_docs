---
id: release_notes.md
summary: Milvus 发布说明
title: 发布说明
---

# 发布说明

了解 Milvus 的最新动态！本页面总结了每个版本中的新功能、改进、已知问题和错误修复。您可以在本节中找到 v2.4.0 之后每个发布版本的发布说明。我们建议您定期访问此页面以了解更新。

## v2.4.0

发布日期：2024 年 4 月 17 日

| Milvus 版本 | Python SDK 版本 | Node.js SDK 版本 |
| ----------- | --------------- | ---------------- |
| 2.4.0       | 2.4.0           | 2.4.0            |

我们很高兴宣布 Milvus 2.4.0 的正式发布。在 2.4.0-rc.1 版本的基础上，我们专注于解决用户报告的关键错误，同时保持现有功能。此外，Milvus 2.4.0 引入了一系列优化，旨在提高系统性能，通过整合各种指标来提高可观测性，并简化代码库以增加简单性。

### 改进

- 支持 MinIO TLS 连接 ([#31396](https://github.com/milvus-io/milvus/pull/31396), [#31618](https://github.com/milvus-io/milvus/pull/31618))
- 对标量字段支持 AutoIndex ([#31593](https://github.com/milvus-io/milvus/pull/31593))
- 混合搜索重构，以实现与普通搜索一致的执行路径 ([#31742](https://github.com/milvus-io/milvus/pull/31742), [#32178](https://github.com/milvus-io/milvus/pull/32178))
- 通过 bitset 和 bitset_view 重构加速过滤 ([#31592](https://github.com/milvus-io/milvus/pull/31592), [#31754](https://github.com/milvus-io/milvus/pull/31754), [#32139](https://github.com/milvus-io/milvus/pull/32139))
- 导入任务现在支持等待数据索引完成 ([#31733](https://github.com/milvus-io/milvus/pull/31733))
- 增强导入兼容性 ([#32121](https://github.com/milvus-io/milvus/pull/32121)), 任务调度 ([#31475](https://github.com/milvus-io/milvus/pull/31475)), 以及对导入文件大小和数量的限制 ([#31542](https://github.com/milvus-io/milvus/pull/31542))。
- 代码简化工作，包括类型检查的接口标准化 ([#31945](https://github.com/milvus-io/milvus/pull/31945), [#31857](https://github.com/milvus-io/milvus/pull/31857)), 移除弃用的代码和指标 ([#32079](https://github.com/milvus-io/milvus/pull/32079), [#32134](https://github.com/milvus-io/milvus/pull/32134), [#31535](https://github.com/milvus-io/milvus/pull/31535), [#32211](https://github.com/milvus-io/milvus/pull/32211), [#31935](https://github.com/milvus-io/milvus/pull/31935)), 以及常量名称的规范化 ([#31515](https://github.com/milvus-io/milvus/pull/31515))
- QueryCoord 当前目标通道检查点延迟的新指标 ([#31420](https://github.com/milvus-io/milvus/pull/31420))
- 通用指标的新 db 标签 ([#32024](https://github.com/milvus-io/milvus/pull/32024))
- 关于已删除、已索引和已加载实体数量的新指标，包括 collectionName 和 dbName 等标签 ([#31861](https://github.com/milvus-io/milvus/pull/31861))
- 不匹配向量类型的错误处理改进 ([#31766](https://github.com/milvus-io/milvus/pull/31766))
- 支持在无法构建索引时抛出错误而不是崩溃 ([#31845](
