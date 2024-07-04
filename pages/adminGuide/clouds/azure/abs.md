


# 通过工作负载身份配置 Blob 存储访问权限
本主题介绍了如何通过工作负载身份在使用 Helm 安装 Milvus 时配置 Azure Blob 存储的访问权限。更多详细信息，请参阅 [工作负载身份](https://azure.github.io/azure-workload-identity/docs/introduction.html)。

## 配置应用程序以使用工作负载身份

- 设置环境变量。
```bash
export RESOURCE_GROUP="<your resource group>"
export AKS_CLUSTER="<your aks cluster name>" 
export SUB_ID="<your Subscription ID>"
export USER_ASSIGNED_IDENTITY_NAME="workload-identity"
export SERVICE_ACCOUNT_NAME="milvus-abs-access-sa"
export STORAGE_ACCOUNT_NAME="milvustesting1"
export CONTAINER_NAME="testmilvus"
export LOCATION="<your location>"
export SERVICE_ACCOUNT_NAMESPACE="default"
```

- 使用 OIDC 发布者和工作负载身份更新 AKS 集群。
```bash
az aks update -g ${RESOURCE_GROUP} -n ${AKS_CLUSTER} --enable-oidc-issuer --enable-workload-identity
```

- 获取 OIDC 发布者 URL。
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

- 在身份和服务账户发布者和主题之间建立联合身份凭据。
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

the values.yaml contents:
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

