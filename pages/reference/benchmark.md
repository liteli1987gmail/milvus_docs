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

| 硬件   | 规格                                     |
| ------ | ----------------------------------------- |
| CPU    | Intel(R) Xeon(R) Gold 6226R CPU @ 2.90GHz |
| 内存   | 16\*\*32 GB RDIMM, 3200 MT/s             |
| SSD    | SATA 6 Gbps                              |

### 软件环境

| 软件   | 版本                                                         |
| ------ | ------------------------------------------------------------ |
| Milvus | v2.2.0                                                      |
| Milvus GO SDK | v2.2.0                                                    |

### 部署方案

- Milvus 实例（独立或集群）通过 [Helm](https://milvus.io/docs/install_standalone-helm.md) 在基于物理或虚拟机的 Kubernetes 集群上部署。
- 不同的测试仅在 CPU 核心数、内存大小和副本（工作节点）数量上有所不同，这只适用于 Milvus 集群。
- 未指定的配置与 [默认配置](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml) 相同。
- Milvus 依赖项（MinIO、Pulsar 和 Etcd）在每个节点的本地 SSD 上存储数据。
- 通过 [Milvus GO SDK](https://github.com/milvus-io/milvus-sdk-go/tree/master/tests) 将搜索请求发送到 Milvus 实例。

### 数据集

测试使用了来自 [ANN-Benchmarks](https://github.com/erikbern/ann-benchmarks/#data-sets) 的开源数据集 S