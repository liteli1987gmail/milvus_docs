---
id: deploy-cdc-server.md
order: 2
summary: This guide provides a step-by-step process for deploying a Milvus-CDC server.
title: Deploy CDC Server
---

# 部署 CDC 服务器

本指南提供了部署 Milvus-CDC 服务器的逐步过程。

## 先决条件

在部署 Milvus-CDC 服务器之前，请确保满足以下条件：

- **Milvus 实例**：源 Milvus 和至少一个目标 Milvus 应已部署并运行。

  - 源和目标 Milvus 的版本必须为 2.3.2 或更高，最好是 2.4.x。我们建议使用相同版本的源和目标 Milvus 以确保兼容性。

  - 将目标 Milvus 的 `common.ttMsgEnabled` 配置设置为 `false`。

  - 使用不同的元数据和消息存储设置配置源和目标 Milvus，以防止冲突。例如，避免使用相同的 etcd 和 rootPath 配置，以及在多个 Milvus 实例中使用相同的 Pulsar 服务和 `chanNamePrefix`。

- **元数据存储**：为 Milvus-CDC 元数据存储准备 etcd 或 MySQL 数据库。

## 步骤

### 获取 Milvus-CDC 配置文件

克隆 [Milvus-CDC 仓库](https://github.com/zilliztech/milvus-cdc) 并导航到 `milvus-cdc/server/configs` 目录以访问 `cdc.yaml` 配置文件。

```bash
git clone https://github.com/zilliztech/milvus-cdc.git

cd milvus-cdc/server/configs
```

### 编辑配置文件

在 `milvus-cdc/server/configs` 目录中，修改 `cdc.yaml` 文件以自定义与 Milvus-CDC 元数据存储和源 Milvus 连接详细信息相关的配置。

- **元数据存储配置**：

  - `metaStoreConfig.storeType`：Milvus-CDC 的元数据存储类型。可能的值是 `etcd` 或 `mysql`。

  - `metaStoreConfig.etcdEndpoints`：连接到 Milvus-CDC 的 etcd 的地址。如果 `storeType` 设置为 `etcd`，则需要此配置。

  - `metaStoreConfig.mysqlSourceUrl`：Milvus-CDC 服务器的 MySQL 数据库连接地址。如果 `storeType` 设置为 `mysql`，则需要此配置。

  - `metaStoreConfig.rootPath`：Milvus-CDC 元数据存储的根路径。此配置启用多租户，允许多个 CDC 服务使用相同的 etcd 或 MySQL 实例，同时通过不同的根路径实现隔离。

  配置示例：

  ```yaml
  # cdc meta data config
  metaStoreConfig:
    # the metastore type, available value: etcd, mysql
    storeType: etcd
    # etcd address
    etcdEndpoints:
      - localhost:2379
    # mysql connection address
    # mysqlSourceUrl: root:root@tcp(127.0.0.1:3306)/milvus-cdc?charset=utf8
    # meta data prefix, if multiple cdc services use the same store service, you can set different rootPaths to achieve multi-tenancy
    rootPath: cdc
  ```

- **源 Milvus 配置**：

  指定源 Milvus 的连接详细信息，包括 etcd 和消息存储，以建立 Milvus-CDC 服务器和源 Milvus 之间的连接。

  - `sourceConfig.etcdAddress`：连接到源 Milvus 的 etcd 的地址。有关更多信息，请参考 [etcd 相关配置](https://milvus.io/docs/configure_etcd.md#etcd-related-Configurations)。

  - `sourceConfig.etcdRootPath`：源 Milvus 在 etcd 中存储数据的键的根前缀。根据 Milvus 实例的部署方法，该值可能不同：

    - **Helm** 或 **Docker Compose**：默认为 `by-dev`。

    - **Operator**：默认为 `<release_name>`。

  - `sourceConfig.pulsar`：源 Milvus 的 Pulsar 配置。如果源 Milvus 使用 Kafka 作为消息存储，请删除所有与 Pulsar 相关的配置。有关更多信息，请参考 [Pulsar 相关配置](https://milvus.io/docs/configure_pulsar.md)。

  - `sourceConfig.kafka.address`：源 Milvus 的 Kafka 地址。如果源 Milvus 使用 Kafka 作为消息存储，请取消此配置的注释。有关更多信息，请参考 [Kafka 相关配置](https://milvus.io/docs/configure_kafka.md)。

配置示例：

### 编译 Milvus-CDC 服务器

保存 `cdc.yaml` 文件后，导航到 `milvus-cdc` 目录并运行以下命令之一来编译服务器：

- For a binary file:

  ```bash
  make build
  ```

- For a Docker image:

  ```bash
  bash build_image.sh
  ```

  For a Docker image, mount the compiled file to `/app/server/configs/cdc.yaml` within the container.

### Start the server

- Using the binary

  Navigate to the directory containing the `milvus-cdc` binary and the `configs` directory with the `cdc.yaml` file, then start the server:

  ```bash
  # dir tree
  .
  ├── milvus-cdc # build from source code or download from release page
  ├── configs
  │   └── cdc.yaml # config for cdc and source milvus

  # start milvus cdc
  ./milvus-cdc server
  ```

- Using Docker Compose:

  ```bash
  docker-compose up -d
  ```
