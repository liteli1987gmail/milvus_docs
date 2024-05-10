---
id: users_and_roles.md
related_key: users, roles
summary: Learn about the definition of users, roles, objects, and privileges in role-based access control (RBAC).
title: Users and Roles
---

# 用户和角色

本主题解释了基于角色的访问控制（RBAC）中用户、角色、对象和权限的定义。

- **对象：** 授予或拒绝访问的对象。对象可以是集合、分区等。

- **用户：** 具有用户名和相应密码的用户身份。

- **权限：** 权限定义了可以执行的操作和可以访问的资源。权限不能直接授予用户，必须先授予角色。

- **角色：** 角色定义了用户对某些对象的权限。将角色绑定到用户后，用户将继承该角色被授予的所有权限。

以下图表说明了对象、权限、角色和用户之间的关系。

![users_and_roles](/users_and_roles.png "对象、权限、角色和用户之间的关系。")

Milvus 默认创建了一个 `root` 用户，并为其分配了默认密码 `Milvus`。`root` 用户被授予了 `admin` 权限，这意味着 `root` 用户可以访问所有资源并执行所有操作。

如果用户绑定了 `public` 角色，该用户将获得 `DescribeCollection`、`ShowCollections` 和 `IndexDetail` 的权限。

下表列出了在[启用 RBAC](rbac.md)时可以选择的值。

| 对象名称 | 权限名称              | 客户端相关 API 描述                               |
| -------- | --------------------- | ------------------------------------------------- |
| 集合     | CreateIndex           | CreateIndex                                       |
| 集合     | DropIndex             | DropIndex                                         |
| 集合     | IndexDetail           | DescribeIndex/GetIndexState/GetIndexBuildProgress |
| 集合     | Load                  | LoadCollection/GetLoadingProgress/GetLoadState    |
| 集合     | GetLoadingProgress    | GetLoadingProgress                                |
| 集合     | GetLoadState          | GetLoadState                                      |
| 集合     | Release               | ReleaseCollection                                 |
| 集合     | Insert                | Insert                                            |
| 集合     | Delete                | Delete                                            |
| 集合     | Upsert                | Upsert                                            |
| 集合     | Search                | Search                                            |
| 集合     | Flush                 | Flush/GetFlushState                               |
| 集合     | GetFlushState         | GetFlushState                                     |
| 集合     | Query                 | Query                                             |
| 集合     | GetStatistics         | GetCollectionStatistics                           |
| 集合     | Compaction            | Compact                                           |
| 集合     | Import                | BulkInsert/Import                                 |
| 集合     | LoadBalance           | LoadBalance                                       |
| 集合     | CreatePartition       | CreatePartition                                   |
| 集合     | DropPartition         | DropPartition                                     |
| 集合     | ShowPartitions        | ShowPartitions                                    |
| 集合     | HasPartition          | HasPartition                                      |
| 全局     | All                   | 此表中所有 API 操作权限                           |
| 全局     | CreateCollection      | CreateCollection                                  |
| 全局     | DropCollection        | DropCollection                                    |
| 全局     | DescribeCollection    | DescribeCollection                                |
| 全局     | ShowCollections       | ShowCollections                                   |
| 全局     | RenameCollection      | RenameCollection                                  |
| 全局     | FlushAll              | FlushAll                                          |
| 全局     | CreateOwnership       | CreateUser CreateRole                             |
| 全局     | DropOwnership         | DeleteCredential DropRole                         |
| 全局     | SelectOwnership       | SelectRole/SelectGrant                            |
| 全局     | ManageOwnership       | OperateUserRole OperatePrivilege                  |
| 全局     | CreateResourceGroup   | CreateResourceGroup                               |
| 全局     | DropResourceGroup     | DropResourceGroup                                 |
| 全局     | DescribeResourceGroup | DescribeResourceGroup                             |
| 全局     | ListResourceGroups    | ListResourceGroups                                |
| 全局     | TransferNode          | TransferNode                                      |
| 全局     | TransferReplica       | TransferReplica                                   |
| 全局     | CreateDatabase        | CreateDatabase                                    |
| 全局     | DropDatabase          | DropDatabase                                      |
| 全局     | ListDatabases         | ListDatabases                                     |
| 全局     | CreateAlias           | CreateAlias                                       |
| 全局     | DropAlias             | DropAlias                                         |
| 全局     | DescribeAlias         | DescribeAlias                                     |
| 全局     | ListAliases           | ListAliases                                       |
| 用户     | UpdateUser            | UpdateCredential                                  |
| 用户     | SelectUser            | SelectUser                                        |

<div class="alert note">
<li>Object and privilege names are case-sensitive.</li>
<li>To grant all privileges to a kind of object, like Collection, Global, User, use "*" for privilege name. </li>
<li>The "*" privilege name for the Global object doesn't include the All privilege, because the All privilege includes all permissions, including any collection and user object.</li>
</div>

## What's next

- Learn how to [enable RBAC](rbac.md).
