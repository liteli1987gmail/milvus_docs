---
id: cdc-monitoring.md
order: 4
summary: Milvus-CDC provides comprehensive monitoring capabilities through Grafana dashboards.
title: Monitoring
---

# 监控

Milvus-CDC 通过 Grafana 仪表板提供全面的监控功能，让您能够可视化关键指标，确保您的变更数据捕获（CDC）任务和服务器健康顺利运行。

### CDC 任务的指标

要开始使用，请将 [cdc-grafana.json](https://github.com/zilliztech/milvus-cdc/blob/main/server/configs/cdc-grafana.json) 文件导入到 Grafana 中。这将添加一个专门设计用于监控 CDC 任务状态的仪表板。

**CDC Grafana 仪表板概览**:

![milvus-cdc-dashboard](/public/assets/milvus-cdc-dashboard.png)

**关键指标解释**:

- **Task**: 不同状态的 CDC 任务数量, 包括 **Initial**, **Running**, and **Paused**.

- **Request Total**: Milvus-CDC 接收到的请求总数

- **Request Success**: Milvus-CDC 接收到的成功请求数量.

- **task num**: 随时间变化的 **Initial**, **Paused**, and **Running** 状态的任务数量

- **task state**: 各个任务的状态.

- **request count**: 成功请求和总请求的数量。

- **request latency**: 通过 p99、平均值和其他统计数据的请求延迟

- **replicate data rate**: 读写操作的复制数据速率。

- **replicate tt lag**: 读写操作的复制时间延迟。

- **api execute count**: 不同 Milvus-CDC API 被执行的次数。

- **center ts**: 读写任务的时间戳。
