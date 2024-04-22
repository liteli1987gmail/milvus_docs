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
self             = true
    }
  
    egress {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  
    tags = {
      Name = "cluster_sg"
    }
  }
  ```



- **VPC**

  以下模板指定了一个在 Milvus 集群上的具有 10.0.0.0/24 CIDR 块的 VPC。

  ```main.tf
  resource "aws_vpc" "cluster_vpc" {
    cidr_block = "10.0.0.0/24"
    tags = {
      Name = "cluster_vpc"
    }
  }
  
  resource "aws_internet_gateway" "cluster_gateway" {
    vpc_id = aws_vpc.cluster_vpc.id
  
    tags = {
      Name = "cluster_gateway"
    }
  }
  ```

- **子网（可选）**

  以下模板声明了一个流量被路由到互联网网关的子网。在这种情况下，子网的 CIDR 块的大小与 VPC 的 CIDR 块相同。

  ```main.tf
  resource "aws_subnet" "cluster_subnet" {
    vpc_id                  = aws_vpc.cluster_vpc.id
    cidr_block              = "10.0.0.0/24"
    map_public_ip_on_launch = true
  
    tags = {
      Name = "cluster_subnet"
    }
  }
  
  resource "aws_route_table" "cluster_subnet_gateway_route" {
    vpc_id       = aws_vpc.cluster_vpc.id
  
    route {
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.cluster_gateway.id
    }
  
    tags = {
      Name = "cluster_subnet_gateway_route"
    }
  }
  
  resource "aws_route_table_association" "cluster_subnet_add_gateway" {
    subnet_id      = aws_subnet.cluster_subnet.id
    route_table_id = aws_route_table.cluster_subnet_gateway_route.id
  }
  
  ```

- **节点实例（节点）**

  以下模板声明了一个 MinIO 节点实例。`main.tf` 模板文件声明了 11 种节点类型的节点。对于某些节点类型，您需要设置 `root_block_device`。有关更多信息，请参见 [EBS、临时和根块设备](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#ebs-ephemeral-and-root-block-devices)。

  ```main.tf
  resource "aws_instance" "minio_node" {
    count         = var.minio_count
    ami           = "ami-0d8d212151031f51c"
    instance_type = var.minio_ec2_type
    key_name      = var.key_name
    subnet_id     = aws_subnet.cluster_subnet.id 
    vpc_security_group_ids = [aws_security_group.cluster_sg.id]
  
    root_block_device {
      volume_type = "gp2"
      volume_size = 1000
    }
    
    tags = {
      Name = "minio-${count.index + 1}"
    }
  }
  ```

### 应用配置

1. 打开终端，导航到存储 `main.tf` 的文件夹。

2. 为了初始化配置，运行 `terraform init`。

3. 为了应用配置，运行 `terraform apply` 并在提示时输入 `yes`。

您现在已经使用 Terraform 提供了一个 Milvus 集群。

## 启动 Milvus 集群

本节描述了如何使用 Ansible 启动您已经提供的 Milvus 集群。

[Ansible](https://www.ansible.com/overview/how-ansible-works) 是一个配置管理工具，用于自动化云配置和管理。

### 先决条件

- 安装了 [Ansible Controller](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)。

### 下载 Ansible Milvus 节点部署 Playbook

从 GitHub 克隆 Milvus 存储库以下载 Ansible Milvus 节点部署 Playbook。

```
git clone https://github.com/milvus-io/milvus.git 
```

### 配置安装文件

`inventory.ini` 和 `ansible.cfg` 文件用于控制 Ansible playbook 中的环境变量和登录验证方法。在 `inventory.ini` 文件中，`dockernodes` 部分定义了所有 Docker 引擎服务器。`ansible.cfg` 部分定义了所有 Milvus 协调器服务器。`node` 部分定义了所有 Milvus 节点服务器。

输入本地路径到 Playbook 并配置安装文件。

```shell
$ cd ./milvus/deployments/docker/cluster-distributed-deployment
```

#### `inventory.ini`

配置 `inventory.ini` 以根据它们在 Milvus 系统中的作用将主机分成不同的组。

添加主机名，并定义 `docker` 组和 `vars`。

```shell
[dockernodes] # 添加 Docker 主机名。
dockernode01
dockernode02
dockernode03

