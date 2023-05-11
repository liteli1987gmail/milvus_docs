
本主题介绍如何使用[Azure Kubernetes Service](https://azure.microsoft.com/zh-cn/services/kubernetes-service/#overview) (AKS)和[Azure门户](https://portal.azure.com)来进行群集配置和创建。

先决条件
----

确保您的 Azure 项目已正确设置并且您拥有要使用的资源的访问权限。如果您不确定您的访问权限，请联系管理员。

### 软件要求

* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli#install)

* [kubectl](https://kubernetes.io/docs/tasks/tools/)

* [Helm](https://helm.sh/docs/intro/install/)

或者，您可以使用已预安装 Azure CLI、kubectl 和 Helm 的 [Cloud Shell](https://learn.microsoft.com/en-us/azure/cloud-shell/overview)。

After you install the Azure CLI, ensure that you are properly authenticated. 
设置 Kubernetes 群集
----------------

- 登录 Azure 门户。
2. On the Azure portal menu or from the **Home** page, select **Create a resource**.
3. Select **Containers** > **Kubernetes Service**.
4. On the **Basics** page, configure the following options:

* **Project details**:

	+ **Subscription**: Contact your organization's Azure Administrator to determine which subscription you should use.

		- **Resource group**: Contact your organization's Azure Administrator to determine which resource group you should use.
* **Cluster details**:

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

The Azure overview page.

### 设置订阅和凭据

You can use Azure Cloud Shell to perform the following procedures.
- 运行以下命令设置您的订阅。

```
az account set --subscription EXAMPLE-SUBSCRIPTION-ID

```

- 运行以下命令下载凭据并配置Kubernetes CLI以使用它们。

```
az aks get-credentials --resource-group YOUR-RESOURCE-GROUP --name YOUR-CLUSTER-NAME

```

Use the same shell for the following procedures. If you switch to another shell, run the preceding commands again.

### 部署Milvus

- 运行以下命令添加Milvus Helm图表存储库。

```
helm repo add milvus https://milvus-io.github.io/milvus-helm/

```

- 运行以下命令更新您的Milvus Helm图表。

```
helm repo update

```

- 运行以下命令安装Milvus。

This topic uses `my-release` as the release name. Replace it with your release name.

```
helm install my-release milvus/milvus --set service.type=LoadBalancer

```

启动Pod可能需要几分钟时间。运行`kubectl get services`查看服务。如果成功，将显示服务列表如下。

[![Results](https://milvus.io/static/a5898fe349ca252817a7658459dc98f4/1263b/azure_results.png "Result screenshot.")](https://milvus.io/static/a5898fe349ca252817a7658459dc98f4/bbbf7/azure_results.png)

Result screenshot.

`20.81.111.155` in the the `EXTERNAL-IP` column is the IP address of the load balancer. The default Milvus port is `19530`.

使用Azure Blob存储
--------------

Azure Blob 存储是 Azure 版本的 AWS Simple Storage Service (S3)。

[MinIO Azure 网关](https://blog.min.io/deprecation-of-the-minio-gateway/) 允许访问 Azure。实际上，MinIO Azure 网关通过使用 API 翻译和转发所有连接到 Azure。您可以使用 MinIO Azure 网关替代 MinIO 服务器。

### 设置变量

在使用MinIO Azure网关之前设置变量。根据需要修改默认值。

#### 元数据

以下表格列出了您可以配置的元数据。

| Option | Description | Default |
| --- | --- | --- |
| `minio.azuregateway.enabled` | Set the value to `true` to enable MinIO Azure Gateway. | `false` |
| `minio.accessKey` | The MinIO access key. | `""` |
| `minio.secretKey` | The MinIO secret key. | `""` |
| `externalAzure.bucketName` | The name of the Azure bucket to use. Unlike an S3/MinIO bucket, an Azure bucket must be globally unique. | `""` |

以下表格列出了您可能希望保留为默认值的元数据。

| Option | Description | Default |
| --- | --- | --- |
| `minio.azuregateway.replicas` | The number of replica nodes to use for the gateway. We recommend that you use one because MinIO does not support well for more than one replica. | `1` |

继续使用所有预定义的MinIO元数据变量。

以下示例安装名为`my-release`的图表。

```
helm install my-release ./milvus --set service.type=LoadBalancer --set minio.persistence.enabled=false --set externalAzure.bucketName=milvusbuckettwo --set minio.azuregateway.enabled=true --set minio.azuregateway.replicas=1 --set minio.accessKey=milvusstorage --set minio.secretKey=your-azure-key

```

下一步
---

如果您想学习如何在其他云上部署Milvus：

* [在EC2上部署Milvus集群](aws.md)

* [在EKS上部署Milvus集群](eks.md)

* [在GCP上部署Milvus集群](gcp.md)
