


                # 索引向量字段

                本指南将指导你创建和管理集合中向量字段索引的基本操作。

                ## 概述

                借助存储在索引文件中的元数据，Milvus 会将你的数据组织成一种专门的结构，从而在搜索或查询过程中快速检索所请求的信息。

                Milvus 提供了 [几种索引类型](/reference/index.md)，用于对字段值进行排序，以进行高效的相似性搜索。它还提供了三种 [度量类型](https://milvus.io/docs/metric.md#Similarity-Metrics)：__余弦相似度__（COSINE）、__欧氏距离__（L2）和 __内积__（IP），用于测量向量嵌入之间的距离。

                建议为经常访问的向量字段和标量字段都创建索引。

                <div class="alert note">

                本页上的代码段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在以后的更新中发布。

                </div>

                ## 准备工作

                如 [管理集合](/userGuide/manage-collections.md) 中所述，如果在创建集合时指定了以下任一条件，则 Milvus 会自动生成索引并将其加载到内存中：

                - 向量字段的维数和度量类型，或
                - 模式和索引参数。

                下面的代码片段重用了现有代码，用于建立与 Milvus 实例的连接并创建一个不指定索引参数的集合。在这种情况下，集合缺少索引并且未加载。

                ```python
                from pymilvus import MilvusClient, DataType

                # 1. 设置Milvus客户端
                client = MilvusClient(
                    uri="http://localhost:19530"
                )

                # 2. 创建模式
                # 2.1. 创建模式
                schema = MilvusClient.create_schema(
                    auto_id=False,
                    enable_dynamic_field=True,
                )

                # 2.2. 向模式中添加字段
                schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
                schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)

                # 3. 创建集合
                client.create_collection(
                    collection_name="customized_setup", 
                    schema=schema, 
                )
                ```

                ## 为集合创建索引

                要为集合创建索引或为集合创建索引，你需要设置索引参数并调用 `create_index()`。

                ```python
                # 4.1. 设置索引参数
                index_params = MilvusClient.prepare_index_params()

                # 4.2. 在向量字段上添加索引。
                index_params.add_index(
                    field_name="vector",
                    metric_type="COSINE",
                    index_type=,
                    index_name="vector_index"
                )

                # 4.3. 创建索引文件
                client.create_index(
                    collection_name="customized_setup",
                    index_params=index_params
                )
                ```

                <div class="admonition note">

                <p> <b> 注意 </b> </p>

                <p> 目前，你只能为集合中的每个字段创建一个索引文件。</p>

                </div>

                ## 检查索引详情
                 



创建索引后，你可以检查其详细信息。

```python
# 5. 描述索引
res = client.list_indexes(
    collection_name="customized_setup"
)

print(res)

# 输出
#
# [
#     "vector_index",
# ]

res = client.describe_index(
    collection_name="customized_setup",
    index_name="vector_index"
)

print(res)

# 输出
#
# {
#     "index_type": ,
#     "metric_type": "COSINE",
#     "field_name": "vector",
#     "index_name": "vector_index"
# }
```


你可以检查在特定字段上创建的索引文件，并收集使用此索引文件索引的行数的统计信息。

## 删除索引


# 
你可以在不再需要索引时直接删除它。

```python
# 6. 删除索引
client.drop_index(
    collection_name="customized_setup",
    index_name="vector_index"
)
```
