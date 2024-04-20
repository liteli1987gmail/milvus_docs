# 数据协调器相关配置

本主题介绍了 Milvus 数据协调器相关的配置。

数据协调器（data coord）管理数据节点的拓扑结构，维护元数据，并触发刷新、压缩和其他后台数据操作。

在本节中，您可以配置数据协调器地址、段设置、压缩、垃圾回收等。

## `dataCoord.address`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器的 TCP/IP 地址。如果此参数设置为 `0.0.0.0`，则数据协调器将监控所有 IPv4 地址。 | localhost |

## `dataCoord.port`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器的 TCP 端口。 | 13333 |

## `dataCoord.grpc.serverMaxRecvSize`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器可以接收的每个 RPC 请求的最大大小。单位：字节 | 2147483647 |

## `dataCoord.grpc.serverMaxSendSize`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器在接收 RPC 请求时可以发送的每个响应的最大大小。单位：字节 | 2147483647 |

## `dataCoord.grpc.clientMaxRecvSize`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器在发送 RPC 请求时可以接收的每个响应的最大大小。单位：字节 | 104857600 |

## `dataCoord.grpc.clientMaxSendSize`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器可以发送的每个 RPC 请求的最大大小。单位：字节 | 104857600 |

## `dataCoord.activeStandby.enabled`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器是否以活动-备用模式工作。 | false |

## `dataCoord.replicas`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器 pod 的数量。如果 `dataCoord.activeStandby.enabled` 设置为 `true`，则需要此配置。 | 1 |

## `dataCoord.enableCompaction`

| 描述 | 默认值 |
| --- | --- |
| 控制是否启用段压缩的开关值。压缩将小尺寸的段合并为一个大尺寸的段，并清除超出时间旅行保留时长的已删除实体。 | true |

## `dataCoord.enableGarbageCollection`

| 描述 | 默认值 |
| --- | --- |
| 控制是否启用垃圾回收以清除 MinIO 或 S3 服务中被丢弃的数据的开关值。 | true |

## `dataCoord.segment.maxSize`

| 描述 | 默认值 |
| --- | --- |
| 段的最大大小。单位：MB。`datacoord.segment.maxSize` 和 `datacoord.segment.sealProportion` 共同决定是否可以封闭一个段。 | 512 |

## `dataCoord.segment.sealProportion`

| 描述 | 默认值 |
| --- | --- |
| 相对于 `datacoord.segment.maxSize` 的最小比例，以封闭一个段。`datacoord.segment.maxSize` 和 `datacoord.segment.sealProportion` 共同决定是否可以封闭一个段。 | 0.23 |

## `dataCoord.segment.assignmentExpiration`

| 描述 | 默认值 |
| --- | --- |
| 段分配的过期时间。单位：毫秒 | 2000 |

## `dataCoord.compaction.enableAutoCompaction`

| 描述 | 默认值 |
| --- | --- |
| 控制是否在后台自动进行段压缩的开关值，在此期间数据协调器会定位并合并可压缩的段。此配置仅在 `dataCoord.enableCompaction` 设置为 `true` 时生效。 | true |

## `dataCoord.gc.interval`

| 描述 | 默认值 |
| --- | --- |
| 数据协调器执行垃圾回收的间隔。单位：秒。此配置仅在 `dataCoord.enableGarbageCollection` 设置为 `true` 时生效。 | 3600 |

## `dataCoord.gc.missingTolerance`

| 描述 | 默认值 |
| --- | --- |
| 未记录的二进制日志（binlog）文件的保留时长。为这个参数设置一个合理的较大值可以避免错误地删除缺乏元数据的新建 binlog 文件。单位：秒。此配置仅在 `dataCoord.enableGarbageCollection` 设置为 `true` 时生效。 | 86400 |

## `dataCoord.gc.dropTolerance`

| 描述 | 默认值 |
| --- | --- |
| 删除段的 binlog 文件在被清除前的保留时长。单位：秒。此配置仅在 `dataCoord.enableGarbageCollection` 设置为 `true` 时生效。 | 86400 |