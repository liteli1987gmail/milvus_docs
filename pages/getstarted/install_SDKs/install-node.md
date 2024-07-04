


# 安装 Milvus Nodejs SDK

本主题介绍了如何为 Milvus 安装 Milvus Node.js SDK。

## 兼容性

以下集合显示了 Milvus 版本和推荐 @zilliz/milvus2-sdk-node 版本：

| Milvus 版本 | 推荐的 @zilliz/milvus2-sdk-node 版本 |
| :---------: | :----------------------------------: |
|   2.3.x     |               2.3.x                 |
|   2.2.x     |               2.2.x                 |
|   2.1.x     |               2.1.x                 |
|   2.0.1     |         2.0.0, 2.0.1                |
|   2.0.0     |               2.0.0                 |

## 要求

Node.js v12+

## 安装

使用 npm (Node 包管理器) 在你的项目中安装依赖项是使用 Milvus Node.js 客户端的推荐方法。

```javascript
npm install @zilliz/milvus2-sdk-node
# or ...
yarn add @zilliz/milvus2-sdk-node
```

这将下载 Milvus Node.js SDK 并在你的 package.json 文件中添加一个依赖项。

## 下一步操作





已安装 Milvus Node.js SDK 后，你可以：

- 查看 [milvus node.js sdk 的快速入门](https://github.com/milvus-io/milvus-sdk-node)
- 学习 Milvus 的基本操作：
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- 浏览 [ Milvus Node.js API 参考](/api-reference/node/v{{var.milvus_node_sdk_version}}/About.md)

