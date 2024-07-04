

            
# 安装 Birdwatcher

这个页面演示了如何安装 Birdwatcher。

## 本地安装

如果你已经通过 Docker 安装了独立版的 Milvus（参考 [使用 Docker 安装独立版](/getstarted/standalone/install_standalone-docker.md)），你最好下载并安装已构建的二进制文件，将 Birdwatcher 作为普通的 Go 模块进行安装，或者从源代码构建 Birdwatcher。

- 将其作为普通的 Go 模块进行安装：

    ```shell
    git clone https://github.com/milvus-io/birdwatcher.git
    cd birdwatcher
    go install github.com/milvus-io/birdwatcher
    ```

    然后你可以运行 Birdwatcher，如下所示：

    ```shell
    go run main.go
    ```

- 从源代码构建 Birdwatcher：

    ```shell
    git clone https://github.com/milvus-io/birdwatcher.git
    cd birdwatcher
    go build -o birdwatcher main.go
    ```

    然后你可以运行 Birdwatcher，如下所示：

    ```shell
    ./birdwatcher
    ```

- 下载已构建好的二进制文件：

    首先，打开 [最新发布页面](https://github.com/milvus-io/birdwatcher/releases/latest)，找到已准备好的二进制文件。

    ```shell
    wget -O birdwatcher.tar.gz \
    https://github.com/milvus-io/birdwatcher/releases/download/latest/birdwatcher_<os>_<arch>.tar.gz
    ```

    然后你可以解压缩 tarball 并使用 Birdwatcher，如下所示：

    ```shell
    tar -xvzf birdwatcher.tar.gz
    ./birdwatcher
    ```

## 在 Kubernetes 中以 Pod 形式安装

如果你已经通过 Helm charts 安装了独立版的 Milvus（参考 [使用 Helm charts 安装独立版](/getstarted/standalone/install_standalone-helm.md)）或者 Milvus Operator，或者通过 Helm charts 安装了 Milvus Cluster（参考 [使用 Helm charts 安装集群版](/getstarted/cluster/install_cluster-helm.md)）或者 Milvus Operator，你应该将 Birdwatcher 作为 Kubernetes pod 进行安装。

### 准备 deployment.yml 文件







```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: birdwatcher
spec:
  selector:
    matchLabels:
      app: birdwatcher
  template:
    metadata:
      labels:
        app: birdwatcher
    spec:
      containers:
      - name: birdwatcher
        image: milvusdb/birdwatcher
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

<div class="alert note">

如果 DockerHub 上可用的镜像不是最新的，你可以使用源代码中提供的 Dockerfile 构建 Birdwatcher 的镜像，方法如下：

```shell
git clone https://github.com/milvus-io/birdwatcher.git
cd birdwatcher
docker build -t milvusdb/birdwatcher .
```

要部署一个本地构建的镜像，你需要将上述规范中添加 `imagePullPolicy` 并将其设置为 `Never`。

```yaml
...
      - name: birdwatcher
        image: milvusdb/birdwatcher
        imagePullPolicy: Never
...
```

</div>

### 应用 deployment.yml




# 
将上述的 YAML 保存为 `deployment.yml` 文件，然后运行以下命令

```shell
kubectl apply -f deployment.yml
```

