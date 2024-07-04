


# 使用 Milvus Operator 安装独立版 Milvus

Milvus Operator 是一个解决方案，可以帮助你在 Kubernetes（K8s）集群中部署和管理完整的 Milvus 服务栈。该栈包括所有 Milvus 组件以及相关依赖项，如 etcd、Pulsar 和 MinIO。本主题描述了如何使用 Milvus Operator 安装独立版 Milvus。

## 先决条件
在进行安装之前，请先 [查看硬件和软件要求](/getstarted/prerequisite-helm.md)。

## 创建 K8s 集群

如果你已经为生产部署创建了 K8s 集群，可以跳过此步骤，直接进入 [部署 Milvus Operator](install_cluster-milvusoperator.md#Deploy-Milvus-Operator)。否则，请按照以下步骤快速创建用于测试的 K8s 集群，然后使用它来部署带有 Milvus Operator 的 Milvus 集群。

{{fragments/create_a_k8s_cluster_using_minikube.md}}

## 部署 Milvus Operator

Milvus Operator 在 [Kubernetes 自定义资源](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 之上定义了 Milvus 集群的自定义资源。当定义自定义资源时，你可以使用 K8s API 进行声明式管理 Milvus 部署栈，以确保其可伸缩性和高可用性。

### 先决条件

- 确保你可以通过 `kubectl` 或 `helm` 访问 K8s 集群。
- 确保已安装 StorageClass 依赖项，因为 Milvus 集群依赖于默认的 StorageClass 进行数据持久化。当安装时，minikube 具有对默认 StorageClass 的依赖。通过运行命令 `kubectl get sc` 检查依赖项是否已安装。如果已安装 StorageClass，则会显示以下输出。如果没有安装，请参阅 [更改默认的 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/) 获取更多信息。

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 1. 安装 cert-manager





<div class="alert note">
你可以使用 Helm 或 kubectl 命令安装 Milvus Operator。如果选择使用 Helm，可以跳过此步骤，直接转到 <a href=install_cluster-milvusoperator.md#Install-by-Helm-command> 通过 Helm 命令安装 </a>。
</div>

Milvus Operator 使用 [cert-manager](https://cert-manager.io/docs/installation/supported-releases/) 为 webhook 服务器提供证书。运行以下命令安装 cert-manager。

```
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
```

如果已安装 cert-manager，则可以看到以下输出。

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
需要 cert-manager 版本 1.13 或更高版本。
</div>

运行 `$ kubectl get pods -n cert-manager` 检查 cert-manager 是否运行。如果所有的 pod 都正在运行，可以看到以下输出。

```
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-848f547974-gccz8             1/1     Running   0          70s
cert-manager-cainjector-54f4cc6b5-dpj84   1/1     Running   0          70s
cert-manager-webhook-7c9588c76-tqncn      1/1     Running   0          70s
```

### 2. 安装 Milvus Operator

有两种方式可以在 K8s 上安装 Milvus Operator：

- 使用 helm chart
- 直接使用原始清单使用 kubectl 命令

#### 通过 Helm 命令安装



```
helm install milvus-operator \
  -n milvus-operator --create-namespace \
  --wait --wait-for-jobs \
  https://github.com/zilliztech/milvus-operator/releases/download/v{{var.milvus_operator_version}}/milvus-operator-{{var.milvus_operator_version}}.tgz
```

如果已安装 Milvus Operator，你将看到以下输出。
```
名称：milvus-operator
部署日期：2022年7月7日星期四13:18:40
命名空间：milvus-operator
状态：已部署
修订版本：1
测试套件：无
注意事项：
Milvus Operator正在启动，使用 `kubectl get -n milvus-operator deploy/milvus-operator` 检查是否成功安装
如果运算符启动不成功，请使用 `kubectl -n milvus-operator logs job/milvus-operator-checker` 检查检查器日志
完整的安装文档可以在 https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md找到
使用 `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml` 快速启动
更多示例可以在 https://github.com/zilliztech/milvus-operator/tree/main/config/samples 找到
CRD文档可以在 https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD 找到
```

#### 使用 `kubectl` 命令安装

```
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml
```

如果已安装 Milvus Operator，你将看到以下输出。

```
名称空间 /milvus-operator 已创建
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io 已创建
serviceaccount/milvus-operator-controller-manager 已创建
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role 已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role 已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-metrics-reader 已创建
clusterrole.rbac.authorization.k8s.io/milvus-operator-proxy-role 已创建
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding 已创建
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding 已创建
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-proxy-rolebinding 已创建
configmap/milvus-operator-manager-config 已创建
service/milvus-operator-controller-manager-metrics-service 已创建
service/milvus-operator-webhook-service 已创建
deployment.apps/milvus-operator-controller-manager 已创建
certificate.cert-manager.io/milvus-operator-serving-cert 已创建
issuer.cert-manager.io/milvus-operator-selfsigned-issuer 已创建
mutatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-mutating-webhook-configuration 已创建
validatingwebhookconfiguration.admissionregistration.k8s.io/milvus-operator-validating-webhook-configuration 已创建
```

运行 `$ kubectl get pods -n milvus-operator` 来检查 Milvus Operator 是否正在运行。如果 Milvus Operator 正在运行，你将会看到以下输出。

```
名称                                 已准备   状态    重启   年龄
milvus-operator-5fd77b87dc-msrk4   1/1     正在运行   0          46秒
```

## 安装独立的 Milvus

### 1. 安装 Milvus

当 Milvus Operator 启动后，运行以下命令来安装 Milvus。

```
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_default.yaml
```


### 2. 检查独立的 Milvus 状态

运行以下命令来检查你刚安装的 Milvus 的状态。

```
$ kubectl get milvus my-release -o yaml
```

当 Milvus 成功安装后，你可以学习如何 [管理集合](/userGuide/manage-collections.md)。

## 连接到 Milvus



#### 验证 Milvus 服务器监听的本地端口。使用你自己的 Pod 名称替换。

```bash
$ kubectl get pod my-release-milvus-proxy-84f67cdb7f-pg6wf --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

在一个新的终端中运行以下命令，将本地端口转发到 Milvus 使用的端口。可以选择省略指定的端口，使用 `:19530` 让 `kubectl` 为你分配一个本地端口，这样你就不必处理端口冲突。

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
Forwarding from 127.0.0.1:27017 -> 19530
```

默认情况下，kubectl 的端口转发仅在本地主机上进行侦听。如果要让 Milvus 服务器在选定的 IP 或所有 IP 地址上侦听，请使用 `address` 标志。

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载独立的 Milvus

运行以下命令以卸载 Milvus。

```
$ kubectl delete milvus my-release
```

## 卸载 Milvus Operator

在 K8s 上卸载 Milvus Operator 也有两种方法：

### 使用 Helm 命令卸载 Milvus Operator

```
$ helm -n milvus-operator uninstall milvus-operator
```

### 使用 `kubectl` 命令卸载 Milvus Operator

```
$ kubectl delete -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v{{var.milvus_operator_version}}/deploy/manifests/deployment.yaml
```

## 删除 K8s 集群

当你不再需要测试环境中的 K8s 集群时，可以运行 `$ minikube delete` 来删除它。

## 下一步操作




使用安装了 Milvus 的方式，你可以：
-查看 [Hello Milvus](/getstarted/quickstart.md) 以运行一个包含不同 SDK 的示例代码，了解 Milvus 的功能。
-了解 Milvus 的基本操作：
  - [管理数据库](/userGuide/manage_databases.md)
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)
- [使用 Milvus Operator 升级 Milvus](/adminGuide/upgrade_milvus_standalone-operator.md)
- 探索 [Milvus 备份](/userGuide/tools/milvus_backup_overview.md)，这是一个用于进行 Milvus 数据备份的开源工具。
- 探索 [Birdwatcher](/userGuide/tools/birdwatcher_overview.md)，这是一个用于调试 Milvus 和进行动态配置更新的开源工具。
- 探索 [Attu](https://milvus.io/docs/attu.md)，这是一个用于直观管理 Milvus 的开源 GUI 工具。
- [使用 Prometheus 监控 Milvus](/adminGuide/monitor/monitor.md)

