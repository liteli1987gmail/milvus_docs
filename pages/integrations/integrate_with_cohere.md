


# 使用 Milvus 和 Cohere 进行问题回答

本页面演示了如何基于 SQuAD 数据集创建一个问题回答系统，其中使用 Milvus 作为向量数据库，Cohere 作为嵌入系统。

## 开始之前

本页面的代码片段需要安装 **pymilvus**、**cohere**、**pandas**、**numpy** 和 **tqdm**。其中，**pymilvus** 是 Milvus 的客户端。如果系统中没有安装这些软件包，请运行以下命令进行安装：

```shell
pip install pymilvus cohere pandas numpy tqdm
```

然后，你需要加载在本指南中要使用的模块。

```python
import cohere
import pandas
import numpy as np
from tqdm import tqdm
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
```

## 参数

下面是以下代码片段中使用的参数。其中有些需要更改以适应你的环境。旁边是对每个参数的描述。

```python
FILE = 'https://rajpurkar.github.io/SQuAD-explorer/dataset/train-v2.0.json'  # SQuAD 数据集的 URL
COLLECTION_NAME = 'question_answering_db'  # 集合名称
DIMENSION = 1024  # 嵌入的维度大小，默认情况下，cohere 的嵌入模型为 4096
COUNT = 5000  # 要嵌入和插入到 Milvus 中的问题数量
BATCH_SIZE = 96  # 用于嵌入和插入的批次大小
MILVUS_HOST = 'localhost'  # Milvus 服务器地址
MILVUS_PORT = '19530'
COHERE_API_KEY = 'replace-this-with-the-cohere-api-key'  # 从 Cohere 获取的 API 密钥
```

有关在本页面中使用的模型和数据集的更多信息，请参阅 [co: here](https://cohere.ai/) 和 [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/)。

## 准备数据集

在此示例中，我们将使用 Stanford Question Answering Dataset (SQuAD) 作为回答问题的真实数据源。该数据集以 JSON 文件的形式存在，我们将使用 **pandas** 加载它。

```python
# 下载数据集
dataset = pandas.read_json(FILE)

# 通过提取所有问题答案对来清理数据集
simplified_records = []
for x in dataset['data']:
    for y in x['paragraphs']:
        for z in y['qas']:
            if len(z['answers']) != 0:
                simplified_records.append({'question': z['question'], 'answer': z['answers'][0]['text']})

# 根据 COUNT 提取记录数量
simplified_records = pandas.DataFrame.from_records(simplified_records)
simplified_records = simplified_records.sample(n=min(COUNT, len(simplified_records)), random_state=42)

# 检查清理后的数据集长度是否与 count 匹配
print(len(simplified_records))
```

输出应该是数据集中的记录数。

```shell
5000
```

## 创建集合




这一部分涉及 Milvus 和为这个用例设置数据库。在 Milvus 中，我们需要设置一个集合并对其进行索引。

```python
# 连接到Milvus数据库
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# 如果集合已存在，则删除集合
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建集合，包括id、标题和嵌入字段。
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name='original_question', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='answer', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='original_question_embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
]
schema = CollectionSchema(fields=fields)
collection = Collection(name=COLLECTION_NAME, schema=schema)

# 为集合创建IVF_FLAT索引。
index_params = {
    'metric_type':'IP',
    'index_type':"IVF_FLAT",
    'params':{"nlist": 1024}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()
```

## 插入数据

一旦我们设置好集合，就需要开始插入数据。这分为三个步骤：

- 读取数据，
- 对原始问题进行嵌入，
- 将数据插入到我们刚刚在 Milvus 上创建的集合中。

在此示例中，数据包括原始问题、原始问题的嵌入和原始问题的答案。

```python
# 设置 co:here 客户端。
cohere_client = cohere.Client(COHERE_API_KEY)

# 使用 cohere 提取问题的嵌入。
def embed(texts, input_type):
    res = cohere_client.embed(texts, model='embed-multilingual-v3.0', input_type=input_type)
    return res.embeddings

# 插入每个问题、答案和问题嵌入。
total = pandas.DataFrame()
for batch in tqdm(np.array_split(simplified_records, (COUNT/BATCH_SIZE) + 1)):
    questions = batch['question'].tolist()
    embeddings = embed(questions, "search_document")
    
    data = [
        {
            'original_question': x,
            'answer': batch['answer'].tolist()[i],
            'original_question_embedding': embeddings[i]
        } for i, x in enumerate(questions)
    ]

    collection.insert(data=data)

time.sleep(10)
```

## 提问问题




<div class="alert note">

对刚插入的数据执行搜索可能会稍慢一些，因为搜索未索引的数据是以蛮力方式进行的。一旦新数据被自动索引，搜索速度将会加快。

</div>

```python
# Search the cluster for an answer to a question text
def search(text, top_k = 5):

    # AUTOINDEX does not require any search params 
    search_params = {}

    results = collection.search(
        data = embed([text], "search_query"),  # Embeded the question
        anns_field='original_question_embedding',
        param=search_params,
        limit = top_k,  # Limit to top_k results per search
        output_fields=['original_question', 'answer']  # Include the original question and answer in the result
    )

    distances = results[0].distances
    entities = [ x.entity.to_dict()['entity'] for x in results[0] ]

    ret = [ {
        "answer": x[1]["answer"],
        "distance": x[0],
        "original_question": x[1]['original_question']
    } for x in zip(distances, entities)]

    return ret

# Ask these questions
search_questions = ['What kills bacteria?', 'What\'s the biggest dog?']

# Print out the results in order of [answer, similarity score, original question]

ret = [ { "question": x, "candidates": search(x) } for x in search_questions ]
```

The output should be similar to the following:

```shell
# Output
#
# [
#     {
#         "question": "What kills bacteria?",
#         "candidates": [
#             {
#                 "answer": "farming",
#                 "distance": 0.6261022090911865,
#                 "original_question": "What makes bacteria resistant to antibiotic treatment?"
#             },
#             {
#                 "answer": "Phage therapy",
#                 "distance": 0.6093736886978149,
#                 "original_question": "What has been talked about to treat resistant bacteria?"
#             },
#             {
#                 "answer": "oral contraceptives",
#                 "distance": 0.5902313590049744,
#                 "original_question": "In therapy, what does the antibacterial interact with?"
#             },
#             {
#                 "answer": "slowing down the multiplication of bacteria or killing the bacteria",
#                 "distance": 0.5874154567718506,
#                 "original_question": "How do antibiotics work?"
#             },
#             {
#                 "answer": "in intensive farming to promote animal growth",
#                 "distance": 0.5667208433151245,
#                 "original_question": "Besides in treating human disease where else are antibiotics used?"
#             }
#         ]
#     },
#     {
#         "question": "What's the biggest dog?",
#         "candidates": [
#             {
#                 "answer": "English Mastiff",
#                 "distance": 0.7875324487686157,
#                 "original_question": "What breed was the largest dog known to have lived?"
#             },
#             {
#                 "answer": "forest elephants",
#                 "distance": 0.5886962413787842,
#                 "original_question": "What large animals reside in the national park?"
#             },
#             {
#                 "answer": "Rico",
#                 "distance": 0.5634892582893372,
#                 "original_question": "What is the name of the dog that could ID over 200 things?"
#             },
#             {
#                 "answer": "Iditarod Trail Sled Dog Race",
#                 "distance": 0.546872615814209,




## "original_question": "Which dog-sled race in Alaska is the most famous?"

## "original_question": "Most people today describe their dogs as what?"

# ]

```
