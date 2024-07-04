


# 协调器高可用

如 [Milvus 架构](/reference/architecture/architecture_overview.md) 所示，Milvus 由许多组件组成，并以分布式方式工作。在所有组件中，Milvus 通过节点的扩容和扩展来确保工作节点的高可用性，使得协调器成为链路中唯一的薄弱环节。

## 概述

在 2.2.3 版本中，Milvus 实现了协调器的高可用性，使其以主备模式工作，从而减轻可能导致服务不可用的单点故障。

![Coordinator HA](/assets/coordinator_ha.png)

上图展示了协调器以主备模式工作的方式。当一对协调器启动时，它们会使用其服务器 ID 在 etcd 中进行注册，并竞争成为活动角色。成功从 etcd 中获得活动角色的协调器将开始提供服务，而另一个协调器将保持待命状态，监视活动角色，一旦活动协调器停止服务，就会准备接手服务。

## 启用协调器高可用

### 使用 Helm

要启动多个协调器并使其以主备模式工作，你应该对 `values.yaml` 文件进行以下更改。

- 设置 `xxxCoordinator.replicas` 为 `2`。
- 设置 `xxxCoordinator.activeStandby.enabled` 为 `true`。

以下代码片段以 RootCoord 为例。你可以对其他类型的协调器执行相同的操作。

```yaml
rootCoordinator:
  enabled: true
  # 仅当你还需要设置activeStandby.enabled为true时，才可以将副本数设置为大于1。
  replicas: 2  # 否则，删除这个配置项。
  resources: {}
  nodeSelector: {}
  affinity: {}
  tolerations: []
  extraEnv: []
  heaptrack:
    enabled: false
  profiling:
    enabled: false  # 启用实时性能分析
  activeStandby:
    enabled: true  # 将其设置为true以使RootCoord在主备模式下工作。
```

### 使用 Docker

要启动多个协调器并使其以主备模式工作，你可以在用于启动 Milvus 集群的 `docker-compose` 文件中添加一些定义。

以下代码片段以 RootCoord 为例。你可以对其他类型的协调器执行相同的操作。

```yaml
  rootcoord:
    container_name: milvus-rootcoord
    image: milvusdb/milvus:v2.2.3
    command: ["milvus", "run", "rootcoord"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
      PULSAR_ADDRESS: pulsar://pulsar:6650
      ROOT_COORD_ADDRESS: rootcoord:53100
      # 添加ROOT_COORD_ENABLE_ACTIVE_STANDBY以启用主备模式
      ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
    depends_on:
      - "etcd"
      - "pulsar"
      - "minio"

#   添加以下内容以使RootCoord以主备模式工作
#   rootcoord-1:
#    container_name: milvus-rootcoord-1
#    image: milvusdb/milvus:v2.2.3
#    command: ["milvus", "run", "rootcoord"]
#    environment:
#      ETCD_ENDPOINTS: etcd:2379
#      MINIO_ADDRESS: minio:9000
#      PULSAR_ADDRESS: pulsar://pulsar:6650
#      ROOT_COORD_ADDRESS: rootcoord-1:53100
#      # 添加ROOT_COORD_ENABLE_ACTIVE_STANDBY以启用主备模式
#      ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
#    depends_on:
#      - "etcd"
#      - "pulsar"
#      - "minio"
```

### 使用 Mac/Linux shell






## 如何启动并运行多个协调器

要启动多个协调器并使它们在主备模式下工作，你可以按照以下步骤操作：

1. 下载 Milvus 源代码到本地，然后从源代码中启动 Milvus 集群，操作如下：

    ```shell
    sudo ./scripts/start_cluster.sh
    ```

    完成后，Milvus 将仅运行一个每种类型的协调器。

2. 更新 `milvus.yaml` 文件以更改每种类型协调器的端口号。以下以 **rootCoord** 为示例。

    ```yaml
    rootCoord:
      address: localhost
      port: 53100 # 修改为53001
    ```

3. 启动备用协调器。

    ```shell
    sudo nohup ./bin/milvus run rootcoord > /tmp/rootcoord2.log 2>&1 &
    ```

    执行完毕后，运行以下命令验证是否存在两个协调器进程。

    ```shell
    ps aux|grep milvus
    ```

    输出结果类似于以下内容：

    ```shell
    > ps aux|grep milvus
    root        12813   0.7 0.2 410709648   82432   ??  S   5:18PM  0:33.28 ./bin/milvus run rootcoord
    root        12816   0.5 0.2 409487968   62352   ??  S   5:18PM  0:22.69 ./bin/milvus run proxy
    root        17739   0.1 0.3 410289872   91792 s003  SN  6:01PM  0:00.30 ./bin/milvus run rootcoord
    ...
    ```

    备用协调器每十秒输出一条日志，内容如下：

    ```shell
    [INFO] [sessionutil/session_util.go:649] ["serverName: rootcoord is in STANDBY ..."]
    ```

4. 停用一对中的主协调器，观察备用协调器的行为。

    你会发现备用协调器需要 60 秒才能接管主协调器的角色。

    ```shell
    [2022/09/21 11:58:33.855 +08:00] [DEBUG] [sessionutil/session_util.go:677] ["watch the ACTIVE key"] [DELETE="key:\"by-dev/meta/session/rootcoord\" mod_revision:167 "]
    [2022/09/21 11:58:33.856 +08:00] [DEBUG] [sessionutil/session_util.go:677] ["watch the ACTIVE key"] [DELETE="key:\"by-dev/meta/session/rootcoord-15\" mod_revision:167 "]
    [2022/09/21 11:58:33.856 +08:00] [INFO] [sessionutil/session_util.go:683] ["stop watching ACTIVE key"]
    [2022/09/21 11:58:33.856 +08:00] [INFO] [sessionutil/session_util.go:655] ["start retrying to register as ACTIVE service..."]
    [2022/09/21 11:58:33.859 +08:00] [INFO] [sessionutil/session_util.go:641] ["register ACTIVE service successfully"] [ServerID=19]
    [2022/09/21 11:58:33.859 +08:00] [INFO] [sessionutil/session_util.go:690] ["quit STANDBY mode, this node will become ACTIVE"]
    [2022/09/21 11:58:33.859 +08:00] [INFO] [rootcoord/root_coord.go:638] ["rootcoord switch from standby to active, activating"]
    [2022/09/21 11:58:33.859 +08:00] [INFO] [rootcoord/root_coord.go:306] ["RootCoord Register Finished"]
    [2022/09/21 11:58:33.859 +08:00] [DEBUG] [rootcoord/service.go:148] ["RootCoord start done ..."]
    [2022/09/21 11:58:33.859 +08:00] [DEBUG] [components/root_coord.go:58] ["RootCoord successfully started"]
    ```

## 相关配置项

默认情况下，协调器主备功能已禁用。你可以通过在 Milvus 配置文件中更改以下项来手动启用此功能。

- [rootCoord.activeStandby.enabled](configure_rootcoord.md#rootCoordactiveStandbyenabled)
- [queryCoord.activeStandby.enabled](configure_querycoord.md#queryCoordactiveStandbyenabled)
- [dataCoord.activeStandby.enabled](configure_datacoord.md#dataCoordactiveStandbyenabled)

## 限制




当前，主服务和备份服务之间没有强一致性保证。因此，在接管活动角色时，备份协调员需要重新加载元数据。

Etcd 仅在当前会话超时后释放租约。会话超时默认为 60 秒。因此，当活动协调员死亡时，备份协调员接管活动角色之间存在 60 秒的时间差。

