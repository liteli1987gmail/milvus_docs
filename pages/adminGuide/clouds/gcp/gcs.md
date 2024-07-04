


# 配置通过 Workload Identity 访问 GCS
本文介绍了如何在使用 Helm 安装 Milvus 时通过 Workload Identity 配置访问 GCS。
更多细节，请参考 [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。

## 开始之前

请使用 Google Cloud CLI 或 Google Cloud 控制台在集群和节点池上启用 Workload Identity。在启用节点池上的 Workload Identity 之前，必须在集群级别启用 Workload Identity。

## 配置应用程序以使用 Workload Identity

- 创建存储桶。
```bash
gcloud storage buckets create gs://milvus-testing-nonprod --project=milvus-testing-nonprod --default-storage-class=STANDARD --location=us-west1 --uniform-bucket-level-access
```

- 为应用程序创建一个 Kubernetes 服务账号。
```bash
kubectl create serviceaccount milvus-gcs-access-sa
```

- 为应用程序创建一个 IAM 服务账号，或者使用现有的 IAM 服务账号。你可以在组织中的任何项目中使用任何 IAM 服务账号。
```bash
gcloud iam service-accounts create milvus-gcs-access-sa \
    --project=milvus-testing-nonprod
```

- 确保你的 IAM 服务账号具有所需的角色。你可以使用以下命令授予附加角色：
```bash
gcloud projects add-iam-policy-binding milvus-testing-nonprod \
    --member "serviceAccount:milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com" \
    --role "roles/storage.admin" \
    --condition='title=milvus-testing-nonprod,expression=resource.service == "storage.googleapis.com" && resource.name.startsWith("projects/_/buckets/milvus-testing-nonprod")'
```

- 允许 Kubernetes 服务账号冒充 IAM 服务账号，通过在两个服务账号之间添加 IAM 策略绑定。这个绑定允许 Kubernetes 服务账号充当 IAM 服务账号。
```bash
gcloud iam service-accounts add-iam-policy-binding milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com \
    --role "roles/iam.workloadIdentityUser" \
    --member "serviceAccount:milvus-testing-nonprod.svc.id.goog[default/milvus-gcs-access-sa]"
```

- 为 Kubernetes 服务账号添加 IAM 服务账号的电子邮件地址的注解。
```bash
kubectl annotate serviceaccount milvus-gcs-access-sa \
    --namespace default \
    iam.gke.io/gcp-service-account=milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com
```

## 验证 Workload Identity 配置

请参考 [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。在 Pod 内运行以下命令：
```bash
curl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/email
```
如果结果是 `milvus-gcs-access-sa@milvus-testing-nonprod.iam.gserviceaccount.com`，则表示配置成功。

## 部署 Milvus




helm install -f values.yaml my-release milvus/milvus

values.yaml 的内容:
```yaml
集群:
    启用: true

服务:
    类型: LoadBalancer

minio:
    启用: false

serviceAccount:
    创建: false
    名称: milvus-gcs-access-sa

externalS3:
    启用: true
    主机: storage.googleapis.com
    端口: 443
    根路径: milvus/my-release
    桶名称: milvus-testing-nonprod
    云服务提供商: gcp
    使用SSL: true
    使用IAM: true
```

