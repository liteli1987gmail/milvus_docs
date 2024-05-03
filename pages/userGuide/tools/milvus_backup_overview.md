---
id: milvus_backup_overview.md
summary: Milvus-Backup is a tool that allows users to backup and restore Milvus data.
title: Milvus Backup
---

# Milvus 备份

Milvus 备份是一个允许用户备份和恢复 Milvus 数据的工具。它提供了命令行界面（CLI）和应用程序编程接口（API），以适应不同的应用场景。

## 先决条件

在使用 Milvus 备份之前，请确保：

- 操作系统是 CentOS 7.5+或 Ubuntu LTS 18.04+，
- Go 语言版本是 1.20.2 或更高。

## 架构

![Milvus备份架构](..//milvus_backup_architecture.png)

Milvus 备份支持对 Milvus 实例中的元数据、段和数据进行备份和恢复。它为备份和恢复过程提供了多种操作接口，如命令行界面、API 和基于 gRPC 的 Go 模块。

Milvus 备份从源 Milvus 实例中读取集合元数据和段，以创建备份。然后，它从源 Milvus 实例的根路径复制集合数据，并将复制的数据保存到备份的根路径。

要从备份中恢复，Milvus 备份根据备份中的集合元数据和段信息，在目标 Milvus 实例中创建一个新的集合。然后，它将备份数据从备份的根路径复制到目标实例的根路径。

## 最新版本

- [v{{var.milvus_backup_release}}](https://github.com/zilliztech/milvus-backup/releases/tag/v{{var.milvus_backup_release}})
