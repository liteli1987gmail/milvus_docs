使用 Milvus和Cohere


本页面说明如何使用Milvus作为向量数据库和Cohere作为嵌入系统，基于SQuAD数据集创建问答系统。

开始之前
---------

本页面的代码片段需要安装**pymilvus**、**cohere**、**pandas**、**numpy**和**tqdm**。其中，**pymilvus**是Milvus的客户端。如果您的系统上没有这些软件包，请运行以下命令进行安装：

```
pip install pymilvus cohere pandas numpy tqdm

```

然后，您需要加载本指南中要使用的模块。

```
import cohere
import pandas
import numpy as np
from tqdm import tqdm
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

```

参数
----------

在这里，我们可以找到以下段落中使用的参数。其中一些需要更改以适应您的环境。除每个参数外，还附有其描述。

```
FILE = 'https://rajpurkar.github.io/SQuAD-explorer/dataset/train-v2.0.json'  ＃SQuAD数据集的URL
COLLECTION_NAME = 'question_answering_db' ＃集合名称
DIMENSION = 768  ＃嵌入维数，cohere嵌入默认为4096（采用大模型）
COUNT = 5000  ＃嵌入并插入Milvus的问题数量
BATCH_SIZE = 96  ＃用于嵌入和插入的批大小
MILVUS_HOST = 'localhost'  ＃Milvus服务器URI
MILVUS_PORT = '19530'
COHERE_API_KEY = 'replace-this-with-the-cohere-api-key' ＃从Cohere获得的API密钥

```

要了解本页面使用的模型和数据集，请参阅[co:here](https://cohere.ai/)和[SQuAD](https://rajpurkar.github.io/SQuAD-explorer/)。

准备数据集
-------------------

在本示例中，我们将使用斯坦福问答数据集（SQuAD）作为我们回答问题的基础。此数据集采用JSON文件格式，我们将使用**pandas**进行加载。

```
# Download the dataset
dataset = pandas.read_json(FILE)

# Clean up the dataset by grabbing all the question answer pairs
simplified_records = []
for x in dataset['data']:
    for y in x['paragraphs']:
        for z in y['qas']:
            if len(z['answers']) != 0:
                simplified_records.append({'question': z['question'], 'answer': z['answers'][0]['text']})

# Grab the amount of records based on COUNT
simplified_records = pandas.DataFrame.from_records(simplified_records)
simplified_records = simplified_records.sample(n=min(COUNT, len(simplified_records)), random_state = 42)

# Check the length of the cleaned dataset matches count
print(len(simplified_records))

```

The output should be the number of records in the dataset

```
5000

```

创建集合
-------------------

本部分处理Milvus并为此用例设置数据库。在Milvus中，我们需要设置一个集合并为其建立索引。

```
# 连接至Milvus数据库
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# 如果集合已经存在，则删除集合
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建集合，其中包括ID、标题和嵌入。
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
    'metric_type':'L2',
    'index_type':"IVF_FLAT",
    'params':{"nlist": 1024}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()

```

插入数据
-----------

一旦我们设置了集合，我们就需要开始插入数据。这可以通过以下三个步骤来完成

* 读取数据，
* 对原始问题进行嵌入，以及
* 将数据插入我们刚刚在Milvus上创建的集合中。

在本示例中，数据包括原始问题、原始问题的嵌入以及原始问题的答案。

```
# 设置co:here客户端。
cohere_client = cohere.Client(COHERE_API_KEY)

# 使用Cohere提取问题的嵌入。
def embed(texts):
    res = cohere_client.embed(texts, model='multilingual-22-12')
    return res.embeddings

# 插入每一个问题、答案和问题嵌入
total = pandas.DataFrame()
for batch in tqdm(np.array_split(simplified_records, (COUNT/BATCH_SIZE) + 1)):
    questions = batch['question'].tolist()

    data = [
        questions,
        batch['answer'].tolist(),
        embed(questions)      
    ]

    collection.insert(data)

# 在结束时执行刷新以确保将所有行发送到索引。
collection.flush()

```

问问题
-------------

一旦所有数据都被插入Milvus集合中，我们就可以通过用我们的问题短语进行嵌入并在集合中搜索来询问系统。

在插入数据后执行的搜索可能会比较慢，因为未索引数据的搜索是通过暴力方式完成的。一旦新数据被自动索引，搜索速度就会加快。

```
# Search the database for an answer to a question text
def search(text, top_k = 5):

    # Set search params 
    search_params = {
        "metric_type": "L2",
        "params": {"nprobe": 10}
    }

    results = collection.search(
        data = embed([text]),  # Embeded the question
        anns_field="original_question_embedding",  # Search across the original original question embeddings
        param=search_params,
        limit = top_k,  # Limit to top_k results per search
        output_fields=['original_question', 'answer']  # Include the original question and answer in the result
    )

    ret = []
    for hit in results[0]:
        row = []
        row.extend([hit.entity.get('answer'), hit.score, hit.entity.get('original_question') ])  # Get the answer, distance, and original question for the results
        ret.append(row)
    return ret

# Ask these questions
search_questions = ['What kills bacteria?', 'Whats the biggest dog?']

# Print out the results in order of [answer, similarity score, original question]
for question in search_questions:
    print('Question:', question)
    print('\nAnswer,', 'Distance,', 'Original Question')
    for result in search(question):
        print(result)
    print()

```

The output should be similar to the following:

```
Question: What kills bacteria?

Answer, Distance, Original Question
['Phage therapy', 5976.171875, 'What has been talked about to treat resistant bacteria?']
['oral contraceptives', 7065.4130859375, 'In therapy, what does the antibacterial interact with?']
['farming', 7250.0791015625, 'What makes bacteria resistant to antibiotic treatment?']
['slowing down the multiplication of bacteria or killing the bacteria', 7291.306640625, 'How do antibiotics work?']
['converting nitrogen gas to nitrogenous compounds', 7310.67724609375, 'What do bacteria do in soil?']

Question: Whats the biggest dog?

Answer, Distance, Original Question
['English Mastiff', 4205.16064453125, 'What breed was the largest dog known to have lived?']
['Rico', 6108.88427734375, 'What is the name of the dog that could ID over 200 things?']
['part of the family', 7904.853515625, 'Most people today describe their dogs as what?']
['77.5 million', 8752.98828125, 'How many people in the United States are said to own dog?']
['Iditarod Trail Sled Dog Race', 9251.58984375, 'Which dog-sled race in Alaska is the most famous?']

```
