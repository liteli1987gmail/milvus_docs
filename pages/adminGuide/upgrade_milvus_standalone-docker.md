---

id: upgrade_milvus_standalone-docker.md
label: Docker Compose
order: 1
group: upgrade_milvus_standalone-operator.md
related_key: upgrade Milvus Standalone
summary: 了解如何使用Docker Compose升级Milvus独立部署。
title: 使用Docker Compose升级Milvus独立部署

---

{{tab}}

# 使用Docker Compose升级Milvus独立部署

本主题描述了如何使用Docker Compose升级您的Milvus。

在正常情况下，您可以通过[更改其镜像](#通过更改其镜像升级Milvus)来升级Milvus。但是，您需要在从v2.1.x升级到v{{var.milvus_release_version}}之前的任何升级之前[迁移元数据](#迁移元数据)。

<div class="alter note">

由于安全考虑，Milvus在v2.2.5版本发布时将其MinIO升级到RELEASE.2023-03-20T20-16-18Z。在从使用Docker Compose安装的以前的Milvus独立部署进行任何升级之前，您应该创建一个单节点单驱动器MinIO部署，并将现有的MinIO设置和内容迁移到新部署。有关详细信息，请参阅[此指南](https://min.io/docs/minio/linux/operations/install-deploy-manage/migrate-fs-gateway.html#id2)。

</div>

## 通过更改其镜像升级Milvus

在正常情况下，您可以按照以下步骤升级Milvus：

1. 更改`docker-compose.yaml`中的Milvus镜像标签。

    ```yaml
    ...
    standalone:
      container_name: milvus-standalone
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

2. 为元数据迁移准备配置文件`migration.yaml`。

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
    docker run --rm -it --network milvus -v $(pwd)/migration.yaml:/milvus/configs/migration.yaml milvusdb/meta-migration:v2.2.0 /milvus/bin/meta-migration -config=/milvus/configs/migration.yaml
    ```

4. 使用新的Milvus镜像再次启动Milvus组件。

    ```shell
    // 只有在更新了docker-compose.yaml中的milvus镜像标签后运行以下命令
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