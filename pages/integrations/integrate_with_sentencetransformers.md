---
title: 使用 Milvus 和 SentenceTransformers 进行电影搜索

---

# 使用 Milvus 和 SentenceTransformers 进行电影搜索

## 安装依赖

在这个示例中，我们将使用 `pymilvus` 连接并使用 Milvus，`sentencetransformers` 生成向量嵌入，以及 `gdown` 下载示例数据集。

```shell
pip install pymilvus sentence-transformers gdown
```

## 获取数据

我们将使用 `gdown` 从 Google Drive 获取 zip 文件，然后使用内置的 `zipfile` 库解压缩它。

```python
import gdown
url = 'https://drive.google.com/uc?id=11ISS45aO2ubNCGaC3Lvd3D7NT8Y7MeO8'
output = './movies.zip'
gdown.download(url, output)

import zipfile

with zipfile.ZipFile("./movies.zip","r") as zip_ref:
    zip_ref.extractall("./movies")
```

## 全局参数

这里可以找到运行时需要修改的主要参数，每个参数旁边都有其描述。

```python
# Milvus 设置参数
COLLECTION_NAME = 'movies_db'  # 集合名称
DIMENSION = 384  # 嵌入大小
COUNT = 1000  # 插入的向量数量
MILVUS_HOST = 'localhost'
MILVUS_PORT = '19530'

# 推理参数
BATCH_SIZE = 128

# 搜索参数
TOP_K = 3
```

## 设置 Milvus

在这一点上，我们将开始设置 Milvus。步骤如下：

1. 使用提供的 URI 连接到 Milvus 实例。

    ```python
    from pymilvus import connections

    # 连接到 Milvus 数据库
    connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
    ```

2. 如果集合已经存在，将其删除。

    ```python
    from pymilvus import utility

    # 删除同名的任何之前的集合
    if utility.has_collection(COLLECTION_NAME):
        utility.drop_collection(COLLECTION_NAME)
    ```

3. 创建包含电影 ID、标题和情节文本嵌入的集合。

    ```python
    from pymilvus import FieldSchema, CollectionSchema, DataType, Collection


    # 创建包含 ID、标题和嵌入的集合。
    fields = [
        FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name='title', dtype=DataType.VARCHAR, max_length=200),  # VARCHARS 需要最大长度，因此在这个示例中设置为 200 个字符
        FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
    ]
    schema = CollectionSchema(fields=fields)
    collection = Collection(name=COLLECTION_NAME, schema=schema)
    ```

4. 在新创建的集合上创建索引并将其加载到内存中。

    ```python
    # 为集合创建一个 IVF_FLAT 索引。
    index_params = {
        'metric_type':'L2',
        'index_type':"IVF_FLAT",
        'params':{'nlist': 1536}
    }
    collection.create_index(field_name="embedding", index_params=index_params)
    collection.load()
    ```

完成这些步骤后，集合就准备好插入和搜索了。添加的任何数据都将自动被索引，并且可以立即用于搜索。如果数据非常新鲜，搜索可能会变慢，因为在索引过程中将使用暴力搜索。

## 插入数据

在这个示例中，我们将使用 SentenceTransformers 的 miniLM 模型来创建情节文本的嵌入。这个模型返回 384 维的嵌入。

在接下来的几个步骤中，我们将：

1. 加载数据。
2. 使用 SentenceTransformers 嵌入情节文本数据。
3. 将数据插入 Milvus。

```python
import csv
from sentence_transformers import SentenceTransformer

transformer = SentenceTransformer('all-MiniLM-L6-v2')

# 提取书籍标题
def csv_load(file):
    with open(file, newline='') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            if '' in (row[1], row[7]):
                continue
            yield (row[1], row[7])


# 使用 OpenAI 从文本中提取嵌入
def embed_insert(data):
    embeds = transformer.encode(data[1]) 
    ins = [
            data[0],
            [x for x in embeds]
    ]
    collection.insert(ins)

import time

data_batch = [[],[]]

count = 0

for title, plot in csv_load('./movies/plots.csv'):
    if count <= COUNT:
        data_batch[0].append(title)
        data_batch[1].append(plot)
        