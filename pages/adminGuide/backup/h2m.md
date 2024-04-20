---
id: h2m.md
title: HDF5 到 Milvus
related_key: HDF5, 迁移，导入
summary: 将 HDF5 文件导入 Milvus。
---

# 从 HDF5 迁移数据到 Milvus

本主题描述了如何使用 [MilvusDM](migrate_overview.md) 将 HDF5 文件中的数据导入 Milvus，MilvusDM 是一个专为 Milvus 数据迁移设计开源工具。

## 前提条件

在迁移 Milvus 数据之前，您需要 [安装 MilvusDM](milvusdm_install.md)。

## 1. 下载 YAML 文件

下载 `M2H.yaml` 文件。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml
```

## 2. 设置参数

配置参数包括：

| 参数                      | 描述                                   | 示例                        |
| ------------------------- | -------------------------------------- | --------------------------- |
| `milvus_version`          | Milvus 的版本。                       | 2.0.0                       |
| `data_path`               | HDF5 文件的路径。设置 `data_path` 或 `data_dir` 之一。                      | - /Users/zilliz/float_1.h5 <br/> - /Users/zilliz/float_2.h5                   |
| `data_dir`         | HDF5 文件的目录。设置 `data_path` 或 `data_dir` 之一。                      | '/Users/zilliz/Desktop/HDF5_data'                     |
| `dest_host`          | Milvus 服务器地址。                      | '127.0.0.1'     |
| `dest_port`          | Milvus 服务器端口。                       | 19530                      |
| `mode`         | 迁移模式，包括 `skip`、`append` 和 `overwrite`。当指定的集合名称在 Milvus 库中已存在时，此参数有效。 <br/> <li>`skip` 表示如果指定的集合或分区已存在，则跳过数据迁移。</li> <li>`append` 表示如果指定的集合或分区已存在，则追加数据。</li> <li>`overwrite` 表示如果指定的集合或分区已存在，则在插入前删除现有数据。</li>                    | 'append'                     |
| `dest_collection_name`          | 导入数据的目标集合名称。                      | 'test_float'                       |
| `dest_partition_name` (可选)        |  导入数据的目标分区名称。                   | 'partition_1'                 |
| `collection_parameter`         | 集合特定信息，包括向量维度、索引文件大小和相似度度量。                      | "dimension: 512 <br/> index_file_size: 1024 <br/> metric_type: 'HAMMING'"                     |

以下是两个配置示例供您参考。第一个示例设置了参数 `data_path`，而第二个设置了 `data_dir`。您可以根据需要设置 `data_path` 或 `data_dir`。

### 示例 1

```
H2M:
  milvus-version: 2.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: '127.0.0.1'
  dest_port: 19530
  mode: 'overwrite'        # 'skip/append/overwrite'
  dest_collection_name: 'test_float'
  dest_partition_name: 'partition_1'
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: 'L2'
```

### 示例 2

```
H2M:
  milvus_version: 2.0.0
  data_path:
  data_dir: '/Users/zilliz/HDF5_data'
  dest_host: '127.0.0.1'
  dest_port: 19530
  mode: 'append'        # 'skip/append/overwrite'
  dest_collection_name: 'test_binary'
  dest_partition_name: 
  collection_parameter:
    dimension: 512
    index_file_size: 1024
    metric_type: 'HAMMING'
```

## 3. 从 HDF5 迁移数据到 Milvus

使用以下命令运行 MilvusDM，将 HDF5 文件中的数据导入 Milvus。

```
$ milvusdm --yaml H2M.yaml
```

## 接下来做什么
- 如果您对将其他形式的数据迁移到 Milvus 感兴趣，
  - 了解如何 [从 Faiss 迁移数据到 Milvus](f2m.md)。
- 如果您正在寻找有关如何从