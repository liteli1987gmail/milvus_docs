---
title: 使用 Milvus 和 Cohere 进行问答

---

# 使用 Milvus 和 Cohere 进行问答

本页展示了如何基于 SQuAD 数据集创建一个问答系统，使用 Milvus 作为向量数据库，Cohere 作为嵌入系统。

## 开始之前

本页上的代码片段需要安装 **pymilvus**、**cohere**、**pandas**、**numpy** 和 **tqdm**。在这些包中，**pymilvus** 是 Milvus 的客户端。如果系统中没有，请运行以下命令进行安装：

```shell
pip install pymilvus cohere pandas numpy tqdm
```

然后，您需要加载本指南中使用的模块。

```python
import cohere
import pandas
import numpy as np
from tqdm import tqdm
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
```

## 参数

这里可以找到以下片段中使用的参数。其中一些需要更改以适应您的环境。每个参数旁边的描述说明了它是什么。

```python
FILE = 'https://rajpurkar.github.io/SQuAD-explorer/dataset/train-v2.0.json'  # SQuAD 数据集 URL
COLLECTION_NAME = 'question_answering_db'  # 集合名称
DIMENSION = 1024  # 嵌入大小，默认为 4096
COUNT = 5000  # 要嵌入并插入到 Milvus 中的问题数量
BATCH_SIZE = 96  # 嵌入和插入时使用的批次大小
MILVUS_HOST = 'localhost'  # Milvus 服务器 URI
MILVUS_PORT = '19530'
COHERE_API_KEY = 'replace-this-with-the-cohere-api-key'  # 从 Cohere 获取的 API 密钥
```

要了解更多关于本页使用的模型和数据集，请参阅 [co:here](https://cohere.ai/) 和 [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/)。

## 准备数据集

在这个例子中，我们将使用斯坦福问答数据集（SQuAD）作为我们回答问题的真实来源。这个数据集以 JSON 文件的形式出现，我们将使用 **pandas** 加载它。

```python
# 下载数据集
dataset = pandas.read_json(FILE)

# 通过获取所有的问答对来清理数据集
simplified_records = []
for x in dataset['data']:
    for y in x['paragraphs']:
        for z in y['qas']:
            if len(z['answers']) != 0:
                simplified_records.append({'question': z['question'], 'answer': z['answers'][0]['text']})

# 根据 COUNT 获取记录数量
simplified_records = pandas.DataFrame.from_records(simplified_records)
simplified_records = simplified_records.sample(n=min(COUNT, len(simplified_records)), random_state = 42)

# 检查清理后的数据集长度是否符合计数
print(len(simplified_records))
```

输出应该是数据集中的记录数

```shell
5000
```

## 创建集合

本节涉及 Milvus，为这个用例设置数据库。在 Milvus 中，我们需要设置一个集合并对其进行索引。

```python
# 连接到 Milvus 数据库
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# 如果集合已经存在，则删除它
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建包括 id、标题和嵌入的集合。
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name='original_question', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='answer', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='original_question_embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
]
schema = CollectionSchema(fields=fields)
collection = Collection(name=COLLECTION_NAME, schema=schema)

# 为集合创建 IVF_FLAT 索引。
index_params = {
    'metric_type':'IP',
    'index_type':"IVF_FLAT",
    'params':{"nlist": 1024}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()
```

## 插入数据

一旦我们设置了集合，我们就需要开始插入我们的数据。这分为三个步骤：

- 读取数据，
- 嵌入原始问题，
- 将数据插入我们刚刚在 Milvus 上创建的集合。

在这个例子中，数据包括原始问题、原始问题的嵌入和原始问题的答案。

```python
# 设置 co:here 客户端。
cohere_client = cohere.Client(COHERE_API_KEY)

# 使用 Cohere 从问题