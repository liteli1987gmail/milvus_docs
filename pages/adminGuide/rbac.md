


# 启用 RBAC

通过启用 RBAC，你可以基于用户角色和权限控制对特定的 Milvus 资源（如集合或分区）或权限的访问。目前，此功能仅适用于 Python 和 Java。

本主题描述了如何启用 RBAC 并管理 [用户和角色](/reference/users_and_roles.md)。

## 1. 创建用户

```
from pymilvus import utility

utility.create_user(user, password, using="default")
```

创建用户后，你可以进行以下操作：

- 更新用户密码。你需要同时提供原密码和新密码。

```
utility.update_password(user, old_password, new_password, using="default")
```

- 列出所有用户。

```
utility.list_usernames(using="default")
```

- 检查特定用户的角色。

```
utility.list_user(username, include_role_info, using="default")
```

- 检查所有用户的角色。

```
utility.list_users(include_role_info, using="default")
```

## 2. 创建角色

下面的示例创建了一个名为 `roleA` 的角色。

```
from pymilvus import Role, utility

role_name = "roleA"
role = Role(role_name, using=_CONNECTION)
role.create()
```

创建角色后，你可以进行以下操作：

- 检查角色是否存在。

```
role.is_exist()
```

- 列出所有角色。

```
utility.list_roles(include_user_info, using="default")
```

## 3. 为角色授予权限

下面的示例演示了如何将搜索所有集合的权限授予名为 `roleA` 的角色。有关其他类型的权限授予，请参见 [用户和角色](/reference/users_and_roles.md)。

在为角色授予权限以操纵其他数据库中的集合之前，请使用 `db.using_database()` 或直接连接到所需的数据库以将默认数据库更改为所需的数据库。详细信息请参考 [管理数据库](/userGuide/manage_databases.md)。

```
role.grant("Collection", "*", "Search")
```

为角色授予权限后，你可以进行以下操作：

- 列出授予角色的对象的特定权限。

```
role.list_grant("Collection","CollectionA")
```

- 列出授予角色的所有权限。

```
role.list_grants()
```


## 4. 将角色绑定到用户



将角色绑定到用户，以便该用户可以继承角色的所有权限。

```
role.add_user(username)
```

将角色绑定到用户后，你可以：

- 列出绑定到角色的所有用户

```
role.get_users()
```

## 5. 拒绝访问或权限

<div class="alert caution">

执行以下操作时要小心，因为这些操作是不可逆的。

</div>

- 从角色中移除权限。

```
role.revoke("Collection","*","Search")
```

- 从角色中移除用户

```
role.remove_user(username)
```

- 删除角色

```
role.drop("roleA"):
```

- 删除用户

```
utility.delete_user(user, using="default")
```

## 接下来是什么


- 学习如何管理 [用户身份验证](/adminGuide/authenticate.md)。
 
- 学习如何在 Milvus 中启用 [TLS 代理](/adminGuide/tls.md)。
 