---
id: authenticate.md
title: 用户访问认证
summary: 了解如何在 Milvus 中管理用户身份验证。
---

# 用户访问认证

本文介绍如何在 Milvus 中管理用户认证。

Milvus 支持通过用户名和密码进行认证访问。

## 启用用户认证

<div class="filter">
<a href="#docker">Docker Compose</a> <a href="#helm">Helm</a>
</div>

<div class="table-wrapper filter-docker" markdown="block">

在 <a href="configure-docker.md">配置 Milvus</a> 时，将 `milvus.yaml` 中的 `common.security.authorizationEnabled` 设置为 `true` 以启用认证。

</div>

<div class="table-wrapper filter-helm" markdown="block">
    
从 Milvus Helm Chart 4.0.0 版本开始，你可以通过修改 `values.yaml` 来启用用户认证：

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

## 创建已认证用户

默认情况下，每个 Milvus 实例都会创建一个根用户（密码：`Milvus`）。建议在首次启动 Milvus 时更改根用户的密码。根用户可以用来创建新用户以进行认证访问。

使用以下命令创建用户名和密码：

```python
from pymilvus import utility
utility.create_user('user', 'password', using='default')
```

| 参数                  | 描述                               |
| --------------------- | ---------------------------------- |
| <code>user</code>     | 要创建的用户名。                   |
| <code>password</code> | 要创建的用户的密码。               |
| <code>using</code>    | 要创建用户的 Milvus 服务器的别名。 |

## 使用已认证用户连接 Milvus

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

| 参数                  | 描述                               |
| --------------------- | ---------------------------------- |
| <code>alias</code>    | 要连接的 Milvus 服务器的别名。     |
| <code>host</code>     | 要连接的 Milvus 服务器的 IP 地址。 |
| <code>port</code>     | 要连接的 Milvus 服务器的端口。     |
| <code>user</code>     | 用于连接的用户名。                 |
| <code>password</code> | 用于连接的密码。                   |

<div class="alert note">
要停止使用已认证访问，或登录到另一个已认证用户，你需要从 Milvus 实例断开连接，然后重新连接。</div>

## 重置密码

更改现有用户的密码并重置 Milvus 连接。

```python
from pymilvus import utility
utility.reset_password('user', 'old_password', 'new_password', using='default')

# 或者你可以使用别名函数 update_password
utility.update_password('user', 'old_password', 'new_password', using='default')
```

| 参数                  | 描述                  |
| --------------------- | --------------------- |
| <code>user</code>     | 要重置密码的用户名。  |
| <code>password</code> | 用户的新密码。        |
| <code>using</code>    | Milvus 服务器的别名。 |

如果你忘记了旧密码，Milvus 提供了一个配置项，允许你指定某些用户为超级用户。这消除了在重置密码时需要旧密码的需求。

默认情况下，Milvus 配置文件中的 `common.security.superUsers` 字段为空，意味着所有用户在重置密码时都必须提供旧密码。然而，你可以指定特定用户为超级用户，他们不需要提供旧密码。在下面的代码片段中，`root` 和 `foo` 被指定为超级用户。

你应该在控制你的 Milvus 实例运行的 Milvus 配置文件中添加以下配置项。

```yaml
common:
  security:
    superUsers: root, foo
```

## 删除用户

删除已认证用户。

```python
from pymilvus import utility
utility.delete_user('user', using='default')
```

| 参数               | 描述                  |
| ------------------ | --------------------- |
| <code>user</code>  | 要删除的用户名。      |
| <code>using</code> | Milvus 服务器的别名。 |

## 列出所有用户

列出所有凭据用户。

```python
from pymilvus import utility
users = utility.list_usernames(using='default')
```

## 限制

1. 用户名不得为空，长度不得超过 32 个字符。必须以字母开头，且只能包含下划线、字母或数字。
2. 密码必须至少包含 6 个字符，长度不得超过 256 个字符。

## 下一步

- 你可能还想了解如何
  - 扩展 Milvus 集群]（scaleout.md
- 如果你已经准备好在云上部署集群：
  - 学习如何[使用 Terraform 和 Ansible 在 AWS 上部署 Milvus](aws.md)
  - 了解如何[使用 Terraform 在亚马逊 EKS 上部署 Milvus](eks.md)
  - 学习如何[使用 Kubernetes 在 GCP 上部署 Milvus 集群](gcp.md)
  - 学习如何[使用 Kubernetes 在 Microsoft Azure 上部署 Milvus](azure.md)
