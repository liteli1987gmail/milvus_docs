


# 管理依赖

Milvus 使用第三方依赖来进行对象、元数据和消息的存储。有两种主要的配置第三方依赖的方法。

- 对象存储: Milvus 支持使用 MinIO 或 S3 来进行对象存储。
  - [使用 Docker Compose/Helm 配置对象存储](/adminGuide/deploy_s3.md)
  - [使用 Milvus Operator 配置对象存储](/adminGuide/object_storage_operator.md)
- 元数据存储: Milvus 使用 etcd 进行元数据存储。
  - [使用 Docker Compose/Helm 配置元数据存储](/adminGuide/deploy_etcd.md)
  - [使用 Milvus Operator 配置元数据存储](/adminGuide/meta_storage_operator.md)
- 消息存储: Milvus 支持使用 Pulsar、Kafka 或 RocksMQ 进行消息存储。
  - [使用 Docker Compose/Helm 配置消息存储](/adminGuide/deploy_pulsar.md)
  - [使用 Milvus Operator 配置消息存储](/adminGuide/message_storage_operator.md)
 