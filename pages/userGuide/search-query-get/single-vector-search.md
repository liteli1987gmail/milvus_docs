---
id: single-vector-search.md
order: 1
summary: This article describes how to search for vectors in a Milvus collection using a single query vector.
title: Single-Vector Search
---

# 单向量搜索

一旦您插入了数据，下一步就是在 Milvus 中对您的集合执行相似性搜索。

Milvus 允许您根据集合中向量字段的数量进行两种类型的搜索：

- **单向量搜索**：如果您的集合只有一个向量字段，使用 [`search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/MilvusClient/Vector/search.md) 方法查找最相似的实体。此方法将您的查询向量与集合中的现有向量进行比较，并返回最接近匹配项的 ID 以及它们之间的距离。可选地，它还可以返回结果的向量值和元数据。
- **多向量搜索**：对于具有两个或更多向量字段的集合，使用 [`hybrid_search()`](https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Collection/hybrid_search.md) 方法。此方法执行多个近似最近邻（ANN）搜索请求，并将结果组合以在重新排名后返回最相关的匹配项。

本指南重点介绍如何在 Milvus 中执行单向量搜索。有关多向量搜索的详细信息，请参阅 [混合搜索](https://milvus.io/docs/multi-vector-search.md)。

## 概览

有多种搜索类型以满足不同需求：

- [基本搜索](https://milvus.io/docs/single-vector-search.md#Basic-search)：包括单向量搜索、批量向量搜索、分区搜索和指定输出字段的搜索。

- [过滤搜索](https://milvus.io/docs/single-vector-search.md#Filtered-search)：根据标量字段应用过滤条件以细化搜索结果。

- [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search)：查找与查询向量在特定距离范围内的向量。

- [分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search)：根据特定字段对搜索结果进行分组，以确保结果的多样性。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a> (Python) 与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备工作

以下代码片段重新利用现有代码建立与 Milvus 的连接，并快速设置集合。

```python
from pymilvus import MilvusClient

# 1. 设置 Milvus 客户端
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 插入随机生成的向量
colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {"id": i, "vector": [ random.uniform(-1, 1) for _ in range(5) ], "color": f"{random.choice(colors)}_{str(random.randint(1000, 9999))}" } for i in range(1000) ]

res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)

# 输出
#
# {
#     "insert_count": 1000
# }
```

## 基本搜索

发送 `search` 请求时，您可以提供表示查询嵌入的一个或多个向量值，以及指示要返回的结果数量的 `limit` 值。

根据您的数据和查询向量，您可能会得到少于 `limit` 的结果。当 `limit` 大于查询的可能匹配向量数量时，就会发生这种情况。

### 单向量搜索

单向量搜索是 Milvus 中 `search` 操作的最简单形式，旨在找到给定查询向量最相似的向量。

要执行单向量搜索，请指定目标集合名称、查询向量和所需的结果数量（`limit`）。此操作返回包含最相似向量、它们的 ID 以及与查询向量的距离的结果集。

以下是搜索与查询向量最相似的前 5 个实体的示例：

```python
# 单向量搜索
res = client.search(
    collection_name="test_collection", # 替换为您集合的实际名称
    # 替换为您的查询向量
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # 返回的搜索结果的最大数量
   search_params={"metric_type": "IP", "params": {}} # Search parameters
)

