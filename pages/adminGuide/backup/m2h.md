


# 从 Milvus 迁移到 HDF5

你可以使用 [MilvusDM](/migrate/migrate_overview.md) 将 Milvus 中的数据保存为 HDF5 文件。

1. 下载 **M2H.yaml**：

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml
```

2. 设置以下参数：
- `source_milvus_path`：Milvus 的工作目录。
- `mysql_parameter`：Milvus 的 MySQL 设置。如果未使用 MySQL，请将此参数设置为空。
- `source_collection`：Milvus 中集合及其分区的名称。
- `data_dir`：保存 HDF5 文件的目录。

示例：
```
M2H:
  milvus_version: 2.x
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
  data_dir: '/home/user/data'
```

3. 运行 MilvusDM：
```
$ milvusdm --yaml M2H.yaml
```

## 示例代码




1. 从 Milvus 根据指定集合或分区的元数据中的向量和对应的 ID 中，读取本地驱动器上 **milvus/db** 下的数据：

```
collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(self.milvus_meta, collection_name, partition_tag)
```

2. 将获取的数据保存为 HDF5 文件：

```
data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
```

