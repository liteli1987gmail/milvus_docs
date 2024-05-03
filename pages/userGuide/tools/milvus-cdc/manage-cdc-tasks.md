---
id: manage-cdc-tasks.md
order: 3
summary: A Capture Data Change (CDC) task enables the synchronization of data from a source Milvus instance to a target Milvus instance.
title: Manage CDC Tasks
---

# 管理 CDC 任务

捕获数据变更（CDC）任务允许将数据从源 Milvus 实例同步到目标 Milvus 实例。它监控源的操作日志，并实时将数据变更（如插入、删除和索引操作）复制到目标。这有助于实现 Milvus 部署之间的实时灾难恢复或主动-主动负载均衡。

本指南介绍了如何通过 HTTP 请求管理 CDC 任务，包括创建、暂停、恢复、检索详细信息、列出和删除。

## 创建任务

创建 CDC 任务允许将源 Milvus 中的数据变更操作同步到目标 Milvus。

要创建 CDC 任务，请执行以下操作：

```bash
curl -X POST http://localhost:8444/cdc \
-H "Content-Type: application/json" \
-d '{
  "request_type": "create",
  "request_data": {
    "milvus_connect_param": {
      "host": "localhost",
      "port": 19530,
      "username": "root",
      "password": "Milvus",
      "enable_tls": false,
      "connect_timeout": 10
    },
    "collection_infos": [
      {
        "name": "*"
      }
    ],
    "rpc_channel_info": {
      "name": "by-dev-replicate-msg"
    }
  }
}'
```

将 **localhost** 替换为目标 Milvus 服务器的 IP 地址。

**参数**：

- **milvus_connect_param**: 目标 Milvus 的连接参数。

  - **host**: Milvus 服务器的主机名或 IP 地址。

  - **port**: Milvus 服务器监听的端口号。

  - **username**: 用于与 Milvus 服务器进行身份验证的用户名。

  - **password**: 用于与 Milvus 服务器进行身份验证的密码。

  - **enable_tls**: 是否使用 TLS/SSL 加密连接。

  - **connect_timeout**: 建立连接的超时时间（秒）。

- **collection_infos**: 要同步的集合。目前仅支持星号（\*），因为 Milvus-CDC 在集群级别同步，而不是单个集合。

- **rpc_channel_info**: 同步的 RPC 通道名称，由源 Milvus 配置中的 **common.chanNamePrefix.cluster** 和 **common.chanNamePrefix.replicateMsg** 的值连接而成，中间用连字符（-）分隔。

预期响应：

```json
{
  "code": 200,
  "data": {
    "task_id": "xxxx"
  }
}
```

## 列出任务

要列出所有已创建的 CDC 任务：

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "request_type": "list"
}' http://localhost:8444/cdc
```

将 **localhost** 替换为目标 Milvus 服务器的 IP 地址。

预期响应：

```json
{
  "code": 200,
  "data": {
    "tasks": [
      {
        "task_id": "xxxxx",
        "milvus_connect_param": {
          "host": "localhost",
          "port": 19530,
          "connect_timeout": 10
        },
        "collection_infos": [
          {
            "name": "*"
          }
        ],
        "state": "Running"
      }
    ]
  }
}
```

## 暂停任务

要暂停 CDC 任务：

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "request_type":"pause",
  "request_data": {
    "task_id": "xxxx"
  }
}' http://localhost:8444/cdc
```

将 **localhost** 替换为目标 Milvus 服务器的 IP 地址。

**参数**：

- **task_id**: 要暂停的 CDC 任务的 ID。

预期响应：

```bash
{
  "code": 200,
  "data": {}
}
```

## 恢复任务

要恢复已暂停的 CDC 任务：

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "request_type":"resume",
  "request_data": {
    "task_id": "xxxx"
  }
}' http://localhost:8444/cdc
```

将 **localhost** 替换为目标 Milvus 服务器的 IP 地址。

**参数**：

- **task_id**: 要恢复的 CDC 任务的 ID。

预期响应：

```bash
{
  "code": 200,
  "data": {}
}
```

## 检索任务详细信息

要检索特定 CDC 任务的详细信息：

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "request_type":"get",
  "request_data": {
    "task_id": "xxxx"
  }
}' http://localhost:8444/cdc
```

Replace **localhost** with the IP address of the target Milvus server.

**Parameters**:

- **task_id**: ID of the CDC task to query.

Expected response:

```bash
{
  "code": 200,
  "data": {
    "Task": {
      "collection_infos": [
        {
          "name": "*"
        }
      ],
      "milvus_connect_param": {
        "connect_timeout": 10,
        "enable_tls": true,
        "host": "localhost",
        "port": 19530
      },
      "state": "Running",
      "task_id": "xxxx"
    }
  }
}
```

## Delete a task

To delete a CDC task:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "request_type":"delete",
  "request_data": {
    "task_id": "30d1e325df604ebb99e14c2a335a1421"
  }
}' http://localhost:8444/cdc
```

Replace **localhost** with the IP address of the target Milvus server.

**Parameters**:

- **task_id**: ID of the CDC task to delete.

Expected response:

```json
{
  "code": 200,
  "data": {}
}
```
