---

id: cli_overview.md
summary: Milvus 命令行界面（CLI）是一个支持数据库连接、数据操作以及数据导入导出的命令行工具。
title: Milvus 命令行界面
---
# Milvus 命令行界面

Milvus 命令行界面（CLI）是一个支持数据库连接、数据操作以及数据导入导出的命令行工具。它基于 [Milvus Python SDK](https://github.com/milvus-io/pymilvus)，允许您通过终端使用交互式命令行提示执行命令。

## 推荐版本

在下面的表格中，您可以根据您使用的 Milvus 版本找到推荐的 PyMilvus 和 Milvus_CLI 版本。

|  Milvus   | PyMilvus | Milvus_CLI |
| :-------: | :------: | :--------: |
|   1.0.x   |  1.0.1   |     x      |
|   1.1.x   |  1.1.2   |     x      |
| 2.0.0-RC1 | 2.0.0rc1 |     x      |
| 2.0.0-RC2 | 2.0.0rc2 |   0.1.3    |
| 2.0.0-RC4 | 2.0.0rc4 |   0.1.4    |
| 2.0.0-RC5 | 2.0.0rc5 |   0.1.5    |
| 2.0.0-RC6 | 2.0.0rc6 |   0.1.6    |
| 2.0.0-RC7 | 2.0.0rc7 |   0.1.7    |
| 2.0.0-RC8 | 2.0.0rc8 |   0.1.8    |
| 2.0.0-RC9 | 2.0.0rc9 |   0.1.9    |
|   2.1.0   |  2.1.0   |   0.3.0    |
|   2.2.x   |  2.2.x   |   0.4.0    |
|   2.3.x   |  2.3.x   |   0.4.2    |

<div class="alert note">由于存储格式的更改，Milvus 2.0.0-RC7 及以后的版本与 2.0.0-RC6 及以前的版本不向后兼容。</div>

## 当前版本

Milvus_CLI 的当前版本是 0.4.2。
要查找您已安装的版本并查看是否需要更新，请运行 `milvus_cli --version`。