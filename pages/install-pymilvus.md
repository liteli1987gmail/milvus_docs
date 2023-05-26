安装Milvus Python SDK
===================

本主题介绍了如何为Milvus安装Python SDK pymilvus。

当前版本的Milvus支持Python、Node.js、GO和Java的SDK。

需求
--

* 需要 Python 3.7 或更高版本。

* 需要安装 Google protobuf。您可以使用命令 `pip3 install protobuf==3.20.0` 进行安装。

* 需要安装 grpcio-tools。您可以使用命令 `pip3 install grpcio-tools` 进行安装。

通过pip安装PyMilvus
---------------

PyMilvus可以在[Python包索引](https://pypi.org/project/pymilvus/)中获取。

建议安装与你所安装的Milvus服务器版本相匹配的PyMilvus版本。更多信息请参见[发布说明](release_notes.md)。

```bash
$ python3 -m pip install pymilvus==2.2.8

```

验证安装
----

如果PyMilvus正确安装，则运行以下命令时不会引发任何异常。

```bash
$ python3 -c "from pymilvus import Collection"

```

接下来是什么
------

安装了 PyMilvus 后，您可以：

* 学习 Milvus 的基本操作：

	+ [连接到 Milvus 服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)

* 探索[PyMilvus API 参考文档](/api-reference/pymilvus/v2.2.8/About.md)
