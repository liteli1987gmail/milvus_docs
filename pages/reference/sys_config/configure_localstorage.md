# 本地存储相关配置

本主题介绍了 Milvus 的本地存储相关配置。

Milvus 在搜索或查询期间将向量数据存储在本地存储中，以避免重复访问 MinIO 或 S3 服务。

在本节中，您可以启用本地存储，并配置路径等。

## `localStorage.path`

<table id="localStorage.path">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>在搜索或查询期间存储向量数据的本地路径，以避免重复访问 MinIO 或 S3 服务。</li>
        <li>注意：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
        <li>此配置仅在将 <code>localStorage.enabled</code> 设置为 <code>true</code> 时生效。</li>
      </td>
      <td>/var/lib/milvus/data</td>
    </tr>
  </tbody>
</table>

## `localStorage.enabled`

<table id="localStorage.enabled">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        控制是否启用向量数据的本地存储以避免重复访问 MinIO 或 S3 服务的开关值。
      </td>
      <td>true</td>
    </tr>
  </tbody>
</table>