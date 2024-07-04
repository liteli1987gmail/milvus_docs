

# 使用 Milvus 和 Hugging Face 进行问答

本页面介绍了如何使用 Milvus 作为向量数据库和 Hugging Face 作为嵌入系统来搜索问题的最佳答案。

## 开始之前

本页面的代码片段需要安装 **pymilvus**、**transformers** 和 **datasets**。**transformers** 和 **datasets** 是 Hugging Face 的包，用于创建管道，**pymilvus** 是 Milvus 的客户端。如果系统中没有安装，请运行以下命令进行安装：

```shell
pip install transformers datasets pymilvus torch
```

然后，你需要加载在本指南中要使用的模块。

```python
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from datasets import load_dataset_builder, load_dataset, Dataset
from transformers import AutoTokenizer, AutoModel
from torch import clamp, sum
```

## 参数

在以下片段中，我们可以找到所使用的参数。其中一些参数需要更改以适应你的环境。旁边是对其的描述。

```python
DATASET = 'squad'  # 要使用的Huggingface数据集
MODEL = 'bert-base-uncased'  # 用于嵌入的Transformer
TOKENIZATION_BATCH_SIZE = 1000  # 标记化操作的批处理大小
INFERENCE_BATCH_SIZE = 64  # transformer的批大小
INSERT_RATIO = .001  # 嵌入和插入的标题数目
COLLECTION_NAME = 'huggingface_db'  # 集合名称
DIMENSION = 768  # 嵌入维度
LIMIT = 10  # 要搜索的结果数目
MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"
```

要了解有关在本页面中使用的模型和数据集的更多信息，请参阅 [bert-base-uncased](https://huggingface.co/bert-base-uncased) 和 [squad](https://huggingface.co/datasets/squad)。

## 创建集合

本节涉及 Milvus 和设置用于此用例的数据库。在 Milvus 中，我们需要设置一个集合并对其进行索引。

```python
# 连接到Milvus数据库
connections.connect(uri=URI, user=USER, password=PASSWORD, secure=True)

# 如果集合已经存在，则删除集合
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建包括id、标题和嵌入的集合。
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
    'params':{"nlist":1536}
}
collection.create_index(field_name="original_question_embedding", index_params=index_params)
collection.load()
```

## 插入数据



一旦我们设置好集合，我们需要开始插入我们的数据。这分为三个步骤：

- 对原始问题进行分词，
- 对分词后的问题进行嵌入，
- 插入嵌入、原始问题和答案。

在这个例子中，数据包括原始问题、原始问题的嵌入和原始问题的答案。

```python
data_dataset = load_dataset(DATASET, split='all')
# 生成一个固定的子集。要生成随机子集，请删除seed设置。有关详细信息，请参见<https://huggingface.co/docs/datasets/v2.9.0/en/package_reference/main_classes#datasets.Dataset.train_test_split.seed>
data_dataset = data_dataset.train_test_split(test_size=INSERT_RATIO, seed=42)['test']
# 清理数据集中的数据结构。
data_dataset = data_dataset.map(lambda val: {'answer': val['answers']['text'][0]}, remove_columns=['answers'])

tokenizer = AutoTokenizer.from_pretrained(MODEL)

# 将问题分词为bert格式。
def tokenize_question(batch):
    results = tokenizer(batch['question'], add_special_tokens = True, truncation = True, padding = "max_length", return_attention_mask = True, return_tensors = "pt")
    batch['input_ids'] = results['input_ids']
    batch['token_type_ids'] = results['token_type_ids']
    batch['attention_mask'] = results['attention_mask']
    return batch

# 为每个条目生成标记。
data_dataset = data_dataset.map(tokenize_question, batch_size=TOKENIZATION_BATCH_SIZE, batched=True)
# 将输出格式设置为torch，以便可以将其推送到嵌入模型中。
data_dataset.set_format('torch', columns=['input_ids', 'token_type_ids', 'attention_mask'], output_all_columns=True)

model = AutoModel.from_pretrained(MODEL)
# 嵌入标记化的问题，并根据隐藏层的注意力掩码取平均池化。
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

# 由于varchar约束，插入时将限制问题的大小
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

## 提问







一旦所有的数据都被插入并在 Milvus 中建立索引，我们就可以提出问题并查看最相似的答案是什么。

```python
questions = {'question':['化学是在什么时候发明的？', '艾森豪威尔是在什么时候出生的？']}
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
    print('问题：')
    print(x['question'])
    print('答案、距离、原始问题')
    for x in zip(x['answer'], x['distance'], x['original_question']):
        print(x)
```

如果你是未指定 `train_test_split()` 方法中的 `seed` 参数来下载数据子集的话，输出结果可能会因你下载的数据子集而异，但应类似于以下内容：

```python
问题：
化学是在什么时候发明的？
答案、距离、原始问题
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

问题：
艾森豪威尔是在什么时候出生的？
答案、距离、原始问题
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
