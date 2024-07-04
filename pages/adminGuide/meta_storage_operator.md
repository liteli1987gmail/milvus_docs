


# 使用 Milvus Operator 配置元数据存储

Milvus 使用 etcd 来存储元数据。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置元数据存储依赖。有关更多详细信息，请参见 Milvus Operator 库中的 [使用 Milvus Operator 配置元数据存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/meta-storage.md)。

本主题假设你已经部署了 Milvus Operator。

<div class="alert note"> 请参见 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md"> 部署 Milvus Operator </a> 以获取更多信息。</div>

你需要为使用 Milvus Operator 启动 Milvus 集群指定一个配置文件。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

你只需要编辑 `milvus_cluster_default.yaml` 文件中的代码模板以配置第三方依赖项。以下章节介绍了如何分别配置对象存储、etcd 和 Pulsar。

## 配置 etcd

在 `spec.dependencies.etcd` 下添加必需的字段以配置 etcd。

`etcd` 支持 `external` 和 `inCluster`。

用于配置外部 etcd 服务的字段包括：

- `external`：`true` 表示 Milvus 使用外部 etcd 服务。
- `endpoints`：etcd 的端点。

### 外部 etcd

#### 示例

以下示例配置了一个外部 etcd 服务。

```YAML
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
### 内部 etcd

`inCluster` 表示当 Milvus 集群启动时，集群中会自动启动一个 etcd 服务。

#### 示例


以下示例配置了一个内部 etcd 服务。

```YAML
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

<div class="alert note"> 上述示例指定副本数量为 `5`，并限制了 etcd 的计算资源。</div>

<div class="alert note"> 在 <a href="https://github.com/bitnami/charts/blob/ba6f8356e725a8342fe738a3b73ae40d5488b2ad/bitnami/etcd/values.yaml"> values.yaml </a> 中找到配置内部 etcd 服务的完整配置项。如前例所示，在 `etcd.inCluster.values` 下按需添加配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 接下来做什么

学习如何使用 Milvus Operator 配置 Milvus 的其他依赖项：
- [使用 Milvus Operator 配置对象存储](/adminGuide/object_storage_operator.md)
- [使用 Milvus Operator 配置消息存储](/adminGuide/message_storage_operator.md)