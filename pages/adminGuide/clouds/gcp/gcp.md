---

id: gcp.md
title: 在 GCP 上部署 Milvus 集群
related_key: 集群
summary: 学习如何在 Google Cloud Platform (GCP) 上部署 Milvus 集群。

---

# 在 GCP 上部署 Milvus 集群

Milvus 是一个云原生的向量数据库，可以在各种云环境中部署。本指南将带您了解在 Google Cloud Platform (GCP) 上设置 Milvus 的每一个细节。

![在 GCP 上部署 Milvus 集群](../..//gcp-networking.png)

## 开始之前

在 GCP 上部署 Milvus 之前，请确保：

- 您的 GCP 账户中已经存在一个项目。

  要创建一个项目，请参阅 [创建和管理项目](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。本指南中使用的项目名为 **milvus-testing-nonprod**。

- 您已在本地安装了 [gcloud CLI](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version)、[kubectl](https://kubernetes.io/docs/tasks/tools/) 和 [Helm](https://helm.sh/docs/intro/install/)，或者决定使用基于浏览器的 [Cloud Shell](https://cloud.google.com/shell)。

- 您已使用 GCP 账户凭据 [初始化了 gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk#initializing_the)。

## 设置网络

为确保 Milvus 的安全性，您需要在 GCP 项目中创建一个逻辑上隔离的虚拟网络。以下命令创建了一个 VPC。

```bash
gcloud compute networks create milvus-network \
    --project=milvus-testing-nonprod \
    --subnet-mode=auto \
    --mtu=1460 \
    --bgp-routing-mode=regional
```

为了方便您的工作，您还需要设置几个防火墙规则，以允许通过 ICMP、RDP 和 SSH 的外部流量以及 VPC 内的流量。

```bash
gcloud compute firewall-rules create milvus-network-allow-icmp \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="允许任何源到网络上任何实例的 ICMP 连接。" \
    --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=icmp

gcloud compute firewall-rules create milvus-network-allow-internal \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="允许网络 IP 范围内的任何源到网络上任何实例的所有协议的连接。" \
    --direction=INGRESS \
    --priority=65534 \
    --source-ranges=10.128.0.0/9 \
    --action=ALLOW --rules=all

gcloud compute firewall-rules create milvus-network-allow-rdp \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="允许任何源通过端口 3389 到网络上任何实例的 RDP 连接。" \ --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=tcp:3389

gcloud compute firewall-rules create milvus-network-allow-ssh \
    --project=milvus-testing-nonprod \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --description="允许任何源通过端口 22 到网络上任何实例的 TCP 连接。" \ --direction=INGRESS \
    --priority=65534 \
    --source-ranges=0.0.0.0/0 \
    --action=ALLOW \
    --rules=tcp:22
```

最后，您需要允许稍后将创建的 Milvus 实例在端口 **19530** 上的入站流量。

```bash
gcloud compute firewall-rules create allow-milvus-in \
    --project=milvus-testing-nonprod  \
    --description="允许 Milvus 在端口 19530 上的入站流量" \
    --direction=INGRESS \
    --priority=1000 \
    --network=projects/milvus-testing-nonprod/global/networks/milvus-network \
    --action=ALLOW \
    --rules=tcp:19530 \
    --source-ranges=0.0.0.0/0
```

## 配置 Kubernetes 集群

在本指南中