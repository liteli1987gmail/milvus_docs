


### 使用 minikube 创建 K8s 集群

我们建议使用 [minikube](https://minikube.sigs.k8s.io/docs/) 在本地运行 K8s 来安装 Milvus。

<div class="alert note">
minikube 只能在测试环境中使用。不建议在生产环境中使用这种方式部署 Milvus 分布式集群。
</div>

#### 1. 安装 minikube

请参考 [安装 minikube](https://minikube.sigs.k8s.io/docs/start/) 获取更多信息。

#### 2. 使用 minikube 启动 K8s 集群

安装完 minikube 后，运行以下命令启动 K8s 集群。

```
$ minikube start
```

#### 3. 检查 K8s 集群状态



运行 `$ kubectl cluster-info` 来检查你刚创建的 K8s 集群的状态。确保你可以通过 `kubectl` 访问该 K8s 集群。如果你在本地尚未安装 `kubectl`，请参阅 [在 minikube 内使用 kubectl](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)。

