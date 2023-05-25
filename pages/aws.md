部署在EC2上的Milvus集群
================

本主题介绍了如何使用Terraform和Ansible在[Amazon EC2](https://docs.aws.amazon.com/ec2/)上部署Milvus集群。

配置Milvus集群
----------

本节介绍如何使用Terraform配置Milvus集群。

[Terraform](https://www.terraform.io/)是一款基础设施即代码（IaC）软件工具。使用Terraform，您可以使用声明性配置文件来配置基础设施。

### 准备条件

* 安装并配置[Terraform](https://www.terraform.io/downloads）

* 安装并配置[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2）

### 准备配置

你可以在[Google Drive](https://drive.google.com/file/d/1jLQV0YkseOVj5X0exj17x9dWQjLCP7-1/view)下载模板配置文件。

* `main.tf`

此文件包含配置用于配置Milvus集群。

* `variables.tf`

此文件允许快速编辑用于设置或更新Milvus集群的变量。

* `output.tf`和`inventory.tmpl`

这些文件存储了Milvus集群的元数据。本主题中使用的元数据是每个节点实例的`public_ip`，每个节点实例的`private_ip`以及所有EC2实例ID。

#### 准备 variables.tf

本节描述了包含配置的 `variables.tf` 文件。

* 节点数量

以下模板声明了一个名为 `index_count` 的变量，用于设置索引节点的数量。

The value of `index_count` must be greater than or equal to one.

```python
variable "index_count" {
  description = "Amount of index instances to run"
  type        = number
  default     = 5
}

```
* 节点类型的实例类型

以下模板声明了一个名为 `index_ec2_type` 的变量，用于设置索引节点的 [实例类型](https://aws.amazon.com/ec2/instance-types/)。

```python
variable "index_ec2_type" {
  description = "Which server type"
  type        = string
  default     = "c5.2xlarge"
}

```
**访问权限**

下面的模板声明了一个 `key_name` 变量和一个 `my_ip` 变量。`key_name` 变量表示AWS访问密钥。`my_ip` 变量表示安全组的IP地址范围。

```python
variable "key_name" {
  description = "Which aws key to use for access into instances, needs to be uploaded already"
  type        = string
  default     = ""
}

variable "my_ip" {
  description = "my_ip for security group. used so that ansible and terraform can ssh in"
  type        = string
  default     = "x.x.x.x/32"
}

```

#### 准备main.tf

本节描述了包含在 `main.tf` 文件中的配置。

* 云服务提供商和区域（Cloud provider and region）

以下模板使用`us-east-2`区域。有关更多信息，请参见[可用区域](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones#concepts-available-regions)。

```python
provider "aws" {
  profile = "default"
  region  = "us-east-2"
}

```
* 安全组

以下模板声明一个安全组，允许来自`variables.tf`中声明的`my_ip`所代表的CIDR地址范围的传入流量。

```python
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
* VPC

以下模板指定了一个具有10.0.0.0/24 CIDR块的Milvus集群VPC。

```python
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
* 子网（可选）

以下模板声明一个子网，其流量路由到互联网网关。在这种情况下，子网的CIDR块大小与VPC的CIDR块大小相同。

```python
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
* 节点实例（Nodes）

以下模板声明一个MinIO节点实例。 `main.tf`模板文件声明了11个节点类型的节点。

对于某些节点类型，需要设置`root_block_device`。

有关更多信息，请参见[EBS，Ephemeral和Root块设备](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#ebs-ephemeral-and-root-block-devices)。

```python
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

- 打开终端并导航到存储`main.tf`的文件夹。

- 要初始化配置，请运行`terraform init`。

- 要应用配置，请运行`terraform apply`，并在提示时输入`yes`。

您现在已经使用Terraform创建了一个Milvus集群。

启动Milvus集群
----------

本节介绍如何使用Ansible启动您已经创建的Milvus集群。

[Ansible](https://www.ansible.com/overview/how-ansible-works)是一种配置管理工具，用于自动化云端的配置和管理。

### 先决条件

* [Ansible 控制器](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation）已安装。

### 下载 Ansible Milvus 节点部署 Playbook

从 GitHub 克隆 Milvus 存储库以下载 Ansible Milvus 节点部署 Playbook。

```python
git clone https://github.com/milvus-io/milvus.git

```

### 配置安装文件

`inventory.ini`和`ansible.cfg`文件用于控制Ansible playbook中的环境变量和登录验证方法。在`inventory.ini`文件中，`dockernodes`部分定义了所有Docker引擎服务器。`ansible.cfg`部分定义了所有Milvus协调器服务器。`node`部分定义了所有Milvus节点服务器。

输入Playbook的本地路径并配置安装文件。

```python
$ cd ./milvus/deployments/docker/cluster-distributed-deployment

```

#### `inventory.ini`

配置 `inventory.ini` 文件，根据 Milvus 系统中的角色将主机分组。

添加主机名，并定义 `docker` 组和 `vars`。

```python
[dockernodes] #Add docker host names.
dockernode01
dockernode02
dockernode03

[admin] #Add Ansible controller name.
ansible-controller

[coords] #Add the host names of Milvus coordinators.
; Take note the IP of this host VM, and replace 10.170.0.17 with it.
dockernode01

[nodes] #Add the host names of Milvus nodes.
dockernode02

[dependencies] #Add the host names of Milvus dependencies.
; dependencies node will host etcd, minio, pulsar, these 3 roles are the foundation of Milvus. 
; Take note the IP of this host VM, and replace 10.170.0.19 with it.
dockernode03

[docker:children]
dockernodes
coords
nodes
dependencies

[docker:vars]
ansible_python_interpreter= /usr/bin/python3
StrictHostKeyChecking= no

; Setup variables to controll what type of network to use when creating containers.
dependencies_network= host
nodes_network= host

; Setup varibale to controll what version of Milvus image to use.
image= milvusdb/milvus-dev:master-20220412-4781db8a

; Setup static IP addresses of the docker hosts as variable for container environment variable config.
; Before running the playbook, below 4 IP addresses need to be replaced with the IP of your host VM
; on which the etcd, minio, pulsar, coordinators will be hosted.
etcd_ip= 10.170.0.19
minio_ip= 10.170.0.19
pulsar_ip= 10.170.0.19
coords_ip= 10.170.0.17

; Setup container environment which later will be used in container creation.
ETCD_ENDPOINTS= {{etcd_ip}}:2379 
MINIO_ADDRESS= {{minio_ip}}:9000
PULSAR_ADDRESS= pulsar://{{pulsar_ip}}:6650
QUERY_COORD_ADDRESS= {{coords_ip}}:19531
DATA_COORD_ADDRESS= {{coords_ip}}:13333
ROOT_COORD_ADDRESS= {{coords_ip}}:53100
INDEX_COORD_ADDRESS= {{coords_ip}}:31000

```

#### `ansible.cfg`

`ansible.cfg` 控制playbook的行为，例如SSH key等。不要在docker主机上通过SSH key设置密码。否则，Ansible SSH连接将失败。我们建议在三个主机上设置相同的用户名和SSH key，并设置新用户帐户以执行sudo而不需要密码。否则，在运行Ansible playbook时，您将收到用户名与密码不匹配或未获得提升的权限的错误信息。

```python
[defaults]
host_key_checking = False
inventory = inventory.ini # Specify the Inventory file
private_key_file=~/.my_ssh_keys/gpc_sshkey # Specify the SSH key that Ansible uses to access Docker host

```

#### `deploy-docker.yml`

`deploy-docker.yml` 定义了 Docker 的安装任务。请参阅文件中的代码注释以获取详细信息。

```python
---
- name: setup pre-requisites # Install prerequisite
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

### 测试Ansible连接性

测试连接到Ansible。

```python
$ ansible all -m ping

```

如果未在`ansible.cfg`中指定，则在命令中添加`-i`以指定清单文件的路径，否则Ansible将使用`/ etc /ansible/hosts`。

终端返回如下：

```python
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

### 检查Playbook语法

检查Playbook的语法。

```python
$ ansible-playbook deploy-docker.yml --syntax-check

```

通常，终端返回如下：

```python
playbook: deploy-docker.yml

```

### 安装Docker

使用Playbook安装Docker。

```python
$ ansible-playbook deploy-docker.yml

```

如果Docker成功安装在这三个主机上，终端将返回如下信息：

```python
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

使用SSH密钥登录三个主机，并验证主机上的安装。

* 对于根主机：

```python
$ docker -v

```

* 对于非根主机：

```python
$ sudo docker -v

```

通常，终端返回如下结果：

```python
Docker version 20.10.14, build a224086

```

检查容器的运行状态。

```python
$ docker ps

```

### 检查语法

检查 `deploy-milvus.yml` 的语法。

```python
$ ansible-playbook deploy-milvus.yml --syntax-check

```

通常情况下，终端返回如下：

```python
playbook: deploy-milvus.yml

```

### 创建 Milvus 容器

创建 Milvus 容器的任务在 `deploy-milvus.yml` 中定义。

```python
$ ansible-playbook deploy-milvus.yml

```

终端返回：

```python
PLAY [Create milvus-etcd, minio, pulsar] *****************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [dockernode03]

TASK [etcd] *******************************************************************************************************
changed: [dockernode03]

TASK [pulsar] *****************************************************************************************************
changed: [dockernode03]

TASK [minio] ******************************************************************************************************
changed: [dockernode03]

PLAY [Create milvus nodes] ****************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [dockernode02]

TASK [querynode] **************************************************************************************************
changed: [dockernode02]

TASK [datanode] ***************************************************************************************************
changed: [dockernode02]

TASK [indexnode] **************************************************************************************************
changed: [dockernode02]

PLAY [Create milvus coords] ***************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [dockernode01]

TASK [rootcoord] **************************************************************************************************
changed: [dockernode01]

TASK [datacoord] **************************************************************************************************
changed: [dockernode01]

TASK [querycoord] *************************************************************************************************
changed: [dockernode01]

TASK [indexcoord] *************************************************************************************************
changed: [dockernode01]

TASK [proxy] ******************************************************************************************************
changed: [dockernode01]

PLAY RECAP ********************************************************************************************************
dockernode01               : ok=6    changed=5    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode02               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
dockernode03               : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

现在你已经在三个主机上部署了 Milvus。

停止节点
----

当您不再需要Milvus集群时，可以停止所有节点。

 Ensure that the `terraform` binary is available on your `PATH`. 
- 运行`terraform destroy`，并在提示时输入`yes`。

- 如果成功，所有节点实例都将停止。

下一步
---

如果您想学习如何在其他云上部署Milvus:

* [在EKS上部署Milvus集群](eks.md)

* [使用Kubernetes在GCP上部署Milvus集群](gcp.md)

* [在Microsoft Azure上使用Kubernetes部署Milvus的指南](azure.md)
