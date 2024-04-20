---
title: Milvus 指标仪表板

---

# Milvus 指标仪表板

Milvus 在运行时输出了一系列详细的时序指标。您可以使用 [Prometheus](https://https://prometheus.io/) 和 [Grafana](https://grafana.com/) 来可视化这些指标。本文介绍在 Grafana Milvus 仪表板中显示的监控指标。

本文中的时间单位是毫秒。而“99 百分位数”指的是在一定值内控制了 99% 的时间统计数据。

我们建议先阅读 [Milvus 监控框架概览](monitor_overview.md) 来了解 Prometheus 指标。

<details><summary>代理</summary>

| 面板 | 面板描述 | Prometheus 查询语言 (PromQL) | 使用的 Milvus 指标 | Milvus 指标描述 |
|---|---|---|---|---|
| 搜索向量计数率 | 过去两分钟内每个代理每秒查询的平均向量数。 | ``` sum(increase(milvus_proxy_search_vectors_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])/120) by (pod, node_id) ``` | `milvus_proxy_search_vectors_count` | 查询的向量累积数量。 |
| 插入向量计数率 | 过去两分钟内每个代理每秒插入的平均向量数。 | ``` sum(increase(milvus_proxy_insert_vectors_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])/120) by (pod, node_id) ``` | `milvus_proxy_insert_vectors_count` | 插入的向量累积数量。 |
| 搜索延迟 | 过去两分钟内每个代理接收搜索和查询请求的平均延迟和 99 百分位数延迟。 | p99:  <br/>  ``` histogram_quantile(0.99, sum by (le, query_type, pod, node_id) (rate(milvus_proxy_sq_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m]))) ```  <br/>  avg:  <br/>  ``` sum(increase(milvus_proxy_sq_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by (pod, node_id, query_type) / sum(increase(milvus_proxy_sq_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by (pod, node_id, query_type) ``` | `milvus_proxy_sq_latency` | 搜索和查询请求的延迟。 |
| 集合搜索延迟 | 过去两分钟内每个代理接收特定集合的搜索和查询请求的平均延迟和 99 百分位数延迟。 | p99: <br/> ```histogram_quantile(0.99, sum by (le, query_type, pod, node_id) (rate(milvus_proxy_collection_sq_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace", collection_name=~"$collection"}[2m])))``` <br/> avg: <br/> ```sum(increase(milvus_proxy_collection_sq_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace", collection_name=~"$collection"}[2m])) by (pod, node_id, query_type) / sum(increase(milvus_proxy_collection_sq_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace", collection_name=~"$collection"}[2m])) by (pod, node_id, query_type)``` | `milvus_proxy_collection_sq_latency_sum` | 特定集合的搜索和查询请求的延迟 |
| 变异延迟 | 过去两分钟内每个代理接收变异请求的平均延迟和 99 百分位数延迟。 | p99: <br/> ```histogram_quantile(0.99, sum by (le, msg_type, pod, node_id) (rate(milvus_proxy_mutation_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))``` <br/> avg: <br/> ```sum(increase(milvus_proxy_mutation_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"