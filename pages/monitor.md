在Kubernetes上部署监控服务
==================

本主题介绍了如何使用Prometheus在Kubernetes上为Milvus集群部署监控服务。

Monitor metrics with Prometheus
-------------------------------

Metrics是指提供有关您的系统运行状态信息的指标。例如，使用指标，您可以了解Milvus中的数据节点消耗了多少内存或CPU资源。了解Milvus集群中组件的性能和状态使您了解更全面，从而做出更好的决策并及时调整资源分配。

通常，指标存储在时间序列数据库（TSDB）中，例如[Prometheus](https://prometheus.io/)，并且指标带有时间戳记录。在监视Milvus服务的情况下，您可以使用Prometheus从导出器设置的端点拉取数据。然后，Prometheus在`http://<component-host>:9091/metrics`导出每个Milvus组件的指标。

但是，对于一个组件可能有多个副本的情况，手动配置Prometheus会变得太复杂。因此，您可以使用[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)，这是一个扩展到Kubernetes的扩展，用于自动化和有效地管理Prometheus监视实例。使用Prometheus Operator可以省去手动添加指标目标和服务提供者的麻烦。

ServiceMonitor自定义资源定义（CRD）使您能够声明性地定义动态服务集的监视方式。它还允许使用标签选择器选择要使用所需配置监视的服务。使用Prometheus Operator，您可以引入约定以指定如何公开指标。根据您设置的约定，新服务可以自动发现，而无需手动重新配置。

下图说明了Prometheus的工作流程。

[![Prometheus_architecture](https://milvus.io/static/7cbbe2ab16b71ca69d405c889a90bdf6/1263b/prometheus_architecture.png "The Prometheus architecture.")](https://milvus.io/static/7cbbe2ab16b71ca69d405c889a90bdf6/f6a5a/prometheus_architecture.png)

The Prometheus architecture.

先决条件
----

本教程使用[kube-prometheus](https://github.com/prometheus-operator/kube-prometheus)来帮助您避免安装和手动配置每个监视和警报组件的麻烦。

Kube-prometheus收集Kubernetes清单，[Grafana](http://grafana.com/)仪表板和[Prometheus规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)，并结合文档和脚本。

在部署监视服务之前，您需要使用kube-prometheus清单目录中的配置创建监视堆栈。

```python
$ git clone https://github.com/prometheus-operator/kube-prometheus.git
$ cd # to the local path of the repo
$ kubectl create -f manifests/setup
$ until kubectl get servicemonitors --all-namespaces ; do date; sleep 1; echo ""; done
$ kubectl create -f manifests/

```

要删除堆栈，请运行`kubectl delete --ignore-not-found=true -f manifests/ -f manifests/setup`。

在Kubernetes上部署监视服务
------------------

### 1. 访问仪表板

你可以通过`http://localhost:9090`访问Prometheus，通过`http://localhost:3000`访问Grafana。

```python
$ kubectl --namespace monitoring port-forward svc/prometheus-k8s 9090
$ kubectl --namespace monitoring port-forward svc/grafana 3000

```

### 2. 启用ServiceMonitor

ServiceMonitor在Milvus Helm中不是默认启用的。在Kubernetes集群中安装Prometheus Operator后，可以通过添加参数`metrics.serviceMontior.enabled=true`来启用它。

```python
$ helm install my-release milvus/milvus --set metrics.serviceMonitor.enabled=true

```

安装完成后，使用`kubectl`检查ServiceMonitor资源。

```python
$ kubectl get servicemonitor

```

```python
NAME                           AGE
my-release-milvus              54s

```

下一步操作
-----

* 如果您已经为Milvus集群部署了监控服务，则可能还想学习以下内容：
	+ [在Grafana中可视化Milvus指标](visualize.md)
	+ [为Milvus服务创建警报](alert.md)
	+ 调整[资源分配](allocate.md)

* 如果您正在寻找有关如何扩展Milvus集群的信息：
	+ 学习[扩展Milvus集群](scaleout.md)

* 如果您有兴趣升级Milvus版本：
	+ 阅读[升级指南](upgrade.md)
