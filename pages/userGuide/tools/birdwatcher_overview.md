


# Birdwatcher

Milvus 是一个无状态向量数据库，它将读操作和写操作分离，并使用 etcd 作为状态的单一源。所有的协调者在进行任何更改之前，都必须从 etcd 查询状态。一旦用户需要检查或清理状态，他们就需要一个与 etcd 通信的工具。这就是 Birdwatcher 的作用。

Birdwatcher 是 Milvus 的一个调试工具。使用它连接到 etcd，你可以检查 Milvus 系统的状态或即时配置它。

## 先决条件

- 你已经安装了 [Go 1.18 或更高版本](https://go.dev/doc/install)。

## 架构

![Birdwatcher 架构](/assets/birdwatcher_overview.png)

## 最新发布版本



# 


[Release v1.0.2](https://github.com/milvus-io/birdwatcher/releases/tag/v{{var.birdwatcher_release}}) 
