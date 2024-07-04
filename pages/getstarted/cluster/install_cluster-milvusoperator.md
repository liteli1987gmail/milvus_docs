


# 使用 Milvus Operator 安装 Milvus 集群

Milvus Operator 是一个解决方案，可以帮助你在 Kubernetes（K8s）集群上部署和管理完整的 Milvus 服务栈。该堆栈包括所有 Milvus 组件和相关的依赖项，如 etcd、Pulsar 和 MinIO。本主题介绍如何在 K8s 上使用 Milvus Operator 部署 Milvus 集群。

## 先决条件
在安装之前，请查看硬件和软件的要求。

## 创建一个 K8s 集群

如果你已经为生产部署了一个 K8s 集群，你可以跳过此步骤，直接进行 Milvus Operator 的部署。否则，你可以按照以下步骤快速创建一个用于测试的 K8s 集群，然后将其用于部署使用 Milvus Operator 的 Milvus 集群。

部分代码片段: 创建使用 Minikube 的 K8s 集群

## 部署 Milvus Operator

Milvus Operator 在 [Kubernetes 自定义资源](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 之上定义了 Milvus 集群的自定义资源。定义了自定义资源之后，你可以以声明性的方式使用 K8s API 来管理 Milvus 部署堆栈，以确保其可扩展性和高可用性。

### 先决条件

- 确保可以通过 `kubectl` 或 `helm` 访问 K8s 集群。
- 确保已安装 StorageClass 依赖项，因为 Milvus 集群依赖于默认的 StorageClass 进行数据持久化。Minikube 在安装时有一个对默认 StorageClass 的依赖。通过运行 `kubectl get sc` 命令来检查依赖性。如果已安装 StorageClass，你将看到以下输出。否则，请参阅 [更改默认的 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/) 获取更多信息。

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 1. 安装 cert-manager






<div class="alert note">
你可以使用 Helm 或 kubectl 命令安装 Milvus Operator。如果选择使用 Helm，则可以跳过此步骤，直接进入 <a href=install_cluster-milvusoperator.md#Install-by-Helm-command> 通过 Helm 命令安装 </a>。
</div>

Milvus Operator 使用 [cert-manager](https://cert-manager.io/docs/installation/supported-releases/) 为 webhook 服务器提供证书。运行以下命令安装 cert-manager。

```
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
```

如果已安装 cert-manager，将看到以下输出。

```
customresourcedefinition.apiextensions.k8s.io/certificaterequests.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/certificates.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/challenges.acme.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/issuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/orders.acme.cert-manager.io created
namespace/cert-manager created
serviceaccount/cert-manager-cainjector created
serviceaccount/cert-manager created
serviceaccount/cert-manager-webhook created
clusterrole.rbac.authorization.k8s.io/cert-manager-cainjector created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-issuers created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificates created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-orders created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-challenges created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
clusterrole.rbac.authorization.k8s.io/cert-manager-view created
clusterrole.rbac.authorization.k8s.io/cert-manager-edit created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificatesigningrequests created
clusterrole.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-cainjector created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-issuers created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificates created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-orders created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-challenges created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificatesigningrequests created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
role.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
role.rbac.authorization.k8s.io/cert-manager:leaderelection created
role.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
rolebinding.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
rolebinding.rbac.authorization.k8s.io/cert-manager:leaderelection created
rolebinding.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
service/cert-manager created
service/cert-manager-webhook created
deployment.apps/cert-manager-cainjector created
deployment.apps/cert-manager created
deployment.apps/cert-manager-webhook created
mutatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
validatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
```

<div class="alert note">
需要安装 cert-manager 版本 1.1.3 或更高版本。
</div>

运行 `$ kubectl get pods -n cert-manager` 检查 cert-manager 是否正在运行。如果所有 pod 都在运行，则会看到以下输出。

```
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-848f547974-gccz8             1/1     Running   0          70s
cert-manager-cainjector-54f4cc6b5-dpj84   1/1     Running   0          70s
cert-manager-webhook-7c9588c76-tqncn      1/1     Running   0          70s
```

### 2. 安装 Milvus Operator

在 K8s 上安装 Milvus Operator 有两种方法：

- 使用 Helm chart
- 直接使用原始清单使用 `kubectl` 命令

#### 通过 Helm 命令安装
 





```
helm安装 milvus-operator \
  -n milvus-operator --create-namespace \
  --wait --wait-for-jobs \
  https://github.com/zilliztech/milvus-operator/releases/download/v{{var.milvus_operator_version}}/milvus-operator-{{var.milvus_operator_version}}.tgz
```

如果安装了 Milvus Operator，你可以看到以下输出。
```
名称：milvus-operator
上次部署时间：Thu Jul  7 13:18:40 2022
命名空间：milvus-operator
状态：已部署
修订版本：1
测试套件：无
备注：
Milvus Operator正在启动，请使用`kubectl get -n milvus-operator deploy/milvus-operator`来检查是否已成功安装
如果Operator未成功启动，请使用`kubectl -n milvus-operator logs job/milvus-operator-checker`检查检查器的日志
完整的安装文档可以在https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md找到
使用`kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`快速开始
更多示例可以在https://github.com/zilliztech/milvus-operator/tree/main/config/samples找到
CRD文档可以在https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD找到
```

#### 通过 `kubectl` 命令安装

```
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml
```

如果安装了 Milvus Operator，你可以看到以下输出。

```
namespace/milvus-operator已创建
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io已创建
serviceaccount/milvus-operator-controller-manager已创建
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-metrics-reader已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-proxy-role已创建
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding已创建
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding已创建
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-proxy-rolebinding已创建
configmap/milvus-operator-manager-config已创建
service/milvus-operator-controller-manager-metrics-service已创建
service/milvus-operator-webhook-service已创建
deployment.apps/milvus-operator-controller-manager已创建
certificate.cert-manager.io/milvus-operator-serving-cert已创建
issuer.cert-manager.io/milvus-operator-selfsigned-issuer已创建
mutatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-mutating-webhook-configuration已创建
validatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-validating-webhook-configuration已创建
```

运行 `$ kubectl get pods -n milvus-operator` 检查 Milvus Operator 是否正在运行。如果 Milvus Operator 正在运行，你将看到以下输出。

```
名称                               已准备好   状态    重启   年龄
milvus-operator-5fd77b87dc-msrk4   1/1     运行中   0          46s
```

## 安装 Milvus 集群

本教程使用默认配置安装 Milvus 集群。所有 Milvus 集群组件均已启用多个副本，这将占用很多资源。

<div class="alert note">
如果你的本地资源非常有限，你可以安装 <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/samples/milvus_cluster_minimum.yaml"> 最低配置 </a>)的 Milvus 集群。</div>

### 1. 部署 Milvus 集群

当 Milvus Operator 启动时，运行以下命令部署 Milvus 集群。

```
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

集群部署完成后，你将看到以下输出。

```
milvuscluster.milvus.io/my-release已创建
```

### 2. 检查 Milvus 集群状态
 



```
运行以下命令检查刚刚部署的Milvus集群的状态。

```
$ kubectl get milvus my-release -o yaml
```

你可以通过输出中的`status`字段确认Milvus集群的当前状态。当Milvus集群仍在创建中时，`status`显示为`Unhealthy`。

```
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T02: 52: 04Z"
    message: '获取 "http://my-release-minio.default: 9000/minio/admin/v3/info" 时出错：拨号
      tcp 10.96.78.153: 9000: 拒绝连接'
    reason: ClientError
    status: "False"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T02: 52: 04Z"
    message: 连接错误
    reason: PulsarNotReady
    status: "False"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T02: 52: 04Z"
    message: 所有 etcd 节点都处于不健康状态
    reason: EtcdNotReady
    status: "False"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T02: 52: 04Z"
    message: Milvus 依赖项尚未准备就绪
    reason: DependencyNotReady
    status: "False"
    type: MilvusReady
  endpoint: my-release-milvus.default: 19530
  status: Unhealthy
```

运行以下命令检查Milvus pod的当前状态。

```
$ kubectl get pods
```

```
名称                                  准备就绪   状态              重启次数   年龄
my-release-etcd-0                     0/1     运行中             0          16 秒
my-release-etcd-1                     0/1     正在创建容器       0          16 秒
my-release-etcd-2                     0/1     正在创建容器       0          16 秒
my-release-minio-0                    1/1     运行中             0          16 秒
my-release-minio-1                    1/1     运行中             0          16 秒
my-release-minio-2                    0/1     运行中             0          16 秒
my-release-minio-3                    0/1     正在创建容器       0          16 秒
my-release-pulsar-bookie-0            0/1     挂起               0          15 秒
my-release-pulsar-bookie-1            0/1     挂起               0          15 秒
my-release-pulsar-bookie-init-h6tfz   0/1     初始状态: 0/1        0          15 秒
my-release-pulsar-broker-0            0/1     初始状态: 0/2        0          15 秒
my-release-pulsar-broker-1            0/1     初始状态: 0/2        0          15 秒
my-release-pulsar-proxy-0             0/1     初始状态: 0/2        0          16 秒
my-release-pulsar-proxy-1             0/1     初始状态: 0/2        0          15 秒
my-release-pulsar-pulsar-init-d2t56   0/1     初始状态: 0/2        0          15 秒
my-release-pulsar-recovery-0          0/1     初始状态: 0/1        0          16 秒
my-release-pulsar-toolset-0           1/1     运行中             0          16 秒
my-release-pulsar-zookeeper-0         0/1     挂起               0          16 秒
```


### 3. 启用Milvus组件




Milvus Operator首先创建所有的依赖项，如etcd、Pulsar和MinIO，然后继续创建Milvus组件。因此，你现在只能看到etcd、Pulsar和MinIO的pods。一旦所有的依赖项都启用了，Milvus Operator就会启动所有的Milvus组件。Milvus集群的状态如下所示。

```
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T05: 59: 41Z"
    reason: StorageReady
    status: "True"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T06: 06: 23Z"
    message: Pulsar is ready
    reason: PulsarReady
    status: "True"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T05: 59: 41Z"
    message: Etcd endpoints is healthy
    reason: EtcdReady
    status: "True"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T06: 06: 24Z"
    message: '[datacoord datanode indexcoord indexnode proxy querycoord querynode
      rootcoord] not ready'
    reason: MilvusComponentNotHealthy
    status: "False"
    type: MilvusReady
  endpoint: my-release-milvus.default: 19530
  status: Unhealthy
```

再次检查Milvus pods的状态。

```
$ kubectl get pods
```

```
NAME                                            READY   STATUS              RESTARTS   AGE
my-release-etcd-0                               1/1     Running             0          6m49s
my-release-etcd-1                               1/1     Running             0          6m49s
my-release-etcd-2                               1/1     Running             0          6m49s
my-release-milvus-datacoord-6c7bb4b488-k9htl    0/1     ContainerCreating   0          16s
my-release-milvus-datanode-5c686bd65-wxtmf      0/1     ContainerCreating   0          16s
my-release-milvus-indexcoord-586b9f4987-vb7m4   0/1     Running             0          16s
my-release-milvus-indexnode-5b9787b54-xclbx     0/1     ContainerCreating   0          16s
my-release-milvus-proxy-84f67cdb7f-pg6wf        0/1     ContainerCreating   0          16s
my-release-milvus-querycoord-865cc56fb4-w2jmn   0/1     Running             0          16s
my-release-milvus-querynode-5bcb59f6-nhqqw      0/1     ContainerCreating   0          16s
my-release-milvus-rootcoord-fdcccfc84-9964g     0/1     Running             0          16s
my-release-minio-0                              1/1     Running             0          6m49s
my-release-minio-1                              1/1     Running             0          6m49s
my-release-minio-2                              1/1     Running             0          6m49s
my-release-minio-3                              1/1     Running             0          6m49s
my-release-pulsar-bookie-0                      1/1     Running             0          6m48s
my-release-pulsar-bookie-1                      1/1     Running             0          6m48s
my-release-pulsar-bookie-init-h6tfz             0/1     Completed           0          6m48s
my-release-pulsar-broker-0                      1/1     Running             0          6m48s
my-release-pulsar-broker-1                      1/1     Running             0          6m48s
my-release-pulsar-proxy-0                       1/1     Running             0          6m49s
my-release-pulsar-proxy-1                       1/1     Running             0          6m48s
my-release-pulsar-pulsar-init-d2t56             0/1     Completed           0          6m48s
my-release-pulsar-recovery-0                    1/1     Running             0          6m49s
my-release-pulsar-toolset-0                     1/1     Running             0          6m49s
my-release-pulsar-zookeeper-0                   1/1     Running             0          6m49s
my-release-pulsar-zookeeper-1                   1/1     Running             0          6m
my-release-pulsar-zookeeper-2                   1/1     Running             0          6m26s
```

当所有组件都启用时，Milvus集群的`status`显示为`Healthy`。

```
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T05: 59: 41Z"
    reason: StorageReady
    status: "True"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T06: 06: 23Z"
    message: Pulsar is ready
    reason: PulsarReady
    status: "True"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T05: 59: 41Z"
    message: Etcd endpoints is healthy
    reason: EtcdReady
    status: "True"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T06: 12: 36Z"
    message: All Milvus components are healthy
    reason: MilvusClusterHealthy
    status: "True"
    type: MilvusReady
  endpoint: my-release-milvus.default: 19530
  status: Healthy
```

再次检查Milvus pods的状态。你可以看到现在所有的pods都在运行。




当安装完成Milvus集群后，你可以学习如何[管理集合](/userGuide/manage-collections.md)。

## 连接到Milvus

验证Milvus服务器监听的本地端口。将pod名称替换为你自己的名称。

``` bash
$ kubectl get pod my-release-milvus-proxy-84f67cdb7f-pg6wf --template
='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

打开一个新的终端并运行以下命令，将本地端口转发到Milvus使用的端口。可选地，省略指定的端口，使用`:19530`，让`kubectl`为你分配一个本地端口，这样你就不必管理端口冲突。

``` bash
$ kubectl port-forward service/my-release-milvus 27017: 19530
Forwarding from 127.0.0.1: 27017 -> 19530
```

默认情况下，kubectl的端口转发只监听localhost。如果想让Milvus服务器监听所选的IP或所有地址，请使用`address`参数。

``` bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017: 19530
Forwarding from 0.0.0.0: 27017 -> 19530
```

## 卸载Milvus集群

运行以下命令以卸载Milvus集群。

```
$ kubectl delete milvus my-release
```

<div class="alert note">
<li>当使用默认配置删除Milvus集群时，诸如etcd、Pulsar和MinIO等依赖项不会被删除。因此，下次安装相同的Milvus集群实例时，这些依赖项将被再次使用。 </li>
<li>要一同删除依赖项和私有虚拟云（PVCs）以及Milvus集群，请参阅<a href="https://github.com/zilliztech/milvus-operator/blob/main/config/samples/milvus_deletion.yaml">配置文件</a>。</li>

</div>

## 卸载Milvus Operator

在K8s上卸载Milvus Operator也有两种方法：

### 使用Helm命令卸载Milvus Operator

```
$ helm -n milvus-operator uninstall milvus-operator
```

### 使用`kubectl`命令卸载Milvus Operator

```
$ kubectl delete -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v{{var.milvus_operator_version}}/deploy/manifests/deployment.yaml
```

## 删除K8s集群

当你不再需要测试环境中的K8s集群时，可以运行`$ minikube delete`命令来删除它。

## 下一步操作




安装了Milvus之后，你可以：
- 查看 [Hello Milvus](/getstarted/quickstart.md)，通过不同的SDK运行示例代码，了解Milvus的功能。
- 学习Milvus的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)
- [使用Milvus Operator升级Milvus](/adminGuide/upgrade_milvus_cluster-operator.md)
- [扩展你的Milvus集群](/adminGuide/scaleout.md)
- 在云上部署你的Milvus集群：
  - [Amazon EC2](/adminGuide/clouds/aws/aws.md)
  - [Amazon EKS](/adminGuide/clouds/aws/eks.md)
  - [Google Cloud](/adminGuide/clouds/gcp/gcp.md)
  - [Google Cloud Storage](/adminGuide/clouds/gcp/gcs.md)
  - [Microsoft Azure](/adminGuide/clouds/azure/azure.md)
  - [Microsoft Azure Blob Storage](/adminGuide/clouds/azure/abs.md)
- 探索 [Milvus备份](/userGuide/tools/milvus_backup_overview.md)，一个用于Milvus数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，一个用于调试Milvus和动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，一个直观的Milvus管理工具。
- [使用Prometheus监控Milvus](/adminGuide/monitor/monitor.md)

