---
title: 使用Helm图表配置Milvus
---

# 使用Helm图表配置Milvus

本主题描述了如何使用Helm图表配置Milvus组件及其第三方依赖。

<div class="alert note">
在当前版本中，所有参数仅在Milvus重启后才生效。
</div>

## 通过配置文件配置Milvus

您可以使用配置文件`values.yaml`来配置Milvus。

### 下载配置文件

您可以直接下载`values.yaml`，或者使用以下命令：

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml
```

### 修改配置文件

通过调整`values.yaml`中的相应参数，将您的Milvus实例配置为适合您的应用场景。

具体来说，在`values.yaml`中搜索`extraConfigFiles`，并将您的配置放在该部分，如下所示：

```yaml
# Milvus.yaml的额外配置
# 如果设置，此配置将合并到milvus.yaml中
# 请遵循milvus.yaml中的配置结构
# 在 https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml
# 注意：此配置将具有最高优先级，将覆盖镜像和Helm图表中的配置
extraConfigFiles:
  user.yaml: |+
    #   例如，为查询节点设置优雅时间
    #    queryNodes:
    #      gracefulTime: 10
```

有关每个参数的更多信息，请查看以下链接。

按以下排序：

<div class="filter">
<a href="#component">组件或依赖</a> <a href="#purpose">配置目的</a> 

</div>

<div class="filter-component table-wrapper">

<table id="component">
<thead>
  <tr>
    <th>依赖</th>
    <th>组件</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>
        <ul>
            <li><a href="configure_etcd.md">etcd</a></li>
            <li><a href="configure_minio.md">MinIO或S3</a></li>
            <li><a href="configure_pulsar.md">Pulsar</a></li>
            <li><a href="configure_rocksmq.md">RocksMQ</a></li>
        </ul>
    </td>
    <td>
        <ul>
            <li><a href="configure_rootcoord.md">根协调器</a></li>
            <li><a href="configure_proxy.md">代理</a></li>
            <li><a href="configure_querycoord.md">查询协调器</a></li>
            <li><a href="configure_querynode.md">查询节点</a></li>
            <li><a href="configure_indexcoord.md">索引协调器</a></li>
            <li><a href="configure_indexnode.md">索引节点</a></li>
            <li><a href="configure_datacoord.md">数据协调器</a></li>
            <li><a href="configure_datanode.md">数据节点</a></li>
            <li><a href="configure_localstorage.md">本地存储</a></li>
            <li><a href="configure_log.md">日志</a></li>
            <li><a href="configure_messagechannel.md">消息通道</a></li>
            <li><a href="configure_common.md">通用</a></li>
            <li><a href="configure_knowhere.md">Knowhere</a></li>
            <li><a href="configure_quota_limits.md">配额和限制</a></li>
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
    <th>目的</th>
    <th>参数</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>性能调整</td>
    <td>
        <ul>
            <li><a href="configure_querynode.md#queryNodegracefulTime"><code>queryNode.gracefulTime</code></a></li>
            <li><a href="configure_rootcoord.md#rootCoordminSegmentSizeToEnableIndex"><code>rootCoord.minSegmentSizeToEnableIndex</code></a></li>
            <li><a href="configure_datacoord.md#dataCoordsegmentmaxSize"><code>dataCoord.segment.maxSize</code></a></li>
            <li><a href="configure_datacoord.md#dataCoordsegmentsealProportion"><code>dataCoord.segment.sealProportion</code></a></li>
            <li><a href="configure_datanode.md#dataNodeflushinsertBufSize"><code>dataNode.flush.insertBufSize</code></a></li>
            <li><a href="configure_querycoord.md#queryCoordauto