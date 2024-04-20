---
title：使用Docker Compose安装Milvus独立模式
---

{{tab}}

# 使用Docker Compose安装Milvus独立模式

本主题描述了如何使用Docker Compose安装Milvus独立模式。

## 前提条件

- 检查您的机器上是否安装了[Docker和Docker Compose](https://docs.docker.com/compose/install/)。
- 在安装Milvus之前，检查[硬件和软件要求](prerequisite-docker.md)。

  - 对于使用MacOS 10.14或更高版本的用户，将Docker虚拟机（VM）设置为至少使用2个虚拟CPU（vCPUs）和8 GB的初始内存。否则，安装可能会失败。

## 步骤

要使用Docker Compose安装Milvus独立模式，请按照以下步骤操作：

### 下载`YAML`文件

[下载](https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml) `milvus-standalone-docker-compose.yml` 并手动将其保存为 `docker-compose.yml`，或使用以下命令。

```shell
$ wget https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml -O docker-compose.yml
```

### 启动Milvus

在包含 `docker-compose.yml` 的目录中，通过运行以下命令启动Milvus：

```shell
$ sudo docker compose up -d
```

<div class="alert note">

如果上述命令无法运行，请检查您的系统是否安装了Docker Compose V1。如果是这样，建议您根据[此页面](https://docs.docker.com/compose/)上的说明迁移到Docker Compose V2。

</div>

```text
Creating milvus-etcd  ... done
Creating milvus-minio ... done
Creating milvus-standalone ... done
```

## 验证安装

现在检查容器是否正在运行。

```shell
$ sudo docker compose ps
```

Milvus独立模式启动后，将有三个Docker容器在运行，包括Milvus独立模式服务及其两个依赖项。

```
      Name                     Command                  State                            Ports
--------------------------------------------------------------------------------------------------------------------
milvus-etcd         etcd -advertise-client-url ...   Up             2379/tcp, 2380/tcp
milvus-minio        /usr/bin/docker-entrypoint ...   Up (healthy)   9000/tcp
milvus-standalone   /tini -- milvus run standalone   Up             0.0.0.0:19530->19530/tcp, 0.0.0.0:9091->9091/tcp
```

### 连接到Milvus

验证Milvus服务器正在监听的本地端口。将容器名称替换为您自己的。

```bash
$ docker port milvus-standalone 19530/tcp
```

请参阅[Hello Milvus](https://milvus.io/docs/example_code.md)，然后运行示例代码。

## 停止Milvus

要停止Milvus独立模式，运行：
```
sudo docker compose down
```

停止Milvus后要删除数据，运行：
```
sudo rm -rf  volumes
```

## 接下来做什么

安装了Milvus后，您可以：
- 查看[Hello Milvus](quickstart.md)，使用不同的SDK运行示例代码，看看Milvus能做什么。
- 查看[内存索引](index.md)以了解更多关于CPU兼容的索引类型。
- 学习Milvus的基本操作：
  - [管理数据库](manage_databases.md)
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、更新和删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)
- 探索[Milvus备份](milvus_backup_overview.md)，一个用于Milvus数据备份的开源工具。
- 探索[Birdwatcher](birdwatcher_overview.md)，一个用于调试Milvus和动态配置更新的开源工具。
- 探索[Attu](https://milvus.io/docs/attu.md)，一个用于直观管理Milvus的开源GUI工具。
- [使用Prometheus监控Milvus](monitor.md)