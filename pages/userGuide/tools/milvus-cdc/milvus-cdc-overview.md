
---
title: Milvus-CDC 概览
---

# 概览

Milvus-CDC 是一个用户友好的工具，可以捕获并同步 Milvus 实例中的增量数据。它通过无缝地在源实例和目标实例之间传输数据，确保业务数据的可靠性，便于进行增量备份和灾难恢复。

## 主要功能

- **顺序数据同步**：通过在 Milvus 实例之间顺序同步数据变更，确保数据的完整性和一致性。

- **增量数据复制**：从源 Milvus 复制增量数据（包括插入和删除），到目标 Milvus，提供持久化存储。

- **CDC 任务管理**：允许通过 OpenAPI 请求管理 CDC 任务，包括创建、查询状态和删除 CDC 任务。

此外，我们计划在未来扩展我们的能力，包括支持与流处理系统的集成。

## 架构

Milvus-CDC 采用了一个包含两个主要组件的架构 - 一个 HTTP 服务器用于管理任务和元数据，以及一个 __corelib__ 用于与读取器同步任务执行，该读取器从源 Milvus 实例获取数据，写入器将处理后的数据发送到目标 Milvus 实例。

![milvus-cdc-architecture](../..//milvus-cdc-architecture.png)

在前面的图中，

- **HTTP 服务器**：处理用户请求，执行任务并维护元数据。它作为 Milvus-CDC 系统内任务编排的控制平面。

- **Corelib**：负责实际的任务同步。它包括一个读取器组件，该组件从源 Milvus 的 etcd 和消息队列（MQ）中检索信息，以及一个写入器组件，该组件将 MQ 中的消息转换为 Milvus 系统的 API 参数，并将这些请求发送到目标 Milvus 以完成同步过程。

## 工作流程

Milvus-CDC 数据处理流程涉及以下步骤：

1. **任务创建**：用户通过 HTTP 请求启动 CDC 任务。

2. **元数据检索**：系统从源 Milvus 的 etcd 中获取特定于集合的元数据，包括集合的通道和检查点信息。

3. **MQ 连接**：有了元数据，系统连接到 MQ 开始订阅数据流。

4. **数据处理**：从 MQ 读取数据，解析数据，并使用 Go SDK 传递，或处理以复制在源 Milvus 中执行的操作。

![milvus-cdc-workflow](../..//milvus-cdc-workflow.png)

## 限制

- **增量数据同步**：目前，Milvus-CDC 设计为仅同步增量数据。如果您的业务需要完整的数据备份，请 [联系我们](https://milvus.io/community) 寻求帮助。

- **同步范围**：目前，Milvus-CDC 可以同步集群级别的数据。我们正在努力在即将发布的版本中增加对集合级别数据同步的支持。

- **支持的 API 请求**：Milvus-CDC 目前支持以下 API 请求。我们计划在未来的版本中扩展对其他请求的支持：

    - 创建/删除集合

    - 插入/删除/更新

    - 创建/删除分区

    - 创建/删除索引

    - 加载/释放/刷新

    - 加载/释放分区

    - 创建/删除数据库