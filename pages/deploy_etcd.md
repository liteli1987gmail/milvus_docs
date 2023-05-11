Milvus 使用 etcd 存储元数据。本主题介绍如何使用 Docker Compose 或 Helm 配置 etcd。

使用 Docker Compose 配置 etcd
----------------------

### 1. 配置 etcd

要使用 Docker Compose 配置 etcd，请在 milvus/configs 路径下的 milvus.yaml 文件中提供 `etcd` 部分的值。

```
etcd:
  endpoints:
    - localhost:2379
  rootPath: by-dev # 存储数据的 etcd 根路径
  metaSubPath: meta # metaRootPath = rootPath + '/' + metaSubPath
  kvSubPath: kv # kvRootPath = rootPath + '/' + kvSubPath
  log:
    # path 的值包括：
    #  - "default"，表示 os.Stderr
    #  - "stderr"，表示 os.Stderr
    #  - "stdout"，表示 os.Stdout
    #  - 要追加日志的文件路径
    # 在嵌入式 Milvus 中请进行相应的调整：/tmp/milvus/logs/etcd.log
    path: stdout
    level: info # 仅支持 debug、info、warn、error、panic 或 fatal。默认为“info”。
  use:
    # 在嵌入式 Milvus 中请进行相应的调整：true
    embed: false # 是否启用嵌入式 Etcd（一个内部 EtcdServer）。
  data:
    # 仅在嵌入式 Etcd 中有效。
    # 在嵌入式 Milvus 中请进行相应的调整：/tmp/milvus/etcdData/
    dir: default.etcd

```

有关更多信息，请参阅 [与 etcd 相关的配置](configure_etcd.md)。

### 2. 运行 Milvus

运行以下命令以启动使用 etcd 配置的 Milvus。

```
docker-compose up

```

只有在 Milvus 启动后，配置才会生效。有关更多信息，请参阅 [启动 Milvus](https://milvus.io/docs/install_standalone-docker.md#Start-Milvus)。

在 K8s 上配置 etcd
---------------------

对于在 K8s 上的 Milvus 集群，您可以在启动 Milvus 的同一命令中配置 etcd。或者，您可以在启动 Milvus 之前使用 [milvus-helm](https://github.com/milvus-io/milvus-helm) 存储库中 /charts/milvus 路径下的 values.yml 文件配置 etcd。

以下表格列出了在 YAML 文件中配置 etcd 的键。
| Key | Description | Value |
| --- | --- | --- |
| `etcd.enabled` | Enables or disables etcd. | `true`/`false` |
| `externalEtcd.enabled` | Enables or disables external etcd. | `true`/`false` |
| `externalEtcd.endpoints` | The endpoint to access etcd. |  |

### 使用 YAML 文件

- 在 `values.yaml` 文件中使用你的值配置 `etcd` 部分。

```
etcd:
  enabled: false

```

- 在 `values.yaml` 文件中使用你的值配置 `externaletcd` 部分。

```
externalEtcd:
  enabled: true
  ## the endpoints of the external etcd
  endpoints:
    - <your_etcd_IP>:2379

```

- 在配置上述部分并保存 `values.yaml` 文件后，运行以下命令安装使用 etcd 配置的 Milvus。

```
helm install <your_release_name> milvus/milvus -f values.yaml

```
### 使用命令

要安装 Milvus 并配置 etcd，请使用您的值运行以下命令。

```
helm install <your_release_name> milvus/milvus --set cluster.enabled=true --set etcd.enabled=false --set externaletcd.enabled=true --set externalEtcd.endpoints={<your_etcd_IP>:2379}

```

接下来的步骤
-----------

了解如何使用 Docker Compose 或 Helm 配置其他 Milvus 依赖项：

* [使用 Docker Compose 或 Helm 配置对象存储](deploy_s3.md)
* [使用 Docker Compose 或 Helm 配置消息存储](deploy_pulsar.md)