# Convert the output to a formatted JSON string
result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 0,
            "distance": 1.4093276262283325,
            "entity": {}
        },
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {}
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {}
        },
        {
            "id": 5,
            "distance": 0.7972343564033508,
            "entity": {}
        },
        {
            "id": 2,
            "distance": 0.5928734540939331,
            "entity": {}
        }
    ]
]
```

The output showcases the top 5 neighbors nearest to your query vector, including their unique IDs and the calculated distances.

### Bulk-vector search

A bulk-vector search extends the [single-vector search](https://milvus.io/docs/single-vector-search.md#Single-Vector-Search) concept by allowing multiple query vectors to be searched in a single request. This type of search is ideal for scenarios where you need to find similar vectors for a set of query vectors, significantly reducing the time and computational resources required.

In a bulk-vector search, you can include several query vectors in the `data` field. The system processes these vectors in parallel, returning a separate result set for each query vector, each set containing the closest matches found within the collection.

Here is an example of searching for two distinct sets of the most similar entities from two query vectors:

```python
# Bulk-vector search
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[
        [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104],
        [0.3172005263489739, 0.9719044792798428, -0.36981146090600725, -0.4860894583077995, 0.95791889146345]
    ], # Replace with your query vectors
    limit=2, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}} # Search parameters
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 1,
            "distance": 1.3017789125442505,
            "entity": {}
        },
        {
            "id": 7,
            "distance": 1.2419954538345337,
            "entity": {}
        }
    ], # Result set 1
    [
        {
            "id": 3,
            "distance": 2.3358664512634277,
            "entity": {}
        },
        {
            "id": 8,
            "distance": 0.5642921924591064,
            "entity": {}
        }
    ] # Result set 2
]
```

The results include two sets of nearest neighbors, one for each query vector, showcasing the efficiency of bulk-vector searches in handling multiple query vectors at once.

### Partition search

Partition search narrows the scope of your search to a specific subset or partition of your collection. This is particularly useful for organized datasets where data is segmented into logical or categorical divisions, allowing for faster search operations by reducing the volume of data to scan.

To conduct a partition search, simply include the name of the target partition in `partition_names` of your search request. This specifies that the `search` operation only considers vectors within the specified partition.

Here is an example of searching for entities in `partition_1`:

```python
# Search in partition_1
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[0.02174828545444263, 0.058611125483182924, 0.6168633415965343, -0.7944160935612321, 0.5554828317581426]],
    limit=5, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}}, # Search parameters
    partition_names=["partition_1"] # Partition names to search in
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 16,
            "distance": 0.9200337529182434,
            "entity": {}
        },
        {
            "id": 14,
            "distance": 0.4505271911621094,
            "entity": {}
        },
        {
            "id": 15,
            "distance": 0.19924677908420563,
            "entity": {}
        },
        {
            "id": 17,
            "distance": 0.0075093843042850494,
            "entity": {}
        },
        {
            "id": 13,
            "distance": -0.14609718322753906,
            "entity": {}
        }
    ]
]
```

Then, search for entities in `partition_2`:

```python
# Create a MilvusClient instance
client = MilvusClient(
    uri="http://localhost:19530",
)

# Search in partition_2
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[-0.2798451532635784, 0.9486592746891414, -0.9311928407781922, 0.1830057032090473, 0.6962886429672028]],
    limit=5, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}}, # Search parameters
    partition_names=["partition_2"] # Partition names to search in
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 20,
            "distance": 2.363696813583374,
            "entity": {}
        },
        {
            "id": 26,
            "distance": 1.0665391683578491,
            "entity": {}
        },
        {
            "id": 23,
            "distance": 1.066049575805664,
            "entity": {}
        },
        {
            "id": 29,
            "distance": 0.8353596925735474,
            "entity": {}
        },
        {
            "id": 28,
            "distance": 0.7484277486801147,
            "entity": {}
        }
    ]
]
```

The data in `partition_1` differs from that in `partition_2`. Therefore, the search results will be constrained to the specified partition, reflecting the unique characteristics and data distribution of that subset.

### Search with output fields

Search with output fields allows you to specify which attributes or fields of the matched vectors should be included in the search results.

You can specify `output_fields` in a request to return results with specific fields.

Here is an example of returning results with `color` attribute values:

```python
# Search with output fields
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}}, # Search parameters
    output_fields=["color"] # Output fields to return
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 0,
            "distance": 1.4093276262283325,
            "entity": {
                "color": "pink_8682"
            }
        },
        {
            "id": 16,
            "distance": 1.0159327983856201,
            "entity": {
                "color": "yellow_1496"
            }
        },
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {
                "color": "red_4794"
            }
        },
        {
            "id": 14,
            "distance": 0.9803846478462219,
            "entity": {
                "color": "green_2899"
            }
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {
                "color": "red_7025"
            }
        }
    ]
]
```

Alongside the nearest neighbors, the search results will include the specified field `color`, providing a richer set of information for each matching vector.

## Filtered search

Filtered search applies scalar filters to vector searches, allowing you to refine the search results based on specific criteria. You can find more about filter expressions in [Boolean Expression Rules](https://milvus.io/docs/boolean.md) and examples in [Get & Scalar Query](https://milvus.io/docs/get-and-scalar-query.md).

For instance, to refine search results based on a string pattern, you can use the **like** operator. This operator enables string matching by considering prefixes, infixes, and suffixes:

- To match values starting with a specific prefix, use the syntax **'like "prefix%"'**.

- To match values containing a specific sequence of characters anywhere within the string, use the syntax **'like "%infix%"'**.

- To match values ending with a specific suffix, use the syntax **'like "%suffix"'**.

- The **like** operator can also be used for single-character matching by using the underscore (\_) to represent any single character. For example, **'like "y_llow"'**.

Filter results whose **color** is prefixed with **red**:

```python
# Search with filter
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}}, # Search parameters
    output_fields=["color"], # Output fields to return
    filter='color like "red%"'
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {
                "color": "red_4794"
            }
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {
                "color": "red_7025"
            }
        },
        {
            "id": 6,
            "distance": -0.4113418459892273,
            "entity": {
                "color": "red_9392"
            }
        }
    ]
]
```

Filter results whose **color** contains the letters **ll** anywhere within the string:

```python
# Infix match on color field
res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=5, # Max. number of search results to return
    search_params={"metric_type": "IP", "params": {}}, # Search parameters
    output_fields=["color"], # Output fields to return
    filter='color like "%ll%"' # Filter on color field, infix match on "ll"
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 5,
            "distance": 0.7972343564033508,
            "entity": {
                "color": "yellow_4222"
            }
        }
    ]
]
```

## Range search

Range search allows you to find vectors that lie within a specified distance range from your query vector.

By setting `radius` and optionally `range_filter`, you can adjust the breadth of your search to include vectors that are somewhat similar to the query vector, providing a more comprehensive view of potential matches.

- `radius`: Defines the outer boundary of your search space. Only vectors that are within this distance from the query vector are considered potential matches.

- `range_filter`: While `radius` sets the outer limit of the search, `range_filter` can be optionally used to define an inner boundary, creating a distance range within which vectors must fall to be considered matches.

```python
# Conduct a range search
search_params = {
    "metric_type": "IP",
    "params": {
        "radius": 0.8, # Radius of the search circle
        "range_filter": 1.0 # Range filter to filter out vectors that are not within the search circle
    }
}

