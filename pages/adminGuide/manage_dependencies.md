---
title:  管理依赖
---

# 管理依赖

Milvus 利用第三方依赖来实现对象、元数据和消息存储。配置第三方依赖有两种主要方式。

- 对象存储：Milvus 支持使用 MinIO 或 S3 作为对象存储。
  - [使用 Docker Compose/Helm 配置对象存储](deploy_s3.md)
  - [使用 Milvus Operator 配置对象存储](object_storage_operator.md)
- 元数据存储：Milvus 使用 etcd 作为元数据存储。
  - [使用 Docker Compose/Helm 配置元数据存储](deploy_etcd.md)
  - [使用 Milvus Operator 配置元数据存储](meta_storage_operator.md)
- 消息存储：Milvus 支持使用 Pulsar、Kafka 或 RocksMQ 作为消息存储。
  - [使用 Docker Compose/Helm 配置消息存储](deploy_pulsar.md)
  - [使用 Milvus Operator 配置消息存储](message_storage_operator.md)