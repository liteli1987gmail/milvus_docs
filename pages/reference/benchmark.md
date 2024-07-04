

# Milvus 2.2 基准测试报告

这份报告展示了 Milvus 2.2.0 的主要测试结果。它旨在展示 Milvus 2.2.0 的搜索性能，特别是在扩展能力方面的表现。

<div class="alert note">
  <div style="display: flex;">
      <div style="flex:0.3;">
      <img src="https://zilliz.com/images/whitepaper/performance.png">
  </div>
  <div style="flex:1; padding: 10px; ">
    <p> 我们最近对 Milvus 2.2.3 进行了基准测试，得出以下主要发现：</p>
    <ul>
      <li> 搜索延迟减少了 2.5 倍 </li>
      <li> QPS 提升了 4.5 倍 </li>
      <li> 亿级相似性搜索性能下降较小 </li>
      <li> 使用多个副本时的线性可扩展性 </li>
    </ul>
    <p> 详细信息请参考 <a href="https://zilliz.com/resources/whitepaper/milvus-performance-benchmark"> 此白皮书 </a> 和 <a href="https://github.com/zilliztech/VectorDBBench"> 相关基准测试代码 </a>。</p>
  </div>
</div>

## 总结

- Milvus 2.2.0 在群集模式下与 Milvus 2.1 相比，QPS 提升超过 48%，在独立模式下提升超过 75%。
- Milvus 2.2.0 具备出色的扩展能力：
  - 当 CPU 核心数从 8 扩展到 32 时，QPS 线性增长。
  - 当 Querynode 副本数从 1 扩展到 8 时，QPS 线性增长。

## 术语

<details>
    <summary> 点击查看测试中使用的术语详细解释 </summary>
    <table class="terminology">
        <thead>
            <tr>
                <th> 术语 </th>
                <th> 描述 </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td> nq </td>
                <td> 每个搜索请求中要搜索的向量数量 </td>
            </tr>
            <tr>
                <td> topk </td>
                <td> 每个搜索请求中要检索的每个向量（在 nq 中）的最近向量数量 </td>
            </tr>
            <tr>
                <td> ef </td>
                <td> 一种针对 <a href="https://milvus.io/docs/v2.2.x/index.md"> HNSW 索引 </a> 的搜索参数 </td>
            </tr>
            <tr>
                <td> RT </td>
                <td> 从发送请求到接收响应的响应时间 </td>
            </tr>
            <tr>
                <td> QPS </td>
                <td> 每秒成功处理的搜索请求数量 </td>
            </tr>
        </tbody>
    </table>
</details>

## 测试环境

所有测试都是在以下环境下进行的。

### 硬件环境

| 硬件    | 规格                                  |
| -------- | --------------------------------------- |
| CPU      | Intel(R) Xeon(R) Gold 6226R CPU @ 2.90GHz |
| 内存     | 16\*\32 GB RDIMM, 3200 MT/s               |
| SSD      | SATA 6 Gbps                               |

### 软件环境

|    软件   |                                版本                                |
| ------------- | --------------------------------------------------------------------- |
|    Milvus     | v2.2.0                                                                |
| Milvus GO SDK | v2.2.0                                                                |

### 部署方案

- Milvus 实例（独立或群集）通过 [Helm](/getstarted/standalone/install_standalone-helm.md) 在基于物理或虚拟机的 Kubernetes 集群上部署。
- 不同的测试仅在 CPU 核心数、内存大小和副本数（worker 节点数）上有所不同，这仅适用于 Milvus 群集。
- 未指定的配置与 [默认配置](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml) 相同。
- Milvus 依赖项（MinIO、Pulsar 和 Etcd）将数据存储在每个节点的本地 SSD 上。
- 搜索请求通过 [Milvus GO SDK](https://github.com/milvus-io/milvus-sdk-go/tree/master/tests) 发送给 Milvus 实例。

### 数据集





这个测试使用了来自 [ANN-Benchmarks](https://github.com/erikbern/ann-benchmarks/#data-sets) 的开源数据集 SIFT（128 维）。

## 测试流程

1. 通过 Helm 启动一个带有相应的服务器配置的 Milvus 实例，具体配置详见每个测试的列表。
2. 通过 Milvus GO SDK 连接到 Milvus 实例并获取相应的测试结果。
3. 创建一个集合。
4. 插入 100 万个 SIFT 向量。通过设置 `M` 为 `8` 且 `efConstruction` 为 `200` 建立一个 HNSW 索引并配置索引参数。
5. 加载集合。
6. 使用不同的并发数和搜索参数 `nq=1, topk=1, ef=64` 进行搜索，每个并发数的持续时间至少为 1 小时。

## 测试结果

### Milvus 2.2.0 对比 Milvus 2.1.0

#### 集群

<details>
    <summary> <b> 服务器配置（集群）</b> </summary>

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

**搜索性能**

| Milvus | QPS   | RT(TP99) / ms | RT(TP50) / ms | 失败/s |
| ------ |------ |---------------|---------------|--------|
| 2.1.0  | 6904  | 59            | 28            | 0      |
| 2.2.0  | 10248 | 63            | 24            | 0      |

![集群搜索性能](/assets/cluster_search_performance_210_vs_220.png)

#### 独立服务器

<details>
    <summary> <b> 服务器配置（独立服务器）</b> </summary>

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

**搜索性能**

| Milvus | QPS  | RT(TP99) / ms  | RT(TP50) / ms | 失败/s |
|------  |------|--------------- |---------------|--------|
| 2.1.0  | 4287 | 104            | 76            | 0      |
| 2.2.0  | 7522 | 127            | 79            | 0      |

![独立服务器搜索性能](/assets/standalone_search_performance_210_vs_220.png)

### Milvus 2.2.0 扩展



# 


将一个 Querynode 中的 CPU 核心扩展以检查其扩展能力。

<details>
    <summary> <b> 服务器配置（集群）</b> </summary>

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

**搜索性能**

| CPU 核心 | 并发数 | QPS  | 响应时间(TP99) / 毫秒 | 响应时间(TP50) / 毫秒 | 失败/s |
| ------|------|------|---------------|---------------|--------|
| 8 | 500 | 7153 | 127            | 83            | 0      |
| 12 | 300 | 10248 | 63            | 24            | 0      |
| 16 | 600 | 14135 | 85            | 42            | 0      |
| 32 | 600 | 20281 | 63            | 28            | 0      |

![按 Querynode CPU 核心的搜索性能](/assets/search_performance_by_querynode_cpu_cores.png)

### Milvus 2.2.0 扩展

扩展更多的副本以检查其扩展能力。

<div class="alert note">

注意：加载集合时 Querynodes 的数量等于 `replica_number`。

</div>

<details>
    <summary> <b> 服务器配置（集群）</b> </summary>

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


| 副本数 | 并发数 | QPS  | 响应时间(TP99) / 毫秒 | 响应时间(TP50) / 毫秒 | 失败/s |
|------|------|------|---------------|---------------|--------|
| 1 | 500 |  7153 | 127            | 83            | 0      |
| 2 | 500 |  15903 | 105            | 27            | 0      |
| 4 | 800 | 19281 | 109            | 40            | 0      |
| 8 | 1200 | 30655 | 93            | 38            | 0      |

![按 Querynode 副本数的搜索性能](/assets/search_performance_by_querynode_replicas.png)

## 下一步




# 
- 尝试按照 [这个指南](https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md) 中的步骤进行 Milvus 2.2.0 的性能测试，但是请使用 Milvus 2.2 和 Pymilvus 2.2。

