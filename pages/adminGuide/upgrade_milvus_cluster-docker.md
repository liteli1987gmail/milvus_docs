


# 使用 Docker Compose 升级 Milvus 集群

本主题介绍如何使用 Docker Compose 升级 Milvus。

通常情况下，你可以通过更改其镜像来升级 Milvus。 但在从 v2.1.x 升级到 v{{var.milvus_release_version}}之前，你需要先进行元数据迁移。

## 通过更改镜像升级 Milvus

通常情况下，你可以按照以下步骤升级 Milvus：

1. 在 `docker-compose.yaml` 文件中更改 Milvus 镜像的标签。

    注意，你需要更改 Proxy，所有协调员和所有工作节点的镜像标签。

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

2. 运行以下命令执行升级操作。

    ```shell
    docker compose down
    docker compose up -d
    ```

## 迁移元数据
 


1. 停止所有的 Milvus 组件。

    ```
    docker stop <milvus-component-docker-container-name>
    ```

2. 准备用于元数据迁移的配置文件 `migrate.yaml`。

    ```yaml
    # migration.yaml
    cmd:
      # 选项：run/backup/rollback
      type: run
      runWithBackup: true
    config:
      sourceVersion: 2.1.4   # 指定你的Milvus版本
      targetVersion: {{var.milvus_release_version}}
      backupFilePath: /tmp/migration.bak
    metastore:
      type: etcd
    etcd:
      endpoints:
        - milvus-etcd:2379  # 使用etcd容器名称
      rootPath: by-dev # 数据在etcd中的根路径
      metaSubPath: meta
      kvSubPath: kv
    ```

3. 运行迁移容器。

    ```
    # 假设你的docker-compose运行在默认的milvus网络上，
    # 并且将migration.yaml放在与docker-compose.yaml相同的目录中。
    docker run --rm -it --network milvus -v $(pwd)/migration.yaml:/milvus/configs/migration.yaml milvus/meta-migration:v2.2.0 /milvus/bin/meta-migration -config=/milvus/configs/migration.yaml
    ```

4. 以新的 Milvus 镜像再次启动 Milvus 组件。

    ```
    在docker-compose.yaml中更新milvus镜像标签
    docker compose down
    docker compose up -d
    ```

## 接下来做什么
 


- 你可能还想学习如何：
  - [扩展 Milvus 集群](/adminGuide/scaleout.md)
- 如果你准备在云上部署你的集群：
  - 学习如何使用 Terraform 和 Ansible 在 AWS 上部署 Milvus](aws.md)
  - 学习如何使用 Terraform 在 Amazon EKS 上部署 Milvus](eks.md)
  - 学习如何使用 Kubernetes 在 GCP 上部署 Milvus 集群](gcp.md)
  - 学习如何使用 Kubernetes 在 Microsoft Azure 上部署 Milvus](azure.md)

