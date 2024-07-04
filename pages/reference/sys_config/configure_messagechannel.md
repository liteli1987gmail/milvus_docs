


# 消息通道相关配置

本主题介绍了 Milvus 的消息通道相关配置。

在该部分下，你可以配置消息通道名称的前缀和组件订阅名称的前缀。

<div class="alert note">
<li> 要在多个 Milvus 实例之间共享启用了多租户的 Pulsar 实例，你需要为每个 Milvus 实例更改 <code> pulsar.tenant </code> 或 <code> pulsar.namespace </code> 为唯一值。</li>
<li> 要在多个 Milvus 实例之间共享禁用了多租户的 Pulsar 实例，你需要为每个 Milvus 实例更改 <code> msgChannel.chanNamePrefix.cluster </code> 为唯一值。</li>
详情请参阅 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances"> 操作常见问题解答 </a>。
</div>

## `msgChannel.chanNamePrefix.cluster`

<table id="msgChannel.chanNamePrefix.cluster">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 创建消息通道时的根名称前缀。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
        <li> 要在多个 Milvus 实例之间共享 Pulsar 实例，请考虑在启动之前将其更改为每个 Milvus 实例的唯一名称，而不是默认名称。详情请参阅 <a href="operational_faq.md#Can-I-share-a-Pulsar-instance-among-multiple-Milvus-instances"> 操作常见问题解答 </a>。</li>
      </td>
      <td> "by-dev" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordTimeTick`

<table id="msgChannel.chanNamePrefix.rootCoordTimeTick">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器发布时间滴答消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordTimeTick}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数会影响你访问旧数据。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "rootcoord-timetick" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordStatistics`

<table id="msgChannel.chanNamePrefix.rootCoordStatistics">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器发布自己的统计消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordStatistics}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数会影响你访问旧数据。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "rootcoord-statistics" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordDml`




<table id="msgChannel.chanNamePrefix.rootCoordDml">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器发布数据操作语言（DML）消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordDml}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "rootcoord-dml" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.rootCoordDelta`

<table id="msgChannel.chanNamePrefix.rootCoordDelta">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 根协调器在已封存段中发布数据删除消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.rootCoordDelta}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "rootcoord-delta" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.search`

<table id="msgChannel.chanNamePrefix.search">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 代理发布搜索消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.search}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "search" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.searchResult`

<table id="msgChannel.chanNamePrefix.searchResult">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询节点发布搜索结果消息的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.searchResult}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "searchResult" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.proxyTimeTick`






        <table id="msgChannel.chanNamePrefix.proxyTimeTick">
          <thead>
            <tr>
              <th class="width80"> 描述 </th>
              <th class="width20"> 默认值 </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <li> 代理发布时间标记消息的消息通道的子名称前缀。</li>
                <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.proxyTimeTick}</code> </li>
                <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
                <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
              </td>
              <td> "proxyTimeTick" </td>
            </tr>
          </tbody>
        </table>

        ## `msgChannel.chanNamePrefix.queryTimeTick`

        <table id="msgChannel.chanNamePrefix.queryTimeTick">
          <thead>
            <tr>
              <th class="width80"> 描述 </th>
              <th class="width20"> 默认值 </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <li> 查询节点发布时间标记消息的消息通道的子名称前缀。</li>
                <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.queryTimeTick}</code> </li>
                <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
                <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
              </td>
              <td> "queryTimeTick" </td>
            </tr>
          </tbody>
        </table>

        ## `msgChannel.chanNamePrefix.queryNodeStats`

        <table id="msgChannel.chanNamePrefix.queryNodeStats">
          <thead>
            <tr>
              <th class="width80"> 描述 </th>
              <th class="width20"> 默认值 </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <li> 查询节点发布自己统计信息的消息通道的子名称前缀。</li>
                <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.queryNodeStats}</code> </li>
                <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
                <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
              </td>
              <td> "query-node-stats" </td>
            </tr>
          </tbody>
        </table>

        ## `msgChannel.chanNamePrefix.dataCoordInsertChannel`

        <table id="msgChannel.chanNamePrefix.dataCoordInsertChannel">
          <thead>
            <tr>
              <th class="width80"> 描述 </th>
              <th class="width20"> 默认值 </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <li> 数据协调发布数据插入消息的消息通道的子名称前缀。</li>
                <li> 完整的通道名称前缀为 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.dataCoordInsertChannel}</code> </li>
                <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
                <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
              </td>
              <td> "insert-channel-" </td>
            </tr>
          </tbody>
        </table>

        ## `msgChannel.chanNamePrefix.dataCoordStatistic`


<table id="msgChannel.chanNamePrefix.dataCoordStatistic">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器发布自己统计数据的消息通道的子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.dataCoordStatistic}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将会影响对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 前更改此参数。</li>
      </td>
      <td> "datacoord-statistics-channel" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.dataCoordTimeTick`

<table id="msgChannel.chanNamePrefix.dataCoordTimeTick">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器发布时间刻度消息的消息通道子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.dataCoordTimeTick}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将会影响对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 前更改此参数。</li>
      </td>
      <td> "datacoord-timetick-channel" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.chanNamePrefix.dataCoordSegmentInfo`

<table id="msgChannel.chanNamePrefix.dataCoordSegmentInfo">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据协调器发布段信息消息的消息通道子名称前缀。</li>
        <li> 完整的通道名称前缀是 <code> ${msgChannel.chanNamePrefix.cluster}-${msgChannel.chanNamePrefix.dataCoordSegmentInfo}</code> </li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将会影响对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 前更改此参数。</li>
      </td>
      <td> "segment-info-channel" </td>
    </tr>
  </tbody>
</table>


## `msgChannel.subNamePrefix.rootCoordSubNamePrefix`

<table id="msgChannel.subNamePrefix.rootCoordSubNamePrefix">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Root 协调器的订阅名称前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将会影响对旧数据的访问。</li>
        <li> 建议在首次启动 Milvus 前更改此参数。</li>
      </td>
      <td> "rootCoord" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.subNamePrefix.proxySubNamePrefix`



<table id="msgChannel.subNamePrefix.proxySubNamePrefix">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 代理的订阅名称前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改该参数会影响你访问旧数据。</li>
        <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "proxy" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.subNamePrefix.queryNodeSubNamePrefix`

<table id="msgChannel.subNamePrefix.queryNodeSubNamePrefix">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 查询节点的订阅名称前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改该参数会影响你访问旧数据。</li>
        <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "queryNode" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.subNamePrefix.dataNodeSubNamePrefix`

<table id="msgChannel.subNamePrefix.dataNodeSubNamePrefix">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 数据节点的订阅名称前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改该参数会影响你访问旧数据。</li>
        <li> 建议在第一次启动 Milvus 之前更改此参数。</li>
      </td>
      <td> "dataNode" </td>
    </tr>
  </tbody>
</table>

## `msgChannel.subNamePrefix.dataCoordSubNamePrefix`
 






---

| Description                                 | Default Value |
|---------------------------------------------|---------------|
| <li> 数据协调者订阅名称前缀。</li>                 | "dataCoord"   |
| <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>                             |
| <li> 建议在第一次启动 Milvus 之前更改此参数。</li>   |               |

 