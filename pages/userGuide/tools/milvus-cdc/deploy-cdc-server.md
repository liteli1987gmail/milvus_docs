


# 部署 CDC 服务器

本指南提供了部署 Milvus-CDC 服务器的逐步过程。

## 先决条件

在部署 Milvus-CDC 服务器之前，请确保满足以下条件：

- **Milvus 实例**：源 Milvus 和至少一个目标 Milvus 都应已部署并运行。

   - 源 Milvus 和目标 Milvus 的版本都必须是 2.3.2 或更高，最好是 2.4.x。我们建议源 Milvus 和目标 Milvus 使用相同的版本以确保兼容性。

   - 将目标 Milvus 的 `common.ttMsgEnabled` 配置设置为 `false`。

   - 为了防止冲突，请使用不同的元数据和消息存储设置配置源 Milvus 和目标 Milvus。例如，避免在多个 Milvus 实例中使用相同的 etcd 和 rootPath 配置，以及相同的 Pulsar 服务和 `chanNamePrefix`。

- **元数据存储**：准备好一个 etcd 或 MySQL 数据库供 Milvus-CDC 使用。

## 步骤

### 获取 Milvus-CDC 配置文件

克隆 [Milvus-CDC repo](https://github.com/zilliztech/milvus-cdc) ，然后进入 `milvus-cdc/server/configs` 目录以访问 `cdc.yaml` 配置文件。

```bash
git clone https://github.com/zilliztech/milvus-cdc.git

cd milvus-cdc/server/configs
```

### 编辑配置文件

在 `milvus-cdc/server/configs` 目录下，修改 `cdc.yaml` 文件，自定义与 Milvus-CDC 元数据存储和源 Milvus 的连接详细信息相关的配置。

- **元数据存储配置**：

   - `metaStoreConfig.storeType`：Milvus-CDC 的元数据存储类型。可能的值为 `etcd` 或 `mysql`。

   - `metaStoreConfig.etcdEndpoints`：连接到 Milvus-CDC 的 etcd 的地址。如果 `storeType` 设置为 `etcd`，则需要此配置。

   - `metaStoreConfig.mysqlSourceUrl`：Milvus-CDC 服务器连接的 MySQL 数据库的连接地址。如果 `storeType` 设置为 `mysql`，则需要此配置。

   - `metaStoreConfig.rootPath`：Milvus-CDC 元数据存储的根路径。此配置使多租户成为可能，允许多个 CDC 服务利用相同的 etcd 或 MySQL 实例，通过不同的根路径实现隔离。

   示例配置：

   ```yaml
   # cdc meta data config
   metaStoreConfig:
     # 元数据存储类型，可选值：etcd，mysql
     storeType: etcd
     # etcd 地址
     etcdEndpoints:
       - localhost:2379
     # mysql 连接地址
     # mysqlSourceUrl: root:root@tcp(127.0.0.1:3306)/milvus-cdc?charset=utf8
     # 元数据前缀，若多个 cdc 服务使用同一个存储服务，可设置不同的 rootPaths 实现多租户
     rootPath: cdc
   ```

- **源 Milvus 配置**：

   指定源 Milvus 的连接详细信息，包括 etcd 和消息存储，以建立 Milvus-CDC 服务器与源 Milvus 之间的连接。

   - `sourceConfig.etcdAddress`：连接到源 Milvus 的 etcd 的地址。更多信息请参考 [etcd 相关配置](https://milvus.io/docs/configure_etcd.md#etcd-related-Configurations)。

   - `sourceConfig.etcdRootPath`：源 Milvus 在 etcd 中存储数据的键的根前缀。根据 Milvus 实例的部署方法，值可能有所不同：
      - 使用 __Helm__ 或 __Docker Compose__：默认值为 `by-dev`。
      - 使用 __Operator__：默认值为 `<release_name>`。

   - `sourceConfig.pulsar`：源 Milvus 的 Pulsar 配置。如果源 Milvus 使用 Kafka 进行消息存储，请删除所有与 Pulsar 相关的配置。更多信息请参考 [Pulsar 相关配置](/reference/sys_config/configure_pulsar.md)。

   - `sourceConfig.kafka.address`：源 Milvus 的 Kafka 地址。如果源 Milvus 使用 Kafka 进行消息存储，请取消注释此配置。更多信息请参考 [Kafka 相关配置](/reference/sys_config/configure_kafka.md)。

   示例配置：

### 编译 Milvus-CDC 服务器




保存 `cdc.yaml` 文件后，进入 `milvus-cdc` 目录并运行以下命令之一来编译服务器：

- 要生成二进制文件：

    ```bash
    make build
    ```

- 要生成 Docker 镜像：

    ```bash
    bash build_image.sh
    ```

    对于 Docker 镜像，将编译后的文件挂载到容器内的 `/app/server/configs/cdc.yaml`。

### 启动服务器

在保存了 `cdc.yaml` 文件后，进入 `milvus-cdc` 目录，并运行以下命令之一来编译服务器：

- 对于二进制文件：

    ```bash
    make build
    ```

- 对于 Docker 镜像：

    ```bash
    bash build_image.sh
    ```

    对于 Docker 镜像，将编译后的文件挂载到容器中的 `/app/server/configs/cdc.yaml` 路径下。

### 启动服务器



# 使用二进制文件

导航到包含 `milvus-cdc` 二进制文件和 `configs` 目录（其中包含 `cdc.yaml` 文件）的目录，然后启动服务器：

```bash
# 目录结构
.
├── milvus-cdc # 从源代码构建或从发布页面下载
├── configs
│   └── cdc.yaml # cdc和源milvus的配置

# 启动 milvus cdc
./milvus-cdc server
```

# 使用 Docker Compose:

```bash
docker-compose up -d
```

