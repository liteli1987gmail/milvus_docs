


# 使用 ingress nginx 配置 Milvus

本主题介绍如何使用 ingress nginx 配置 Milvus。
有关详细信息，请参阅 [ingress-nginx](https://learn.microsoft.com/en-us/azure/aks/ingress-tls?tabs=azure-cli)。

## 配置 ingress nginx

- 设置环境变量。
```bash
export DNS_LABEL="milvustest" # Your DNS label must be unique within its Azure location.
export NAMESPACE="ingress-basic"
```

- 安装 ingress nginx
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
    --create-namespace \
    --namespace $NAMESPACE \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$DNS_LABEL \  
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
```

- 获取外部 IP 地址。
```bash
kubectl --namespace $NAMESPACE get services -o wide -w ingress-nginx-controller
```

- 为 ingress 控制器配置 FQDN。
```bash
# ingress 控制器的公共 IP 地址
IP="MY_EXTERNAL_IP"

# 获取公共 IP 的资源 ID
PUBLICIPID=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[id]" --output tsv)

# 使用 DNS 名称更新公共 IP 地址
az network public-ip update --ids $PUBLICIPID --dns-name $DNS_LABEL

# 显示 FQDN
az network public-ip show --ids $PUBLICIPID --query "[dnsSettings.fqdn]" --output tsv
# 示例输出：milvustest.eastus2.cloudapp.azure.com
```

## 安装 cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
    --namespace $NAMESPACE \
    --set installCRDs=true
```

## 创建 CA 集群发行者

- 使用以下示例清单创建集群发行者（例如 cluster-issuer.yaml）。将 MY_EMAIL_ADDRESS 替换为有效地址（来自你的组织）。
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: MY_EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt
    solvers:
    - http01:
        ingress:
          class: nginx
```

- 使用 kubectl apply 命令应用发行者。
```bash
kubectl apply -f cluster-issuer.yaml
```

## 部署 Milvus
参考 [Azure](/adminGuide/clouds/azure/azure.md)，请注意将配置 `service.type` 的值更改为 `ClusterIP`。

## 创建 Milvus ingress 路由




## Verify
```bash
kubectl获取证书
名称           已准备   密钥       年龄
tls-secret   True    tls-secret   8m7s
kubectl获取入口
名称                类   主机                               地址        端口     年龄
my-release-milvus   nginx   milvustest.eastus2.cloudapp.azure.com    EXTERNAL-IP   80, 443   8m15s
```

## Hello Milvus





                请参考 [Hello Milvus（你好 Milvus）](https://milvus.io/docs/example_code.md)，修改 URI 参数，然后运行代码。
```python
connections.connect("default", uri="https://milvustest.eastus2.cloudapp.azure.com:443") 
```
