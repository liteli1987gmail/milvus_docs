# 消息通道相关配置

本主题介绍了 Milvus 的消息通道相关配置。

在本节中，您可以配置消息通道名称前缀和组件订阅名称前缀。

<div class="alert note">
<li>要在多个 Milvus 实例之间共享启用了多租户的 Pulsar 实例，您需要将 <code>pulsar.tenant</code> 或 <code>pulsar.namespace</code> 更改为每个 Milvus 实例的唯一值。</li>
<li>要在多个 Milvus 实例之间共享未启用多租户的 Pulsar 实例，您需要将 <code>msgChannel.chanNamePrefix.cluster</code> 更改为每个 Milvus 实例的唯一值。</li>
详情请参考 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。
</div>

## `msgChannel.chanNamePrefix.cluster`

<table id="msgChannel.chanNamePrefix.cluster">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>创建消息通道时的根名称前缀。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
        <li>要在多个 Milvus 实例之间共享 Pulsar 实例，请考虑在启动它们之前将此值更改为每个 Milvus 实例的名称，而不是默认名称。详情请参见 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。</li>
      </td>
      <td>"by-dev"</td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordTimeTick`

<table id="msgChannel.chanNamePrefix.rootCoordTimeTick">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>根协调器发布时间戳消息的消息通道的子名称前缀。</li>
        <li>完整的通道名称前缀是 <code>${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordTimeTick}</code></li>
        <li>警告：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td>"rootcoord-timetick"</td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordStatistics`

<table id="msgChannel.chanNamePrefix.rootCoordStatistics">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>根协调器发布其自身统计消息的消息通道的子名称前缀。</li>
        <li>完整的通道名称前缀是 <code>${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordStatistics}</code></li>
        <li>警告：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td>"rootcoord-statistics"</td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordDml`

<table id="msgChannel.chanNamePrefix.rootCoordDml">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>根协调器发布数据操作语言（DML）消息的消息通道的子名称前缀。</li>
        <li>完整的通道名称前缀是 <code>${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordDml}</code></li>
        <li>警告：在一段时间使用 Milvus 后更改此参数将影响您对旧数据的访问。</li>
        <li>建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td>"rootcoord-dml"</td>
    </tr>
