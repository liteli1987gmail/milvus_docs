


# 使用 Docker 安装 Milvus 独立版

本主题介绍了如何使用 Docker 安装 Milvus 独立版。

## 准备工作

- [安装 Docker](https://docs.docker.com/get-docker/)。

- 在安装之前，请先查看硬件和软件的要求。

## 使用 Docker 安装 Milvus 独立版

- 启动 Milvus。
```
wget https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh
bash standalone_embed.sh start
```

- 连接到 Milvus
请参阅 [快速入门](/getstarted/quickstart.md)，然后运行示例代码。

- 停止 Milvus

要停止 Milvus 独立版，请运行：
```
bash standalone_embed.sh stop
```

要在停止 Milvus 后删除数据，请运行：
```
bash standalone_embed.sh delete
```

## 下一步




已安装 Milvus 后，你可以进行以下操作：

- 查看 [Hello Milvus](/getstarted/quickstart.md) 以使用不同的 SDK 运行示例代码，了解 Milvus 的功能。
- 查看 [In-memory Index](/reference/index.md) 了解更多关于与 CPU 兼容的索引类型的信息。

- 学习 Milvus 的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- 探索 [Milvus Backup](/userGuide/tools/milvus_backup_overview.md)，这是一个用于进行 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，这是一个用于调试 Milvus 和进行动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，这是一个直观的 Milvus 管理 GUI 工具。
- [使用 Prometheus 监控 Milvus](/adminGuide/monitor/monitor.md)

