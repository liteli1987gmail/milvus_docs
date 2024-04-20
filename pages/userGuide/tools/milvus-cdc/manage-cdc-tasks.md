---
title: 管理 CDC 任务
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

将 __localhost__ 替换为目标 Milvus 服务器的 IP 地址。

__参数__：

- __milvus_connect_param__: 目标 Milvus 的连接参数。

    - __host__: Milvus 服务器的主机名或 IP 地址。

    - __port__: Milvus 服务器监听的端口号。

    - __username__: 用于与 Milvus 服务器进行身份验证的用户名。

    - __password__: 用于与 Milvus 服务器进行身份验证的密码。

    - __enable_tls__: 是否使用 TLS/SSL 加密连接。

    - __connect_timeout__: 建立连接的超时时间（秒）。

- __collection_infos__: 要同步的集合。目前仅支持星号（*），因为 Milvus-CDC 在集群级别同步，而不是单个集合。

- __rpc_channel_info__: 同步的 RPC 通道名称，由源 Milvus 配置中的 __common.chanNamePrefix.cluster__ 和 __common.chanNamePrefix.replicateMsg__ 的值连接而成，中间用连字符（-）分隔。

预期响应：

```json
{
  "code": 200,
  "data": {
    "task_id":"xxxx"
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

将 __localhost__ 替换为目标 Milvus 服务器的 IP 地址。

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

将 __localhost__ 替换为目标 Milvus 服务器的 IP 地址。

__参数__：

- __task_id__: 要暂停的 CDC 任务的 ID。

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

将 __localhost__ 替换为目标 Milvus 服务器的 IP 地址。

__参数__：

- __task_id__: 要恢复的 CDC 任务的 ID。

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
curl