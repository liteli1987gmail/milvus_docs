### 使用 minikube 创建 K8s 集群

我们建议使用 [minikube](https://minikube.sigs.k8s.io/docs/) 在 K8s 上安装 Milvus，minikube 是一个允许您在本地运行 K8s 的工具。

<div class="alert note">
minikube 只能在测试环境中使用。我们不建议您以这种方式在生产环境中部署 Milvus 分布式集群。
</div>

#### 1. 安装 minikube

有关更多信息，请参见 [安装 minikube](https://minikube.sigs.k8s.io/docs/start/)。

#### 2. 使用 minikube 启动 K8s 集群

安装 minikube 后，运行以下命令以启动 K8s 集群。

```
$ minikube start
```

#### 3. 检查 K8s 集群状态

运行 `$ kubectl cluster-info` 以检查您刚刚创建的 K8s 集群的状态。确保您可以通过 `kubectl` 访问 K8s 集群。如果您尚未在本地安装 `kubectl`，请参见 [在 minikube 内部使用 kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。