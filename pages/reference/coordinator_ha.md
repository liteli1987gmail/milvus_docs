# 协调器高可用性（Coordinator HA）

正如在[Milvus架构](architecture_overview.md)中所示，Milvus由多个组件组成，并且以分布式方式工作。在所有组件中，Milvus通过节点的[扩展和扩展](scaleout.md)确保了工作节点的高可用性，使得协调器成为链中唯一的弱点。

## 概述

在2.2.3版本中，Milvus实现了协调器的高可用性，使它们以活动-待机模式工作，减轻可能导致服务不可用的可能的单点故障（SPoFs）。

![协调器 HA](/coordinator_ha.png)

上图说明了协调器如何在活动-待机模式下工作。当一对协调器启动时，它们使用其服务器ID向etcd注册，并竞争活动角色。成功从etcd租用活动角色的协调器将开始服务，而配对中的另一个协调器将保持待机状态，监视活动角色，并在活动协调器死亡时准备服务。

## 启用协调器HA

### 使用Helm

要启动多个协调器并使它们以活动-待机模式工作，您应该对`values.yaml`文件进行以下更改。

- 将`xxxCoordinator.replicas`设置为`2`。
- 将`xxxCoordinator.activeStandby.enabled`设置为`true`。

以下代码片段以RootCoord为例。您可以对其他类型的协调器执行相同的操作。

```yaml
rootCoordinator:
  enabled: true
  # 只有在您还需要将activeStandby.enabled设置为true时，才能将副本数量设置为大于1。
  replicas: 2  # 否则，请删除此配置项。
  resources: {}
  nodeSelector: {}
  affinity: {}
  tolerations: []
  extraEnv: []
  heaptrack:
    enabled: false
  profiling:
    enabled: false  # 启用实时分析
  activeStandby:
    enabled: true  # 将此设置为true以使RootCoordinators以活动-待机模式工作。
```

### 使用Docker

要启动多个协调器并使它们以活动-待机模式工作，您可以在用于启动Milvus集群的`docker-compose`文件中添加一些定义。

以下代码片段以RootCoord为例。您可以对其他类型的协调器执行相同的操作。

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

### 使用Mac/Linux shell

要启动多个协调器并使它们以活动-待机模式工作，您可以

1. 将Milvus源代码下载到本地驱动器，并按照以下步骤[从源代码启动Milvus集群](https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md)：

    ```shell
    sudo ./scripts/start_cluster.sh
    ```

    完成此步骤后，Milvus每种类型的协调器只运行一个实例。

2. 更新`milvus.yaml`以更改每种类型的协调器的端口号。以下使用**rootCoord**作为示例。

    ```yaml
    rootCoord:
      address: localhost
      port: 53100 # 更改为53001
    ```

3. 启动待机协调器。

    ```shell
    sudo nohup