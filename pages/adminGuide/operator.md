


# 使用 Milvus Operator 配置依赖项

Milvus 集群依赖于包括对象存储、etcd 和 Pulsar 在内的组件。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置这些依赖项。

本主题假设你已经部署了 Milvus Operator。

<div class="alert note"> 有关更多信息，请参见 <a href="https://milvus.io/docs/v{{var.milvus_release_tag}}/install_cluster-milvusoperator.md"> 部署 Milvus Operator </a>。</div>

你需要为使用 Milvus Operator 启动 Milvus 集群指定一个配置文件。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvuscluster_default.yaml
```

你只需编辑 `milvuscluster_default.yaml` 中的代码模板来配置第三方依赖项。以下各节分别介绍了如何配置对象存储、etcd 和 Pulsar。

## 配置对象存储

Milvus 集群使用 MinIO 或 S3 作为对象存储以持久化大规模文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加必需的字段来配置对象存储。

`storage` 支持 `external` 和 `inCluster`。

### 外部对象存储

`external` 表示使用外部对象存储服务。

用于配置外部对象存储服务的字段包括：

- `external`：`true` 表示 Milvus 使用外部存储服务。
- `type`：指定 Milvus 使用 S3 还是 MinIO 作为对象存储。
- `secretRef`：对象存储服务使用的密钥引用。
- `endpoint`：对象存储服务的端点。

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

`inCluster` 表示当 Milvus 集群启动时，MinIO 服务会在集群中自动启动。

<div class="alert note"> Milvus 集群仅支持将 MinIO 作为内部对象存储服务。</div>

#### 示例

# 配置 Milvus 操作符的依赖项

Milvus 集群依赖于包括对象存储、etcd 和 Pulsar 在内的组件。本主题介绍了在使用 Milvus Operator 安装 Milvus 时如何配置这些依赖项。

本主题假设你已经部署了 Milvus Operator。

<div class="alert note"> 有关更多信息，请参见 <a href="https://milvus.io/docs/v{{var.milvus_release_tag}}/install_cluster-milvusoperator.md"> 部署 Milvus Operator </a>。</div>

你需要为使用 Milvus Operator 启动 Milvus 集群指定一个配置文件。

```YAML
kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvuscluster_default.yaml
```

你只需要编辑 `milvuscluster_default.yaml` 中的代码模板以配置第三方依赖项。以下各节分别介绍了如何配置对象存储、etcd 和 Pulsar。

## 配置对象存储

Milvus 集群使用 MinIO 或 S3 作为对象存储来持久化大规模文件，例如索引文件和二进制日志。在 `spec.dependencies.storage` 下添加所需字段以配置对象存储。

`storage` 支持 `external` 和 `inCluster`。

### 外部对象存储

`external` 表示使用外部对象存储服务。

用于配置外部对象存储服务的字段包括：

- `external`：`true` 值表示 Milvus 使用外部存储服务。
- `type`：指定 Milvus 使用 S3 还是 MinIO 作为对象存储。
- `secretRef`：对象存储服务使用的密钥引用。
- `endpoint`：对象存储服务的终端点。

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

`inCluster` 表示 Milvus 集群启动时，集群中将自动启动一个 MinIO 服务。

<div class="alert note"> Milvus 集群仅支持将 MinIO 用作内部对象存储服务。</div>

#### 示例
 


以下示例配置了一个内部 MinIO 服务。

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

      type: "MinIO" # 可选（"MinIO"，"S3"）默认值：="MinIO"

      inCluster: 

        # 集群内删除存储时的删除策略

        deletionPolicy: Retain # 可选（"Delete"，"Retain"）默认值："Retain"

        # 当deletionPolicy="Delete"时，在删除存储时是否删除PersistantVolumeClaim

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

<div class="alert note"> 在此示例中，<code> inCluster.deletionPolicy </code> 定义了数据的删除策略。 <code> inCluster.values.resources </code> 定义了 MinIO 使用的计算资源。 <code> inCluster.values.statefulset.replicaCount </code> 定义了每个驱动器上 MinIO 的副本数。</div>

<div class="alert note"> 在 <a href="https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml"> values.yaml </a> 中找到配置内部 MinIO 服务的完整配置项。按照上面的示例，在 <code> storage.inCluster.values </code> 下根据需要添加配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

<div class="alert note"> 如果 <code> my-release </code> 是现有的 Milvus 集群，则 <code> milvuscluster.yaml </code> 将覆盖其配置。否则，将创建一个新的 Milvus 集群。</div>

## 配置 etcd

etcd 存储了 Milvus 集群中组件的元数据。在 `spec.dependencies.etcd` 下添加所需的字段来配置 etcd。

`etcd` 支持 `external` 和 `inCluster`。

用于配置外部 etcd 服务的字段包括：

- `external`：`true` 表示 Milvus 使用外部 etcd 服务。
- `endpoints`：etcd 的终端点。

### 外部 etcd

#### 示例
 


以下示例配置了一个内部 MinIO 服务。

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

      type: "MinIO" # 可选 ("MinIO", "S3") 默认值：="MinIO"

      inCluster: 

        # 当删除Milvus集群时，指定存储的删除策略

        deletionPolicy: Retain # 可选 ("Delete", "Retain") 默认值："Retain"

        # 当deletionPolicy="Delete"时，指定在删除存储时是否删除PersistantVolumeClaim（PVC）

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

<div class="alert note"> 在此示例中，<code> inCluster.deletionPolicy </code> 定义了数据的删除策略。 <code> inCluster.values.resources </code> 定义了 MinIO 使用的计算资源。 <code> inCluster.values.statefulset.replicaCount </code> 定义了每个驱动器上 MinIO 的副本数。</div>

<div class="alert note"> 在 <a href="https://github.com/milvus-io/milvus-helm/blob/master/charts/minio/values.yaml"> values.yaml </a> 中查找完整的配置项以配置内部 MinIO 服务。根据上述示例，在 <code> storage.inCluster.values </code> 下添加所需的配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

<div class="alert note"> 如果 <code> my-release </code> 是现有的 Milvus 集群，<code> milvuscluster.yaml </code> 将覆盖其配置。否则，将创建一个新的 Milvus 集群。</div>

## 配置 etcd

etcd 用于存储 Milvus 集群中组件的元数据。在 `spec.dependencies.etcd` 下添加所需的字段来配置 etcd。

`etcd` 支持 `external` 和 `inCluster`。

用于配置外部 etcd 服务的字段包括：

- `external`：为 `true` 表示 Milvus 使用外部 etcd 服务。
- `endpoints`：etcd 的终端点。

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

  dependencies: # 可选

    etcd: # 可选

      # 是否（=true）使用在字段endpoints中指定的现有外部etcd，或

      # （=false）在milvus所在的kubernetes集群内创建一个新的etcd。

      external: true # 可选 默认值=false

      # 如果external=true，则是外部etcd的端点

      endpoints:

      - 192.168.1.1:2379

  components: {}

  config: {}
```
### 内部 etcd

