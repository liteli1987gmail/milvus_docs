---
title: 使用 Milvus 和 Hugging Face 进行问答

---

# 使用 Milvus 和 Hugging Face 进行问答

本页展示了如何构建一个问答系统，使用 Milvus 作为向量数据库，Hugging Face 作为嵌入系统。

## 开始之前

本页上的代码片段需要安装 **pymilvus**、**transformers** 和 **datasets**。**transformers** 和 **datasets** 是 Hugging Face 的包，用于创建管道，而 **pymilvus** 是 Milvus 的客户端。如果系统中没有这些包，请运行以下命令进行安装：

```shell
pip install transformers datasets pymilvus torch
```

然后，您需要加载本指南中使用的模块。

```python
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from datasets import load_dataset_builder, load_dataset, Dataset
from transformers import AutoTokenizer, AutoModel
from torch import clamp, sum
```

## 参数

这里我们可以找到以下片段中使用的参数。其中一些需要更改以适应您的环境。每个参数旁边都有其描述。

```python
DATASET = 'squad'  # 使用的 Huggingface 数据集
MODEL = 'bert-base-uncased'  # 用于嵌入的 Transformer
TOKENIZATION_BATCH_SIZE = 1000  # 标记化操作的批量大小
INFERENCE_BATCH_SIZE = 64  # Transformer 的批量大小
INSERT_RATIO = .001  # 嵌入并插入多少标题
COLLECTION_NAME = 'huggingface_db'  # 集合名称
DIMENSION = 768  # 嵌入大小
LIMIT = 10  # 查找多少个结果
MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"
```

要了解更多关于本页使用的模型和数据集，请参阅 [bert-base-uncased](https://huggingface.co/bert-base-uncased) 和 [squad](https://huggingface.co/datasets/squad)。

## 创建集合

本节涉及 Milvus，并为这个用例设置数据库。在 Milvus 中，我们需要设置一个集合并对其进行索引。

```python
# 连接到 Milvus 数据库
connections.connect(uri=URI, user=USER, password=PASSWORD, secure=True)

# 如果集合已经存在，则删除集合
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
    'metric_type':'L2',
    'index_type':"IVF_FLAT",
    'params':{"nlist":1536}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()
```

## 插入数据

一旦我们设置了集合，我们就需要开始插入我们的数据。这分为三个步骤：

- 标记原始问题，
- 嵌入标记化的问题，
- 插入嵌入、原始问题和答案。

在这个例子中，数据包括原始问题、原始问题的嵌入和原始问题的答案。

```python
data_dataset = load_dataset(DATASET, split='all')
# 生成一个固定子集。要生成一个随机子集，去掉种子设置。有关详细信息，请参阅 <https://huggingface.co/docs/datasets/v2.9.0/en/package_reference/main_classes#datasets.Dataset.train_test_split.seed>
data_dataset = data_dataset.train_test_split(test_size=INSERT_RATIO, seed=42)['test']
# 清理数据集中的数据结构。
data_dataset = data_dataset.map(lambda val: {'answer': val['answers']['text'][0]}, remove_columns=['answers'])

tokenizer = AutoTokenizer.from_pretrained(MODEL)

# 将问题标记化为 bert 所接受的格式。
def tokenize_question(batch):
    results = tokenizer(batch['question'], add_special_tokens = True, truncation = True, padding = "max_length", return_attention_mask = True, return_tensors = "pt")
    batch['input_ids'] = results['input_ids']
    batch['token_type_ids'] = results['token_type_ids']
    batch['attention_mask'] = results['attention_mask']
    return batch

# 为每个条目生成标记。
data_dataset = data_dataset.map(tokenize_question, batch_size=TOKENIZATION_BATCH_SIZE, batched=True)
# 设置输出