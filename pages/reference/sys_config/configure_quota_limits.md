# 配额和限制相关配置

本主题介绍了 Milvus 中与配额和限制相关的配置项。

其中一些配置项用于设置阈值，使 Milvus 能够主动限制与集合、分区、索引等有关的 DDL/DML/DQL 请求。

另一些则用于设置反压信号，迫使 Milvus 降低 DDL/DML/DQL 请求的速率。

## `quotaAndLimits.limits.maxCollectionNumPerDB`

<table id="quotaAndLimits.ddl.enabled">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>每个数据库的集合最大数量。</td>
      <td>64</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.enabled`

<table id="quotaAndLimits.ddl.enabled">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>是否启用 DDL 请求限制。</td>
      <td>False</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.collectionRate`

<table id="quotaAndLimits.ddl.collectionRate">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>每秒与集合相关的 DDL 请求的最大数量。</li>
        <li>将此项目设置为 <code>10</code> 表示 Milvus 每秒处理不超过 10 个与集合相关的 DDL 请求，包括集合创建请求、集合删除请求、集合加载请求和集合释放请求。</li>
        <li>要使用此设置，同时将 <code>quotaAndLimits.ddl.enabled</code> 设置为 <code>true</code>。</li>
      </td>
      <td>∞</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.ddl.partitionRate`

<table id="quotaAndLimits.ddl.partitionRate">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>每秒与分区相关的 DDL 请求的最大数量。</li>
        <li>将此项目设置为 <code>10</code> 表示 Milvus 每秒处理不超过 10 个与分区相关的请求，包括分区创建请求、分区删除请求、分区加载请求和分区释放请求。</li>
        <li>要使用此设置，同时将 <code>quotaAndLimits.ddl.enabled</code> 设置为 <code>true</code>。</li>
      </td>
      <td>∞</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.indexRate.enabled`

<table id="quotaAndLimits.indexRate.enabled">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>是否启用与索引相关的请求限制。</td>
      <td>False</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.indexRate.max`

<table id="quotaAndLimits.indexRate.max">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>每秒与索引相关的请求的最大数量。</li>
        <li>将此项目设置为 <code>10</code> 表示 Milvus 每秒处理不超过 10 个与索引相关的请求，包括索引创建请求和索引删除请求。</li>
        <li>要使用此设置，同时将 <code>quotaAndLimits.indexRate.enabled</code> 设置为 <code>true</code>。</li>
      </td>
      <td>∞</td>
    </tr>
  </tbody>
</table>

## `quotaAndLimits.flushRate.enabled`

<table id="quotaAndLimits.flushRate.enabled">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  