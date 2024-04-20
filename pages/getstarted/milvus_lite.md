---
title: 开始使用 Milvus Lite
---

# 开始使用 Milvus Lite

本指南介绍了如何安装、配置和使用 [Milvus Lite](https://github.com/milvus-io/milvus-lite)。

<div class="alert caution">

不要在任何生产环境或需要高性能的情况下使用 Milvus Lite。对于生产目的，考虑使用 Milvus 集群或在 Zilliz Cloud 上全面管理的 Milvus。

</div>

## 概述

Milvus Lite 是 Milvus 的轻量级版本，可以与 Google Colab 和 Jupyter Notebook 无缝协作。

由于 Milvus 独立部署能够运行嵌入式 etcd 和本地存储，Milvus Lite 附带了一个单一的二进制文件，无需其他依赖项，您可以轻松地在您的机器上安装和运行，或嵌入到您的任何 Python 应用程序中。

您使用 Milvus Lite 所做的任何事情，以及为 Milvus Lite 编写的任何代码都可以安全地迁移到以其他方式安装的 Milvus 实例。

它还带有一个基于 CLI 的 Milvus 独立服务器，可以在您的机器上运行。将其嵌入到您的 Python 代码中或将其作为独立服务器使用，取决于您的选择。

## 应用场景

Milvus Lite 适用于以下场景：

- 您想直接使用 Milvus，而无需使用 [Milvus Operator](https://milvus.io/docs/install_standalone-operator.md)、[Helm](https://milvus.io/docs/install_standalone-helm.md) 或 [Docker Compose](https://milvus.io/docs/install_standalone-docker.md) 等进行安装。
- 您在使用 Milvus 时不想启动任何虚拟机或容器。
- 您想在 Python 应用程序中嵌入 Milvus 功能。

## 先决条件

- Python 3.7 或更高版本
- 已验证的操作系统如下：

  - Ubuntu >= 20.04 (x86_64)
  - CentOS >= 7.0 (x86_64)
  - MacOS >= 11.0 (Apple Silicon)

<div class="alert note">  

- 对于 Linux 用户，Milvus Lite 使用 **manylinux2014** 作为基础镜像。它应该能够在大多数 Linux 发行版上运行。
- Milvus Lite 也可以在 Windows 上运行。但这一点尚未得到严格验证。

</div>

## 安装 Milvus Lite

Milvus Lite 可在 PyPI 上获取，您可以通过 `pip` 安装。

```shell
$ python3 -m pip install milvus
```

或者，按照以下方式安装 PyMilvus：

```shell
$ python3 -m pip install milvus[client]
```

## 开始使用

您可以从我们项目存储库的 [example](https://github.com/milvus-io/milvus-lite/tree/main/examples) 文件夹下载示例笔记本来开始使用。

## 使用 Milvus Lite

您可以将 Milvus Lite 作为 Python 库导入，或将其作为基于 CLI 的 Milvus 独立服务器在您的机器上运行。

### 启动 Milvus Lite

- 作为 Python 模块启动 Milvus Lite，请按照以下步骤操作：

  ```python
  from milvus import default_server
  from pymilvus import connections, utility

  # (可选) 如果您想将所有相关数据存储在特定位置
  # 默认位置：
  #   windows 上的 %APPDATA%/milvus-io/milvus-server
  #   linux 上的 ~/.milvus-io/milvus-server
  # default_server.set_base_dir('milvus_data')

  # (可选) 如果您想清理之前的数据
  # default_server.cleanup()

  # 启动您的 milvus 服务器
  default_server.start()

  # 现在您可以使用 localhost 和给定的端口连接
  # 端口由 default_server.listen_port 定义
  connections.connect(host='127.0.0.1', port=default_server.listen_port)

  # 检查服务器是否准备好了。
  print(utility.get_server_version())

  # 停止您的 milvus 服务器
  default_server.stop()
  ```

  您还可以使用 `with` 语句，在不需要时自动停止 Milvus Lite。

  ```python
  from milvus import default_server

  with default_server:
    # Milvus Lite 已经启动，这里使用 default_server。
    connections.connect(host='127.0.0.1', port=default_server.listen_port)
  ```
  
- 作为基于 CLI 的独立服务器启动 Milvus Lite，请运行

  ```shell
  $ milvus-server
  ```

  然后您可以使用 PyMilvus 或其他适合您的方式连接到独立服务器。

### 以调试模式启动 Milvus Lite

- 作为 Python 模块以调试模式运行 Milvus Lite，请按照以下步骤操作：

  ```python
 