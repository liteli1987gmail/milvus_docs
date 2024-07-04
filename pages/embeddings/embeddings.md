


# 概述

嵌入是将数据映射到高维空间的机器学习概念，其中具有相似语义的数据被放置在一起。通常，嵌入模型是来自 BERT 或其他 Transformer 系列的深度神经网络，它可以通过一系列称为向量的数字有效地表示文本、图像和其他数据类型的语义。这些模型的一个关键特征是高维空间中向量之间的数学距离可以指示原始文本或图像的语义相似性。这个属性解锁了许多信息检索应用，比如像 Google 和 Bing 这样的网络搜索引擎，电子商务网站上的产品搜索和推荐，以及最近流行的检索增强生成（RAG）模式中的生成型 AI。

有两个主要类别的嵌入，每个类别都生成不同类型的向量：

- __稠密嵌入__：大多数嵌入模型将信息表示为数百到数千维的浮点向量。输出被称为 "稠密" 向量，因为大多数维度具有非零值。例如，流行的开源嵌入模型 BAAI/bge-base-en-v1.5 输出 768 个浮点数（768 维浮点向量）的向量。

- __稀疏嵌入__：相反，稀疏嵌入的输出向量大多数维度为零，即 "稀疏" 向量。这些向量通常具有更高的维度（数万维或更多），其由标记词汇表的大小确定。可以通过深度神经网络或文本语料库的统计分析生成稀疏向量。由于它们的可解释性和在领域之外更好的泛化能力，稀疏嵌入越来越多地被开发者作为稠密嵌入的补充而采用。

Milvus 提供了内置的嵌入函数，可与流行的嵌入提供商一起使用。在 Milvus 中创建集合之前，你可以使用这些函数为数据集生成嵌入，简化数据准备和向量搜索的过程。

