---
title:  管理资源组
---
# 管理资源组

在 Milvus 中，您可以使用资源组来物理隔离某些查询节点。本指南将指导您如何创建和管理自定义资源组以及在它们之间转移节点。

## 什么是资源组

资源组可以包含 Milvus 集群中的多个或所有查询节点。您根据最符合您需求的方式来决定如何在资源组之间分配查询节点。例如，在多集合场景中，您可以为每个资源组分配适当数量的查询节点，并将集合加载到不同的资源组中，以便每个集合内的运算在物理上独立于其他集合。

请注意，Milvus 实例在启动时维护一个默认资源组来包含所有查询节点，并将其命名为 **__default_resource_group**。您可以将一些节点从默认资源组移动到您创建的资源组。

## 管理资源组

<div class="alert note">

本页面上的所有代码示例都使用 PyMilvus {{var.milvus_python_sdk_real_version}}。在运行它们之前，请升级您的 PyMilvus 安装。

</div>

1. 创建资源组。

    连接到 Milvus 实例后，运行以下代码以创建资源组。以下代码片段假设 `default` 是您的 Milvus 连接别名。

    ```Python
    import pymilvus

    # 资源组名称应该是 1 到 255 个字符的字符串，以字母或下划线 (_) 开头，并且只包含数字、字母和下划线 (_)。
    name = "rg"

    try:
        utility.create_resource_group(name, using='default')
        print(f"Succeeded in creating resource group {name}.")
    except Exception:
        print("Failed to create the resource group.")

    # 成功创建资源组 rg。
    ```

2. 列出资源组。

    创建资源组后，您可以在资源组列表中看到它。

    要查看 Milvus 实例中的资源组列表，请执行以下操作：

    ```Python
    rgs = utility.list_resource_groups(using='default')
    print(f"Resource group list: {rgs}")

    # 资源组列表: ['__default_resource_group', 'rg']
    ```

3. 描述资源组。

    您可以按照以下方式让 Milvus 描述您关心的资源组：

    ```Python
    info = utility.describe_resource_group(name, using="default")
    print(f"Resource group description: {info}")

    # 资源组描述：
    #        <name:"rg">,           // 字符串，rg 名称
    #        <capacity:1>,            // 整数，已转移到此 rg 的 num_node 数量
    #        <num_available_node:0>,  // 整数，可用的 node_num，一些节点可能已关闭
    #        <num_loaded_replica:{}>, // map[string]int，从集合名称到此 rg 中每个集合加载的副本数量
    #        <num_outgoing_node:{}>,  // map[string]int，从集合名称到此 rg 中加载的副本访问的传出节点数量
    #        <num_incoming_node:{}>.  // map[string]int，从集合名称到其他 rg 中加载的副本访问的传入节点数量
    ```

4. 在资源组之间转移节点。

    您可能会注意到所描述的资源组尚未有任何查询节点。按照以下方式将一些节点从默认资源组移动到您创建的资源组：

    ```Python
    source = '__default_resource_group'
    target = 'rg'
    num_nodes = 1

    try:
        utility.transfer_node(source, target, num_nodes, using="default")
        print(f"Succeeded in moving {num_node} node(s) from {source} to {target}.")
    except Exception:
        print("Something went wrong while moving nodes.")

    # 成功将 1 个节点从 __default_resource_group 移动到 rg。
    ```

5. 将集合和分区加载到资源组。

    一旦资源组中有查询节点，您就可以将集合加载到该资源组。以下代码片段假设已存在名为 `demo` 的集合。

    ```Python
    from pymilvus import Collection

    collection = Collection('demo')

    # Milvus 将集合加载到默认资源组。
    collection.load(replica_number=2)

    # 或者，您可以要求 Milvus 将集合加载到所需的资源组。
    # 确保查询节点数量应大于或等于副本数量
    resource_groups = ['rg']
    collection.load(replica_number=2, _resource_groups=resource_groups) 
    ```

    同样，您也可以只将分区加载到资源组中，并将其副本分布在几个资源组中。以下假设已存在名为 `Books` 的集合，并且它有一个名为 `Novels` 的分区。

    ```Python
    collection = Collection("