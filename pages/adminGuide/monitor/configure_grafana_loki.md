


# 配置 Grafana Loki

本指南说明了如何使用 Loki 收集日志，并使用 Grafana 查询 Milvus 集群的日志。

在本指南中，你将学习如何：

- 使用 Helm 在 Milvus 集群上部署 [Loki](https://grafana.com/docs/loki/latest/get-started/overview/) 和 [Promtail](https://grafana.com/docs/loki/latest/send-data/promtail/)。
- 为 Loki 配置对象存储。
- 使用 Grafana 查询日志。

## 先决条件

- 你已经 [在 K8s 上安装了 Milvus 集群](/getstarted/cluster/install_cluster-helm.md)。
- 你已经安装了必要的工具，包括 [Helm](https://helm.sh/docs/intro/install/) 和 [Kubectl](https://kubernetes.io/docs/tasks/tools/)。

## 部署 Loki

Loki 是受 Prometheus 启发的日志聚合系统。使用 Helm 部署 Loki，从 Milvus 集群收集日志。

### 1. 添加 Grafana 的 Helm Chart 仓库

将 Grafana 的 Chart 仓库添加到 Helm，并进行更新：

```
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

### 2. 为 Loki 配置对象存储

选择以下其中一种存储选项并创建 `loki.yaml` 配置文件：

- 选项 1：使用 MinIO 进行存储

  ```yaml
  loki:
    commonConfig:
      replication_factor: 1
    auth_enabled: false

  minio:
    enabled: true
  ```

- 选项 2：使用 AWS S3 进行存储

  在下面的示例中，将 `<accessKey>` 和 `<keyId>` 替换为你自己的 S3 访问密钥和 ID，将 `s3.endpoint` 替换为 S3 端点，将 `s3.region` 替换为 S3 区域。

  ```yaml
  loki:
    commonConfig:
      replication_factor: 1
    auth_enabled: false
    storage:
      bucketNames:
        chunks: loki-chunks
        ruler: loki-ruler
        admin: loki-admin
      type: 's3'
      s3:
        endpoint: s3.us-west-2.amazonaws.com
        region: us-west-2
        secretAccessKey: <accessKey>
        accessKeyId: <keyId>
  ```

### 3. 安装 Loki

运行以下命令以安装 Loki：

```shell
kubectl create ns loki
helm install --values loki.yaml loki grafana/loki -n loki
```

## 部署 Promtail

Promtail 是 Loki 的日志收集代理。它从 Milvus Pod 中读取日志并将其发送到 Loki。

### 1. 创建 Promtail 配置

创建一个 `promtail.yaml` 配置文件：

```yaml
config:
  clients:
    - url: http://loki-gateway/loki/api/v1/push
```

### 2. 安装 Promtail
 


Deploy: 使用 Helm 安装 Promtail：

```shell
helm install --values promtail.yaml promtail grafana/promtail -n loki
```

## 使用 Grafana 查询日志

部署 Grafana 并配置连接到 Loki 以查询日志。

### 1. 部署 Grafana

使用以下命令安装 Grafana：

```shell
kubectl create ns monitoring
helm install my-grafana grafana/grafana --namespace monitoring
```

在访问 Grafana 之前，你需要获取 `admin` 密码：

```shell
kubectl get secret --namespace monitoring my-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

然后，将 Grafana 端口转发到本地机器：

```shell
export POD_NAME=$(kubectl get pods --namespace monitoring -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=my-grafana" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace monitoring port-forward $POD_NAME 3000
```

### 2. 在 Grafana 中添加 Loki 作为数据源

Grafana 运行后，你需要添加 Loki 作为数据源来查询日志。

1. 打开 Web 浏览器并导航到 `127.0.0.1:3000`。使用之前获取到的用户名 `admin` 和密码进行登录。
2. 在左侧菜单中，选择 __Connections__ > __Add new connection__。
3. 在出现的页面上，选择 __Loki__ 作为数据源类型。你可以在搜索栏中输入 __loki__ 来查找该数据源。
4. 在 Loki 数据源设置中，指定 __Name__ 和 __URL__，然后点击 __Save & test__。

![DataSource](/assets/datasource.jpg "数据源配置。")

### 3. 查询 Milvus 日志



在 Grafana 中将 Loki 添加为数据源后，查询 Milvus 日志：

1. 在左侧菜单中，点击 **Explore**。
2. 在页面左上角，选择 loki 数据源。
3. 使用 **Label browser** 选择标签并查询日志。

![查询](/assets/milvuslog.jpg "在Grafana中查询Milvus日志。")