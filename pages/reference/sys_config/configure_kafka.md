# Kafka相关配置

本主题介绍了Milvus集群的Kafka相关配置。

Kafka是支持Milvus集群可靠存储和消息流发布/订阅的底层引擎。

在本节中，您可以配置Kafka生产者、消费者、SASL信息等。

## `kafka.producer.client.id`

<table id="kafka.producer.client.id">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Kafka服务的生产者客户端ID。</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.consumer.client.id`

<table id="kafka.consumer.client.id">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Kafka服务的消费者客户端ID。</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.brokerList`

<table id="kafka.brokerList">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Kafka服务的代理地址列表。</li>
        <li>每个值用逗号分隔</li>
        <li>例如：localhost1:9092,localhost2:9092,localhost3:9092</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.saslUsername`

<table id="kafka.saslUsername">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>如果启用了<code>简单认证和安全层</code>，则为Kafka服务的用户名。</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.saslPassword`

<table id="kafka.saslPassword">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>如果启用了<code>简单认证和安全层</code>，则为Kafka服务的密码。</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.saslMechanisms`

<table id="kafka.saslMechanisms">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>如果启用了<code>简单认证和安全层</code>，则为Kafka服务的机制。</li>
        <li>有效值可能是：GSSAPI, PLAIN, SCRAM, OAUTHBEARER。</li>
      </td>
    </tr>
  </tbody>
</table>

## `kafka.securityProtocol`

<table id="kafka.securityProtocol">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>Kafka服务的安全协议。</li>
        <li>有效值可能是：PLAINTEXT, SSL, SASL_PLAINTEXT, SASL_SSL。</li>
      </td>
    </tr>
  </tbody>
</table>