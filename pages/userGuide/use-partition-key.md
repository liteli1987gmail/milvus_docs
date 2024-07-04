


# 使用分区键

本指南将指导你如何使用分区键来加速从集合中检索数据。

## 概述

Milvus 中的分区键允许根据其相应的分区键值将传入的实体分布到不同的分区中。这使得具有相同键值的实体可以在一个分区中分组，从而在按键字段进行过滤时避免了扫描不相关的分区，从而加快搜索性能。与传统的过滤方法相比，分区键可以极大地提升查询性能。

你可以使用分区键来实现多租户。有关多租户的详细信息，请阅读 [多租户](/reference/multi_tenancy.md)。

<div class="alert note">

本页上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a> (Python) 与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将会在未来的更新中发布。

</div>

## 启用分区键

为了演示使用分区键的用法，我们将继续使用包含超过 5000 篇文章的示例数据集，其中 __publication__ 字段将作为分区键。

```python
import json, time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

COLLECTION_NAME="medium_articles_2020" # 设置你的集合名称
DATASET_PATH="{}/../medium_articles_2020_dpr.json".format(os.path.dirname(__file__)) # 设置你的数据集路径

# 1. 连接到集群
client = MilvusClient(
    uri="http://localhost:19530"
)

# 2. 定义集合模式
schema = MilvusClient.create_schema(
    auto_id=True,
    partition_key_field="publication"
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="title_vector", datatype=DataType.FLOAT_VECTOR, dim=768)
schema.add_field(field_name="link", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="reading_time", datatype=DataType.INT64)
schema.add_field(field_name="publication", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="claps", datatype=DataType.INT64)
schema.add_field(field_name="responses", datatype=DataType.INT64)
```

定义字段后，设置其他必要的参数。

```python
# 3. 定义索引参数
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="title_vector",
    index_type="AUTOINDEX",
    metric_type="L2"
)
```

最后，你可以创建一个集合。

```python
# 4. 创建一个集合
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

## 插入数据

一旦集合准备好，可以按照以下方式开始插入数据：

### 准备数据

```python
with open(DATASET_PATH) as f:
    data = json.load(f)
    list_of_rows = data['rows']

    data_rows = []
    for row in list_of_rows:
        # 删除 id 字段，因为启用了自动 id 的主键。
        del row['id']
        # 将行中的 title 和 title_vector 以外的其他键视为动态字段。
        data_rows.append(row)
```

### 插入数据




# 7. 插入数据
res = client.insert(
    collection_name = COLLECTION_NAME,
    data = data_rows,
)

# 输出
#
# {
#     "insert_count": 5979
# }

time.sleep(5000)

## 使用分区键

一旦你已经对集合进行了索引和加载，并插入了数据，你可以使用分区键进行相似性搜索。

<div class="admonition note">

<p> <b> 注解 </b> </p>

<p> 为了使用分区键进行相似性搜索，你应该在搜索请求的布尔表达式中包含以下之一：</p>
<ul>
<li> <p> <code> expr ='&lt; partition_key&gt;== "xxxx"'</code> </p> </li>
<li> <p> <code> expr ='&lt; partition_key&gt; in ["xxx", "xxx"]'</code> </p> </li>
</ul>
<p> 请将 <code>&lt; partition_key&gt; </code> 替换为指定为分区键的字段的名称。</p>

</div>

```python
res = client.search(
    collection_name=COLLECTION_NAME,
    data=[data_rows[0]['title_vector']],
    filter='claps > 30 and reading_time < 10',
    limit=3,
    output_fields=["title", "reading_time", "claps"],
    search_params={"metric_type": "L2", "params": {}}
)

print(result)
```

## 使用案例




为了达到更好的搜索性能和实现多租户功能，你可以利用分区键特性。可以通过为每个实体分配一个租户特定的值作为分区键字段来实现。在搜索或查询集合时，可以通过在布尔表达式中包含分区键字段来按租户特定值过滤实体。这种方法确保了租户间的数据隔离，并避免扫描不必要的分区。