有关生成嵌入的示例，请参阅 [使用 PyMilvus 模型生成文本嵌入](https://github.com/milvus-io/bootcamp/blob/master/bootcamp/model/embedding_functions.ipynb)。

| 模型嵌入函数                                                                                     | 类型   | API 或开源   |
| -------------------------------------------------------------------------------- | ------ | ------------ |
| [openai](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/OpenAIEmbeddingFunction/OpenAIEmbeddingFunction.md) | 稠密   | API          |
| [sentence-transformer](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/SentenceTransformerEmbeddingFunction/SentenceTransformerEmbeddingFunction.md) | 稠密   | 开源         |
| [bm25](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/BM25EmbeddingFunction/BM25EmbeddingFunction.md) | 稀疏   | 开源         |
| [Splade](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/SpladeEmbeddingFunction/SpladeEmbeddingFunction.md) | 稀疏   | 开源         |
| [bge-m3](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/BGEM3EmbeddingFunction/BGEM3EmbeddingFunction.md) | 混合   | 开源         |

## 示例 1：使用默认嵌入函数生成稠密向量

要在 Milvus 中使用嵌入函数，首先安装包含了用于嵌入生成的 `model` 子包的 PyMilvus 客户端库。

```python
pip install pymilvus[model]
# or pip install "pymilvus[model]" for zsh.
```

`model` 子包支持各种嵌入模型，包括 [OpenAI](/embeddings/embed-with-openai.md)、[句子变换器](/embeddings/embed-with-sentence-transform.md)、[BGE M3](/embeddings/embed-with-bgm-m3.md)、[BM25](/embeddings/embed-with-bm25.md) 以及 [SPLADE](/embeddings/embed-with-splade.md) 预训练模型。为了简单起见，此示例使用 `DefaultEmbeddingFunction`，它是 __all-MiniLM-L6-v2__ 句子变换器模型，该模型约为 70MB，并在首次使用时下载：

```python
from pymilvus import model

# 这将下载 "all-MiniLM-L6-v2"，一个轻量级模型。
ef = model.DefaultEmbeddingFunction()

# 生成嵌入的数据
docs = [
    "人工智能是在1956年作为一门学科创立的。",
    "艾伦·图灵是第一个在人工智能领域开展大量研究的人。",
    "图灵出生在伦敦梅达维尔区，长大在英国南部。",
]

embeddings = ef.encode_documents(docs)

# 打印嵌入结果
print("嵌入结果：", embeddings)
# 打印嵌入的维度和形状
print("维度:", ef.dim, embeddings[0].shape)
```

预期输出类似于以下内容：

```python
嵌入结果： [array([-3.09392996e-02, -1.80662833e-02,  1.34775648e-02,  2.77156215e-02,
       -4.86349640e-03, -3.12581174e-02, -3.55921760e-02,  5.76934684e-03,
        2.80773244e-03,  1.35783911e-01,  3.59678417e-02,  6.17732145e-02,
...
       -4.61330153e-02, -4.85207550e-02,  3.13997865e-02,  7.82178566e-02,
       -4.75336798e-02,  5.21207601e-02,  9.04406682e-02, -5.36676683e-02],
      dtype=float32)]
维度：384 (384,)
```

## 示例 2：使用 BGE M3 模型一次生成稠密和稀疏向量
 





In this example, we use [BGE M3](/embeddings/embed-with-bgm-m3.md) 混合模型将文本嵌入稠密和稀疏向量，并将它们用于检索相关文档。总体步骤如下：

1. 使用 BGE-M3 模型将文本嵌入为稠密和稀疏向量；

2. 设置 Milvus 集合来存储稠密和稀疏向量；

3. 将数据插入到 Milvus；

4. 搜索和检查结果。

首先，我们需要安装必要的依赖项。

```python
from pymilvus.model.hybrid import BGEM3EmbeddingFunction
from pymilvus import (
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection, AnnSearchRequest, RRFRanker, connections,
)
```

使用 BGE M3 对文档和查询进行编码以进行嵌入式检索。

```python
# 1. 准备一个小的语料库进行搜索
docs = [
    "人工智能学科成立于1956年。",
    "艾伦·图灵是第一个进行大量人工智能研究的人。",
    "图灵出生在伦敦梅达维尔，后来在英格兰南部长大。",
]
query = "谁开始了人工智能研究？"

# BGE-M3 模型可以将文本嵌入为稠密和稀疏向量。
# 它包含在 pymilvus 的可选 'model' 模块中，要安装它，
# 只需运行 "pip install pymilvus[model]".

bge_m3_ef = BGEM3EmbeddingFunction(use_fp16=False, device="cpu")

docs_embeddings = bge_m3_ef(docs)
query_embeddings = bge_m3_ef([query])
```

## 示例 3：使用 BM25 模型生成稀疏向量



BM25 是一种著名的方法，它使用词出现频率来确定查询和文档之间的相关性。在这个示例中，我们将展示如何使用 `BM25EmbeddingFunction` 为查询和文档生成稀疏嵌入。

首先，导入 __BM25EmbeddingFunction__ 类。

```xml
from pymilvus.model.sparse import BM25EmbeddingFunction
```

在 BM25 中，重要的是要计算文档中的统计信息以获得 IDF（逆文档频率），它可以表示文档中的模式。IDF 是一个衡量词语提供信息量的度量，即它在所有文档中是常见的还是罕见的。

```python
# 1. 准备一个小的文集用于搜索
docs = [
    "人工智能于1956年作为一门学科被创立。",
    "艾伦·图灵是第一个进行大量人工智能研究的人。",
    "图灵出生在伦敦的梅达维尔区，成长在英格兰南部。",
]
query = "图灵出生在哪里？"
bm25_ef = BM25EmbeddingFunction()

# 2. 对文集进行拟合，获取BM25模型在你的文档上的参数。
bm25_ef.fit(docs)

# 3. 将拟合的参数保存到磁盘上，以加速未来的处理。
bm25_ef.save("bm25_params.json")

# 4. 加载保存的参数
new_bm25_ef = BM25EmbeddingFunction()
new_bm25_ef.load("bm25_params.json")

docs_embeddings = new_bm25_ef.encode_documents(docs)
query_embeddings = new_bm25_ef.encode_queries([query])
print("维度:", new_bm25_ef.dim, list(docs_embeddings)[0].shape)
```

期望的输出类似于以下内容：

```python
维度: 21 (1, 21)
```

