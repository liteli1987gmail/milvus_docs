


# 使用 Milvus Lite 入门

本指南介绍了如何安装、配置和使用 [Milvus Lite](https://github.com/milvus-io/milvus-lite)。

<div class="alert caution">

请勿在任何生产环境中使用 Milvus Lite，或者如果你需要高性能，请考虑使用 Milvus 集群或在 Zilliz Cloud 上完全托管的 Milvus。

</div>

## 概述

Milvus Lite 是 Milvus 的轻量级版本，与 Google Colab 和 Jupyter Notebook 无缝配合使用。

由于 Milvus 独立版能够嵌入式运行并具有本地存储和嵌入式 etcd 的能力，Milvus Lite 只包含一个单独的二进制文件，没有其他依赖项，可以轻松安装和在你的计算机上运行，或者嵌入到你的任何 Python 应用程序中。

使用 Milvus Lite 所做的任何操作以及为 Milvus Lite 编写的任何代码都可以安全地迁移到以其他方式安装的 Milvus 实例中。

它还配有基于命令行界面的 Milvus 独立服务器，可在你的计算机上运行。将其嵌入到你的 Python 代码中或将其用作独立服务器由你自己选择。

## 应用场景

Milvus Lite 适用于以下场景：

- 你想直接使用 Milvus，而无需使用 [Milvus Operator](/getstarted/standalone/install_standalone-operator.md)、[Helm](/getstarted/standalone/install_standalone-helm.md) 或者 [Docker Compose](/getstarted/standalone/install_standalone-docker.md) 等进行安装。
- 在使用 Milvus 时，你不希望启动任何虚拟机或容器。
- 你想将 Milvus 的功能嵌入到你的 Python 应用程序中。

## 先决条件

- Python 3.7 或更高版本
- 已验证的操作系统如下：

  - Ubuntu >= 20.04 (x86_64)
  - CentOS >= 7.0 (x86_64)
  - MacOS >= 11.0 (Apple Silicon)

<div class="alert note">  

- 对于 Linux 用户，Milvus Lite 使用 **manylinux2014** 作为基本镜像。它应该能够在大多数 Linux 发行版上运行。
- Milvus Lite 也可以在 Windows 上运行。但是，这没有严格验证。

</div>

## 安装 Milvus Lite

Milvus Lite 可以在 PyPI 上获得，你可以通过 `pip` 安装它。

```shell
$ python3 -m pip install milvus
```

或者，你可以使用 PyMilvus 来安装它，具体操作如下：

```shell
$ python3 -m pip install milvus[client]
```

## 入门指南

你可以从我们项目仓库的 [example](https://github.com/milvus-io/milvus-lite/tree/main/examples) 文件夹中下载示例笔记本，以开始使用。

## 使用 Milvus Lite

你可以将 Milvus Lite 作为 Python 库导入，或者使用它作为基于命令行界面的 Milvus 独立服务器在你的计算机上运行。

### 启动 Milvus Lite


* 作为 Python 模块启动 Milvus Lite，按照以下步骤操作：

```python
from milvus import default_server
from pymilvus import connections, utility

# （可选）如果你想将所有相关数据存储到特定位置
# 默认位置：
#   在Windows上是 %APPDATA%/milvus-io/milvus-server
#   在Linux上是 ~/.milvus-io/milvus-server
# default_server.set_base_dir('milvus_data')

# （可选）如果你想清理以前的数据
# default_server.cleanup()

# 启动milvus服务器
default_server.start()

# 现在，你可以通过localhost和给定的端口连接
# 端口由default_server.listen_port定义
connections.connect(host='127.0.0.1', port=default_server.listen_port)

# 检查服务器是否就绪。
print(utility.get_server_version())

# 停止milvus服务器
default_server.stop()
```

你还可以使用 `with` 语句，在不需要时自动停止 Milvus Lite。

```python
from milvus import default_server

with default_server:
  # Milvus Lite已经启动，可以在此处使用default_server。
  connections.connect(host='127.0.0.1', port=default_server.listen_port)
```

* 要以 CLI 为基础的独立服务器启动 Milvus Lite，请运行：

```shell
$ milvus-server
```

然后，你可以使用 PyMilvus 或其他适合你的方式连接到独立服务器。

### 在调试模式下启动 Milvus Lite

* 要将 Milvus Lite 作为 Python 模块在调试模式下运行，按照以下步骤操作：

```python
from milvus import debug_server, MilvusServer

debug_server.run()

# 或者你可以自行创建MilvusServer实例
# server = MilvusServer(debug=True)
```

* 要在调试模式下运行独立服务器，按照以下步骤操作：

```shell
$ milvus-server --debug
```

### 持久化数据和日志

* 要设置一个本地目录供 Milvus Lite 存储所有相关数据和日志，请按照以下步骤操作：

```python
from milvus import default_server

with default_server:
  default_server.set_base_dir('milvus_data')
```

* 要在本地驱动器上持久化独立服务器生成的所有数据和日志，请运行：

```shell
$ milvus-server --data milvus_data
```

## 配置 Milvus Lite


你可以像配置 Milvus 实例一样通过 Python API 和 CLI 来配置 Milvus Lite。

- 使用 Python API 配置 Milvus Lite，你可以使用 `MilvusServer` 实例的 `config.set` API 来设置基础和额外的配置项，如下所示：

  ```python
  from milvus import default_server

  with default_server:
    default_server.config.set('system_Log_level', 'info')
    default_server.config.set('proxy_port', 19531)
    default_server.config.set('dataCoord.segment.maxSize', 1024)
  ```

- 使用 CLI 配置 Milvus Lite，运行以下命令进行基础配置。

  ```shell
  $ milvus-server --system-log-level info
  $ milvus-server --proxy-port 19531
  ```

  或者，运行以下命令进行额外配置。

  ```shell
  $ milvus-server --extra-config dataCoord.segment.maxSize=1024
  ```

你可以在 Milvus 包中附带的 `config.yaml` 模板中找到所有可配置的配置项。你也可以在我们的项目仓库中 [找到模板](https://github.com/milvus-io/milvus-lite/blob/main/src/milvus/data/config.yaml.template)。

## 接下来做什么



如果你有新的想法，并且想为 Milvus Lite 做出贡献，请先阅读 [贡献指南](https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md)。

如果在安装或使用 Milvus Lite 的过程中遇到任何问题，请在此处 [提出问题](https://github.com/milvus-io/milvus-lite/issues/new)。

