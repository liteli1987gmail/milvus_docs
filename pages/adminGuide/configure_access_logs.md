---
id: configure_access_logs.md
title: 配置访问日志
---

# 配置访问日志

Milvus 中的访问日志功能允许服务器管理员记录和分析用户访问行为，帮助理解诸如查询成功率和失败原因等方面。

本指南提供了在 Milvus 中配置访问日志的详细说明。

访问日志的配置取决于 Milvus 的安装方法：

- **Helm 安装**：在 `values.yaml` 中配置。有关更多信息，请参见 [使用 Helm 图表配置 Milvus](configure-helm.md)。
- **Docker 安装**：在 `milvus.yaml` 中配置。有关更多信息，请参见 [使用 Docker Compose 配置 Milvus](configure-docker.md)。
- **Operator 安装**：在配置文件中修改 `spec.components`。有关更多信息，请参见 [使用 Milvus Operator 配置 Milvus](configure_operator.md)。

## 配置选项

根据您需求选择以下三种配置选项之一：

- **基础配置**：用于一般用途。
- **本地访问日志文件配置**：用于本地存储日志。
- **将本地访问日志上传到 MinIO 的配置**：用于云存储和备份。

### 基础配置

基本配置涉及启用访问日志并定义日志文件名或使用 stdout。

```yaml
proxy:
  accessLog:
    enable: true
    # 如果 `filename` 为空，则日志将打印到 stdout。
    filename: ""
    # 其他格式化器配置...
```

- `proxy.accessLog.enable`：是否启用访问日志功能。默认为 **false**。
- `proxy.accessLog.filename`：访问日志文件的名称。如果将此参数留空，访问日志将打印到 stdout。

### 本地访问日志文件配置

使用包括本地文件路径、文件大小和旋转间隔的参数配置本地存储的访问日志文件：

```yaml
proxy:
  accessLog:
    enable: true
    filename: "access_log.txt" # 访问日志文件的名称
    localPath: "/var/logs/milvus" # 存储访问日志文件的本地文件路径
    maxSize: 500 # 每个单独访问日志文件的最大大小。单位：MB
    rotatedTime: 24 # 日志旋转的时间间隔。单位：秒
    maxBackups: 7 # 可以保留的密封访问日志文件的最大数量
    # 其他格式化器配置...
```

当 `filename` 不为空时，指定这些参数。

- `proxy.accessLog.localPath`：存储访问日志文件的本地文件路径。
- `proxy.accessLog.maxSize`：允许单个访问日志文件的最大大小（以 MB 为单位）。如果日志文件大小达到此限制，将触发旋转过程。该过程密封当前访问日志文件，创建一个新日志文件，并清除原始日志文件的内容。
- `proxy.accessLog.rotatedTime`：允许旋转单个访问日志文件的最大时间间隔（以秒为单位）。到达指定的时间间隔后，将触发旋转过程，从而创建一个新的访问日志文件并密封上一个。
- `proxy.accessLog.maxBackups`：可以保留的密封访问日志文件的最大数量。如果密封的访问日志文件数量超过此限制，将删除最旧的文件。

### 将本地访问日志文件上传到 MinIO 的配置

启用并配置设置以将本地访问日志文件上传到 MinIO：

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
    # 其他格式化器配置...
```

配置 MinIO 参数时，请确保您已设置 `maxSize` 或 `rotatedTime`。未这样做可能导致无法成功将本地访问日志文件上传到 MinIO。

- `proxy.accessLog.minioEnable`：是否将本地访问日志文件上传到 MinIO。默认为 **false**。
- `proxy.accessLog.remotePath`：上传访问日志文件的对象存储路径。
- `proxy.accessLog.remoteMaxTime`：允许上传访问日志文件的时间间隔。如果日志文件的上传时间超过此间隔，文件将被删除。将值设置为 0 将禁用此功能。

## 格式化器配置

所有方法使用的默认日志格式是 `base` 格式，不需要特定方法关联。但是，如果您希望为特定方法自定义日志输出，可以定义自定义日志格式并将其应用于相关方法。

```yaml
proxy:
  accessLog:
    enable: true
    filename: "access_log.txt"
    localPath: "/var/logs/milvus"
    # Define custom formatters for access logs with format and applicable methods
    formatters:
      # The `base` formatter applies to all methods by default
      # The `base` formatter does not require specific method association
      base:
        # Format string; an empty string means no log output
        format: "[$time_now] [ACCESS] <$user_name: $user_addr> $method_name-$method_status-$error_code [traceID: $trace_id] [timeCost: $time_cost]"
      # Custom formatter for specific methods (e.g., Query, Search)
      query:
        format: "[$time_now] [ACCESS] <$user_name: $user_addr> $method_status-$method_name [traceID: $trace_id] [timeCost: $time_cost] [database: $database_name] [collection: $collection_name] [partitions: $partition_name] [expr: $method_expr]"
        # Specify the methods to which this custom formatter applies
        methods: ["Query", "Search"]
```

- `proxy.accessLog.<formatter_name>.format`: Defines the log format with dynamic metrics. For more information, see [Supported metrics](#reference-supported-metrics).
- `proxy.accessLog.<formatter_name>.methods`: Lists Milvus operations using this formatter. To obtain method names, see **MilvusService** in [Milvus methods](https://github.com/milvus-io/milvus-proto/blob/master/proto/milvus.proto).

## Reference: Supported metrics

| Metric Name        | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `$method_name`     | Name of the method                                                          |
| `$method_status`   | Status of access: **OK** or **Fail**                                        |
| `$method_expr`     | Expression used for query, search, or delete operations                     |
| `$trace_id`        | TraceID associated with the access                                          |
| `$user_addr`       | IP address of the user                                                      |
| `$user_name`       | Name of the user                                                            |
| `$response_size`   | Size of the response data                                                   |
| `$error_code`      | Error code specific to Milvus                                               |
| `$error_msg`       | Detailed error message                                                      |
| `$database_name`   | Name of the target Milvus database                                          |
| `$collection_name` | Name of the target Milvus collection                                        |
| `$partition_name`  | Name or names of the target Milvus partition(s)                             |
| `$time_cost`       | Time taken for completing the access                                        |
| `$time_now`        | Time at which the access log is printed (usually equivalent to `$time_end`) |
| `$time_start`      | Time at which the access starts                                             |
| `$time_end`        | Time at which the access ends                                               |
| `$sdk_version`     | Version of the Milvus SDK used by the user                                  |
