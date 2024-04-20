---

id: m2m.md
title: 版本迁移
related_key: 版本迁移
summary: 使用 MilvusDM 进行版本迁移。
---

# 版本迁移
本主题描述了如何使用 [MilvusDM](migrate_overview.md)，一个专门为 Milvus 数据迁移设计的开源工具，将数据从 Milvus 1.x 迁移到 Milvus 2.0。

<div class="alert note">
MilvusDM 不支持从 Milvus 2.0 独立版迁移数据到 Milvus 2.0 集群版。
</div>


## 前提条件

在迁移 Milvus 数据之前，您需要 [安装 MilvusDM](milvusdm_install.md)。

## 1. 下载 YAML 文件

下载 `M2M.yaml` 文件。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml
```

## 2. 设置参数

配置参数包括：

| 参数                       | 描述                                   | 示例                        |
| ------------------------- | -------------------------------------- | --------------------------- |
| `milvus_version`          | Milvus 的版本。                       | 2.0.0                       |
| `data_path`               | HDF5 文件的路径。设置 `data_path` 或 `data_dir` 中的一个。                      | - /Users/zilliz/float_1.h5 <br/> - /Users/zilliz/float_2.h5                   |
| `data_dir`                | HDF5 文件的目录。设置 `data_path` 或 `data_dir` 中的一个。                      | '/Users/zilliz/Desktop/HDF5_data'                     |
| `dest_host`               | Milvus 服务器地址。                      | '127.0.0.1'     |
| `dest_port`               | Milvus 服务器端口。                       | 19530                      |
| `mode`                    | 迁移模式，包括 `skip`、`append` 和 `overwrite`。当指定的集合名称在 Milvus 库中已存在时，此参数有效。 <br/> <li>`skip` 表示如果指定的集合或分区已存在，则跳过数据迁移。</li> <li>`append` 表示如果指定的集合或分区已存在，则追加数据。</li> <li>`overwrite` 表示如果指定的集合或分区已存在，则在插入前删除现有数据。</li>                    | 'append'                     |
| `dest_collection_name`    | 导入数据的目标集合名称。                      | 'test_float'                       |
| `dest_partition_name` (可选) | 导入数据的目标分区名称。                  | 'partition_1'                 |
| `collection_parameter`    | 集合特定信息，包括向量维度、索引文件大小和相似度度量。                      | "dimension: 512 <br/> index_file_size: 1024 <br/> metric_type: 'HAMMING'"                     |

以下两个配置示例供您参考。第一个示例涉及设置 `mysql_parameter`。如果您在 Milvus 1.x 中不使用 MySQL 管理向量 ID，请参考第二个示例。

### 示例 1

```
M2M:
  milvus_version: 2.0.0
  source_milvus_path: '/home/user/milvus'
  mysql_parameter:
    host: '127.0.0.1'
    user: 'root'
    port: 3306
    password: '123456'
    database: 'milvus'
  source_collection: # 指定 'test' 集合的 'partition_1' 和 'partition_2' 分区。
    test:
      - 'partition_1'
      - 'partition_2'
  dest_host: '127.0.0.1'
  dest_port: 19530
  mode: 'skip' # 'skip/append/overwrite'
```

### 示例 2

```
M2M:
  milvus_version: 2.0.0
  source_milvus_path: '/home/user/milvus'
  mysql_parameter:
  source_collection: # 指定名为 'test' 的集合。
    test:
  dest_host: '127.0.0.1'
  dest_port: 19530
  mode: 'skip' # 'skip/append/overwrite'
```

## 3. 从 Milvus 迁移数据到 Milvus

使用以下命令运行 MilvusDM，将数据从 Milvus 1.x 导入到 Milvus 2.0。

```
$ milvusdm --yaml M2M.yaml
```

## 接下来做什么
- 如果您对将其他形式的数据迁移到 Milvus 感兴趣，
  - 了解如何 [从 Fa