---
id: visualize.md
title: 可视化指标
related_key: 监控，警报
summary: 学习如何在 Grafana 中可视化 Milvus 指标。
---

# 在 Grafana 中可视化 Milvus 指标

本主题描述了如何使用 Grafana 可视化 Milvus 指标。

如[监控指南](monitor.md)所述，指标包含了有用的信息，例如特定 Milvus 组件使用的内存量。监控指标有助于您更好地了解 Milvus 性能及其运行状态，以便您及时调整资源分配。

可视化是显示资源使用量随时间变化的图表，这使您更容易快速查看和注意到资源使用量的变化，特别是当事件发生时。

本教程使用 Grafana，这是一个用于时序分析的开源平台，来可视化在 Kubernetes (K8s) 上部署的 Milvus 集群的各种性能指标。

## 先决条件

- 您已经[在 K8s 上安装了 Milvus 集群](install_cluster-helm.md)。
- 在使用 Grafana 可视化指标之前，您需要[配置 Prometheus](monitor.md) 来监控和收集指标。如果设置成功，您可以在 `http://localhost:3000` 访问 Grafana。或者，您也可以使用 Grafana 默认的 `用户名：密码` `admin:admin` 来访问 Grafana。

## 使用 Grafana 可视化指标

### 1. 下载并导入仪表板

下载并从 JSON 文件导入 Milvus 仪表板。

```
wget https://raw.githubusercontent.com/milvus-io/milvus/2.2.0/deployments/monitor/grafana/milvus-dashboard.json
```

![Download_and_import](/public/assets/import_dashboard.png "下载并导入仪表板。")

### 2. 查看指标

选择您想要监控的 Milvus 实例。然后，您可以看到 Milvus 组件面板。

![Select_instance](/public/assets/grafana_select.png "选择一个实例。")

![Grafana_panel](/public/assets/grafana_panel.png "Milvus 组件面板。")

## 接下来做什么

- 如果您已经设置 Grafana 来可视化 Milvus 指标，您可能还想要：
  - 学习如何[为 Milvus 服务创建警报](alert.md)
  - 调整您的[资源分配](allocate.md)
  - [扩展或缩减 Milvus 集群](scaleout.md)
- 如果您对升级 Milvus 版本感兴趣，
  - 阅读[Milvus 集群升级指南](upgrade_milvus_cluster-operator.md)和[Milvus 独立升级指南](upgrade_milvus_standalone-operator.md)。
