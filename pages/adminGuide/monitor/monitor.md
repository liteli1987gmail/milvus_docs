---

id: monitor.md
title: 部署监控服务
related_key: monitor, alert
summary: 学习如何使用 Prometheus 在 Kubernetes 上为 Milvus 集群部署监控服务。

---

# 在 Kubernetes 上部署监控服务

本主题描述了如何使用 Prometheus 在 Kubernetes 上为 Milvus 集群部署监控服务。

## 使用 Prometheus 监控指标
指标是提供系统运行状态信息的指标。例如，通过指标，您可以了解 Milvus 中的数据节点消耗了多少内存或 CPU 资源。了解 Milvus 集群中组件的性能和状态可以使您更好地了解情况，从而做出更好的决策，并更及时地调整资源分配。

通常，指标存储在时序数据库（TSDB）中，如 [Prometheus](https://prometheus.io/)，并且指标会带有时间戳。在监控 Milvus 服务的情况下，您可以使用 Prometheus 从由导出器设置的端点拉取数据。然后，Prometheus 会在 `http://<component-host>:9091/metrics` 导出每个 Milvus 组件的指标。

然而，您可能对一个组件有多个副本，这使得手动配置 Prometheus 过于复杂。因此，您可以使用 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)，这是 Kubernetes 的一个扩展，用于自动和有效地管理 Prometheus 监控实例。使用 Prometheus Operator 可以节省您手动添加指标目标和服务提供商的麻烦。

ServiceMonitor 自定义资源定义（CRD）使您能够声明性地定义如何监控一组动态服务。它还允许使用标签选择来选择要监控的服务以及所需的配置。使用 Prometheus Operator，您可以引入指定如何公开指标的约定。新的服务可以自动发现，遵循您设定的约定，无需手动重新配置。

下图说明了 Prometheus 工作流程。

![Prometheus_architecture](..//prometheus_architecture.png "Prometheus 架构。")

## 前提条件

本教程使用 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 来节省您安装和手动配置每个监控和警报组件的麻烦。

Kube-prometheus 收集 Kubernetes 清单、[Grafana](http://grafana.com/) 仪表板和 [Prometheus 规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)，结合文档和脚本。

在部署监控服务之前，您需要使用 kube-prometheus 清单目录中的配置创建一个监控栈。

```
$ git clone https://github.com/prometheus-operator/kube-prometheus.git
$ cd kube-prometheus
$ kubectl apply --server-side -f manifests/setup
$ kubectl wait \
        --for condition=Established \
        --all CustomResourceDefinition \
        --namespace=monitoring
$ kubectl apply -f manifests/
```

<div class="alert note">
默认的 prometheus-k8s clusterrole 无法捕获 Milvus 的指标，需要修补：
</div>

```bash
kubectl patch clusterrole prometheus-k8s --type=json -p='[{"op": "add", "path": "/rules/-", "value": {"apiGroups": [""], "resources": ["pods", "services", "endpoints"], "verbs": ["get", "watch", "list"]}}]'
```

要删除栈，请运行 `kubectl delete --ignore-not-found=true -f manifests/ -f manifests/setup`。

## 在 Kubernetes 上部署监控服务

### 1. 访问仪表板

将 Prometheus 服务转发到端口 `9090`，将 Grafana 服务转发到端口 `3000`。

```
$ kubectl --namespace monitoring --address 0.0.0.0 port-forward svc/prometheus-k8s 9090
$ kubectl --namespace monitoring --address 0.0.0.0 port-forward svc/grafana 3000
```

### 2. 启用 ServiceMonitor

ServiceMonitor 默认未在 Milvus Helm 中启用。在 Kubernetes 集群中安装 Prometheus Operator 后，您可以通过添加参数 `metrics.serviceMontior.enabled=true` 来启用它。

```
$ helm upgrade my-release milvus/milvus --set metrics.serviceMonitor.enabled=true --reuse-values
```

安装完成后，使用 `kubectl` 检查 ServiceMonitor 资源。

```
$ kubectl get servicemonitor
```
```
NAME                           AGE
my-release-milvus              54s
```

## 接下来做什么

- 如果您已经为 Milvus 集群部署了监控服务，您可能还想了解如何：
  - [在 Grafana 中可视化 Milvus 指标](visualize.md)
  - [为 Milvus 服务创建警报](alert.md)
  - 调整您的 [资源分配