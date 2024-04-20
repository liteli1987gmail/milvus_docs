---

id: 使用Docker Compose安装独立Milvus集群.md
label: 独立模式（Docker Compose）
related_key: Kubernetes
order: 1
group: 使用Helm安装独立Milvus集群.md
summary: 学习如何在Kubernetes上安装Milvus集群。
title: 使用Docker Compose安装Milvus集群

---

{{tab}}

# 使用Docker Compose安装Milvus集群

本主题介绍如何使用Docker Compose安装支持GPU的Milvus集群。

## 前提条件

在安装支持GPU的Milvus之前，请确保您满足以下前提条件：

- 您的GPU设备的计算能力为7.0、7.5、8.0、8.6、8.9、9.0。要检查您的GPU设备是否满足要求，请查看NVIDIA开发者网站上的[您的GPU计算能力](https://developer.nvidia.com/cuda-gpus)。

- 您已在[支持的Linux发行版](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#linux-distributions)之一上为您的GPU设备安装了NVIDIA驱动程序，然后按照[此指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)安装了NVIDIA容器工具包。

  对于Ubuntu 22.04用户，您可以使用以下命令安装驱动程序和容器工具包：

  ```shell
  $ sudo apt install --no-install-recommends nvidia-headless-545 nvidia-utils-545
  ```

  对于其他操作系统用户，请参考[官方安装指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#installing-on-ubuntu-and-debian)。

  您可以通过运行以下命令来检查驱动程序是否已正确安装：

  ```shell
  $ modinfo nvidia | grep "^version"
  version:        535.161.07
  ```

  建议您使用版本535及以上的驱动程序。

- 您已安装了Kubernetes集群，并且`kubectl`命令行工具已配置为与您的集群通信。建议在至少有两个不作为控制平面主机的节点的集群上运行本教程。

- 您已在本地机器上安装了Docker和Docker Compose。
- 在安装Milvus之前，请检查[硬件和软件要求](prerequisite-docker.md)。

  - 对于使用MacOS 10.14或更高版本的用户，将Docker虚拟机（VM）设置为至少使用2个虚拟CPU（vCPU）和8 GB的初始内存。否则，安装可能会失败。

## 使用Docker Compose安装独立Milvus

要使用Docker Compose安装独立Milvus，请按照以下步骤操作：

### 下载并配置`YAML`文件

[下载](https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose-gpu.yml) `milvus-standalone-docker-compose-gpu.yml`并手动将其另存为`docker-compose.yml`，或使用以下命令。

  ```
  $ wget https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose-gpu.yml -O docker-compose.yml
  ```

  您需要对YAML文件中独立服务的环境变量进行一些更改，如下所示：

  - 要将特定的GPU设备分配给Milvus，请在`standalone`服务的定义中找到`deploy.resources.reservations.devices[0].devices_ids`字段，并将其值替换为所需GPU的ID。您可以使用NVIDIA GPU显示驱动程序中包含的`nvidia-smi`工具来确定GPU设备的ID。Milvus支持多个GPU设备。

  - 设置为GPU索引分配的内存池大小，其中`initialSize`表示内存池的初始大小，`maximumSize`表示其最大大小。两个值都应设置为MB单位的整数。Milvus使用这些字段为每个进程分配显示内存。

  将单个GPU设备分配给Milvus：

  ```yaml
  ...
  standalone:
    gpu:
      initMemSize: 0
      maxMemSize: 1024
    ...
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              capabilities: ["gpu"]
              device_ids: ["0"]
  ...
  ```

  将多个GPU设备分配给Milvus：

  ```yaml
  ...
  standalone:
    gpu:
      initMemSize: 0
      maxMemSize: 1024
    ...
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              capabilities: ["gpu"]
              device_ids: ['0