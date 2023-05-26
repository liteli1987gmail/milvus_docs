Milvus 服务的警报机制
===

本主题介绍了 Milvus 服务的警报机制，并解释了何时以及如何创建 Milvus 警报。

通过创建警报，您可以在特定指标的值超过您预定义的阈值时收到通知。

比如，您创建了一个警报，并将 80 MB 设置为 Milvus 组件的内存使用的最大值。如果实际使用超过预定义的数字，您将收到提醒，提醒您 Milvus 组件的内存使用超过 80 MB。在收到警报后，您可以及时调整资源分配，以确保服务可用性。

创建警报的场景
-------

以下是您需要创建警报的一些常见场景。

* Milvus 组件的 CPU 或内存使用过高。

* Milvus 组件的 Pod 磁盘空间不足。

* Milvus 组件的 Pod 频繁重启。

以下指标可用于警报配置：

| 指标 | 描述 | 计量单位 |
| --- | --- | --- |
| CPU 使用率 | Milvus 组件使用 CPU 运行时间指示的 CPU 使用率。 | 秒 |
| 内存 | Milvus 组件消耗的内存资源。 | MB |
| Goroutines | GO 语言中正在并发执行的活动。 | / |
| 操作系统线程数 | 操作系统中的线程或轻量级进程。 | / |
| 进程已打开文件描述符数 | 当前使用的文件描述符数量。 | / |


设置警报
----

本指南以创建Milvus组件内存使用警报为例。如果要创建其他类型的警报，请相应地调整命令。如果在过程中遇到任何问题，请在[Milvus论坛](https://discuss.milvus.io/)或[Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ)上发起讨论。

### 先决条件

本教程假定您已安装和配置了Grafana。如果没有，我们建议先阅读[监控指南](monitor.md)。

### 1. 添加新的查询

添加内存使用率的报警，请编辑 Memory 面板，并添加一个新的查询指标，如下所示：`process_resident_memory_bytes {app_kubernetes_io_name="milvus", app_kubernetes_io_instance = ~"my-release", namespace="default"}`

[![Alert_metric](https://milvus.io/static/18103d1a30b5181fc6ee91800ea939f5/1263b/alert_metric.png "添加警报")](https://milvus.io/static/18103d1a30b5181fc6ee91800ea939f5/bbbf7/alert_metric.png)

添加警报。

### 2. 保存仪表板

保存仪表板，并等待几分钟查看警报。

[![Alert_dashboard](https://milvus.io/static/fd5f1694aed3b5b5f29b639ad301a071/1263b/alert_dashboard.png "Save the dashboard.")](https://milvus.io/static/fd5f1694aed3b5b5f29b639ad301a071/bbbf7/alert_dashboard.png)

保存仪表板。

Grafana警报查询不支持模板变量。因此，您应添加一个没有任何模板变量的标签的第二个查询。第二个查询默认名为“A”。您可以通过点击下拉菜单进行重命名。

[![Alert_query](https://milvus.io/static/6ff9d7104bae4f442d79066d22dc7993/1263b/alert_query.png "新添加的查询")](https://milvus.io/static/6ff9d7104bae4f442d79066d22dc7993/bbbf7/alert_query.png)

新添加的查询。

### 3. 添加警报通知

为接收警报通知，请添加一个“通知渠道”。然后，在“发送到”字段中指定该通道。

[![Alert_notification](https://milvus.io/static/02677efc0008e03977429c0abd4838b0/1263b/alert_notification.png "指定通知渠道")](https://milvus.io/static/02677efc0008e03977429c0abd4838b0/1263b/alert_notification.png)

指定通知渠道。

如果警报成功创建并触发，则将收到下图所示的通知。

[![Notification_message](https://milvus.io/static/cab0cbc6f6979e44d8a2c77c66e9cd9a/1263b/notification_message.png "警报已创建并触发")](https://milvus.io/static/cab0cbc6f6979e44d8a2c77c66e9cd9a/bbbf7/notification_message.png)

警报已创建并触发。

要删除警报，请转到“警报”面板并单击删除按钮。

[![Delete_alert](https://milvus.io/static/1a45b6cde7981603fc5b983d3d88c3ef/1263b/delete_alert.png "删除警报")](https://milvus.io/static/1a45b6cde7981603fc5b983d3d88c3ef/bbbf7/delete_alert.png)

删除警报。

下一步是什么
-----------

* 如果您需要开始监控Milvus服务：
    + 阅读[监控指南](monitor.md)
    + 学习如何[可视化监控指标](visualize.md)
 
* 如果您已创建了用于监视 Milvus 组件内存使用情况的警报：
   + 学习如何[分配资源](allocate.md#standalone)
 
* 如果您想获取有关如何扩展Milvus集群的信息：
   + 学习如何[扩展Milvus集群](scaleout.md)