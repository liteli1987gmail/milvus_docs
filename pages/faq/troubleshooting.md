


# 故障排除
本页面列出了在运行 Milvus 时可能遇到的常见问题，以及可能的故障排除提示。此页面上的问题可分为以下几类：

- [引导问题](#boot_issues)
- [运行时问题](#runtime_issues)
- [API 问题](#api_issues)
- [etcd 崩溃问题](#etcd_crash_issues)

## 引导问题
引导错误通常是致命的。运行以下命令查看错误详情：
```
$ docker logs <your milvus container id>
```

## 运行时问题
运行时发生的错误可能导致服务故障。在继续之前，请检查服务器与客户端的兼容性以解决此问题。

## API 问题
这些问题发生在 Milvus 服务器与客户端之间的 API 方法调用期间。它们将同步或异步地返回给客户端。

## etcd 崩溃问题
### 1. etcd pod 处于待定状态
etcd 集群默认使用 pvc。Kubernetes 集群需预先配置 StorageClass。

### 2. etcd pod 崩溃
当 etcd pod 崩溃时，出现 `Error: bad member ID arg (strconv.ParseUint: parsing "": invalid syntax), expecting ID in Hex` 错误，请登录该 pod 并删除 `/bitnami/etcd/data/member_id` 文件。

### 3. etcd-0 仍在运行，但多个 pod 保持崩溃
如果 etcd-0 仍然运行，但多个 pod 持续崩溃，请运行以下代码：
```
kubectl scale sts <etcd-sts> --replicas=1
# 删除etcd-1和etcd-2的pvc
kubectl scale sts <etcd-sts> --replicas=3
```

### 4. 所有 pod 均崩溃






## 当所有的 Pod 崩溃时，请尝试复制 `/bitnami/etcd/data/member/snap/db` 文件。使用 `https://github.com/etcd-io/bbolt` 修改数据库数据。

所有的 Milvus 元数据都保存在 `key` 桶中。备份此桶中的数据并运行以下命令。请注意，`by-dev/meta/session` 文件中的前缀数据不需要备份。

```
kubectl kubectl scale sts <etcd-sts> --replicas=0
# 删除etcd-0, etcd-1, etcd-2的pvc
kubectl kubectl scale sts <etcd-sts> --replicas=1
# 恢复备份数据
```

如果你需要帮助解决问题，请随时：

- 加入我们的 [Slack 频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk) 并向 Milvus 团队寻求支持。
- 在 GitHub 上 [提交问题](https://github.com/milvus-io/milvus/issues/new/choose)，并包含有关你的问题的详细信息。

