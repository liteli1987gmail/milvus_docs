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

Click to see the details of the terms used in the test

| Term | Description |
| --- | --- |
| nq | Number of vectors to be searched in one search request |
| topk | Number of the nearest vectors to be retrieved for each vector (in nq) in a search request |
| ef | A search parameter specific to [HNSW索引](https://milvus.io/docs/v2.2.x/index.md) |
| RT | Response time from sending the request to receiving the response |
| QPS | Number of search requests that are successfully processed per second |

Test environment
----------------

All tests are performed under the following environments.

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

### Deployment scheme

* Milvus instances (standalone or cluster) are deployed via [Helm](https://milvus.io/docs/install_standalone-helm.md) on a Kubernetes cluster based on physical or virtual machines.
* Different tests merely vary in the number of CPU cores, the size of memory, and the number of replicas (worker nodes), which only applies to Milvus clusters.
* 未指定的配置与[默认配置](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml)相同。

* Milvus 依赖项（MinIO、Pulsar 和 Etcd）在每个节点的本地 SSD 上存储数据。

* 通过[Milvus GO SDK](https://github.com/milvus-io/milvus-sdk-go/tree/master/tests)将搜索请求发送到 Milvus 实例。

### 数据集

The test uses the open-source dataset SIFT (128 dimensions) from [ANN-Benchmarks](https://github.com/erikbern/ann-benchmarks/#data-sets).

Test pipeline
-------------

1. Start a Milvus instance by Helm with respective server configurations as listed in each test.
2. Connect to the Milvus instance via Milvus GO SDK and get the corresponding test results.
3. Create a collection.
4. Insert 1 million SIFT vectors. Build an HNSW index and configure the index parameters by setting `M` to `8` and `efConstruction` to `200`.
5. Load the collection.
6. Search with different concurrent numbers with search parameters `nq=1, topk=1, ef=64`, the duration of each concurrency is at least 1 hour.

Test results
------------

### Milvus 2.2.0 与 Milvus 2.1.0

#### 聚类

**Server configurations (cluster)**

```python
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

#### Standalone

**Server configurations (standalone)**

```python
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

```python
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

### Milvus 2.2.0 Scale-out

Expand more replicas with more Querynodes to check the capability to scale out.

Note: the number of Querynodes equals the `replica_number` when loading the collection.

**Server configurations (cluster)**

```python
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

What's next
-----------

* Try performing Milvus 2.2.0 benchmark tests on your own by referring to [this guide](https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md), except that you should instead use Milvus 2.2 and Pymilvus 2.2 in this guide.
