---

id: gcp_layer7.md
title: 在GCP上为Milvus设置第7层负载均衡器
related_key: 集群
summary: 学习如何在GCP上为Milvus集群部署第7层负载均衡器。

---

## 在GCP上为Milvus设置第7层负载均衡器

与第4层负载均衡器相比，第7层负载均衡器提供了智能负载均衡和缓存能力，是云原生服务的绝佳选择。

本指南将指导您为已经在GCP上的第4层负载均衡器后运行的Milvus集群设置第7层负载均衡器。

### 开始之前

- 您的GCP账户中已经存在一个项目。

  要创建项目，请参考[创建和管理项目](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。本指南中使用的项目名为**milvus-testing-nonprod**。

- 您已在本地安装了[gcloud CLI](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version)、[kubectl](https://kubernetes.io/docs/tasks/tools/)和[Helm](https://helm.sh/docs/intro/install/)，或者决定使用基于浏览器的[Cloud Shell](https://cloud.google.com/shell)。

- 您已使用GCP账户凭证[初始化了gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk#initializing_the)。

- 您已在GCP上[部署了一个第4层负载均衡器后的Milvus集群](gcp.md)。

### 调整Milvus配置

本指南假设您已经[在GCP上为Milvus集群部署了一个第4层负载均衡器](gcp.md)。

在为这个Milvus集群设置第7层负载均衡器之前，运行以下命令以移除第4层负载均衡器。

```bash
helm upgrade my-release milvus/milvus --set service.type=ClusterIP
```

作为第7层负载均衡器的后端服务，Milvus必须满足[某些加密要求](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-http2)，以便它能够理解负载均衡器的HTTP/2请求。因此，您需要按照以下方式在您的Milvus集群上启用TLS。

```bash
helm upgrade my-release milvus/milvus --set common.security.tlsMode=1
```

### 设置健康检查端点

为确保服务可用性，GCP上的第7层负载均衡需要探测后端服务的健康状况。因此，我们需要设置一个BackendConfig来包装健康检查端点，并通过注释将BackendConfig与Milvus服务关联。

以下是一个BackendConfig设置的片段。将其保存为`backendconfig.yaml`以备后用。

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

然后运行以下命令以创建健康检查端点。

```bash
kubectl apply -f backendconfig.yaml
```

最后，更新Milvus服务的注释，以请求我们稍后将创建的第7层负载均衡器使用刚刚创建的端点进行健康检查。

```bash
kubectl annotate service my-release-milvus \
    cloud.google.com/app-protocols='{"milvus":"HTTP2"}' \
    cloud.google.com/backend-config='{"default": "my-release-backendconfig"}' \
    cloud.google.com/neg='{"ingress": true}'
```

<div class="alert note">

- 对于第一个注释，
  
  Milvus原生支持gRPC，它是建立在HTTP/2之上的。因此，我们可以使用HTTP/2作为第7层负载均衡器和Milvus之间的通信协议。

- 对于第二个注释，

  Milvus仅通过gRPC和HTTP/1提供健康检查端点。我们需要设置一个BackendConfig来包装健康检查端点，并将其与Milvus服务关联，以便第7层负载均衡器探测此端点以了解Milvus的健康状况。

- 对于第三个注释，

  它请求在创建Ingress后创建一个网络端点组（NEG）。当NEG与GKE Ingress一起使用时，Ingress控制器将促进负载均衡器的所有方面的创建。这包括创建虚拟IP地址、转发规则、健康检查、防火墙规则等。有关详细信息，请参考[Google Cloud文档](https://cloud.google.com/kubernetes-engine/docs/how-to/container-native-load-balancing)。

</div>

### 准备 TLS 证书

TLS 需要证书才能工作。有两种创建证书的方法，即自管理的和 Google 管理的。

本指南使用 **my-release.milvus.io** 作为域名来访问我们的 Milvus 服务。

#### 创建自管理证书

运行以下命令来创建一个证书。

```bash
# 生成 tls.key。
openssl genrsa -out tls.key 2048

# 创建一个证书并用前面的密钥签名。
openssl req -new -key tls.key -out tls.csr \
    -subj "/CN=my-release.milvus.io"

openssl x509 -req -days 99999 -in tls.csr -signkey tls.key \
    -out tls.crt
```

然后在您的 GKE 集群中使用这些文件创建一个密钥，以便稍后使用。

```bash
kubectl create secret tls my-release-milvus-tls --cert=./tls.crt --key=./tls.key
```

#### 创建 Google 管理的证书

以下是一个 ManagedCertificate 设置的片段。将其保存为 `managed-crt.yaml` 以供稍后使用。

```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: my-release-milvus-tls
spec:
  domains:
    - my-release.milvus.io
```

通过将设置应用到您的 GKE 集群，如下创建一个管理证书：

```bash
kubectl apply -f ./managed-crt.yaml
```

这可能需要一段时间。您可以通过运行以下命令来检查进度：

```bash
kubectl get -f ./managed-crt.yaml -o yaml -w
```

输出应该类似于以下内容：

```shell
status:
  certificateName: mcrt-34446a53-d639-4764-8438-346d7871a76e
  certificateStatus: Provisioning
  domainStatus:
  - domain: my-release.milvus.io
    status: Provisioning
```

一旦 **certificateStatus** 变为 **Active**，您就准备好设置负载均衡器了。

### 创建一个入口来生成第 7 层负载均衡器

使用以下代码段之一创建一个 YAML 文件。

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

然后，您可以通过将文件应用到您的 GKE 集群来创建入口。

```bash
kubectl apply -f ingress.yaml
```

现在，等待 Google 设置第 7 层负载均衡器。您可以通过运行以下命令来检查进度：

```bash
kubectl  -f ./config/samples/ingress.yaml get -w
```

输出应该类似于以下内容：

```shell
NAME                CLASS    HOSTS                  ADDRESS   PORTS   AGE
my-release-milvus   <none>   my-release.milvus.io             80      4s
my-release-milvus   <none>   my-release.milvus.io   34.111.144.65   80, 443   41m
```

一旦在 **ADDRESS** 字段中显示了 IP 地址，第 7 层负载均衡器就准备好使用了。上述输出中显示了端口 80 和端口 443。请记住，出于您自己的考虑，您应该始终使用端口 443。

## 通过第 7 层负载均衡器验证连接

本指南使用 PyMilvus 来验证我们刚刚创建的第 7 层负载均衡器后面的 Milvus 服务的连接。有关详细步骤，[请阅读此文](example_code)。

请注意，连接参数会根据您选择的在 [准备 TLS 证书](#prepare-tls-certificates) 中管理证书的方式而变化。

```python
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

# 对于自管理证书，您需要在用于设置连接的参数中包含证书。
connections.connect("default", host="34.111.144.65", port="443", server_pem_path="tls.crt", secure=True, server_name="my-release.milvus.io")

# 对于 Google 管理的证书，无需这样做。
connections.connect("default", host="34.111.144.65", port="443", secure=True, server_name="my-release.milvus.io")
```

<div class="alert note">

- **host** 和 **port** 中的 IP 地址和端口号应与 [创建一个入口来生成第 7 层负载均衡器](#create-an-ingress-to-generate-a-layer-7-load-balancer) 最后列出的相匹配。
- 如果您已经设置了 DNS 记录将域名映射到主机 IP 地址，请将 **host** 中的 IP 地址替换为域名，并省略 **server_name**。

</div>