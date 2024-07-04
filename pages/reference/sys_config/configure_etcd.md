


                # etcd 相关配置

                本主题介绍了 Milvus 的 etcd 相关配置。etcd 是支持 Milvus 元数据存储和访问的元数据引擎。

                在本节中，你可以配置 etcd 的终端点、相关键前缀等。

                <div class="alert note">
                要在多个 Milvus 实例之间共享 etcd 实例，你需要为每个 Milvus 实例更改 `etcd.rootPath` 的值以使其唯一。有关详细信息，请参见 [操作常见问题](operational_faq.md#Can-I-share-an-etcd-instance-among-multiple-Milvus-instances)。
                </div>

                ## `etcd.endpoints`

                <table id="etcd.endpoints">
                <thead>
                <tr>
                <th class="width80"> 描述 </th>
                <th class="width20"> 默认值 </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>
                <li> 用于访问 etcd 服务的终端点。你可以将此参数更改为你自己 etcd 集群的终端点。</li>
                <li> 环境变量：<code> ETCD_ENDPOINTS </code> </li>
                <li> Milvus 启动时，etcd 优先从环境变量 <code> ETCD_ENDPOINTS </code> 中获取有效的地址。</li>
                </td>
                <td> localhost: 2379 </td>
                </tr>
                </tbody>
                </table>


                ## `etcd.rootPath`

                <table id="etcd.rootPath">
                <thead>
                <tr>
                <th class="width80"> 描述 </th>
                <th class="width20"> 默认值 </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>
                <li> Milvus 将数据存储在 etcd 中的键的根前缀。</li>
                <li> 建议在首次启动 Milvus 之前更改此参数。</li>
                <li> 要在多个 Milvus 实例之间共享 etcd 实例，请在启动实例之前为每个实例更改此值。有关详细信息，请参见 [操作常见问题](operational_faq.md#Can-I-share-an-etcd-instance-among-multiple-Milvus-instances)。</li>
                <li> 如果 etcd 服务已存在，请设置一个易于识别的 Milvus 根路径。</li>
                <li> 在运行中的 Milvus 实例上更改此值可能导致无法读取旧数据。</li>
                </td>
                <td> by-dev </td>
                </tr>
                </tbody>
                </table>

                ## `etcd.metaSubPath`

                <table id="etcd.metaSubPath">
                <thead>
                <tr>
                <th class="width80"> 描述 </th>
                <th class="width20"> 默认值 </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>
                <li> Milvus 将元数据相关信息存储在 etcd 中的键的子前缀。</li>
                <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你对旧数据的访问。</li>
                <li> 建议在首次启动 Milvus 之前更改此参数。</li>
                </td>
                <td> meta </td>
                </tr>
                </tbody>
                </table>

                ## `etcd.kvSubPath`
 


<table id="etcd.kvSubPath">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 在 etcd 中存储 Milvus 时间戳的键的子前缀。</li>
        <li> 注意：在使用 Milvus 一段时间后更改此参数将影响你访问旧数据。</li>
        <li> 如果没有特殊原因，建议不要更改此参数。</li>
      </td>
      <td> kv </td>
    </tr>
  </tbody>
</table>

