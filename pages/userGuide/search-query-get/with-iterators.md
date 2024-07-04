


# 使用迭代器

Milvus 提供了用于处理大量实体的搜索和查询迭代器，帮助你遍历大型数据集。

## 概述

迭代器是一种强大的工具，通过使用主键值和布尔表达式来帮助你导航大型数据集。这可以显著改善你检索数据的方式。与传统的 __offset__ 和 __limit__ 参数不同，后者可能随着时间的推移变得不太高效，迭代器提供了一种更可扩展的解决方案。

### 使用迭代器的好处

- __简单性__：消除了复杂的 __offset__ 和 __limit__ 设置。

- __高效性__：通过仅获取所需数据来提供可扩展的数据检索。

- __一致性__：使用布尔过滤器确保一致的数据集大小。

<div class="admonition note">

<p> <b> 注：</b> </p>

<ul>

<li> 此功能适用于 Milvus 2.3.x 或更高版本。</li>

<li> 本页面中的代码段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。将来会发布其他语言的新 MilvusClient SDK。</li>

</ul>

</div>

## 准备工作

以下步骤将重构代码以连接到 Milvus，快速设置集合，并将 10,000 多个随机生成的实体插入集合。

### 步骤 1：创建集合

```python
from pymilvus import MilvusClient

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 创建集合
client.create_collection(
    collection_name="quick_setup",
    dimension=5,
)
```

### 步骤 2：插入随机生成的实体




# 3. 插入随机生成的向量
colors = ["绿色", "蓝色", "黄色", "红色", "黑色", "白色", "紫色", "粉色", "橙色", "棕色", "灰色"]
data = [ {
        "id": i, 
        "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
        "color": random.choice(colors), 
        "tag": random.randint(1000, 9999) 
    } for i in range(10000) ]

for i in data:
    i ["color_tag"] = "{}_{}".format(i ["color"], i ["tag"])

print(data [0])

# 输出
#
# {
#     "id": 0,
#     "vector": [
#         0.5913205104316952,
#         -0.5474675922381218,
#         0.9433357315736743,
#         0.22479148416151284,
#         0.28294612647978834
#     ],
#     "color": "灰色",
#     "tag": 5024,
#     "color_tag": "灰色_5024"
# }

# 4. 插入集合的实体
res = client.insert(
    collection_name = "quick_setup",
    data = data
)

print(res)

# 输出
#
# {
#     "insert_count": 10000
# }

## 使用迭代器进行搜索

迭代器使相似度搜索更加可扩展。要使用迭代器进行搜索，请按以下步骤进行操作：

1. 初始化搜索迭代器以定义搜索参数和输出字段。

1. 使用循环内的 __next()__ 方法来遍历搜索结果。

    - 如果该方法返回一个空数组，则循环结束，没有更多的页面可用。

    - 所有结果都带有指定的输出字段。

1. 在检索完所有数据后，手动调用 __close()__ 方法关闭迭代器。

```python
from pymilvus import Collection

# 1. 获取准备好的集合
collection = Collection("quick_setup")

# 2. 设置搜索参数
search_params = {
    "metric_type": "IP",
    "params": {}
}

# 3. 初始化搜索迭代器
iterator = collection.search_iterator(
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    anns_field="vector",
    batch_size=10, # 控制每次调用 next() 时返回的大小
    param=search_params,
    output_fields=["color_tag"]
)

# 4. 遍历搜索结果
results = []

while True:
    result = iterator.next()
    if len(result) == 0:
        iterator.close()
        break;
        
    results.extend(result)
    
# 5. 检查搜索结果
print(len(results))

print(results[:3])
```

## 使用迭代器进行查询




# 6. 初始化查询迭代器
iterator = collection.query_iterator(
    batch_size = 10, # 控制每次调用 next()返回的结果的数量
    expr = "color_tag like \" brown_8\"",
    output_fields = ["color_tag"]
)

# 7. 遍历查询结果
results = []

while True:
    result = iterator.next()
    if len(result) == 0:
        iterator.close()
        break;
        
    results.extend(result)
    
# 8. 检查搜索结果
print(len(results))

print(results [: 3])
