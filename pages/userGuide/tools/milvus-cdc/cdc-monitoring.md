---
title: Milvus-CDC 监控
---

# 监控

Milvus-CDC 通过 Grafana 仪表板提供全面的监控功能，让您能够可视化关键指标，确保您的变更数据捕获（CDC）任务和服务器健康顺利运行。

### CDC 任务的指标

要开始使用，请将 [cdc-grafana.json](https://github.com/zilliztech/milvus-cdc/blob/main/server/configs/cdc-grafana.json) 文件导入到 Grafana 中。这将添加一个专门设计用于监控 CDC 任务状态的仪表板。

__CDC Grafana 仪表板概览__:

![milvus-cdc-dashboard](../..//milvus-cdc-dashboard.png)

__关键指标解释__:

- __任务__: 不同状态的 CDC 任务数量，包括 __初始__、__运行中__ 和 __已暂停__。

- __请求总数__: Milvus-CDC 接收到的请求总数。

- __请求成功__: Milvus-CDC 接收到的成功请求数量。

- __task num__: 随时间变化的 __初始__、__已暂停__ 和 __运行中__ 状态的任务数量。

- __task state__: 各个任务的状态。

- __请求计数__: 成功请求和总请求的数量。

- __请求延迟__: 通过 p99、平均值和其他统计数据的请求延迟。

- __复制数据速率__: 读写操作的复制数据速率。

- __复制时间延迟__: 读写操作的复制时间延迟。

- __API 执行计数__: 不同 Milvus-CDC API 被执行的次数。

- __中心时间戳__: 读写任务的时间戳。