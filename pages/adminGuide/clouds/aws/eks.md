

# 在 EKS 上部署 Milvus 集群

本主题介绍了如何在 [Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) 上部署 Milvus 集群。

## 先决条件

- 你已经在本地 PC 或 Amazon EC2 上安装了 AWS CLI，这将作为你执行本文档涵盖的操作的终端。对于 Amazon Linux 2 或 Amazon Linux 2023，AWS CLI 工具已经安装。要在本地 PC 上安装 AWS CLI，请参阅 [如何安装 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。
- 你已经在首选的端点设备上安装了 Kubernetes 和 EKS 工具，包括：
  - [`kubectl`](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
  - [`helm`](https://helm.sh/docs/intro/install/)
  - [`eksctl`](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)
- 已经正确授予了 AWS IAM 权限。你正在使用的 IAM 安全主体必须具有使用 Amazon EKS IAM 角色、与服务相关的角色、AWS CloudFormation、VPC 和其他相关资源的权限。你可以按照以下任一方式授予主体适当的权限。
  - （不推荐）只需将你用于 AWS 托管策略 `AdministratorAccess` 的用户/角色的关联策略设置为即可。
  - （强烈推荐）为了实施最小特权原则，请执行以下操作：
    - 要为 `eksctl` 设置权限，请参阅 [对于 `eksctl` 的最低权限](https://eksctl.io/usage/minimum-iam-policies/)。
    - 要为创建/删除 AWS S3 存储桶设置权限，请参阅以下权限设置：

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

    - 要为创建/删除 IAM 策略设置权限，请参阅以下权限设置。请使用你自己的 `YOUR_ACCOUNT_ID` 替换。

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

你可以使用 AWS Management Console、AWS CLI 或像 Terraform 这样的 IaC 工具设置所需的 AWS 资源，包括 AWS S3 存储桶和 EKS 集群。在本文档中，我们首选使用 AWS CLI 来演示如何设置 AWS 资源。

### 创建 Amazon S3 存储桶



# 创建一个 AWS S3 存储桶

阅读 [存储桶命名规则](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)，在命名 AWS S3 存储桶时请遵守命名规则。

```shell
milvus_bucket_name="milvus-bucket-$(openssl rand -hex 12)"

aws s3api create-bucket --bucket "$milvus_bucket_name" --region 'us-east-2' --acl private  --object-ownership ObjectWriter --create-bucket-configuration LocationConstraint='us-east-2'


# 输出
#
# "Location": "http://milvus-bucket-039dd013c0712f085d60e21f.s3.amazonaws.com/"
```

# 为上述创建的存储桶创建一个 IAM 策略，用于读取和写入存储桶中的对象。请将存储桶名称替换为你自己的。

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


# 从命令输出中获取ARN，如下所示：
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

# （可选）如果你想使用访问密钥而不是 IAM AssumeRole 来访问密钥，请将策略附加到你的 AWS 用户/角色。

```shell
aws iam attach-user-policy --user-name <your-user-name> --policy-arn "arn:aws:iam::<your-iam-account-id>:policy/MilvusS3ReadWrite"
```

### 创建 Amazon EKS 集群



1. 准备一个集群配置文件，内容如下，并将其命名为 `eks_cluster.yaml`。请用上面命令输出中列出的一个替换 `MilvusS3ReadWrite_Policy_ARN`。

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
2. 运行以下命令以创建一个 EKS 集群。

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

Milvus 使用 `etcd` 作为元数据存储，并需要依赖 `gp3` StorageClass 来创建和管理 PVC。

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



1. 添加 Helm 图表仓库。

    ```shell
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update
    ```

2. 安装 AWS 负载均衡器控制器。

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




在本指南中，我们将使用 Milvus Helm Charts 来部署 Milvus 集群。你可以在 [这里](https://github.com/zilliztech/milvus-helm/tree/master/charts/milvus) 找到这些图表。

1. 添加 Milvus Helm Chart 仓库。

    ```bash
    helm repo add milvus https://zilliztech.github.io/milvus-helm/
    helm repo update
    ```

2. 准备 Milvus 配置文件 `milvus.yaml`，并将 `<bucket-name>` 替换为上面创建的桶的名称。

    <div class="alert note">
    
    - 要配置你的 Milvus 的 HA，可以参考 [此计算器](https://milvus.io/tools/sizing/) 获取更多信息。你可以直接从计算器下载相关的配置，并且应该删除与 MinIO 相关的配置。
    - 要实现协调器的多副本部署，请将 `xxCoordinator.activeStandby.enabled` 设置为 `true`。
    - 要从互联网访问你的 Milvus，请将 `service.beta.kubernetes.io/aws-load-balancer-scheme` 从 `internal` 更改为 `internet-facing`。

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

    # 与其使用ak/sk，不如使用milvus-s3-access-sa访问milvus桶。
    # 详细信息，请参阅https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
    externalS3:
      enabled: true
      host: "s3.us-east-2.amazonaws.com"
      port: "443"
      useSSL: true
      bucketName: "<bucket-name>"
      useIAM: true
      cloudProvider: "aws"
      iamEndpoint: ""

    # HA配置
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
    


```
helm install milvus-demo milvus/milvus -n milvus -f milvus.yaml
```

4. 等待所有的pod都处于“Running”状态。

   ``` shell
   kubectl get pods -n milvus
   ```

   <div class="alert note">

   Helm不支持调度服务创建的顺序。在早期阶段，业务pod在`etcd`和`pulsar`启动之前正常重启一两次。

   </div>

5. 获取Milvus服务地址。

   ``` shell
   kubectl get svc -n milvus
   ```

## 验证安装



你可以按照以下简单指南验证安装。更多详细信息，请参考[此示例](https://milvus.io/docs/example_code.md)。

1. 下载示例代码。

    ``` shell
    wget https://raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py
    ```

2. 修改示例代码中的`host`参数为上述Milvus服务地址。

    <div class="alert note">

    如果你已在`milvus.yaml`中将`service.beta.kubernetes.io/aws-load-balancer-scheme`设置为`internal`，则应在EKS VPC内运行示例代码。

    </div>

    ``` python
    ...
    connections.connect("default", host = "milvus-service-06b515b1ce9ad10.elb.us-east-2.amazonaws.com", port = "19530")
    ...
    ```

3. 运行示例代码。

    ``` shell
    python3 hello_milvus.py
    ```

    输出应类似于以下内容:

    ``` shell
    === 开始连接到 Milvus ===

    在 Milvus 中是否存在集合 hello_milvus: False

    === 创建集合 `hello_milvus` ===


    === 开始插入实体 ===

    Milvus 中的实体数量: 3000

    === 开始创建索引 IVF_FLAT ===


    === 开始加载数据 ===


    === 开始基于向量相似性搜索 ===

    命中结果: id: 2998, 距离: 0.0, 实体: {'random': 0.9728033590489911}, 随机字段: 0.9728033590489911
    命中结果: id: 1262, 距离: 0.08883658051490784, 实体: {'random': 0.2978858685751561}, 随机字段: 0.2978858685751561
    命中结果: id: 1265, 距离: 0.09590047597885132, 实体: {'random': 0.3042039939240304}, 随机字段: 0.3042039939240304
    命中结果: id: 2999, 距离: 0.0, 实体: {'random': 0.02316334456872482}, 随机字段: 0.02316334456872482
    命中结果: id: 1580, 距离: 0.05628091096878052, 实体: {'random': 0.3855988746044062}, 随机字段: 0.3855988746044062
    命中结果: id: 2377, 距离: 0.08096685260534286, 实体: {'random': 0.8745922204004368}, 随机字段: 0.8745922204004368
    搜索延迟 = 0.4693 秒

    === 开始使用 `random > 0.5` 查询 ===

    查询结果:
    -{'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0', 'random': 0.6378742006852851}
    搜索延迟 = 0.9407 秒
    查询分页(limit = 4):
            [{'random': 0.6378742006852851, 'pk': '0'}, {'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]
    查询分页(offset = 1, limit = 3):
            [{'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]

    === 开始使用 `random > 0.5` 进行混合搜索 ===

    命中结果: id: 2998, 距离: 0.0, 实体: {'random': 0.9728033590489911}, 随机字段: 0.9728033590489911
    命中结果: id: 747, 距离: 0.14606499671936035, 实体: {'random': 0.5648774800635661}, 随机字段: 0.5648774800635661
    命中结果: id: 2527, 距离: 0.1530652642250061, 实体: {'random': 0.8928974315571507}, 随机字段: 0.8928974315571507
    命中结果: id: 2377, 距离: 0.08096685260534286, 实体: {'random': 0.8745922204004368}, 随机字段: 0.8745922204004368
    命中结果: id: 2034, 距离: 0.20354536175727844, 实体: {'random': 0.5526117606328499}, 随机字段: 0.5526117606328499
    命中结果: id: 958, 距离: 0.21908017992973328, 实体: {'random': 0.6647383716417955}, 随机字段: 0.6647383716417955
    搜索延迟 = 0.4652 秒

    === 开始使用表达式 `pk in ["0" , "1"]` 进行删除 ===

    删除前通过表达式 `pk in ["0" , "1"]` 进行查询 -> 结果:
    -{'random': 0.6378742006852851, 'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0'}
    -{'random': 0.43925103574669633, 'embeddings': [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], 'pk': '1'}

    删除后通过表达式 `pk in ["0" , "1"]` 进行查询 -> 结果: []


    === 删除集合 `hello_milvus` ===
    ```

## 清理工作



如果需要通过卸载Milvus、销毁EKS集群以及删除AWS S3存储桶和相关IAM策略来恢复环境，请按照以下步骤操作：

1. 卸载Milvus。

    ``` shell
    helm uninstall milvus-demo -n milvus
    ```

2. 销毁EKS集群。

    ``` shell
    eksctl delete cluster --name milvus-eks-cluster
    ```

3. 删除AWS S3存储桶和相关IAM策略。

    请用自己的存储桶名称和策略ARN替换命令中的示例。

    ``` shell
    aws s3api delete-bucket --bucket milvus-bucket-039dd013c0712f085d60e21f --region us-east-2

    aws iam delete-policy --policy-arn 'arn: aws: iam:: 12345678901: policy/MilvusS3ReadWrite'
    ```

## 接下来的步骤




如果你想学习如何在其他云环境上部署Milvus：
- [在EC2上部署Milvus集群](/adminGuide/clouds/aws/aws.md)
- [在Google Cloud Platform使用Kubernetes部署Milvus集群](/adminGuide/clouds/gcp/gcp.md)
- [使用Kubernetes在Microsoft Azure上部署Milvus的指南](/adminGuide/clouds/azure/azure.md)

