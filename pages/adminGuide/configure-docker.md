---
title: 使用Docker Compose配置Milvus
---

# 使用Docker Compose配置Milvus

本主题描述了如何使用Docker Compose配置Milvus组件及其第三方依赖。

<div class="alert note">
在当前版本中，所有参数仅在Milvus重启后生效。
</div>

## 下载配置文件

直接下载`milvus.yaml`，或者使用以下命令。

```
$ wget https://raw.githubusercontent.com/milvus-io/milvus/v{{var.milvus_release_tag}}/configs/milvus.yaml
```

## 修改配置文件

通过调整`milvus.yaml`中的相应参数，配置您的Milvus实例以适应您的应用场景。

有关每个参数的更多信息，请查看以下链接。

按以下分类排序：

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
            <li><a href="configure_querycoord.md#queryCoordautoHandoff"><code>queryCoord.autoHandoff</code></a></li>
            <li><a href="configure_querycoord.md#queryCoordautoBalance"><code>queryCoord.autoBalance</code></a></li>
            <li><a href="configure_localstorage.md#localStorageenabled"><code>localStorage.enabled</code></a></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>数据和元数据</td>
    <td>
        <ul>
            <li><a href="configure_common.md#commonretentionDuration"><code>common.retentionDuration</code></a></li>
            <li><a href="configure_rocksmq.md#rocksmqretentionTimeInMinutes"><code>rocksmq.retentionTimeInMinutes