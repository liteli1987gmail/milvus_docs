


# 管理数据库

与传统的数据库引擎类似，你可以在 Milvus 中创建数据库，并分配权限给特定的用户来管理它们。然后这些用户就有权利管理数据库中的集合。一个 Milvus 集群支持最多 64 个数据库。

<div class="alert note">

本页面的代码片段使用 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md"> PyMilvus ORM module </a> 与 Milvus 进行交互。使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient SDK </a> 的代码片段将很快提供。

</div>

## 创建数据库

要创建一个数据库，你需要先连接到一个 Milvus 集群，并为它准备一个名称：

```python
from pymilvus import connections, db

conn = connections.connect(host="127.0.0.1", port=19530)

database = db.create_database("book")
```

## 使用数据库

Milvus 集群附带一个名为 "default" 的默认数据库。除非另有指定，否则集合将在默认数据库中创建。

要更改默认数据库，请执行以下操作：

```python
db.using_database("book")
```

你也可以在连接到 Milvus 集群时设置要使用的数据库：

```python
conn = connections.connect(
    host="127.0.0.1",
    port="19530",
    db_name="default"
)
```

## 列出数据库

要查找 Milvus 集群中所有现有的数据库，请执行以下操作：

```python
db.list_database()

# 输出
['default', 'book']
```

## 删除数据库

要删除数据库，你必须首先删除它的所有集合。否则，删除操作将失败。

```python
db.drop_database("book")

db.list_database()

# 输出
['default']
```

## 使用数据库的 RBAC




# 


RBAC 也包括数据库操作并确保向前兼容性。Permission API（Grant / Revoke / List Grant）中的 **database** 一词具有以下含义：

- 如果既没有 Milvus 连接也没有 Permission API 调用指定 `db_name`，则 **database** 指的是默认数据库。
- 如果 Milvus 连接指定了 `db_name`，但 Permission API 调用之后没有指定，则 **database** 指的是在 Milvus 连接中指定名称的数据库。
- 如果 Permission API 调用在 Milvus 连接上进行，无论是否指定了 `db_name`，**database** 都指的是在 Permission API 调用中指定名称的数据库。

下面的代码片段在下面的列表中共享。

```python
from pymilvus import connections, Role

_HOST = '127.0.0.1'
_PORT = '19530'
_ROOT = "root"
_ROOT_PASSWORD = "Milvus"
_ROLE_NAME = "test_role"
_PRIVILEGE_INSERT = "Insert"


def connect_to_milvus(db_name="default"):
    print(f"连接到Milvus\n")
    connections.connect(host=_HOST, port=_PORT, user=_ROOT, password=_ROOT_PASSWORD, db_name=db_name)
```

- 如果既没有 Milvus 连接也没有 Permission API 调用指定 `db_name`，则 **database** 指的是默认数据库。

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

- 如果 Milvus 连接指定了 `db_name`，但 Permission API 调用之后没有指定，则 **database** 指的是在 Milvus 连接中指定名称的数据库。

```python
# 注意：请确保'foo'数据库已经创建
connect_to_milvus(db_name="foo")
# 此角色将具有foo数据库下所有集合的插入权限，但不包括其他数据库下集合的插入权限
role.grant("Collection", "*", _PRIVILEGE_INSERT)
print(role.list_grants())
print(role.list_grant("Collection", "*"))
role.revoke("Global", "*", _PRIVILEGE_INSERT)
```

- 如果 Permission API 调用在 Milvus 连接上进行，无论是否指定了 `db_name`，**database** 都指的是在 Permission API 调用中指定名称的数据库。

```python
# 注意：请确保'foo'数据库已经创建
db_name = "foo"
connect_to_milvus()
role.grant("Collection", "*", _PRIVILEGE_INSERT, db_name=db_name)
print(role.list_grants(db_name=db_name))
print(role.list_grant("Collection", "*", db_name=db_name))
role.revoke("Global", "*", _PRIVILEGE_INSERT, db_name=db_name)
```

## 接下来是什么





[启用 RBAC](/adminGuide/rbac.md)

[多租户](/reference/multi_tenancy.md)
