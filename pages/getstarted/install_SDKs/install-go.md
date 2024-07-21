# 安装 Milvus Go SDK

本文介绍如何安装 Milvus 的 Go SDK。

当前版本的 Milvus 支持 Python、Node.js、GO 和 Java 的 SDK。

## 要求

需要 GO（1.15 或更高版本）。

## 安装 Milvus Go SDK

通过 `go get` 命令安装 Milvus Go SDK 及其依赖项。

```bash
$ go get -u github.com/milvus-io/milvus-sdk-go/v2
```

## 下一步操作

安装了 Milvus GO SDK 之后，你可以：

- Learn the basic operations of Milvus:
  - [管理集合](Manage Collections.md)
  - [管理分区](Manage Partitions.md)
  - [插入、更新和删除](Insert, Upsert & Delete.md)
  - [单向量搜索](Single-Vector Search.md)
  - [多向量搜索](Multi-Vector Search.md)
