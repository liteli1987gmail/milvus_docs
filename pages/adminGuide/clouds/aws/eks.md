---
id: eks.md
title: 在 EKS 上部署 Milvus 集群
related_key: 集群
summary: 学习如何在 EKS 上部署 Milvus 集群
---

# 在 EKS 上部署 Milvus 集群

本主题描述了如何在 [Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) 上部署 Milvus 集群。

## 前提条件

- 您已在本地 PC 或 Amazon EC2 上安装了 AWS CLI，这将作为您执行本文档中涵盖的操作的端点。对于 Amazon Linux 2 或 Amazon Linux 2023，AWS CLI 工具已预装。在您的本地 PC 上安装 AWS CLI，请参阅 [如何安装 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。
- 您已在首选端点设备上安装了 Kubernetes 和 EKS 工具，包括：
  - [`kubectl`](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
  - [`helm`](https://helm.sh/docs/intro/install/)
  - [`eksctl`](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)
- AWS IAM 权限已正确授予。您正在使用的 IAM 安全主体必须具有使用 Amazon EKS IAM 角色、服务相关角色、AWS CloudFormation、VPC 和其他相关资源的权限。您可以通过以下任一方式授予您的主体适当的权限：
  - （不推荐）简单地将您用于 AWS 管理策略 `AdministratorAccess` 的用户/角色的关联策略设置。
  - （强烈推荐）为了实施最小权限原则，如下操作：
    - 设置 `eksctl` 的权限，请参阅 [Minimum permission for `eksctl`](https://eksctl.io/usage/minimum-iam-policies/)。
    - 设置创建/删除 AWS S3 存储桶的权限，请参阅以下权限设置：

      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "S3BucketManagement",
            "Effect": "Allow",
            "Action": [
              "s3:CreateBucket",
              "s3:PutBucketAcl",
              "s3:PutBucketOwnershipControls",
              "s3:DeleteBucket"
            ],
            "Resource": [
              "arn:aws:s3:::milvus-bucket-*"
            ]
          }
        ]
      }
      ```

    - 设置创建/删除 IAM 策略的权限，请参阅以下权限设置。请将 `YOUR_ACCOUNT_ID` 替换为您自己的。

      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "IAMPolicyManagement",
            "Effect": "Allow",
            "Action": [
              "iam:CreatePolicy",
              "iam:DeletePolicy"
            ],
            "Resource": "arn:aws:iam::YOUR_ACCOUNT_ID:policy/MilvusS3ReadWrite"
          }
        ]
      }    
      ``` 

## 设置 AWS 资源

您可以使用 AWS 管理控制台、AWS CLI 或 IaC 工具（如 Terraform）设置所需的 AWS 资源，包括 AWS S3 存储桶和 EKS 集群。在本文档中，我们更倾向于使用 AWS CLI 来演示如何设置 AWS 资源。

### 创建 Amazon S3 存储桶

1. 创建一个 AWS S3 存储桶。

    阅读 [Bucket Naming Rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) 并遵守命名规则为您的 AWS S3 存储桶命名。

    ```shell
    milvus_bucket_name="milvus-bucket-$(openssl rand -hex 12)"

    aws s3api create-bucket --bucket "$milvus_bucket_name" --region 'us-east-2' --acl private  --object-ownership ObjectWriter --create-bucket-configuration LocationConstraint='us-east-2'


    # 输出
    #
    # "Location": "http://milvus-bucket-039dd013c0712f085d60e21f.s3.amazonaws.com/"
    ```

2. 为上面创建的存储桶创建一个 IAM 策略，用于读写对象。请将存储桶名称替换为您自己的。

    ```shell
    echo '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:ListBucket",
"s3:DeleteObject"
          ],
          "Resource": [
            "arn:aws:s3:::your-milvus-bucket-name",
            "arn:aws:s3:::your-milvus-bucket-name/*"
          ]
        }
      ]
    }' > milvus-s3-policy.json

    aws iam create-policy --policy-name MilvusS3ReadWrite --policy-document file://milvus-s3-policy.json


    # Get the ARN from the command output as follows:
    # {
    #     "Policy": {
    #         "PolicyName": "MilvusS3ReadWrite",
    #         "PolicyId": "AN5QQVVPM1BVTFlBNkdZT",
    #         "Arn": "arn:aws:iam::12345678901:policy/MilvusS3ReadWrite",
    #         "Path": "/",
    #         "DefaultVersionId": "v1",
    #         "AttachmentCount": 0,
    #         "PermissionsBoundaryUsageCount": 0,
    #         "IsAttachable": true,
    #         "CreateDate": "2023-11-16T06:00:01+00:00",
    #        "UpdateDate": "2023-11-16T06:00:01+00:00"
    #     }
    # }    
    ```


3. （可选）如果您想使用访问密钥而不是 IAM AssumeRole，可以将策略附加到您的 AWS 用户/角色。

      ```shell
      aws iam attach-user-policy --user-name <your-user-name> --policy-arn "arn:aws:iam::<your-iam-account-id>:policy/MilvusS3ReadWrite"
      ```

### 创建 Amazon EKS 集群

1. 准备一个如下的集群配置文件，并将其命名为 `eks_cluster.yaml`。请将 `MilvusS3ReadWrite_Policy_ARN` 替换为上述命令输出中列出的 ARN。

    ```yaml
    apiVersion: eksctl.io/v1alpha5
    kind: ClusterConfig

    metadata:
      name: 'milvus-eks-cluster'
      region: 'us-east-2'
      version: "1.27"

    iam:
      withOIDC: true

      serviceAccounts:
      - metadata:
          name: aws-load-balancer-controller
          namespace: kube-system
        wellKnownPolicies:
          awsLoadBalancerController: true
      - metadata:
          name: milvus-s3-access-sa
          namespace: milvus
          labels: {aws-usage: "milvus"}
        attachPolicyARNs:
        - "MilvusS3ReadWrite_Policy_ARN"

    managedNodeGroups:
      - name: milvus-node-group
        labels: { role: milvus }
        instanceType: m6i.4xlarge
        desiredCapacity: 3
        privateNetworking: true
        
    addons:
    - name: vpc-cni
      version: latest
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
    - name: coredns
      version: latest
    - name: kube-proxy
      version: latest
    - name: aws-ebs-csi-driver
      version: latest
      wellKnownPolicies:
        ebsCSIController: true
    ```

2. 运行以下命令以创建 EKS 集群。

    ```bash
    eksctl create cluster -f eks_cluster.yaml
    ```

3. 获取 kubeconfig 文件。

    ```bash
    aws eks update-kubeconfig --region 'us-east-2' --name 'milvus-eks-cluster'
    ```

4. 验证 EKS 集群。

    ```bash
    kubectl cluster-info

    kubectl get nodes -A -o wide
    ```

## 创建 StorageClass

Milvus 使用 `etcd` 作为元存储，并且需要依赖 `gp3` StorageClass 来创建和管理 PVC。

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-gp3-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
EOF
```

将原始的 gp2 StorageClass 设置为非默认。

```shell
kubectl patch storageclass gp2 -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

### 安装 AWS LoadBalancer Controller

1. 添加 Helm charts 仓库。

    ```shell
    helm repo add eks https://aws.github.io/eks-charts 
    helm repo update
    ```

2. 安装 AWS Load Balancer Controller。

    ```shell
    helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
      -n kube-system \
      --set clusterName='milvus-eks-cluster' \
      --set serviceAccount.create=false \
      --set serviceAccount.name=aws-load-balancer-controller 
    ```

3. 验证安装

    ```shell
    kubectl get deployment -n kube-system aws-load-balancer-controller
    ```

## 部署 Milvus

在本指南中，我们将使用 Milvus Helm Charts 部署 Milvus 集群。您可以在 [这里](https://github.com/zilliztech/milvus-helm/tree/master/charts/milvus) 找到 charts。

1. 添加 Milvus Helm Chart 仓库。

    ```bash
    helm repo add milvus https://zilliztech.github.io/milvus-helm/ 
    helm repo update
    ```

2. 准备 Milvus 配置文件 `milvus.yaml`，并用上面创建的存储桶名称替换 `<bucket-name>`。

    <div class="alert note">

    - 要为您的 Milvus 配置 HA，请参考 [此计算器](https://milvus.io/tools/sizing/) 获取更多信息。您可以直接从计算器下载相关配置，并应删除 MinIO 相关的配置。
    - 要实现协调器的多副本部署，将 `xxCoordinator.activeStandby.enabled` 设置为 `true`。
    - 要从互联网访问您的 Milvus，将 `service.beta.kubernetes.io/aws-load-balancer-scheme` 从 `internal` 更改为 `internet-facing`。

    </div>

    ```yaml
    cluster:
      enabled: true

    service:
      type: LoadBalancer
      port: 19530
      annotations: 
        service.beta.kubernetes.io/aws-load-balancer-type: external
        service.beta.kubernetes.io/aws-load-balancer-name: milvus-service
        service.beta.kubernetes.io/aws-load-balancer-scheme: internal
        service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip

    serviceAccount:
      create: false
      name: milvus-s3-access-sa

    minio:
      enabled: false

    # 使用 milvus-s3-access-sa 访问 milvus 存储桶，而不是使用 ak/sk。
    # 详细信息见 https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html 
    externalS3:
      enabled: true
      host: "s3.us-east-2.amazonaws.com"
      port: "443"
      useSSL: true
      bucketName: "<bucket-name>"
      useIAM: true
      cloudProvider: "aws"
      iamEndpoint: ""

    # HA 配置
    rootCoordinator:
      replicas: 2
      activeStandby:
        enabled: true
      resources: 
        limits:
          cpu: 1
          memory: 2Gi

    indexCoordinator:
      replicas: 2
      activeStandby:
        enabled: true
      resources: 
        limits:
          cpu: "0.5"
          memory: 0.5Gi

    queryCoordinator:
      replicas: 2
      activeStandby:
        enabled: true
      resources: 
        limits:
          cpu: "0.5"
          memory: 0.5Gi

    dataCoordinator:
      replicas: 2
      activeStandby:
        enabled: true
      resources: 
        limits:
          cpu: "0.5"
          memory: 0.5Gi

    proxy:
      replicas: 2
      resources: 
        limits:
          cpu: 1
          memory: 2Gi  
    ```

3. 安装 Milvus。

    ```shell
    helm install milvus-demo milvus/milvus -n milvus -f milvus.yaml
    ```

4. 等待所有 pod 变为 `Running` 状态。

    ```shell
    kubectl get pods -n milvus
    ```

    <div class="alert note">

    Helm 不支持调度服务创建的顺序。在早期阶段，当 `etcd` 和 `pulsar` 启动时，业务 pod 重启一两次是正常的。

    </div>

5. 获取 Milvus 服务地址。

    ```shell
    kubectl get svc -n milvus
    ```

## 验证安装

您可以按照下面的简单指南验证安装。有关更多详细信息，请参阅 [这个示例](https://milvus.io/docs/example_code.md)。

1. 下载示例代码。

    ```shell
    wget https://raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py 
    ```

2. 将示例代码中的 `host` 参数更改为上面的 Milvus 服务地址。

    <div class="alert note">

    如果您在 `milvus.yaml` 中将 `service.beta.kubernetes.io/aws-load-balancer-scheme` 设置为 `internal`，则应在 EKS VPC 内运行示例代码。

    </div>

    ```python
    ...
    connections.connect("default", host="milvus-service-06b515b1ce9ad10.elb.us-east-2.amazonaws.com", port="19530")
    ...
    ```

3. 运行示例代码。

    ```shell
    python3 hello_milvus.py
    ```

    输出应类似于以下内容：

    ```shell
    === start connecting to Milvus     ===

    Does collection hello_milvus exist in Milvus: False

    === Create collection `hello_milvus` ===


    === Start inserting entities       ===

    Number of entities in Milvus: 3000

    === Start Creating index IVF_FLAT  ===


    === Start loading                  ===


    === Start searching based on vector similarity ===

    hit: id: 2998, distance: 0.0, entity: {'random': 0.9728033590489911}, random field: 0.9728033590489911
    hit: id: 1262, distance: 0.08883658051490784, entity: {'random': 0.2978858685751561}, random field: 0.2978858685751561
    hit: id: 1265, distance: 0.09590047597885132, entity: {'random': 0.3042039939240304}, random field: 0.3042039939240304
    hit: id: 2999, distance: 0.0, entity: {'random': 0.02316334456872482}, random field: 0.02316334456872482
    hit: id: 1580, distance: 0.05628091096878052, entity: {'random': 0.3855988746044062}, random field: 0.3855988746044062
    hit: id: 2377, distance: 0.08096685260534286, entity: {'random': 0.8745922204004368}, random field: 0.8745922204004368
    search latency = 0.4693s

    === Start querying with `random > 0.5` ===

    query result:
    -{'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0', 'random': 0.6378742006852851}
    search latency = 0.9407s
    query pagination(limit=4):
            [{'random': 0.6378742006852851, 'pk': '0'}, {'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]
    query pagination(offset=1, limit=3):
            [{'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]

    === Start hybrid searching with `random > 0.5` ===

    hit: id: 2998, distance: 0.0, entity: {'random': 0.9728033590489911}, random field: 0.9728033590489911
    hit: id: 747, distance: 0.14606499671936035, entity: {'random': 0.5648774800635661}, random field: 0.5648774800635661
    hit: id: 2527, distance: 0.1530652642250061, entity: {'random': 0.8928974315571507}, random field: 0.8928974315571507
    hit: id: 2377, distance: 0.08096685260534286, entity: {'random': 0.8745922204004368}, random field: 0.8745922204004368
    hit: id: 2034, distance: 0.20354536175727844, entity: {'random': 0.5526117606328499}, random field: 0.5526117606328499
    hit: id: 958, distance: 0.21908017992973328, entity: {'random': 0.6647383716417955}, random field: 0.6647383716417955
    search latency = 0.4652s

    === Start deleting with expr `pk in ["0" , "1"]` ===

    query before delete by expr=`pk in ["0" , "1"]` -> result:
    -{'random': 0.6378742006852851, 'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0'}
    -{'random': 0.43925103574669633, 'embeddings': [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], 'pk': '1'}

    query after delete by expr=`pk in ["0" , "1"]` -> result: []

    === Drop collection `hello_milvus` ===
    ```

## 清理工作

如果需要通过卸载 Milvus、销毁 EKS 集群以及删除 AWS S3 存储桶和相关 IAM 策略来恢复环境。

1. 卸载 Milvus。

    ```shell
    helm uninstall milvus-demo -n milvus
    ```

2. 销毁 EKS 集群。

    ```shell
    eksctl delete cluster --name milvus-eks-cluster
    ```

3. 删除 AWS S3 存储桶和相关 IAM 策略。

    您应该将存储桶名称和策略 ARN 替换为您自己的。

    ```shell
    aws s3api delete-bucket --bucket milvus-bucket-039dd013c0712f085d60e21f --region us-east-2

    aws iam delete-policy --policy-arn 'arn:aws:iam::12345678901:policy/MilvusS3ReadWrite'
    ```

## 接下来做什么

如果您想学习如何在其他云上部署 Milvus：
- [在 EC2 上部署 Milvus 集群](aws.md)
- [在 GCP 上使用 Kubernetes 部署 Milvus 集群](gcp.md)
- [在 Microsoft Azure 上使用 Kubernetes 部署 Milvus 的指南](azure.md)