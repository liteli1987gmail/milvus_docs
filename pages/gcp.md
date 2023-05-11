在GCP上部署Milvus集群
---------------

Milvus是一个云原生向量数据库，可以部署在各种云环境中。本指南将为您详细介绍如何在Google Cloud Platform（GCP）上设置Milvus。

[![Deploy a Milvus cluster on GCP](https://milvus.io/static/8eebf7176e7812a9f13b0b31ab7d7ba0/5c9dd/gcp-networking.png "Deploy a Milvus cluster on GCP")](https://milvus.io/static/8eebf7176e7812a9f13b0b31ab7d7ba0/5c9dd/gcp-networking.png)

### 开始之前

要在GCP上部署Milvus，请确保：

* 您的GCP帐户中已经存在一个项目。

要创建项目，请参阅[创建和管理项目](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。本指南中使用的项目名称为**milvus-testing-nonprod**。

* 您已经在本地安装了[gcloud CLI](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version)，[kubectl](https://kubernetes.io/docs/tasks/tools/)和[Helm](https://helm.sh/docs/intro/install/)，或者决定使用基于浏览器的[Cloud Shell](https://cloud.google.com/shell)代替。

* 您已使用您的GCP帐户凭据[初始化了gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk#initializing_the)。

### 设置网络

为了确保Milvus的安全性，您需要在GCP项目中创建一个逻辑隔离的虚拟网络。以下命令创建了一个VPC。

```
gcloud compute networks create milvus-network \
    --project=milvus-testing-nonprod \
    --subnet-mode=auto \
    --mtu=1460 \
    --bgp-routing-mode=regional

```

为了方便您的工作，您还需要设置几个防火墙规则，允许ICMP、RDP和SSH的外部流量以及VPC内的流量。

```
gcloud compute firewall-rules create milvus-network-allow-icmp \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="Allows ICMP connections from any source to any instance on the network." \
    --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=icmp

gcloud compute firewall-rules create milvus-network-allow-internal \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="Allows connections from any source in the network IP range to any instance on the network using all protocols." \
    --direction=INGRESS \
    --priority=65534 \
    --source-ranges=10.128.0.0/9 \
    --action=ALLOW --rules=all

gcloud compute firewall-rules create milvus-network-allow-rdp \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="Allows RDP connections from any source to any instance on the network using port 3389." \ --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=tcp:3389

gcloud compute firewall-rules create milvus-network-allow-ssh \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="Allows TCP connections from any source to any instance on the network using port 22." \ --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=tcp:22

```

最后，您需要允许端口**19530**的Milvus实例的入站流量。

```
gcloud compute firewall-rules create allow-milvus-in \
    --project=milvus-testing-nonprod  \
    --description="Allow ingress traffic for Milvus on port 19530" \
    --direction=INGRESS \
    --priority=1000 \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --action=ALLOW \
    --rules=tcp:19530 \
    --source-ranges=0.0.0.0/0

```

### 创建Kubernetes集群

在本指南中，我们将使用Google Kubernetes Engine（GKE）服务在*us-west1-a*区域中提供一个包含两个节点的Kubernetes集群。每个节点都是运行**COS_CONTAINERD**镜像的**e2-standard-4** Compute Engine虚拟机。

建议您使用提供至少16 GB内存的机器类型，以确保服务的稳定性。

```
gcloud beta container clusters create "milvus-cluster-1" \
    --project "milvus-testing-nonprod" \
    --zone "us-west1-a" \
    --no-enable-basic-auth \
    --cluster-version "1.20.8-gke.900" \
    --release-channel "regular" \
    --machine-type "e2-standard-4" \
    --image-type "COS_CONTAINERD" \
    --disk-type "pd-standard" \
    --disk-size "100" \
    --max-pods-per-node "110" \
    --num-nodes "2" \
    --enable-stackdriver-kubernetes \
    --enable-ip-alias \
    --network "projects/milvus-testing-nonprod/global/networks/milvus-network" \
    --subnetwork "projects/milvus-testing-nonprod/regions/us-west1/subnetworks/milvus-network"

```

等待几分钟，Kubernetes集群就会启动。一旦集群准备就绪，请使用以下命令来获取其凭据，以便您可以在终端中运行`kubectl`命令以远程与集群通信。

```
gcloud container clusters get-credentials milvus-cluster-1

```

### 部署Milvus

现在 Kubernetes 集群已经准备好了，让我们立即部署 Milvus。

```
helm repo add milvus https://milvus-io.github.io/milvus-helm/
helm repo update
helm install my-release milvus/milvus --set service.type=LoadBalancer

```

在前面的命令中，我们将 Milvus Helm charts 的 repo 添加到本地，并更新 repo 以获取最新的 charts。然后，我们安装了一个 Milvus 实例并将其命名为 **my-release**。

请注意 `--set` 标志后面的参数，这表示我们希望通过第四层负载均衡器公开 Milvus 实例。

如果您希望通过第七层负载均衡器公开 Milvus 实例，请[阅读此文档](gcp_layer7.md)。

### 验证部署

所有的Pod都在运行后，运行以下命令以查看用于访问Milvus实例的外部IP地址和端口。

```
kubectl get services

```

结果类似于以下内容：

[![Milvus service over a Layer-4 load balancer on GCP](https://milvus.io/static/b657219adc7a1e5d1861360fc80a7a42/1263b/gcp.png "Milvus service over a Layer-4 load balancer on GCP")](https://milvus.io/static/b657219adc7a1e5d1861360fc80a7a42/bbbf7/gcp.png)

