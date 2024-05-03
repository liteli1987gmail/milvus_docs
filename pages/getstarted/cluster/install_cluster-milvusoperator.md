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

Milvus Operator是一个解决方案，它可以帮助您在目标Kubernetes(K8s)集群上部署和管理完整的Milvus服务栈。该栈包括所有Milvus组件和相关依赖项，如etcd、Pulsar和MinIO。本主题介绍如何在K8s上使用Milvus Operator部署Milvus集群。

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
cert-manager version 1.1.3 or later is required.
</div>

Run `$ kubectl get pods -n cert-manager` to check if cert-manager is running. You can see the following output if all the pods are running.

```
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-848f547974-gccz8             1/1     Running   0          70s
cert-manager-cainjector-54f4cc6b5-dpj84   1/1     Running   0          70s
cert-manager-webhook-7c9588c76-tqncn      1/1     Running   0          70s
```

### 2.安装Milvus操作员

在K8s上安装Milvus Operator有两种方法：

- 带舵图
- 直接使用带有原始清单的“kubectl”命令

#### 通过Helm命令安装

```bash
helm install milvus-operator \
  -n milvus-operator --create-namespace \
  --wait --wait-for-jobs \
  https://github.com/zilliztech/milvus-operator/releases/download/v{{var.milvus_operator_version}}/milvus-operator-{{var.milvus_operator_version}}.tgz
```

如果安装了Milvus Operator，您可以看到以下输出。

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
Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md
Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`
More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples
CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD
```

#### 通过“kubectl”命令安装

```bash
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml
```

如果安装了Milvus Operator，您可以看到以下输出。

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

运行“$kubectl get-pods-n milvus operator”以检查milvus operator是否正在运行。如果Milvus Operator正在运行，您可以看到以下输出。

```bash
NAME                               READY   STATUS    RESTARTS   AGE
milvus-operator-5fd77b87dc-msrk4   1/1     Running   0          46s
```

## 安装Milvus集群

本教程使用默认配置来安装Milvus集群。所有Milvus集群组件都启用了多个副本，这会消耗大量资源。

<div class=“alert note”>
如果您的本地资源非常有限，您可以安装Milvus集群<a href=“https://github.com/zilliztech/milvus-operator/blob/main/config/samples/milvus_cluster_minimum.yaml“>使用最低配置</a>)。
</div>

### 1.部署Milvus集群

Milvus Operator启动后，运行以下命令部署Milvus集群。

```bash
$ kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml
```

部署集群后，您可以看到以下输出。

```bash
milvuscluster.milvus.io/my-release created
```

### 2. 检查Milvus集群状态

运行以下命令以检查您刚刚部署的Milvus集群的状态。

```bash
$ kubectl get milvus my-release -o yaml
```


您可以从输出中的“status”字段确认Milvus集群的当前状态。当Milvus集群仍在创建中时，“status”显示为“Unhealthy”。

```yaml
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

运行以下命令以检查Milvus pods的当前状态。

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

Milvus Operator首先创建所有依赖项，如etcd、Pulsar和MinIO，然后继续创建Milvus组件。因此，你现在只能看到etcd、Pulsar和Mineo的吊舱。一旦启用了所有非独立性，Milvus操作员将启动所有Milvus组件。Milvus集群的状态如以下输出所示。

```yaml
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

再次检查 Milvus pods 的状态

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

当所有组件都启用时，Milvus集群的“status”显示为“Healthy”。

```yaml
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

再次检查milvus pods的状态，你可以发现所有的pods都在运行中了。

```bash
$ kubectl get pods
```

```bash
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

安装Milvus集群后，您可以学习如何[连接到Milvus服务器](manage_connection.md)。

## 连接Milvus

验证Milvus服务器正在侦听哪个本地端口。将pod名称替换为您自己的名称。

```bash
$ kubectl get pod my-release-milvus-proxy-84f67cdb7f-pg6wf --template
='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
19530
```

打开一个新的终端，运行以下命令将本地端口转发到Milvus使用的端口。或者，省略指定的端口，并使用“：19530”让“kubectl”为您分配一个本地端口，这样您就不必管理端口冲突。

```bash
$ kubectl port-forward service/my-release-milvus 27017:19530
Forwarding from 127.0.0.1:27017 -> 19530
```

默认情况下，kubectl的端口转发只在localhost上侦听。如果您希望Milvus服务器侦听选定的IP或所有地址，请使用标志“address”。

```bash
$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus 27017:19530
Forwarding from 0.0.0.0:27017 -> 19530
```

## 卸载Milvus集群

运行以下命令卸载Milvus集群。

```bash
$ kubectl delete milvus my-release
```

<div class="alert note">
<li>When you delete the Milvus cluster using the default configuration, dependencies like etcd, Pulsar, and MinIO are not deleted. Therefore, next time when you install the same Milvus cluster instance, these dependencies will be used again. </li>
<li>To delete the dependencies and private virtual clouds (PVCs) along with the Milvus cluster, see <a href="https://github.com/zilliztech/milvus-operator/blob/main/config/samples/milvus_deletion.yaml">configuration file</a>.</li>

</div>

## 卸载Milvus操作员

还有两种方法可以在K8s上卸载Milvus Operator：

### 通过Helm命令卸载Milvus操作员

```bash
$ helm -n milvus-operator uninstall milvus-operator
```

### 通过“kubectl”命令卸载 Milvus Operator

```bash
$ kubectl delete -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v{{var.milvus_operator_version}}/deploy/manifests/deployment.yaml
```

## 删除K8s集群

当您在测试环境中不再需要K8s集群时，可以运行“$minikube-delete”来删除它。

## 接下来是什么

安装Milvus后，您可以：
- 检查[Hello-Milvus](example_code.md)，用不同的SDK运行示例代码，看看Milvus能做什么。
- 学习Milvus的基本操作：
  - [连接到Milvus服务器](manage_connection.md)
  - [创建集合](Create_collection.md)
  - [创建分区](Create_partition.md)
  - [插入数据](Insert_data.md)
  - [进行矢量搜索](search.md)
  - [使用Milvus运算符升级Milvus](Upgrade_Milvus_cluster-Operator.md)
  - [缩放Milvus集群](scaleout.md)
- 在云上部署您的Milvu集群：
  - [亚马逊EC2](aws.md)
  - [亚马逊EKS](EKS.md)
- 探索[MilvusDM](migrate_overview.md)，这是一个用于在Milvus中导入和导出数据的开源工具。
- [用普罗米修斯监视麋鹿](Monitor.md)


