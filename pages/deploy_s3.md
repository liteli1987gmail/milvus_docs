
Milvus配置S3
===

Milvus默认使用MinIO进行对象存储，但它也支持使用[Amazon Simple Storage Service (S3)](https://aws.amazon.com/s3/)作为日志和索引文件的持久性对象存储。本主题描述了如何为Milvus配置S3。如果您对MinIO感到满意，可以跳过该主题。

You can configure S3 with [Docker Compose](https://docs.docker.com/get-started/overview/) or on K8s.

使用Docker Compose配置S3
--------------------------------

### 1. 配置S3
[MinIO](https://min.io/product/overview) 兼容 S3。要使用 Docker Compose 配置 S3，请在 milvus/configs 路径下的 `milvus.yaml` 文件中提供 `minio` 部分的值。

```
minio:
  address: <your_s3_endpoint>
  port: <your_s3_port>
  accessKeyID: <your_s3_access_key_id>
  secretAccessKey: <your_s3_secret_access_key>
  useSSL: <true/false>
  bucketName: "<your_bucket_name>"

```

有关更多信息，请参阅 [MinIO/S3 配置](configure_minio.md)。

### 2. Run Milvus

运行以下命令以启动使用S3配置的Milvus。

```
docker-compose up

```
配置只有在 Milvus 启动后才会生效。请参阅 [启动Milvus](https://milvus.io/docs/install_standalone-docker.md#Start-Milvus) 以获取更多信息。
在 K8s 上配置 S3
-------------------

对于在 K8s 上的 Milvus 集群，您可以在启动 Milvus 的同一命令中配置 S3。或者，在启动 Milvus 之前，您可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库中 /charts/milvus 路径下的 values.yml 文件中配置 S3。

以下表格列出了在 YAML 文件中配置 S3 的键。

| Key | Description | Value |
| --- | --- | --- |
| `minio.enabled` | Enables or disables MinIO. | `true`/`false` |
| `externalS3.enabled` | Enables or disables S3. | `true`/`false` |
| `externalS3.host` | The endpoint to access S3. |  |
| `externalS3.port` | The port to access S3. |  |
| `externalS3.rootPath` | The root path of the S3 storage. | An emtpy string by default. |
| `externalS3.accessKey` | The access key ID for S3. |  |
| `externalS3.secretKey` | The secret access key for S3. |  |
| `externalS3.bucketName` | The name of the S3 bucket. |  |

### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `minio` 部分。

```
minio:
  enabled: false

```

2. 在 `values.yaml` 文件中使用您的值配置 `externalS3` 部分。

```
externalS3:
  enabled: true
  host: "<your_s3_endpoint>"
  port: "<your_s3_port>"
  accessKey: "<your_s3_access_key_id>"
  secretKey: "<your_s3_secret_key>"
  useSSL: <true/false>
  bucketName: "<your_bucket_name>"

```

3. 在配置完上述部分并保存 `values.yaml` 文件后，运行以下命令以安装使用 S3 配置的 Milvus。

```
helm install <your_release_name> milvus/milvus -f values.yaml

```

### 使用命令

要安装Milvus并配置S3，请使用您的值运行以下命令。

```
helm install <your_release_name> milvus/milvus --set cluster.enabled=true  --set minio.enabled=false --set externalS3.enabled=true --set externalS3.host=<your_s3_endpoint> --set externalS3.port=<your_s3_port> --set externalS3.accessKey=<your_s3_access_key_id> --set externalS3.secretKey=<your_s3_secret_key> --set externalS3.bucketName=<your_bucket_name>

```
下一步
----------

了解如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：

* [使用 Docker Compose 或 Helm 配置元数据存储](deploy_etcd.md)
* [使用 Docker Compose 或 Helm 配置消息存储](deploy_pulsar.md)