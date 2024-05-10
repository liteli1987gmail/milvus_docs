---
id: manage_databases.md
title: Manage Databases
---

# 管理数据库

与传统数据库引擎类似，您也可以在 Milvus 中创建数据库并为特定用户分配权限以管理它们。然后，这些用户有权管理数据库中的集合。一个 Milvus 集群最多支持 64 个数据库。

<div class="alert note">

本页面上的代码片段使用 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md">PyMilvus ORM 模块</a> 与 Milvus 交互。使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient SDK</a> 的代码片段将很快提供。

</div>

## 创建数据库

要创建数据库，您需要首先连接到 Milvus 集群并为其准备一个名称：

```python
from pymilvus import connections, db

conn = connections.connect(host="127.0.0.1", port=19530)

database = db.create_database("book")
```

## 使用数据库

Milvus 集群附带一个默认数据库，名为 'default'。除非另有指定，否则集合是在默认数据库中创建的。

要更改默认数据库，请按以下步骤操作：

```python
db.using_database("book")
```

您还可以在连接到您的 Milvus 集群时设置要使用的数据库，如下所示：

```python
conn = connections.connect(
    host="127.0.0.1",
    port="19530",
    db_name="default"
)
```

## 列出数据库

要查找您的 Milvus 集群中的所有现有数据库，请按以下步骤操作：

```python
db.list_database()

# 输出
['default', 'book']
```

## 删除数据库

要删除数据库，您必须先删除其所有集合。否则，删除将失败。

```python
db.drop_database("book")

db.list_database()

# 输出
['default']
```

## 使用数据库的 RBAC

RBAC 也涵盖了数据库操作，并确保了向前兼容性。在权限 API（Grant / Revoke / List Grant）中的 **database** 一词具有以下含义：

- 如果既没有 Milvus 连接也没有权限 API 调用指定了 `db_name`，则 **database** 指的是默认数据库。
- 如果 Milvus 连接指定了 `db_name`，但随后的权限 API 调用没有指定，则 **database** 指的是 Milvus 连接中指定的数据库。
- 如果在 Milvus 连接上进行了权限 API 调用，无论是否指定了 `db_name`，则 **database** 指的是权限 API 调用中指定的数据库。

以下代码片段在下面列出的块中共享。

```python
from pymilvus import connections, Role

_HOST = '127.0.0.1'
_PORT = '19530'
_ROOT = "root"
_ROOT_PASSWORD = "Milvus"
_ROLE_NAME = "test_role"
_PRIVILEGE_INSERT = "Insert"


def connect_to_milvus(db_name="default"):
    print(f"connect to milvus\n")
    connections.connect(host=_HOST, port=_PORT, user=_ROOT, password=_ROOT_PASSWORD, db_name=db_name)
```

- 如果既没有 Milvus 连接也没有权限 API 调用指定了 `db_name`，则 **database** 指的是默认数据库。

```
connect_to_milvus()
role = Role(_ROLE_NAME)
role.create()

connect_to_milvus()
role.grant("Collection", "*", _PRIVILEGE_INSERT)
print(role.list_grants())
print(role.list_grant("Collection", "*"))
role.revoke("Global", "*", _PRIVILEGE_INSERT)
```

- 如果 Milvus 连接指定了 `db_name`，但随后的权限 API 调用没有指定，则 **database** 指的是 Milvus 连接中指定的数据库。

```python
# 注意：请确保已创建 'foo' 数据库
connect_to_milvus(db_name="foo")
# 此角色将拥有 foo 数据库下所有集合的插入权限，
# 不包括其他数据库下集合的插入权限
role.grant("Collection", "*", _PRIVILEGE_INSERT)
print(role.list_grants())
print(role.list_grant("Collection", "*"))
role.revoke("Global", "*", _PRIVILEGE_INSERT)
```

- 如果在 Milvus 连接上进行了权限 API 调用，无论是否指定了 `db_name`，则 **database** 指的是权限 API 调用中指定的数据库。

```python
# NOTE: please make sure the 'foo' db has been created
db_name = "foo"
connect_to_milvus()
role.grant("Collection", "*", _PRIVILEGE_INSERT, db_name=db_name)
print(role.list_grants(db_name=db_name))
print(role.list_grant("Collection", "*", db_name=db_name))
role.revoke("Global", "*", _PRIVILEGE_INSERT, db_name=db_name)
```

## What's next

[Enable RBAC](rbac.md)

[Multi-tenancy](multi_tenancy.md)
