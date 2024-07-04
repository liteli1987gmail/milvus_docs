


## 使用 Milvus 和 SentenceTransformers 进行电影搜索

在这个示例中，我们将使用 Milvus 和 SentenceTransformers 库进行维基百科文章搜索。我们要搜索的数据集是在 [Kaggle](https://www.kaggle.com/datasets/jrobischon/wikipedia-movie-plots) 上找到的 Wikipedia-Movie-Plots 数据集。对于这个示例，我们已经在公共的 Google Drive 中重新托管了数据。

让我们开始吧。

### 安装要求

在这个示例中，我们将使用 `pymilvus` 来连接 Milvus，使用 `sentencetransformers` 生成向量嵌入，使用 `gdown` 下载示例数据集。

```shell
pip install pymilvus sentence-transformers gdown
```
### 获取数据

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

### 全局参数

在这里，我们可以找到需要根据自己的帐户进行修改的主要参数。旁边是对其的描述。

```python
# Milvus设置参数
COLLECTION_NAME = 'movies_db'  # 集合名称
DIMENSION = 384  # 嵌入大小
COUNT = 1000  # 要插入的向量数
MILVUS_HOST = 'localhost'
MILVUS_PORT = '19530'

# 推理参数
BATCH_SIZE = 128

# 搜索参数
TOP_K = 3
```

### 设置 Milvus




现在，我们将开始设置 Milvus。步骤如下：

1. 使用提供的 URI 连接到 Milvus 实例。

    ```python
    from pymilvus import connections

    # 连接到Milvus数据库
    connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
    ```

2. 如果集合已经存在，则删除它。

    ```python
    from pymilvus import utility

    # 删除同名的任何先前集合
    if utility.has_collection(COLLECTION_NAME):
        utility.drop_collection(COLLECTION_NAME)
    ```

3. 创建包含电影 ID、标题和情节文本嵌入的集合。

    ```python
    from pymilvus import FieldSchema, CollectionSchema, DataType, Collection


    # 创建包含ID、标题和嵌入的集合。
    fields = [
        FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name='title', dtype=DataType.VARCHAR, max_length=200),  # VARCHARS需要指定最大长度，在此示例中设置为200个字符
        FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
    ]
    schema = CollectionSchema(fields=fields)
    collection = Collection(name=COLLECTION_NAME, schema=schema)
    ```

4. 在新创建的集合上创建索引并加载到内存中。

    ```python
    # 为集合创建IVF_FLAT索引。
    index_params = {
        'metric_type':'L2',
        'index_type':"IVF_FLAT",
        'params':{'nlist': 1536}
    }
    collection.create_index(field_name="embedding", index_params=index_params)
    collection.load()
    ```

完成这些步骤后，集合准备好进行插入和搜索。任何添加的数据都将自动索引并立即可用于搜索。如果数据非常新，搜索可能会较慢，因为在还处于索引过程中的数据上将使用蛮力搜索。

## 插入数据



对于这个示例，我们将使用 SentenceTransformers miniLM 模型来创建情节文本的嵌入。该模型返回 384 维的嵌入。

在接下来的几个步骤中，我们将：

1. 加载数据。
2. 使用 SentenceTransformers 将情节文本数据进行嵌入。
3. 将数据插入到 Milvus 中。

```python
import csv
from sentence_transformers import SentenceTransformer

transformer = SentenceTransformer('all-MiniLM-L6-v2')

# 提取书名
def csv_load(file):
    with open(file, newline='') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            if '' in (row[1], row[7]):
                continue
            yield (row[1], row[7])


# 使用OpenAI提取文本的嵌入
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
        if len(data_batch[0]) % BATCH_SIZE == 0:
            embed_insert(data_batch)
            data_batch = [[],[]]
        count += 1
    else:
        break

# 嵌入并插入剩余数据
if len(data_batch[0]) != 0:
    embed_insert(data_batch)

# 调用flush方法以索引任何未封装的段。
collection.flush()
```

<div class="alert note">

上述操作比较耗时，因为嵌入需要时间。为了将消耗的时间保持在可接受的水平，尝试将 [全局参数](#全局参数) 中的 `COUNT` 设置为适当的值。休息一下，享受一杯咖啡！

</div>

## 执行搜索




将所有数据插入 Milvus 后，我们可以开始执行搜索。在这个例子中，我们将根据情节搜索电影。因为我们正在进行批量搜索，搜索时间会在电影搜索之间共享。

```python
# 搜索与这些短语最接近的标题。
search_terms = ['A movie about cars', 'A movie about monsters']

# 根据输入文本进行数据库搜索
def embed_search(data):
    embeds = transformer.encode(data) 
    return [x for x in embeds]

search_data = embed_search(search_terms)

start = time.time()
res = collection.search(
    data=search_data,  # 嵌入搜索值
    anns_field="embedding",  # 在嵌入中搜索
    param={},
    limit = TOP_K,  # 每次搜索限制为 top_k 结果
    output_fields=['title']  # 在结果中包含标题字段
)
end = time.time()

for hits_i, hits in enumerate(res):
    print('标题:', search_terms[hits_i])
    print('搜索时间:', end-start)
    print('结果:')
    for hit in hits:
        print( hit.entity.get('title'), '----', hit.distance)
    print()
```

输出应类似于以下内容:

```shell
标题: A movie about cars
搜索时间: 0.08636689186096191
结果:
Youth's Endearing Charm ---- 1.0954499244689941
From Leadville to Aspen: A Hold-Up in the Rockies ---- 1.1019384860992432
Gentlemen of Nerve ---- 1.1331942081451416

标题: A movie about monsters
搜索时间: 0.08636689186096191
结果:
The Suburbanite ---- 1.0666425228118896
Youth's Endearing Charm ---- 1.1072258949279785
The Godless Girl ---- 1.1511223316192627
```

