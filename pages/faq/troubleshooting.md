---

id: troubleshooting.md
summary: 了解在使用 Milvus 时可能遇到的常见问题以及如何克服它们。
title: 故障排除
---
# 故障排除
本页面列出了在运行 Milvus 时可能发生的常见问题以及可能的故障排除提示。本页面上的问题分为以下几类：

- [启动问题](#启动问题)
- [运行时问题](#运行时问题)
- [API 问题](#API问题)
- [etcd 崩溃问题](#etcd崩溃问题)

## 启动问题

启动错误通常是致命的。运行以下命令以查看错误详细信息：

```
$ docker logs <你的 milvus 容器 id>
```

## 运行时问题

运行时发生的错误可能导致服务中断。在继续之前，请检查服务器和您的客户端之间的兼容性。

## API问题

这些问题发生在 Milvus 服务器和您的客户端之间的 API 方法调用期间。它们将同步或异步返回给客户端。

## etcd崩溃问题

### 1. etcd pod 挂起

etcd 集群默认使用 pvc。Kubernetes 集群需要预配置 StorageClass。

### 2. etcd pod 崩溃

当 etcd pod 崩溃并出现 `Error: bad member ID arg (strconv.ParseUint: parsing "": invalid syntax), expecting ID in Hex` 错误时，您可以登录到此 pod 并删除 `/bitnami/etcd/data/member_id` 文件。

### 3. 多个 pod 持续崩溃，而 `etcd-0` 仍在运行

如果多个 pod 持续崩溃，而 `etcd-0` 仍在运行，您可以运行以下代码。

```
kubectl scale sts <etcd-sts> --replicas=1
# 删除 etcd-1 和 etcd-2 的 pvc
kubectl scale sts <etcd-sts> --replicas=3
```

### 4. 所有 pod 崩溃

当所有 pod 崩溃时，尝试复制 `/bitnami/etcd/data/member/snap/db` 文件。使用 `https://github.com/etcd-io/bbolt` 修改数据库数据。

所有 Milvus 元数据都保存在 `key` 桶中。备份此桶中的数据并运行以下命令。请注意，`by-dev/meta/session` 文件中的前缀数据不需要备份。

```
kubectl kubectl scale sts <etcd-sts> --replicas=0
# 删除 etcd-0、etcd-1、etcd-2 的 pvc
kubectl kubectl scale sts <etcd-sts> --replicas=1
# 恢复备份数据
```

<br/>

如果您需要帮助解决问题，请随时：

- 加入我们的 [Slack 频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk) 并向 Milvus 团队寻求支持。
- 在 GitHub 上 [提交问题](https://github.com/milvus-io/milvus/issues/new/choose)，包括有关您问题的详细信息。
