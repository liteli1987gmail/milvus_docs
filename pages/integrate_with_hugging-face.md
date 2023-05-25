使用 Milvus和Hugging Face
===

This page illustrates how to build a question-answering system using Milvus as the vector database and Hugging Face as the embedding system.

开始之前
----

本页的代码片段需要安装**pymilvus**、**transformers**和**datasets**。其中**transformers**和**datasets**是Hugging Face的软件包，用于创建pipeline，而**pymilvus**是Milvus的客户端。如果您的系统上没有这些软件包，请运行以下命令进行安装：

```python
pip install transformers datasets pymilvus torch

```

然后您需要加载本指南中要使用的模块。

```python
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from datasets import load_dataset_builder, load_dataset, Dataset
from transformers import AutoTokenizer, AutoModel
from torch import clamp, sum

```

参数
----------

在这里，我们可以找到以下段落中使用的参数。其中一些需要更改以适应您的环境。除每个参数外，还附有其描述。

```python
DATASET = 'squad'  # Huggingface Dataset to use
MODEL = 'bert-base-uncased'  # Transformer to use for embeddings
TOKENIZATION_BATCH_SIZE = 1000  # Batch size for tokenizing operaiton
INFERENCE_BATCH_SIZE = 64  # batch size for transformer
INSERT_RATIO = .001  # How many titles to embed and insert
COLLECTION_NAME = 'huggingface_db'  # Collection name
DIMENSION = 768  # Embeddings size
LIMIT = 10  # How many results to search for
MILVUS_HOST = "localhost"
MIVLUS_PORT = "19530"

```

