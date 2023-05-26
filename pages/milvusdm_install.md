
MilvusDM是一个专门为了与Milvus导入和导出数据而设计的开源工具。本页介绍如何安装MilvusDM。

 The pymilvusdm2.0 is used for migrating data **from Milvus(0.10.x or 1.x) to Milvus2.x**.

Before you begin
----------------

Ensure you meet the requirements for operating system and software before installing MilvusDM.

| Operating system | Supported versions |
| --- | --- |
| CentOS | 7.5 or higher |
| Ubuntu LTS | 18.04 or higher |

| Software | Version |
| --- | --- |
| [Milvus](https://milvus.io/) | 0.10.x or 1.x or 2.x |
| Python3 | 3.7 or higher |
| pip3 | Should be in correspondence to the Python version. |

安装MilvusDM
----------

- 将以下两行添加到**~/.bashrc**文件中：

```bash
export MILVUSDM_PATH='/home/$user/milvusdm'
export LOGS_NUM=0

```

* `MILVUSDM_PATH`: 此参数定义MilvusDM的工作路径。MilvusDM生成的日志和数据将存储在此路径中。默认值为`/home/$user/milvusdm`。

* `LOGS_NUM`： MilvusDM 每天生成一个日志文件。此参数定义您要保存的日志文件数量。默认值为0，表示保存所有日志文件。

- 配置环境变量：

```bash
$ source ~/.bashrc

```

- 使用 `pip` 安装 MilvusDM：

```bash
$ pip3 install pymilvusdm==2.0

```
