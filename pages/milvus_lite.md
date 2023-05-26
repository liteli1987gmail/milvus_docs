Milvus Lite 入门指南
================

本指南介绍了如何安装、配置和使用[Milvus Lite](https://github.com/milvus-io/milvus-lite)。

请不要在任何生产环境中使用 Milvus Lite，或者如果您需要高性能。对于生产目的，请考虑使用 Milvus 集群或在 Zilliz Cloud 上完全托管的 Milvus。

概述
--

Milvus Lite 是 Milvus 的轻量版，可与 Google Colab 和 Jupyter Notebook 无缝配合使用。

由于 Milvus standalone 能够在嵌入式 etcd 和本地存储的情况下运行，Milvus Lite 仅带有一个单独的二进制文件，无需其他依赖项，您可以轻松安装和运行在您的机器上，或嵌入到您的任何 Python 应用程序中。

您在 Milvus Lite 中所做的任何操作以及为 Milvus Lite 编写的任何代码都可以安全地迁移到其他安装方式的 Milvus 实例中。

它还配备了基于CLI的Milvus独立服务器，可以在您的机器上运行。将其嵌入Python代码或将其用作独立服务器由您决定。

应用场景
----

Milvus Lite适用于以下场景：

* 如果您想直接使用Milvus，而不是使用[Milvus Operator](https://milvus.io/docs/install_standalone-operator.md)、[Helm](https://milvus.io/docs/install_standalone-helm.md)或[Docker Compose](https://milvus.io/docs/install_standalone-docker.md)等工具安装它。

* 如果您使用Milvus时不想启动任何虚拟机或容器。

* 如果您想在Python应用程序中嵌入Milvus功能。

前提条件
----

* Python 3.7 或更高版本

* 已验证的操作系统如下：

	+ Ubuntu >= 18.04 (x86_64)
	+ CentOS >= 7.0 (x86_64)
	+ MacOS >= 11.0 (Apple Silicon)

* 对于 Linux 用户，Milvus Lite 使用 **manylinux2014** 作为基础镜像。它应该能够在大多数 Linux 发行版上运行。

* Milvus Lite 也可以在 Windows 上运行。但是，这并没有严格验证。

安装Milvus Lite
-------------

Milvus Lite可以在PyPI上找到，你可以通过`pip`来安装它。

```bash
$ python3 -m pip install milvus

```

或者，你可以使用PyMilvus来安装它，方法如下：

```bash
$ python3 -m pip install milvus[client]

```

开始使用
----

您可以从我们的项目存储库的[示例](https://github.com/milvus-io/milvus-lite/tree/main/examples)文件夹下载示例笔记本以开始使用。

使用Milvus Lite
-------------

您可以将Milvus Lite作为Python库导入，也可以将其作为基于CLI的Milvus独立服务器在您的计算机上运行。

### 启动 Milvus Lite

* 要将Milvus Lite作为Python模块启动，请按以下方式操作：

```bash
from milvus import default_server
from pymilvus import connections, utility

# (OPTIONAL) Set if you want store all related data to specific location
# Default location:
#   %APPDATA%/milvus-io/milvus-server on windows
#   ~/.milvus-io/milvus-server on linux
# default_server.set_base_dir('milvus_data')

# (OPTIONAL) if you want cleanup previous data
# default_server.cleanup()

# Start your milvus server
default_server.start()

# Now you could connect with localhost and the given port
# Port is defined by default_server.listen_port
connections.connect(host='127.0.0.1', port=default_server.listen_port)

# Check if the server is ready.
print(utility.get_server_version())

# Stop your milvus server
default_server.stop()

```

您还可以使用`with`语句，当您不需要它时，Milvus Lite会自动停止。

```bash
from milvus import default_server

with default_server:
  # Milvus Lite has already started, use default_server here.
  connections.connect(host='127.0.0.1', port=default_server.listen_port)

```
* 要将Milvus Lite作为基于CLI的独立服务器启动，请运行

```bash
$ milvus-server

```

然后，您可以使用PyMilvus或其他适合您的方式连接到独立服务器。

### 启动 Milvus Lite 调试模式

* 要以 Python 模块的形式启动 Milvus Lite 调试模式，请按照以下步骤操作：

```bash
from milvus import debug_server, MilvusServer

debug_server.run()

# Or you can create a MilvusServer by yourself
# server = MilvusServer(debug=True)

```
* 要以独立服务器的形式启动调试模式，请按照以下步骤操作：

```bash
$ milvus-server --debug

```

### 持久化数据和日志

* 要将本地目录设置为Milvus Lite存储所有相关数据和日志的本地目录，请执行以下操作：

```bash
from milvus import default_server

with default_server:
  default_server.set_base_dir('milvus_data')

```
* 要在本地驱动器上持久化独立服务器生成的所有数据和日志，请运行

```bash
$ milvus-server --data milvus_data

```

配置Milvus Lite
-------------

你可以通过Python API和CLI来配置Milvus Lite，与配置Milvus实例的方式相同。

* 使用Python API配置Milvus Lite，你可以像下面这样使用`MilvusServer`实例的`config.set` API来配置基本和额外的配置项：

```bash
from milvus import default_server

with default_server:
  default_server.config.set('system_Log_level', 'info')
  default_server.config.set('proxy_port', 19531)
  default_server.config.set('dataCoord.segment.maxSize', 1024)

```
* 使用CLI配置Milvus Lite，运行以下命令来进行基本配置。

```bash
$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531

```

或者运行以下命令进行额外配置。

```bash
$ milvus-server --extra-config dataCoord.segment.maxSize=1024

```

您可以在Milvus软件包中提供的`config.yaml`模板中找到所有可配置的配置项。您还可以在我们的项目存储库中找到[模板](https://github.com/milvus-io/milvus-lite/blob/main/src/milvus/data/config.yaml.template)。

下一步操作
-----

如果您有新的想法并想要为Milvus Lite做出贡献，请首先阅读[贡献指南](https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md)。

如果您在安装或使用Milvus Lite时遇到任何问题，请[在此处提交问题](https://github.com/milvus-io/milvus-lite/issues/new)。

