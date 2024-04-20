---
title:  启用基于角色的访问控制（RBAC）
---

# 启用基于角色的访问控制（RBAC）

通过启用基于角色的访问控制（RBAC），您可以根据用户角色和权限控制对特定 Milvus 资源（例如集合或分区）或权限的访问。目前，此功能仅在 Python 和 Java 中可用。

本主题描述了如何启用 RBAC 并管理[用户和角色](users_and_roles.md)。

## 1. 创建用户

```python
from pymilvus import utility

utility.create_user(user, password, using="default")
```

创建用户后，您可以：

- 更新用户密码。您需要提供原始密码和新密码。

```python
utility.update_password(user, old_password, new_password, using="default")
```

- 列出所有用户。

```python
utility.list_usernames(using="default")
```

- 检查特定用户的角色。

```python
utility.list_user(username, include_role_info, using="default")
```

- 检查所有用户的角色。

```python
utility.list_users(include_role_info, using="default")
```

## 2. 创建角色

以下示例创建了一个名为 `roleA` 的角色。

```python
from pymilvus import Role, utility

role_name = "roleA"
role = Role(role_name, using=_CONNECTION)
role.create()
```

创建角色后，您可以：

- 检查角色是否存在。

```python
role.is_exist()
```

- 列出所有角色。

```python
utility.list_roles(include_user_info, using="default")
```

## 3. 授予角色权限

以下示例演示了如何授予名为 `roleA` 的角色搜索所有集合的权限。有关您可以授予的其他类型的权限，请参阅[用户和角色](users_and_roles.md)。

在授予角色在其他数据库中操作集合的权限之前，使用 `db.using_database()` 或直接连接到所需的数据库，将默认数据库更改为所需的数据库。有关详细信息，请参阅[管理数据库](manage_databases.md)。

```python
role.grant("Collection", "*", "Search")
```

授予角色权限后，您可以：

- 列出授予角色的某个对象的特定权限。

```python
role.list_grant("Collection","CollectionA")
```

- 列出授予角色的所有权限。

```python
role.list_grants()
```

## 4. 将角色绑定到用户

将角色绑定到用户，以便该用户可以继承角色的所有权限。

```python
role.add_user(username)
```

将角色绑定到用户后，您可以：

- 列出绑定到角色的所有用户

```python
role.get_users()
```

## 5. 拒绝访问或权限

<div class="alert caution">

执行以下操作时要小心，因为这些操作是不可逆的。

</div>

- 从角色中移除权限。

```python
role.revoke("Collection","*","Search")
```

- 从角色中移除用户

```python
role.remove_user(username)
```

- 删除角色

```python
role.drop("roleA"):
```

- 删除用户

```python
utility.delete_user(user, using="default")
```

## 接下来做什么

- 学习如何管理[用户认证](authenticate.md)。

- 学习如何在 Milvus 中启用[TLS 代理](tls.md)。