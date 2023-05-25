Milvus备份
===
Milvus Backup 提供数据备份和还原功能, 以确保您的 Milvus 数据的安全。

获取Milvus备份
----------

你可以下载已编译的二进制文件，也可以从源代码构建。

要下载已编译的二进制文件，请转到[发布](https://github.com/zilliztech/milvus-backup/releases)页面，您可以在其中找到所有官方发布版本。请记住，始终使用标记为**最新**的发布版本中的二进制文件。

要从源代码编译，请执行以下操作：

```python
git clone git@github.com:zilliztech/milvus-backup.git
go get
go build

```

准备配置文件
------

下载[示例配置文件](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)，并根据需要进行修改。

然后，在下载或构建的Milvus备份二进制文件旁边创建一个名为`configs`的文件夹，并将配置文件放在`configs`文件夹中。

您的文件夹结构应该与以下相似：

```python

workspace
├── milvus-backup
└── configs
     └── backup.yaml

```

由于Milvus备份无法将数据备份到本地路径，请在调整配置文件时确保Minio设置正确。

默认Minio存储桶的名称因安装Milvus的方式而异。在更改Minio设置时，请参考以下表格。

| field | Docker Compose | Helm / Milvus Operator |
| --- | --- | --- |
| `bucketName` | a-bucket | milvus-bucket |
| `rootPath` | files | file |

准备数据
----

如果您在默认端口下运行空的本地Milvus实例，请使用示例Python脚本在实例中生成一些数据。随意更改脚本以适应您的需求。

获取[脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。运行脚本生成数据。确保已安装[PyMilvus](https://pypi.org/project/pymilvus/)，官方Milvus Python SDK。

```python
python example/prepare_data.py

```

此步骤是可选的。如果跳过此步骤，请确保Milvus实例中已有一些数据。

备份数据
----

Note that running Milvus Backup against a Milvus instance will not normally affect the running of the instance. Your Milvus instance is fully functional during backup or restore.

[Install with Docker Compose](attu_install-docker.md)[Install with Helm Chart](attu_install-helm.md)[Install with Package](attu_install-package.md)
Run the following command to create a backup.

```python
./milvus-backup create -n <backup_name>

```

Once the command is executed, you can check the backup files in the bucket specified in the Minio settings. Specifically, you can download them using **Minio Console** or the **mc** client.

To download from [Minio Console](https://min.io/docs/minio/kubernetes/upstream/administration/minio-console）, log into Minio Console, locate the bucket specified in `minio.address`, select the files in the bucket, and click **Download** to download them.

If you prefer [the mc client](https://min.io/docs/minio/linux/reference/minio-mc#mc-install), do as follows:

```python
# configure a Minio host
mc alias set my_minio https://<minio_endpoint> <accessKey> <secretKey>

# List the available buckets
mc ls my_minio

# Download a bucket recursively
mc cp --recursive my_minio/<your-bucket-path> <local_dir_path>

```

Now, you can save the backup files to a safe place for restoration in the future, or upload them to [Zilliz Cloud](https://cloud.zilliz.com) to create a managed vector database with your data. For details, refer to [Migrate from Milvus to Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x).

Restore data
------------

[Install with Docker Compose](attu_install-docker.md)[Install with Helm Chart](attu_install-helm.md)[Install with Package](attu_install-package.md)
You can run the `restore` command with the `-s` flag to create a new collection by restoring the data from the backup:

```python
./milvus-backup restore -n my_backup -s _recover

```

The `-s` flag allows you to set a suffix for the new collection to be created. The above command will create a new collection called **hello_milvus_recover** in your Milvus instance.

If you prefer to restore the backed-up collection without changing its name, drop the collection before restoring it from the backup. You can now clean the data generated in [Prepare data](#Prepare-data) by running the following command.

```python
python example/clean_data.py

```

Then run the following command to restore the data from the backup.

```python
./milvus-backup restore -n my_backup

```

验证恢复的数据
-------

恢复完成后，您可以按以下方式将恢复的集合索引以验证恢复的数据：

```python
python example/verify_data.py

```

请注意，上述脚本假定您已经使用`restore`命令并设置了`-s`标志，并且后缀设置为`-recover`。随时根据您的需要更改脚本。