[admin] # 添加 Ansible 控制器名称。
ansible-controller

[coords] # 添加 Milvus 协调器的主机名。
; 注意这个主机 VM 的 IP，并用它替换 10.170.0.17。
dockernode01

[nodes] # 添加 Milvus 节点的主机名。
dockernode02

[dependencies] # 添加 Milvus 依赖的主机名。
; 依赖节点将托管 etcd、minio、pulsar，这 3 个角色是 Milvus 的基础。
; 注意这个主机 VM 的 IP，并用它替换 10.170.0.19。
dockernode03

[docker:children]
dockernodes
coords
nodes
dependencies

[docker:vars]
ansible_python_interpreter= /usr/bin/python3
StrictHostKeyChecking= no

; 设置变量以控制在创建容器时使用哪种类型的网络。
dependencies_network= host
nodes_network= host

; 设置变量以控制使用哪个版本的 Milvus 镜像。
image= milvusdb/milvus-dev:master-20220412-4781db8a

; 设置 Docker 主机的静态 IP 地址作为容器环境变量配置的变量。
; 在运行 Playbook 之前，下面的 4 个 IP 地址需要替换为您的主机 VM 的 IP，其中将托管 etcd、minio、pulsar、协调器。
etcd_ip= 10.170.0.19
minio_ip= 10.170.0.19
pulsar_ip= 10.170.0.19
coords_ip= 10.170.0.17

; 设置容器环境，稍后在容器创建中使用。
ETCD_ENDPOINTS= {{etcd_ip}}:2379 
MINIO_ADDRESS= {{minio_ip}}:9000
PULSAR_ADDRESS= pulsar://{{pulsar_ip}}:6650
QUERY_COORD_ADDRESS= {{coords_ip}}:19531
DATA_COORD_ADDRESS= {{coords_ip}}:13333
ROOT_COORD_ADDRESS= {{coords_ip}}:53100
INDEX_COORD_ADDRESS= {{coords_ip}}:31000
```

#### `ansible.cfg`

`ansible.cfg` 控制 playbook 的行为，例如 SSH 密钥等。不要通过 SSH 密钥在 Docker 主机上设置密码短语。否则，Ansible SSH 连接将失败。我们建议在三个主机上设置相同的用户名和 SSH 密钥，并将新用户帐户设置为无需密码即可执行 sudo。否则，在运行 Ansible playbook 时，您将收到用户名与密码不匹配或未获授权提升权限的错误。

```shell
[defaults]
host_key_checking = False
inventory = inventory.ini # 指定清单文件
private_key_file=~/.my_ssh_keys/gpc_sshkey # 指定 Ansible 用于访问 Docker 主机的 SSH 密钥
```

#### `deploy-docker.yml`

`deploy-docker.yml` 定义了在安装 Docker 期间的任务。有关详细信息，请参见文件中的代码注释。

```yaml
---
- name: setup pre-requisites # 安装先决条件
  hosts: all
  become: yes
  become_user: root
  roles:
    - install-modules
    - configure-hosts-file

- name: install docker
  become: yes
  become_user: root
  hosts: dockernodes
  roles:
    - docker-installation
```

### 测试 Ansible 连接

测试 Ansible 的连接。

```shell
$ ansible all -m ping
```

如果在 `ansible.cfg` 中没有指定清单文件的路径，可以在命令中添加 `-i` 来指定清单文件的路径，否则 Ansible 使用 `/etc/ansible/hosts`。

终端返回如下：

```shell
dockernode01 | SUCCESS => {
"changed": false,
"ping": "pong"
}
ansible-controller | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
dockernode03 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
dockernode02 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### 检查 Playbook 语法

