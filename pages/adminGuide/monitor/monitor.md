

# 在 Kubernetes 上部署监控服务

本主题描述如何使用 Prometheus 在 Kubernetes 上部署 Milvus 集群的监控服务。

## 使用 Prometheus 监控指标
指标是提供有关系统运行状态信息的指标。例如，通过指标，你可以了解 Milvus 中的数据节点消耗了多少内存或 CPU 资源。了解 Milvus 集群中组件的性能和状态让你了解情况，并因此能够做出更好的决策和及时进行资源分配调整。

通常，指标存储在时间序列数据库（TSDB）中，如 [Prometheus](https://prometheus.io/)，并且指标会带有时间戳记录。在监控 Milvus 服务的情况下，你可以使用 Prometheus 从导出器设置的端点拉取数据。然后，Prometheus 会在 `http://<组件主机>:9091/metrics` 导出每个 Milvus 组件的指标。

然而，你可能有一个组件的多个副本，这使得手动配置 Prometheus 过于复杂。因此，你可以使用 [Kubernetes 的 Prometheus Operator 扩展](https://github.com/prometheus-operator/prometheus-operator) 来自动和有效地管理 Prometheus 监控实例。使用 Prometheus Operator 可以避免手动添加指标目标和服务提供者的麻烦。

ServiceMonitor 自定义资源定义（CRD）允许你以声明的方式定义要监视的一组动态服务。它还允许使用标签选择器选择要使用所需配置监视的服务。通过 Prometheus Operator，你可以引入规范以指定如何公开指标。根据你设置的规范自动发现新的服务，无需手动重新配置。

以下图像说明了 Prometheus 的工作流程。

![Prometheus_architecture](/assets/prometheus_architecture.png "The Prometheus architecture.")

## 先决条件

本教程使用 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 来节省安装和手动配置每个监控和警报组件的麻烦。

kube-prometheus 通过文档和脚本收集 Kubernetes 清单、[Grafana](http://grafana.com/) 仪表板和 [Prometheus 规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)。

在部署监控服务之前，你需要使用 kube-prometheus 清单目录中的配置创建一个监控堆栈。

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
默认的 prometheus-k8s clusterrole 无法捕获 milvus 的指标，需要进行修补:
</div>

```bash
kubectl patch clusterrole prometheus-k8s --type=json -p='[{"op": "add", "path": "/rules/-", "value": {"apiGroups": [""], "resources": ["pods", "services", "endpoints"], "verbs": ["get", "watch", "list"]}}]'
```

要删除堆栈，请运行 `kubectl delete --ignore-not-found=true -f manifests/ -f manifests/setup`。

## 在 Kubernetes 上部署监控服务

### 1. 访问仪表板

将 Prometheus 服务转发到端口 `9090`，将 Grafana 服务转发到端口 `3000`。

```
$ kubectl --namespace monitoring --address 0.0.0.0 port-forward svc/prometheus-k8s 9090
$ kubectl --namespace monitoring --address 0.0.0.0 port-forward svc/grafana 3000
```

### 2. 启用 ServiceMonitor

默认情况下，Milvus Helm 未启用 ServiceMonitor。在 Kubernetes 集群中安装 Prometheus Operator 后，你可以通过添加参数 `metrics.serviceMonitor.enabled=true` 来启用它。

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

## 下一步操作


- 如果你已经为 Milvus 集群部署了监控服务，你可能还希望学习以下内容：
  - [在 Grafana 中可视化 Milvus 指标](/adminGuide/monitor/visualize.md)
  - [为 Milvus 服务创建警报](/adminGuide/monitor/alert.md)
  - 调整你的 [资源分配](/adminGuide/allocate.md)
- 如果你想了解如何扩展 Milvus 集群的信息：
  - 学习 [如何扩展 Milvus 集群](/adminGuide/scaleout.md)
- 如果你对升级 Milvus 版本感兴趣，
  - 阅读 [升级 Milvus 集群指南](/adminGuide/upgrade_milvus_cluster-operator.md) 和 [独立部署 Milvus 的升级指南](/adminGuide/upgrade_milvus_standalone-operator.md)。
