


# 从 Faiss 迁移至 Milvus

本主题介绍如何使用 [MilvusDM](/migrate/migrate_overview.md)，一个专为 Milvus 数据迁移而设计的开源工具，将数据从 Faiss 导入到 Milvus。

## 先决条件

在迁移 Milvus 数据之前，你需要 [安装 MilvusDM](/migrate/milvusdm_install.md)。

## 1. 下载 YAML 文件

下载 `F2M.yaml` 文件。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2M.yaml
```

## 2. 设置参数

配置参数包括：

| 参数              | 描述                       | 示例                 |
| ----------------- | -------------------------- | -------------------- |
| `milvus_version`  | Milvus 的版本               | 2.0.0                |
| `data_path`       | Faiss 数据的路径            | '/home/user/data/faiss.index'    |
| `data_dir`        | HDF5 文件所在的目录。设置 `data_path` 或 `data_dir` 中的一个              | '/Users/zilliz/Desktop/HDF5_data'    |
| `dest_host`       | Milvus 服务器地址           | '127.0.0.1'          |
| `dest_port`       | Milvus 服务器端口           | 19530                |
| `mode`            | 迁移模式，包括 `skip`、`append` 和 `overwrite`。仅当指定的集合名称在 Milvus 库中存在时，此参数有效。<br/> <li> `skip` 表示如果指定的集合或分区已存在，则跳过数据迁移。</li> <li> `append` 表示如果指定的集合或分区已存在，则追加数据。</li> <li> `overwrite` 表示如果指定的集合或分区已存在，则在插入之前删除现有数据。</li> | 'append'             |
| `dest_collection_name` | 导入数据的集合名称                 | 'test'               |
| `dest_partition_name`（可选）  | 导入数据的分区名称             | 'partition'          |
| `collection_parameter` | 集合特定的信息，包括向量维度、索引文件大小和相似度度量方法               | "dimension: 512 <br/> index_file_size: 1024 <br/> metric_type: 'HAMMING'" |

### 示例

以下是配置示例供你参考。

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

## 3. 从 Faiss 迁移数据至 Milvus

运行 MilvusDM 使用以下命令将数据从 Faiss 迁移到 Milvus。

```
$ milvusdm --yaml F2M.yaml
```

## 下一步操作




- 如果你有兴趣将其他形式的数据迁移到 Milvus 中，
  - 学习如何从 HDF5 迁移到 Milvus 的方法 [h2m](/adminGuide/backup/h2m.md)。
- 如果你想了解从 Milvus 1.x 迁移到 Milvus 2.0 的信息，
  - 学习版本迁移方法 [m2m](/adminGuide/m2m.md)。
- 如果你对数据迁移工具感兴趣，
  - 阅读 [MilvusDM](/migrate/migrate_overview.md) 的概述。

