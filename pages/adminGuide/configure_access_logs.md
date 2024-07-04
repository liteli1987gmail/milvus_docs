


# 配置访问日志

Milvus 的访问日志功能允许服务器管理员记录和分析用户的访问行为，帮助了解查询成功率和失败原因等方面的信息。

本指南提供了有关在 Milvus 中配置访问日志的详细说明。

访问日志的配置取决于 Milvus 的安装方法：

- **Helm 安装**：在 `values.yaml` 中进行配置。更多信息，请参见 [使用 Helm Charts 配置 Milvus](/adminGuide/configure-helm.md)。
- **Docker 安装**：在 `milvus.yaml` 中进行配置。更多信息，请参见 [使用 Docker Compose 配置 Milvus](/adminGuide/configure-docker.md)。
- **Operator 安装**：修改配置文件中的 `spec.components`。更多信息，请参见 [使用 Milvus Operator 配置 Milvus](/adminGuide/configure_operator.md)。

## 配置选项

根据你的需求，可选择以下三个配置选项：

- **基本配置**: 通用用途。
- **本地访问日志文件配置**: 用于在本地存储日志。
- **上传本地访问日志到 MinIO 的配置**: 用于云存储和备份。

### 基本配置

基本配置包括启用访问日志和定义日志文件名或使用 stdout。

```yaml
proxy:
  accessLog:
    enable: true
    # 如果`filename`为空，则将日志打印到stdout。
    filename: ""
    # 其他格式化配置...
```

- `proxy.accessLog.enable`：是否启用访问日志功能。默认为 **false**。
- `proxy.accessLog.filename`：访问日志文件的名称。如果将此参数留空，则访问日志将打印到 stdout。

### 本地访问日志文件配置

使用包括本地文件路径、文件大小和轮换间隔等参数配置访问日志文件的本地存储：

```yaml
proxy:
  accessLog:
    enable: true
    filename: "access_log.txt" # 访问日志文件名
    localPath: "/var/logs/milvus" # 存储访问日志文件的本地文件路径
    maxSize: 500 # 每个单个访问日志文件的最大大小。单位：MB
    rotatedTime: 24 # 日志轮换的时间间隔。单位：秒
    maxBackups: 7 # 可保留的封存的访问日志文件的最大数量
    # 其他格式化配置...
```

这些参数在 `filename` 不为空时指定。

- `proxy.accessLog.localPath`：访问日志文件存储的本地文件路径。
- `proxy.accessLog.maxSize`：单个访问日志文件允许的最大大小，以 MB 为单位。如果日志文件大小达到此限制，将会触发轮换过程。此过程会封存当前的访问日志文件，创建一个新的日志文件，并清除原始日志文件的内容。
- `proxy.accessLog.rotatedTime`：单个访问日志文件允许轮换的最长时间间隔，单位为秒。达到指定的时间间隔后，将触发轮换过程，创建一个新的访问日志文件并封存前一个日志文件。
- `proxy.accessLog.maxBackups`：可以保留的封存的访问日志文件的最大数量。如果封存的访问日志文件的数量超过该限制，最旧的文件将被删除。

### 上传本地访问日志到 MinIO 的配置

启用并配置将本地访问日志文件上传到 MinIO 的设置：

```yaml
proxy:
  accessLog:
    enable: true
    filename: "access_log.txt"
    localPath: "/var/logs/milvus"
    maxSize: 500
    rotatedTime: 24 
    maxBackups: 7
    minioEnable: true
    remotePath: "/milvus/logs/access_logs"
    remoteMaxTime: 0
    # 其他格式化配置...
```

在配置 MinIO 参数时，请确保已设置 `maxSize` 或 `rotatedTime`。否则可能导致无法成功上传本地访问日志文件到 MinIO。

- `proxy.accessLog.minioEnable`：是否将本地访问日志文件上传到 MinIO。默认为 **false**。
- `proxy.accessLog.remotePath`：用于上传访问日志文件的对象存储路径。
- `proxy.accessLog.remoteMaxTime`：允许上传访问日志文件的时间间隔。如果日志文件的上传时间超过此间隔，文件将被删除。将该值设置为 0 将禁用此功能。

## 格式化配置

 


默认日志格式用于所有方法的输出是 `base` 格式，不需要特定的方法关联。但是，如果你希望自定义特定方法的日志输出，你可以定义一个自定义的日志格式并将其应用于关联的方法。

```yaml
proxy:
  accessLog:
    enable: true
    filename: "access_log.txt"
    localPath: "/var/logs/milvus"
    # 用于访问日志的自定义格式及应用的方法
    formatters:
      # 默认情况下，`base`格式适用于所有方法
      # `base`格式不需要特定的方法关联
      base: 
        # 格式字符串；空字符串表示无日志输出
        format: "[$time_now] [ACCESS] <$user_name: $user_addr> $method_name-$method_status-$error_code [traceID: $trace_id] [timeCost: $time_cost]"
      # 特定方法（如Query、Search）的自定义格式
      query: 
        format: "[$time_now] [ACCESS] <$user_name: $user_addr> $method_status-$method_name [traceID: $trace_id] [timeCost: $time_cost] [database: $database_name] [collection: $collection_name] [partitions: $partition_name] [expr: $method_expr]"
        # 指定该自定义格式适用的方法
        methods: ["Query", "Search"]
```

- `proxy.accessLog.<formatter_name>.format`：定义具有动态指标的日志格式。更多信息请参见 [Supported metrics](#reference-supported-metrics)。
- `proxy.accessLog.<formatter_name>.methods`：列出使用此格式的 Milvus 操作。获取方法名称，请参见 [Milvus methods](https://github.com/milvus-io/milvus-proto/blob/master/proto/milvus.proto) 中的 **MilvusService**。

## 参考：支持的指标



| Metric Name        | 描述                                                               |
|--------------------|-------------------------------------------------------------------|
| `$method_name`     | 方法的名称                                                         |
| `$method_status`   | 访问状态：**OK** 或 **Fail**                                          |
| `$method_expr`     | 用于查询、搜索或删除操作的表达式                                     |
| `$trace_id`        | 与访问相关的跟踪 ID                                                 |
| `$user_addr`       | 用户的 IP 地址                                                       |
| `$user_name`       | 用户的名称                                                         |
| `$response_size`   | 响应数据的大小                                                     |
| `$error_code`      | Milvus 特定的错误代码                                               |
| `$error_msg`       | 详细的错误消息                                                     |
| `$database_name`   | 目标 Milvus 数据库的名称                                             |
| `$collection_name` | 目标 Milvus 集合的名称                                               |
| `$partition_name`  | 目标 Milvus 分区的名称或名称                                           |
| `$time_cost`       | 完成访问所花费的时间                                               |
| `$time_now`        | 访问日志打印的时间（通常等同于 `$time_end`）                           |
| `$time_start`      | 访问开始的时间                                                     |
| `$time_end`        | 访问结束的时间                                                     |
| `$sdk_version`     | 用户使用的 Milvus SDK 版本                                            |

