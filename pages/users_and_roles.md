用户和角色
=====

本主题解释了基于角色的访问控制（RBAC）中用户、角色、对象和权限的定义。

* **对象：**授予或拒绝访问的对象。对象可以是集合、分区等。

* **用户：**具有用户名和相应密码的用户身份。

* **权限：**权限定义了可以执行的操作和可以访问的资源。权限不能直接授予用户，必须先授予角色。

* **角色：**角色定义了用户对某些对象的权限。绑定角色后，用户继承此角色授予的所有权限。

以下图表说明了对象、权限、角色和用户之间的关系。

[![users_and_roles](https://milvus.io/static/656776f5553fceaad86f4830a328c1f6/1263b/users_and_roles.png "The relationship between object, privilege, role and user.")](https://milvus.io/static/656776f5553fceaad86f4830a328c1f6/bbbf7/users_and_roles.png)

The relationship between object, privilege, role and user.

对象、权限、角色和用户之间的关系如下图所示。

Milvus默认创建一个名为`root`的用户，并设置默认密码为`Milvus`。用户`root`被授予`admin`权限，这意味着`root`用户可以访问所有资源和执行所有操作。

如果用户绑定`public`角色，则该用户有权访问`DescribeCollection`、`ShowCollections`和`IndexDetail`权限。

以下表格列出了在[启用RBAC](rbac.md)时可以选择的值。

| Object name | Privilege name | Relevant API description on the client side |
| --- | --- | --- |
| Collection | CreateIndex | CreateIndex |
| Collection | DropIndex | DropIndex |
| Collection | IndexDetail | DescribeIndex/GetIndexState/GetIndexBuildProgress |
| Collection | Load | LoadCollection |
| Collection | Release | ReleaseCollection |
| Collection | Insert | Insert |
| Collection | Delete | Delete |
| Collection | Search | Search |
| Collection | Flush | Flush |
| Collection | Query | Query |
| Collection | GetStatistics | GetCollectionStatistics |
| Collection | Compaction | Compact |
| Collection | Alias | CreateAlias/DropAlias/AlterAlias |
| Collection | Import | BulkInsert/Import |
| Collection | LoadBalance | LoadBalance |
| Global | *(All) | All API operation permissions in this table |
| Global | CreateCollection | CreateCollection |
| Global | DropCollection | DropCollection |
| Global | DescribeCollection | DescribeCollection |
| Global | ShowCollections | ShowCollections |
| Global | CreateOwnership | CreateUser CreateRole |
| Global | DropOwnership | DeleteCredential DropRole |
| Global | SelectOwnership | SelectRole/SelectGrant |
| Global | ManageOwnership | OperateUserRole OperatePrivilege |
| Global | CreateResourceGroup | CreateResourceGroup |
| Global | DropResourceGroup | DropResourceGroup |
| Global | DescribeResourceGroup | DescribeResourceGroup |
| Global | ListResourceGroups | ListResourceGroups |
| Global | TransferNode | TransferNode |
| Global | TransferReplica | TransferReplica |
| User | UpdateUser | UpdateCredential |
| User | SelectUser | SelectUser |

- 对象和权限名称区分大小写。

- 要授予全局对象的所有权限，请使用特定字符"*"。

接下来是什么
------

* 学习如何[启用RBAC](rbac.md)。
