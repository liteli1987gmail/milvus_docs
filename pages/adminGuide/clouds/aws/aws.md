---

id: aws.md
title: 在EC2上部署Milvus集群
related_key: 集群
summary: 学习如何在AWS EC2上使用Terraform和Ansible部署Milvus集群。

---

# 在EC2上部署Milvus集群

本主题描述了如何使用[Terraform](https://www.terraform.io/)和[Ansible](https://www.ansible.com/overview/how-ansible-works)在[Amazon EC2](https://docs.aws.amazon.com/ec2/)上部署Milvus集群。

## 准备Milvus集群

本节描述了如何使用Terraform来准备Milvus集群。

[Terraform](https://www.terraform.io/)是一个基础设施即代码（IaC）软件工具。使用Terraform，您可以通过使用声明式配置文件来提供基础设施。

### 先决条件

- 安装并配置[Terraform](https://www.terraform.io/downloads.html)

- 安装并配置[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

### 准备配置

您可以在[Google Drive](https://drive.google.com/file/d/1jLQV0YkseOVj5X0exj17x9dWQjLCP7-1/view)下载模板配置文件。

- ```main.tf```

  此文件包含提供Milvus集群的配置。

- ```variables.tf```

  此文件允许快速编辑用于设置或更新Milvus集群的变量。

- ```output.tf``` 和 ```inventory.tmpl```

  这些文件存储Milvus集群的元数据。本主题中使用的元数据是每个节点实例的```public_ip```，每个节点实例的```private_ip```，以及所有EC2实例ID。

#### 准备variables.tf

本节描述了包含在```variables.tf```文件中的配置。

- 节点数量

  以下模板声明了一个```index_count```变量，用于设置索引节点的数量。

  <div class="alert note"> <code>index_count</code>的值必须大于或等于一。</div>

  ```variables.tf
  variable "index_count" {
    description = "运行的索引实例数量"
    type        = number
    default     = 5
  }
  ```

- 节点类型的实例类型

  以下模板声明了一个```index_ec2_type```变量，用于设置索引节点的[实例类型](https://aws.amazon.com/ec2/instance-types/)。

  ```variables.tf
  variable "index_ec2_type" {
    description = "服务器类型"
    type        = string
    default     = "c5.2xlarge"
  }
  ```

- 访问权限

  以下模板声明了一个```key_name```变量和一个```my_ip```变量。```key_name```变量代表AWS访问密钥。```my_ip```变量代表安全组的IP地址范围。

  ```variables.tf
  variable "key_name" {
    description = "用于访问实例的AWS密钥，需要已经上传"
    type        = string
    default     = ""
  }
  
  variable "my_ip" {
    description = "安全组的my_ip。用于允许ansible和terraform可以ssh进入"
    type        = string
    default     = "x.x.x.x/32"
  }
  ```

#### 准备main.tf

本节描述了包含在```main.tf```文件中的配置。

- 云提供商和区域

  以下模板使用```us-east-2```区域。有关更多信息，请参见[可用区域](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions)。

  ```main.tf
  provider "aws" {
    profile = "default"
    region  = "us-east-2"
  }
  ```

- 安全组

  以下模板声明了一个安全组，允许来自在```variables.tf```中声明的```my_ip```表示的CIDR地址范围的传入流量。

  ```main.tf
  resource "aws_security_group" "cluster_sg" {
    name        = "cluster_sg"
    description = "只允许我访问"
    vpc_id      = aws_vpc.cluster_vpc.id
  
    ingress {
      description      = "所有端口从我的IP"
      from_port        = 0
      to_port          = 65535
      protocol         = "tcp"
      cidr_blocks      = [var.my_ip]
    }
  
    ingress {
      description      = "完整的子网通信"
      from_port        = 0
      to_port          = 65535
      protocol         = "all"
      self             =