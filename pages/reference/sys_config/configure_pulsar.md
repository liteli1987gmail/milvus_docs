# Pulsar 相关配置

本文介绍 Milvus 集群的 Pulsar 相关配置。

Pulsar 是支持 Milvus 集群可靠存储和消息流发布/订阅的底层引擎。

在本节中，您可以配置 Pulsar 地址、消息大小等。

<div class="alert note">
<li>要在多个 Milvus 实例之间启用多租户并共享 Pulsar 实例，您需要为每个 Milvus 实例更改 <code>pulsar.tenant</code> 或 <code>pulsar.namespace</code> 为唯一值。 </li>
<li>要在多个 Milvus 实例之间禁用多租户并共享 Pulsar 实例，您需要为每个 Milvus 实例更改 <code>msgChannel.chanNamePrefix.cluster</code> 为唯一值。</li>
详情请参考 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。
</div>


## `pulsar.address`

<table id="pulsar.address">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Pulsar 服务的 IP 地址。</li>
        <li>环境变量： <code>PULSAR_ADDRESS</code></li>
        <li><code>pulsar.address</code> 和 <code>pulsar.port</code> 一起生成 Pulsar 的有效访问路径。</li>
        <li>当 Milvus 启动时，Pulsar 优先从环境变量 <code>PULSAR_ADDRESS</code> 获取有效的 IP 地址。</li>
        <li>当 Pulsar 与 Milvus 在同一网络下运行时，应用默认值。</li>
      </td>
      <td>localhost</td>
    </tr>
  </tbody>
</table>


## `pulsar.port`

<table id="pulsar.port">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Pulsar 服务的端口。</li>
        <li>环境变量： <code>PULSAR_ADDRESS</code></li>
        <li><code>pulsar.address</code> 和 <code>pulsar.port</code> 一起生成 Pulsar 的有效访问路径。</li>
        <li>当 Milvus 启动时，Pulsar 优先从环境变量 <code>PULSAR_ADDRESS</code> 获取有效的端口。</li>
      </td>
      <td>6650</td>
    </tr>
  </tbody>
</table>

## `pulsar.webport`

<table id="pulsar.webport">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Pulsar 服务的 Web 端口。 </li>
        <li>如果直接连接而不使用代理，应使用 8080</li>
      </td>
      <td>80</td>
    </tr>
  </tbody>
</table>

## `pulsar.maxMessageSize`

<table id="pulsar.maxMessageSize">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Pulsar 中每条消息的最大大小。</li>
        <li>单位：字节</li>
        <li>默认情况下，Pulsar 可以在单条消息中传输最多 5 MB 的数据。当插入的数据大小超过此值时，代理会将数据分割成多条消息以确保它们可以正确传输。</li>
        <li>如果 Pulsar 中的相应参数保持不变，增加此配置将导致 Milvus 失败，而减少它则没有优势。</li>
      </td>
      <td>5242880</td>
    </tr>
  </tbody>
</table>

## `pulsar.tenant`

<table id="pulsar.tenant">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr