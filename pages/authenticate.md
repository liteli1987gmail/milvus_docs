用户身份验证
====

本主题介绍如何在Milvus中管理用户身份验证。

Milvus支持使用用户名和密码进行身份验证的访问。

启用用户身份验证
-------------------------

[Docker Compose](#docker) [Helm](#helm)

在[配置Milvus](configure-docker.md)时，如需启用身份验证，请将 `milvus.yaml` 中的 `common.security.authorizationEnabled` 设置为 `true`。

从Milvus Helm Chart 4.0.0开始，您可以按照以下方式修改`values.yaml` 来启用用户身份验证：

```bash
extraConfigFiles:
  user.yaml: |+
    common:
      security:
        authorizationEnabled: true
```

创建已验证的用户
----------------------------

默认情况下，每个Milvus实例都会创建一个根用户（密码为 `Milvus`）。 强烈建议在首次启动Milvus时更改根用户的密码。 根用户可用于创建新用户以进行身份验证访问。

使用以下命令创建具有用户名和密码的用户：

```bash
from pymilvus import utility
utility.create_user('user', 'password', using='default') 
```

| 参数 | 描述 |
| --- | --- |
| `user` | 要创建的用户名。 |
| `password` | 要创建用户的密码。 |
| `using` | 要创建用户的Milvus服务器的别名。 |

使用已验证的用户连接Milvus
-----------------------------------------

使用现有用户连接Milvus。

```bash
from pymilvus import connections
connections.connect(
    alias='default',
    host='localhost',
    port='19530',
    user='user',
    password='password',
)

```

| 参数 | 描述 |
| --- | --- |
| `alias` | 要连接的Milvus服务器的别名。 |
| `host` | 要连接的Milvus服务器的IP地址。 |
| `port` | 要连接的Milvus服务器的端口。 |
| `user` | 用于连接的用户名。 |
| `password` | 用于连接的密码。 |

要停止使用身份验证访问或登录到另一个已验证的用户，您需要从Milvus实例断开连接并重新连接。

重置密码
--------------

更改现有用户的密码并重置Milvus连接。

```bash
from pymilvus import utility
utility.reset_password('user', 'old_password', 'new_password', using='default')

# 或者您也可以使用别名函数`update_password`
utility.update_password('user', 'old_password', 'new_password', using='default')
```

| 参数 | 描述 |
| --- | --- |
| `user` | 要重置密码的用户名。 |
| `password` | 用于用户的新密码。 |
| `using` | Milvus服务器的别名。 |

如果您忘记了旧密码，则Milvus提供了一个配置项，允许您指定某些用户为超级用户。 这消除了在重置密码时需要旧密码的需要。

默认情况下，Milvus配置文件中的 `common.security.superUsers` 字段为空，这意味着所有用户在重置密码时都必须提供旧密码。 但是，您可以指定特定的用户为超级用户，他们不需要提供旧密码。 在下面的代码片段中，`root` 和`foo` 被指定为超级用户。

您应该将以下配置项添加到管理Milvus实例运行的Milvus配置文件中。

```bash
common:
    security:
        superUsers: root, foo
```

删除用户
-------------

删除已认证的用户。

```bash
from pymilvus import utility
utility.delete_user('user', using='default')
```

| 参数 | 描述 |
| --- | --- |
| `user` | 要删除的用户名。 |
| `using` | Milvus服务器的别名。 |

列出所有用户
--------------

列出所有凭据用户。

```bash
from pymilvus import utility
users = utility.list_usernames(using='default')
```

限制
-----------

1. 用户名不能为空，并且长度不得超过32个字符。 它必须以字母开头，只能包含下划线、字母或数字。
2. 密码必须至少有6个字符，并且长度不得超过256个字符。

下一步
-----------

* 您可能还想了解如何：
	+ [扩展Milvus集群](scaleout.md)
* 如果您准备在云上部署集群：
	+ 学习如何[ 使用Terraform和Ansible在AWS上部署Milvus](aws.md)
	+ 学习如何[ 使用Terraform在Amazon EKS上部署Milvus](eks.md)
	+ 学习如何[使用Kubernetes在GCP上部署Milvus集群](gcp.md)
	+ 学习如何[在Microsoft Azure上使用Kubernetes部署Milvus](azure.md)