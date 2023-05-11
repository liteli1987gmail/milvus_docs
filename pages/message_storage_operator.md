配置Milvus Operator的消息存储
======================

Milvus使用RocksMQ、Pulsar或Kafka来管理最近更改的日志，输出流日志，并提供日志订阅。本主题介绍了在使用Milvus Operator安装Milvus时如何配置消息存储依赖项。

本主题假定您已经部署了Milvus Operator。

See [部署Milvus Operator](https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md) for more information. 
您需要为使用Milvus Operator启动Milvus集群指定配置文件。

```
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvuscluster_default.yaml

```

您只需要编辑`milvuscluster_default.yaml`中的代码模板来配置第三方依赖项。以下部分介绍了如何分别配置对象存储、etcd和Pulsar。

开始之前
----

下表显示了RocksMQ、Pulsar和Kafka在Milvus独立模式和集群模式下的支持情况。

|  | RocksMQ | Pulsar | Kafka |
| --- | --- | --- | --- |
| Standalone mode | ✔️ | ✔️ | ✔️ |
| Cluster mode | ✖️ | ✔️ | ✔️ |

还有其他限制可以指定消息存储：

* 仅支持一个Milvus实例对应一个消息存储。但是我们仍然兼容设置多个消息存储的情况。优先级如下:
	+ 独立模式: RocksMQ (默认) > Pulsar > Kafka
	+ 集群模式: Pulsar (默认) > Kafka

* 在Milvus系统运行期间无法更改消息存储。

* 仅支持Kafka 2.x或3.x版本。

配置RocksMQ
---------

RocksMQ是Milvus独立版的默认消息存储。

Currently, you can only configure RocksMQ as the message storage for Milvus standalone with Milvus Operator. 

#### 示例

以下示例配置了一个RocksMQ服务。

```
apiVersion: milvus.io/v1alpha1
kind: Milvus
metadata:
  name: milvus
spec:
  dependencies: {}
  config: {}

```

配置Pulsar
--------

Pulsar管理最近更改的日志，输出流日志，并提供日志订阅。在Milvus独立版和Milvus集群中都支持配置Pulsar进行消息存储。但是，使用Milvus Operator，您只能将Pulsar配置为Milvus集群的消息存储。在`spec.dependencies.pulsar`下添加所需字段以配置Pulsar。

`pulsar`支持`external`和`inCluster`。

### External Pulsar

`external` 表示使用外部 Pulsar 服务。用于配置外部 Pulsar 服务的字段包括：

* `external`: 如果值为 `true`，则表示 Milvus 使用外部 Pulsar 服务。

* `endpoints`: Pulsar 的端点。

#### 示例

以下示例配置外部 Pulsar 服务。

```
apiVersion: milvus.io/v1alpha1

kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus

spec:

  dependencies: # Optional

    pulsar: # Optional

      # Whether (=true) to use an existed external pulsar as specified in the field endpoints or 

      # (=false) create a new pulsar inside the same kubernetes cluster for milvus.

      external: true # Optional default=false

      # The external pulsar endpoints if external=true

      endpoints:

      - 192.168.1.1:6650

  components: {}

  config: {}           

```

### 内部Pulsar

`inCluster` 表示当Milvus集群启动时，Pulsar服务会在集群中自动启动。

#### 示例

以下示例配置了一个内部的Pulsar服务。

```
apiVersion: milvus.io/v1alpha1

kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus

spec:

  dependencies:

    pulsar:

      inCluster:

        values:

          components:

            autorecovery: false

          zookeeper:

            replicaCount: 1

          bookkeeper:

            replicaCount: 1

            resoureces:

              limit:

                cpu: '4'

              memory: 8Gi

            requests:

              cpu: 200m

              memory: 512Mi

          broker:

            replicaCount: 1

            configData:

              ## Enable `autoSkipNonRecoverableData` since bookkeeper is running

              ## without persistence

              autoSkipNonRecoverableData: "true"

              managedLedgerDefaultEnsembleSize: "1"

              managedLedgerDefaultWriteQuorum: "1"

              managedLedgerDefaultAckQuorum: "1"

          proxy:

            replicaCount: 1

  components: {}

  config: {}            

```

This example specifies the numbers of replicas of each component of Pulsar, the compute resources of Pulsar BookKeeper, and other configurations.
Find the complete configuration items to configure an internal Pulsar service in [values.yaml](https://artifacthub.io/packages/helm/apache/pulsar/2.7.8?modal=values). Add configuration items as needed under `pulsar.inCluster.values` as shown in the preceding example.
假设配置文件名为`milvuscluster.yaml`，运行以下命令应用配置。

```
kubectl apply -f milvuscluster.yaml

```

配置Kafka
-------

Pulsar是Milvus集群中的默认消息存储。如果您想要使用Kafka，请添加可选字段`msgStreamType`来配置Kafka。

`kafka`支持`external`和`inCluster`。

### 外部 Kafka

`external` 表示使用外部 Kafka 服务。

用于配置外部 Kafka 服务的字段包括：

* `external`：如果值为 `true`，则表示 Milvus 使用外部 Kafka 服务。

* `brokerList`：发送消息的 broker 列表。

#### Example

The following example configures an external Kafka service.

```
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec: 
  dependencies:
    msgStreamType: "kafka"
    kafka:
      external: true
      brokerList: 
        - "kafkaBrokerAddr1:9092"
        - "kafkaBrokerAddr2:9092"
        # ...
  components: {}
  config: {}

```

### 内部Kafka

`inCluster` 表示当 Milvus 集群启动时，Kafka 服务会自动在集群中启动。

#### 例子

以下例子配置了一个内部Kafka服务。

```
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec: 
  dependencies:
    msgStreamType: "kafka"
    kafka:
      inCluster: 
        values: {} # values can be found in https://artifacthub.io/packages/helm/bitnami/kafka
  components: {}
  config: {}

```

在`kafka.inCluster.values`下添加所需的配置项，找到配置内部Kafka服务的完整配置项[这里](https://artifacthub.io/packages/helm/bitnami/kafka)。

假设配置文件名为`milvuscluster.yaml`，运行以下命令应用配置。

```
kubectl apply -f milvuscluster.yaml

```

接下来是什么
------

了解如何使用Milvus Operator配置其他Milvus依赖项：

* [使用Milvus Operator配置对象存储](object_storage_operator.md)

* [使用Milvus Operator配置元数据存储](meta_storage_operator.md)
