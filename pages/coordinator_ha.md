正如在[Milvus 架构](architecture_overview.md)中所示，Milvus 由许多组件组成，并以分布式方式协同工作。在所有组件中，Milvus 通过节点的[水平扩展和垂直扩展](scaleout.md)，确保工作节点高可用性，使得协调器成为链路中的唯一弱点。

概述
--------

在版本 2.2.3 中，Milvus 实现了协调器的高可用性，使它们以主备模式工作，从而减轻可能导致服务不可用的单点故障（SPoF）。

[![Coordinator HA](https://milvus.io/static/1fb2ee713466f74ca25fbff1d725440e/1263b/coordinator_ha.png "Coordinator HA")](https://milvus.io/static/1fb2ee713466f74ca25fbff1d725440e/ef4ec/coordinator_ha.png)

上图说明了协调器在主备模式下的工作方式。当一对协调器启动时，它们使用其服务器 ID 在 etcd 中注册，并争取获得主角色。成功从 etcd 中取得主要角色的协调器将开始服务，而另一个协调器将保持待机状态，监视着主协调器的状态，一旦主协调器失效，将准备接替服务。

启用协调器 HA
---------------------

### 使用 Helm

为了启动多个协调器并使它们以主备模式工作，您应该在您的 `values.yaml` 文件中进行以下更改：

- 设置 `xxxCoordinator.replicas` 为 `2`。
- 设置 `xxxCoordinator.activeStandby.enabled` 为 `true`。

下面的代码片段以 RootCoord 为例。您可以对其他类型的协调器执行相同的操作。

```python
rootCoordinator:
  enabled: true
  # You can set the number of replicas greater than 1 only if you also need to set activeStandby.enabled to true.
  replicas: 2  # Otherwise, remove this configuration item.
  resources: {}
  nodeSelector: {}
  affinity: {}
  tolerations: []
  extraEnv: []
  heaptrack:
    enabled: false
  profiling:
    enabled: false  # Enable live profiling
  activeStandby:
    enabled: true  # Set this to true to have RootCoordinators work in active-standby mode.

```

### 使用Docker

要启动多个协调者并使它们在主备模式下工作，您可以向用于启动Milvus集群的`docker-compose`文件中添加一些定义。

以下代码片段以RootCoord为例。您可以对其他类型的协调者执行相同的操作。

```python
  rootcoord:
    container_name: milvus-rootcoord
    image: milvusdb/milvus:v2.2.3
    command: ["milvus", "run", "rootcoord"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
      PULSAR_ADDRESS: pulsar://pulsar:6650
      ROOT_COORD_ADDRESS: rootcoord:53100
      # add ROOT_COORD_ENABLE_ACTIVE_STANDBY to enable active standby
      ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
    depends_on:
      - "etcd"
      - "pulsar"
      - "minio"

#   add the following to have RootCoords work in active-standby mode
#   rootcoord-1:
#    container_name: milvus-rootcoord-1
#    image: milvusdb/milvus:v2.2.3
#    command: ["milvus", "run", "rootcoord"]
#    environment:
#      ETCD_ENDPOINTS: etcd:2379
#      MINIO_ADDRESS: minio:9000
#      PULSAR_ADDRESS: pulsar://pulsar:6650
#      ROOT_COORD_ADDRESS: rootcoord-1:53100
#      # add ROOT_COORD_ENABLE_ACTIVE_STANDBY to enable active standby
#      ROOT_COORD_ENABLE_ACTIVE_STANDBY: true
#    depends_on:
#      - "etcd"
#      - "pulsar"
#      - "minio"

```

### With Mac/Linux shell

To start multiple coordinators and have them work in active-standby mode, you can

1. Download the Milvus source code to your local drive, and [start up a Milvus cluster from the source code](https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md) as follows:

```python
sudo ./scripts/start_cluster.sh

```

Milvus runs with only one coordinator of each type at the end of this step.
2. 更新`milvus.yaml`以更改每种类型的协调器的端口号。以下示例使用**rootCoord**。

```python
rootCoord:
  address: localhost
  port: 53100 # change to 53001

```
3. 启动备用协调器。

```python
sudo nohup ./bin/milvus run rootcoord > /tmp/rootcoord2.log 2>&1 &

```

在此步骤结束时，运行以下命令验证存在两个协调器进程。

```python
ps aux|grep milvus

```

输出应类似于

```python
> ps aux|grep milvus
root        12813   0.7 0.2 410709648   82432   ??  S   5:18PM  0:33.28 ./bin/milvus run rootcoord
root        12816   0.5 0.2 409487968   62352   ??  S   5:18PM  0:22.69 ./bin/milvus run proxy
root        17739   0.1 0.3 410289872   91792 s003  SN  6:01PM  0:00.30 ./bin/milvus run rootcoord
...

```

备用协调器每十秒输出一个日志条目，如下所示：

```python
[INFO] [sessionutil/session_util.go:649] ["serverName: rootcoord is in STANDBY ..."]

```
4. 杀死一对中的活动协调器，并观察备用协调器的行为。

您会发现备用协调器需要60秒才能接管活动角色。

```python
[2022/09/21 11:58:33.855 +08:00] [DEBUG] [sessionutil/session_util.go:677] ["watch the ACTIVE key"] [DELETE="key:"by-dev/meta/session/rootcoord" mod_revision:167 "]
[2022/09/21 11:58:33.856 +08:00] [DEBUG] [sessionutil/session_util.go:677] ["watch the ACTIVE key"] [DELETE="key:"by-dev/meta/session/rootcoord-15" mod_revision:167 "]
[2022/09/21 11:58:33.856 +08:00] [INFO] [sessionutil/session_util.go:683] ["stop watching ACTIVE key"]
[2022/09/21 11:58:33.856 +08:00] [INFO] [sessionutil/session_util.go:655] ["start retrying to register as ACTIVE service..."]
[2022/09/21 11:58:33.859 +08:00] [INFO] [sessionutil/session_util.go:641] ["register ACTIVE service successfully"] [ServerID=19]
[2022/09/21 11:58:33.859 +08:00] [INFO] [sessionutil/session_util.go:690] ["quit STANDBY mode, this node will become ACTIVE"]
[2022/09/21 11:58:33.859 +08:00] [INFO] [rootcoord/root_coord.go:638] ["rootcoord switch from standby to active, activating"]
[2022/09/21 11:58:33.859 +08:00] [INFO] [rootcoord/root_coord.go:306] ["RootCoord Register Finished"]
[2022/09/21 11:58:33.859 +08:00] [DEBUG] [rootcoord/service.go:148] ["RootCoord start done ..."]
[2022/09/21 11:58:33.859 +08:00] [DEBUG] [components/root_coord.go:58] ["RootCoord successfully started"]

```

相关配置项
-----

Coordinator HA is disabled by default. You can enable this feature manually by changing the following items in your Milvus configuration file.

* [rootCoord.activeStandby.enabled](configure_rootcoord.md#rootCoordactiveStandbyenabled)
* [queryCoord.activeStandby.enabled](configure_querycoord.md#queryCoordactiveStandbyenabled)
* [dataCoord.activeStandby.enabled](configure_datacoord.md#dataCoordactiveStandbyenabled)
* [indexCoord.activeStandby.enabled](configure_indexcoord.md#indexCoordativeStandbyenabled)

Limits
------

Currently, there is no strong consistency guarantee between the active and standby service. Therefore, the standby coordinator needs to reload the metadata while taking over the active role.

Etcd releases a lease only after the current session has timed out. The session timeout defaults to 60 seconds. Therefore, there is a 60-second gap between when the active coordinator dies and when the standby coordinator takes over the active role.

