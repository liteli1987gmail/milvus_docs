

# 配置 Milvus Operator 的对象存储

Milvus 使用 MinIO 或 S3 作为对象存储来持久化大规模文件，如索引文件和二进制日志。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置对象存储依赖项。有关更多详细信息，请参阅 Milvus Operator 仓库中的 [配置 Milvus Operator 的对象存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/object-storage.md)。

本主题假设你已部署了 Milvus Operator。

<div class="alert note"> 有关详细信息，请参阅 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md"> 部署 Milvus Operator </a>。</div>

你需要为使用 Milvus Operator 启动 Milvus 集群指定一个配置文件。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

你只需要编辑 `milvus_cluster_default.yaml` 中的代码模板以配置第三方依赖项。以下几节介绍了如何分别配置对象存储、etcd 和 Pulsar。

## 配置对象存储

Milvus 集群使用 MinIO 或 S3 作为对象存储来持久化大规模文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加所需字段以配置对象存储，可能的选项有 `external` 和 `inCluster`。

### 内部对象存储

默认情况下，Milvus Operator 在 Milvus 中部署一个独立的 in-cluster MinIO。以下是一个示例配置，演示如何将此 MinIO 用作内部对象存储。

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
        deletionPolicy: Delete # Delete | Retain，默认值：Retain
        pvcDeletion: true # 默认值：false
