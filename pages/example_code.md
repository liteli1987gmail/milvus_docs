[Node.js](example_code_node.md)
使用Python运行Milvus
================

本主题介绍如何使用Python运行Milvus。

通过运行我们提供的示例代码，您将对Milvus的功能有一个初步的了解。

Preparations
------------

* [Milvus 2.2.8](install_standalone-docker.md)
* Python 3 (3.7.1 or later)
* [PyMilvus 2.2.8](install-pymilvus.md)

下载示例代码
------

[下载](https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.8/examples/hello_milvus.py) `hello_milvus.py` 直接或使用以下命令。

```
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.8/examples/hello_milvus.py

```

Scan the example code
---------------------

示例代码执行以下步骤。

* 导入 PyMilvus 包：

```
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

```

* 连接服务器：

```
connections.connect("default", host="localhost", port="19530")

```

* 创建集合：

```
fields = [
    FieldSchema(name="pk", dtype=DataType.INT64, is_primary=True, auto_id=False),
    FieldSchema(name="random", dtype=DataType.DOUBLE),
    FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=8)
]
schema = CollectionSchema(fields, "hello_milvus is the simplest demo to introduce the APIs")
hello_milvus = Collection("hello_milvus", schema)

```

* 在集合中插入向量：

```
import random
entities = [
    [i for i in range(3000)],  # field pk
    [float(random.randrange(-20, -10)) for _ in range(3000)],  # field random
    [[random.random() for _ in range(8)] for _ in range(3000)],  # field embeddings
]
insert_result = hello_milvus.insert(entities)
# After final entity is inserted, it is best to call flush to have no growing segments left in memory
hello_milvus.flush()  

```

* 在实体上构建索引：

```
index = {
    "index_type": "IVF_FLAT",
    "metric_type": "L2",
    "params": {"nlist": 128},
}
hello_milvus.create_index("embeddings", index)

```

* 加载集合到内存并执行向量相似度搜索：

```
hello_milvus.load()
vectors_to_search = entities[-1][-2:]
search_params = {
    "metric_type": "L2",
    "params": {"nprobe": 10},
}
result = hello_milvus.search(vectors_to_search, "embeddings", search_params, limit=3, output_fields=["random"])

```

* 执行向量查询：

```
result = hello_milvus.query(expr="random > -14", output_fields=["random", "embeddings"])

```

* 执行混合搜索：

```
result = hello_milvus.search(vectors_to_search, "embeddings", search_params, limit=3, expr="random > -12", output_fields=["random"])

```

* 通过主键删除实体：

```
expr = f"pk in [{ids[0]}, {ids[1]}]"
hello_milvus.delete(expr)

```

* 删除集合：

```
utility.drop_collection("hello_milvus")

```

运行示例代码
------

执行以下命令以运行示例代码。

```
$ python3 hello_milvus.py

```

*以下是返回的结果和查询延迟：*

```
=== start connecting to Milvus     ===

Does collection hello_milvus exist in Milvus: False

=== Create collection `hello_milvus` ===

=== Start inserting entities       ===

Number of entities in Milvus: 3000

=== Start Creating index IVF_FLAT  ===

=== Start loading                  ===

=== Start searching based on vector similarity ===

hit: (distance: 0.0, id: 2998), random field: -11.0
hit: (distance: 0.11455299705266953, id: 1581), random field: -18.0
hit: (distance: 0.1232629269361496, id: 2647), random field: -13.0
hit: (distance: 0.0, id: 2999), random field: -11.0
hit: (distance: 0.10560893267393112, id: 2430), random field: -18.0
hit: (distance: 0.13938161730766296, id: 377), random field: -14.0
search latency = 0.2796s

=== Start querying with `random > -14` ===

query result:
-{'pk': 9, 'random': -13.0, 'embeddings': [0.298433, 0.931987, 0.949756, 0.598713, 0.290125, 0.094323, 0.064444, 0.306993]}
search latency = 0.2970s

=== Start hybrid searching with `random > -12` ===

hit: (distance: 0.0, id: 2998), random field: -11.0
hit: (distance: 0.15773043036460876, id: 472), random field: -11.0
hit: (distance: 0.3273330628871918, id: 2146), random field: -11.0
hit: (distance: 0.0, id: 2999), random field: -11.0
hit: (distance: 0.15844076871871948, id: 2218), random field: -11.0
hit: (distance: 0.1622171700000763, id: 1403), random field: -11.0
search latency = 0.3028s

=== Start deleting with expr `pk in [0, 1]` ===

query before delete by expr=`pk in [0, 1]` -> result: 
-{'pk': 0, 'random': -18.0, 'embeddings': [0.142279, 0.414248, 0.378628, 0.971863, 0.535941, 0.107011, 0.207052, 0.98182]}
-{'pk': 1, 'random': -15.0, 'embeddings': [0.57512, 0.358512, 0.439131, 0.862369, 0.083284, 0.294493, 0.004961, 0.180082]}

query after delete by expr=`pk in [0, 1]` -> result: []

=== Drop collection `hello_milvus` ===

```

*恭喜！您已经启动了 Milvus 独立模式并进行了第一次向量相似度搜索。*

