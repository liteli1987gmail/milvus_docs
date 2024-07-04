

# 在 Grafana 中可视化 Milvus 指标

这个主题描述了如何使用 Grafana 来可视化 Milvus 的指标。

如 [监控指南](/adminGuide/monitor/monitor.md) 中所述，指标包含有关特定 Milvus 组件使用多少内存等有用信息。监控指标可以帮助你更好地了解 Milvus 的性能和运行状态，以便你及时调整资源分配。

可视化是一个图表，显示资源使用情况随时间的变化，这样当事件发生时，你可以更快地看到和注意资源使用情况的变化。

本教程使用 Grafana，一个用于时序分析的开源平台，来可视化在 Kubernetes（K8s）上部署的 Milvus 集群的各种性能指标。

## 先决条件
- 你已经在 K8s 上 [安装了一个 Milvus 集群](/getstarted/cluster/install_cluster-helm.md)。
- 在使用 Grafana 可视化指标之前，你需要 [配置 Prometheus](/adminGuide/monitor/monitor.md) 来监视和收集指标。如果设置成功，你可以在 `http://localhost:3000` 访问 Grafana。你也可以使用默认的 Grafana `user:password`，即 `admin:admin` 来访问 Grafana。

## 使用 Grafana 可视化指标

### 1. 下载和导入仪表盘

从 JSON 文件中下载并导入 Milvus 仪表板。

```
wget https://raw.githubusercontent.com/milvus-io/milvus/2.2.0/deployments/monitor/grafana/milvus-dashboard.json
```

![Download_and_import](/assets/import_dashboard.png "下载和导入仪表盘")

### 2. 查看指标

选择要监视的 Milvus 实例。然后，你可以看到 Milvus 组件面板。


![Select_instance](/assets/grafana_select.png "选择一个实例")

![Grafana_panel](/assets/grafana_panel.png "Milvus组件面板")


## 下一步操作



- 如果你已经设置了 Grafana 来可视化 Milvus 的指标，你可能还希望：
  - 学习如何 [为 Milvus 服务创建警报](/adminGuide/monitor/alert.md)
  - 调整你的 [资源分配](/adminGuide/allocate.md)
  - [扩展或收缩 Milvus 集群](/adminGuide/scaleout.md)
- 如果你有兴趣升级 Milvus 版本，
  - 阅读 [升级 Milvus 集群指南](/adminGuide/upgrade_milvus_cluster-operator.md) 和 [独立升级 Milvus 指南](/adminGuide/upgrade_milvus_standalone-operator.md)。

