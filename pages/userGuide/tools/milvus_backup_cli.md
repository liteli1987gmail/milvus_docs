

# 使用命令备份和恢复数据

Milvus Backup 提供了数据备份和恢复功能，以确保你的 Milvus 数据的安全性。

## 获取 Milvus Backup

你可以下载已编译的二进制文件或从源代码构建。

要下载已编译的二进制文件，请转到 [发布界面](https://github.com/zilliztech/milvus-backup/releases)，你可以在那里找到所有官方发布的文件。请记住，始终使用标记为 **最新** 的发布版本中的二进制文件。

要从源代码构建，请执行以下步骤：

```shell
git clone git@github.com:zilliztech/milvus-backup.git
go get
go build
```

## 准备配置文件

下载 [示例配置文件](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)，并根据你的需要进行调整。

然后在下载或构建的 Milvus Backup 二进制文件旁边创建一个名为 `configs` 的文件夹，并将配置文件放在 `configs` 文件夹中。

你的文件夹结构应类似于以下内容：

<pre>
workspace
├── milvus-backup
└── configs
     └── backup.yaml
</pre>

由于 Milvus Backup 无法将数据备份到本地路径，请确保在调整配置文件时 Minio 设置是正确的。

<div class="alert note">

默认的 Minio 存储桶名称因安装 Milvus 的方式而异。在更改 Minio 设置时，请参考以下表格。

| 字段             | Docker Compose | Helm / Milvus Operator |
| --------------- | -------------- | ---------------------- |
| `bucketName`    | a-bucket       | milvus-bucket          |
| `rootPath`      | files          | file                   |

</div>

## 准备数据

如果你在默认端口运行空的本地 Milvus 实例，请使用示例 Python 脚本在实例中生成一些数据。随意对脚本进行必要的修改以适应你的需求。

获取 [示例脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。然后运行脚本生成数据。确保已安装 [PyMilvus](https://pypi.org/project/pymilvus/)，官方的 Milvus Python SDK。

```shell
python example/prepare_data.py
```

此步骤是可选的。如果跳过此步骤，请确保在 Milvus 实例中已经有一些数据。

## 备份数据

注意，对 Milvus 实例运行 Milvus Backup 通常不会影响实例的运行。在备份或恢复期间，你的 Milvus 实例将完全正常运作。

{{tab}}

运行以下命令创建一个备份。

```shell
./milvus-backup create -n <backup_name>
```

执行该命令后，你可以在 Minio 设置中指定的存储桶中检查备份文件。具体而言，你可以使用 **Minio Console** 或 **mc** 客户端下载这些文件。

要从 [Minio 控制台](https://min.io/docs/minio/kubernetes/upstream/administration/minio-console.html) 下载，请登录 Minio 控制台，找到 `minio.address` 中指定的存储桶，选择存储桶中的文件，然后单击 **下载** 进行下载。

如果你喜欢使用 [mc 客户端](https://min.io/docs/minio/linux/reference/minio-mc.html#mc-install)，按如下方式操作：

```shell
# 配置 Minio 主机
mc alias set my_minio https://<minio_endpoint> <accessKey> <secretKey>

# 列出可用的存储桶
mc ls my_minio

# 递归下载存储桶
mc cp --recursive my_minio/<your-bucket-path> <local_dir_path>
```

现在，你可以将备份文件保存到安全位置以备将来恢复，或者上传到 [Zilliz 云端](https://cloud.zilliz.com) 以使用你的数据创建托管向量数据库。有关详细信息，请参阅 [Migrate from Milvus to Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x)。

## 恢复数据





{{tab}}

你可以使用 `-s` 标志运行 `恢复` 命令，从备份恢复数据以创建一个新的集合：

```shell
./milvus-backup restore -n my_backup -s _recover
```

`-s` 标志允许你为要创建的新集合设置后缀。以上命令将在你的 Milvus 实例中创建一个名为 **hello_milvus_recover** 的新集合。

如果你希望恢复备份的集合而不更改其名称，请在从备份中还原之前删除该集合。你现在可以通过运行以下命令清除在 [准备数据](#Prepare-data) 中生成的数据。

```shell
python example/clean_data.py
```

然后运行以下命令从备份中恢复数据。

```shell
./milvus-backup restore -n my_backup
```

## 验证恢复后的数据




一旦还原完成，你可以通过以下方式对还原的集合进行索引，以验证恢复的数据：

```shell
python example/verify_data.py
```

请注意，上述脚本假设你已经使用 `-s` 标志运行了 `restore` 命令，并且后缀设置为 `-recover`。请根据需要对脚本进行必要的更改。



