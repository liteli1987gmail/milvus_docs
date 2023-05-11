Milvus备份
===

Milvus Backup 提供数据备份和还原功能, 以确保您的 Milvus 数据的安全。

获取Milvus备份
----------

你可以下载编译好的二进制文件，也可以从源代码进行构建。

要下载编译好的二进制文件，请前往[发布页面](https://github.com/zilliztech/milvus-backup/releases)，在那里你可以找到所有官方发布的版本。请记住，始终使用标记为**Latest**的发布中的二进制文件。

要从源代码进行构建，请执行以下操作：

```
git clone git@github.com:zilliztech/milvus-backup.git
go get
go build

```

准备配置文件
------

下载[示例配置文件](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)并根据需要进行调整。

然后在下载或构建的Milvus备份二进制文件旁边创建一个名为`configs`的文件夹，并将配置文件放在`configs`文件夹中。

你的文件夹结构应该类似于以下内容：

```

workspace
├── milvus-backup
└── configs
     └── backup.yaml

```

由于Milvus备份不能将数据备份到本地路径，因此在调整配置文件时，请确保Minio设置正确。

默认的Minio存储桶名称随Milvus的安装方式而异。在更改Minio设置时，请参考以下表格。

| field | Docker Compose | Helm / Milvus Operator |
| --- | --- | --- |
| `bucketName` | a-bucket | milvus-bucket |
| `rootPath` | files | file |

启动API服务器
--------

然后你可以按以下方式启动API服务器：

```
./milvus-backup server

```

The API server listens on port 8080 by default. You can change it by running it with the `-p` flag. To start the API server listening on port 443, do as follows:

```
./milvus-backup server -p 443

```

You can access the Swagger UI using <http://localhost:>/api/v1/docs/index.

Prepare data
------------

如果您在默认端口19530上运行了一个空的本地Milvus实例，请使用示例Python脚本在您的实例中生成一些数据。随意对脚本进行必要的更改以适应您的需求。

获取[脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。然后运行脚本生成数据。确保已安装[PyMilvus](https://pypi.org/project/pymilvus/)，官方Milvus Python SDK。

```
python example/prepare_data.py

```

此步骤是可选的。如果您跳过此步骤，请确保您的Milvus实例中已经有一些数据。

备份数据
----

[Install with Docker Compose](attu_install-docker.md)[Install with Helm Chart](attu_install-helm.md)[Install with Package](attu_install-package.md)
Note that running Milvus Backup against a Milvus instance will not normally affect the running of the instance. Your Milvus instance is fully functional during backup or restore.

Run the following command to create a backup. Change `collection_names` and `backup_name` if necessary.

```
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

Once the command is executed, you can list the backups in the bucket specified in the Minio settings as follows:

```
curl --location --request GET 'http://localhost:8080/api/v1/list' \
--header 'Content-Type: application/json'

```

And download the backup files as follows:

```
curl --location --request GET 'http://localhost:8080/api/v1/get_backup?backup_id=<test_backup_id>&backup_name=my_backup' \
--header 'Content-Type: application/json'

```

While running the above command, change `backup_id` and `backup_name` to the one returned by the list API.

Now, you can save the backup files to a safe place for restoration in the future, or upload them to [Zilliz Cloud](https://cloud.zilliz.com) to create a managed vector database with your data. For details, refer to [Migrate from Milvus to Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x).

Restore data
------------

[Install with Docker Compose](attu_install-docker.md)[Install with Helm Chart](attu_install-helm.md)[Install with Package](attu_install-package.md)
You can call the restore API command with a `collection_suffix` option to create a new collection by restoring the data from the backup. Change `collection_names` and `backup_name` if necessary.

```
curl --location --request POST 'http://localhost:8080/api/v1/restore' \
--header 'Content-Type: application/json' \
--data-raw '{
    "async": true,
    "collection_names": [
    "hello_milvus"
  ],
    "collection_suffix": "_recover",
    "backup_name":"my_backup"
}'

```

The `collection_suffix` option allows you to set a suffix for the new collection to be created. The above command will create a new collection called **hello_milvus_recover** in your Milvus instance.

If you prefer to restore the backed-up collection without changing its name, drop the collection before restoring it from the backup. You can now clean the data generated in [Prepare data](#Prepare-data) by running the following command.

```
python example/clean_data.py

```

Then run the following command to restore the data from the backup.

```
curl --location --request POST 'http://localhost:8080/api/v1/restore' \
--header 'Content-Type: application/json' \
--data-raw '{
    "async": true,
    "collection_names": [
    "hello_milvus"
  ],
    "collection_suffix": "",
    "backup_name":"my_backup"
}'

```

The restore process can be time-consuming depending on the size of the data to be restored. Therefore, all restore tasks are running asynchronously. You can check the status of a restore task by running:

```
curl --location --request GET 'http://localhost:8080/api/v1/get_restore?id=<test_restore_id>' \
--header 'Content-Type: application/json'

```

Remember to change `test_restore_id` to the one restored by the restore API.

Verify restored data
--------------------

一旦恢复完成，您可以通过以下方式将恢复的集合索引化以验证恢复后的数据：

```
python example/verify_data.py

```

请注意，上述脚本假设您已经使用`-s`标志运行了`restore`命令，并将后缀设置为`-recover`。随意更改脚本以适应您的需求。

