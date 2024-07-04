

# 用户访问认证

本主题介绍如何在 Milvus 中管理用户认证。

Milvus 支持通过用户名和密码进行身份验证的访问。

## 启用用户认证

<div class="filter">
<a href="#docker"> Docker Compose </a> <a href="#helm"> Helm </a>
</div>

<div class="table-wrapper filter-docker" markdown="block">

在 <a href="configure-docker.md"> 配置 Milvus </a> 时，将 <code> milvus.yaml </code> 中的 <code> common.security.authorizationEnabled </code> 设为 <code> true </code> 以启用身份验证。

</div>

<div class="table-wrapper filter-helm" markdown="block">
    
从 Milvus Helm Chart 4.0.0 开始，你可以通过修改 `values.yaml` 来启用用户认证，方法如下：

<pre>
  <code>
extraConfigFiles:
  user.yaml: |+
    common:
      security:
        authorizationEnabled: true
  </code>
</pre>
    
</div>

## 创建已认证的用户

默认情况下，每个 Milvus 实例都会创建一个根用户（密码：<code> Milvus </code>）。建议你在首次启动 Milvus 时更改根用户的密码。使用根用户可以为已认证的访问创建新用户。

使用以下命令为用户创建用户名和密码。

```python
from pymilvus import utility
utility.create_user('user', 'password', using='default') 
```

| 参数                      |  描述                                  |
| ---------------------------- | ----------------------------------------- |
| <code> user </code>            | 要创建的用户名。                             |
| <code> password </code>        | 要创建的用户的密码。                         |
| <code> using </code>           | 要创建用户的 Milvus 服务器的别名。  |

## 使用已认证的用户连接 Milvus

使用现有用户连接 Milvus。

```python
from pymilvus import connections
connections.connect(
    alias='default',
    host='localhost',
    port='19530',
    user='user',
    password='password',
)
```

| 参数                      |  描述                                |
| ------------------------------ | ----------------------------------------- |
| <code> alias </code>             | 要连接的 Milvus 服务器的别名。                   |
| <code> host </code>              | 要连接的 Milvus 服务器的 IP 地址。         |
| <code> port </code>              | 要连接的 Milvus 服务器的端口。         |
| <code> user </code>              | 用于连接的用户名。                     |
| <code> password </code>          | 用于连接的密码。                     |

<div class="alert note">
要停止使用已认证的访问，或者要登录到其他已认证的用户，你需要断开与 Milvus 实例的连接并重新连接。
</div>

## 重置密码




# 更改现有用户的密码并重置 Milvus 连接。

```python
from pymilvus import utility
utility.reset_password('user', 'old_password', 'new_password', using='default')

# Or you can use an alias function update_password
utility.update_password('user', 'old_password', 'new_password', using='default')
```

| Parameter                    |  Description                            |
| ---------------------------- | --------------------------------------- |
| <code> user </code>            | 用户名用于重置密码。             |
| <code> password </code>        | 用户的新密码。              |
| <code> using </code>           | Milvus 服务器的别名。             |

如果忘记旧密码，Milvus 提供了一项配置项，可以指定某些用户作为超级用户。这样在重置密码时就不需要提供旧密码了。

默认情况下，Milvus 配置文件中的 `common.security.superUsers` 字段为空，这意味着所有用户在重置密码时都必须提供旧密码。但是你可以指定特定的用户为超级用户，超级用户在重置密码时不需要提供旧密码。在下面的片段中，`root` 和 `foo` 被指定为超级用户。

你应该在控制你的 Milvus 实例运行的 Milvus 配置文件中添加以下配置项。

```yaml
common:
    security:
        superUsers: root, foo
```

## 删除用户

删除已验证的用户。

```python
from pymilvus import utility
utility.delete_user('user', using='default')
```

| 参数                    |  描述                            |
| ---------------------------- | --------------------------------------- |
| <code> user </code>            | 要删除的用户名。                     |
| <code> using </code>           | Milvus 服务器的别名。             |

## 列出所有用户

列出所有凭证用户。

```python
from pymilvus import utility
users = utility.list_usernames(using='default')
```

## 限制

1. 用户名不能为空，长度不能超过 32 个字符。必须以字母开头，只能包含下划线，字母或数字。
2. 密码必须至少有 6 个字符，并且长度不能超过 256 个字符。

## 下一步做什么




- 你可能还想学习如何：
  - [扩展一个 Milvus 集群](/adminGuide/scaleout.md)
- 如果你准备在云上部署你的集群：
  - 学习如何 [使用 Terraform 和 Ansible 在 AWS 上部署 Milvus](/adminGuide/clouds/aws/aws.md)
  - 学习如何 [使用 Terraform 在 Amazon EKS 上部署 Milvus](/adminGuide/clouds/aws/eks.md)
  - 学习如何 [使用 Kubernetes 在 GCP 上部署 Milvus 集群](/adminGuide/clouds/gcp/gcp.md)
  - 学习如何 [使用 Kubernetes 在 Microsoft Azure 上部署 Milvus](/adminGuide/clouds/azure/azure.md)

