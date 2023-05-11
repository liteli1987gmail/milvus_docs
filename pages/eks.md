在EKS上部署Milvus集群
===============

本主题介绍如何在[Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks）上部署Milvus集群。

This topic assumes that you have a basic understanding of AWS access management. If you're not familiar with it, see [AWS身份和访问管理文档](https://docs.aws.amazon.com/iam/?id=docs_gateway).
先决条件
----

### 软件需求

* [Helm](https://helm.sh/docs/intro/install/)

* [kubectl](https://kubernetes.io/docs/tasks/tools/)

* [AWS CLI 版本 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2）

### 云安全

* EKS、EC2和S3的访问权限

* 访问密钥ID

* 安全访问密钥

部署Milvus集群
----------

- 从下面的代码块中复制代码，并将其保存为yaml格式的文件，将文件命名为milvus_cluster.yaml。

```
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: my-eks-cluster
  region: us-west-2
  version: "1.23"

nodeGroups:
  - name: ng-1-workers
    labels: { role: workers }
    instanceType: m5.4xlarge
    desiredCapacity: 2
    volumeSize: 80
    iam:
      withAddonPolicies:
        ebs: true

addons:
- name: aws-ebs-csi-driver
  version: v1.13.0-eksbuild.1 # optional

```

运行以下命令以创建一个EKS集群。本主题中的示例使用`my-eks-cluster`作为集群名称，并将“us-west-2”作为默认区域。您可以将它们替换为您自己的值。有关更多信息，请参见[开始使用Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl）。

```
eksctl create cluster -f milvus_cluster.yaml

```

如果EKS集群创建成功，您将看到以下输出。

```
...
[✓]  EKS cluster "my-cluster" in "region-code" region is ready

```

2. 在Milvus集群被配置后，使用区域和集群名称运行以下命令。

```
aws eks --region ${aws-region} update-kubeconfig --name ${cluster-name}

```
3. 创建kubeconfig文件并运行`kubectl get svc`。如果成功，输出中会出现一个集群。

```
NAME          TYPE      CLUSTER-IP    EXTERNAL-IP                                PORT(S)             AGE
kubernetes       ClusterIP   10.100.0.1    <none>                                  443/TCP             106m

```
- 添加Milvus Helm存储库。

```
helm repo add milvus https://milvus-io.github.io/milvus-helm/

```

- 运行以下命令启动已配置的Milvus集群。使用S3作为存储需要访问密钥和S3存储桶。

```
helm upgrade --install --set cluster.enabled=true --set externalS3.enabled=true --set externalS3.host='s3.us-east-2.amazonaws.com' --set externalS3.port=80 --set externalS3.accessKey=${access-key} --set externalS3.secretKey=${secret-key} --set externalS3.bucketName=${bucket-name} --set minio.enabled=False --set service.type=LoadBalancer milvus milvus/milvus

```

- 再次运行`kubectl get svc` 以检索负载均衡器的IP地址，并将其用作Milvus集群的IP地址。

 Run `kubectl get pods` to view the running pods on the cluster.
扩展Milvus集群
----------

目前，Milvus集群只能手动缩放。运行以下命令以修改具有不同类型节点实例的数量。

See [存储/计算分离](https://milvus.io/docs/v2.0.x/four_layers.md#StorageComputing-Disaggregation) for more information about the data node, index node, query node, and proxy.

```
helm upgrade --install --set cluster.enabled=true --set dataNode.replicas=1 --set indexNode.replicas=1 --set queryNode.replicas=1 --set proxy.replicas=1 --set externalS3.enabled=true --set externalS3.host='s3.us-east-2.amazonaws.com' --set externalS3.port=80 --set externalS3.accessKey=${access-key} --set externalS3.secretKey=${secret-key} --set externalS3.bucketName=${bucket-name} --set minio.enabled=False --set service.type=LoadBalancer milvus milvus/milvus

```

在运行前面的命令后，您可以运行`kubectl get pods`查看新创建的节点实例。

下一步
---

如果您想学习如何在其他云上部署Milvus：

* [在EC2上部署Milvus集群](aws.md)

* [使用Kubernetes在GCP上部署Milvus集群](gcp.md)

* [在Microsoft Azure上使用Kubernetes部署Milvus的指南](azure.md)