```

应用上述配置后，独立的 in-cluster MinIO 将以最高 100Mi 的内存限制运行。请注意：

- `deletionPolicy` 字段指定 in-cluster MinIO 的删除策略。默认为 `Delete`，另一个选项为 `Retain`。
  - `Delete` 表示在停止 Milvus 实例时删除 in-cluster 对象存储。
  - `Retain` 表示将 in-cluster 对象存储保留为后续启动 Milvus 实例的依赖服务。

- `pvcDeletion` 字段指定在删除 in-cluster MinIO 时是否删除 PVC（持久化卷声明）。

`inCluster.values` 下的字段与 Milvus Helm Chart 中的字段相同，你可以在 [此处](https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml) 找到它们。

### 外部对象存储

在模板 YAML 文件中使用 `external` 表示使用外部对象存储服务。要使用外部对象存储，你需要在 Milvus CRD 的 `spec.dependencies.storage` 和 `spec.config.minio` 下正确设置字段。

#### 使用亚马逊网络服务（AWS）S3 作为外部对象存储



- 通过 AK/SK 配置 AWS S3 访问

  通常情况下，可以通过访问密钥和访问密钥秘钥对访问 S3 存储桶。你可以创建一个 `Secret` 对象将它们存储在 Kubernetes 中，如下所示：

  ```YAML
  # # 将<parameters>更改为匹配你的环境
  apiVersion: v1
  kind: Secret
  metadata:
    name: my-release-s3-secret
  type: Opaque
  stringData:
    accesskey: <my-access-key>
    secretkey: <my-secret-key>
  ```

  然后，你可以将 AWS S3 存储桶配置为外部对象存储：

  ```YAML
  # # 将<parameters>更改为匹配你的环境
  apiVersion: milvus.io/v1beta1
  kind: Milvus
  metadata:
    name: my-release
    labels:
      app: milvus
  spec:
    # 省略其他字段...
    config:
      minio:
        # 你的存储桶名称
        bucketName: <my-bucket>
        # 可选项，配置milvus将使用的存储桶前缀
        rootPath: milvus/my-release
        useSSL: true
    dependencies:
      storage:
        # 启用外部对象存储
        external: true
        type: S3 # MinIO | S3
        # AWS S3的端点
        endpoint: s3.amazonaws.com:443
        # 存储访问密钥和密钥的Secret
        secretRef: "my-release-s3-secret"
  ```

- 通过 AssumeRole 配置 AWS S3 访问

  或者，你可以使用 [AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) 让 Milvus 访问你的 AWS S3 存储桶，这样只涉及临时凭据，而不是你的实际 AK/SK。

  如果你偏好这种方式，你需要在 AWS 控制台上准备一个角色并获取其 ARN，通常为 `arn:aws:iam::<your account id>:role/<role-name>` 的形式。

  然后，创建一个 `ServiceAccount` 对象将其存储在 Kubernetes 中，如下所示：

  ```YAML
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: my-release-sa
    annotations:
      eks.amazonaws.com/role-arn: <my-role-arn>
  ```

  一切就绪后，在模板的 YAML 文件中引用上述的 `ServiceAccount`，并将 `spec.config.minio.useIAM` 设置为 `true` 以启用 AssumeRole。

  ```YAML
  apiVersion: milvus.io/v1beta1
  kind: Milvus
  metadata:
    name: my-release
    labels:
      app: milvus
  spec:
    # 省略其他字段...
    components:
      # 使用上述ServiceAccount
      serviceAccountName: my-release-sa
    config:
      minio:
        # 启用AssumeRole
        useIAM: true
        # 省略其他字段...
    dependencies:
      storage:
        # 省略其他字段...
        # 注意：在此处必须使用区域端点，否则milvus使用的minio客户端将无法连接
        endpoint: s3.<my-bucket-region>.amazonaws.com:443
        secretRef: "" # 在这里我们不需要指定密钥
  ```

#### 使用 Google Cloud Storage (GCS)作为外部对象存储



# AWS S3 对象存储并不是唯一的选择。你还可以使用其他公共云提供商的对象存储服务，例如 Google Cloud。

- 通过 AK/SK 配置 GCS 访问

  配置与使用 AWS S3 大致相似。你仍然需要创建一个 `Secret` 对象，在 Kubernetes 中存储你的凭据。
  
  ```YAML
  # # change the <parameters> to match your environment
  apiVersion: v1
  kind: Secret
  metadata:
    name: my-release-gcp-secret
  type: Opaque
  stringData:
    accesskey: <my-access-key>
    secretkey: <my-secret-key>
  ```

  然后，你只需要将 `endpoint` 更改为 `storage.googleapis.com:443`，并将 `spec.config.minio.cloudProvider` 设置为 `gcp`，如下所示:

  ```YAML
  # # change the <parameters> to match your environment
  apiVersion: milvus.io/v1beta1
  kind: Milvus
  metadata:
    name: my-release
    labels:
      app: milvus
  spec:
    # Omit other fields ...
    config:
      minio:
        cloudProvider: gcp
    dependencies:
      storage:
        # Omit other fields ...
        endpoint: storage.googleapis.com:443
  ```

- 通过 AssumeRole 配置 GCS 访问

  与 AWS S3 类似，如果你使用 GKE 作为 Kubernetes 集群，你也可以使用 [工作负载身份](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) 通过临时凭据访问 GCS。

  `ServiceAccount` 的注释与 AWS EKS 不同。你需要指定 GCP 服务帐号名称，而不是角色 ARN。

  ```YAML
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: my-release-sa
    annotations:
      iam.gke.io/gcp-service-account: <my-gcp-service-account-name>
  ```

  然后，你可以配置你的 Milvus 实例使用上述的 `ServiceAccount`，并通过将 `spec.config.minio.useIAM` 设置为 `true` 启用 AssumeRole，如下所示:

  ```YAML
  labels:
      app: milvus
  spec:
    # Omit other fields ...
    components:
      # use the above ServiceAccount
      serviceAccountName: my-release-sa
    config:
      minio:
        cloudProvider: gcp
        # enable AssumeRole
        useIAM: true
        # Omit other fields ...  
  ```

## 下一步是什么



学习如何使用 Milvus Operator 配置 Milvus 的其他依赖项：
- [配置 Milvus Operator 的元数据存储](/adminGuide/meta_storage_operator.md)
- [配置 Milvus Operator 的消息存储](/adminGuide/message_storage_operator.md)