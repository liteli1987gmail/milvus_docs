# Root Coordinator 相关配置

本文介绍了 Milvus 的 Root Coordinator（根协调器）相关配置。

Root Coordinator 处理数据定义语言（DDL）和数据控制语言（DCL）请求，管理 TSO（时间戳 Oracle），并发布时间滴答消息。

在本节中，您可以配置 Root Coordinator 的地址、索引构建阈值等。

## `rootCoord.address`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 的 TCP/IP 地址。如果此参数设置为 `0.0.0.0`，则 Root Coordinator 将监控所有 IPv4 地址。 | localhost |

## `rootCoord.port`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 的 TCP 端口。 | 53100 |

## `rootCoord.grpc.serverMaxRecvSize`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 可以接收的每个 RPC 请求的最大大小。单位：字节 | 2147483647 |

## `rootCoord.grpc.serverMaxSendSize`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 在接收 RPC 请求时可以发送的每个响应的最大大小。单位：字节 | 2147483647 |

## `rootCoord.grpc.clientMaxRecvSize`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 在发送 RPC 请求时可以接收的每个响应的最大大小。单位：字节 | 104857600 |

## `rootCoord.grpc.clientMaxSendSize`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 可以发送的每个 RPC 请求的最大大小。单位：字节 | 104857600 |

## `rootCoord.activeStandby.enabled`

| 描述 | 默认值 |
| --- | --- |
| RootCoord 是否以活动-备用模式工作。 | false |

## `rootCoord.replicas`

| 描述 | 默认值 |
| --- | --- |
| RootCoord pod 的数量。如果 `rootCoord.activeStandby.enabled` 设置为 `true`，则需要此参数。 | 1 |

## `rootCoord.dmlChannelNum`

| 描述 | 默认值 |
| --- | --- |
| Root Coordinator 启动时创建的 DML-Channels 数量。 | 256 |

## `rootCoord.maxPartitionNum`

| 描述 | 默认值 |
| --- | --- |
| 每个集合中分区的最大数量。如果此参数设置为 `0` 或 `1`，则无法创建新分区。范围：[0, INT64MAX] | 4096 |

## `rootCoord.minSegmentSizeToEnableIndex`

| 描述 | 默认值 |
| --- | --- |
| 创建索引所需的段的最小行数。小于此参数大小的段将不会被索引，并将使用蛮力搜索。 | 1024 |

## `rootCoord.importTaskExpiration`

| 描述 | 默认值 |
| --- | --- |
| 文件导入任务在 `importTaskExpiration` 秒后过期。单位：秒。您还应该更改 `internal/util/paramtable/component_param.go` 文件中的参数值。 | 900 |

## `rootCoord.importTaskRetention`

| 描述 | 默认值 |
| --- | --- |
| Milvus 至少保留导入任务记录 `importTaskRetention` 秒。您还应该更改 `internal/util/paramtable/component_param.go` 文件中的参数值。 | 86400 |