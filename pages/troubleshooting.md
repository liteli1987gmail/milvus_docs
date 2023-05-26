# Milvus常见问题及解决方法

本页列出了在运行Milvus时可能出现的常见问题和可能的故障排除技巧。本页的问题分为以下几类：

* [引导问题](#boot_issues)
* [运行时问题](#runtime_issues)
* [API问题](#api_issues)
* [etcd崩溃问题](#etcd_crash_issues)

## 引导问题

启动错误通常是致命错误。运行以下命令以查看错误详情：

```bash
$ docker logs <your milvus container id>

```

## 运行时问题

运行时发生的错误可能会导致服务崩溃。在进行故障排除之前，请检查服务器和客户端之间的兼容性。

## API问题

这些问题发生在Milvus服务器和客户端之间的API方法调用期间。它们将以同步或异步方式返回给客户端。

## etcd崩溃问题

### 1. etcd pod挂起

etcd集群默认使用pvc。Kubernetes集群需要预先配置StorageClass。

### 2. etcd pod崩溃

当etcd pod崩溃，出现`Error: bad member ID arg (strconv.ParseUint: parsing "": invalid syntax), expecting ID in Hex`时，可以登录此pod并删除`/bitnami/etcd/data/member_id`文件。

### 3. 多个pod在`etcd-0`仍在运行时不断崩溃

如果多个pod在`etcd-0`仍在运行时不断崩溃，可以运行以下代码。

```bash
kubectl scale sts <etcd-sts> --replicas=1
# 删除etcd-1和etcd-2的pvc
kubectl scale sts <etcd-sts> --replicas=3

```

### 4. 所有pod均崩溃

当所有pod崩溃时，请尝试复制`/bitnami/etcd/data/member/snap/db`文件。使用`https://github.com/etcd-io/bbolt`修改数据库数据。

Milvus元数据保存在`key`存储桶中。备份此存储桶中的数据并运行以下命令。请注意，`by-dev/meta/session`文件中的前缀数据不需要备份。

```bash
kubectl kubectl scale sts <etcd-sts> --replicas=0
# 删除etcd-0、etcd-1和etcd-2的pvc
kubectl kubectl scale sts <etcd-sts> --replicas=1
# 恢复备份数据

```

如果您需要帮助解决问题，请随时执行以下操作：

* 加入我们的[Slack频道](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)，向Milvus团队寻求支持。
* 在GitHub上[提交问题](https://github.com/milvus-io/milvus/issues/new/choose)，并包括有关您的问题的详细信息。
