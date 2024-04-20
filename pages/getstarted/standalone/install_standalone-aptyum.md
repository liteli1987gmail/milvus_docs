---

id: install_standalone-aptyum.md
label: DEB/RPM
related_key: 安装
order: 3
group: install_standalone-docker.md
summary: 学习如何使用dpkg/yum在Linux系统上安装Milvus独立版。
title: 使用dpkg/yum安装Milvus独立版
---

{{tab}}

# 使用dpkg/yum安装Milvus独立版

本主题描述了如何在Linux系统上使用包管理器dpkg或yum安装Milvus独立版。

## 先决条件

在安装之前，请检查[硬件和软件要求](prerequisite-docker.md)。

## 安装Milvus

### 在Ubuntu上使用dpkg安装Milvus

```bash
$ wget https://github.com/milvus-io/milvus/releases/download/v2.3.10/milvus_2.3.10-1_amd64.deb
$ sudo apt-get update
$ sudo dpkg -i milvus_2.3.10-1_amd64.deb
$ sudo apt-get -f install
```

### 在RedHat9上使用yum安装Milvus

```bash
$ sudo yum install -y https://github.com/milvus-io/milvus/releases/download/v2.3.10/milvus-2.3.10-1.el9.x86_64.rpm
```

## 检查Milvus状态

```bash
$ sudo systemctl restart milvus
$ sudo systemctl status milvus
```

## 连接到Milvus

请参阅[Hello Milvus](https://milvus.io/docs/example_code.md)，然后运行示例代码。

## 卸载Milvus

### 在Ubuntu上卸载Milvus

```bash
$ sudo dpkg -P milvus
```

### 在RedHat9上卸载Milvus

```bash
$ sudo yum remove -y milvus
```

## 接下来做什么

安装了Milvus后，你可以：

- 查看[Hello Milvus](quickstart.md)，使用不同的SDK运行示例代码，了解Milvus的功能。
- 查看[内存索引](index.md)，了解更多关于CPU兼容的索引类型。

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