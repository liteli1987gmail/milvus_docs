[Milvus操作员](install_standalone-operator.md)[Helm](install_standalone-helm.md)[Docker Compose](install_standalone-docker.md)
使用Milvus操作员安装Milvus独立版
======================

Milvus Operator是一种解决方案，帮助您在目标Kubernetes（K8s）集群上部署和管理完整的Milvus服务堆栈。该堆栈包含所有Milvus组件和相关依赖项，如etcd、Pulsar和MinIO。本主题介绍如何使用Milvus Operator安装Milvus独立版。

先决条件
----

[在安装之前，请检查硬件和软件的要求](prerequisite-helm.md)。

创建K8s集群
-------

如果您已经为生产部署了K8s集群，则可以跳过此步骤，直接进入[部署Milvus Operator](install_cluster-milvusoperator.md#Deploy-Milvus-Operator)。如果没有，您可以按照以下步骤快速创建K8s用于测试，然后使用它来通过Milvus Operator部署Milvus集群。

### 使用minikube创建K8s集群

我们推荐使用[minikube](https://minikube.sigs.k8s.io/docs/)在K8s上安装Milvus，它是一个运行K8s本地环境的工具。

minikube can only be used in test environments. It is not recommended that you deploy Milvus distributed clusters in this way in production environments.

#### 1. 安装 minikube

请参阅[安装 minikube](https://minikube.sigs.k8s.io/docs/start/)以获取更多信息。

#### 2. 使用minikube启动K8s集群

安装完minikube后，运行以下命令启动K8s集群。

```
$ minikube start

```

#### 3. 检查K8s集群状态

运行`$ kubectl cluster-info`检查所创建的K8s集群的状态。确保可以通过`kubectl`访问K8s集群。如果您尚未在本地安装`kubectl`，请参见[在minikube内使用kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

部署Milvus Operator
-----------------

Milvus Operator通过[Kubernetes自定义资源](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)定义Milvus集群自定义资源。当定义了自定义资源后，您可以使用K8s API以声明方式管理Milvus的部署堆栈，以确保其可扩展性和高可用性。

### 准备工作

* 确保您可以通过`kubectl`或`helm`访问K8s集群。

* 确保已安装StorageClass依赖项，因为Milvus集群依赖默认的StorageClass进行数据持久化。当安装minikube时，默认依赖于StorageClass。通过运行命令`kubectl get sc`检查依赖项。如果安装了StorageClass，则将看到以下输出。如果没有，请查看[更改默认的StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)以获取更多信息。

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s

```

### 1. 安装 cert-manager

You can install Milvus Operator with Helm or `kubectl` command. If you choose to use Helm, you can skip this step and proceed directly to [通过Helm命令安装](install_cluster-milvusoperator.md#通过Helm命令安装).

Milvus Operator 使用 [cert-manager](https://cert-manager.io/docs/installation/supported-releases/) 为 webhook 服务器提供证书。运行以下命令安装 cert-manager。

```
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml

```

如果已安装了cert-manager，则可以看到以下输出。

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

cert-manager version 1.13 or later is required.

运行`$ kubectl get pods -n cert-manager`检查cert-manager是否正在运行。如果所有pod都在运行，则可以看到以下输出。

```
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-848f547974-gccz8             1/1     Running   0          70s
cert-manager-cainjector-54f4cc6b5-dpj84   1/1     Running   0          70s
cert-manager-webhook-7c9588c76-tqncn      1/1     Running   0          70s

```

### 2. 安装Milvus Operator

有两种方法可以在K8s上安装Milvus Operator：

* 使用helm chart

* 使用`kubectl`命令直接使用原始清单安装

#### 通过Helm命令安装

```
helm install milvus-operator \
  -n milvus-operator --create-namespace \
  --wait --wait-for-jobs \
  https://github.com/milvus-io/milvus-operator/releases/download/v0.7.12/milvus-operator-0.7.12.tgz

```

如果安装了Milvus Operator，您可以看到以下输出。

```
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

#### 安装 `kubectl` 命令

```
$ kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/deploy/manifests/deployment.yaml

```

如果 Milvus Operator 已安装，您可以看到以下输出。

```
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

运行 `$ kubectl get pods -n milvus-operator` 检查 Milvus Operator 是否运行。如果 Milvus Operator 运行，则可以看到以下输出。

```
NAME                               READY   STATUS    RESTARTS   AGE
milvus-operator-5fd77b87dc-msrk4   1/1     Running   0          46s

```

安装独立版 Milvus
------------

### 1. 安装 Milvus

当 Milvus Operator 启动后，请运行以下命令安装 Milvus。

```
$ kubectl apply -f https://raw.githubusercontent.com/milvus-io/milvus-operator/main/config/samples/milvus_default.yaml

```

### 2. 检查 Milvus 独立版的状态

运行以下命令来检查刚刚安装的 Milvus 的状态。

```
$ kubectl get milvus my-release -o yaml

```

当 Milvus 成功安装后，您可以学习如何[连接 Milvus 服务器](manage_connection.md)。

卸载 Milvus 独立版
-------------

运行以下命令以卸载 Milvus。

```
$ kubectl delete milvus my-release

```

卸载 Milvus Operator
------------------

在 K8s 上卸载 Milvus Operator 也有两种方法：

### 使用Helm命令卸载Milvus Operator

```
$ helm -n milvus-operator uninstall milvus-operator

```

### 通过`kubectl`命令卸载Milvus操作器

```
$ kubectl delete -f https://raw.githubusercontent.com/milvus-io/milvus-operator/v0.7.12/deploy/manifests/deployment.yaml

```

删除K8s集群
-------

当你不再需要测试环境中的K8s集群时，可以运行`$ minikube delete`以删除它。

接下来
---

安装完 Milvus 后，您可以：

* 查看[Hello Milvus](example_code.md)，运行不同的 SDK 示例代码，了解 Milvus 的功能。

* 学习Milvus的基本操作：

	+ [连接到Milvus服务器](manage_connection.md)
	+ [创建集合](create_collection.md)
	+ [创建分区](create_partition.md)
	+ [插入数据](insert_data.md)
	+ [进行向量搜索](search.md)

* [使用Helm Chart升级Milvus](upgrade.md)

* 探索[MilvusDM](migrate_overview.md)，一个专门为在Milvus中导入和导出数据而设计的开源工具。

* [使用Prometheus监控Milvus](monitor.md)
