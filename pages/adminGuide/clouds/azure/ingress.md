---

id: ingress.md
title: 配置 Milvus 与 ingress nginx
related_key: ingress nginx
summary: 学习如何配置 Milvus 与 ingress nginx。
---

# 配置 Milvus 与 ingress nginx
本主题介绍如何配置 Milvus 与 ingress nginx。
更多详细信息，请参考 [ingress-nginx](https://learn.microsoft.com/en-us/azure/aks/ingress-tls?tabs=azure-cli)。

## 配置 ingress nginx

- 设置环境变量。
```bash
export DNS_LABEL="milvustest" # 您的 DNS 标签在其 Azure 位置中必须是唯一的。
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

- 为您的 ingress 控制器配置一个完全限定域名（FQDN）。
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

- 创建一个集群发行者，如 cluster-issuer.yaml，使用以下示例清单。将 MY_EMAIL_ADDRESS 替换为您组织中的有效地址。
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
参考 [Azure](https://milvus.io/docs/azure.md)，注意配置 `service.type` 的值，您需要更改为 `ClusterIP`。

## 创建 Milvus ingress 路由
```bash
kubectl apply -f ingress.yaml
``` 

ingress.yaml 的内容：
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-release-milvus
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    nginx.ingress.kubernetes.io/backend-protocol: GRPC
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: 2048m
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - milvustest.eastus2.cloudapp.azure.com # FQDN
    secretName: tls-secret
  rules:
    - host: milvustest.eastus2.cloudapp.azure.com
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

## 验证
```bash
kubectl get certificate 
NAME         READY   SECRET       AGE
tls-secret   True    tls-secret   8m7s
kubectl get ingress
NAME                CLASS   HOSTS                                   ADDRESS        PORTS     AGE
my-release-milvus   nginx   milvustest.eastus2.cloudapp.azure.com   EXTERNAL-IP   80, 443   8m15s
```

## Hello Milvus
Please refer to [Hello Milvus](https://milvus.io/docs/example_code.md), change uri args, then run the code.
```python
connections.connect("default",uri="https://milvustest.eastus2.cloudapp.azure.com:443") 
```
