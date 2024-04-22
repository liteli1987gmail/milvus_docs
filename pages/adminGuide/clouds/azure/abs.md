---
id: abs.md
title: 通过工作负载身份配置 Blob 存储访问
related_key: blob 存储，工作负载身份，身份和访问管理 (IAM)
summary: 学习如何通过工作负载身份配置 Azure Blob 存储访问。
---

# 通过工作负载身份配置 Blob 存储访问
本主题介绍如何在通过 helm 安装 Milvus 时，通过工作负载身份配置 Azure Blob 存储访问。
更多详细信息，请参阅 [工作负载身份](https://azure.github.io/azure-workload-identity/docs/introduction.html)。

## 配置应用程序以使用工作负载身份

- 设置环境变量。
```bash
export RESOURCE_GROUP="<你的资源组>"
export AKS_CLUSTER="<你的 AKS 集群名称>" 
export SUB_ID="<你的订阅 ID>"
export USER_ASSIGNED_IDENTITY_NAME="workload-identity"
export SERVICE_ACCOUNT_NAME="milvus-abs-access-sa"
export STORAGE_ACCOUNT_NAME="milvustesting1"
export CONTAINER_NAME="testmilvus"
export LOCATION="<你的位置>"
export SERVICE_ACCOUNT_NAMESPACE="default"
```

- 使用 OIDC 发行者和工作负载身份更新 AKS 集群。
```bash
az aks update -g ${RESOURCE_GROUP} -n ${AKS_CLUSTER} --enable-oidc-issuer --enable-workload-identity
```

- 获取 OIDC 发行者 URL。
```bash
export SERVICE_ACCOUNT_ISSUER="$(az aks show --resource-group ${RESOURCE_GROUP} --name ${AKS_CLUSTER} --query 'oidcIssuerProfile.issuerUrl' -otsv)"
```

- 创建存储账户和容器。
```bash
az storage account create -n ${STORAGE_ACCOUNT_NAME} -g ${RESOURCE_GROUP} -l $LOCATION --sku Standard_LRS --min-tls-version TLS1_2
az storage container create -n ${CONTAINER_NAME} --account-name ${STORAGE_ACCOUNT_NAME}
```

- 创建用户分配的托管身份并分配角色。
```bash
az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}"
export USER_ASSIGNED_IDENTITY_CLIENT_ID="$(az identity show --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --query 'clientId' -otsv)"
export USER_ASSIGNED_IDENTITY_OBJECT_ID="$(az identity show --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --query 'principalId' -otsv)"
az role assignment create --role "Storage Blob Data Contributor" --assignee "${USER_ASSIGNED_IDENTITY_OBJECT_ID}" --scope "/subscriptions/${SUB_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/${STORAGE_ACCOUNT_NAME}"
```

- 创建服务账户。
```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    azure.workload.identity/client-id: ${USER_ASSIGNED_IDENTITY_CLIENT_ID}
  name: ${SERVICE_ACCOUNT_NAME}
EOF
```

- 在身份和服务账户发行者与主题之间建立联合身份凭证。
```bash
az identity federated-credential create \
  --name "kubernetes-federated-credential" \
  --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --issuer "${SERVICE_ACCOUNT_ISSUER}" \
  --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

## 部署 Milvus

```bash
helm install -f values.yaml my-release milvus/milvus
``` 

values.yaml 文件的内容：
```yaml
cluster:
  enabled: true

service:
  type: LoadBalancer

extraConfigFiles:
  user.yaml: |+
    common:
      storageType: remote

minio:
  enabled: false

labels:
  azure.workload.identity/use: "true"

serviceAccount:
  create: false
  name: milvus-abs-access-sa # SERVICE_ACCOUNT_NAME

externalS3:
  enabled: true
  host: core.windows.net
  port: 443
  rootPath: my-release
  bucketName: testmilvus # CONTAINER_NAME
  cloudProvider: azure
  useSSL: true
  useIAM: true
  accessKey: "milvustesting1" # STORAGE_ACCOUNT_NAME
  secretKey: ""
```
