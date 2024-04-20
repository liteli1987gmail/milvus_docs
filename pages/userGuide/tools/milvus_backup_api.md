---
title: 使用API备份和恢复数据
---

# 使用API备份和恢复数据

Milvus Backup 提供数据备份和恢复功能，以确保您的 Milvus 数据安全。

## 获取 Milvus Backup

您可以选择下载编译好的二进制文件或从源代码构建。

要下载编译好的二进制文件，请访问 [release](https://github.com/zilliztech/milvus-backup/releases) 页面，在那里您可以找到所有官方发布版本。请记住，始终使用标记为 **Latest** 的版本中的二进制文件。

要从源代码构建，请按照以下步骤操作：

```shell
git clone git@github.com:zilliztech/milvus-backup.git
go get
go build
```

## 准备配置文件

下载 [示例配置文件](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml) 并根据需要进行调整。

然后在下载或构建的 Milvus Backup 二进制文件旁边创建一个文件夹，将文件夹命名为 `configs`，并将配置文件放入 `configs` 文件夹中。

您的文件夹结构应类似于以下结构：

<pre>
workspace
├── milvus-backup
└── configs
     └── backup.yaml
</pre>

由于 Milvus Backup 不能将您的数据备份到本地路径，请在调整配置文件时确保 Minio 设置正确。

<div class="alert note">

默认的 Minio 存储桶名称因安装 Milvus 的方式而异。在更改 Minio 设置时，请参考下表。

| 字段           | Docker Compose | Helm / Milvus Operator |
| --------------- | -------------- | ---------------------- |
| `bucketName`    | a-bucket       | milvus-bucket          |
| `rootPath`      | files          | file                   |

</div>

## 启动 API 服务器

然后，您可以按照以下方式启动 API 服务器：

```shell
./milvus-backup server
```

API 服务器默认监听端口 8080。您可以通过使用 `-p` 标志来更改它。要启动监听端口 443 的 API 服务器，请按照以下步骤操作：

```shell
./milvus-backup server -p 443
```

您可以使用 http://localhost:<port>/api/v1/docs/index.html 访问 Swagger UI。

## 准备数据

如果您运行了一个监听默认端口 19530 的空本地 Milvus 实例，请使用示例 Python 脚本在您的实例中生成一些数据。请根据需要对脚本进行必要的更改。

获取 [脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。然后运行脚本以生成数据。确保已安装 [PyMilvus](https://pypi.org/project/pymilvus/)，即官方的 Milvus Python SDK。

```shell
python example/prepare_data.py
```

这一步是可选的。如果您跳过这一步，请确保您的 Milvus 实例中已经有数据。

## 备份数据

{{tab}}

请注意，对 Milvus 实例运行 Milvus Backup 通常不会影响实例的运行。在备份或恢复期间，您的 Milvus 实例完全可用。

运行以下命令以创建备份。如有必要，更改 `collection_names` 和 `backup_name`。

```shell
curl --location --request POST 'http://localhost:8080/api/v1/create' \
--header 'Content-Type: application/json' \
--data-raw '{
  "async": true,
  "backup_name": "my_backup",
  "collection_names": [
    "hello_milvus"
  ]
}'
```

执行命令后，您可以按照以下方式列出 Minio 设置中指定的存储桶中的备份：

```shell
curl --location --request GET 'http://localhost:8080/api/v1/list' \
--header 'Content-Type: application/json'
```

并按照以下方式下载备份文件：

```shell
curl --location --request GET 'http://localhost:8080/api/v1/get_backup?backup_id=<test_backup_id>&backup_name=my_backup' \
--header 'Content-Type: application/json'
```

在运行上述命令时，将 `backup_id` 和 `backup_name` 更改为列表 API 返回的值。

现在，您可以将备份文件保存在安全的地方以备将来恢复，或者将它们上传到 [Zilliz Cloud](https://cloud.zilliz.com) 以使用您的数据创建托管的向量数据库。有关详细信息，请参阅 [从 Milvus 迁移到 Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x)。

## 恢复数据

{{tab}}

您可以通过使用 `collection_suffix` 选项调用恢复 API 命令，以从备份中恢复数据并创建一个新的集合。如有必要，更改 `collection_names` 和