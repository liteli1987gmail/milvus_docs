

# 常见配置

本主题介绍了 Milvus 的常见配置。

在本节中，你可以配置分区和索引的默认名称，以及 Milvus 的时间旅行（数据保留）跨度。

## `common.defaultPartitionName`

<table id="common.defaultPartitionName">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 创建集合时的默认分区名称。</td>
      <td> "_default " </td>
    </tr>
  </tbody>
</table>

## `common.defaultIndexName`

<table id="common.defaultPartitionName">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> 未指定名称时创建的索引的名称。</td>
      <td> "_default_idx " </td>
    </tr>
  </tbody>
</table>

## `common.retentionDuration`

<table id="common.retentionDuration">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 允许进行时间旅行的已删除数据的保留时长。</li>
        <li> 单位：秒 </li>
      </td>
      <td> 432000 </td>
    </tr>
  </tbody>
</table>

## `common.ttMsgEnabled`




| 描述                                                                                 | 默认值    |
| ---------------------------------------------------------------------------------- | --------- |
| 是否禁用系统的内部时间消息机制。如果禁用（设置为 `false`），系统将不允许执行数据管理操作（DML），包括插入、删除、查询和搜索。这有助于 Milvus-CDC 同步增量数据。 | false |