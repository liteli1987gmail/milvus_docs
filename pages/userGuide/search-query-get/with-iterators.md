---
id: 使用迭代器.md
order: 4
summary: Milvus 提供了搜索和查询迭代器，用于迭代处理大量实体的结果。
title: 使用迭代器
---

# 使用迭代器

Milvus 提供了搜索和查询迭代器，用于迭代处理大量实体的结果。

## 概览

迭代器是强大的工具，它通过使用主键值和布尔表达式帮助您浏览大型数据集。这可以显著改善您检索数据的方式。与传统的 **offset** 和 **limit** 参数使用相比，随着时间的推移，迭代器提供了更可扩展的解决方案。

### 使用迭代器的好处

- **简单性**：消除了复杂的 **offset** 和 **limit** 设置。

- **效率**：通过仅获取所需的数据提供可扩展的数据检索。

- **一致性**：确保使用布尔过滤器时数据集大小的一致性。

<div class="admonition note">

<p><b>注意</b></p>

<ul>

<li>此功能适用于 Milvus 2.3.x 或更高版本。</li>

<li>本页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。</li>

</ul>

</div>

## 准备工作

以下步骤重新利用代码连接到 Milvus，快速设置一个集合，并将超过 10,000 个随机生成的实体插入到集合中。

### 第 1 步：创建一个集合

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
)
```

### 第 2 步：插入随机生成的实体

```python
# 3. 插入随机生成的向量
colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {
        "id": i,
        "vector": [ random.uniform(-1, 1) for _ in range(5) ],
        "color": random.choice(colors),
        "tag": random.randint(1000, 9999)
    } for i in range(10000) ]

for i in data:
    i["color_tag"] = "{}_{}".format(i["color"], i["tag"])

print(data[0])

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
#     "color": "grey",
#     "tag": 5024,
#     "color_tag": "grey_5024"
# }

# 4. 将实体插入集合
res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# 输出
#
# {
#     "insert_count": 10000
# }
```

## 使用迭代器进行搜索

迭代器使相似性搜索更具可扩展性。要使用迭代器进行搜索，请执行以下操作：

1. 初始化搜索迭代器以定义搜索参数和输出字段。

2. 在循环中使用 **next**() 方法分页浏览搜索结果。

   - 如果该方法返回一个空数组，则循环结束，没有更多的页面可用。

   - 所有结果都带有指定的输出字段。

3. 一旦检索完所有数据，手动调用 **close**() 方法关闭迭代器。

```python
from pymilvus import Collection

# 1. 获取准备好的集合
collection = Collection("quick_setup")

# 2. 设置搜索参数
search_params = {
    "metric_type": "IP",
    "params": {}
}


# 3. Initialize a search iterator
iterator = collection.search_iterator(
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    anns_field="vector",
    batch_size=10, # Controls the size of the return each time you call next()
    param=search_params,
    output_fields=["color_tag"]
)

# 4. Iterate the search results
results = []

while True:
    result = iterator.next()
    if len(result) == 0:
        iterator.close()
        break;

    results.extend(result)

# 5. Check the search results
print(len(results))

print(results[:3])
```

## Query with an iterator

```python
# 6. Initialize a query iterator
iterator = collection.query_iterator(
    batch_size=10, # Controls the size of the return each time you call next()
    expr="color_tag like \"brown_8\""
    output_fields=["color_tag"]
)

# 7. Iterator the query results
results = []

while True:
    result = iterator.next()
    if len(result) == 0:
        iterator.close()
        break;

    results.extend(result)

# 8. Check the search results
print(len(results))

print(results[:3])
```
