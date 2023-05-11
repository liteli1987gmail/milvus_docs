
Milvus Backup 是一款允许用户备份和还原 Milvus 数据的工具。它提供了 CLI 和 API 两种方式，以适配不同的应用场景。

先决条件
----

在开始使用Milvus备份之前，请确保

* 操作系统为CentOS 7.5+或Ubuntu LTS 18.04+，

* Go版本为1.20.2或更高版本。

架构
-----------

[![Milvus备份架构](https://milvus.io/static/929f9d6efecbe5e3fc0c4e9a3b864a64/1263b/milvus_backup_architecture.png "Milvus备份架构")](https://milvus.io/static/929f9d6efecbe5e3fc0c4e9a3b864a64/9f57c/milvus_backup_architecture.png)

Milvus Backup 可以在 Milvus 实例之间备份和还原元数据、分片和数据。它提供了北向接口（CLI、API 和基于 gRPC 的 Go 模块），以灵活地操作备份和还原流程。

Milvus Backup 从源 Milvus 实例中读取集合元数据和分片信息以创建备份，然后将源 Milvus 实例的集合数据从根路径复制到备份根路径并保存备份。

为恢复备份，Milvus Backup 在目标 Milvus 实例中基于备份中的集合元数据和段信息创建一个新的集合。然后将备份数据从备份根路径复制到目标实例的根路径。

最新版本
----

* [v0.2.2](https://github.com/zilliztech/milvus-backup/releases/tag/v0.2.2)
