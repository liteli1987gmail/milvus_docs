---
title: 与OpenAI集成的相似性搜索

---

# 与OpenAI集成的相似性搜索

本页面讨论了向量数据库与OpenAI的嵌入API集成。

我们将展示如何使用[OpenAI的嵌入API](https://beta.openai.com/docs/guides/embeddings)与我们的向量数据库一起使用，以在书名中进行搜索。许多现有的书籍搜索解决方案（例如，公共图书馆使用的解决方案）依赖于关键词匹配，而不是对标题实际含义的语义理解。使用训练有素的模型来表示输入数据被称为_语义搜索_，可以扩展到各种基于文本的用例，包括异常检测和文档搜索。

## 开始

您在这里需要的唯一先决条件是[OpenAI网站](https://openai.com/api/)上的API密钥。请确保您已经[启动了Milvus实例](https://milvus.io/docs/install_standalone-docker.md)。

我们还将准备我们将在此示例中使用的数据。您可以从[这里](https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks)获取书名。让我们创建一个函数来从我们的CSV中加载书名。

```python
import csv
import json
import random
import time
from openai import OpenAI
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
```

```python
# 提取书名
def csv_load(file):
    with open(file, newline='') as f:
        reader=csv.reader(f, delimiter=',')
        for row in reader:
            yield row[1]
```

有了这个，我们就可以继续生成嵌入。

## 使用OpenAI和Milvus搜索书名

在这里，我们可以找到需要修改以使用您自己的帐户的主要参数。每个参数旁边都有其描述。

```python
FILE = './content/books.csv'  # 从 https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks 下载并保存在包含您脚本的文件夹中。
COLLECTION_NAME = 'title_db'  # 集合名称
DIMENSION = 1536  # 嵌入大小
COUNT = 100  # 要嵌入和插入的标题数量。
MILVUS_HOST = 'localhost'  # Milvus服务器URI
MILVUS_PORT = '19530'
OPENAI_ENGINE = 'text-embedding-3-small'  # 要使用的引擎，您可以将其更改为`text-embedding-3-large`或`text-embedding-ada-002`
client = OpenAI()
client.api_key = 'sk-******'  # 在此处使用您自己的OpenAI API密钥
```
<div class="alert note">
由于免费OpenAI帐户的嵌入过程相对耗时，我们使用足够小的数据集以达到脚本执行时间和搜索结果精度之间的平衡。您可以根据需要更改<code>COUNT</code>常量。
</div>

这段代码涉及Milvus和为这个用例设置数据库。在Milvus中，我们需要设置一个集合并索引该集合。有关如何使用Milvus的更多信息，请查看[这里](https://milvus.io/docs/example_code.md)。

```python
# 连接到Milvus
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# 如果已经存在集合，则删除集合
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 创建包括id、标题和嵌入的集合。
fields = [
    FieldSchema(name='id', dtype=DataType.INT64, descrition='Ids', is_primary=True, auto_id=False),
    FieldSchema(name='title', dtype=DataType.VARCHAR, description='标题文本', max_length=200),
    FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, description='嵌入向量', dim=DIMENSION)
]
schema = CollectionSchema(fields=fields, description='标题集合')
collection = Collection(name=COLLECTION_NAME, schema=schema)

# 为集合创建索引。
index_params = {
    'index_type': 'IVF_FLAT',
    'metric_type': 'L2',
    'params': {'nlist': 1024}
}
collection.create_index(field_name="embedding", index_params=index_params)
```

一旦我们设置了集合，我们需要开始插入我们的数据。这分为三个步骤：读取数据、嵌入标题和插入到Milvus中。

```python
# 使用OpenAI从文本中提取嵌入
def embed(text):
    response = client.embeddings.create(
        input=text,
        model=OPENAI_ENGINE
    )
    return response.data[0].embedding

# 插入每个标题及其嵌入
for idx, text in enumerate(random.sample(sorted(csv_load(FILE)), k=COUNT)):  # 从数据集中加载COUNT数量的随机