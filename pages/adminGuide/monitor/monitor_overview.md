---
id: monitor_overview.md
title: 概览
related_key: 监控，警报
summary: 了解 Prometheus 和 Grafana 如何在 Milvus 中用于监控和警报服务。
---

# Milvus 监控框架概述

本主题解释了 Milvus 如何使用 Prometheus 监控指标，并使用 Grafana 可视化指标并创建警报。

## Milvus 中的 Prometheus

[Prometheus](https://prometheus.io/docs/introduction/overview/) 是一个用于 Kubernetes 实现的开源监控和警报工具包。它收集并存储指标作为时间序列数据。这意味着指标在记录时会附带时间戳，以及可选的键值对，称为标签。

目前 Milvus 使用 Prometheus 的以下组件：

- Prometheus 端点：从由导出器设置的端点拉取数据。
- Prometheus 操作符：有效管理 Prometheus 监控实例。
- Kube-prometheus：提供易于操作的端到端 Kubernetes 集群监控。

### 指标名称

在 Prometheus 中，一个有效的指标名称包含三个元素：命名空间、子系统和名称。这三个元素通过 "_" 连接。

Milvus 由 Prometheus 监控的指标的命名空间是 "milvus"。根据指标所属的角色，其子系统应该是以下八个角色之一："rootcoord"、"proxy"、"querycoord"、"querynode"、"indexcoord"、"indexnode"、"datacoord"、"datanode"。

例如，Milvus 计算查询的向量总数的指标名为 `milvus_proxy_search_vectors_count`。

### 指标类型

Prometheus 支持四种类型的指标：

- 计数器（Counter）：一种累积指标，其值只能增加或在重启时重置为零。
- 仪表盘（Gauge）：一种指标，其值可以上升或下降。
- 直方图（Histogram）：一种基于可配置的桶计数的指标。一个常见的例子是请求持续时间。
- 摘要（Summary）：一种类似于直方图的指标，它计算可配置的滑动时间窗口上的分位数。

### 指标标签

Prometheus 通过为具有相同指标名称的样本贴标签来区分它们。标签是指标的某个属性。具有相同名称的指标必须对 `variable_labels` 字段具有相同的值。下表列出了 Milvus 指标的常见标签名称及其含义。

| 标签名称 | 定义 | 值 |
|---|---|---|
| "node_id" | 角色的唯一身份。 | 由 Milvus 生成的全局唯一 ID。 |
| "status" | 处理的操作或请求的状态。 | "abandon"、"success" 或 "fail"。 |
| “query_type” | 读取请求的类型。 | "search" 或 "query"。 |
| "msg_type" | 消息的类型。 | "insert"、"delete"、"search" 或 "query"。 |
| "segment_state" | 段的状态。 | "Sealed"、"Growing"、"Flushed"、"Flushing"、"Dropped" 或 "Importing"。 |
| "cache_state" | 缓存对象的状态。 | "hit" 或 "miss"。 |
| "cache_name" | 缓存对象的名称。这个标签与 "cache_state" 标签一起使用。 | 例如 "CollectionID"、"Schema" 等。 |
| “channel_name” | 消息存储中的物理主题（Pulsar 或 Kafka）。 | 例如 "by-dev-rootcoord-dml_0"、"by-dev-rootcoord-dml_255" 等。 |
| "function_name" | 处理某些请求的函数名称。 | 例如 "CreateCollection"、"CreatePartition"、"CreateIndex" 等。 |
| "user_name" | 用于认证的用户名。 | 您喜欢的用户名。 |
| "index_task_status" | 元存储中索引任务的状态。 | "unissued"、"in-progress"、"failed"、"finished" 或 "recycled"。 |

## Milvus 中的 Grafana

[Grafana](https://grafana.com/docs/grafana/latest/introduction/) 是一个开源可视化堆栈，可以连接所有数据源。通过拉取指标，它帮助用户理解、分析和监控大量数据。

Milvus 使用 Grafana 的可定制仪表板进行指标可视化。

## 接下来

在了解监控和警报的基本工作流程后，学习：

- [部署监控服务](monitor.md)
- [可视化 Milvus 指标](visualize.md)
- [创建警报](alert.md)