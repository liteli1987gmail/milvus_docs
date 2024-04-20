---
title: 使用 Birdwatcher
---
# 使用 Birdwatcher

本指南将指导您如何使用 Birdwatcher 来检查您的 Milvus 状态并在运行时配置它。

## 启动 Birdwatcher

Birdwatcher 是一个命令行工具，您可以按照以下方式启动它：

```shell
./birdwatcher
```

然后，您将看到以下提示：

```shell
Offline >
```

## 连接到 etcd

在进行任何其他操作之前，您需要使用 Birdwatcher 连接到 etcd。

- 使用默认设置连接

    ```shell
    Offline > connect
    Milvus(by-dev) >
    ```

- 从 pod 中的 Birdwatcher 连接

    如果您选择在 Kubernetes pod 中运行 Birdwatcher，您首先需要获取 etcd 的 IP 地址，如下所示：

    ```shell
    kubectl get pod my-release-etcd-0 -o 'jsonpath={.status.podIP}'
    ```

    然后访问 pod 的 shell。

    ```shell
    kubectl exec --stdin --tty birdwatcher-7f48547ddc-zcbxj -- /bin/sh
    ```

    最后，使用返回的 IP 地址连接到 etcd，如下所示：

    ```shell
    Offline > connect --etcd ${ETCD_IP_ADDR}:2379
    Milvus(by-dev)
    ```

- 使用不同的根路径连接

    如果您的 Milvus 根路径与 `by-dev` 不同，并且您收到一个报告根路径错误的提示，您可以按照以下方式连接到 etcd：

    ```shell
    Offline > connect --rootPath my-release
    Milvus(my-release) >
    ```

    如果您不知道您的 Milvus 的根路径，可以按照以下方式连接到 etcd：

    ```shell
    Offline > connect --dry
    使用干燥模式，忽略 rootPath 和 metaPath
    Etcd(127.0.0.1:2379) > find-milvus
    发现 1 个候选项：
    my-release
    Etcd(127.0.0.1:2379) > use my-release
    Milvus(my-release) >
    ```

## 检查 Milvus 状态

您可以使用 `show` 命令来检查 Milvus 状态。

```shell
Milvus(my-release) > show -h
Usage:
   show [command]

Available Commands:
  alias               list alias meta info
  channel-watch       display channel watching info from data coord meta store
  checkpoint          list checkpoint collection vchannels
  collection-history  display collection change history
  collection-loaded   display information of loaded collection from querycoord
  collections         list current available collection from RootCoord
  config-etcd         list configuations set by etcd source
  configurations      iterate all online components and inspect configuration
  current-version     
  database            display Database info from rootcoord meta
  index               
  partition           list partitions of provided collection
  querycoord-channel  display querynode information from querycoord cluster
  querycoord-cluster  display querynode information from querycoord cluster
  querycoord-task     display task information from querycoord
  replica             list current replica information from QueryCoord
  segment             display segment information from data coord meta store
  segment-index       display segment index information
  segment-loaded      display segment information from querycoordv1 meta
  segment-loaded-grpc list segments loaded information
  session             list online milvus components

Flags:
  -h, --help   help for show

Use " show [command] --help" for more information about a command.
```

### 列出会话

您可以按以下方式列出所有 etcd 会话：

```shell
Milvus(by-dev) > show session
Session:datacoord, ServerID: 3, Version: 2.2.11, Address: 10.244.0.8:13333
Session:datanode, ServerID: 6, Version: 2.2.11, Address: 10.244.0.8:21124
Session:indexcoord, ServerID: 4, Version: 2.2.11, Address: 10.244.0.8:31000
Session:indexnode, ServerID: 5, Version: 2.2.11, Address: 10.244.0.8:21121
Session:proxy, ServerID: 8, Version: 2.2.11, Address: 10.244.0.8:19529
Session:querycoord, ServerID: 7, Version: 2.2.11, Address: 10.244.0.8:19531
Session:querynode, ServerID: 2, Version: 2.2.11, Address: 10.244.0.8:2