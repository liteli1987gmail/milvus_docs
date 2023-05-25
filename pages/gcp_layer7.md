在GCP上为Milvus设置第7层负载均衡器
----------------------

与第4层负载均衡器相比，第7层负载均衡器提供智能负载均衡和缓存功能，是云原生服务的理想选择。

本指南将带您完成在第4层负载均衡器后面运行的Milvus集群的第7层负载均衡器的设置。

### 开始之前

* 您的GCP账户中已经存在一个项目。

要创建项目，请参考[创建和管理项目](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。本指南中使用的项目名称为**milvus-testing-nonprod**。

* 您已经在本地安装了[gcloud CLI](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version)、[kubectl](https://kubernetes.io/docs/tasks/tools/)和[Helm](https://helm.sh/docs/intro/install/)，或决定使用基于浏览器的[Cloud Shell](https://cloud.google.com/shell)。

* 您已使用您的GCP账号凭据[初始化了gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk#initializing_the)。

* 您已在GCP上[部署了一个Milvus集群，在Layer-4负载均衡器后面](gcp.md)。

### 调整Milvus配置

本指南假设您已经在GCP上部署了Milvus集群，并且在Layer-4负载均衡器后面进行了部署。

在为此Milvus集群设置Layer-7负载均衡器之前，请运行以下命令以删除Layer-4负载均衡器。

```python
helm upgrade my-release milvus/milvus --set service.type=ClusterIP

```

作为Layer-7负载均衡器的后端服务，Milvus必须满足[特定的加密要求](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-http2)，以便它能理解来自负载均衡器的HTTP/2请求。因此，您需要按照以下方式在Milvus集群上启用TLS。

```python
helm upgrade my-release milvus/milvus --set common.security.tlsMode=1

```

### 设置健康检查端点

为确保服务可用性，GCP上的第7层负载平衡需要探测后端服务的健康状况。因此，我们需要设置一个BackendConfig来包装健康检查端点，并通过注释将BackendConfig与Milvus服务关联。

以下代码段是BackendConfig设置。将其保存为`backendconfig.yaml`以备后用。

```python
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

然后运行以下命令创建健康检查端点。

```python
kubectl apply -f backendconfig.yaml

```

最后，更新Milvus服务的注释，要求稍后创建的Layer-7负载均衡器使用刚刚创建的端点执行健康检查。

```python
kubectl annotate service my-release-milvus 
    cloud.google.com/app-protocols='{"milvus":"HTTP2"}' 
    cloud.google.com/backend-config='{"default": "my-release-backendconfig"}' 
    cloud.google.com/neg='{"ingress": true}'

```

* 至于第一个注释，

Milvus是gRPC原生的，而gRPC是建立在HTTP/2之上的。因此，我们可以使用HTTP/2作为Layer-7负载均衡器和Milvus之间的通信协议。

* 至于第二个注释，

Milvus只在gRPC和HTTP/1上提供健康检查端点。我们需要设置一个BackendConfig来包装健康检查端点，并将其与Milvus服务关联起来，以便Layer-7负载均衡器探查Milvus的健康状况。

* 至于第三个注释，

它要求在创建Ingress后创建网络端点组（NEG）。当NEGs与GKE Ingress一起使用时，Ingress控制器会促进负载均衡器的所有方面的创建。这包括创建虚拟IP地址、转发规则、健康检查、防火墙规则等。有关详细信息，请参见[Google Cloud文档](https://cloud.google.com/kubernetes-engine/docs/how-to/container-native-load-balancing)。

### 准备 TLS 证书

TLS需要证书才能工作。有两种创建证书的方法，即自管理和Google管理。

本指南使用**my-release.milvus.io**作为访问我们的Milvus服务的域名。

#### 创建自管理证书

运行以下命令创建证书。

```python
# Generates a tls.key.
openssl genrsa -out tls.key 2048

# Creates a certificate and signs it with the preceding key.
openssl req -new -key tls.key -out tls.csr 
    -subj "/CN=my-release.milvus.io"

openssl x509 -req -days 99999 -in tls.csr -signkey tls.key 
    -out tls.crt

```

然后在您的GKE集群中使用这些文件创建一个secret供以后使用。

```python
kubectl create secret tls my-release-milvus-tls --cert=./tls.crt --key=./tls.key

```

#### 创建Google管理的证书

以下代码片段是ManagedCertificate设置。请将其另存为`managed-crt.yaml`以备后用。

```python
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: my-release-milvus-tls
spec:
  domains:
    - my-release.milvus.io

```

按照以下步骤将该设置应用于您的GKE集群以创建托管证书：

```python
kubectl apply -f ./managed-crt.yaml

```

这可能需要一段时间。您可以通过运行以下命令来检查进度：

```python
kubectl get -f ./managed-crt.yaml -o yaml -w

```

输出结果应类似于以下内容：

```python
status:
  certificateName: mcrt-34446a53-d639-4764-8438-346d7871a76e
  certificateStatus: Provisioning
  domainStatus:
  - domain: my-release.milvus.io
    status: Provisioning

```

一旦**certificateStatus**变为**Active**，您就可以准备设置负载均衡器了。

### 创建Ingress以生成第7层负载均衡器

创建一个包含以下代码片段之一的YAML文件。

* 使用自管理证书

```python
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
* 使用Google管理证书

```python
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

然后，您可以通过将文件应用到您的GKE集群来创建Ingress。

```python
kubectl apply -f ingress.yaml

```

现在，等待Google设置第7层负载均衡器。您可以通过运行以下命令来检查进度

```python
kubectl  -f ./config/samples/ingress.yaml get -w

```

输出应类似于以下内容：

```python
NAME                CLASS    HOSTS                  ADDRESS   PORTS   AGE
my-release-milvus   <none>   my-release.milvus.io             80      4s
my-release-milvus   <none>   my-release.milvus.io   34.111.144.65   80, 443   41m

```

一旦IP地址在**地址**字段中显示，Layer-7负载均衡器就可以使用了。以上输出显示了端口80和端口443。请记住，为了您自己的安全，应始终使用端口443。

通过Layer-7负载均衡器验证连接
------------------

此指南使用 PyMilvus 验证我们刚刚创建的 Layer-7 负载均衡器后面的 Milvus 服务的连接。详细步骤请[查看此处](example_code)。

请注意，在[准备 TLS 证书](#prepare-tls-certificates)的方式不同的情况下，连接参数也会有所不同。

```python
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

# For self-managed certificates, you need to include the certificate in the parameters used to set up the connection.
connections.connect("default", host="34.111.144.65", port="443", server_pem_path="tls.crt", secure=True, server_name="my-release.milvus.io")

# For Google-managed certificates, there is not need to do so.
connections.connect("default", host="34.111.144.65", port="443", secure=True, server_name="my-release.milvus.io")

```

* 在**host**和**port**中的 IP 地址和端口号应与[创建 Ingress 以生成 Layer-7 负载均衡器](#create-an-ingress-to-generate-a-layer-7-load-balancer)末尾列出的相符。

* 如果您已经设置了 DNS 记录来将域名映射到主机 IP 地址，请在**host**中用域名替换 IP 地址，并省略**server_name**。

