---
id: 安装-Go-SDK.md
label: 安装Go SDK
related_key: SDK
summary: 学习如何安装Milvus的Go SDK。
title: 安装Milvus Go SDK
---

# 安装Milvus Go SDK

本主题描述了如何为Milvus安装Go SDK。

当前版本的Milvus支持Python、Node.js、Go和Java的SDK。

## 要求

需要Go（1.15或更高版本）。

## 安装Milvus Go SDK

通过`go get`安装Milvus Go SDK及其依赖项。

```bash
$ go get -u github.com/milvus-io/milvus-sdk-go/v2
```

## 接下来做什么

安装了Milvus Go SDK后，您可以：

- 学习Milvus的基本操作：
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、更新和删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)