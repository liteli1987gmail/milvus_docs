---
title:  使用 Milvus Operator 配置对象存储
---

# 使用 Milvus Operator 配置对象存储

Milvus 使用 MinIO 或 S3 作为对象存储来持久化大规模文件，例如索引文件和二进制日志。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置对象存储依赖项。有关更多详细信息，请参阅 Milvus Operator 存储库中的 [使用 Milvus Operator 配置对象存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/object-storage.md)。

本主题假设您已部署了 Milvus Operator。

<div class="alert note">有关更多信息，请参见 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md">部署 Milvus Operator</a>。</div>

您需要指定一个配置文件，以便使用 Milvus Operator 启动 Milvus 集群。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

您只需要编辑 `milvus_cluster_default.yaml` 中的代码模板来配置第三方依赖项。以下部分分别介绍了如何配置对象存储、etcd 和 Pulsar。

## 配置对象存储

Milvus 集群使用 MinIO 或 S3 作为对象存储来持久化大规模文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加所需字段以配置对象存储，可能的选项是 `external` 和 `inCluster`。

### 内部对象存储

默认情况下，Milvus Operator 为 Milvus 部署了一个集群内的 MinIO。以下是使用此 MinIO 作为内部对象存储的示例配置。

```YAML
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  # 省略其他字段 ...
  dependencies:
    # 省略其他字段 ...
    storage:
      inCluster:
        values:
          mode: standalone
          resources:
            requests:
              memory: 100Mi
        deletionPolicy: Delete # Delete | Retain, 默认: Retain
        pvcDeletion: true # 默认: false
```

上述配置应用后，集群内的 MinIO 将以独立模式运行，内存限制最多为 100Mi。请注意，

- `deletionPolicy` 字段指定了集群内 MinIO 的删除策略。默认为 `Delete`，可选择 `Retain` 作为替代选项。

  - `Delete` 表示当您停止 Milvus 实例时，将删除集群内的对象存储。
  - `Retain` 表示将保留集群内的对象存储，以便在以后启动 Milvus 实例时作为依赖服务。

- `pvcDeletion` 字段指定在删除集群内 MinIO 时是否删除 PVC（持久卷声明）。

`inCluster.values` 下的字段与 Milvus Helm 图表中的字段相同，您可以在 [这里](https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml) 找到它们。

### 外部对象存储

在模板 YAML 文件中使用 `external` 表示使用外部对象存储服务。要使用外部对象存储，您需要在 Milvus CRD 中正确设置 `spec.dependencies.storage` 和 `spec.config.minio` 下的字段。

#### 使用亚马逊 Web 服务 (AWS) S3 作为外部对象存储

- 通过 AK/SK 配置 AWS S3 访问

  通常，S3 存储桶可以通过一对访问密钥和访问密钥秘密来访问。您可以按照以下方式在 Kubernetes 中创建一个 `Secret` 对象来存储它们：

  ```YAML
  # # 将 <parameters> 更改为与您的环境相匹配
  apiVersion: v1
  kind: Secret
  metadata:
    name: my-release-s3-secret
  type: Opaque
  stringData:
    accesskey: <my-access-key>
    secretkey: <my-secret-key>
  ```

  然后，您可以将 AWS S3 存储桶配置为外部对象存储：

  ```YAML
  # # 将 <parameters> 更改为与您的环境相匹配
  apiVersion: milvus.io/v1beta1
  kind: Milvus
  metadata:
    name: my-release
    labels:
      app: milvus
  spec:
    # 省略其他字段 ...
    config:
      minio:
        # 您的存储桶名称
        bucketName: <my-bucket>
        # 可选，配置 Milvus 将使用的存储桶前缀
        rootPath: milvus/my-release
        useSSL: true
    dependencies:
      storage:
        # 启用外部对象存储