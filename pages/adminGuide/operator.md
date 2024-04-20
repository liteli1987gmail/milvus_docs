---
title:  使用 Milvus Operator 配置依赖
---

# 使用 Milvus Operator 配置依赖

Milvus 集群依赖于包括对象存储、etcd 和 Pulsar 在内的一些组件。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置这些依赖。

本主题假设您已经部署了 Milvus Operator。

<div class="alert note">有关更多信息，请参见 <a href="https://milvus.io/docs/v{{var.milvus_release_tag}}/install_cluster-milvusoperator.md">部署 Milvus Operator</a>。</div>

您需要指定一个配置文件，以便使用 Milvus Operator 启动 Milvus 集群。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvuscluster_default.yaml
```

您只需要编辑 `milvuscluster_default.yaml` 中的代码模板来配置第三方依赖项。以下各节分别介绍了如何配置对象存储、etcd 和 Pulsar。

## 配置对象存储

Milvus 集群使用 MinIO 或 S3 作为对象存储，以持久化大规模文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加所需字段以配置对象存储。

`storage` 支持 `external` 和 `inCluster`。

### 外部对象存储

`external` 表示使用外部对象存储服务。

用于配置外部对象存储服务的字段包括：

- `external`: 值为 `true` 表示 Milvus 使用外部存储服务。
- `type`: 指定 Milvus 使用 S3 或 MinIO 作为对象存储。
- `secretRef`: 对象存储服务使用的密钥引用。
- `endpoint`: 对象存储服务的端点。

#### 示例

以下示例配置了外部对象存储服务。

```YAML
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

`inCluster` 表示当 Milvus 集群启动时，MinIO 服务会自动在集群中启动。

<div class="alert note">Milvus 集群只支持使用 MinIO 作为内部对象存储服务。</div>

#### 示例

以下示例配置了内部 MinIO 服务。

```YAML
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

<div class="alert note">在此示例中，<code>inCluster.deletionPolicy</code> 定义了数据的删除策略。<code>inCluster.values.resources</code> 定义了 MinIO 使用的计算资源。<code>inCluster.values.statefulset.replicaCount</code> 定义了每个驱动器上 MinIO 的副本数量。</div>

<div class="alert note">在 <a href="https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml">values.yaml</a> 中查找配置内部 MinIO 服务的完整配置项。根据需要在前面的示例所示的 <code>storage.inCluster.values</code> 下添加配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，请运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```