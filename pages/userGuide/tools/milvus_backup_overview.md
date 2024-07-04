

                
# Milvus 备份

Milvus 备份是一个工具，允许用户备份和恢复 Milvus 数据。它提供了 CLI 和 API 来适应不同的应用场景。

## 先决条件

在开始使用 Milvus 备份之前，请确保

- 操作系统是 CentOS 7.5+或 Ubuntu LTS 18.04+，
- Go 版本为 1.20.2 或更高版本。

## 架构

![Milvus 备份架构图](/assets/milvus_backup_architecture.png)

Milvus 备份方便在 Milvus 实例之间备份和恢复元数据、段和数据。它提供了 CLI、API 和基于 gRPC 的 Go 模块等上层界面，可灵活地操作备份和恢复过程。

Milvus 备份从源 Milvus 实例中读取集合元数据和段来创建备份。然后，它将集合数据从源 Milvus 实例的根路径复制并保存到备份根路径中。

要从备份中恢复，Milvus 备份在目标 Milvus 实例中基于备份中的集合元数据和段信息创建一个新的集合。然后，它将备份数据从备份根路径复制到目标实例的根路径。

## 最新版本发布


                
                
                
- [v{{var.milvus_backup_release}}](https://github.com/zilliztech/milvus-backup/releases/tag/v{{var.milvus_backup_release}})

