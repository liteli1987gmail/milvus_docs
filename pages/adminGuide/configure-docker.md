


# 使用 Docker Compose 配置 Milvus

本主题介绍如何使用 Docker Compose 配置 Milvus 组件及其第三方依赖。

<div class="alert note">
在当前版本中，所有参数只在 Milvus 重启后生效。
</div>

## 下载配置文件

直接 [下载](https://raw.githubusercontent.com/milvus-io/milvus/v{{var.milvus_release_tag}}/configs/milvus.yaml) `milvus.yaml` 文件或使用以下命令下载。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus/v{{var.milvus_release_tag}}/configs/milvus.yaml
```

## 修改配置文件




Configure your Milvus 实例以适应你的应用场景，通过调整 `milvus.yaml` 中的相应参数。

请查看以下链接，了解每个参数的更多信息。

按照分类：

<div class="filter">
<a href="#component"> 组件或依赖 </a> <a href="#purpose"> 配置目的 </a> 

</div>

<div class="filter-component table-wrapper">

<table id="component">
<thead>
  <tr>
    <th> 依赖 </th>
    <th> 组件 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>
        <ul>
            <li> <a href="configure_etcd.md"> etcd </a> </li>
            <li> <a href="configure_minio.md"> MinIO 或 S3 </a> </li>
            <li> <a href="configure_pulsar.md"> Pulsar </a> </li>
            <li> <a href="configure_rocksmq.md"> RocksMQ </a> </li>
        </ul>
    </td>
    <td>
        <ul>
            <li> <a href="configure_rootcoord.md"> Root coord </a> </li>
            <li> <a href="configure_proxy.md"> Proxy </a> </li>
            <li> <a href="configure_querycoord.md"> Query coord </a> </li>
            <li> <a href="configure_querynode.md"> Query node </a> </li>
            <li> <a href="configure_indexcoord.md"> Index coord </a> </li>
            <li> <a href="configure_indexnode.md"> Index node </a> </li>
            <li> <a href="configure_datacoord.md"> Data coord </a> </li>
            <li> <a href="configure_datanode.md"> Data node </a> </li>
            <li> <a href="configure_localstorage.md"> Local storage </a> </li>
            <li> <a href="configure_log.md"> Log </a> </li>
            <li> <a href="configure_messagechannel.md"> Message channel </a> </li>
            <li> <a href="configure_common.md"> Common </a> </li>
            <li> <a href="configure_knowhere.md"> Knowhere </a> </li>
            <li> <a href="configure_quota_limits.md"> Quota and Limits </a> </li>
        </ul>
    </td>
  </tr>
</tbody>
</table>

</div>

<div class="filter-purpose table-wrapper">

<table id="purpose">
<thead>
  <tr>
    <th> 目的 </th>
    <th> 参数 </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> 性能调优 </td>
    <td>
        <ul>
            <li> <a href="configure_querynode.md#queryNodegracefulTime"> <code> queryNode.gracefulTime </code> </a> </li>
            <li> <a href="configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex"> <code> rootCoord.minSegmentSizeToEnableIndex </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordsegmentmaxSize"> <code> dataCoord.segment.maxSize </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordsegmentsealProportion"> <code> dataCoord.segment.sealProportion </code> </a> </li>
            <li> <a href="configure_datanode.md#dataNodeflushinsertBufSize"> <code> dataNode.flush.insertBufSize </code> </a> </li>
            <li> <a href="configure_querycoord.md#queryCoordautoHandoff"> <code> queryCoord.autoHandoff </code> </a> </li>
            <li> <a href="configure_querycoord.md#queryCoordautoBalance"> <code> queryCoord.autoBalance </code> </a> </li>
            <li> <a href="configure_localstorage.md#localStorageenabled"> <code> localStorage.enabled </code> </a> </li>
        </ul>
    </td>
  </tr>
  <tr>
    <td> 数据和元数据 </td>
    <td>
        <ul>
            <li> <a href="configure_common.md#commonretentionDuration"> <code> common.retentionDuration </code> </a> </li>
            <li> <a href="configure_rocksmq.md#rocksmqretentionTimeInMinutes"> <code> rocksmq.retentionTimeInMinutes </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordenableCompaction"> <code> dataCoord.enableCompaction </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordenableGarbageCollection"> <code> dataCoord.enableGarbageCollection </code> </a> </li>
            <li> <a href="configure_datacoord.md#dataCoordgcdropTolerance"> <code> dataCoord.gc.dropTolerance </code> </a> </li>
        </ul>
    </td>
  </tr>
  <tr>
    <td> 管理 </td>
    <td>
        <ul>
            <li> <a href="configure_log.md#loglevel"> <code> log.level </code> </a> </li>
            <li> <a href="configure_log.md#logfilerootPath"> <code> log.file.rootPath </code> </a> </li>
            <li> <a href="configure_log.md#logfilemaxAge"> <code> log.file.maxAge </code> </a> </li>
            <li> <a href="configure_minio.md#minioaccessKeyID"> <code> minio.accessKeyID </code> </a> </li>
        </ul>
    </td>
  </tr>
</tbody>
</table>

</div>



## 下载安装文件

下载 Milvus 的安装文件 [standalone](https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml)，并将其保存为 `docker-compose.yml`。

你也可以直接运行以下命令。

```
# 对于Milvus standalone
$ wget https://github.com/milvus-io/milvus/releases/download/v{{var.milvus_release_tag}}/milvus-standalone-docker-compose.yml -O docker-compose.yml
```

## 修改安装文件

在 `docker-compose.yml` 中，在每个 `milvus-standalone` 下添加一个 `volumes` 部分。

将本地路径映射到相应的 docker 容器路径，映射到所有 `volumes` 部分下的配置文件 `/milvus/configs/milvus.yaml`。

```yaml
...
  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.2.13
    command: ["milvus", "run", "standalone"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - /local/path/to/your/milvus.yaml:/milvus/configs/milvus.yaml   # 将本地路径映射到容器路径
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/milvus:/var/lib/milvus
    ports:
      - "19530:19530"
      - "9091:9091"
    depends_on:
      - "etcd"
      - "minio"
...
```

<div class="alert note">
数据按照 `docker-compose.yml` 中的默认配置存储在 `/volumes` 文件夹中。要更改存储数据的文件夹，请编辑 `docker-compose.yml` 或运行 `$ export DOCKER_VOLUME_DIRECTORY= `。
</div>

## 启动 Milvus

完成配置文件和安装文件的修改，然后启动 Milvus。

```
$ sudo docker compose up -d
```

## 后续操作




- 学习如何使用 Docker Compose 或 Helm 管理以下 Milvus 依赖项：
  - [使用 Docker Compose 或 Helm 配置对象存储](/adminGuide/deploy_s3.md)
  - [使用 Docker Compose 或 Helm 配置元数据存储](/adminGuide/deploy_etcd.md)
  - [使用 Docker Compose 或 Helm 配置消息存储](/adminGuide/deploy_pulsar.md)