`inCluster` 表示当 Milvus 集群启动时，etcd 服务会在集群中自动启动。

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

<div class="alert note"> 以上示例将副本数设置为 <code> 5 </code>，并限制了 etcd 的计算资源。</div>

<div class="alert note"> 在 <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/assets/charts/etcd/values.yaml"> values.yaml </a> 中查找完整的配置项，以配置内部 etcd 服务。 根据上述示例，在 <code> etcd.inCluster.values </code> 下添加需要的配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 配置 Pulsar




以下示例配置了一个外部 etcd 服务。

```YAML
kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus


spec:

  dependencies: # 可选项

    etcd: # 可选项

      # 等于true表示使用外部指定在endpoints字段中存在的etcd，等于false表示为milvus在同一个kubernetes集群中创建新的etcd。

      external: true # 可选项，默认值=false

      # external=true时，指定外部etcd的端点

      endpoints:

      - 192.168.1.1:2379

  components: {}

  config: {}
```
### 内部 etcd

`inCluster` 表示当 Milvus 集群启动时，etcd 服务会自动在集群中启动。

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

<div class="alert note"> 上述示例将副本数设置为 <code> 5 </code>，并限制了 etcd 的计算资源。</div>

<div class="alert note"> 在 <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/assets/charts/etcd/values.yaml"> values.yaml </a> 中可以找到配置内部 etcd 服务的完整配置项。根据上述示例，在 <code> etcd.inCluster.values </code> 下添加所需的配置项。</div>

