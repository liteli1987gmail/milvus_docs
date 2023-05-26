安装Milvus Node.js SDK
====================

本主题介绍如何为Milvus安装Milvus Node.js SDK。

兼容性
---

以下列出了Milvus的版本和推荐的@zilliz/milvus2-sdk-node版本：

| Milvus version | Recommended @zilliz/milvus2-sdk-node version |
| --- | --- |
| 2.2.x | 2.2.x |
| 2.1.x | 2.1.x |
| 2.0.1 | 2.0.0, 2.0.1 |
| 2.0.0 | 2.0.0 |

需求
--

Node.js v12+

安装
--

使用npm（Node包管理器）在您的项目中安装Milvus Node.js客户端的推荐方法。

```bash
npm install @zilliz/milvus2-sdk-node
# or ...
yarn add @zilliz/milvus2-sdk-node

```

这将下载Milvus Node.js SDK并在您的package.json文件中添加一个依赖项条目。

下一步
---

安装了Milvus Node.js SDK之后，您可以：

* 查看[milvus node.js sdk快速入门](https://github.com/milvus-io/milvus-sdk-node)

* 了解Milvus的基本操作：

	+ [连接Milvus服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)

* 探索[Milvus Node.js API参考](/api-reference/node/v2.2.x/About.md)
