


# 使用 Docker Compose 或 Helm 配置元数据存储

Milvus 使用 etcd 来存储元数据。本主题介绍如何使用 Docker Compose 或 Helm 来配置 etcd。

## 使用 Docker Compose 配置 etcd

### 1. 配置 etcd

使用 Docker Compose 配置 etcd，在 milvus/configs 路径下的 `milvus.yaml` 文件中为 `etcd` 部分提供你的值。

```
etcd:
  endpoints:
    - localhost:2379
  rootPath: by-dev # 数据存储在 etcd 中的根路径
  metaSubPath: meta # metaRootPath = rootPath + '/' + metaSubPath
  kvSubPath: kv # kvRootPath = rootPath + '/' + kvSubPath
  log:
    # 路径可选值有：
    #  - "default" 作为 os.Stderr,
    #  - "stderr" 作为 os.Stderr,
    #  - "stdout" 作为 os.Stdout,
    #  - 文件路径以追加服务器日志。
    # 请在内嵌的 Milvus 中进行调整：/tmp/milvus/logs/etcd.log
    path: stdout
    level: info # 仅支持 debug、info、warn、error、panic 或 fatal。默认为 'info'。
  use:
    # 请在内嵌的 Milvus 中进行调整：true
    embed: false # 是否启用内嵌的 Etcd (进程内 EtcdServer)。
  data:
    # 仅针对内嵌的 Etcd。
    # 请在内嵌的 Milvus 中进行调整：/tmp/milvus/etcdData/
    dir: default.etcd
```

更多信息请参阅 [与 etcd 相关的配置](/reference/sys_config/configure_etcd.md)。

### 2. 运行 Milvus

运行以下命令启动使用 etcd 配置的 Milvus。

```
docker compose up
```

<div class="alert note"> 配置仅在 Milvus 启动后生效。更多信息请参阅 <a href=https://milvus.io/docs/install_standalone-docker.md#Start-Milvus> 启动 Milvus </a>。</div>

## 在 K8s 上配置 etcd

对于 K8s 上的 Milvus 集群，你可以在启动 Milvus 的同一命令中配置 etcd。或者在启动 Milvus 之前，你可以在 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库的 /charts/milvus 路径中使用 `values.yml` 文件来配置 etcd。

下表列出了在 YAML 文件中配置 etcd 的键。
| 键             | 描述                          | 值                                 |
| --------------------- | ------------------------------------ | ------------------------------------ |
| <code> etcd.enabled </code>           | 启用或禁用 etcd。          | <code> true </code>/<code> false </code> |
| <code> externalEtcd.enabled </code>   | 启用或禁用外部 etcd。 | <code> true </code>/<code> false </code> |
| <code> externalEtcd.endpoints </code> | 访问 etcd 的端点。       |                                      |



### 使用 YAML 文件

1. 在 `values.yaml` 文件中使用你的值配置 `etcd` 部分。

```yaml
etcd:
  enabled: false
```

2. 在 `values.yaml` 文件中使用你的值配置 `externaletcd` 部分。

```yaml
externalEtcd:
  enabled: true
  ## 外部 etcd 的端点
  endpoints:
    - <your_etcd_IP>:2379
```

3. 配置好上述部分并保存 `values.yaml` 文件后，运行以下命令安装使用 etcd 配置的 Milvus。

```shell
helm install <your_release_name> milvus/milvus -f values.yaml
```
### 使用命令

使用你的值运行以下命令安装 Milvus 并配置 etcd。

```shell
helm install <your_release_name> milvus/milvus --set cluster.enabled=true --set etcd.enabled=false --set externaletcd.enabled=true --set externalEtcd.endpoints={<your_etcd_IP>:2379}
```

## 下一步操作
 


学习如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：

- [使用 Docker Compose 或 Helm 配置对象存储](/adminGuide/deploy_s3.md)
- [使用 Docker Compose 或 Helm 配置消息存储](/adminGuide/deploy_pulsar.md)

