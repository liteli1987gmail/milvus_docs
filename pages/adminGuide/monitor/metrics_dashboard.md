
# Milvus 度量仪表盘

Milvus 在运行时输出一系列详细的时间序列度量指标。你可以使用 [Prometheus](https://prometheus.io/) 和 [Grafana](https://grafana.com/) 来可视化这些度量指标。本主题介绍了 Grafana Milvus 仪表盘中显示的监控指标。



本主题中的时间单位为毫秒。本主题中的“99th 百分位数”表示统计数据的 99%的时间都在某个特定值范围内。

我们建议先阅读 [Milvus 监控框架概述](/adminGuide/monitor/monitor_overview.md) 以了解 Prometheus 指标。

<details> <summary> 代理 </summary>

| 面板                             | 面板描述                                                               | PromQL（Prometheus 查询语言）                                                                                                                                  | 使用的 Milvus 度量指标                 | Milvus 度量指标描述                                          |
|---------------------------------|------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|-------------------------------------------------------------|
| 搜索向量计数速率                  | 每个代理在过去两分钟内每秒查询的平均向量数量                                | ```sum(increase(milvus_proxy_search_vectors_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])/120) by (pod, node_id)```                 | `milvus_proxy_search_vectors_count`      | 查询的向量数量                                              |
| 插入向量计数速率                  | 每个代理在过去两分钟内每秒插入的平均向量数量                                | ``` sum(increase(milvus_proxy_insert_vectors_count{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])/120) by (pod, node_id)```                 | `milvus_proxy_insert_vectors_count`      | 插入的向量数量                                              |
| 搜索延迟                         | 每个代理在过去两分钟内接收搜索和查询请求的平均延迟和 99th 百分位数                    | p99：<br/> ```histogram_quantile(0.99, sum by (le, query_type, pod, node_id) (rate(milvus_proxy_sq_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))```<br/>avg：<br/>```sum(increase(milvus_proxy_sq_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by (pod, node_id, query_type) / sum(increase(milvus_proxy_sq_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by (pod, node_id, query_type)```                     | `milvus_proxy_sq_latency`   | 搜索和查询请求的延迟                                             |
| 集合搜索延迟                     | 每个代理在过去两分钟内接收特定集合搜索和查询请求的平均延迟和99th百分位数             | p99：<br/>``` histogram_quantile(0.99, sum by (le, query_type, pod, node_id) (rate(milvus_proxy_collection_sq_latency_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace", collection_name=~"$ collection"}[2m])))```<br/>avg：<br/>```sum(increase(milvus_proxy_collection_sq_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace", collection_name=~"$collection"}[2m])) by (pod, node_id, query_type) / sum(increase(milvus_proxy_collection_sq_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace", collection_name=~"$collection"}[2m])) by (pod, node_id, query_type)```    | `milvus_proxy_collection_sq_latency_sum` | 特定集合的搜索和查询请求的延迟                                     |
| 变异延迟                         | 每个代理在过去两分钟内接收变异请求的平均延迟和99th百分位数                     | p99：<br/>``` histogram_quantile(0.99, sum by (le, msg_type, pod, node_id) (rate(milvus_proxy_mutation_latency_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])))```<br/>avg：<br/>```sum(increase(milvus_proxy_mutation_latency_sum{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by (pod, node_id, msg_type) / sum(increase(milvus_proxy_mutation_latency_count{app_kubern...



# Search in Queue Latency
过去两分钟内搜索和查询请求在队列中的平均延迟和第 99 个百分位延迟。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id, query_type) (rate(milvus_querynode_sq_queue_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))
```

avg:
```
sum(increase(milvus_querynode_sq_queue_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type) / sum(increase(milvus_querynode_sq_queue_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type)
```

`milvus_querynode_sq_queue_latency`: 查询节点收到的搜索和查询请求的延迟。

# Search Segment Latency
过去两分钟内每个查询节点搜索和查询段所需时间的平均延迟和第 99 个百分位延迟。

状态为 sealed 或 growing 的段。

p99:
```
histogram_quantile(0.99, sum by (le, query_type, segment_state, pod, node_id) (rate(milvus_querynode_sq_segment_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))
```

avg:
```
sum(increase(milvus_querynode_sq_segment_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type, segment_state) / sum(increase(milvus_querynode_sq_segment_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type, segment_state)
```

`milvus_querynode_sq_segment_latency`: 每个查询节点搜索和查询每个段所需的时间。

# Segcore Request Latency
过去两分钟内每个查询节点在 segcore 中搜索和查询所需时间的平均延迟和第 99 个百分位延迟。

p99:
```
histogram_quantile(0.99, sum by (le, query_type, pod, node_id) (rate(milvus_querynode_sq_core_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))
```

avg:
```
sum(increase(milvus_querynode_sq_core_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type) / sum(increase(milvus_querynode_sq_core_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type)
```

`milvus_querynode_sq_core_latency`: 每个查询节点在 segcore 中进行搜索和查询所需的时间。

# Search Reduce Latency
过去两分钟内每个查询节点在搜索或查询的 reduce 阶段所需时间的平均延迟和第 99 个百分位延迟。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id, query_type) (rate(milvus_querynode_sq_reduce_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))
```

avg:
```
sum(increase(milvus_querynode_sq_reduce_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type) / sum(increase(milvus_querynode_sq_reduce_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id, query_type)
```

`milvus_querynode_sq_reduce_latency`: 每个查询所花费的 reduce 阶段的时间。

# Load Segment Latency
过去两分钟内每个查询节点加载段所需时间的平均延迟和第 99 个百分位延迟。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_load_segment_latency_bucket{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])))
```

avg:
```
sum(increase(milvus_querynode_load_segment_latency_sum{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_load_segment_latency_count{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 每个查询节点加载段所需时间。

# Flowgraph Num
每个查询节点中的流程图数量。

```sum(milvus_querynode_flowgraph_num{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}) by (pod, node_id)```

`milvus_querynode_flowgraph_num`: 每个查询节点中的流程图数量。

# Unsolved Read Task Length
每个查询节点中未解决的读请求队列长度。

``` sum(milvus_querynode_read_task_unsolved_len{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}) by (pod, node_id)```

`milvus_querynode_read_task_unsolved_len`: 未解决的读请求队列长度。

# Ready Read Task Length
每个查询节点中待执行的读请求队列长度。

```sum(milvus_querynode_read_task_ready_len{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}) by (pod, node_id)```

`milvus_querynode_read_task_ready_len`: 待执行的读请求队列长度。

# Parallel Read Task Num
每个查询节点目前正在执行的并发读请求数量。

``` sum(milvus_querynode_read_task_concurrency{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}) by (pod, node_id)```

`milvus_querynode_read_task_concurrency`: 目前正在执行的并发读请求数量。

# Estimate CPU Usage
由调度器估计的每个查询节点的 CPU 使用率。

```sum(milvus_querynode_estimate_cpu_usage{app_kubernetes_io_instance=~"$instance", app_kubernetes_io_name="$app_name", namespace="$namespace"}) by (pod, node_id)```

`milvus_querynode_estimate_cpu_usage`: 调度器估计的每个查询节点的CPU使用率。

当值为100时，表示使用了一个完整的虚拟CPU（vCPU）。

# Search Group Size
过去两分钟内每个查询节点执行的组合搜索请求中的平均搜索组大小和第99个百分位搜索组大小。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_search_group_size_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])))
```

avg:
```
sum(increase(milvus_querynode_search_group_size_sum{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_search_group_size_count{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 组合搜索任务中不同桶中的原始搜索任务数量（即搜索组大小）。

# Search NQ
每个查询节点在执行搜索请求时平均搜索的查询（NQ）数量和第99个百分位搜索的查询（NQ）数量。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_search_group_size_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])))
```

avg:
```
sum(increase(milvus_querynode_search_group_size_sum{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_search_group_size_count{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 搜索请求的查询（NQ）数量。

# Search Group NQ
过去两分钟内每个查询节点执行的组合搜索请求中的查询（NQ）数量的平均值和第99个百分位。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_search_group_nq_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])))
```

avg:
```
sum(increase(milvus_querynode_search_group_nq_sum{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_search_group_nq_count{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 不同桶组合的搜索请求的查询（NQ）数量。

# Search Top_K
每个查询节点在过去两分钟内执行的搜索请求的平均Top_K和第99个百分位Top_K。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_search_topk_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])))
```

avg:
```
sum(increase(milvus_querynode_search_topk_sum{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_search_topk_count{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 搜索请求的Top_K。

# Search Group Top_K
过去两分钟内每个查询节点执行的组合搜索请求中的Top_K的平均值和第99个百分位。

p99:
```
histogram_quantile(0.99, sum by (le, pod, node_id) (rate(milvus_querynode_search_group_topk_bucket{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])))
```

avg:
```
sum(increase(milvus_querynode_search_group_topk_sum{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace = "$namespace"}[2m])) by(pod, node_id) / sum(increase(milvus_querynode_search_group_topk_count{app_kubernetes_io_instance=~"$ instance", app_kubernetes_io_name = "$app_name", namespace="$ namespace"}[2m])) by(pod, node_id)
```

`milvus_querynode_load_segment_latency_bucket`: 不同桶组合的搜索请求的Top_K。

# Evicted Read Requests Rate
每个查询节点每秒因流量限制而被驱逐的读请求数量。

``` sum(increase(milvus_querynode_read_evicted_count{app_kubernetes_io_instance =~"$instance", app_kubernetes_io_name="$ app_name", namespace ="$namespace "}[2m])/120) by (pod, node_id)```

`milvus_querynode_sq_req_count`: 查询节点由于流量限制而驱逐的读请求累积数量。

