
Milvus Operator
===


Milvus使用MinIO或S3作为对象存储来持久化大规模文件，例如索引文件和二进制日志。本主题介绍如何在使用Milvus Operator安装Milvus时配置对象存储依赖项。

本主题假定您已经部署了Milvus Operator。
更多信息请参见[部署Milvus Operator](https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md)。 您需要指定一个配置文件，使用Milvus Operator启动Milvus集群。

```bash
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvuscluster_default.yaml

```

您只需编辑 `milvuscluster_default.yaml` 中的代码模板以配置第三方依赖项。以下章节分别介绍如何配置对象存储、etcd和Pulsar。

配置对象存储
------------------------

Milvus 集群使用 MinIO 或 S3 作为对象存储来持久化大型文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加必要的字段以配置对象存储。

`storage` 支持 `external` 和 `inCluster`。

### 外部对象存储

`external` 表示使用外部对象存储服务。

用于配置外部对象存储服务的字段包括：

* `external`：值为 `true` 表示 Milvus 使用外部存储服务。

* `type`：指定 Milvus 使用 S3 还是 MinIO 作为对象存储。

* `secretRef`：对象存储服务使用的密钥引用。
* `endpoint`：对象存储服务的终端节点。

#### 示例

以下示例配置了一个外部对象存储服务。

```bash
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  dependencies: # Optional
    storage: # Optional
      # Whether (=true) to use an existed external storage as specified in the field endpoints or 
      # (=false) create a new storage inside the same kubernetes cluster for milvus.
      external: true # Optional default=false
      type: "MinIO" # Optional ("MinIO", "S3") default:="MinIO"
      # Secret reference of the storage if it has
      secretRef: mySecret # Optional
      # The external storage endpoint if external=true
      endpoint: "storageEndpoint"
  components: {}
  config: {}

```

### 内部对象存储

`inCluster` 表示在 Milvus 集群启动时，MinIO 服务会自动在集群中启动。

Milvus 集群仅支持将 MinIO 用作内部对象存储服务。


#### 示例

以下示例配置了一个内部的 MinIO 服务。

```bash
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  dependencies:
    storage: #
      external: false 
      type: "MinIO" # Optional ("MinIO", "S3") default:="MinIO"
      inCluster: 
        # deletionPolicy of storage when the milvus cluster is deleted
        deletionPolicy: Retain # Optional ("Delete", "Retain") default="Retain"
        # When deletionPolicy="Delete" whether the PersistantVolumeClaim shoud be deleted when the storage is deleted
        pvcDeletion: false
        values:
          resources:
             limits: 
              cpu: '2'
              memory: 6Gi
            requests:
              cpu: 100m
              memory: 512Mi
          statefulset:
            replicaCount: 6
  components: {}
  config: {}    

```

在此示例中，`inCluster.deletionPolicy` 定义了数据的删除策略。

`inCluster.values.resources` 定义了 MinIO 使用的计算资源。

`inCluster.values.statefulset.replicaCount` 定义了每个驱动器上 MinIO 副本的数量。

在[values.yaml](https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml)中找到完整的配置项，以配置内部 MinIO 服务。

根据上述示例，在 `storage.inCluster.values` 下添加所需的配置项。
假设配置文件命名为`milvuscluster.yaml`，运行以下命令应用配置。

```bash
kubectl apply -f milvuscluster.yaml

```

如果 `my-release` 是一个现有的Milvus集群，则 `milvuscluster.yaml` 将覆盖其配置。否则，将创建一个新的Milvus集群。


下一步
---

了解如何使用Milvus Operator配置其他Milvus依赖项：

* [使用Milvus Operator配置元数据存储](meta_storage_operator.md)

* [使用Milvus Operator配置消息存储](message_storage_operator.md)
