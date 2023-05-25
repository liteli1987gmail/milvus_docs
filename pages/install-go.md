安装 Milvus Go SDK
================

本主题介绍了如何为 Milvus 安装 Go SDK。

当前版本的 Milvus 支持 Python、Node.js、GO 和 Java SDK。

需求
--

需要GO (1.15或更高版本)。

安装Milvus GO SDK
---------------

通过`go get`安装Milvus GO SDK及其依赖项。

```python
$ go get -u github.com/milvus-io/milvus-sdk-go/v2

```

What's next
-----------

安装 Milvus GO SDK 后，您可以：

* 学习 Milvus 的基本操作：
	+ [连接 Milvus 服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)
