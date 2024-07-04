


# 为 Milvus 服务创建警报

本主题介绍了 Milvus 服务的警报机制，并解释了何时以及如何创建 Milvus 中的警报。

通过创建警报，你可以在特定指标的值超过你预定义的阈值时收到通知。

例如，你创建了一个警报，并将 80 MB 设置为 Milvus 组件的内存使用量的最大值。如果实际使用量超过预定义的数值，你将收到警报提醒你 Milvus 组件的内存使用量超过了 80 MB。接收到警报后，你可以相应地及时调整资源分配，以确保服务的可用性。

## 创建警报的场景

以下是一些需要为其创建警报的常见场景。

- Milvus 组件的 CPU 或内存使用率过高。
- Milvus 组件的 Pod 磁盘空间不足。
- Milvus 组件的 Pod 频繁重启。

以下是可用于警报配置的指标：

| 指标 | 描述 | 计量单位 |
| --------  | --------- | -------------- |
| CPU 使用率 | Milvus 组件的 CPU 使用率，由 CPU 的运行时间表示。 | 秒    |
| 内存 | Milvus 组件消耗的内存资源。 | MB    |
| Goroutines（Go 例程） | GO 语言中的并发执行活动。 |  /   |
| 操作系统线程 | 操作系统中的线程或轻型进程。 |   / |
| 进程打开的文件描述符 | 当前使用的文件描述符数量。 | /    |

## 设置警报
本指南以为 Milvus 组件的内存使用量创建警报为例。要创建其他类型的警报，请相应调整你的命令。如果在过程中遇到任何问题，请随时在 [Milvus 论坛](https://discuss.milvus.io/) 提问或在 [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ) 上发起讨论。

### 先决条件
本教程假设你已安装并配置了 Grafana。如果没有安装，我们建议阅读 [监控指南](/adminGuide/monitor/monitor.md)。

### 1. 添加新查询
要为 Milvus 组件的内存使用量添加警报，请编辑内存面板。然后，添加一个新的查询，其指标为：`process_resident_memory_bytes{app_kubernetes_io_name="milvus", app_kubernetes_io_instance=~"my-release", namespace="default"}`

![Alert_metric](/assets/alert_metric.png "添加警报")

### 2. 保存仪表板
保存仪表板，并等待几分钟以查看警报。

![Alert_dashboard](/assets/alert_dashboard.png "保存仪表板")

Grafana 警报查询不支持模板变量。因此，你应该添加一个没有任何模板变量标签的第二个查询。第二个查询默认名称为 "A"，你可以通过单击下拉菜单来重命名它。

![Alert_query](/assets/alert_query.png "新增的查询")

### 3. 添加警报通知
要接收警报通知，请添加一个“通知渠道”。然后，在“Send to”字段中指定渠道。

![Alert_notification](/assets/alert_notification.png "指定通知渠道")

如果成功创建和触发了警报，你将收到以下屏幕截图中显示的通知。

![Notification_message](/assets/notification_message.png "创建并触发警报")

要删除一个警报，进入“Alert”面板并点击删除按钮。

![Delete_alert](/assets/delete_alert.png "删除警报")

## 下一步



- 如果你需要开始监控 Milvus 的服务：
  - 阅读 [监控指南](/adminGuide/monitor/monitor.md)
  - 学习如何 [可视化监控指标](/adminGuide/monitor/visualize.md)
- 如果你已经为 Milvus 组件的内存使用创建了警报：
  - 学习如何 [分配资源](allocate.md#standalone)
- 如果你正在寻找关于如何扩展 Milvus 集群的信息：
  - 学习如何 [扩展 Milvus 集群](/adminGuide/scaleout.md)

