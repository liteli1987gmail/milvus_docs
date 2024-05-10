---
id: milvus_backup_cli.md
summary: Learn how to use Milvus Backup through CLI
title: Back up and Restore Data Using Commands
---

# 使用命令备份和恢复数据

Milvus Backup 提供数据备份和恢复功能，以确保您的 Milvus 数据安全。

## 获取 Milvus Backup

您可以通过下载编译好的二进制文件或从源代码构建。

要下载编译好的二进制文件，请访问 [release](https://github.com/zilliztech/milvus-backup/releases) 页面，在那里您可以找到所有官方发布版本。请记住，始终使用标有 **Latest** 的版本中的二进制文件。

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

由于 Milvus Backup 不能将数据备份到本地路径，请在调整配置文件时确保 Minio 设置正确。

<div class="alert note">

默认的 Minio 存储桶名称因安装 Milvus 的方式而异。在更改 Minio 设置时，请参考下表。

| 字段         | Docker Compose | Helm / Milvus Operator |
| ------------ | -------------- | ---------------------- |
| `bucketName` | a-bucket       | milvus-bucket          |
| `rootPath`   | files          | file                   |

</div>

## 准备数据

如果您在默认端口上运行了一个空的本地 Milvus 实例，请使用示例 Python 脚本在实例中生成一些数据。您可以根据需要对脚本进行必要的更改。

获取 [脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。然后运行脚本以生成数据。请确保已安装 [PyMilvus](https://pypi.org/project/pymilvus/)，即官方的 Milvus Python SDK。

```shell
python example/prepare_data.py
```

这一步是可选的。如果您跳过这一步，请确保您的 Milvus 实例中已经有数据。

## 备份数据

请注意，对 Milvus 实例运行 Milvus Backup 通常不会影响实例的运行。在备份或恢复期间，您的 Milvus 实例完全可用。

{{tab}}

运行以下命令以创建备份。

```shell
./milvus-backup create -n <backup_name>
```

一旦命令执行，您可以在 Minio 设置中指定的存储桶中检查备份文件。具体来说，您可以使用 **Minio Console** 或 **mc** 客户端下载它们。

要从 [Minio Console](https://min.io/docs/minio/kubernetes/upstream/administration/minio-console.html) 下载，请登录 Minio Console，找到 `minio.address` 中指定的存储桶，选择存储桶中的文件，然后单击 **Download** 下载它们。

如果您更喜欢使用 [mc 客户端](https://min.io/docs/minio/linux/reference/minio-mc.html#mc-install)，请按照以下步骤操作：

```shell
# 配置 Minio 主机
mc alias set my_minio https://<minio_endpoint> <accessKey> <secretKey>

# 列出可用的存储桶
mc ls my_minio

# 递归下载存储桶
mc cp --recursive my_minio/<your-bucket-path> <local_dir_path>
```

现在，您可以将备份文件保存在安全的地方，以便将来恢复，或者将它们上传到 [Zilliz Cloud](https://cloud.zilliz.com) 以使用您的数据创建托管的向量数据库。有关详细信息，请参考 [从 Milvus 迁移到 Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x)。

## 恢复数据

{{tab}}

您可以使用 `-s` 标志运行 `restore` 命令，通过从备份中恢复数据来创建一个新的集合：

```shell
./milvus-backup restore -n my_backup -s _recover
```

`-s` 标志允许您为要创建的新集合设置一个后缀。上述命令将在您的 Milvus 实例中创建一个名为 **hello_milvus_recover** 的新集合。

如果您更喜欢在不更改名称的情况下恢复备份的集合，在从备份中恢复它之前删除该集合。您现在可以通过运行以下命令来清除 [准备数据](#Prepare-data) 中生成的数据。

```shell
python example/clean_data.py
```

Then run the following command to restore the data from the backup.

```shell
./milvus-backup restore -n my_backup
```

## Verify restored data

Once the restore completes, you can verify the restored data by indexing the restored collection as follows:

```shell
python example/verify_data.py
```

Note that the above script assumes that you have run the `restore` command with the `-s` flag and the suffix is set to `-recover`. Feel free to make necessary changes to the script to fit your need.
