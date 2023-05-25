在Grafana中可视化Milvus指标
====================

本主题介绍如何使用Grafana可视化Milvus指标。

如[监控指南](monitor.md)所述，指标包含有用信息，例如特定Milvus组件使用了多少内存。监控指标可帮助您更好地了解Milvus的性能和运行状态，从而及时调整资源分配。

可视化是一种图表，显示资源使用情况随时间变化的情况，使您更容易快速查看和注意资源使用情况的变化，特别是在事件发生时。

本教程使用Grafana，一个开源的时间序列分析平台，来可视化部署在Kubernetes（K8s）上的Milvus集群的各种性能指标。

前提条件
----

* 您已经[在K8s上安装了Milvus集群](install_cluster-helm.md)。

* 在使用Grafana可视化指标之前，您需要[配置Prometheus](monitor.md)以监控和收集指标。如果设置成功，您可以通过`http://localhost:3000`访问Grafana。或者您也可以使用默认的Grafana `user:password` `admin:admin`访问Grafana。

使用Grafana可视化指标
--------------

### 1. 下载并导入仪表盘

从JSON文件下载并导入Milvus仪表板。

```python
wget https://raw.githubusercontent.com/milvus-io/milvus/2.2.0/deployments/monitor/grafana/milvus-dashboard.json

```

[![Download_and_import](https://milvus.io/static/ced62bc2eb07e9cbde6d1eb00c0fbd88/1263b/import_dashboard.png "Download and import dashboard.")](https://milvus.io/static/ced62bc2eb07e9cbde6d1eb00c0fbd88/bbbf7/import_dashboard.png)

Download and import dashboard.

### 2. 查看指标

选择要监视的 Milvus 实例。然后您就可以看到 Milvus 组件面板。

[![Select_instance](https://milvus.io/static/00a1238cd0f98b4337ea94777e8f4b46/1263b/grafana_select.png "Select an instance.")](https://milvus.io/static/00a1238cd0f98b4337ea94777e8f4b46/bbbf7/grafana_select.png)

Select an instance.

[![Grafana_panel](https://milvus.io/static/bb8fa0d4fce3c044cb540a7bc7ff4f11/1263b/grafana_panel.png "Milvus components panel.")](https://milvus.io/static/bb8fa0d4fce3c044cb540a7bc7ff4f11/bbbf7/grafana_panel.png)

Milvus components panel.

接下来是什么
------

* 如果您已将Grafana设置为可视化Milvus指标，您可能还想要：
	+ 了解如何[为Milvus服务创建警报](alert.md)
	+ 调整[资源分配](allocate.md)
	+ [扩展或缩小Milvus集群](scaleout.md)

* 如果您有兴趣升级Milvus版本，
	+ 请阅读[升级指南](upgrade.md)
