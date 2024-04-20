# etcd 相关配置

本主题介绍了 Milvus 的 etcd 相关配置。etcd 是支持 Milvus 元数据存储和访问的元数据引擎。

在本节中，您可以配置 etcd 端点、相关的关键前缀等。

<div class="alert note">
要在多个 Milvus 实例之间共享 etcd 实例，您需要为每个 Milvus 实例更改 <code>etcd.rootPath</code> 为唯一值。有关详细信息，请参考 <a href="operational_faq.md#Can-I-share-an-etcd-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。
</div>

## `etcd.endpoints`

<table id="etcd.endpoints">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>用于访问 etcd 服务的端点。您可以将此参数更改为您自己的 etcd 集群的端点。</li>
        <li>环境变量： <code>ETCD_ENDPOINTS</code></li>
        <li>当启动 Milvus 时，etcd 优先从环境变量 <code>ETCD_ENDPOINTS</code> 获取有效地址。</li>
      </td>
      <td>localhost:2379</td>
    </tr>
  </tbody>
</table>


## `etcd.rootPath`

<table id="etcd.rootPath">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Milvus 在 etcd 中存储数据的键的根前缀。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
        <li>要在多个 Milvus 实例之间共享 etcd 实例，考虑在启动它们之前将此更改为每个 Milvus 实例的不同值。有关详细信息，请参见 <a href="operational_faq.md#Can-I-share-an-etcd-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。</li>
        <li>如果 etcd 服务已经存在，请为 Milvus 设置一个容易识别的根路径。</li>
        <li>更改此参数可能会导致已运行的 Milvus 实例无法读取旧数据。</li>
      </td>
      <td>by-dev</td>
    </tr>
  </tbody>
</table>

## `etcd.metaSubPath`

<table id="etcd.metaSubPath">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Milvus 在 etcd 中存储与元数据相关信息的键的子前缀。</li>
        <li>警告：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td>meta</td>
    </tr>
  </tbody>
</table>


## `etcd.kvSubPath`

<table id="etcd.kvSubPath">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Milvus 在 etcd 中存储时间戳的键的子前缀。</li>
        <li>警告：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>如果没有特定原因，建议不要更改此参数。</li>
      </td>
      <td>kv</td>
    </tr>
  </tbody>
</table>