[MilvusDM](https://github.com/milvus-io/milvus-tools)（Milvus 数据迁移）是一款专门设计用于 Milvus 数据的导入和导出的开源工具。MilvusDM 可以让您迁移集合或分区中的数据。

目前, MilvusDM 只支持 Milvus 1.x 版本。

为了大幅提高数据管理效率并降低 DevOps 成本, MilvusDM 支持以下迁移通道:

* [Milvus 到 Milvus](m2m.md)：迁移 Milvus 实例之间的数据。
* [Faiss 到 Milvus](f2m.md)：将未压缩的数据从 Faiss 导入 Milvus。
* [HDF5 到 Milvus](h2m.md)：将 HDF5 文件导入 Milvus。
* [Milvus 到 HDF5](m2h.md)：将 Milvus 中的数据保存为 HDF5 文件。

![MilvusDM](https://milvus.io/static/3b224d1193182c304307ece0312bef4e/0a251/milvusdm.jpg "MilvusDM.")

MilvusDM。

MilvusDM 托管在 GitHub 上。要安装 MilvusDM，请运行：

```
pip3 install pymilvusdm

```

MilvusDM 文件结构
------------------

下面的流程图显示了 MilvusDM 根据其接收到的 .yaml 文件执行不同任务的方式：

![文件结构](https://milvus.io/static/b8b58708d690e58cc8b667032e33cce5/1263b/file_structure.png "MilvusDM 文件结构。")

MilvusDM 文件结构。

MilvusDM 文件结构：

* pymilvusdm
	+ **core**：
		- **milvus_client.py**：在 Milvus 中执行客户端操作。
		- **read_data.py**：读取本地驱动器上的 HDF5 文件。（在此处添加代码以支持读取其他格式的数据文件。）
		- **read_faiss_data.py**：读取 Faiss 数据文件。
		- **read_milvus_data.py**：读取 Milvus 数据文件。
		- **read_milvus_meta.py**：读取 Milvus 元数据。
		- **data_to_milvus.py**：根据 .yaml 文件中指定的方式创建集合或分区，并将向量及其对应的 ID 导入 Milvus。
		- **save_data.py**：将数据保存为 HDF5 文件。
		- **write_logs.py**：在运行时编写 `debug`/`info`/`error` 日志。
	+ **faiss_to_milvus.py**：将 Faiss 数据导入 Milvus。
	+ **hdf5_to_milvus.py**：将 HDF5 文件导入 Milvus。
	+ **milvus_to_milvus.py**：从源 Milvus 迁移数据到目标 Milvus。
	+ **milvus_to_hdf5.py**：将 Milvus 数据保存为 HDF5 文件。
	+ **main.py**：根据接收到的 .yaml 文件执行任务。
	+ **setting.py**：存储 MilvusDM 操作的配置。
* **setup.py**: 创建并上传 pymilvusdm 文件包到 PyPI（Python 包索引）。

增强计划
----------

在未来的版本中，MilvusDM 将提供更多的新特性，包括 MilvusDump 和 MilvusRestore 支持导出所有 Milvus 数据、恢复指定集合和分区中的数据、恢复中断的下载等。

MilvusDM 项目已在 [GitHub](https://github.com/milvus-io/milvus-tools) 上开源。欢迎为该项目做出贡献。给它点个赞 🌟，随时 [提交问题](https://github.com/milvus-io/milvus-tools/issues) 或提交您自己的代码！
