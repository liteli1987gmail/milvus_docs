---
id: f2m.md
title: 从 Faiss 迁移到 Milvus
related_key: Faiss, 迁移，导入
summary: 学习如何将 Faiss 数据迁移到 Milvus。
---

# 从 Faiss 迁移数据到 Milvus

本主题描述了如何使用 [MilvusDM](migrate_overview.md) 将数据从 Faiss 导入到 Milvus，MilvusDM 是专为 Milvus 数据迁移设计的一款开源工具。

## 前提条件

在迁移 Milvus 数据之前，您需要 [安装 MilvusDM](milvusdm_install.md)。

## 1. 下载 YAML 文件

下载 `F2M.yaml` 文件。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2M.yaml
```

## 2. 设置参数

配置参数包括：

| 参数                     | 描述                                   | 示例                      |
| ------------------------- | ----------------------------------------- | ---------------------------- |
| `milvus_version`          | Milvus 的版本。                       | 2.0.0                     |
| `data_path`               | Faiss 中数据的路径。                   | '/home/user/data/faiss.index'                   |
| `data_dir`         |  HDF5 文件的目录。设置 `data_path` 或 `data_dir` 中的一个。                      | '/Users/zilliz/Desktop/HDF5_data'                     |
| `dest_host`          |  Milvus 服务器地址。                      | '127.0.0.1'     |
| `dest_port`          |  Milvus 服务器端口。                       | 19530                      |
| `mode`         |  迁移模式，包括 `skip`、`append` 和 `overwrite`。当指定的集合名称已存在于 Milvus 库中时，此参数才有效。 <br/> <li>`skip` 指如果指定的集合或分区已存在，则跳过数据迁移。</li> <li>`append` 指如果指定的集合或分区已存在，则追加数据。</li> <li>`overwrite` 指如果指定的集合或分区已存在，则在插入前删除现有数据。</li>                    | 'append'                     |
| `dest_collection_name`          | 要导入数据的集合的名称。                      | 'test'                       |
| `dest_partition_name` (可选)        |  要导入数据的分区的名称。                   | 'partition'                 |
| `collection_parameter`         |  集合特定信息，包括向量维度、索引文件大小和相似性度量。                      | "dimension: 512 <br/> index_file_size: 1024 <br/> metric_type: 'HAMMING'"                     |

### 示例

以下配置示例供您参考。

```
F2M:
  milvus_version: 2.0.0
  data_path: '/home/data/faiss1.index'
  dest_host: '127.0.0.1'
  dest_port: 19530
  mode: 'append'
  dest_collection_name: 'test'
  dest_partition_name: ''
  collection_parameter:
    dimension: 256
    index_file_size: 1024
    metric_type: 'L2'
```


## 3. 从 Faiss 迁移数据到 Milvus

使用以下命令运行 MilvusDM 将数据从 Faiss 导入到 Milvus。

```
$ milvusdm --yaml F2M.yaml
```

## 接下来做什么
- 如果您对将其他形式的数据迁移到 Milvus 感兴趣，
  - 学习如何 [从 HDF5 迁移数据到 Milvus](h2m.md)。
- 如果您正在寻找有关如何从 Milvus 1.x 迁移数据到 Milvus 2.0 的信息，
  - 学习 [版本迁移](m2m.md)。
- 如果您对了解更多关于数据迁移工具的信息感兴趣，
  - 阅读 [MilvusDM](migrate_overview.md) 的概述。