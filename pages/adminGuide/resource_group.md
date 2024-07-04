


# 管理资源组

在 Milvus 中，你可以使用资源组将某些查询节点与其他节点进行物理隔离。本指南介绍了如何创建和管理自定义的资源组，并在它们之间转移节点。

## 什么是资源组

资源组可以容纳一个或多个 Milvus 集群中的查询节点。你可以根据你的需求决定如何在资源组之间分配查询节点。例如，在多集合场景中，你可以为每个资源组分配适当数量的查询节点，并将集合加载到不同的资源组中，从而使得每个集合内的操作与其他集合相互独立。

请注意，Milvus 实例在启动时会维护一个名为**__default_resource_group**的默认资源组，用于存放所有的查询节点。你可以将一些节点从默认资源组移动到你创建的资源组中。

## 管理资源组
 


<div class="alert note">

此页面上的所有代码示例均为 PyMilvus {{var.milvus_python_sdk_real_version}}。在运行这些代码之前，请升级你的 PyMilvus 安装。

</div>

1. 创建资源组。

    若要创建资源组，请在连接到 Milvus 实例后运行以下命令。下面的代码假设 `default` 是 Milvus 连接的别名。

    ```Python
    import pymilvus

    # 资源组名称应为以字母或下划线(_)开头的1到255个字符长的字符串，并且只能包含数字、字母和下划线(_)
    name = "rg"

    try:
        utility.create_resource_group(name, using='default')
        print(f"成功创建资源组{name}。")
    except Exception:
        print("创建资源组失败。")

    # 创建资源组rg成功。
    ```

2. 列出资源组。

    创建资源组后，你可以在资源组列表中查看它。

    要查看 Milvus 实例中的资源组列表，请按以下步骤操作：

    ```Python
    rgs = utility.list_resource_groups(using='default')
    print(f"资源组列表：{rgs}")

    # 资源组列表：['__default_resource_group', 'rg']
    ```

3. 描述资源组。

    你可以让 Milvus 按以下方式描述一个特定的资源组：

    ```Python
    info = utility.describe_resource_group(name, using="default")
    print(f"资源组描述：{info}")

    # 资源组描述：
    #        <name:"rg">,           // string, rg name
    #        <capacity:1>,            // int, num_node which has been transfer to this rg
    #        <num_available_node:0>,  // int, available node_num, some node may shutdown
    #        <num_loaded_replica:{}>, // map[string]int, from collection_name to loaded replica of each collecion in this rg
    #        <num_outgoing_node:{}>,  // map[string]int, from collection_name to outgoging accessed node num by replica loaded in this rg 
    #        <num_incoming_node:{}>.  // map[string]int, from collection_name to incoming accessed node num by replica loaded in other rg
    ```

4. 在资源组之间迁移节点。

    你可能会注意到所描述的资源组还没有任何查询节点。请按以下步骤将一些节点从默认资源组移动到你创建的资源组：

    ```Python
    source = '__default_resource_group'
    target = 'rg'
    num_nodes = 1

    try:
        utility.transfer_node(source, target, num_nodes, using="default")
        print(f"成功将{num_nodes}个节点从{source}移动到{target}。")
    except Exception:
        print("移动节点时发生错误。")

    # 成功将1个节点(s)从__default_resource_group移动到rg。
    ```

5. 将收藏和分区加载到资源组。

    一旦在资源组中有查询节点，你就可以将集合加载到该资源组中。以下代码假设已经存在名为 `demo` 的集合。

    ```Python
    from pymilvus import Collection

    collection = Collection('demo')

    # Milvus将该集合加载到默认资源组中。
    collection.load(replica_number=2)

    # 或者，你可以要求Milvus将该集合加载到指定的资源组中。
    # 确保查询节点数大于等于副本数量
    resource_groups = ['rg']
    collection.load(replica_number=2, _resource_groups=resource_groups) 
    ```

    另外，你可以只将一个分区加载到资源组中，并将其副本分发在多个资源组中。以下代码假设已经存在名为 `Books` 的集合，且该集合有一个名为 `Novels` 的分区。

    ```Python
    collection = Collection("Books")

    # 使用集合的load方法加载其中一个分区
    collection.load(["Novels"], replica_number=2, _resource_groups=resource_groups)





# Or, 你也可以直接使用分区的加载方法
partition = Partition(collection, "Novels")
partition.load(replica_number=2, _resource_groups=resource_groups)
```

请注意，`_resource_groups` 是一个可选参数，如果未指定，Milvus 将在默认资源组中的查询节点上加载副本。

要让 Milvus 在单独的资源组中加载每个集合的副本，请确保资源组的数量等于副本的数量。

6. 在资源组之间转移副本。

Milvus 使用 [副本](/reference/replica.md) 来实现跨多个查询节点分布的 [段](glossary.md#Segment) 之间的负载平衡。你可以按如下方式将集合的某些副本从一个资源组移动到另一个资源组：

```Python
source = '__default_resource_group'
target = 'rg'
collection_name = 'c'
num_replicas = 1

try:
    utility.transfer_replica(source, target, collection_name, num_replicas, using="default")
    print(f"成功将{num_node}个{name}的副本从{source}移动到{target}。")
except Exception:
    print("移动副本时出现了一些问题。")

# 成功将1个c的副本从__default_resource_group移动到rg。
```

7. 删除一个资源组。

只有在资源组中没有查询节点时，你才能随时删除一个资源组。在本指南中，资源组 `rg` 现在有一个查询节点。在删除此资源组之前，你需要将它移动到另一个资源组中。

```Python
source = 'rg'
target = '__default_resource_group'
num_nodes = 1

try:
    utility.transfer_node(source, target, num_nodes, using="default")
    utility.drop_resource_group(source, using="default")
    print(f"成功删除{source}。")
except Exception:
    print(f"删除{source}时出现了一些问题。")
```

# 接下来做什么

要部署一个多租户的 Milvus 实例，请阅读以下内容：

- [启用 RBAC](/adminGuide/rbac.md)
- [用户和角色](/reference/users_and_roles.md)

