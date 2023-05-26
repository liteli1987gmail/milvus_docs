Milvus 监控框架概述
=============

本主题介绍 Milvus 如何使用 Prometheus 监控指标以及使用 Grafana 可视化指标和创建警报。

Prometheus in Milvus
--------------------

[Prometheus](https://prometheus.io/docs/introduction/overview/) 是一个用于 Kubernetes 实现的开源监控和警报工具包。它将指标作为时间序列数据进行收集和存储。这意味着在记录时，指标会带有时间戳，并附带可选的键值对标签。

目前 Milvus 使用了 Prometheus 的以下组件：

* 从由出口器设置的端点中提取数据的Prometheus端点。

* Prometheus操作员，有效地管理Prometheus监控实例。

* Kube-prometheus，提供易于操作的端到端Kubernetes集群监控。

### 指标名称

Prometheus中的有效指标名称包含三个元素：名称空间、子系统和名称。这三个元素用“_”连接。

Prometheus监控的Milvus指标的命名空间是“milvus”。根据指标所属的角色，其子系统应该是以下八个角色之一：“rootcoord”，“proxy”，“querycoord”，“querynode”，“indexcoord”，“indexnode”，“datacoord”，“datanode”。

例如，计算查询向量总数的Milvus指标名为`milvus_proxy_search_vectors_count`。

### 指标类型

Prometheus支持四种指标类型：

* 计数器：一种累积指标类型，其值只能增加或在重新启动时重置为零。

* Gauge: 一种指标类型，其值可以上升也可以下降。

* Histogram: 一种指标类型，根据可配置的桶进行计数。一个常见的例子是请求持续时间。

* Summary: 一种指标类型，类似于直方图，可以在滑动时间窗口上计算可配置的分位数。

### Metric labels

Prometheus通过标签来区分具有相同指标名称的样本。 标签是指标的某些属性。 同名指标必须对`variable_labels`字段具有相同的值。 以下表格列出了Milvus指标常见标签的名称和含义。


| 标签名称 | 定义 | 值 |
| --- | --- | --- |
| `node_id` | 角色的唯一标识符 | Milvus 生成的全局唯一 ID |
| `status` | 已处理操作或请求的状态 | `"abandon"`、`"success"` 或 `"fail"` |
| `query_type` | 读取请求的类型 | `"search"` 或 `"query"` |
| `msg_type` | 消息的类型 | `"insert"`、`"delete"`、`"search"` 或 `"query"` |
| `segment_state` | 段的状态 | `"Sealed"`、`"Growing"`、`"Flushed"`、`"Flushing"`、`"Dropped"` 或 `"Importing"` |
| `cache_state` | 缓存对象的状态 | `"hit"` 或 `"miss"` |
| `cache_name` | 缓存对象的名称。该标签与 `cache_state` 标签一起使用 | 例如 `"CollectionID"`、`"Schema"` 等 |
| `channel_name` | 消息存储中的物理主题（Pulsar 或 Kafka） | 例如 `"by-dev-rootcoord-dml_0"`、`"by-dev-rootcoord-dml_255"` 等 |
| `function_name` | 处理某些请求的函数的名称 | 例如 `"CreateCollection"`、`"CreatePartition"`、`"CreateIndex"` 等 |
| `user_name` | 用于身份验证的用户名 | 您自己选择的用户名 |
| `index_task_status` | 元数据存储中索引任务的状态 | `"unissued"`、`"in-progress"`、`"failed"`、`"finished"` 或 `"recycled"` |

Milvus中的Grafana
---------------

[Grafana](https://grafana.com/docs/grafana/latest/introduction/)是一个开源的可视化堆栈，可以连接所有数据源。通过提取指标，它帮助用户理解、分析和监控大规模数据。

Milvus使用Grafana的可定制仪表板进行指标可视化。

接下来是什么
------

在了解监控和报警的基本工作流程之后，请学习：

* [部署监控服务](monitor.md)

* [可视化Milvus指标](visualize.md)

* [创建警报](alert.md)
