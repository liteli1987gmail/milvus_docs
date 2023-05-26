
使用 Milvus Operator 安装 Milvus 集群[Milvus Operator](install_cluster-milvusoperator.md)[Helm](install_cluster-helm.md)
===============================

Milvus Operator 是一个解决方案，帮助您部署和管理全面的 Milvus 服务堆栈到目标 Kubernetes (K8s) 集群。该堆栈包括所有 Milvus 组件和相关依赖项，如 etcd、Pulsar 和 MinIO。本主题介绍如何在 K8s 上使用 Milvus Operator 部署 Milvus 集群。

先决条件
----

[在安装之前，请先检查硬件和软件要求](prerequisite-helm.md)。

创建K8s集群
-------

如果您已经为生产部署了一个K8s集群，则可以跳过此步骤，直接进入[部署Milvus Operator](install_cluster-milvusoperator.md#Deploy-Milvus-Operator)。如果没有，则可以按照以下步骤快速创建一个用于测试的K8s，然后使用它来使用Milvus Operator部署Milvus集群。

### 使用minikube创建K8s集群

我们建议使用[minikube](https://minikube.sigs.k8s.io/docs/)在K8s上安装Milvus，这是一个允许您在本地运行K8s的工具。

`minikube`只能在测试环境中使用。不建议在生产环境中以这种方式部署`Milvus`分布式集群。

#### 1. 安装 minikube

查看[安装 minikube](https://minikube.sigs.k8s.io/docs/start/)获取更多信息。

#### 2. 使用minikube启动K8s集群

安装minikube后，执行以下命令启动K8s集群。

```bash
$ minikube start

```

#### 3. 检查K8s集群状态

运行`$ kubectl cluster-info`检查刚创建的K8s集群状态。确保您可以通过`kubectl`访问K8s集群。如果您没有在本地安装`kubectl`，请参见[在minikube中使用kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

部署 Milvus 操作器
-------------

Milvus 操作器在 Kubernetes 自定义资源的基础上定义了 Milvus 集群的自定义资源。当定义了自定义资源后，您可以以声明方式使用 K8s API 管理 Milvus 部署栈，以确保其可伸缩性和高可用性。

### 先决条件

* 确保您可以通过`kubectl`或`helm`访问K8s集群。

* 确保安装了StorageClass依赖项，因为Milvus集群依赖默认的StorageClass进行数据持久化。当安装minikube时，会有一个默认的StorageClass依赖项。通过运行命令`kubectl get sc`来检查该依赖项。如果已安装StorageClass，则会看到以下输出。否则，请参见[更改默认的StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)获取更多信息。

```bash
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s

```

### 1. 安装 cert-manager

你可以使用Helm或`kubectl`命令安装Milvus Operator。如果选择使用Helm，请跳过此步骤并直接进行[通过Helm命令安装](install_cluster-milvusoperator.md#Install-by-Helm-command)。

Milvus Operator使用[cert-manager](https://cert-manager.io/docs/installation/supported-releases/)为Webhook服务器提供证书。运行以下命令安装cert-manager。

```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml

```

如果已安装`cert-manager`，则可以看到以下输出。

```bash
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

cert-manager要求使用1.1.3及以上版本。

运行`$ kubectl get pods -n cert-manager`检查cert-manager是否正在运行。如果所有Pod都在运行，则可以看到以下输出。
```bash
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-848f547974-gccz8             1/1     Running   0          70s
cert-manager-cainjector-54f4cc6b5-dpj84   1/1     Running   0          70s
cert-manager-webhook-7c9588c76-tqncn      1/1     Running   0          70s

```

### 2. Install Milvus Operator

有两种方法可以在K8s上安装Milvus Operator：

* 使用helm chart

* 使用`kubectl`命令直接使用原始清单安装

#### 通过Helm命令安装

```bash
helm install milvus-operator
  -n milvus-operator --create-namespace
  --wait --wait-for-jobs
  https://github.com/milvus-io/milvus-operator/releases/download/v0.7.12/milvus-operator-0.7.12.tgz

```

如果已安装Milvus Operator，则可以查看以下输出。

```bash
NAME: milvus-operator
LAST DEPLOYED: Thu Jul  7 13:18:40 2022
NAMESPACE: milvus-operator
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed
If Operator not started successfully, check the checker's log with `kubectl -n milvus-operator logs job/milvus-operator-checker`
Full Installation doc can be found in https://github.com/milvus-io/milvus-operator/blob/main/docs/installation/installation.md
Quick start with `kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvus_minimum.yaml`
More samples can be found in https://github.com/milvus-io/milvus-operator/tree/main/config/samples
CRD Documentation can be found in https://github.com/milvus-io/milvus-operator/tree/main/docs/CRD

```

#### 通过`kubectl`命令安装

```bash
$ kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/deploy/manifests/deployment.yaml

```

如果已安装Milvus Operator，则可以看到以下输出。

```bash
namespace/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
serviceaccount/milvus-operator-controller-manager created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrole.rbac.authorization.k8s.io/milvus-operator-metrics-reader created
clusterrole.rbac.authorization.k8s.io/milvus-operator-proxy-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-proxy-rolebinding created
configmap/milvus-operator-manager-config created
service/milvus-operator-controller-manager-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator-controller-manager created
certificate.cert-manager.io/milvus-operator-serving-cert created
issuer.cert-manager.io/milvus-operator-selfsigned-issuer created
mutatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-mutating-webhook-configuration created
validatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-validating-webhook-configuration created

```

运行`$ kubectl get pods -n milvus-operator`检查Milvus Operator是否正在运行。如果Milvus Operator正在运行，则可以看到以下输出。

```bash
NAME                               READY   STATUS    RESTARTS   AGE
milvus-operator-5fd77b87dc-msrk4   1/1     Running   0          46s

```

安装Milvus集群
----------

本教程使用默认配置安装Milvus集群。所有Milvus集群组件都启用了多个副本，这会消耗大量资源。

If you have very limited local resources, you can install a Milvus cluster [使用最小配置](https://github.com/milvus-io/milvus-operator/blob/main/config/samples/milvus_cluster_minimum.yaml)).

### 1. 部署Milvus集群

Milvus Operator启动后，请运行以下命令部署Milvus集群。

```bash
$ kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvus_cluster_default.yaml

```

集群部署完成后，您可以看到以下输出内容。

```bash
milvuscluster.milvus.io/my-release created

```

### 2. 检查 Milvus 集群状态

运行以下命令检查您刚部署的 Milvus 集群的状态。

```bash
$ kubectl get milvus my-release -o yaml

```

您可以从输出的 `status` 字段确认 Milvus 集群的当前状态。当 Milvus 集群仍在创建过程中时，`status` 显示为 `Unhealthy`。

```bash
apiVersion: milvus.io/v1alpha1
kind: MilvusCluster
metadata:
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T02:52:04Z"
    message: 'Get "http://my-release-minio.default:9000/minio/admin/v3/info": dial
      tcp 10.96.78.153:9000: connect: connection refused'
    reason: ClientError
    status: "False"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T02:52:04Z"
    message: connection error
    reason: PulsarNotReady
    status: "False"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T02:52:04Z"
    message: All etcd endpoints are unhealthy
    reason: EtcdNotReady
    status: "False"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T02:52:04Z"
    message: Milvus Dependencies is not ready
    reason: DependencyNotReady
    status: "False"
    type: MilvusReady
  endpoint: my-release-milvus.default:19530
  status: Unhealthy

```

运行以下命令检查 Milvus pods 的当前状态。

```bash
$ kubectl get pods

```

```bash
NAME                                  READY   STATUS              RESTARTS   AGE
my-release-etcd-0                     0/1     Running             0          16s
my-release-etcd-1                     0/1     ContainerCreating   0          16s
my-release-etcd-2                     0/1     ContainerCreating   0          16s
my-release-minio-0                    1/1     Running             0          16s
my-release-minio-1                    1/1     Running             0          16s
my-release-minio-2                    0/1     Running             0          16s
my-release-minio-3                    0/1     ContainerCreating   0          16s
my-release-pulsar-bookie-0            0/1     Pending             0          15s
my-release-pulsar-bookie-1            0/1     Pending             0          15s
my-release-pulsar-bookie-init-h6tfz   0/1     Init:0/1            0          15s
my-release-pulsar-broker-0            0/1     Init:0/2            0          15s
my-release-pulsar-broker-1            0/1     Init:0/2            0          15s
my-release-pulsar-proxy-0             0/1     Init:0/2            0          16s
my-release-pulsar-proxy-1             0/1     Init:0/2            0          15s
my-release-pulsar-pulsar-init-d2t56   0/1     Init:0/2            0          15s
my-release-pulsar-recovery-0          0/1     Init:0/1            0          16s
my-release-pulsar-toolset-0           1/1     Running             0          16s
my-release-pulsar-zookeeper-0         0/1     Pending             0          16s

```

### 3. 启用Milvus组件

Milvus Operator首先创建所有依赖项，如etcd，Pulsar和MinIO，然后继续创建Milvus组件。因此，您现在只能看到etcd，Pulsar和MinIO的pod。一旦所有依赖项都启用，Milvus Operator将启动所有Milvus组件。Milvus集群的状态显示在以下输出中。

```bash
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T05:59:41Z"
    reason: StorageReady
    status: "True"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T06:06:23Z"
    message: Pulsar is ready
    reason: PulsarReady
    status: "True"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T05:59:41Z"
    message: Etcd endpoints is healthy
    reason: EtcdReady
    status: "True"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T06:06:24Z"
    message: '[datacoord datanode indexcoord indexnode proxy querycoord querynode
      rootcoord] not ready'
    reason: MilvusComponentNotHealthy
    status: "False"
    type: MilvusReady
  endpoint: my-release-milvus.default:19530
  status: Unhealthy

```

再次检查Milvus pods的状态。

```bash
$ kubectl get pods

```

```bash
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

```bash
...
status:
  conditions:
  - lastTransitionTime: "2021-11-02T05:59:41Z"
    reason: StorageReady
    status: "True"
    type: StorageReady
  - lastTransitionTime: "2021-11-02T06:06:23Z"
    message: Pulsar is ready
    reason: PulsarReady
    status: "True"
    type: PulsarReady
  - lastTransitionTime: "2021-11-02T05:59:41Z"
    message: Etcd endpoints is healthy
    reason: EtcdReady
    status: "True"
    type: EtcdReady
  - lastTransitionTime: "2021-11-02T06:12:36Z"
    message: All Milvus components are healthy
    reason: MilvusClusterHealthy
    status: "True"
    type: MilvusReady
  endpoint: my-release-milvus.default:19530
  status: Healthy

```

再次检查Milvus pod的状态。现在你可以看到所有的pod都在运行。

```bash
$ kubectl get pods
NAME                                            READY   STATUS      RESTARTS   AGE
my-release-etcd-0                               1/1     Running     0          14m
my-release-etcd-1                               1/1     Running     0          14m
my-release-etcd-2                               1/1     Running     0          14m
my-release-milvus-datacoord-6c7bb4b488-k9htl    1/1     Running     0          6m
my-release-milvus-datanode-5c686bd65-wxtmf      1/1     Running     0          6m
my-release-milvus-indexcoord-586b9f4987-vb7m4   1/1     Running     0          6m
my-release-milvus-indexnode-5b9787b54-xclbx     1/1     Running     0          6m
my-release-milvus-proxy-84f67cdb7f-pg6wf        1/1     Running     0          6m
my-release-milvus-querycoord-865cc56fb4-w2jmn   1/1     Running     0          6m
my-release-milvus-querynode-5bcb59f6-nhqqw      1/1     Running     0          6m
my-release-milvus-rootcoord-fdcccfc84-9964g     1/1     Running     0          6m
my-release-minio-0                              1/1     Running     0          14m
my-release-minio-1                              1/1     Running     0          14m
my-release-minio-2                              1/1     Running     0          14m
my-release-minio-3                              1/1     Running     0          14m
my-release-pulsar-bookie-0                      1/1     Running     0          14m
my-release-pulsar-bookie-1                      1/1     Running     0          14m
my-release-pulsar-bookie-init-h6tfz             0/1     Completed   0          14m
my-release-pulsar-broker-0                      1/1     Running     0          14m
my-release-pulsar-broker-1                      1/1     Running     0          14m
my-release-pulsar-proxy-0                       1/1     Running     0          14m
my-release-pulsar-proxy-1                       1/1     Running     0          14m
my-release-pulsar-pulsar-init-d2t56             0/1     Completed   0          14m
my-release-pulsar-recovery-0                    1/1     Running     0          14m
my-release-pulsar-toolset-0                     1/1     Running     0          14m
my-release-pulsar-zookeeper-0                   1/1     Running     0          14m
my-release-pulsar-zookeeper-1                   1/1     Running     0          13m
my-release-pulsar-zookeeper-2                   1/1     Running     0          13m

```

在安装Milvus集群后，您可以学习如何[连接Milvus服务器](manage_connection.md)。

卸载Milvus集群
----------

运行以下命令卸载Milvus集群。

```bash
$ kubectl delete milvus my-release

```

- 如果你使用默认配置删除Milvus集群，那么像etcd、Pulsar和MinIO这样的依赖项不会被删除。因此，下次安装相同的Milvus集群实例时，这些依赖项将会再次被使用。

- 要删除依赖项和私有虚拟云（PVCs）以及Milvus集群，请参阅[配置文件](https://github.com/milvus-io/milvus-operator/blob/main/config/samples/milvus_deletion.yaml)。

卸载Milvus Operator
-----------------

在 K8s 上卸载 Milvus 操作符也有两种方式：

### 使用 Helm 命令卸载 Milvus 操作符

```bash
$ helm -n milvus-operator uninstall milvus-operator

```

### 通过`kubectl`命令卸载Milvus Operator

```bash
$ kubectl delete -f https://raw.githubusercontent.com/milvus-io/milvus-operator/v0.7.12/deploy/manifests/deployment.yaml

```

删除K8s集群
-------

当您不再需要测试环境中的K8s集群时，可以运行`$ minikube delete`进行删除。

下一步
---

安装 Milvus 后，您可以：

* 查看[Hello Milvus](example_code.md)，运行使用不同 SDK 的示例代码，了解 Milvus 的功能。

* 学习 Milvus 的基本操作：

	+ [连接到 Milvus 服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)

* [使用Helm Chart升级Milvus](upgrade.md)

* [扩展你的Milvus集群](scaleout.md)

* 在云上部署你的Milvus集群：

	+ [亚马逊EC2](aws.md)
	+ [亚马逊EKS](eks.md)

* 探索[MilvusDM](migrate_overview.md)，一个用于在Milvus中导入和导出数据的开源工具。

* [使用Prometheus监控Milvus](monitor.md)
