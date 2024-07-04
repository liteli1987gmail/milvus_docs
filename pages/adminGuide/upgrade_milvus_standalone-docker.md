


# 使用 Docker Compose 升级 Milvus Standalone

本主题描述了如何使用 Docker Compose 升级 Milvus Standalone。

通常情况下，你可以通过更改镜像来升级 Milvus（[升级 Milvus 的镜像](#Upgrade-Milvus-by-changing-its-image)）。但是，在从 v2.1.x 升级到 v{{var.milvus_release_version}}之前，你需要 [迁移元数据](#Migrate-the-metadata)。

<div class="alter note">

由于安全考虑，Milvus 在 v2.2.5 版本的发布中将其 MinIO 升级为 RELEASE.2023-03-20T20-16-18Z。在使用 Docker Compose 安装的先前 Milvus Standalone 版本的任何升级之前，你应创建一个单节点单驱动器的 MinIO 部署，并将现有的 MinIO 设置和内容迁移到新部署中。有关详细信息，请参阅 [此指南](https://min.io/docs/minio/linux/operations/install-deploy-manage/migrate-fs-gateway.html#id2)。

</div>

## 通过更改镜像来升级 Milvus

通常情况下，你可以按以下方式升级 Milvus：

1. 在 `docker-compose.yaml` 中更改 Milvus 镜像标签。

    ```yaml
    ...
    standalone:
      container_name: milvus-standalone
      image: milvusdb/milvus:v{{var.milvus_release_version}}
    ```

2. 执行以下命令进行升级。

    ```shell
    docker compose down
    docker compose up -d
    ```

## 迁移元数据

1. 停止所有的 Milvus 组件。

    ```
    docker stop <milvus-component-docker-container-name>
    ```

2. 准备用于元数据迁移的配置文件 `migration.yaml`。

    ```yaml
    # migration.yaml
    cmd:
      # Option: run/backup/rollback
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
      rootPath: /dev # 数据存储在etcd中的根路径
      metaSubPath: meta
      kvSubPath: kv
    ```

3. 运行迁移容器。

    ```
    # 假设你的docker-compose与默认的milvus网络一起运行，并且将migration.yaml放在与docker-compose.yaml相同的目录中。
    docker run --rm -it --network milvus -v $(pwd)/migration.yaml:/milvus/configs/migration.yaml milvusdb/meta-migration:v2.2.0 /milvus/bin/meta-migration -config=/milvus/configs/migration.yaml
    ```

4. 使用新的 Milvus 镜像重新启动 Milvus 组件。

    ```shell
    // 仅在在docker-compose.yaml中更新milvus镜像标签后才运行以下命令
    docker compose down
    docker compose up -d
    ```

## 下一步操作



- 你可能还想学习以下内容：
  - [扩展一个 Milvus 集群](/adminGuide/scaleout.md)
- 如果你准备在云上部署你的集群：
  - 学习如何使用 Terraform 和 Ansible 在 AWS 上 [部署 Milvus](/adminGuide/clouds/aws/aws.md)
  - 学习如何使用 Terraform 在 Amazon EKS 上 [部署 Milvus](/adminGuide/clouds/aws/eks.md)
  - 学习如何使用 Kubernetes 在 GCP 上 [部署 Milvus 集群](/adminGuide/clouds/gcp/gcp.md)
  - 学习如何使用 Kubernetes 在 Microsoft Azure 上 [部署 Milvus](/adminGuide/clouds/azure/azure.md)

