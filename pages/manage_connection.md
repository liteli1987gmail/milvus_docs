管理Milvus连接
==========

本主题介绍了如何连接和断开Milvus服务器。

 Ensure to connect to a Milvus server before any operations.

Milvus支持两个端口，端口`19530`和端口`9091`：

* 端口`19530`是用于gRPC的。当您使用不同的Milvus SDK连接到Milvus服务器时，它是默认端口。

* 端口`9091`是用于RESTful API的。当您使用HTTP客户端连接到Milvus服务器时，它被使用。

以下示例连接到主机为`localhost`，端口为`19530`或`9091`的Milvus服务器，并断开连接。如果连接被拒绝，请尝试取消对应端口的阻止。

连接到Milvus服务器
------------

构建Milvus连接。在进行任何操作之前，请确保连接到Milvus服务器。

[Python](#python)
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
# Run `python3` in your terminal to operate in the Python interactive mode.
from pymilvus import connections
connections.connect(
  alias="default",
  user='username',
  password='password',
  host='localhost',
  port='19530'
)

```

```python
import { MilvusClient } from "@zilliz/milvus2-sdk-node";
const address = "localhost:19530";
const username = "username";
const password = "password";
const ssl = false;
const milvusClient = new MilvusClient({address, ssl, username, password});

```

```python
milvusClient, err := client.NewGrpcClient(
  context.Background(), // ctx
  "localhost:19530",    // addr
)
if err != nil {
  log.Fatal("failed to connect to Milvus:", err.Error())
}

```

```python
final MilvusServiceClient milvusClient = new MilvusServiceClient(
  ConnectParam.newBuilder()
    .withHost("localhost")
    .withPort(19530)
    .build()
);

```

```python
connect -h localhost -p 19530 -a default

```

```python
curl localhost:9091/api/v1/health
{"status":"ok"}

```

| 参数 | 描述 |
| --- | --- |
| `alias` | 要创建的 Milvus 连接的别名。 |
| `user` | Milvus 服务器的用户名。 |
| `password` | Milvus 服务器用户名的密码。 |
| `host` | Milvus 服务器的 IP 地址。 |
| `port` | Milvus 服务器的端口。 |

| 参数 | 描述 |
| --- | --- |
| `address` | 要创建的 Milvus 连接的地址。 |
| `username` | 用于连接 Milvus 的用户名。 |
| `password` | 用于连接 Milvus 的密码。 |
| `ssl` | 是否使用 SSL 连接。默认为 false。 |

| 参数 | 描述 |
| --- | --- |
| `ctx` | 控制 API 调用过程的上下文。 |
| `addr` | 要创建的 Milvus 连接的地址。|

| 参数 | 描述 |
| --- | --- |
| `Host` | Milvus 服务器的 IP 地址。 |
| `Port` | Milvus 服务器的端口。 |

| 选项 | 描述 |
| --- | --- |
| `-h`（可选） | 主机名。默认值为 "127.0.0.1"。 |
| `-p`（可选） | 端口号。默认值为 "19530"。 |
| `-a`（可选） | Milvus 链接的别名名称。默认值为 "default"。|
| `-D`（可选） | 断开与由别名指定的 Milvus 服务器的连接的标志。默认别名为 "default"。|

### 返回

通过传递的参数创建的Milvus连接。

### Raises

* **NotImplementedError**: 如果连接参数中的处理程序不是GRPC，则会引发此错误。

* **ParamError**: 如果连接参数中的池不受支持，则会引发此错误。

* **Exception**: 如果参数中指定的服务器未准备就绪，则无法连接到服务器。

从Milvus服务器断开连接
--------------

从Milvus服务器断开连接。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```python
connections.disconnect("default")

```

```python
await milvusClient.closeConnection();

```

```python
milvusClient.Close()

```

```python
milvusClient.close()

```

```python
connect -D

```

```python
# Close your HTTP client connection.

```

| 参数 | 描述 |
| --- | --- |
| `alias` | 要断开连接的 Milvus 服务器的别名。 |

限制
--

最大连接数为65,536。

接下来是什么
------

连接到 Milvus 服务器后，您可以：

* [创建集合](create_collection.md)

* [管理数据](insert_data.md)

* [构建向量索引](build_index.md)

* [进行向量搜索](search.md)

* [进行混合搜索](hybridsearch.md)