res = client.search(
    collection_name="test_collection", # Replace with the actual name of your collection
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=3, # Max. number of search results to return
    search_params=search_params, # Search parameters
    output_fields=["color"], # Output fields to return
)

result = json.dumps(res, indent=4)
print(result)
```

The output is similar to the following:

```python
[
    [
        {
            "id": 4,
            "distance": 0.9902134537696838,
            "entity": {
                "color": "red_4794"
            }
        },
        {
            "id": 14,
            "distance": 0.9803846478462219,
            "entity": {
                "color": "green_2899"
            }
        },
        {
            "id": 1,
            "distance": 0.8519943356513977,
            "entity": {
                "color": "red_7025"
            }
        }
    ]
]
```

You will observe that all the entities returned have a distance that falls within the range of 0.8 to 1.0 from the query vector.

The parameter settings for `radius` and `range_filter` vary with the metric type in use.

| **Metric Type** | **Charactericstics**                             | **Range Search Settings**                                                                            |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `L2`            | Smaller L2 distances indicate higher similarity. | To exclude the closest vectors from results, ensure that:<br/> `range_filter` <= distance < `radius` |
| `IP`            | Larger IP distances indicate higher similarity.  | To exclude the closest vectors from results, ensure that:<br/> `radius` < distance <= `range_filter` |

## Grouping search

In Milvus, grouping search by a specific field can avoid redundancy of the same field item in the results. You can get a varied set of results for the specific field.

Consider a collection of documents, each document splits into various passages. Each passage is represented by one vector embedding and belongs to one document. To find relevant documents instead of similar passages, you can include the `group_by_field` argument in the `search()` opeartion to group results by the document ID. This helps return the most relevant and unique documents, rather than separate passages from the same document.

Here is the example code to group search results by field:

```python
# Connect to Milvus
client = MilvusClient(uri='http://localhost:19530') # Milvus server address

# Load data into collection
client.load_collection("group_search") # Collection name

