
Milvus_CLI
===

本主题描述了如何安装 Milvus_CLI。

Install from PyPI
-----------------

You can install Milvus_CLI from [PyPI](https://pypi.org/project/milvus-cli/).

### Prerequisites

* Install [Python 3.8.5](https://www.python.org/downloads/release/python-385/) or later
* Install [pip](https://pip.pypa.io/en/stable/installation/)

### 通过 pip 安装

运行以下命令以安装 Milvus_CLI。

```bash
pip install milvus-cli

```

Install with Docker
-------------------

You can instal Milvus_CLI with docker.

### 前提条件

需要Docker 19.03或更高版本。

### Install based on Docker image

```bash
$ docker run -it zilliz/milvus_cli:latest

```

Install from source code
------------------------

1. Run the following command to download a `milvus_cli` repository.

```bash
git clone https://github.com/zilliztech/milvus_cli.git

```

2. Run the following command to enter the `milvus_cli` folder.

```bash
cd milvus_cli

```

3. Run the following command to install Milvus_CLI.

```bash
python -m pip install --editable .

```

Alternatively, you can install Milvus_CLI from a compressed tarball (`.tar.gz` file). Download a [tarball](https://github.com/zilliztech/milvus_cli/releases) and run `python -m pip install milvus_cli-<version>.tar.gz`.

### Install from an .exe file

 This installation method only applies to Windows. 
从[GitHub](https://github.com/zilliztech/milvus_cli/releases)下载一个.exe文件并运行它来安装Milvus_CLI。如果成功，`milvus_cli-<version>.exe`将如下图所示弹出。

[![Milvus_CLI](https://milvus.io/static/1d3bb27ed7d7cdf6f670d8d41f3c669a/1263b/milvus_cli_exe.png "Successful installation of Milvus_CLI.")](https://milvus.io/static/1d3bb27ed7d7cdf6f670d8d41f3c669a/20bbc/milvus_cli_exe.png)

Successful installation of Milvus_CLI.

