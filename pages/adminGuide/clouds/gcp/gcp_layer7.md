


# 在 GCP 上为 Milvus 设置 Layer-7 负载均衡器

与第 4 层负载均衡器相比，第 7 层负载均衡器具有智能负载均衡和缓存功能，是云原生服务的理想选择。

本指南将指导你在第 4 层负载均衡器后为 Milvus 集群设置第 7 层负载均衡器。

### 开始之前

- 在你的 GCP 账户中已经存在一个项目。

  要创建一个项目，请参阅 [创建和管理项目](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。本指南中使用的项目名称为 **milvus-testing-nonprod**。

- 你已经本地安装了 [gcloud CLI](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version)，[kubectl](https://kubernetes.io/docs/tasks/tools/) 和 [Helm](https://helm.sh/docs/intro/install/)，或者决定使用基于浏览器的 [Cloud Shell](https://cloud.google.com/shell)。

- 你已经使用你的 GCP 账户凭据 [初始化了 gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk#initializing_the)。

- 你已经在 GCP 上部署了一个 Milvus 集群，并将其放置在一个第 4 层负载均衡器后面。

### 调整 Milvus 配置

本指南假设你已经在 GCP 上部署了一个 Milvus 集群，并将其放置在一个第 4 层负载均衡器后面。

在为该 Milvus 集群设置第 7 层负载均衡器之前，运行以下命令来删除第 4 层负载均衡器。

```bash
helm upgrade my-release milvus/milvus --set service.type=ClusterIP
```

作为第 7 层负载均衡器的后端服务，Milvus 必须满足 [某些加密要求](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-http2)，以便能够理解来自负载均衡器的 HTTP/2 请求。因此，你需要按照以下方式在 Milvus 集群上启用 TLS。

```bash
helm upgrade my-release milvus/milvus --set common.security.tlsMode=1
```

### 设置健康检查端点

为了确保服务的可用性，GCP 上的第 7 层负载均衡需要探测后端服务的健康状况。因此，我们需要设置一个 BackendConfig 来包装健康检查端点，并通过注释将 BackendConfig 与 Milvus 服务关联起来。

以下是 BackendConfig 的配置。将其保存为 `backendconfig.yaml` 以供稍后使用。

```yaml
apiVersion: cloud.google.com/v1
kind: BackendConfig
metadata:
  name: my-release-backendconfig
  namespace: default
spec:
  healthCheck:
    port: 9091
    requestPath: /healthz
    type: HTTP
```

然后运行以下命令来创建健康检查端点。

```bash
kubectl apply -f backendconfig.yaml
```

最后，更新 Milvus 服务的注释，要求稍后创建的第 7 层负载均衡器使用刚刚创建的端点进行健康检查。

```bash
kubectl annotate service my-release-milvus \
    cloud.google.com/app-protocols='{"milvus":"HTTP2"}' \
    cloud.google.com/backend-config='{"default": "my-release-backendconfig"}' \
    cloud.google.com/neg='{"ingress": true}'
```

<div class="alert note">

- 对于第一个注释，

  Milvus 原生支持 gRPC，而 gRPC 基于 HTTP/2。因此，我们可以使用 HTTP/2 作为第 7 层负载均衡器和 Milvus 之间的通信协议。

- 对于第二个注释，

  Milvus 只能通过 gRPC 和 HTTP/1 提供健康检查端点。我们需要设置一个 BackendConfig 来包装健康检查端点，并将其与 Milvus 服务关联起来，以便第 7 层负载均衡器探测 Milvus 的健康状况。

- 对于第三个注释，

  它要求在创建 Ingress 后创建一个网络终节点组（NEG）。使用 NEGs 与 GKE Ingress 时，Ingress 控制器会自动创建所有负载均衡器的相关配置，包括创建虚拟 IP 地址、转发规则、健康检查、防火墙规则等。详细信息请参阅 [Google Cloud 文档](https://cloud.google.com/kubernetes-engine/docs/how-to/container-native-load-balancing)。

</div>

### 准备 TLS 证书

TLS 需要证书才能工作。有两种方法可以创建证书，即自管理和 Google 管理。

本指南使用 **my-release.milvus.io** 作为访问 Milvus 服务的域名。

#### 创建自管理证书






运行以下命令创建证书。

```bash
# 生成tls.key。
openssl genrsa -out tls.key 2048

# 使用上述密钥创建证书并进行签名。
openssl req -new -key tls.key -out tls.csr \
    -subj "/CN=my-release.milvus.io"

openssl x509 -req -days 99999 -in tls.csr -signkey tls.key \
    -out tls.crt
```

然后在你的 GKE 集群中创建一个包含这些文件的密钥。

```bash
kubectl create secret tls my-release-milvus-tls --cert=./tls.crt --key=./tls.key
```

#### 创建 Google 托管证书

以下代码段是 ManagedCertificate 设置。将其保存为 `managed-crt.yaml` 以备后用。

```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: my-release-milvus-tls
spec:
  domains:
    - my-release.milvus.io
```

通过将该设置应用于你的 GKE 集群来创建托管证书，方法如下：

```bash
kubectl apply -f ./managed-crt.yaml
```

这可能需要一段时间。你可以通过运行以下命令来查看进度

```bash
kubectl get -f ./managed-crt.yaml -o yaml -w
```

输出应类似于以下内容：

```shell
status:
  certificateName: mcrt-34446a53-d639-4764-8438-346d7871a76e
  certificateStatus: Provisioning
  domainStatus:
  - domain: my-release.milvus.io
    status: Provisioning
```

一旦 **certificateStatus** 变为 **Active**，你就可以准备设置负载均衡器了。

### 创建 Ingress 以生成 Layer-7 负载均衡器
 


# 
使用以下代码片段之一创建一个 YAML 文件：

- 使用自管理证书

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: my-release-milvus
    namespace: default
  spec:
    tls:
    - hosts:
        - my-release.milvus.io
      secretName: my-release-milvus-tls
    rules:
    - host: my-release.milvus.io
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: my-release-milvus
              port:
                number: 19530
  ```
- 使用 Google 管理的证书

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: my-release-milvus
    namespace: default
    annotations:
      networking.gke.io/managed-certificates: "my-release-milvus-tls"
  spec:
    rules:
    - host: my-release.milvus.io
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: my-release-milvus
              port:
                number: 19530
  ```

然后，你可以将该文件应用于你的 GKE 集群以创建 Ingress。

```bash
kubectl apply -f ingress.yaml
```

现在，等待 Google 设置 Layer-7 负载均衡器。你可以通过运行以下命令来检查进度：

```bash
kubectl -f ./config/samples/ingress.yaml get -w
```

输出应类似于以下内容：

```shell
NAME                CLASS    HOSTS                  ADDRESS   PORTS       AGE
my-release-milvus   <none>   my-release.milvus.io             80          4s
my-release-milvus   <none>   my-release.milvus.io   34.111.144.65   80, 443   41m
```

一旦在 **ADDRESS** 字段中显示了 IP 地址，Layer-7 负载均衡器就可以使用了。上述输出中显示了端口 80 和端口 443。请记住，为了你的安全，你应该始终使用端口 443。

## 通过 Layer-7 负载均衡器验证连接



本指南使用 PyMilvus 验证与我们刚刚创建的 Layer-7 负载均衡器背后的 Milvus 服务的连接。详细步骤，请 [阅读此文](example_code)。

请注意，连接参数会根据你在 [准备 TLS 证书](#prepare-tls-certificates) 中选择的证书管理方式而有所不同。

```python
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

# 对于自行管理的证书，你需要在设置连接时使用的参数中包含证书。
connections.connect("default", host="34.111.144.65", port="443", server_pem_path="tls.crt", secure=True, server_name="my-release.milvus.io")

# 对于Google管理的证书，则无需这样做。
connections.connect("default", host="34.111.144.65", port="443", secure=True, server_name="my-release.milvus.io")
```

<div class="alert note">

- **host** 和 **port** 中的 IP 地址和端口号应与 [创建 Ingress 以生成 Layer-7 负载均衡器](#create-an-ingress-to-generate-a-layer-7-load-balancer) 末尾列出的相匹配。
- 如果你已设置 DNS 记录将域名映射到主机 IP 地址，请用域名替换 **host** 中的 IP 地址，并省略 **server_name**。

</div>