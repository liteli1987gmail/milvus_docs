---
title: Milvus备份
---

# Milvus备份

Milvus备份是一个允许用户备份和恢复Milvus数据的工具。它提供了命令行界面（CLI）和应用程序编程接口（API），以适应不同的应用场景。

## 先决条件

在使用Milvus备份之前，请确保：

- 操作系统是CentOS 7.5+或Ubuntu LTS 18.04+，
- Go语言版本是1.20.2或更高。

## 架构

![Milvus备份架构](..//milvus_backup_architecture.png)

Milvus备份支持对Milvus实例中的元数据、段和数据进行备份和恢复。它为备份和恢复过程提供了多种操作接口，如命令行界面、API和基于gRPC的Go模块。

Milvus备份从源Milvus实例中读取集合元数据和段，以创建备份。然后，它从源Milvus实例的根路径复制集合数据，并将复制的数据保存到备份的根路径。

要从备份中恢复，Milvus备份根据备份中的集合元数据和段信息，在目标Milvus实例中创建一个新的集合。然后，它将备份数据从备份的根路径复制到目标实例的根路径。

## 最新版本

- [v{{var.milvus_backup_release}}](https://github.com/zilliztech/milvus-backup/releases/tag/v{{var.milvus_backup_release}})