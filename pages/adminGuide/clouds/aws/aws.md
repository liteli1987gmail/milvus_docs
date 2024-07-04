

# 在 EC2 上部署 Milvus 集群

本主题描述了如何使用 Terraform 和 Ansible 在 [Amazon EC2](https://docs.aws.amazon.com/ec2/) 上部署 Milvus 集群。

## 部署 Milvus 集群

本节介绍如何使用 Terraform 部署 Milvus 集群。

[Terraform](https://www.terraform.io/) 是一款基础架构即代码 (IaC) 软件工具。通过 Terraform，你可以使用声明性配置文件来创建基础架构。

### 先决条件

- 安装并配置 [Terraform](https://www.terraform.io/downloads.html)

- 安装并配置 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

### 准备配置

你可以在 [Google Drive](https://drive.google.com/file/d/1jLQV0YkseOVj5X0exj17x9dWQjLCP7-1/view) 上下载模板配置文件。

- ```main.tf```

  此文件包含用于部署 Milvus 集群的配置。

- ```variables.tf```

  此文件允许快速编辑用于设置或更新 Milvus 集群的变量。

- ```output.tf`` ` 和 ` ``inventory.tmpl```

  这些文件存储 Milvus 集群的元数据。本主题中使用的元数据是每个节点实例的 ```public_ip```，每个节点实例的 ```private_ip``` 和所有 EC2 实例 ID。

#### 准备 variables.tf

本节描述了 ``` variables.tf ``` 文件的配置内容。

- 节点数量

  下面的模板声明了一个用于设置索引节点数量的变量 ``` index_count ```。

  <div class="alert note">``` index_count ``` 的值必须大于或等于1。</div>

  ``` variables.tf
  variable "index_count" {
    description = "要运行的索引实例数量"
    type        = number
    default     = 5
  }
  ```

- 节点类型的实例类型

  下面的模板声明了一个用于设置索引节点的 [实例类型](https://aws.amazon.com/ec2/instance-types/) 的变量 ``` index_ec2_type ```。

  ``` variables.tf
  variable "index_ec2_type" {
    description = "服务器类型"
    type        = string
    default     = "c5.2xlarge"
  }
  ```

- 访问权限

  下面的模板声明了一个 ``` key_name ``` 变量和一个 ```my_ip``` 变量。```key_name``` 变量表示 AWS 访问密钥，```my_ip``` 变量表示安全组的 IP 地址范围。

  ``` variables.tf
  variable "key_name" {
    description = "用于访问实例的 AWS 密钥名称，需要事先上传"
    type        = string
    default     = ""
  }
  
  variable "my_ip" {
    description = "用于安全组的 my_ip。使得 Ansible 和 Terraform 可以进行 SSH 登录"
    type        = string
    default     = "x.x.x.x/32"
  }
  ```

#### 准备 main.tf



这一部分描述了包含``` main.tf ```文件的配置。

- 云服务提供商和区域

  以下模板使用了``` us-east-2 ```区域。更多信息请参考[可用区域（Available Regions）](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions)。

  ``` main.tf
  provider "aws" {
    profile = "default"
    region  = "us-east-2"
  }
  ```

- 安全组

  以下模板声明了一个安全组，该安全组允许来自``` variables.tf ```中声明的```my_ip```所代表的CIDR地址范围的入站流量。

  ``` main.tf
  resource "aws_security_group" "cluster_sg" {
    name        = "cluster_sg"
    description = "Allows only me to access"
    vpc_id      = aws_vpc.cluster_vpc.id
  
    ingress {
      description      = "All ports from my IP"
      from_port        = 0
      to_port          = 65535
      protocol         = "tcp"
      cidr_blocks      = [var.my_ip]
    }
  
    ingress {
      description      = "Full subnet communication"
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

- 虚拟私有云（VPC）

  以下模板指定了一个具有10.0.0.0/24 CIDR块的Milvus集群的VPC。

  ``` main.tf
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

- 子网（可选）

  以下模板声明了一个子网，其流量被路由到一个互联网网关。在本例中，子网的CIDR块大小与VPC的CIDR块大小相同。

  ``` main.tf
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
 


# 
```

### 环境配置

1. 确保已安装Docker和Docker Compose。

2. 克隆Milvus GitHub存储库到本地：

``` shell
git clone https://github.com/milvus-io/milvus.git
```

3. 切换到`milvus`目录：

``` shell
cd ./milvus
```

4. 在终端中导航到`deployments/docker`目录：

``` shell
cd ./deployments/docker
```

5. 创建一个环境配置文件`env`，并根据实际需求进行配置。可以使用`env.example`文件作为模板。

``` shell
cp env.example env
```

6. 运行以下命令以开始Milvus服务：

``` shell
docker-compose up -d
```

Milvus服务将会在Docker容器中启动。你可以使用以下命令检查容器的运行状态：

``` shell
docker-compose ps
```

### 示例代码

你可以使用[Github代码示例](https://github.com/milvus-io/bootcamp/tree/master/examples/docker-compose)来运行Milvus。该示例提供了使用Docker Compose进行Milvus部署的步骤。

### 验证部署

可以使用以下命令验证Milvus是否成功部署：

``` shell
curl -X POST -H "Content-Type: application/json" -d '{"action": "connect", "parameters": {"host": "localhost", "port": 19530}}' http://localhost: 19121/milvus/system
```

如果返回以下结果，则表示Milvus已成功部署：

```
{"reply":{"code": "0", "message": "Success", "status": "OK"}}
```

现在你已成功部署了Milvus服务。

```


设置 `inventory.ini` 来根据 Milvus 系统中的角色将主机分组。

添加主机名，并定义 `docker` 组和 `vars`。

```
[dockernodes] #添加docker主机名。
dockernode01
dockernode02
dockernode03

[admin] #添加Ansible控制器名称。
ansible-controller

[coords] #添加Milvus协调器的主机名。
;请注意此主机的IP，并将10.170.0.17替换为其IP。
dockernode01

[nodes] #添加Milvus节点的主机名。
dockernode02

[dependencies] #添加Milvus依赖项的主机名。
;依赖项节点将托管etcd、minio、pulsar这三个角色，这三个角色是Milvus的基础。
;请注意此主机的IP，并将10.170.0.19替换为其IP。
dockernode03

[docker:children]
dockernodes
coords
nodes
dependencies

[docker:vars]
ansible_python_interpreter=/usr/bin/python3
StrictHostKeyChecking=no

;设置creating containers时要使用的网络类型。
dependencies_network=host
nodes_network=host

;设置要使用的Milvus镜像的版本。
image=milvusdb/milvus-dev:master-20220412-4781db8a

;将docker主机的静态IP地址设置为容器环境变量配置的变量。
;在运行playbook之前，需要将下面的4个IP地址替换为你主机的IP
;在此主机上将托管etcd、minio、pulsar、协调器。
etcd_ip=10.170.0.19
minio_ip=10.170.0.19
pulsar_ip=10.170.0.19
coords_ip=10.170.0.17

;设置容器环境，稍后将在容器创建中使用。
ETCD_ENDPOINTS={{etcd_ip}}:2379
MINIO_ADDRESS={{minio_ip}}:9000
PULSAR_ADDRESS=pulsar://{{pulsar_ip}}:6650
QUERY_COORD_ADDRESS={{coords_ip}}:19531
DATA_COORD_ADDRESS={{coords_ip}}:13333
ROOT_COORD_ADDRESS={{coords_ip}}:53100
INDEX_COORD_ADDRESS={{coords_ip}}:31000
```

#### `ansible.cfg`

`ansible.cfg` 控制 playbook 的操作，例如 SSH 密钥等。在 docker 主机上不要通过 SSH 密钥设置密码。否则，Ansible SSH 连接将失败。我们建议在三个主机上设置相同的用户名和 SSH 密钥，并设置新的用户帐户以执行无密码 sudo。否则，在运行 Ansible playbook 时，你将收到用户名与密码不匹配或未授予高权限的错误。

```
[defaults]
host_key_checking=False
inventory=inventory.ini #指定Inventory文件
private_key_file=~/.my_ssh_keys/gpc_sshkey #指定Ansible用于访问Docker主机的SSH密钥
```

#### `deploy-docker.yml`

`deploy-docker.yml` 定义了安装 Docker 期间的任务。有关详细信息，请参阅文件中的代码注释。

```yaml
---
- name: setup pre-requisites #安装先决条件
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
### 测试 Ansible 连接性


测试 Ansible 的连通性。

```shell
$ ansible all -m ping
```

如果在 `ansible.cfg` 中没有指定清单文件的路径，请在命令中添加 `-i` 来指定清单文件的路径，否则 Ansible 将使用 `/etc/ansible/hosts`。

终端返回如下：

``` 
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

通常，终端返回如下：

``` 
playbook: deploy-docker.yml
```

### 安装 Docker

使用 Playbook 安装 Docker。

```shell
$ ansible-playbook deploy-docker.yml
```

如果 Docker 在三个主机上成功安装，终端返回如下：

``` 
TASK [docker-installation : Install Docker-CE] ************************************************************************
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

使用 SSH 密钥登录三个主机，并在主机上验证安装。

- 对于 root 主机：

```shell
$ docker -v
```

- 对于非 root 主机：

```shell
$ sudo docker -v
```

通常，终端返回如下：

``` 
Docker 版本 20.10.14, 构建 a224086
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

通常，终端返回如下：

``` 
剧本: deploy-milvus.yml
```

### 创建 Milvus 容器




在 `deploy-milvus.yml` 中定义了创建 Milvus 容器的任务。

```shell
$ ansible-playbook deploy-milvus.yml
```

终端返回如下：

```
PLAY [创建 milvus-etcd, minio, pulsar] *****************************************************************

TASK [收集信息] ********************************************************************************************
ok: [dockernode03]

TASK [etcd] ************************************************************************************************
changed: [dockernode03]

TASK [pulsar] **********************************************************************************************
changed: [dockernode03]

TASK [minio] ***********************************************************************************************
changed: [dockernode03]

PLAY [创建 milvus 节点] **************************************************************************************

TASK [收集信息] ********************************************************************************************
ok: [dockernode02]

TASK [querynode] ******************************************************************************************
changed: [dockernode02]

TASK [datanode] *******************************************************************************************
changed: [dockernode02]

TASK [indexnode] ******************************************************************************************
changed: [dockernode02]

PLAY [创建 milvus coords] ***********************************************************************************

TASK [收集信息] ********************************************************************************************
ok: [dockernode01]

TASK [rootcoord] ******************************************************************************************
changed: [dockernode01]

TASK [datacoord] ******************************************************************************************
changed: [dockernode01]

TASK [querycoord] *****************************************************************************************
changed: [dockernode01]

TASK [indexcoord] *****************************************************************************************
changed: [dockernode01]

TASK [proxy] ***********************************************************************************************
changed: [dockernode01]

PLAY RECAP **************************************************************************************************
dockernode01               : ok=6    changed=5    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode02               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode03               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

现在你已经在三个主机上部署了 Milvus。

## 停止节点

在不再需要 Milvus 集群时，可以停止所有节点。

<div class="alert note"> 确保你的 <code> PATH </code> 上有 <code> terraform </code> 二进制文件。 </div>

1. 运行 ```terraform destroy```，然后在提示时输入```yes```。

2. 如果成功，所有节点实例都会停止。

## 下一步
 

如果你想学习如何在其他云平台上部署Milvus，请参考以下内容：
- [在EKS上部署Milvus集群](/adminGuide/clouds/aws/eks.md)
- [在GCP上使用Kubernetes部署Milvus集群](/adminGuide/clouds/gcp/gcp.md)
- [使用Kubernetes在Microsoft Azure上部署Milvus的指南](/adminGuide/clouds/azure/azure.md)
