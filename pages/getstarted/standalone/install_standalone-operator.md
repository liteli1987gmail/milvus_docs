---

id: install_standalone-operator.md
label: Milvus 操作符
order: 1
group: install_standalone-docker.md
summary: 学习如何使用 Milvus 操作符安装 Milvus 独立部署。
title: 使用 Milvus 操作符安装 Milvus 独立部署

---

{{tab}}

# 使用 Milvus 操作符安装 Milvus 独立部署

Milvus 操作符是一个解决方案，可以帮助您在目标 Kubernetes (K8s) 集群上部署和管理完整的 Milvus 服务栈。该栈包括所有 Milvus 组件和相关依赖项，如 etcd、Pulsar 和 MinIO。本主题描述了如何使用 Milvus 操作符安装 Milvus 独立部署。

## 先决条件
在安装之前，请[检查硬件和软件的要求](prerequisite-helm.md)。

## 创建 K8s 集群

如果您已经为生产部署了 K8s 集群，可以跳过这一步，直接进行[部署 Milvus 操作符](install_cluster-milvusoperator.md#Deploy-Milvus-Operator)。如果没有，您可以按照以下步骤快速创建一个 K8s 用于测试，然后使用它来通过 Milvus 操作符部署 Milvus 集群。

{{fragments/create_a_k8s_cluster_using_minikube.md}}

## 部署 Milvus 操作符

Milvus 操作符在 [Kubernetes 自定义资源](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)之上定义了 Milvus 集群自定义资源。当自定义资源被定义后，您可以以声明式的方式使用 K8s API，并管理 Milvus 部署栈以确保其可扩展性和高可用性。

### 先决条件

- 确保您可以通过 `kubectl` 或 `helm` 访问 K8s 集群。
- 确保已安装 StorageClass 依赖项，因为 Milvus 集群依赖于默认的 StorageClass 进行数据持久化。当安装 minikube 时，它依赖于默认的 StorageClass。通过运行命令 `kubectl get sc` 来检查依赖项。如果已安装 StorageClass，您将看到以下输出。如果没有，请查看[更改默认 StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)以获取更多信息。

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 1. 安装 cert-manager

<div class="alert note">
您可以通过 Helm 或 `kubectl` 命令安装 Milvus 操作符。如果您选择使用 Helm，可以跳过这一步，直接进行<a href=install_cluster-milvusoperator.md#Install-by-Helm-command>通过 Helm 命令安装</a>。
</div>

Milvus 操作符使用 [cert-manager](https://cert-manager.io/docs/installation/supported-releases/) 为 webhook 服务器提供证书。运行以下命令安装 cert-manager。

```
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
```

如果 cert-manager 已安装，您可以看到以下输出。

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
clusterrole.rbac.authorization.k8s.io/cert