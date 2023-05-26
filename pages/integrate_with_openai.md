OpenAI的嵌入
===

本页面讨论使用OpenAI的嵌入API与向量数据库的集成。

我们将演示如何将[OpenAI的嵌入API](https://beta.openai.com/docs/guides/embeddings)与我们的向量数据库一起使用，以跨图书标题进行搜索。许多现有的图书搜索解决方案（例如公共图书馆使用的解决方案）依赖于关键字匹配，而不是对标题实际内容的语义理解。使用经过训练的模型来表示输入数据称为*语义搜索*，并且可以扩展到各种不同的基于文本的用例，包括异常检测和文档搜索。

入门
---------------

您需要的唯一先决条件是从[OpenAI网站](https://openai.com/api/)获取API密钥。请确保您已经[启动了Milvus实例](https://milvus.io/docs/install_standalone-docker.md)。

我们还将准备要用于此示例的数据。您可以在[此处](https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks)获取图书标题。让我们创建一个函数从CSV文件加载书名。

```bash
import csv
import json
import random
import openai
import time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

```

```bash
#提取图书标题
def csv_load(file):
    with open(file, newline='') as f:
        reader=csv.reader(f, delimiter=',')
        for row in reader:
            yield row[1]

```

有了这个，我们就可以继续生成嵌入。

使用OpenAI和Milvus搜索图书标题
------------------------------------------

在这里，我们可以找到需要修改以便适合自己账户运行的主要参数。每个参数旁边都有一个它所表示的描述。

```bash
FILE = './content/books.csv'  # Download it from https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks and save it in the folder that holds your script.
COLLECTION_NAME = 'title_db'  # Collection name
DIMENSION = 1536  # Embeddings size
COUNT = 100  # How many titles to embed and insert.
MILVUS_HOST = 'localhost'  # Milvus server URI
MILVUS_PORT = '19530'
OPENAI_ENGINE = 'text-embedding-ada-002'  # Which engine to use
openai.api_key = 'sk-******'  # Use your own Open AI API Key here

```

Because the embedding process for a free OpenAI account is relatively time-consuming, we use a set of data small enough to reach a balance between the script executing time and the precision of the search results. You can change the `COUNT` constant to fit your needs.

This segment deals with Milvus and setting up the database for this use case. Within Milvus, we need to set up a collection and index the collection. For more information on how to use Milvus, look [here](https://milvus.io/docs/example_code.md).

```bash
# Connect to Milvus
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# Remove collection if it already exists
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# Create collection which includes the id, title, and embedding.
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, descrition='Ids', is_primary=True, auto_id=False),
    FieldSchema(name='title', dtype=DataType.VARCHAR, description='Title texts', max_length=200),
    FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, description='Embedding vectors', dim=DIMENSION)
]
schema = CollectionSchema(fields=fields, description='Title collection')
collection = Collection(name=COLLECTION_NAME, schema=schema)

# Create an index for the collection.
# Create an index for the collection.
index_params = {
    'index_type': 'IVF_FLAT',
    'metric_type': 'L2',
    'params': {'nlist': 1024}
}
collection.create_index(field_name="embedding", index_params=index_params)

```
一旦我们设置好收集，我们就需要开始插入数据。这需要三个步骤：读取数据、嵌入标题并插入Milvus。

```bash
#使用OpenAI从文本中提取嵌入
def embed(text):
    return openai.Embedding.create(
        input=text, 
        engine=OPENAI_ENGINE)["data"][0]["embedding"]

#插入每个标题及其嵌入
for idx, text in enumerate(random.sample(sorted(csv_load(FILE)), k=COUNT)):  #从数据集中加载COUNT个随机值
    ins=[[idx], [(text[:198] + '..') if len(text) > 200 else text], [embed(text)]]  #插入标题ID、标题文本和标题嵌入向量
    collection.insert(ins)
    time.sleep(3)  # 免费OpenAI帐户限制在60个RPM

```

```bash
#将集合加载到内存中进行搜索
collection.load()

#根据输入文本搜索数据库
def search(text):
    #索引的搜索参数
    search_params={
        "metric_type": "L2"
    }

    results=collection.search(
        data=[embed(text)],  #嵌入搜索单元
        anns_field="embedding",  #在嵌入向量中搜索
        param=search_params,
        limit=5,  #每次搜索限制为五个结果
        output_fields=['title']  #在结果中包含标题字段
    )

    ret=[]
    for hit in results[0]:
        row=[]
        row.extend([hit.id, hit.score, hit.entity.get('title')])  #获取结果的ID、距离和标题
        ret.append(row)
    return ret

search_terms=['self-improvement', 'landscape']

for x in search_terms:
    print('搜索词:', x)
    for result in search(x):
        print(result)
    print()

```

您应该会看到以下输出：

```bash
搜索词: self-improvement
[46, 0.37948882579803467, 'The Road Less Traveled: A New Psychology of Love  Traditional Values  and Spiritual Growth']
[24, 0.39301538467407227, 'The Leader In You: How to Win Friends  Influence People and Succeed in a Changing World']
[35, 0.4081816077232361, 'Think and Grow Rich: The Landmark Bestseller Now Revised and Updated for the 21st Century']
[93, 0.4174671173095703, 'Great Expectations']
[10, 0.41889268159866333, '尼科马科主义伦理学']

搜索词: landscape
[49, 0.3966977894306183, 'Traveller']
[20, 0.41044068336486816, 'A Parchment of Leaves']
[40, 0.4179283380508423, 'The Illustrated Garden Book: A New Anthology']
[97, 0.42227691411972046, 'Monsoon Summer']
[70, 0.42461898922920227, 'Frankenstein']

```