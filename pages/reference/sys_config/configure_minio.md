


# MinIO 相关配置

本主题介绍 Milvus 的 MinIO 相关配置。

Milvus 支持 MinIO 和 Amazon S3 作为用于持久化插入日志文件和索引文件的存储引擎。而 MinIO 是 S3 兼容性的事实标准，你可以在 MinIO 部分直接配置 S3 参数。

在本节中，你可以配置 MinIO 或 S3 地址、相关访问密钥等。

<div class="alert note">
要在多个 Milvus 实例之间共享一个 MinIO 实例，你需要将 <code> minio.bucketName </code> 或 <code> minio.rootPath </code> 更改为每个 Milvus 实例的唯一值。有关详细信息，请参见 <a href="operational_faq.md#Can-I-share-a-MinIO-instance-among-multiple-Milvus-instances"> 操作常见问题 </a>。
</div>

## `minio.address`

<table id="minio.address">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> MinIO 或 S3 服务的 IP 地址。</li>
        <li> 环境变量：<code> MINIO_ADDRESS </code> </li>
        <li> <code> minio.address </code> 和 <code> minio.port </code> 一起生成对 MinIO 或 S3 服务的有效访问。</li>
        <li> 当启动 Milvus 时，MinIO 优先从环境变量 <code> MINIO_ADDRESS </code> 中获取有效的 IP 地址。</li>
        <li> 当 MinIO 或 S3 与 Milvus 在相同的网络上运行时，默认值适用。</li>
        <li> Milvus 2.0 不支持对 MinIO 或 S3 服务进行安全访问。未来的版本将支持对 MinIO 的安全访问。</li>
      </td>
      <td> localhost </td>
    </tr>
  </tbody>
</table>


## `minio.port`

<table id="minio.port">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> MinIO 或 S3 服务的端口。</li>
        <li> 环境变量：<code> MINIO_ADDRESS </code> </li>
        <li> <code> minio.address </code> 和 <code> minio.port </code> 一起生成对 MinIO 或 S3 服务的有效访问。</li>
        <li> 当启动 Milvus 时，MinIO 优先从环境变量 <code> MINIO_ADDRESS </code> 中获取有效的端口。</li>
      </td>
      <td> 9000 </td>
    </tr>
  </tbody>
</table>

## `minio.accessKeyID`

<table id="minio.accessKeyID">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> MinIO 或 S3 授予用户进行授权访问的访问密钥 ID。</li>
        <li> 环境变量：<code> MINIO_ACCESS_KEY_ID </code> 或 <code> minio.accessKeyID </code> </li>
        <li> <code> minio.accessKeyID </code> 和 <code> minio.secretAccessKey </code> 一起用于身份验证以访问 MinIO 或 S3 服务。</li>
        <li> 此配置必须与环境变量 <code> MINIO_ACCESS_KEY_ID </code> 设置为相同，这对于启动 MinIO 或 S3 是必要的。</li>
        <li> 默认值适用于使用默认的 <b> docker-compose.yml </b> 文件启动的 MinIO 或 S3 服务。</li>
      </td>
      <td> minioadmin </td>
    </tr>
  </tbody>
</table>

## `minio.secretAccessKey`
 


# 


<table id="minio.secretAccessKey">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 用于加密签名字符串并在服务器上验证签名字符串的秘钥。必须严格保密，仅供 MinIO 或 S3 服务器和用户访问。</li>
        <li> 环境变量: <code> MINIO_SECRET_ACCESS_KEY </code> 或 <code> minio.secretAccessKey </code> </li>
        <li> <code> minio.accessKeyID </code> 和 <code> minio.secretAccessKey </code> 一起用于身份认证以访问 MinIO 或 S3 服务。</li>
        <li> 此配置必须与环境变量 <code> MINIO_SECRET_ACCESS_KEY </code> 设置为相同，这对于启动 MinIO 或 S3 是必要的。</li>
        <li> 默认值适用于使用默认的 <b> docker-compose.yml </b> 文件启动的 MinIO 或 S3 服务。</li>
      </td>
      <td> minioadmin </td>
    </tr>
  </tbody>
</table>

## `minio.useSSL`

<table id="minio.useSSL">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 控制是否通过 SSL 访问 MinIO 或 S3 服务的开关值。</li>
      </td>
      <td> false </td>
    </tr>
  </tbody>
</table>


## `minio.bucketName`

<table id="minio.bucketName">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Milvus 在 MinIO 或 S3 中存储数据的 bucket 的名称。</li>
        <li> Milvus 2.0.0 不支持在多个 bucket 中存储数据。</li>
        <li> 如果 bucket 不存在, 将创建此名称的 bucket。如果 bucket 已经存在且可访问，则直接使用该 bucket。否则会报错。</li>
        <li> 要在多个 Milvus 实例之间共享 MinIO 实例，请在启动它们之前将此值更改为每个 Milvus 实例的不同值。详情请参阅 <a href="operational_faq.md#Can-I-share-a-MinIO-instance-among-multiple-Milvus-instances"> 操作常见问题 </a>。</li>
        <li> 如果使用 Docker 在本地启动 MinIO 服务，则数据将存储在本地的 Docker 中。确保有足够的存储空间。</li>
        <li> 一个 bucket 名称在一个 MinIO 或 S3 实例中是全局唯一的。</li>
      </td>
      <td> "a-bucket" </td>
    </tr>
  </tbody>
</table>


## `minio.rootPath`



#### 


<table id="minio.rootPath">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 存储 Milvus 在 MinIO 或 S3 中数据的根前缀。</li>
        <li> 推荐在第一次启动 Milvus 之前更改此参数。</li>
        <li> 要在多个 Milvus 实例之间共享 MinIO 实例，请考虑在启动之前为每个 Milvus 实例更改为不同的值。详细信息请参见 <a href="operational_faq.md#Can-I-share-a-MinIO-instance-among-multiple-Milvus-instances"> 操作常见问题 </a>。</li>
        <li> 如果已经存在 etcd 服务，请为 Milvus 设置一个易于识别的根密钥前缀。</li>
        <li> 更改已运行的 Milvus 实例的此参数可能导致读取旧数据失败。</li>
      </td>
      <td> files </td>
    </tr>
  </tbody>
</table>


