---

id: alert.md
title: 创建警报
related_key: 监控和警报。
summary: 学习如何在 Grafana 中为 Milvus 服务创建警报。

---

# 为 Milvus 服务创建警报

本主题介绍了 Milvus 服务的警报机制，并解释了为什么要创建警报，何时以及如何在 Milvus 中创建警报。

通过创建警报，当特定指标的值超过您预定义的阈值时，您可以接收通知。

例如，您创建了一个警报，并将 Milvus 组件的内存使用量的最大值设置为 80 MB。如果实际使用量超过了预定义的数字，您将收到警报，提醒您 Milvus 组件的内存使用量超过了 80 MB。在警报之后，您可以相应地及时调整资源分配，以确保服务可用性。

## 创建警报的场景

以下是一些常见的需要创建警报的场景：

- Milvus 组件的 CPU 或内存使用率过高。
- Milvus 组件 pod 磁盘空间不足。
- Milvus 组件 pod 重启过于频繁。

以下是可用于警报配置的一些指标：

| 指标   | 描述  | 度量单位  |
| --------  | --------- | -------------- |
| CPU 使用量   | 由 Milvus 组件使用的 CPU，由 CPU 的运行时间指示。  | 秒    |
| 内存      | Milvus 组件消耗的内存资源。  | MB    |
| Goroutines   | GO 语言中的并发执行活动。  |  /   |
| OS 线程   | 操作系统中的线程，或轻量级进程。  |   / |
| 进程打开的 Fds   | 当前使用的文件描述符数量。  | /    |

## 设置警报
本指南以创建 Milvus 组件内存使用的警报为例。要创建其他类型的警报，请相应地调整您的命令。如果在过程中遇到任何问题，欢迎在 [Milvus 论坛](https://discuss.milvus.io/) 中提问，或在 [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ) 上发起讨论。

### 先决条件
本教程假设您已安装并配置了 Grafana。如果没有，我们建议您阅读 [监控指南](monitor.md)。

### 1. 添加新查询
要为 Milvus 组件的内存使用添加警报，请编辑内存面板。然后，使用指标 `process_resident_memory_bytes{app_kubernetes_io_name="milvus", app_kubernetes_io_instance=~"my-release", namespace="default"}` 添加一个新查询。

![Alert_metric](..//alert_metric.png "添加警报。")

### 2. 保存仪表板
保存仪表板，等待几分钟以查看警报。

![Alert_dashboard](..//alert_dashboard.png "保存仪表板。")

Grafana 警报查询不支持模板变量。因此，您应该在标签中添加一个没有任何模板变量的第二个查询。第二个查询默认命名为 "A"。您可以通过单击下拉菜单重命名它。

![Alert_query](..//alert_query.png "新添加的查询。")

### 3. 添加警报通知
要接收警报通知，请添加一个 "通知渠道"。然后，在 "发送到" 字段中指定该渠道。

![Alert_notification](..//alert_notification.png "指定通知渠道。")

如果成功创建并触发了警报，您将收到如下图所示的通知。

![Notification_message](..//notification_message.png "已创建并触发警报。")

要删除警报，请转到 "警报" 面板并单击删除按钮。

![Delete_alert](..//delete_alert.png "删除警报。")

## 接下来做什么

- 如果您需要开始监控 Milvus 的服务：
  - 阅读 [监控指南](monitor.md)
  - 学习如何 [可视化监控指标](visualize.md)
- 如果您已经为 Milvus 组件的内存使用创建了警报：
  - 学习如何 [分配资源](allocate.md#standalone)
- 如果您正在寻找有关如何扩展 Milvus 集群的信息：
  - 学习 [扩展 Milvus 集群](scaleout.md)