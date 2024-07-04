


# 使用 Docker Compose 安装 Milvus 独立版

本主题介绍了如何使用 Docker Compose 安装 Milvus 独立版。

## 前提条件

- 检查你的机器上是否已安装 [Docker 和 Docker Compose](https://docs.docker.com/compose/install/)。
- 在安装 Milvus 之前，请先检查 [硬件和软件要求](/getstarted/prerequisite-docker.md)。

  - 对于使用 MacOS 10.14 或更高版本的用户，请将 Docker 虚拟机（VM）设置为至少使用 2 个虚拟 CPU（vCPU）和 8 GB 的初始内存，否则可能安装失败。

## 步骤

按照以下步骤使用 Docker Compose 安装 Milvus 独立版：

### 下载 `YAML` 文件

手动 [下载](https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml) `milvus-standalone-docker-compose.yml`，并将其另存为 `docker-compose.yml`，或使用以下命令进行下载。

```shell
$ wget https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml -O docker-compose.yml
```

### 启动 Milvus

在包含 `docker-compose.yml` 文件的目录中，通过以下命令启动 Milvus：

```shell
$ sudo docker compose up -d
```

<div class="alert note">

如果上述命令运行失败，请检查你的系统是否安装了 Docker Compose V1。如果是这种情况，建议你迁移到 Docker Compose V2，详细信息请参阅 [此页面](https://docs.docker.com/compose/) 中的注意事项。

</div>

```text
Creating milvus-etcd  ... done
Creating milvus-minio ... done
Creating milvus-standalone ... done
```

## 验证安装

现在，检查容器是否正在运行。

```shell
$ sudo docker compose ps
```

在 Milvus 独立版启动后，将会有三个 Docker 容器正在运行，其中包括 Milvus 独立版服务及其两个依赖项。

```
      Name                     Command                  State                            Ports
--------------------------------------------------------------------------------------------------------------------
milvus-etcd         etcd -advertise-client-url ...   Up             2379/tcp, 2380/tcp
milvus-minio        /usr/bin/docker-entrypoint ...   Up (healthy)   9000/tcp
milvus-standalone   /tini -- milvus run standalone   Up             0.0.0.0:19530->19530/tcp, 0.0.0.0:9091->9091/tcp
```

### 连接到 Milvus

验证 Milvus 服务器监听的本地端口。使用你自己的容器名称替换上述命令中的容器名称。

```bash
$ docker port milvus-standalone 19530/tcp
```

请参考 [Hello Milvus](https://milvus.io/docs/example_code.md)，然后运行示例代码。

## 停止 Milvus

要停止 Milvus 独立版，请运行：
```
sudo docker compose down
```

要在停止 Milvus 后删除数据，请运行：
```
sudo rm -rf  volumes
```

## 下一步操作

 


安装了 Milvus 之后，你可以：
- 查看 [Hello Milvus](/getstarted/quickstart.md) 以使用不同的 SDK 运行示例代码，了解 Milvus 的功能。
- 查看 [In-memory Index](/reference/index.md) 以了解更多关于与 CPU 兼容的索引类型的信息。
- 学习 Milvus 的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)
- 探索 [Milvus Backup](/userGuide/tools/milvus_backup_overview.md)，这是一个用于 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，这是一个用于调试 Milvus 和动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，这是一个直观的 Milvus 管理的开源 GUI 工具。
- [使用 Prometheus 监控 Milvus](/adminGuide/monitor/monitor.md)

