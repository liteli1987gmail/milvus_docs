


# Pulsar 相关配置

本主题介绍了 Milvus 的 Pulsar 相关配置。

Pulsar 是支持 Milvus 集群可靠存储和消息流发布/订阅的底层引擎。

在这个部分中，你可以配置 Pulsar 的地址、消息大小等。

<div class="alert note">
<li> 要在多个 Milvus 实例之间共享启用了多租户的 Pulsar 实例，需要为每个 Milvus 实例的 <code> pulsar.tenant </code> 或 <code> pulsar.namespace </code> 更改为唯一值。</li>
<li> 要在多个 Milvus 实例之间共享禁用了多租户的 Pulsar 实例，需要为每个 Milvus 实例的 <code> msgChannel.chanNamePrefix.cluster </code> 更改为唯一值。</li>
详情请参考 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances"> Operation FAQs </a>。
</div>


## `pulsar.address`

<table id="pulsar.address">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Pulsar 服务的 IP 地址。</li>
        <li> 环境变量：<code> PULSAR_ADDRESS </code> </li>
        <li> <code> pulsar.address </code> 和 <code> pulsar.port </code> 共同生成对 Pulsar 的有效访问。</li>
        <li> 当启动 Milvus 时，Pulsar 优先从环境变量 <code> PULSAR_ADDRESS </code> 获取有效的 IP 地址。</li>
        <li> 当 Pulsar 与 Milvus 在同一网络上运行时，使用默认值。</li>
      </td>
      <td> localhost </td>
    </tr>
  </tbody>
</table>


## `pulsar.port`

<table id="pulsar.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Pulsar 服务的端口。</li>
        <li> 环境变量：<code> PULSAR_ADDRESS </code> </li>
        <li> <code> pulsar.address </code> 和 <code> pulsar.port </code> 共同生成对 Pulsar 的有效访问。</li>
        <li> 当启动 Milvus 时，Pulsar 优先从环境变量 <code> PULSAR_ADDRESS </code> 获取有效的端口。</li>
      </td>
      <td> 6650 </td>
    </tr>
  </tbody>
</table>

## `pulsar.webport`

<table id="pulsar.webport">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Pulsar 服务的 Web 端口。</li>
        <li> 如果你直接连接而不使用代理，应该使用 8080 </li>
      </td>
      <td> 80 </td>
    </tr>
  </tbody>
</table>

## `pulsar.maxMessageSize`
 



| 标题          | 内容                                                      |
| ------------- | --------------------------------------------------------- |
| `pulsar.maxMessageSize` |                                             |
|               | - Pulsar 中每个消息的最大大小。                                |
|               | - 单位：字节。                                                 |
|               | - 默认情况下，Pulsar 可以在单个消息中传输最多 5MB 的数据。当插入的数据大小大于此值时，代理将数据分成多个消息，以确保它们可以正确传输。 |
|               | - 如果 Pulsar 中的相应参数保持不变，则增加此配置将导致 Milvus 失败，减小此配置不会产生任何优势。                            |
|               |                                                             |
| `pulsar.tenant`        |                                                             |
|               | - 可为特定租户分配适当的容量进行 Pulsar 设置。                            |
|               | - 要在多个 Milvus 实例之间共享一个 Pulsar 实例，你可以在启动它们之前将此值更改为 Pulsar 租户而不是每个 Milvus 实例的默认值。但是，如果你不想使用 Pulsar 的多租户功能，建议你将 `msgChannel.chanNamePrefix.cluster` 更改为不同的值。详细信息请参见 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances"> 操作 FAQ </a>。 |
|               |                                                             |
| `pulsar.namespace`    |                                                             |



## 


<table id="pulsar.namespace">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 一个 Pulsar 命名空间是在租户内的管理单元命名法。</li>
        <li> 为了在多个 Milvus 实例之间共享 Pulsar 实例，你可以在启动它们之前将其更改为 Pulsar 租户，而不是每个 Milvus 实例的默认租户。但是，如果你不想使用 Pulsar 的多租户功能，建议你将 <code> msgChannel.chanNamePrefix.cluster </code> 更改为不同的值。详细信息请参见 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances"> 操作常见问题 </a>。</li>
      </td>
      <td> 默认值 </td>
    </tr>
  </tbody>
</table>

