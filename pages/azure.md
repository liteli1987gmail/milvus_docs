
Azure集群服务 Azure Kubernetes Service
===


本主题介绍如何使用[Azure Kubernetes Service](https://azure.microsoft.com/zh-cn/services/kubernetes-service/#overview) (AKS)和[Azure门户](https://portal.azure.com)来进行群集配置和创建。

先决条件
----

确保您的 Azure 项目已正确设置并且您拥有要使用的资源的访问权限。如果您不确定您的访问权限，请联系管理员。

### 软件要求

* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli#install)

* [kubectl](https://kubernetes.io/docs/tasks/tools/)

* [Helm](https://helm.sh/docs/intro/install/)

或者，您可以使用已预安装 Azure CLI、kubectl 和 Helm 的 [Cloud Shell](https://learn.microsoft.com/en-us/azure/cloud-shell/overview)。

安装 Azure CLI 后，请确保您已正确进行身份验证。

设置 Kubernetes 群集
----------------

1. 登录 Azure 门户。
2. 在 Azure 门户菜单或 **主页** 上，选择 **创建资源**。
3. 选择 **容器** > **Azure Kubernetes 服务**。
4. 在 **基本信息** 页上，配置以下选项：

* **项目详细信息**：

	+ **订阅**: 请联系您的组织的 Azure 管理员，确定应使用哪一个订阅。

		- **资源组**: 请联系您的组织的 Azure 管理员，确定应使用哪一个资源组。
		
* **群集详细信息**：

	+ **Kubernetes集群名称**：输入集群名称。

	+ **地区**：选择地区。

	+ **可用区**：根据需要选择[可用区](https://docs.microsoft.com/en-us/azure/aks/availability-zones#overview-of-availability-zones-for-aks-clusters)。对于生产集群，建议选择多个可用区。
* **主节点池**：

	+ **节点大小**：我们建议您选择至少具有16 GB RAM的VM，但您可以根据需要选择虚拟机大小。
	+ **缩放方法**：选择缩放方法。
	+ **节点计数范围**：选择节点数的范围。

* **节点池**：

	+ **启用虚拟节点**：选择复选框以启用虚拟节点。
	+ **启用虚拟机规模集**：我们建议选择`启用`。

* **网络**：

	+ **网络配置**：我们建议选择`Kubenet`。
	+ **DNS名称前缀**：输入DNS名称前缀。
	+ **流量路由**：

		- **负载均衡器**：`标准`。
		- **HTTP应用程序路由**：不需要。

- 配置选项后，单击**审阅 + 创建**，然后在验证完成后单击**创建**。创建集群需要几分钟时间。

使用Helm部署Milvus
--------------

集群创建完成后，使用Helm在集群上安装Milvus。

### 连接到集群

- 导航到您在Kubernetes服务中创建的群集，并单击它。

- 在左侧导航窗格中，单击`概述`。

- 在出现的**概述**页面上，单击**连接**以查看资源组和订阅。

[![Azure](https://milvus.io/static/f3392a0d3f1e4a73b30bc4b292c808f5/1263b/azure.png "The Azure overview page.")](https://milvus.io/static/f3392a0d3f1e4a73b30bc4b292c808f5/bbbf7/azure.png)

Azure 概览页面。

### 设置订阅和凭据

您可以使用 Azure Cloud Shell 执行以下过程。

- 运行以下命令设置您的订阅。

```bash
az account set --subscription EXAMPLE-SUBSCRIPTION-ID

```

- 运行以下命令下载凭据并配置Kubernetes CLI以使用它们。

```bash
az aks get-credentials --resource-group YOUR-RESOURCE-GROUP --name YOUR-CLUSTER-NAME

```

请使用同一 Shell 执行以下程序。如果您切换到另一个 Shell，请重新运行上述命令。

### 部署Milvus

- 运行以下命令添加Milvus Helm图表存储库。

```bash
helm repo add milvus https://milvus-io.github.io/milvus-helm/

```

- 运行以下命令更新您的Milvus Helm图表。

```bash
helm repo update

```

- 运行以下命令安装Milvus。

本主题使用 `my-release` 作为发布名称。替换为您的发布名称。

```bash
helm install my-release milvus/milvus --set service.type=LoadBalancer

```

启动Pod可能需要几分钟时间。运行`kubectl get services`查看服务。如果成功，将显示服务列表如下。

[![Results](https://milvus.io/static/a5898fe349ca252817a7658459dc98f4/1263b/azure_results.png "Result screenshot.")](https://milvus.io/static/a5898fe349ca252817a7658459dc98f4/bbbf7/azure_results.png)

结果截图。

`EXTERNAL-IP` 列中的 `20.81.111.155` 是负载均衡器的 IP 地址。默认的 Milvus 端口是 `19530`。

使用Azure Blob存储
--------------

Azure Blob 存储是 Azure 版本的 AWS Simple Storage Service (S3)。

[MinIO Azure 网关](https://blog.min.io/deprecation-of-the-minio-gateway/) 允许访问 Azure。实际上，MinIO Azure 网关通过使用 API 翻译和转发所有连接到 Azure。您可以使用 MinIO Azure 网关替代 MinIO 服务器。

### 设置变量

在使用MinIO Azure网关之前设置变量。根据需要修改默认值。

#### 元数据

以下表格列出了您可以配置的元数据。

以下是经过整理后的表格：

| Option | 描述 | 默认值 |
| --- | --- | --- |
| `minio.azuregateway.enabled` | 设置为 `true` 以启用 MinIO Azure Gateway。 | `false` |
| `minio.accessKey` | MinIO访问密钥。 | `""` |
| `minio.secretKey` | MinIO机密密钥。 | `""` |
| `externalAzure.bucketName` | 要使用的 Azure 存储桶的名称。与 S3 / MinIO 存储桶不同，Azure 存储桶必须全局唯一。 | `""` |

以下表格列出了您可能希望保留为默认值的选项。

| Option | 描述 | 默认值 |
| --- | --- | --- |
| `minio.azuregateway.replicas` | 用于网关的复制节点的数量。我们建议只使用一个，因为 MinIO 不支持超过一个的复制。 | `1` |

继续使用所有预定义的MinIO元数据变量。

以下示例安装名为`my-release`的图表。

```bash
helm install my-release ./milvus --set service.type=LoadBalancer --set minio.persistence.enabled=false --set externalAzure.bucketName=milvusbuckettwo --set minio.azuregateway.enabled=true --set minio.azuregateway.replicas=1 --set minio.accessKey=milvusstorage --set minio.secretKey=your-azure-key

```

下一步
---

如果您想学习如何在其他云上部署Milvus：

* [在EC2上部署Milvus集群](aws.md)

* [在EKS上部署Milvus集群](eks.md)

* [在GCP上部署Milvus集群](gcp.md)
