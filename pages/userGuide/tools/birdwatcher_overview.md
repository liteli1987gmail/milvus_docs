---

id: birdwatcher_overview.md
summary: Birdwatcher 是 Milvus 2.x 的调试工具。它连接到 etcd 并检查 Milvus 系统的状态。
title: Birdwatcher 概览
---
# Birdwatcher

Milvus 是一个无状态向量数据库，它分离了读写操作，并让 etcd 扮演状态单一来源的角色。所有协调器在对状态进行任何更改之前都必须从 etcd 查询状态。一旦用户需要检查或清理状态，他们需要一个工具来与 etcd 通信。这就是 Birdwatcher 出现的地方。

Birdwatcher 是 Milvus 的调试工具。使用它连接到 etcd，您可以检查您的 Milvus 系统的状态或即时配置它。

## 先决条件

- 您已经安装了 [Go 1.18 或更高版本](https://go.dev/doc/install)。

## 架构

![Birdwatcher 架构](..//birdwatcher_overview.png)

## 最新发布

[Release v1.0.2](https://github.com/milvus-io/birdwatcher/releases/tag/v{{var.birdwatcher_release}})