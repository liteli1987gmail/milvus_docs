


# 使用 Milvus 和 OpenAI 进行相似度搜索

本页讨论了如何将向量数据库与 OpenAI 的嵌入 API 集成。

我们将展示如何使用 [OpenAI 的嵌入 API](https://beta.openai.com/docs/guides/embeddings) 与我们的向量数据库一起搜索图书标题。许多现有的图书搜索解决方案（如公共图书馆使用的解决方案）都是基于关键词匹配，而不是对标题实际内容的语义理解。使用经过训练的模型来表示输入数据被称为“语义搜索”，可以扩展到各种基于文本的用例，包括异常检测和文档搜索。

## 入门指南

你唯一需要的先决条件是在 [OpenAI 网站](/getstarted/standalone/install_standalone-docker.md)。

我们还将准备要在此示例中使用的数据。你可以从 [这里](https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks) 获取图书标题。让我们创建一个从 CSV 加载图书标题的函数。

```python
import csv
import json
import random
import time
from openai import OpenAI
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
```

```python
# 提取图书标题
def csv_load(file):
    with open(file, newline='') as f:
        reader=csv.reader(f, delimiter=',')
        for row in reader:
            yield row[1]
```

有了这个函数，我们就可以开始生成嵌入了。

## 使用 OpenAI 和 Milvus 搜索图书标题






以下是需要根据你自己的账户进行修改的主要参数。每个参数旁边都有一个描述。

```python
FILE = './content/books.csv'  # 从https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks下载并将其保存在脚本所在的文件夹中
COLLECTION_NAME = 'title_db'  # 集合名称
DIMENSION = 1536  # 嵌入维度
COUNT = 100  # 嵌入和插入的标题数量
MILVUS_HOST = 'localhost'  # Milvus服务器URI
MILVUS_PORT = '19530'
OPENAI_ENGINE = 'text-embedding-3-small'  # 使用的引擎，你可以将其更改为 `text-embedding-3-large` 或 `text-embedding-ada-002`
client = OpenAI()
client.api_key = 'sk-******'  # 在此处使用你自己的Open AI API密钥
```

<div class="alert note">
由于免费 OpenAI 账户的嵌入过程相对耗时，我们使用了一组足够小的数据来在脚本执行时间和搜索结果的精度之间达到平衡。你可以更改 `COUNT` 常量以适应你的需求。
</div>

此部分涉及 Milvus 和为此用例设定数据库。在 Milvus 中，我们需要设置一个集合并对该集合进行索引。有关如何使用 Milvus 的更多信息，请参阅 [此处](https://milvus.io/docs/example_code.md)。

```python
# 连接Milvus
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# 如果集合已经存在，则删除集合
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建包括id、title和嵌入的集合。
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, descrition='Ids', is_primary=True, auto_id=False),
    FieldSchema(name='title', dtype=DataType.VARCHAR, description='Title texts', max_length=200),
    FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, description='Embedding vectors', dim=DIMENSION)
]
schema = CollectionSchema(fields=fields, description='Title collection')
collection = Collection(name=COLLECTION_NAME, schema=schema)

# 为集合创建索引。
index_params = {
    'index_type': 'IVF_FLAT',
    'metric_type': 'L2',
    'params': {'nlist': 1024}
}
collection.create_index(field_name="embedding", index_params=index_params)
```

设置完集合后，我们需要开始插入数据。这个过程有三个步骤：读取数据、嵌入标题和插入到 Milvus。

```python
# 使用OpenAI从文本中提取嵌入
def embed(text):
    response = client.embeddings.create(
        input=text,
        model=OPENAI_ENGINE
    )
    return response.data[0].embedding

# 插入每个标题及其嵌入
for idx, text in enumerate(random.sample(sorted(csv_load(FILE)), k=COUNT)):
    ins=[[idx], [(text[:198] + '..') if len(text) > 200 else text], [embed(text)]]
    collection.insert(ins)
    time.sleep(3)
```

```python
# 将集合加载到内存中以进行搜索
collection.load()

# 根据输入文本搜索数据库
def search(text):
    search_params={
        "metric_type": "L2"
    }

    results=collection.search(
        data=[embed(text)],
        anns_field="embedding",
        param=search_params,
        limit=5,
        output_fields=['title']
    )

    ret=[]
    for hit in results[0]:
        row=[]
        row.extend([hit.id, hit.score, hit.entity.get('title')])
        ret.append(row)
    return ret

search_terms=['self-improvement', 'landscape']

for x in search_terms:
    print('搜索词:', x)
    for result in search(x):
        print(result)
    print()
```





```
搜索词: self-improvement
[46, 0.37948882579803467, 'The Road Less Traveled: A New Psychology of Love  Traditional Values  and Spiritual Growth']
[24, 0.39301538467407227, 'The Leader In You: How to Win Friends  Influence People and Succeed in a Changing World']
[35, 0.4081816077232361, 'Think and Grow Rich: The Landmark Bestseller Now Revised and Updated for the 21st Century']
[93, 0.4174671173095703, 'Great Expectations']
[10, 0.41889268159866333, 'Nicomachean Ethics']

搜索词: landscape
[49, 0.3966977894306183, 'Traveller']
[20, 0.41044068336486816, 'A Parchment of Leaves']
[40, 0.4179283380508423, 'The Illustrated Garden Book: A New Anthology']
[97, 0.42227691411972046, 'Monsoon Summer']
[70, 0.42461898922920227, 'Frankenstein']
```