# Group search results
res = client.search(
    collection_name="group_search", # Collection name
    data=[[0.14529211512077012, 0.9147257273453546, 0.7965055218724449, 0.7009258593102812, 0.5605206522382088]], # Query vector
    search_params={
    "metric_type": "L2",
    "params": {"nprobe": 10},
    }, # Search parameters
    limit=10, # Max. number of search results to return
    group_by_field="doc_id", # Group results by document ID
    output_fields=["doc_id", "passage_id"]
)

# Retrieve the values in the `doc_id` column
doc_ids = [result['entity']['doc_id'] for result in res[0]]

print(doc_ids)
```

The output is similar to the following:

```python
[5, 10, 1, 7, 9, 6, 3, 4, 8, 2]
```

In the given output, it can be observed that the returned entities do not contain any duplicate `doc_id` values.

For comparison, let's comment out the `group_by_field` and conduct a regular search:

```python
# Connect to Milvus
client = MilvusClient(uri='http://localhost:19530') # Milvus server address

# Load data into collection
client.load_collection("group_search") # Collection name

# Search without `group_by_field`
res = client.search(
    collection_name="group_search", # Collection name
    data=query_passage_vector, # Replace with your query vector
    search_params={
    "metric_type": "L2",
    "params": {"nprobe": 10},
    }, # Search parameters
    limit=10, # Max. number of search results to return
    # group_by_field="doc_id", # Group results by document ID
    output_fields=["doc_id", "passage_id"]
)

# Retrieve the values in the `doc_id` column
doc_ids = [result['entity']['doc_id'] for result in res[0]]

print(doc_ids)
```

The output is similar to the following:

```python
[1, 10, 3, 10, 1, 9, 4, 4, 8, 6]
```

In the given output, it can be observed that the returned entities contain duplicate `doc_id` values.

**Limitations**

- **Indexing**: This grouping feature works only for collections that are indexed with the **HNSW**, **IVF_FLAT**, or **FLAT** type. For more information, refer to [In-memory Index](https://milvus.io/docs/index.md#HNSW).

- **Vector**: Currently, grouping search does not support a vector field of the **BINARY_VECTOR** type. For more information on data types, refer to [Supported data types](https://milvus.io/docs/schema.md#Supported-data-types).

- **Field**: Currently, grouping search allows only for a single column. You cannot specify multiple field names in the `group_by_field` config. Additionally, grouping search is incompatible with data types of JSON, FLOAT, DOUBLE, ARRAY, or vector fields.

- **Performance Impact**: Be mindful that performance degrades with increasing query vector counts. Using a cluster with 2 CPU cores and 8 GB of memory as an example, the execution time for grouping search increases proportionally with the number of input query vectors.

- **Functionality**: Currently, grouping search is not supported by [range search](https://milvus.io/docs/single-vector-search.md#Range-search), [search iterators](https://milvus.io/docs/with-iterators.md#Search-with-iterator), or [multi-vector search](multi-vector-search.md)

## Search parameters

In the above searches except the range search, the default search parameters apply. In normal cases, you do not need to manually set search parameters.

```python
# In normal cases, you do not need to set search parameters manually
# Except for range searches.
search_parameters = {
    'metric_type': 'L2',
    'params': {
        'nprobe': 10,
        'level': 1，
        'radius': 1.0
        'range_filter': 0.8
    }
}
```

The following table lists all possible settings in the search parameters.

| **Parameter Name**    | **Parameter Description**                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metric_type`         | How to measure similarity between vector embeddings.<br/> Possible values are `IP`, `L2`, and `COSINE`, and defaults to that of the loaded index file.     |
| `params.nprobe`       | Number of units to query during the search.<br/> The value falls in the range [1, nlist<sub>[1]</sub>].                                                    |
| `params.level`        | Search precision level.<br/> Possible values are `1`, `2`, and `3`, and defaults to `1`. Higher values yield more accurate results but slower performance. |
| `params.radius`       | Minimum similarity between the query vector and candidate vectors.<br/> The value falls in the range [1, nlist<sub>[1]</sub>].                             |
| `params.range_filter` | A similarity range, optionally refining the search for vectors that fall in the range.<br/> The value falls in the range [top-K<sub>[2]</sub>, ∞].         |

<div class="admonition note">

<p><b>notes</b></p>

<p>[1] Number of cluster units after indexing. When indexing a collection, Milvus sub-divides the vector data into multiple cluster units, the number of which varies with the actual index settings.</p>
<p>[2] Number of entities to return in a search.</p>

</div>
