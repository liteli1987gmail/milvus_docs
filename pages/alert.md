
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

| Metric | Description | Unit of measure |
| --- | --- | --- |
| CPU Usage | CPU usage by Milvus components that is indicated by the running time of CPU. | Second |
| Memory | Memory resources consumed by Milvus components. | MB |
| Goroutines | Concurrent executing activities in GO language. | / |
| OS Threads | Threads, or lightweight processes in an operating system. | / |
| Process Opened Fds | The current number of used file descriptors. | / |

设置警报
----

本指南以创建Milvus组件内存使用警报为例。如果要创建其他类型的警报，请相应地调整命令。如果在过程中遇到任何问题，请在[Milvus论坛](https://discuss.milvus.io/)或[Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ)上发起讨论。

### 先决条件

本教程假定您已安装和配置了Grafana。如果没有，我们建议先阅读[监控指南](monitor.md)。

### 1. 添加新的查询

To add an alert for the memory usage of Milvus components, edit the Memory panel. Then, add a new query with the metric: `process_resident_memory_bytes{app_kubernetes_io_name="milvus", app_kubernetes_io_instance=~"my-release", namespace="default"}`

[![Alert_metric](https://milvus.io/static/18103d1a30b5181fc6ee91800ea939f5/1263b/alert_metric.png "Add an alert.")](https://milvus.io/static/18103d1a30b5181fc6ee91800ea939f5/bbbf7/alert_metric.png)

Add an alert.

### 2. Save the dashboard

保存仪表板，并等待几分钟查看警报。

[![Alert_dashboard](https://milvus.io/static/fd5f1694aed3b5b5f29b639ad301a071/1263b/alert_dashboard.png "Save the dashboard.")](https://milvus.io/static/fd5f1694aed3b5b5f29b639ad301a071/bbbf7/alert_dashboard.png)

Save the dashboard.

Grafana警报查询不支持模板变量。因此，您应添加一个没有任何模板变量的标签的第二个查询。第二个查询默认名为“A”。您可以通过点击下拉菜单进行重命名。

[![Alert_query](https://milvus.io/static/6ff9d7104bae4f442d79066d22dc7993/1263b/alert_query.png "The newly added query.")](https://milvus.io/static/6ff9d7104bae4f442d79066d22dc7993/bbbf7/alert_query.png)

The newly added query.

### 3. 添加警报通知

To receive alert notifications, add a "notification channel". Then, specify the channel in the field "Send to".

[![Alert_notification](https://milvus.io/static/02677efc0008e03977429c0abd4838b0/1263b/alert_notification.png "Specify the notification channel.")](https://milvus.io/static/02677efc0008e03977429c0abd4838b0/1263b/alert_notification.png)

Specify the notification channel.

If the alert is successfully created and triggered, you will receive the notification as shown in the screenshot below.

[![Notification_message](https://milvus.io/static/cab0cbc6f6979e44d8a2c77c66e9cd9a/1263b/notification_message.png "The alert is created and triggered.")](https://milvus.io/static/cab0cbc6f6979e44d8a2c77c66e9cd9a/bbbf7/notification_message.png)

The alert is created and triggered.

To delete an alert, go to the "Alert" panel and click the delete button.

[![Delete_alert](https://milvus.io/static/1a45b6cde7981603fc5b983d3d88c3ef/1263b/delete_alert.png "Delete an alert.")](https://milvus.io/static/1a45b6cde7981603fc5b983d3d88c3ef/bbbf7/delete_alert.png)

Delete an alert.

What's next
-----------

* If you need to start monitoring services for Milvus:
	+ Read the [monitoring guide](monitor.md)
	+ Learn how to [visualize monitoring metrics](visualize.md)
* If you have created alerts for memory usage by Milvus components:
	+ Learn how to [allocate resources](allocate.md#standalone)
* If you are looking for information about how to scale a Milvus cluster:
	+ Learn [scale a Milvus cluster](scaleout.md)
