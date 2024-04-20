---

id: gcs.md
title: 通过工作负载身份配置GCS访问
related_key: gcs, 存储, 工作负载身份, iam
summary: 学习如何通过工作负载身份配置gcs。

---

# 通过工作负载身份配置GCS访问
本主题介绍如何在使用helm安装Milvus时通过工作负载身份配置gcs访问。
更多详细信息，请参阅[工作负载身份](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。

## 开始之前

请使用Google Cloud CLI或Google Cloud控制台在集群和节点池上启用工作负载身份。
在您能够在节点池上启用工作负载身份之前，必须在集群级别启用工作负载身份。

## 配置应用程序使用工作负载身份

- 创建存储桶。
```bash
gcloud storage buckets create gs://milvus-testing-nonprod --project=milvus-testing-nonprod --default-storage-class=STANDARD --location=us-west1 --uniform-bucket-level-access
```

- 为您的应用程序创建一个Kubernetes服务账户。
```bash
kubectl create serviceaccount milvus-gcs-access-sa
```

- 创建一个IAM服务账户供您的应用程序使用，或者使用现有的IAM服务账户。
您可以使用组织中任何项目中的任何IAM服务账户。
```bash
gcloud iam service-accounts create milvus-gcs-access-sa \
    --project=milvus-testing-nonprod
```

- 确保您的IAM服务账户具有所需的角色。您可以使用以下命令授予额外的角色：
```bash
gcloud projects add-iam-policy-binding milvus-testing-nonprod \
    --member "serviceAccount:milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com" \
    --role "roles/storage.admin" \
    --condition='title=milvus-testing-nonprod,expression=resource.service == "storage.googleapis.com" && resource.name.startsWith("projects/_/buckets/milvus-testing-nonprod")'
```

- 允许Kubernetes服务账户模拟IAM服务账户，通过在两个服务账户之间添加IAM策略绑定。
此绑定允许Kubernetes服务账户充当IAM服务账户。
```bash
gcloud iam service-accounts add-iam-policy-binding milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com \
    --role "roles/iam.workloadIdentityUser" \
    --member "serviceAccount:milvus-testing-nonprod.svc.id.goog[default/milvus-gcs-access-sa]"
```

- 使用IAM服务账户的电子邮件地址注解Kubernetes服务账户。
```bash
kubectl annotate serviceaccount milvus-gcs-access-sa \
    --namespace default \
    iam.gke.io/gcp-service-account=milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com
```

## 验证工作负载身份设置

请参阅 [工作负载身份](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。
在Pod内运行以下命令：
```bash
curl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/email
```
如果结果是 `milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com`，则表示设置正确。

## 部署Milvus
```bash
helm install -f values.yaml my-release milvus/milvus
``` 

values.yaml的内容：
```yaml
cluster:
    enabled: true

service:
    type: LoadBalancer

minio:
    enabled: false

serviceAccount:
    create: false
    name: milvus-gcs-access-sa

externalS3:
    enabled: true
    host: storage.googleapis.com
    port: 443
    rootPath: milvus/my-release
    bucketName: milvus-testing-nonprod
    cloudProvider: gcp
    useSSL: true
    useIAM: true
```