---
title: 使用 Docker Compose 或 Helm 配置对象存储
---

# 使用 Docker Compose 或 Helm 配置对象存储

Milvus 默认使用 MinIO 作为对象存储，但它也支持使用 [Amazon Simple Storage Service (S3)](https://aws.amazon.com/s3/) 作为日志和索引文件的持久化对象存储。本主题描述了如何为 Milvus 配置 S3。如果您对 MinIO 感到满意，可以跳过本主题。

您可以使用 [Docker Compose](https://docs.docker.com/get-started/overview/) 或在 K8s 上配置 S3。

## 使用 Docker Compose 配置 S3

### 1. 配置 S3

[MinIO](https://min.io/product/overview) 与 S3 兼容。要使用 Docker Compose 配置 S3，请在 milvus/configs 路径下的 `milvus.yaml` 文件中提供 `minio` 部分的值。

```yaml
minio:
  address: <你的 S3 端点>
  port: <你的 S3 端口>
  accessKeyID: <你的 S3 访问密钥 ID>
  secretAccessKey: <你的 S3 秘密访问密钥>
  useSSL: <true/false>
  bucketName: "<你的存储桶名称>"
```

有关更多信息，请参见 [MinIO/S3 配置](configure_minio.md)。

### 2. 完善 docker-compose.yaml

您还需要在 `docker-compose.yaml` 中删除 milvus 服务的 `MINIO_ADDRESS` 环境变量。默认情况下，milvus 将使用本地 MinIO 而不是外部 S3。

### 3. 运行 Milvus

运行以下命令以启动使用 S3 配置的 Milvus。

```shell
docker compose up
```

<div class="alert note">配置仅在 Milvus 启动后生效。有关更多信息，请参见 <a href=https://milvus.io/docs/install_standalone-docker.md#Start-Milvus>启动 Milvus</a>。</div>

## 在 K8s 上配置 S3

对于在 K8s 上的 Milvus 集群，您可以在启动 Milvus 的相同命令中配置 S3。或者，您可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库中的 /charts/milvus 路径上的 `values.yml` 文件中配置 S3，然后再启动 Milvus。

下面的表格列出了在 YAML 文件中配置 S3 的键。
| 键 | 描述 | 值 |
| --------------------- | ------------------------------------ | ------------------------------------ |
| `minio.enabled` | 启用或禁用 MinIO。 | `true`/`false` |
| `externalS3.enabled` | 启用或禁用 S3。 | `true`/`false` |
| `externalS3.host` | 访问 S3 的端点。 | |
| `externalS3.port` | 访问 S3 的端口。 | |
| `externalS3.rootPath` | S3 存储的根路径。 | 默认为空字符串。 |
| `externalS3.accessKey` | S3 的访问密钥 ID。 | |
| `externalS3.secretKey` | S3 的秘密访问密钥。 | |
| `externalS3.bucketName` | S3 存储桶的名称。 | |
| `externalS3.useSSL` | 连接时是否使用 SSL。 | 默认值设置为 `false` |

### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `minio` 部分。

```yaml
minio:
  enabled: false
```

2. 在 `values.yaml` 文件中使用您的值配置 `externalS3` 部分。

```yaml
externalS3:
  enabled: true
  host: "<你的 S3 端点>"
  port: "<你的 S3 端口>"
  accessKey: "<你的 S3 访问密钥 ID>"
  secretKey: "<你的 S3 秘密访问密钥>"
  useSSL: <true/false>
  bucketName: "<你的存储桶名称>"
  useSSL: <true/false>
```

3. 配置并保存 `values.yaml` 文件后，运行以下命令以安装使用 S3 配置的 Milvus。

```shell
helm install <你的发布名称> milvus/milvus -f values.yaml
```

### 使用命令

要安装 Milvus 并配置 S3，请使用以下命令并使用您的值。

```shell
helm install <你的发布名称> milvus/milvus --set cluster.enabled=true  --set minio.enabled=false -set externalS3.enabled=true --set externalS3.host=<your_s3_endpoint> --set externalS3.port=<your_s3_port> --set externalS3.accessKey=<your_s3_access_key_id> --set externalS3.secretKey=<your_s3_secret_key> --set externalS3.bucketName=<your_bucket_name>
```

## 下一步

了解如何使用 Docker Compose 或 Helm 配置 Milvus 的其他依赖项：

- [使用 Docker Compose 或 Helm 配置元存储](deploy_etcd.md)
- [使用 Docker Compose 或 Helm 配置消息存储](deploy_pulsar.md)