To know more about the model and dataset used on this page, refer to [bert-base-uncased](https://huggingface.co/bert-base-uncased) and [squad](https://huggingface.co/datasets/squad).

创建集合
----

本节介绍Milvus以及为此用例设置数据库。在Milvus中，我们需要设置一个集合并对其进行索引。

```python
# Connect to Milvus Database
connections.connect(uri=URI, user=USER, password=PASSWORD, secure=True)

# Remove collection if it already exists
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# Create collection which includes the id, title, and embedding.
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name='original_question', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='answer', dtype=DataType.VARCHAR, max_length=1000),
    FieldSchema(name='original_question_embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
]
schema = CollectionSchema(fields=fields)
collection = Collection(name=COLLECTION_NAME, schema=schema)

# Create an IVF_FLAT index for collection.
index_params = {
    'metric_type':'L2',
    'index_type':"IVF_FLAT",
    'params':{"nlist":1536}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()

```

插入数据
-----------

一旦我们设置了集合，我们就需要开始插入数据。这可以通过以下三个步骤来完成

* 对原始问题进行分词,
* 嵌入标记化的问题, 以及
* 插入嵌入，原始问题和答案。

在本示例中，数据包括原始问题、原始问题的嵌入以及原始问题的答案。

```python
data_dataset = load_dataset(DATASET, split='all')
# 生成一个固定的子集。为生成随机子集，请删除种子设置。有关详细信息，请参见 <https://huggingface.co/docs/datasets/v2.9.0/en/package_reference/main_classes#datasets.Dataset.train_test_split.seed>
data_dataset = data_dataset.train_test_split(test_size=INSERT_RATIO, seed=42)['test']
# 清理数据集中的数据结构
data_dataset = data_dataset.map(lambda val: {'answer': val['answers']['text'][0]}, remove_columns=['answers'])

tokenizer = AutoTokenizer.from_pretrained(MODEL)

# 将问题分词以满足bert的输入格式。
def tokenize_question(batch):
    results = tokenizer(batch['question'], add_special_tokens = True, truncation = True, padding = "max_length", return_attention_mask = True, return_tensors = "pt")
    batch['input_ids'] = results['input_ids']
    batch['token_type_ids'] = results['token_type_ids']
    batch['attention_mask'] = results['attention_mask']
    return batch

# 为每个条目生成标记
data_dataset = data_dataset.map(tokenize_question, batch_size=TOKENIZATION_BATCH_SIZE, batched=True)
# 设置输出格式为torch,以便将其推送到嵌入模型中
data_dataset.set_format('torch', columns=['input_ids', 'token_type_ids', 'attention_mask'], output_all_columns=True)

model = AutoModel.from_pretrained(MODEL)
# 将标记化的问题进行嵌入并根据隐藏层的注意力掩码取平均池化。
def embed(batch):
    sentence_embs = model(
                input_ids=batch['input_ids'],
                token_type_ids=batch['token_type_ids'],
                attention_mask=batch['attention_mask']
                )[0]
    input_mask_expanded = batch['attention_mask'].unsqueeze(-1).expand(sentence_embs.size()).float()
    batch['question_embedding'] = sum(sentence_embs * input_mask_expanded, 1) / clamp(input_mask_expanded.sum(1), min=1e-9)
    return batch

data_dataset = data_dataset.map(embed, remove_columns=['input_ids', 'token_type_ids', 'attention_mask'], batched = True, batch_size=INFERENCE_BATCH_SIZE)

# 由于varchar的限制，我们将在插入时限制问题大小。
def insert_function(batch):
    insertable = [
        batch['question'],
        [x[:995] + '...' if len(x) > 999 else x for x in batch['answer']],
        batch['question_embedding'].tolist()
    ]    
    collection.insert(insertable)

data_dataset.map(insert_function, batched=True, batch_size=64)
collection.flush()

```

问问题
-------------

一旦所有数据都被插入并在Milvus中进行了索引，我们就可以询问问题并看到最接近的答案是什么。

```python
questions = {'question':['When was chemistry invented?', 'When was Eisenhower born?']}
question_dataset = Dataset.from_dict(questions)

question_dataset = question_dataset.map(tokenize_question, batched = True, batch_size=TOKENIZATION_BATCH_SIZE)
question_dataset.set_format('torch', columns=['input_ids', 'token_type_ids', 'attention_mask'], output_all_columns=True)
question_dataset = question_dataset.map(embed, remove_columns=['input_ids', 'token_type_ids', 'attention_mask'], batched = True, batch_size=INFERENCE_BATCH_SIZE)

def search(batch):
    res = collection.search(batch['question_embedding'].tolist(), anns_field='original_question_embedding', param = {}, output_fields=['answer', 'original_question'], limit = LIMIT)
    overall_id = []
    overall_distance = []
    overall_answer = []
    overall_original_question = []
    for hits in res:
        ids = []
        distance = []
        answer = []
        original_question = []
        for hit in hits:
            ids.append(hit.id)
            distance.append(hit.distance)
            answer.append(hit.entity.get('answer'))
            original_question.append(hit.entity.get('original_question'))
        overall_id.append(ids)
        overall_distance.append(distance)
        overall_answer.append(answer)
        overall_original_question.append(original_question)
    return {
        'id': overall_id,
        'distance': overall_distance,
        'answer': overall_answer,
        'original_question': overall_original_question
    }
question_dataset = question_dataset.map(search, batched=True, batch_size = 1)
for x in question_dataset:
    print()
    print('Question:')
    print(x['question'])
    print('Answer, Distance, Original Question')
    for x in zip(x['answer'], x['distance'], x['original_question']):
        print(x)

```
如果您在未指定[train_test_split()方法的`seed`参数](#Insert-data)的情况下下载数据子集，则输出将因下载的数据子集而异，并应类似于以下内容：

```python
Question:
When was chemistry invented?
Answer, Distance, Original Question
('until 1870', tensor(12.7554), 'When did the Papal States exist?')
('October 1992', tensor(12.8504), 'When were free elections held?')
('1787', tensor(14.8283), 'When was the Tower constructed?')
('taxation', tensor(17.1399), 'How did Hobson argue to rid the world of imperialism?')
('1981', tensor(18.9243), "When was ZE's Mutant Disco released?")
('salt and iron', tensor(19.8073), 'What natural resources did the Chinese government have a monopoly on?')
('Medieval Latin', tensor(20.9864), "What was the Latin of Charlemagne's era later known as?")
('military education', tensor(21.0572), 'What Prussian system was superior to the French example?')
('Edgar Bronfman Jr.', tensor(21.6317), 'Who was the head of Seagram?')
('because of persecution, increased poverty and better economic opportunities', tensor(23.1249), 'Why did more than half a million people flee?')

Question:
When was Eisenhower born?
Answer, Distance, Original Question
('until 1870', tensor(17.2719), 'When did the Papal States exist?')
('1787', tensor(17.3752), 'When was the Tower constructed?')
('October 1992', tensor(20.3766), 'When were free elections held?')
('1992', tensor(21.0860), 'In what year was the Premier League created?')
('1981', tensor(23.1728), "When was ZE's Mutant Disco released?")
('Medieval Latin', tensor(23.5315), "What was the Latin of Charlemagne's era later known as?")
('Poland, Bulgaria, the Czech Republic, Slovakia, Hungary, Albania, former East Germany and Cuba', tensor(25.1409), 'Where was Russian schooling mandatory in the 20th century?')
('Antonio B. Won Pat', tensor(25.8398), 'What is the name of the international airport in Guam?')
('1973', tensor(26.7827), 'In what year did the State Management Scheme cease?')
('2019', tensor(27.1236), 'When will Argo be launched?')

```
