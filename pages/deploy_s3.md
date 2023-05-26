
Milvus配置S3
===

Milvus默认使用MinIO进行对象存储，但它也支持使用[Amazon Simple Storage Service (S3)](https://aws.amazon.com/s3/)作为日志和索引文件的持久性对象存储。本主题描述了如何为Milvus配置S3。如果您对MinIO感到满意，可以跳过该主题。

您可以通过[Docker Compose](https://docs.docker.com/get-started/overview/)或K8s来配置S3。

使用Docker Compose配置S3
--------------------------------

### 1. 配置S3
[MinIO](https://min.io/product/overview) 兼容 S3。要使用 Docker Compose 配置 S3，请在 milvus/configs 路径下的 `milvus.yaml` 文件中提供 `minio` 部分的值。

```bash
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

```bash
docker-compose up

```
配置只有在 Milvus 启动后才会生效。请参阅 [启动Milvus](https://milvus.io/docs/install_standalone-docker.md#Start-Milvus) 以获取更多信息。
在 K8s 上配置 S3
-------------------

对于在 K8s 上的 Milvus 集群，您可以在启动 Milvus 的同一命令中配置 S3。或者，在启动 Milvus 之前，您可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库中 /charts/milvus 路径下的 values.yml 文件中配置 S3。

以下表格列出了在 YAML 文件中配置 S3 的键。
| 键 | 描述 | 值 |
| --- | --- | --- |
| `minio.enabled` | 启用或禁用MinIO。 | `true`/`false` |
| `externalS3.enabled` | 启用或禁用S3。 | `true`/`false` |
| `externalS3.host` | 访问S3的终端节点。 |  |
| `externalS3.port` | 访问S3的端口。 |  |
| `externalS3.rootPath` | S3存储的根路径。 | 默认情况下为空字符串。 |
| `externalS3.accessKey` | S3的访问密钥ID。 |  |
| `externalS3.secretKey` | S3的访问密钥。 |  |
| `externalS3.bucketName` | S3存储桶的名称。 |  |

### 使用 YAML 文件

1. 在 `values.yaml` 文件中配置 `minio` 部分。

```bash
minio:
  enabled: false

```

2. 在 `values.yaml` 文件中使用您的值配置 `externalS3` 部分。

```bash
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

```bash
helm install <your_release_name> milvus/milvus -f values.yaml

```

### 使用命令

要安装Milvus并配置S3，请使用您的值运行以下命令。

```bash
helm install <your_release_name> milvus/milvus --set cluster.enabled=true  --set minio.enabled=false --set externalS3.enabled=true --set externalS3.host=<your_s3_endpoint> --set externalS3.port=<your_s3_port> --set externalS3.accessKey=<your_s3_access_key_id> --set externalS3.secretKey=<your_s3_secret_key> --set externalS3.bucketName=<your_bucket_name>

```
下一步
----------

了解如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：

* [使用 Docker Compose 或 Helm 配置元数据存储](deploy_etcd.md)
* [使用 Docker Compose 或 Helm 配置消息存储](deploy_pulsar.md)