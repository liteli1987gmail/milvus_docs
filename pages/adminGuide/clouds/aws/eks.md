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
            "s3:Delete