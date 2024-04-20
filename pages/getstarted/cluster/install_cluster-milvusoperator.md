---

id: 安装_milvusoperator集群.md
label: Milvus Operator
related_key: Kubernetes
order: 0
group: 安装_milvusoperator集群.md
summary: 学习如何使用Milvus Operator在Kubernetes上安装Milvus集群
title: 使用Milvus Operator安装Milvus集群

---

{{tab}}

# 使用Milvus Operator安装Milvus集群

Milvus Operator是一个解决方案，它可以帮助您在目标Kubernetes（K8s）集群上部署和管理完整的Milvus服务栈。该栈包括所有Milvus组件和相关依赖项，如etcd、Pulsar和MinIO。本主题介绍如何在K8s上使用Milvus Operator部署Milvus集群。

## 前提条件
在安装之前，请[检查硬件和软件的要求](prerequisite-helm.md)。

## 创建一个K8s集群

如果您已经为生产部署了一个K8s集群，您可以跳过这一步，直接进行[部署Milvus Operator](#Deploy-Milvus-Operator)。如果没有，您可以按照以下步骤快速创建一个K8s进行测试，然后使用它来部署带有Milvus Operator的Milvus集群。

{{fragments/create_a_k8s_cluster_using_minikube.md}}

## 部署Milvus Operator

Milvus Operator在[Kubernetes Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)之上定义了Milvus集群自定义资源。当自定义资源被定义后，您可以以声明式的方式使用K8s API，并管理Milvus部署栈以确保其可扩展性和高可用性。

### 前提条件

- 确保您可以通过`kubectl`或`helm`访问K8s集群。
- 确保已安装StorageClass依赖项，因为Milvus集群依赖于默认的StorageClass进行数据持久化。minikube在安装时依赖于默认的StorageClass。通过运行命令`kubectl get sc`来检查依赖项。如果已安装StorageClass，您将看到以下输出。如果没有，请查看[更改默认StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)以获取更多信息。

```
NAME                  PROVISIONER                  RECLAIMPOLICY    VOLUMEBIINDINGMODE    ALLOWVOLUMEEXPANSION     AGE
standard (default)    k8s.io/minikube-hostpath     Delete           Immediate             false                    3m36s
```

### 1. 安装cert-manager

<div class="alert note">
您可以通过Helm或`kubectl`命令安装Milvus Operator。如果您选择使用Helm，您可以跳过这一步，直接进行<a href=#Install-by-Helm-command>通过Helm命令安装</a>。
</div>

Milvus Operator使用[cert-manager](https://cert-manager.io/docs/installation/supported-releases/)为webhook服务器提供证书。运行以下命令安装cert-manager。

```
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
```

如果cert-manager已安装，您将看到以下输出。

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
clusterrole.rbac.authorization.k8s.io/cert-manager