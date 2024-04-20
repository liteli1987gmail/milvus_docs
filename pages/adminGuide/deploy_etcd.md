---
id: deploy_etcd.md
title: 使用Docker Compose或Helm配置元数据存储
related_key: S3, 存储
summary: 学习如何使用Docker Compose/Helm为Milvus配置元数据存储。
---

# 使用Docker Compose或Helm配置元数据存储

Milvus使用etcd来存储元数据。本主题介绍如何使用Docker Compose或Helm配置etcd。

## 使用Docker Compose配置etcd

### 1. 配置etcd

要使用Docker Compose配置etcd，请在milvus/configs路径下的`milvus.yaml`文件中为`etcd`部分提供您的值。

```
etcd:
  endpoints:
    - localhost:2379
  rootPath: by-dev # 数据在etcd中存储的根路径
  metaSubPath: meta # metaRootPath = rootPath + '/' + metaSubPath
  kvSubPath: kv # kvRootPath = rootPath + '/' + kvSubPath
  log:
    # path是以下之一：
    #  - "default"作为os.Stderr，
    #  - "stderr"作为os.Stderr，
    #  - "stdout"作为os.Stdout，
    #  - 文件路径，将服务器日志追加到。
    # 请在嵌入式Milvus中调整：/tmp/milvus/logs/etcd.log
    path: stdout
    level: info # 仅支持debug, info, warn, error, panic或fatal。默认为'info'。
  use:
    # 请在嵌入式Milvus中调整：true
    embed: false # 是否启用嵌入式Etcd（一个进程内的EtcdServer）。
  data:
    # 仅嵌入式Etcd。
    # 请在嵌入式Milvus中调整：/tmp/milvus/etcdData/
    dir: default.etcd
```

有关更多信息，请参见[etcd相关配置](configure_etcd.md)。

### 2. 运行Milvus

运行以下命令以启动使用etcd配置的Milvus。

```
docker compose up
```

<div class="alert note">配置仅在Milvus启动后生效。有关更多信息，请参见<a href=https://milvus.io/docs/install_standalone-docker.md#Start-Milvus>启动Milvus</a>。</div>

## 在K8s上配置etcd

对于在K8s上的Milvus集群，您可以在启动Milvus的相同命令中配置etcd。或者，您可以在启动Milvus之前，使用[milvus-helm](https://github.com/milvus-io/milvus-helm)仓库中/charts/milvus路径下的`values.yml`文件配置etcd。

下面表格列出了YAML文件中配置etcd的键。
| 键                   | 描述                             | 值                                 |
| --------------------- | ------------------------------------ | ------------------------------------ |
| <code>etcd.enabled</code>           | 启用或禁用etcd.          | <code>true</code>/<code>false</code> |
| <code>externalEtcd.enabled</code>   | 启用或禁用外部etcd. | <code>true</code>/<code>false</code> |
| <code>externalEtcd.endpoints</code> | 访问etcd的端点.       |                                      |



### 使用YAML文件

1. 在`values.yaml`文件中使用您的值配置<code>etcd</code>部分。

```yaml
etcd:
  enabled: false
```

2. 在`values.yaml`文件中使用您的值配置<code>externaletcd</code>部分。

```yaml
externalEtcd:
  enabled: true
  ## 外部etcd的端点
  endpoints:
    - <你的_etcd_IP>:2379
```

3. 配置并保存前面的部分后，运行以下命令以安装使用etcd配置的Milvus。

```shell
helm install <你的发布名称> milvus/milvus -f values.yaml
```
### 使用命令

要安装Milvus并配置etcd，请使用您的值运行以下命令。

```shell
helm install <你的发布名称> milvus/milvus --set cluster.enabled=true --set etcd.enabled=false --set externaletcd.enabled=true --set externalEtcd.endpoints={<你的_etcd_IP>:2379}
```

## 接下来做什么

学习如何使用Docker Compose或Helm配置Milvus的其他依赖项：

- [使用Docker Compose或Helm配置对象存储](deploy_s3.md)
- [使用Docker Compose或Helm配置消息存储](deploy_pulsar.md)