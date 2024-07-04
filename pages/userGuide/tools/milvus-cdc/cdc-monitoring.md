


# 监控

Milvus-CDC 通过 Grafana 仪表板提供了全面的监控能力，允许你可视化关键指标，确保 Change Data Capture (CDC) 任务和服务器的正常运行。

### CDC 任务的指标







要开始，请将 [cdc-grafana.json](https://github.com/zilliztech/milvus-cdc/blob/main/server/configs/cdc-grafana.json) 文件导入 Grafana。这将添加一个专门用于监视 CDC 任务状态的仪表板。

__CDC Grafana 仪表板概述__：

![milvus-cdc-dashboard](/assets/milvus-cdc-dashboard.png)

__关键指标说明__：

- __任务__：不同状态的 CDC 任务数量，包括 __初始化__、__运行中__ 和 __已暂停__。

- __请求总数__：Milvus-CDC 接收到的请求数量总计。

- __请求成功__：Milvus-CDC 接收到的成功请求数量。

- __任务数量__：随时间变化的 __初始化__、__已暂停__ 和 __运行中__ 状态任务的数量。

- __任务状态__：各个任务的状态。

- __请求计数__：成功请求和总请求数量。

- __请求延迟__：请求的响应延迟，包括 p99、平均值和其他统计数据。

- __复制数据速率__：读写操作的复制数据速率。

- __复制时间滞后__：读写操作的复制时间滞后。

- __API 执行计数__：不同 Milvus-CDC API 的执行次数。

- __中心时间戳__：读写任务的时间戳。

