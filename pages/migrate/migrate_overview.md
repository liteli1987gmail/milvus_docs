---
title: MilvusDM 数据迁移

---

# 概览
[MilvusDM](https://github.com/milvus-io/milvus-tools)（Milvus数据迁移）是一个专为Milvus设计的开源工具，用于导入和导出数据。MilvusDM允许您迁移特定集合或分区中的数据。

<div class="alert note">
目前，MilvusDM仅支持Milvus 1.x版本。
</div>

为了大幅提高数据管理效率并降低DevOps成本，MilvusDM支持以下迁移通道：
- [Milvus到Milvus](m2m.md)：在Milvus实例之间迁移数据。
- [Faiss到Milvus](f2m.md)：将Faiss的未压缩数据导入到Milvus。
- [HDF5到Milvus](h2m.md)：将HDF5文件导入到Milvus。
- [Milvus到HDF5](m2h.md)：将Milvus中的数据保存为HDF5文件。

![MilvusDM](/milvusdm.jpeg "MilvusDM.")

MilvusDM托管在GitHub上。要安装MilvusDM，请运行：
```
pip3 install pymilvusdm
```

## MilvusDM文件结构
下面的流程图显示了MilvusDM如何根据接收到的.yaml文件执行不同任务：

![文件结构](/file_structure.png "MilvusDM文件结构.")

MilvusDM文件结构：

- pymilvusdm
  - core
    - **milvus_client.py**：在Milvus中执行客户端操作。
    - **read_data.py**：读取本地驱动器上的HDF5文件。（在这里添加您的代码以支持读取其他格式的数据文件。）
    - **read_faiss_data.py**：读取Faiss数据文件。
    - **read_milvus_data.py**：读取Milvus数据文件。
    - **read_milvus_meta.py**：读取Milvus元数据。
    - **data_to_milvus.py**：根据.yaml文件中的指定创建集合或分区，并将向量及其相应的ID导入到Milvus中。
    - **save_data.py**：将数据保存为HDF5文件。
    - **write_logs.py**：在运行时写入`debug`/`info`/`error`日志。
  - **faiss_to_milvus.py**：将Faiss数据导入到Milvus。
  - **hdf5_to_milvus.py**：将HDF5文件导入到Milvus。
  - **milvus_to_milvus.py**：从源Milvus迁移数据到目标Milvus。
  - **milvus_to_hdf5.py**：将Milvus数据保存为HDF5文件。
  - **main.py**：根据接收到的.yaml文件执行任务。
  - **setting.py**：存储MilvusDM操作的配置。
- **setup.py**：创建并上传pymilvusdm文件包到PyPI（Python包索引）。

## 增强计划
在未来的版本中，MilvusDM将提供更多新功能，包括MilvusDump和MilvusRestore，以支持导出所有Milvus数据，恢复指定集合和分区中的数据，恢复中断的下载等。

<div class="alert note">
MilvusDM项目在<a href="https://github.com/milvus-io/milvus-tools">GitHub</a>上是开源的。欢迎对项目做出任何贡献。给它一个星星🌟，并随时<a href="https://github.com/milvus-io/milvus-tools/issues">提交问题</a>或提交您自己的代码！
</div>