检查 Playbook 的语法。

```shell
$ ansible-playbook deploy-docker.yml --syntax-check
```

通常情况下，终端返回如下：

```shell
playbook: deploy-docker.yml
```

### 安装 Docker

使用 Playbook 安装 Docker。

```shell
$ ansible-playbook deploy-docker.yml
```

如果 Docker 成功安装在三个主机上，终端返回如下：

```shell
TASK [docker-installation : Install Docker-CE] *******************************************************************
ok: [dockernode01]
ok: [dockernode03]
ok: [dockernode02]

TASK [docker-installation : Install python3-docker] **************************************************************
ok: [dockernode01]
ok: [dockernode02]
ok: [dockernode03]

TASK [docker-installation : Install docker-compose python3 library] **********************************************
changed: [dockernode01]
changed: [dockernode03]
changed: [dockernode02]

PLAY RECAP *******************************************************************************************************
ansible-controller         : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode01               : ok=10   changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode02               : ok=10   changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode03               : ok=10   changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### 验证安装

使用 SSH 密钥登录到三个主机，并在主机上验证安装。

- 对于 root 主机：

```shell
$ docker -v
```

- 对于非 root 主机：

```shell
$ sudo docker -v
```

通常情况下，终端返回如下：

```shell
Docker version 20.10.14, build a224086
```

检查容器的运行状态。

```shell
$ docker ps
```

### 检查语法

检查 `deploy-milvus.yml` 的语法。

```shell
$ ansible-playbook deploy-milvus.yml --syntax-check
```

通常情况下，终端返回如下：

```shell
playbook: deploy-milvus.yml
```

### 创建 Milvus 容器

`deploy-milvus.yml` 中定义了创建 Milvus 容器的任务。

```shell
$ ansible-playbook deploy-milvus.yml
```

终端返回：

```shell
PLAY [Create milvus-etcd, minio, pulsar] *****************************************************************

TASK [Gathering Facts] *********************************************************************************************
ok: [dockernode03]

TASK [etcd] *******************************************************************************************************
changed: [dockernode03]

TASK [pulsar] *****************************************************************************************************
changed: [dockernode03]

TASK [minio] ********************************************************************************************************
changed: [dockernode03]

PLAY [Create milvus nodes] ****************************************************************************************

TASK [Gathering Facts] *********************************************************************************************
ok: [dockernode02]

TASK [querynode] ****************************************************************************************************
changed: [dockernode02]

TASK [datanode] ***************************************************************************************************
changed: [dockernode02]

TASK [indexnode] ****************************************************************************************************
changed: [dockernode02]

PLAY [Create milvus coords] ***************************************************************************************

TASK [Gathering Facts] *********************************************************************************************
ok: [dockernode01]

TASK [rootcoord] ****************************************************************************************************
changed: [dockernode01]

TASK [datacoord] ****************************************************************************************************
changed: [dockernode01]

TASK [querycoord] *************************************************************************************************
changed: [dockernode01]

TASK [indexcoord] *************************************************************************************************
changed: [dockernode01]

TASK [proxy] ********************************************************************************************************
changed: [dockernode01]

PLAY RECAP *********************************************************************************************************
dockernode01               : ok=6    changed=5    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode02               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode03               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

现在您已经在三个主机上部署了 Milvus。

## 停止节点

当您不再需要 Milvus 集群时，可以停止所有节点。

<div class="alert note"> 确保 <code>terraform</code> 二进制文件在您的 <code>PATH</code> 上可用。 </div>

1. 运行 `terraform destroy` 并在提示时输入 `yes`。

2. 如果成功，所有节点实例都将停止。

## 接下来做什么

如果您想学习如何在其他云上部署 Milvus：
- [在 EKS 上部署 Milvus 集群](eks.md)
- [在 GCP 上使用 Kubernetes 部署 Milvus 集群](gcp.md)
- [使用 Kubernetes 在 Microsoft Azure 上部署 Milvus 的指南](azure.md)

