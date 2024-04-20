---
title:  使用 Milvus Operator 配置元数据存储
---

# 使用 Milvus Operator 配置元数据存储

Milvus 使用 etcd 存储元数据。本主题介绍在安装 Milvus 时如何使用 Milvus Operator 配置元数据存储依赖。更多详细信息，请参阅 Milvus Operator 仓库中的 [使用 Milvus Operator 配置元数据存储](https://github.com/zilliztech/milvus-operator/blob/main/docs/administration/manage-dependencies/meta-storage.md)。

本主题假设您已经部署了 Milvus Operator。

<div class="alert note">有关更多信息，请参见 <a href="https://milvus.io/docs/v2.2.x/install_cluster-milvusoperator.md">部署 Milvus Operator</a>。</div>

您需要指定一个配置文件，使用 Milvus Operator 启动 Milvus 集群。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

您只需要编辑 `milvus_cluster_default.yaml` 中的代码模板，以配置第三方依赖项。以下各节分别介绍如何配置对象存储、etcd 和 Pulsar。

## 配置 etcd

在 `spec.dependencies.etcd` 下添加所需字段以配置 etcd。

`etcd` 支持 `external` 和 `inCluster`。

用于配置外部 etcd 服务的字段包括：

- `external`: 值为 `true` 表示 Milvus 使用外部 etcd 服务。
- `endpoints`: etcd 的端点。

### 外部 etcd

#### 示例

以下示例配置了外部 etcd 服务。

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

`inCluster` 表示当 Milvus 集群启动时，etcd 服务会自动在集群中启动。

#### 示例

以下示例配置了内部 etcd 服务。

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

<div class="alert note">上述示例指定了副本数量为 <code>5</code> 并限制了 etcd 的计算资源。</div>

<div class="alert note">在 <a href="https://github.com/bitnami/charts/blob/ba6f8356e725a8342fe738a3b73ae40d5488b2ad/bitnami/etcd/values.yaml">values.yaml</a> 中查找配置内部 etcd 服务的完整配置项。根据需要在上述示例所示的 <code>etcd.inCluster.values</code> 下添加配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，请运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 接下来

学习如何使用 Milvus Operator 配置其他 Milvus 依赖项：
- [使用 Milvus Operator 配置对象存储](object_storage_operator.md)
- [使用 Milvus Operator 配置消息存储](message_storage_operator.md)