---
id: 使用Docker Compose升级Milvus集群.md
summary: 学习如何使用Docker Compose升级Milvus集群。
title: 使用Docker Compose升级Milvus集群
---

{{tab}}

# 使用Docker Compose升级Milvus集群

本主题描述了如何使用Docker Compose升级您的Milvus。

在正常情况下，您可以通过[更改其镜像来升级Milvus](#通过更改其镜像升级Milvus)。但是，在从v2.1.x升级到v{{var.milvus_release_version}}之前的任何升级，您需要[迁移元数据](#迁移元数据)。

## 通过更改其镜像升级Milvus

在正常情况下，您可以按照以下步骤升级Milvus：

1. 在`docker-compose.yaml`中更改Milvus镜像标签。

    注意，您需要更改Proxy、所有协调器和所有工作节点的镜像标签。

    ```yaml
    ...
    rootcoord:
      container_name: milvus-rootcoord
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ...
    proxy:
      container_name: milvus-proxy
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ...
    querycoord:
      container_name: milvus-querycoord
      image: milvusdb/milvus:v{{var.milvus_release_version}}  
    ...
    querynode:
      container_name: milvus-querynode
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ...
    indexcoord:
      container_name: milvus-indexcoord
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ...
    indexnode:
      container_name: milvus-indexnode
      image: milvusdb/milvus:v{{var.milvus_release_version}} 
    ...
    datacoord:
      container_name: milvus-datacoord
      image: milvusdb/milvus:v{{var.milvus_release_version}}   
    ...
    datanode:
      container_name: milvus-datanode
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ```

2. 运行以下命令以执行升级。

    ```shell
    docker compose down
    docker compose up -d
    ```

## 迁移元数据

1. 停止所有Milvus组件。

    ```
    docker stop <milvus-component-docker-container-name>
    ```

2. 为元数据迁移准备配置文件`migrate.yaml`。

    ```yaml
    # migration.yaml
    cmd:
      # 选项：run/backup/rollback
      type: run
      runWithBackup: true
    config:
      sourceVersion: 2.1.4   # 指定您的milvus版本
      targetVersion: {{var.milvus_release_version}}
      backupFilePath: /tmp/migration.bak
    metastore:
      type: etcd
    etcd:
      endpoints:
        - milvus-etcd:2379  # 使用etcd容器名称
      rootPath: by-dev # 数据在etcd中存储的根路径
      metaSubPath: meta
      kvSubPath: kv
    ```

3. 运行迁移容器。

    ```
    # 假设您的docker-compose使用默认的milvus网络运行，
    # 并且您将migration.yaml放在与docker-compose.yaml相同的目录中。
    docker run --rm -it --network milvus -v $(pwd)/migration.yaml:/milvus/configs/migration.yaml milvus/meta-migration:v2.2.0 /milvus/bin/meta-migration -config=/milvus/configs/migration.yaml
    ```

4. 使用新的Milvus镜像再次启动Milvus组件。

    ```
    更新docker-compose.yaml中的milvus镜像标签
    docker compose down
    docker compose up -d
    ```

## 接下来
- 您可能还想了解如何：
  - [扩展Milvus集群](scaleout.md)
- 如果您准备在云上部署您的集群：
  - 学习如何[使用Terraform和Ansible在AWS上部署Milvus](aws.md)
  - 学习如何[使用Terraform在Amazon EKS上部署Milvus](eks.md)
  - 学习如何[在GCP上使用Kubernetes部署Milvus集群](gcp.md)
  - 学习如何[在Microsoft Azure上使用Kubernetes部署Milvus](azure.md)