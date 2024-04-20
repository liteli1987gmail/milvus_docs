# MinIO 相关配置

本文介绍 Milvus 中与 MinIO 相关的配置。

Milvus 支持使用 MinIO 和 Amazon S3 作为存储引擎，以持久化存储插入日志文件和索引文件。虽然 MinIO 是 S3 兼容性的事实标准，但您可以直接在 MinIO 部分下配置 S3 参数。

在本节中，您可以配置 MinIO 或 S3 地址、相关访问密钥等。

<div class="alert note">
要在多个 Milvus 实例之间共享 MinIO 实例，您需要为每个 Milvus 实例更改 <code>minio.bucketName</code> 或 <code>minio.rootPath</code> 为唯一值。有关详细信息，请参考 <a href="operational_faq.md#Can-I-share-a-MinIO-instance-among-multiple-Milvus-instances">操作常见问题解答</a>。
</div>

## `minio.address`

<table id="minio.address">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>MinIO 或 S3 服务的 IP 地址。</li>
        <li>环境变量： <code>MINIO_ADDRESS</code></li>
        <li><code>minio.address</code> 和 <code>minio.port</code> 共同生成对 MinIO 或 S3 服务的有效访问。</li>
        <li>当 Milvus 启动时，MinIO 优先从环境变量 <code>MINIO_ADDRESS</code> 获取有效的 IP 地址。</li>
        <li>当 MinIO 或 S3 与 Milvus 在同一网络中运行时，使用默认值。</li>
        <li>Milvus 2.0 不支持安全访问 MinIO 或 S3 服务。未来的版本将支持安全访问 MinIO。</li>
      </td>
      <td>localhost</td>
    </tr>
  </tbody>
</table>


## `minio.port`

<table id="minio.port">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>MinIO 或 S3 服务的端口。</li>
        <li>环境变量： <code>MINIO_ADDRESS</code></li>
        <li><code>minio.address</code> 和 <code>minio.port</code> 共同生成对 MinIO 或 S3 服务的有效访问。</li>
        <li>当 Milvus 启动时，MinIO 优先从环境变量 <code>MINIO_ADDRESS</code> 获取有效的端口。</li>
      </td>
      <td>9000</td>
    </tr>
  </tbody>
</table>

## `minio.accessKeyID`

<table id="minio.accessKeyID">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>MinIO 或 S3 颁发给用户用于授权访问的访问密钥 ID。</li>
        <li>环境变量： <code>MINIO_ACCESS_KEY_ID</code> 或 <code>minio.accessKeyID</code></li>
        <li><code>minio.accessKeyID</code> 和 <code>minio.secretAccessKey</code> 共同用于身份验证，以访问 MinIO 或 S3 服务。</li>
        <li>此配置必须与环境变量 <code>MINIO_ACCESS_KEY_ID</code> 设置相同，这是启动 MinIO 或 S3 所必需的。</li>
        <li>默认值适用于使用默认 <b>docker-compose.yml</b> 文件启动的 MinIO 或 S3 服务。</li>
      </td>
      <td>minioadmin</td>
    </tr>
  </tbody>
</table>


## `minio.secretAccessKey`

<table id="minio.secretAccessKey">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>用于加密签名字符串并验证服务器上的签名字符串的秘密密钥。它必须严格保密，只能由 MinIO 或 S3 服务器和用户访问。</li>
        <li>环境变量： <code>MINIO_SECRET_ACCESS_KEY</code> 或 <code>