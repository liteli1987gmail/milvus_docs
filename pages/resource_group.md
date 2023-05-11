资源组
===


管理资源组
-----

在Milvus中，您可以使用资源组将某些查询节点物理隔离。本指南将指导您如何创建和管理自定义资源组以及在它们之间转移节点。

### 什么是资源组

资源组可以容纳Milvus集群中的多个或所有查询节点。您可以根据需要决定如何在资源组之间分配查询节点。例如，在多集合场景中，您可以向每个资源组分配适当数量的查询节点，并将集合加载到不同的资源组中，以使每个集合内的操作与其他集合内的操作物理上独立。

请注意，Milvus实例在启动时会维护一个默认的资源组，用于保存所有查询节点，并将其命名为**__default_resource_group**。您可以将一些节点从默认资源组移动到您创建的资源组中。

### 管理资源组

本页中的所有代码示例均使用PyMilvus 2.2.8。在运行它们之前，请升级您的PyMilvus安装。

1. 创建资源组。

要创建资源组，请在连接到Milvus实例后运行以下命令。以下代码片段假定`default`是您的Milvus连接别名。

```
import pymilvus

# A resource group name should be a string of 1 to 255 characters, starting with a letter or an underscore (_) and containing only numbers, letters, and underscores (_).
name = "rg"

try:
    utility.create_resource_group(name, using='default')
    print(f"Succeeded in creating resource group {name}.")
except Exception:
    print("Failed to create the resource group.")

# Succeeded in creating resource group rg.

```
2. 列出资源组。

创建资源组后，可以在资源组列表中看到它。

要查看Milvus实例中的资源组列表，请执行以下操作：

```
rgs = utility.list_resource_groups(using='default')
print(f"Resource group list: {rgs}")

# Resource group list: ['__default_resource_group', 'rg']

```
3. 描述资源组。

可以按如下方式让Milvus描述所关注的资源组：

```
info = utility.describe_resource_group(name, using="default")
print(f"Resource group description: {info}")

# Resource group description: 
#        <name:"rg">,           // string, rg name
#        <capacity:1>,            // int, num_node which has been transfer to this rg
#        <num_available_node:0>,  // int, available node_num, some node may shutdown
#        <num_loaded_replica:{}>, // map[string]int, from collection_name to loaded replica of each collecion in this rg
#        <num_outgoing_node:{}>,  // map[string]int, from collection_name to outgoging accessed node num by replica loaded in this rg 
#        <num_incoming_node:{}>.  // map[string]int, from collection_name to incoming accessed node num by replica loaded in other rg

```
4. 在资源组之间转移节点。

您可能会注意到，描述的资源组尚未具有任何查询节点。按以下方式将一些节点从默认资源组移动到您创建的资源组中：

```
source = '__default_resource_group'
target = 'rg'
num_nodes = 1

try:
    utility.transfer_node(source, target, num_nodes, using="default")
    print(f"Succeeded in moving {num_node} node(s) from {source} to {target}.")
except Exception:
    print("Something went wrong while moving nodes.")

# Succeeded in moving 1 node(s) from __default_resource_group to rg.

```
5. 将集合和分区加载到资源组中。

一旦资源组中有查询节点，就可以将集合加载到该资源组中。以下代码段假设已经存在一个名为`demo`的集合。

```
from pymilvus import Collection

collection = Collection('demo')

# Milvus loads the collection to the default resource group.
collection.load(replica_number=2)

# Or, you can ask Milvus load the collection to the desired resource group.
# make sure that query nodes num should be greater or equal to replica_number
resource_groups = ['rg']
collection.load(replica_number=2, _resource_group=resource_groups) 

```

此外，您可以将一个分区加载到资源组中，并将其副本分布在多个资源组中。以下假设已经存在一个名为`Books`的集合，它有一个名为`Novels`的分区。

```
collection = Collection("Books")

# Use the load method of a collection to load one of its partition
collection.load(["Novels"], replica_number=2, _resource_group=resource_groups)

# Or, you can use the load method of a partition directly
partition = Partition(collection, "Novels")
partition.load(replica_number=2, _resource_group=resource_groups)

```

请注意，`_resource_group`是一个可选参数，如果不指定，则可以让Milvus将副本加载到默认资源组的查询节点上。

为了让Milus将集合的每个副本加载到单独的资源组中，请确保资源组的数量等于副本的数量。
6. 在资源组之间转移副本。

Milvus使用[副本](replica.md)来实现分布在多个查询节点上的[段](glossary.md#Segment)的负载均衡。您可以按以下方式将某个集合的某些副本从一个资源组移动到另一个资源组中：

```
source = '__default_resource_group'
target = 'rg'
collection_name = 'c'
num_replicas = 1

try:
    utility.transfer_replica(source, target, collection_name, num_replicas, using="default")
    print(f"Succeeded in moving {num_node} replica(s) of {collection_name} from {source} to {target}.")
except Exception:
    print("Something went wrong while moving replicas.")

# Succeeded in moving 1 replica(s) of c from __default_resource_group to rg.

```
7. 删除资源组。

如果资源组中没有查询节点，您可以随时删除资源组。在本指南中，资源组`rg`现在有一个查询节点。在删除此资源组之前，您需要将其移动到另一个资源组中。

```
source = 'rg'
target = '__default_resource_group'
num_nodes = 1

try:
    utility.transfer_node(source, target, num_nodes, using="default")
    utility.drop_resource_group(source, using="default")
    print(f"Succeeded in dropping {source}.")
except Exception:
    print(f"Something went wrong while dropping {source}.")

```

接下来的步骤
------

要部署多租户Milvus实例，请阅读以下内容：

* [启用RBAC](rbac.md)

* [用户和角色](users_and_roles.md)
