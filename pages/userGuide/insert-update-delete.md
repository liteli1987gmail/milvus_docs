---
id: insert-update-delete.md
summary: This guide walks you through the data manipulation operations within a collection, including insertion, upsertion, and deletion.
title: Insert, Upsert & Delete
---

# 插入、上插和删除

本指南将指导您完成集合内的数据操作，包括插入、上插（upsert）和删除。

## 开始之前

- 您已安装了您选择的 SDK。要安装 SDK，请参考 [安装 SDK](https://milvus.io/docs/install-pymilvus.md)。

- 您已创建了一个集合。要创建集合，请参考 [管理集合](manage-collections.md)。

- 如果要插入大量数据，建议您使用 [数据导入](https://milvus.io/api-reference/pymilvus/v2.4.x/DataImport/LocalBulkWriter/LocalBulkWriter.md)。

## 概述

在 Milvus 集合的上下文中，实体是集合中的一个单一、可识别的实例。它代表一个特定类别的一个独特成员，无论是图书馆中的一本书、基因组中的一个基因，还是任何其他可识别的实体。

集合中的实体共享一组称为模式（schema）的共同属性，该模式概述了每个实体必须遵守的结构，包括字段名称、数据类型和任何其他约束。

成功将实体插入集合需要提供的数据应包含目标集合中定义的所有模式字段。此外，如果您已启用动态字段，您还可以包括非模式定义的字段。有关详细信息，请参考 [启用动态字段](enable-dynamic-field.md)。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

下面的代码片段重新利用现有代码，建立与 Milvus 集群的连接，并快速设置一个集合。

```python
from pymilvus import MilvusClient

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建一个集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5,
    metric_type="IP"
)
```

<div class="admonition note">

<p><b>注意</b></p>

<p>上述代码生成的集合仅包含两个字段：<strong>id</strong>（作为主键）和 <code>vector</code>（作为向量字段），<strong>auto<em>id</strong> 和 <strong>enable</em>dynamic_field</strong> 设置默认启用。当插入数据时，</p>
<ul>
<li><p>您不需要在要插入的数据中包含 <strong>id</strong>，因为主键字段在插入数据时会自动递增。</p></li>
<li><p>非模式定义的字段将作为键值对保存在名为 <strong>$meta</strong> 的保留 JSON 字段中。</p></li>
</ul>

</div>

## 插入实体

要插入实体，您需要将数据组织成字典列表，其中每个字典代表一个实体。每个字典包含对应于目标集合中预定义和动态字段的键。

```python
# 3. 插入一些数据
data=[
    {"id": 0, "vector": [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], "color": "pink_8682"},
    {"id": 1, "vector": [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104], "color": "red_7025"},
    # ... 其他数据 ...
]

res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# 输出
#
# {
#     "insert_count": 10,
#     "ids": [
#         0,
#         1,
#         ... 其他 ID ...
#     ]
# }
```

### 插入到分区

要将数据插入特定分区，您可以在插入请求中指定分区的名称，如下所示：

```python
# 4. 向特定分区插入更多数据
data=[
    # ... 数据 ...
]

client.create_partition(
    collection_name="quick_setup",
    partition_name="partitionA"
)

res = client.insert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "insert_count": 10,
#     "ids": [
#         0,
#         1,
#         2,
#         3,
#         4,
#         5,
#         6,
#         7,
#         8,
#         9
#     ]
# }
```

### Insert into partitions

To insert data into a specific partition, you can specify the name of the partition in the insert request as follows:

```python
# 4. Insert some more data into a specific partition
data=[
    {"id": 10, "vector": [-0.5570353903748935, -0.8997887893201304, -0.7123782431855732, -0.6298990746450119, 0.6699215060604258], "color": "red_1202"},
    {"id": 11, "vector": [0.6319019033373907, 0.6821488267878275, 0.8552303045704168, 0.36929791364943054, -0.14152860714878068], "color": "blue_4150"},
    {"id": 12, "vector": [0.9483947484855766, -0.32294203351925344, 0.9759290319978025, 0.8262982148666174, -0.8351194181285713], "color": "orange_4590"},
    {"id": 13, "vector": [-0.5449109892498731, 0.043511240563786524, -0.25105249484790804, -0.012030655265886425, -0.0010987671273892108], "color": "pink_9619"},
    {"id": 14, "vector": [0.6603339372951424, -0.10866551787442225, -0.9435597754324891, 0.8230244263466688, -0.7986720938400362], "color": "orange_4863"},
    {"id": 15, "vector": [-0.8825129181091456, -0.9204557711667729, -0.935350065513425, 0.5484069690287079, 0.24448151140671204], "color": "orange_7984"},
    {"id": 16, "vector": [0.6285586391568163, 0.5389064528263487, -0.3163366239905099, 0.22036279378888013, 0.15077052220816167], "color": "blue_9010"},
    {"id": 17, "vector": [-0.20151825016059233, -0.905239387635804, 0.6749305353372479, -0.7324272081377843, -0.33007998971889263], "color": "blue_4521"},
    {"id": 18, "vector": [0.2432286610792349, 0.01785636564206139, -0.651356982731391, -0.35848148851027895, -0.7387383128324057], "color": "orange_2529"},
    {"id": 19, "vector": [0.055512329053363674, 0.7100266349039421, 0.4956956543575197, 0.24541352586717702, 0.4209030729923515], "color": "red_9437"}
]

client.create_partition(
    collection_name="quick_setup",
    partition_name="partitionA"
)

res = client.insert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "insert_count": 10,
#     "ids": [
#         10,
#         11,
#         12,
#         13,
#         14,
#         15,
#         16,
#         17,
#         18,
#         19
#     ]
# }
```

The output is a dictionary containing the statistics on the affected entities. For details on partition operations, refer to [Manage Partitions](manage-partitions.md).

## Upsert entities

Upserting data is a combination of update and insert operations. In Milvus, an upsert operation performs a data-level action to either insert or update an entity based on whether its primary key already exists in a collection. Specifically:

- If the primary key of the entity already exists in the collection, the existing entity will be overwritten.

- If the primary key does not exist in the collection, a new entity will be inserted.

```python
# 5. Upsert some data
data=[
    {"id": 0, "vector": [-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911], "color": "black_9898"},
    {"id": 1, "vector": [0.4762662251462588, -0.6942502138717026, -0.4490002642657902, -0.628696575798281, 0.9660395877041965], "color": "red_7319"},
    {"id": 2, "vector": [-0.8864122635045097, 0.9260170474445351, 0.801326976181461, 0.6383943392381306, 0.7563037341572827], "color": "white_6465"},
    {"id": 3, "vector": [0.14594326235891586, -0.3775407299900644, -0.3765479013078812, 0.20612075380355122, 0.4902678929632145], "color": "orange_7580"},
    {"id": 4, "vector": [0.4548498669607359, -0.887610217681605, 0.5655081329910452, 0.19220509387904117, 0.016513983433433577], "color": "red_3314"},
    {"id": 5, "vector": [0.11755001847051827, -0.7295149788999611, 0.2608115847524266, -0.1719167007897875, 0.7417611743754855], "color": "black_9955"},
    {"id": 6, "vector": [0.9363032158314308, 0.030699901477745373, 0.8365910312319647, 0.7823840208444011, 0.2625222076909237], "color": "yellow_2461"},
    {"id": 7, "vector": [0.0754823906014721, -0.6390658668265143, 0.5610517334334937, -0.8986261118798251, 0.9372056764266794], "color": "white_5015"},
    {"id": 8, "vector": [-0.3038434006935904, 0.1279149203380523, 0.503958664270957, -0.2622661156746988, 0.7407627307791929], "color": "purple_6414"},
    {"id": 9, "vector": [-0.7125086947677588, -0.8050968321012257, -0.32608864121785786, 0.3255654958645424, 0.26227968923834233], "color": "brown_7231"}
]

res = client.upsert(
    collection_name='quick_setup',
    data=data
)

print(res)

# Output
#
# {
#     "upsert_count": 10
# }
```

### Upsert data in partitions

To upsert data into a specific partition, you can specify the name of the partition in the insert request as follows:

```python
# 6. Upsert data in partitions
data=[
    {"id": 10, "vector": [0.06998888224297328, 0.8582816610326578, -0.9657938677934292, 0.6527905683627726, -0.8668460657158576], "color": "black_3651"},
    {"id": 11, "vector": [0.6060703043917468, -0.3765080534566074, -0.7710758854987239, 0.36993888322346136, 0.5507513364206531], "color": "grey_2049"},
    {"id": 12, "vector": [-0.9041813104515337, -0.9610546012461163, 0.20033003106083358, 0.11842506351635174, 0.8327356724591011], "color": "blue_6168"},
    {"id": 13, "vector": [0.3202914977909075, -0.7279137773695252, -0.04747830871620273, 0.8266053056909548, 0.8277957187455489], "color": "blue_1672"},
    {"id": 14, "vector": [0.2975811497890859, 0.2946936202691086, 0.5399463833894609, 0.8385334966677529, -0.4450543984655133], "color": "pink_1601"},
    {"id": 15, "vector": [-0.04697464305600074, -0.08509022265734134, 0.9067184632552001, -0.2281912685064822, -0.9747503428652762], "color": "yellow_9925"},
    {"id": 16, "vector": [-0.9363075919673911, -0.8153981031085669, 0.7943039120490902, -0.2093886809842529, 0.0771191335807897], "color": "orange_9872"},
    {"id": 17, "vector": [-0.050451522820639916, 0.18931572752321935, 0.7522886192190488, -0.9071793089474034, 0.6032647330692296], "color": "red_6450"},
    {"id": 18, "vector": [-0.9181544231141592, 0.6700755998126806, -0.014174674636136642, 0.6325780463623432, -0.49662222164032976], "color": "purple_7392"},
    {"id": 19, "vector": [0.11426945899602536, 0.6089190684002581, -0.5842735738352236, 0.057050610092692855, -0.035163433018196244], "color": "pink_4996"}
]

res = client.upsert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "upsert_count": 10
# }
```

The output is a dictionary containing the statistics on the affected entities. For details on partition operations, refer to [Manage Partitions](manage-partitions.md).

## Delete entities

If an entity is no longer needed, you can delete it from the collection. Milvus offers two ways for you to identify the entities to delete.

- **Delete entities by filter.**

  ```python
  # 7. Delete entities
  res = client.delete(
      collection_name="quick_setup",
      filter="id in [4,5,6]"
  )

  print(res)

  # Output
  #
  # {
  #     "delete_count": 3
  # }
  ```

- **Delete entities by IDs.**

  The following snippets demonstrate how to delete entities by IDs from a specific partition. It also works if you leave the partition name unspecified.

  ```python
  res = client.delete(
      collection_name="quick_setup",
      ids=[18, 19],
      partition_name="partitionA"
  )

  print(res)

  # Output
  #
  # {
  #     "delete_count": 2
  # }
  ```

For details on how to use filter expressions, refer to [Get & Scalar Query](get-and-scalar-query.md).
