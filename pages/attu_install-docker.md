
用Docker Compose安装Attu
===

[使用Helm图表安装](attu_install-helm.md) [使用软件包进行安装](attu_install-package.md)
使用Docker Compose安装Attu
===========================

Attu是Milvus的高效开源管理工具。本主题将介绍如何使用Docker Compose安装Attu。

先决条件
-------

* 在[本地设备上安装Milvus](install_standalone-docker.md)。
* Docker版本号19.03或更高版本
* Milvus版本2.1.0或更高版本

如果使用的是Milvus 2.0.x，请参阅[v2.0.x Attu文档(ver2.0.x Attu doc)](https://milvus.io/docs/v2.0.x/attu_install-docker.md)。

Milvus与Attu版本映射
-----------------------

| Milvus版本 | 推荐的Attu镜像版本 |
| --- | --- |
| v2.0.x | v2.0.5 |
| v2.1.x | v2.1.5 |
| v2.2.x | v2.2.3 |

启动Attu实例
-------------

```bash
docker run -p 8000:3000  -e MILVUS_URL={your machine IP}:19530 zilliz/attu:v2.2.3

```

启动docker后，在浏览器中访问`http://{ your machine IP }:8000`，并单击**Connect**，进入Attu服务。我们还支持TLS连接、用户名和密码。

![Attu安装](https://milvus.io/static/e4e22f4f0866cf9dad5a9ebe98359532/1263b/insight_install.png "连接到Milvus服务")

连接到Milvus服务。

![Attu_Login_user_pwd](https://milvus.io/static/def6a7263b0f5e73b291c73c363d4821/1263b/insight_install_user_pwd.png "使用用户名和密码连接到Milvus服务")

使用用户名和密码连接到Milvus服务。

贡献
-----

Attu是一个开源项目，欢迎所有贡献者的贡献。请在贡献之前仔细阅读我们的[Contribute指南](https://github.com/zilliztech/attu)。

如果你发现了一个bug或想要提出一个新的功能请求，请创建一个[GitHub Issue](https://github.com/zilliztech/attu)，并确保同样的问题尚未被其他人创建。