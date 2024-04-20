---

id: 安装独立Docker版Milvus.md
label: Docker
related_key: Docker
order: 0
group: 安装独立Docker版Milvus.md
summary: 学习如何使用Docker安装Milvus独立版。
title: 使用Docker安装Milvus独立版
---

{{tab}}

# 使用Docker安装Milvus独立版

本主题描述了如何使用Docker安装Milvus独立版。

## 先决条件

- [安装Docker](https://docs.docker.com/get-docker/)。

- 在安装之前，请检查[硬件和软件要求](prerequisite-helm.md)。

## 使用Docker安装Milvus独立版

- 启动Milvus。
```
wget https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh
bash standalone_embed.sh start
```

- 连接到Milvus
请参阅[快速入门](https://milvus.io/docs/quickstart.md)，然后运行示例代码。

- 停止Milvus

要停止Milvus独立版，请运行：
```
bash standalone_embed.sh stop
```

在停止Milvus后删除数据，请运行：
```
bash standalone_embed.sh delete
```

## 接下来做什么

安装Milvus后，你可以：

- 查看[Hello Milvus](quickstart.md)，使用不同的SDK运行示例代码，了解Milvus能做什么。
- 查看[内存索引](index.md)，了解更多关于CPU兼容的索引类型。

- 学习Milvus的基本操作：
  - [管理数据库](manage_databases.md)
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、上插和删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)

- 探索[Milvus备份](milvus_backup_overview.md)，一个用于Milvus数据备份的开源工具。
- 探索[Birdwatcher](birdwatcher_overview.md)，一个用于调试Milvus和动态配置更新的开源工具。
- 探索[Attu](https://milvus.io/docs/attu.md)，一个用于直观管理Milvus的开源GUI工具。
- [使用Prometheus监控Milvus](monitor.md)