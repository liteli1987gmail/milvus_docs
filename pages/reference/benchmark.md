---
id: benchmark.md
summary: Learn about the benchmark result of Milvus.
title: Milvus 2.2 Benchmark Test Report
---

# Milvus 2.2 基准测试报告

本报告展示了 Milvus 2.2.0 的主要测试结果。它旨在提供 Milvus 2.2.0 搜索性能的概览，特别是在扩展能力和扩展性能方面。

<div class="alert note">
  <div style="display: flex;">
      <div style="flex:0.3;">
      <img src="https://zilliz.com/images/whitepaper/performance.png">
  </div>
  <div style="flex:1; padding: 10px; ">
    <p>我们最近对 Milvus 2.2.3 进行了基准测试，并得出以下关键发现：</p>
    <ul>
      <li>搜索延迟减少了 2.5 倍</li>
      <li>QPS 增加了 4.5 倍</li>
      <li>十亿规模的相似性搜索性能下降很小</li>
      <li>使用多个副本时的线性可扩展性</li>
    </ul>
    <p>详情请参考 <a href="https://zilliz.com/resources/whitepaper/milvus-performance-benchmark">这篇白皮书</a> 和 <a href="https://github.com/zilliztech/VectorDBBench">相关的基准测试代码</a>。 </p>
  </div>
</div>

## 摘要

- 与 Milvus 2.1 相比，Milvus 2.2.0 在集群模式下的 QPS 提高了超过 48%，在独立模式下提高了超过 75%。
- Milvus 2.2.0 具有令人印象深刻的扩展能力和扩展性能：
  - 当 CPU 核心数从 8 扩展到 32 时，QPS 线性增加。
  - 当查询节点副本从 1 扩展到 8 时，QPS 线性增加。

## 术语

<details>
    <summary>点击查看测试中使用的术语的详细信息</summary>
    <table class="terminology">
        <thead>
            <tr>
                <th>术语</th>
                <th>描述</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>nq</td>
                <td>一次搜索请求中要搜索的向量数量</td>
            </tr>
            <tr>
                <td>topk</td>
                <td>每个向量（在 nq 中）在搜索请求中要检索的最近邻向量数量</td>
            </tr>
            <tr>
                <td>ef</td>
                <td>特定于 <a href="https://milvus.io/docs/v2.2.x/index.md">HNSW 索引</a> 的搜索参数</td>
            </tr>
            <tr>
                <td>RT</td>
                <td>从发送请求到接收响应的响应时间</td>
            </tr>
            <tr>
                <td>QPS</td>
                <td>每秒成功处理的搜索请求数量</td>
            </tr>
        </tbody>
    </table>
</details>

## 测试环境

所有测试都在以下环境中执行。

### 硬件环境

| 硬件 | 规格                                      |
| ---- | ----------------------------------------- |
| CPU  | Intel(R) Xeon(R) Gold 6226R CPU @ 2.90GHz |
| 内存 | 16\*\*32 GB RDIMM, 3200 MT/s              |
| SSD  | SATA 6 Gbps                               |

### 软件环境

| 软件          | 版本   |
| ------------- | ------ |
| Milvus        | v2.2.0 |
| Milvus GO SDK | v2.2.0 |

### 部署方案

- Milvus 实例（独立或集群）通过 [Helm](https://milvus.io/docs/install_standalone-helm.md) 在基于物理或虚拟机的 Kubernetes 集群上部署。
- 不同的测试仅在 CPU 核心数、内存大小和副本（工作节点）数量上有所不同，这只适用于 Milvus 集群。
- 未指定的配置与 [默认配置](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml) 相同。
- Milvus 依赖项（MinIO、Pulsar 和 Etcd）在每个节点的本地 SSD 上存储数据。
- 通过 [Milvus GO SDK](https://github.com/milvus-io/milvus-sdk-go/tree/master/tests) 将搜索请求发送到 Milvus 实例。

### 数据集

The test uses the open-source dataset SIFT (128 dimensions) from [ANN-Benchmarks](https://github.com/erikbern/ann-benchmarks/#data-sets).

## Test pipeline

1. Start a Milvus instance by Helm with respective server configurations as listed in each test.
2. Connect to the Milvus instance via Milvus GO SDK and get the corresponding test results.
3. Create a collection.
4. Insert 1 million SIFT vectors. Build an HNSW index and configure the index parameters by setting `M` to `8` and `efConstruction` to `200`.
5. Load the collection.
6. Search with different concurrent numbers with search parameters `nq=1, topk=1, ef=64`, the duration of each concurrency is at least 1 hour.

## Test results

### Milvus 2.2.0 v.s. Milvus 2.1.0

#### Cluster

<details>
    <summary><b>Server configurations (cluster)</b></summary>

```yaml
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

</details>

**Search performance**

| Milvus | QPS   | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| ------ | ----- | ------------- | ------------- | ------ |
| 2.1.0  | 6904  | 59            | 28            | 0      |
| 2.2.0  | 10248 | 63            | 24            | 0      |

![Cluster search performance](/public/assets/cluster_search_performance_210_vs_220.png)

#### Standalone

<details>
    <summary><b>Server configurations (standalone)</b></summary>

```yaml
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

</details>

**Search performance**

| Milvus | QPS  | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| ------ | ---- | ------------- | ------------- | ------ |
| 2.1.0  | 4287 | 104           | 76            | 0      |
| 2.2.0  | 7522 | 127           | 79            | 0      |

![Standalone search performance](/public/assets/standalone_search_performance_210_vs_220.png)

### Milvus 2.2.0 Scale-up

Expand the CPU cores in one Querynode to check the capability to scale up.

<details>
    <summary><b>Server configurations (cluster)</b></summary>

```yaml
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

</details>

**Search Performance**

| CPU cores | Concurrent Number | QPS   | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| --------- | ----------------- | ----- | ------------- | ------------- | ------ |
| 8         | 500               | 7153  | 127           | 83            | 0      |
| 12        | 300               | 10248 | 63            | 24            | 0      |
| 16        | 600               | 14135 | 85            | 42            | 0      |
| 32        | 600               | 20281 | 63            | 28            | 0      |

![Search performance by Querynode CPU cores](/public/assets/search_performance_by_querynode_cpu_cores.png)

### Milvus 2.2.0 Scale-out

Expand more replicas with more Querynodes to check the capability to scale out.

<div class="alert note">

Note: the number of Querynodes equals the `replica_number` when loading the collection.

</div>

<details>
    <summary><b>Server configurations (cluster)</b></summary>

```yaml
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

</details>

| Replicas | Concurrent Number | QPS   | RT(TP99) / ms | RT(TP50) / ms | fail/s |
| -------- | ----------------- | ----- | ------------- | ------------- | ------ |
| 1        | 500               | 7153  | 127           | 83            | 0      |
| 2        | 500               | 15903 | 105           | 27            | 0      |
| 4        | 800               | 19281 | 109           | 40            | 0      |
| 8        | 1200              | 30655 | 93            | 38            | 0      |

![Search performance by Querynode replicas](/public/assets/search_performance_by_querynode_replicas.png)

## What's next

- Try performing Milvus 2.2.0 benchmark tests on your own by referring to [this guide](https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md), except that you should instead use Milvus 2.2 and Pymilvus 2.2 in this guide.
