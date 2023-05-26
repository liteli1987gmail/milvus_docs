Milvus 2.2.0的基准测试
===


本报告展示了Milvus 2.2.0的主要测试结果。旨在提供Milvus 2.2.0的搜索性能图片，特别是在可扩展性方面。 

![](https://zilliz.com/images/whitepaper/performance.png)

我们最近对Milvus 2.2.3进行了基准测试，并获得了以下主要发现：

* 搜索延迟降低了2.5倍
* QPS增加了4.5倍
* 十亿级别相似度搜索性能微弱下降
* 使用多个副本时呈线性可伸缩性

详情请参考[此白皮书](https://zilliz.com/whitepaper)和[相关基准测试代码](https://github.com/zilliztech/vectordb-benchmark)。

总结
-------

* 与Milvus 2.1相比，在群集模式下，Milvus 2.2.0的QPS增加了48％以上，在独立模式下增加了75％以上。
* Milvus 2.2.0具有令人印象深刻的扩展和扩展能力:
	+ 将CPU核心从8个扩展到32个时，QPS线性增加。
	+ 将Querynode副本从1个扩展到8个时，QPS线性增加。

术语
--


| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `metric` | 用于计算的度量类型。 | 对于浮点向量：* `L2` (欧几里得距离)  * `IP` (内积) |

 
点此查看测试所使用术语的详细信息

| 术语 | 描述 |
| --- | --- |
| nq | 在一个搜索请求中要搜索的向量的数量 |
| topk | 在一个搜索请求中为每个向量（在nq内）检索的最近向量的数量 |
| ef | 一个特定于[HNSW索引](https://milvus.io/docs/v2.2.x/index.md)的搜索参数 |
| RT | 从发送请求到接收响应所需的响应时间 |
| QPS | 每秒成功处理的搜索请求数 |

测试环境
----------------

所有测试都是在以下环境下进行的。

### 硬件环境

| Hardware | Specification |
| --- | --- |
| CPU | Intel(R) Xeon(R) Gold 6226R CPU @ 2.90GHz |
| Memory | 16*32 GB RDIMM, 3200 MT/s |
| SSD | SATA 6 Gbps |

### Software environment

| Software | Version |
| --- | --- |
| Milvus | v2.2.0 |
| Milvus GO SDK | v2.2.0 |

### 部署方案

* Milvus实例（独立或集群）通过[Helm](https://milvus.io/docs/install_standalone-helm.md)在支持物理或虚拟机的Kubernetes集群上部署。
* 不同的测试仅在CPU核心数、内存大小和副本数（Worker节点数）方面有所变化，仅适用于Milvus集群。
* 未指定的配置与[默认配置](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml)相同。

* Milvus 依赖项（MinIO、Pulsar 和 Etcd）在每个节点的本地 SSD 上存储数据。

* 通过[Milvus GO SDK](https://github.com/milvus-io/milvus-sdk-go/tree/master/tests)将搜索请求发送到 Milvus 实例。

### 数据集

测试使用[ANN-Benchmarks](https://github.com/erikbern/ann-benchmarks/#data-sets)开源数据集SIFT（128维度）。

测试流程
-------------

1. 使用相应的服务器配置通过Helm启动Milvus实例。
2. 通过Milvus GO SDK连接至Milvus实例并获取相应的测试结果。
3. 创建一个集合。
4. 插入100万个SIFT向量。使用HNSW索引并将索引参数配置为将 `M` 设为 `8`，将 `efConstruction` 设为 `200`。
5. 加载该集合。
6. 以不同的并发数和搜索参数 `nq=1, topk=1, ef=64` 进行搜索，每次并发的持续时间至少为1小时。

测试结果
------------

### Milvus 2.2.0 与 Milvus 2.1.0

#### 聚类

**服务器配置（集群）**

```bash
queryNode:
  replicas: 1
  resources:
    limits:
      cpu: "12.0"
      memory: 8Gi
    requests:
      cpu: "12.0"
      memory: 8Gi

```

**搜索性能**

| Milvus | QPS | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| --- | --- | --- | --- | --- |
| 2.1.0 | 6904 | 59 | 28 | 0 |
| 2.2.0 | 10248 | 63 | 24 | 0 |

![Cluster search performance](https://milvus.io/static/552ccaa600781ffb7dd07c163c606417/1263b/cluster_search_performance_210_vs_220.png "Cluster search performance")

#### 单机版

**服务器配置（独立版本）**

```bash
standalone:
  replicas: 1
  resources:
    limits:
      cpu: "12.0"
      memory: 16Gi
    requests:
      cpu: "12.0"
      memory: 16Gi

```

**Search performance**

| Milvus | QPS | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| --- | --- | --- | --- | --- |
| 2.1.0 | 4287 | 104 | 76 | 0 |
| 2.2.0 | 7522 | 127 | 79 | 0 |

![Standalone search performance](https://milvus.io/static/c86c4caa2b4d7bef797710798d091a12/1263b/standalone_search_performance_210_vs_220.png "Standalone search performance")

### Milvus 2.2.0 Scale-up

扩展一个Querynode的CPU核心，以检查其扩展能力。

**Server configurations (cluster)**

```bash
queryNode:
 replicas: 1
 resources:
   limits:
     cpu: "8.0" /"12.0" /"16.0" /"32.0"
     memory: 8Gi
   requests:
     cpu: "8.0" /"12.0" /"16.0" /"32.0"
     memory: 8Gi

```

**搜索性能**

| CPU cores | Concurrent Number | QPS | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| --- | --- | --- | --- | --- | --- |
| 8 | 500 | 7153 | 127 | 83 | 0 |
| 12 | 300 | 10248 | 63 | 24 | 0 |
| 16 | 600 | 14135 | 85 | 42 | 0 |
| 32 | 600 | 20281 | 63 | 28 | 0 |

![Search performance by Querynode CPU cores](https://milvus.io/static/7bbd3012494497881b242c2d59af3708/1263b/search_performance_by_querynode_cpu_cores.png "Search performance by Querynode CPU cores")

### Milvus 2.2.0 横向扩展

增加更多查询节点的副本以检查水平扩展的能力。

注意：加载集合时，查询节点的数量等于`replica_number`。

**服务器配置（集群）**
```bash
queryNode:
  replicas: 1 / 2 / 4 / 8      
  resources:
    limits:
      cpu: "8.0"
      memory: 8Gi
    requests:
      cpu: "8.0"
      memory: 8Gi

```

| Replicas | Concurrent Number | QPS | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| --- | --- | --- | --- | --- | --- |
| 1 | 500 | 7153 | 127 | 83 | 0 |
| 2 | 500 | 15903 | 105 | 27 | 0 |
| 4 | 800 | 19281 | 109 | 40 | 0 |
| 8 | 1200 | 30655 | 93 | 38 | 0 |

![Search performance by Querynode replicas](https://milvus.io/static/4ead6114239567f61cee372e67f9976c/1263b/search_performance_by_querynode_replicas.png "Search performance by Querynode replicas")

接下来的步骤
-----------

* 参考[本指南](https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md)，尝试使用Milvus 2.2和Pymilvus 2.2进行性能基准测试。
