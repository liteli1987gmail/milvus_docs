安装Milvus Java SDK
=================

本主题介绍了如何为Milvus安装Java SDK。

当前版本的Milvus支持Python、Node.js、GO和Java的SDK。

需求
--

* Java（8或更高版本）

* Apache Maven或Gradle / Grails

安装Milvus Java SDK
-----------------

运行以下命令安装Milvus Java SDK。

* Apache Maven

```bash
<dependency>
    <groupId>io.milvus</groupId>
    <artifactId>milvus-sdk-java</artifactId>
    <version>2.2.5</version>
</dependency>

```

* Gradle/Grails

```bash
compile 'io.milvus:milvus-sdk-java:2.2.5'

```

接下来是什么
------

安装 Milvus Java SDK 后，您可以:

* 学习 Milvus 的基本操作：

	+ [连接到 Milvus 服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)

* 探索[Milvus Java API参考](/api-reference/java/v2.2.5/About.md)
