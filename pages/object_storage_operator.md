
Milvus使用MinIO或S3作为对象存储来持久化大规模文件，例如索引文件和二进制日志。本主题介绍如何在使用Milvus Operator安装Milvus时配置对象存储依赖项。

本主题假定您已经部署了Milvus Operator。

See [部署Milvus Operator](https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md) for more information. 
You need to specify a configuration file for using Milvus Operator to start a Milvus cluster.

```python
kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvuscluster_default.yaml

```

You only need to edit the code template in `milvuscluster_default.yaml` to configure third-party dependencies. The following sections introduce how to configure object storage, etcd, and Pulsar respectively.

Configure object storage
------------------------

A Milvus cluster uses MinIO or S3 as object storage to persist large-scale files, such as index files and binary logs. Add required fields under `spec.dependencies.storage` to configure object storage.

`storage` 支持 `external` 和 `inCluster`。

### 外部对象存储

`external` 表示使用外部对象存储服务。

用于配置外部对象存储服务的字段包括：

* `external`：值为 `true` 表示 Milvus 使用外部存储服务。

* `type`：指定 Milvus 使用 S3 还是 MinIO 作为对象存储。

* `secretRef`：对象存储服务使用的密钥引用。
* `endpoint`: The endpoint of the object storage service.

#### Example

The following example configures an external object storage service.

```python
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

### Internal object storage

`inCluster` indicates when a Milvus cluster starts, a MinIO service starts automatically in the cluster.

A Milvus cluster only supports using MinIO as the internal object storage service.
#### 示例

以下示例配置了一个内部的 MinIO 服务。

```python
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

In this example, `inCluster.deletionPolicy` defines a deleletion policy for data. `inCluster.values.resources` defines the compute resources that MinIO uses. `inCluster.values.statefulset.replicaCount` defines the number of replicas of MinIO on each drive.
Find the complete configuration items to configure an internal MinIO service in [values.yaml](https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml). Add configuration items as needed under `storage.inCluster.values` as shown in the preceding example.
假设配置文件命名为`milvuscluster.yaml`，运行以下命令应用配置。

```python
kubectl apply -f milvuscluster.yaml

```

If `my-release` is an existing Milvus cluster, `milvuscluster.yaml` overwrites its configuration. Otherwise, a new Milvus cluster is created.
下一步
---

了解如何使用Milvus Operator配置其他Milvus依赖项：

* [使用Milvus Operator配置元数据存储](meta_storage_operator.md)

* [使用Milvus Operator配置消息存储](message_storage_operator.md)
