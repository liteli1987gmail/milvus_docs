

                
# 使用 API 备份和恢复数据

Milvus Backup 提供了数据备份和还原功能，以确保你的 Milvus 数据的安全性。

## 获取 Milvus Backup

你可以下载已编译的二进制文件或者从源代码进行构建。

要下载已编译的二进制文件，请转到 [release](https://github.com/zilliztech/milvus-backup/releases) 页面，你可以在此找到所有官方发布的版本。请记住，始终使用标记为 **Latest** 的发布中的二进制文件。

要从源代码进行构建，请执行以下步骤：

```shell
git clone git@github.com:zilliztech/milvus-backup.git
go get
go build
```

## 准备配置文件

下载 [示例配置文件](https://raw.githubusercontent.com/zilliztech/milvus-backup/master/configs/backup.yaml)，并根据你的需求进行修改。

然后，在下载或构建的 Milvus Backup 二进制文件旁边创建一个名为“configs”的文件夹，并将配置文件放在“configs”文件夹中。

你的文件夹结构应类似于以下示例：

<pre>
workspace
├── milvus-backup
└── configs
     └── backup.yaml
</pre>

因为 Milvus Backup 无法将数据备份到本地路径，请确保调整配置文件时 Minio 设置正确。

<div class="alert note">

默认的 Minio 存储桶名称因 Milvus 安装方式而异。在对 Minio 设置进行更改时，请参考以下表格。

| 字段           | Docker Compose | Helm / Milvus Operator |
| --------------- | -------------- | ---------------------- |
| `bucketName`    | a-bucket       | milvus-bucket          |
| `rootPath`      | files          | file                   |          

</div>

## 启动 API 服务器

然后可以按如下方式启动 API 服务器：

```shell
./milvus-backup server
```

API 服务器默认监听 8080 端口。可以通过使用“-p”标志运行以更改端口。要启动侦听在 443 端口上的 API 服务器，请执行如下命令：

```shell
./milvus-backup server -p 443
```

你可以使用 http://localhost: <port>/api/v1/docs/index.html 访问 Swagger UI。

## 准备数据

如果你在默认端口 19530 上运行一个空的本地 Milvus 实例，请使用示例的 Python 脚本在实例中生成一些数据。请随时根据你的需求对脚本进行必要的更改。

获取 [脚本](https://raw.githubusercontent.com/zilliztech/milvus-backup/main/example/prepare_data.py)。然后运行脚本生成数据。请确保已经安装了 [PyMilvus](https://pypi.org/project/pymilvus/)，官方的 Milvus Python SDK。

```shell
python example/prepare_data.py
```

此步骤是可选的。如果你跳过此步骤，请确保已经在 Milvus 实例中有一些数据。

## 备份数据



注意，对 Milvus 实例运行 Milvus 备份通常不会影响实例的运行。在备份或恢复过程中，你的 Milvus 实例是完全功能的。

运行以下命令创建备份。根据需要更改 `collection_names` 和 `backup_name`。

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

执行命令后，可以使用 Minio 设置中指定的存储桶列表备份文件，如下所示：

```shell
curl --location --request GET 'http://localhost:8080/api/v1/list' \
--header 'Content-Type: application/json'
```

按照以下方式下载备份文件：

```shell
curl --location --request GET 'http://localhost:8080/api/v1/get_backup?backup_id=<test_backup_id>&backup_name=my_backup' \
--header 'Content-Type: application/json'
```

在运行上述命令时，请将 `backup_id` 和 `backup_name` 更改为列表 API 返回的值。

现在，你可以将备份文件保存在安全的位置以供将来恢复，或者将其上传到 [Zilliz Cloud](https://cloud.zilliz.com) 以使用你的数据创建托管的向量数据库。详细信息请参见 [Migrate from Milvus to Zilliz Cloud](https://zilliz.com/doc/migrate_from_milvus-2x)。

## 恢复数据

你可以使用 `collection_suffix` 选项调用恢复 API 命令，通过从备份中恢复数据创建一个新集合。根据需要更改 `collection_names` 和 `backup_name`。

```shell
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

`collection_suffix` 选项允许你为即将创建的新集合设置后缀。上述命令将在你的 Milvus 实例中创建一个名为 **hello_milvus_recover** 的新集合。

如果你希望在从备份中恢复集合时不更改其名称，请在恢复之前删除该集合。你现在可以通过运行以下命令清除 [准备数据](#Prepare-data) 中生成的数据。

```shell
python example/clean_data.py
```

然后运行以下命令从备份中还原数据。

```shell
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

还原过程的耗时取决于要还原的数据的大小。因此，所有还原任务都是异步运行的。你可以通过运行以下命令来检查还原任务的状态：

```shell
curl --location --request GET 'http://localhost:8080/api/v1/get_restore?id=<test_restore_id>' \
--header 'Content-Type: application/json'
```

记得将 `test_restore_id` 更改为还原 API 还原的值。

## 验证恢复的数据



一旦还原完成后，你可以通过将还原的集合索引化来验证还原的数据，如下所示：

```shell
python example/verify_data.py
```

请注意，上述脚本假设你已经使用 `-s` 标志运行了 `restore` 命令，并且后缀设置为 `-recover`。根据需要对脚本进行必要的更改。

