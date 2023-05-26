
启用RBAC权限
===

启用RBAC，您可以基于用户角色和权限控制对特定Milvus资源（例如集合或分区）或权限的访问。目前，此功能仅在Python和Java中可用。

本主题介绍了如何启用RBAC并管理用户和角色。

1. 创建用户
----------------

```bash
utility.create_user(user, password, using="default")

```

创建用户后，您可以：

* 更新用户密码。您需要提供原始密码和新密码。

```bash
utility.update_password(user, old_password, new_password, using="default")

```

* 列出所有用户。

```bash
utility.list_usernames(using="default")

```

* 检查特定用户的角色。

```bash
utility.list_user(username, include_role_info, using="default")

```

* 检查所有用户的角色。

```bash
utility.list_users(include_role_info, using="default")

```

2. 创建角色
----------------

以下示例创建名为`roleA`的角色。

```bash
role_name = "roleA"
role = Role(role_name, using=_CONNECTION)
role.create()

```

创建角色后，您可以：

* 检查角色是否存在。

```bash
role.is_exist("roleA")

```

* 列出所有角色。

```bash
utility.list_roles(include_user_info, using="default")

```

3. 向角色授予权限
------------------------------

以下示例演示如何向名为`roleA`的角色授予搜索所有集合的权限。请参见[用户和角色](users_and_roles.md)以获取其他类型的权限。

```bash
role.grant("Collection", "*", "Search")

```

授予权限后，您可以：

* 列出分配给角色的对象的特定权限。

```bash
role.list_grant("Collection","CollectionA")

```

* 列出分配给角色的所有权限。

```bash
role.list_grants()

```

4. 将角色绑定到用户
------------------------

将角色绑定到用户，以便该用户可以继承角色的所有权限。

```bash
role.add_user("roleA", username)

```

角色绑定到用户后，您可以：

* 列出绑定到角色的所有用户。

```bash
role.get_users("roleA")

```

5. 拒绝访问或权限
----------------------------

在执行以下操作时要小心，因为这些操作是不可逆的。

* 从角色中删除一个权限。

```bash
role.revoke("Collection","*","Search")

```

* 从角色中删除用户

```bash
role.remove_user(username)

```

* 删除一个角色

```bash
role.drop("roleA"):

```

* 删除一个用户

```bash
utility.delete_user(user, using="default")

```

接下来是什么
-----------

* 了解如何管理[user authentication](authenticate.md)。
* 学习如何在Milvus中启用[TLS代理](tls.md)。