假设配置文件名为 `milvuscluster.yaml`，运行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 配置 Pulsar


Pulsar 管理最近更改的日志，输出流日志，并提供日志订阅。在 `spec.dependencies.pulsar` 下添加所需字段以配置 Pulsar.
`pulsar` 支持 `external` 和 `inCluster`。

### 外部 Pulsar

`external` 表示使用外部 Pulsar 服务。 
用于配置外部 Pulsar 服务的字段包括：

- `external`：`true` 值表示 Milvus 使用外部 Pulsar 服务。
- `endpoints`：Pulsar 的端点。

#### 示例

以下示例配置了一个外部 Pulsar 服务。

```YAML
apiVersion: milvus.io/v1alpha1

kind: MilvusCluster

metadata:

  name: my-release

  labels:

    app: milvus

spec:

  dependencies: # 可选

    pulsar: # 可选

      # 是否（=true）使用已存在的外部 pulsar，如字段 endpoints 中指定的。

      # 或（=false）为 milvus 在同一 kubernetes 集群内创建一个新的 pulsar。

      external: true # 可选，默认值=false

      # 如果 external=true，则为外部 pulsar 的端点

      endpoints:

      - 192.168.1.1:6650

  components: {}

  config: {}           
```

### 内部 Pulsar

`inCluster` 表示当 Milvus 集群启动时，Pulsar 服务会在集群中自动启动。

#### 示例

Pulsar 管理最近更改的日志，输出流日志，并提供日志订阅。在 `spec.dependencies.pulsar` 下添加必需的字段以配置 Pulsar。
`pulsar` 支持 `external` 和 `inCluster`。

### 外部 Pulsar

`external` 表示使用外部 Pulsar 服务。用于配置外部 Pulsar 服务的字段包括：

- `external`：`true` 表示 Milvus 使用外部 Pulsar 服务。
- `endpoints`：Pulsar 的端点。

#### 示例

以下示例配置了一个外部 Pulsar 服务。

```YAML
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

### 内部 Pulsar

`inCluster` 表示当 Milvus 集群启动时，在集群中自动启动 Pulsar 服务。

#### 示例 
 




下面的示例配置了一个内部的 Pulsar 服务。

```YAML
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

<div class="alert note"> 这个示例指定了 Pulsar 的每个组件的副本数量、Pulsar BookKeeper 的计算资源以及其他配置项。</div>

<div class="alert note"> 在 <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/assets/charts/pulsar/values.yaml"> values.yaml </a> 中找到配置内部 Pulsar 服务的完整配置项。根据上述示例，在 <code> pulsar.inCluster.values </code> 下添加所需的配置项。</div>

假设配置文件的名称为 `milvuscluster.yaml`，执行以下命令应用配置。

```Shell
kubectl apply -f milvuscluster.yaml
```

## 下一步

你的回答是:

## The following example configures an internal Pulsar service.

```YAML
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

<div class="alert note"> This example specifies the numbers of replicas of each component of Pulsar, the compute resources of Pulsar BookKeeper, and other configurations.</div>

<div class="alert note"> Find the complete configuration items to configure an internal Pulsar service in <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/assets/charts/pulsar/values.yaml"> values.yaml </a>. Add configuration items as needed under <code> pulsar.inCluster.values </code> as shown in the preceding example.</div>

Assuming that the configuration file is named `milvuscluster.yaml`, run the following command to apply the configuration.

```Shell
kubectl apply -f milvuscluster.yaml
```

## What's next




如果你想学习如何使用 `milvus.yaml` 配置依赖项，请参阅 [System Configuration](/reference/sys_config/system_configuration.md)。




如果你想学习如何使用 `milvus.yaml` 配置依赖项，请参阅 [系统配置](/reference/sys_config/system_configuration.md)。