

# 安装了 Milvus 独立版的 dpkg/yum

本主题介绍如何在 Linux 系统上使用包管理器 dpkg 或 yum 安装 Milvus 独立版。

先决条件

在安装之前，请检查硬件和软件的要求。


### 安装 Milvus

在 Ubuntu 上使用 dpkg 安装 Milvus
```
$ wget https://github.com/milvus-io/milvus/releases/download/v2.3.10/milvus_2.3.10-1_amd64.deb 
$ sudo apt-get update
$ sudo dpkg -i milvus_2.3.10-1_amd64.deb
$ sudo apt-get -f install
```


### 在 RedHat9 上使用 yum 安装 Milvus
```
$ sudo yum install -y https://github.com/milvus-io/milvus/releases/download/v2.3.10/milvus-2.3.10-1.el9.x86_64.rpm 
```


### 检查 Milvus 的状态
```
$ sudo systemctl restart milvus
$ sudo systemctl status milvus
```


### 连接到 Milvus

请参阅“Hello Milvus”，然后运行示例代码。

卸载 Milvus

在 Ubuntu 上卸载 Milvus
```
$ sudo dpkg -P milvus
```

在 RedHat9 上卸载 Milvus
```
$ sudo yum remove -y milvus
```

### 接下来做什么


我安装了 Milvus 后，可以进行以下操作：

- 查看 [Hello Milvus](/getstarted/quickstart.md)，使用不同的 SDK 运行示例代码，了解 Milvus 的功能。
- 查看 [In-memory Index](/reference/index.md)，了解更多与 CPU 兼容的索引类型。

- 学习 Milvus 的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除数据](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- 探索 [Milvus Backup](/userGuide/tools/milvus_backup_overview.md)，一个用于 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，一个用于调试 Milvus 和动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，一个直观的 Milvus 管理 GUI 工具。
- 使用 Prometheus 监控 Milvus 的运行情况（monitor.md）。
