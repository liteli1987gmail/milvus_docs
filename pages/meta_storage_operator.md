使用Milvus Operator配置元数据存储
========================

Milvus使用etcd存储元数据。本主题介绍了在使用Milvus Operator安装Milvus时如何配置元数据存储依赖项。

本主题假设您已部署Milvus Operator。

See [部署Milvus Operator](https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md) for more information. 
您需要为使用Milvus Operator启动Milvus集群指定一个配置文件。

```bash
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvuscluster_default.yaml

```

您只需编辑`milvuscluster_default.yaml`中的代码模板即可配置第三方依赖项。下面的部分介绍如何分别配置对象存储、etcd和Pulsar。

配置etcd
------

在`spec.dependencies.etcd`下添加所需字段以配置etcd。

`etcd`支持`external`和`inCluster`。

用于配置外部etcd服务的字段包括：

* `external`：值为`true`表示Milvus使用外部etcd服务。

* `endpoints`：etcd的端点。

### 外部 etcd

#### 示例

下面的示例配置了一个外部的etcd服务。

```bash
kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus

spec:

  dependencies: # Optional

    etcd: # Optional

      # Whether (=true) to use an existed external etcd as specified in the field endpoints or 

      # (=false) create a new etcd inside the same kubernetes cluster for milvus.

      external: true # Optional default=false

      # The external etcd endpoints if external=true

      endpoints:

      - 192.168.1.1:2379

  components: {}

  config: {}

```

### 内部etcd

`inCluster` 表示当 Milvus 集群启动时，集群中会自动启动 etcd 服务。

#### 示例

以下示例配置了一个内部 etcd 服务。

```bash
apiVersion: milvus.io/v1alpha1

kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus

spec:

  dependencies:

    etcd:

      inCluster:

        values:

          replicaCount: 5

          resources:

            limits: 

              cpu: '4'

              memory: 8Gi

            requests:

              cpu: 200m

              memory: 512Mi

  components: {}

  config: {}              

```

前面的示例将副本数指定为 `5`，并限制了 etcd 的计算资源。
在[values.yaml](https://github.com/bitnami/charts/blob/ba6f8356e725a8342fe738a3b73ae40d5488b2ad/bitnami/etcd/values.yaml)中找到完整的配置项，以配置内部 etcd 服务。

根据上述示例，在 `etcd.inCluster.values` 下添加所需的配置项。

假设配置文件名为 `milvuscluster.yaml`，执行以下命令应用配置。

```bash
kubectl apply -f milvuscluster.yaml

```

下一步
---

学习如何使用Milvus Operator配置其他Milvus依赖项：

* [使用Milvus Operator配置对象存储](object_storage_operator.md)

* [使用Milvus Operator配置消息存储](message_storage_operator.md)
