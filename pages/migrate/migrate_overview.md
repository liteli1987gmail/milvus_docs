---
id: migrate_overview.md
summary: MilvusDM allows data migration between Milvus and many other sources of data.
title: Overview
---

# 概览

[MilvusDM](https://github.com/milvus-io/milvus-tools)（Milvus 数据迁移）是一个专为 Milvus 设计的开源工具，用于导入和导出数据。MilvusDM 允许您迁移特定集合或分区中的数据。

<div class="alert note">
目前，MilvusDM仅支持Milvus 1.x版本。
</div>

为了大幅提高数据管理效率并降低 DevOps 成本，MilvusDM 支持以下迁移通道：

- [Milvus 到 Milvus](m2m.md)：在 Milvus 实例之间迁移数据。
- [Faiss 到 Milvus](f2m.md)：将 Faiss 的未压缩数据导入到 Milvus。
- [HDF5 到 Milvus](h2m.md)：将 HDF5 文件导入到 Milvus。
- [Milvus 到 HDF5](m2h.md)：将 Milvus 中的数据保存为 HDF5 文件。

![MilvusDM](/milvusdm.jpeg "MilvusDM.")

MilvusDM 托管在 GitHub 上。要安装 MilvusDM，请运行：

```
pip3 install pymilvusdm
```

## MilvusDM 文件结构

下面的流程图显示了 MilvusDM 如何根据接收到的.yaml 文件执行不同任务：

![文件结构](/file_structure.png "MilvusDM文件结构.")

MilvusDM 文件结构：

- pymilvusdm
  - core
    - **milvus_client.py**：在 Milvus 中执行客户端操作。
    - **read_data.py**：读取本地驱动器上的 HDF5 文件。（在这里添加您的代码以支持读取其他格式的数据文件。）
    - **read_faiss_data.py**：读取 Faiss 数据文件。
    - **read_milvus_data.py**：读取 Milvus 数据文件。
    - **read_milvus_meta.py**：读取 Milvus 元数据。
    - **data_to_milvus.py**：根据.yaml 文件中的指定创建集合或分区，并将向量及其相应的 ID 导入到 Milvus 中。
    - **save_data.py**：将数据保存为 HDF5 文件。
    - **write_logs.py**：在运行时写入`debug`/`info`/`error`日志。
  - **faiss_to_milvus.py**：将 Faiss 数据导入到 Milvus。
  - **hdf5_to_milvus.py**：将 HDF5 文件导入到 Milvus。
  - **milvus_to_milvus.py**：从源 Milvus 迁移数据到目标 Milvus。
  - **milvus_to_hdf5.py**：将 Milvus 数据保存为 HDF5 文件。
  - **main.py**：根据接收到的.yaml 文件执行任务。
  - **setting.py**：存储 MilvusDM 操作的配置。
- **setup.py**：创建并上传 pymilvusdm 文件包到 PyPI（Python 包索引）。

## 增强计划

在未来的版本中，MilvusDM 将提供更多新功能，包括 MilvusDump 和 MilvusRestore，以支持导出所有 Milvus 数据，恢复指定集合和分区中的数据，恢复中断的下载等。

<div class="alert note">
MilvusDM项目在<a href="https://github.com/milvus-io/milvus-tools">GitHub</a>上是开源的。欢迎对项目做出任何贡献。给它一个星星🌟，并随时<a href="https://github.com/milvus-io/milvus-tools/issues">提交问题</a>或提交您自己的代码！
</div>
