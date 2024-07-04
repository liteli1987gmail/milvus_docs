


# 安装 MilvusDM

MilvusDM 是一个专为使用 Milvus 导入和导出数据而设计的开源工具。本页面将向你展示如何安装 MilvusDM。

<div class="alert note">
  pymilvusdm2.0 用于将数据从 Milvus (0.10.x 或 1.x) 迁移到 Milvus2.x。
</div>

## 开始之前

在安装 MilvusDM 之前，请确保你满足操作系统和软件的要求。

| 操作系统  | 支持的版本           |
| --------- | ------------------- |
| CentOS    | 7.5 或更高版本       |
| Ubuntu LTS| 18.04 或更高版本    |

| 软件                 | 版本                  |
| -------------------- | -------------------- |
| [Milvus](https://milvus.io/) | 0.10.x 或 1.x 或 2.x  |
| Python3              | 3.7 或更高版本        |
| pip3                 | 应与 Python 版本对应 |

## 安装 MilvusDM



1. 将以下两行添加到 **~/.bashrc** 文件中：

```bash
export MILVUSDM_PATH='/home/$user/milvusdm'
export LOGS_NUM=0
```

- `MILVUSDM_PATH`：该参数定义了 MilvusDM 的工作路径。MilvusDM 生成的日志和数据将存储在该路径下。默认值为 `/home/$user/milvusdm`。

- `LOGS_NUM`：MilvusDM 每天生成一个日志文件。该参数定义你想要保存的日志文件数量。默认值为 0，表示保存所有日志文件。

2. 配置环境变量：

```shell
$ source ~/.bashrc
```

3. 使用 `pip` 安装 MilvusDM：

```shell
$ pip3 install pymilvusdm==2.0
```

