---
id: coordinator_ha.md
summary: Learn about the motivation and procedure for Milvus coordinators to work in active standby.
title: Coordinator HA
---

# 协调器高可用性（Coordinator HA）

正如在[Milvus 架构](architecture_overview.md)中所示，Milvus 由多个组件组成，并且以分布式方式工作。在所有组件中，Milvus 通过节点的[扩展和扩展](scaleout.md)确保了工作节点的高可用性，使得协调器成为链中唯一的弱点。

## 概述

在 2.2.3 版本中，Milvus 实现了协调器的高可用性，使它们以活动-待机模式工作，减轻可能导致服务不可用的可能的单点故障（SPoFs）。

![协调器 HA](/public/assets/coordinator_ha.png)

上图说明了协调器如何在活动-待机模式下工作。当一对协调器启动时，它们使用其服务器 ID 向 etcd 注册，并竞争活动角色。成功从 etcd 租用活动角色的协调器将开始服务，而配对中的另一个协调器将保持待机状态，监视活动角色，并在活动协调器死亡时准备服务。

## 启用协调器 HA

### 使用 Helm

要启动多个协调器并使它们以活动-待机模式工作，您应该对`values.yaml`文件进行以下更改。

- 将`xxxCoordinator.replicas`设置为`2`。
- 将`xxxCoordinator.activeStandby.enabled`设置为`true`。

以下代码片段以 RootCoord 为例。您可以对其他类型的协调器执行相同的操作。

```yaml
rootCoordinator:
  enabled: true
  # 只有在您还需要将activeStandby.enabled设置为true时，才能将副本数量设置为大于1。
  replicas: 2 # 否则，请删除此配置项。
  resources: {}
  nodeSelector: {}
  affinity: {}
  tolerations: []
  extraEnv: []
  heaptrack:
    enabled: false
  profiling:
    enabled: false # 启用实时分析
  activeStandby:
    enabled: true # 将此设置为true以使RootCoordinators以活动-待机模式工作。
```

### 使用 Docker

要启动多个协调器并使它们以活动-待机模式工作，您可以在用于启动 Milvus 集群的`docker-compose`文件中添加一些定义。

以下代码片段以 RootCoord 为例。您可以对其他类型的协调器执行相同的操作。

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
    # 添加ROOT_COORD_ENABLE_ACTIVE_STANDBY以启用活动待机
    ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
  depends_on:
    - "etcd"
    - "pulsar"
    - "minio"
#   添加以下内容以使RootCoords以活动-待机模式工作
#   rootcoord-1:
#    container_name: milvus-rootcoord-1
#    image: milvusdb/milvus:v2.2.3
#    command: ["milvus", "run", "rootcoord"]
#    environment:
#      ETCD_ENDPOINTS: etcd:2379
#      MINIO_ADDRESS: minio:9000
#      PULSAR_ADDRESS: pulsar://pulsar:6650
#      ROOT_COORD_ADDRESS: rootcoord-1:53100
#      # 添加ROOT_COORD_ENABLE_ACTIVE_STANDBY以启用活动待机
#      ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
#    depends_on:
#      - "etcd"
#      - "pulsar"
#      - "minio"
```

### 使用 Mac/Linux shell

要启动多个协调器并使它们以活动-待机模式工作，您可以

1. 将 Milvus 源代码下载到本地驱动器，并按照以下步骤[从源代码启动 Milvus 集群](https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md)：

   ```shell
   sudo ./scripts/start_cluster.sh
   ```

   完成此步骤后，Milvus 每种类型的协调器只运行一个实例。

2. 更新`milvus.yaml`以更改每种类型的协调器的端口号。以下使用**rootCoord**作为示例。

   ```yaml
   rootCoord:
     address: localhost
     port: 53100 # 更改为53001
   ```

3. 启动待机协调器。

   ```shell
   sudo nohup ./bin/milvus run rootcoord > /tmp/rootcoord2.log 2>&1 &
   ```

   At the end of this step, run the following command to verify that two coordinator processes exists.

   ```shell
   ps aux|grep milvus
   ```

   The output should be similar to

   ```shell
   > ps aux|grep milvus
   root        12813   0.7 0.2 410709648   82432   ??  S   5:18PM  0:33.28 ./bin/milvus run rootcoord
   root        12816   0.5 0.2 409487968   62352   ??  S   5:18PM  0:22.69 ./bin/milvus run proxy
   root        17739   0.1 0.3 410289872   91792 s003  SN  6:01PM  0:00.30 ./bin/milvus run rootcoord
   ...
   ```

   And the standby coordinator outputs a log entry every ten seconds as follows:

   ```shell
   [INFO] [sessionutil/session_util.go:649] ["serverName: rootcoord is in STANDBY ..."]
   ```

4. Kill the active coordinator in a pair and watch the behavior of the standby coordinator.

   You can find that it takes 60 seconds for the standby coordinator to take over the active role.

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

## Related configuration items

Coordinator HA is disabled by default. You can enable this feature manually by changing the following items in your Milvus configuration file.

- [rootCoord.activeStandby.enabled](configure_rootcoord.md#rootCoordactiveStandbyenabled)
- [queryCoord.activeStandby.enabled](configure_querycoord.md#queryCoordactiveStandbyenabled)
- [dataCoord.activeStandby.enabled](configure_datacoord.md#dataCoordactiveStandbyenabled)

## Limits

Currently, there is no strong consistency guarantee between the active and standby service. Therefore, the standby coordinator needs to reload the metadata while taking over the active role.

Etcd releases a lease only after the current session has timed out. The session timeout defaults to 60 seconds. Therefore, there is a 60-second gap between when the active coordinator dies and when the standby coordinator takes over the active role.
