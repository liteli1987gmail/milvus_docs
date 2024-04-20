---

id: install-node.md
label: 安装 Node.js SDK
related_key: SDK
summary: 学习如何安装 Milvus 的 Node.js SDK。
title: 安装 Milvus Node.js SDK

---

# 安装 Milvus Node.js SDK

本主题描述了如何为 Milvus 安装 Node.js SDK。

## 兼容性

以下表格展示了 Milvus 版本和推荐的 @zilliz/milvus2-sdk-node 版本：

| Milvus 版本 | 推荐的 @zilliz/milvus2-sdk-node 版本 |
| :------------: | :------------------------------------------: |
|     2.3.x      |                    2.3.x                     |
|     2.2.x      |                    2.2.x                     |
|     2.1.x      |                    2.1.x                     |
|     2.0.1      |                 2.0.0, 2.0.1                 |
|     2.0.0      |                    2.0.0                     |

## 要求

Node.js v12+

## 安装

使用 npm（Node 包管理器）通过以下命令在你的项目中安装依赖项，这是开始使用 Milvus node.js 客户端的推荐方式。

```javascript
npm install @zilliz/milvus2-sdk-node
# 或者 ...
yarn add @zilliz/milvus2-sdk-node
```

这将下载 Milvus node.js sdk 并在你的 package.json 文件中添加一个依赖项条目。

## 接下来做什么

安装了 Milvus Node.js SDK 后，你可以：

- 查看 [Milvus Node.js SDK 的快速开始](https://github.com/milvus-io/milvus-sdk-node)
- 学习 Milvus 的基本操作：
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、更新与删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)

- 探索 [Milvus Node.js API 参考](/api-reference/node/v{{var.milvus_node_sdk_version}}/About.md)