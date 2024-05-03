---

id: embeddings.md
order: 1
summary: 学习如何为您的数据生成嵌入向量。
title: 嵌入模型概述

---

# 嵌入模型概述

嵌入是一种机器学习概念，用于将数据映射到高维空间，在该空间中，语义相似的数据被放置在一起。通常是一个深度神经网络，如BERT或其他Transformer家族的模型，嵌入模型可以有效地表示文本、图像和其他数据类型的语义，以一系列称为向量的数字表示。这些模型的一个关键特性是，高维空间中向量之间的数学距离可以指示原始文本或图像的语义相似性。这种属性解锁了许多信息检索应用，例如像Google和Bing这样的网络搜索引擎，电子商务网站上的产品搜索和推荐，以及最近在生成型AI中流行的检索增强生成（RAG）范式。

嵌入主要分为两大类，每种产生不同类型的向量：

- __Dense embedding__：大多数嵌入模型将信息表示为数百到数千个维度的浮点数向量。输出称为“密集”向量，因为大多数维度都有非零值。例如，流行的开源嵌入模型BAAI/bge-base-en-v1.5输出768个浮点数的向量（768维浮点数向量）。

- __Sparse embedding__：相比之下，稀疏嵌入的输出向量大多数维度为零，即“稀疏”向量。这些向量通常具有更高的维度（数万或更多），由令牌词汇表的大小决定。稀疏向量可以由深度神经网络或文本语料库的统计分析生成。由于它们的可解释性和观察到的更好的跨领域泛化能力，稀疏嵌入越来越多地被开发者作为密集嵌入的补充采用。

Milvus提供了内置的嵌入函数，与流行的嵌入提供商兼容。在创建Milvus集合之前，您可以使用这些函数为您的数据集生成嵌入，简化了准备数据和向量搜索的过程。

要实际操作创建嵌入，请参阅[使用PyMilvus的模型生成文本嵌入](https://github.com/milvus-io/bootcamp/blob/master/bootcamp/model/embedding_functions.ipynb)。

|  嵌入函数                                                                   |  类型   |  API或开源 |
| ------------------------------------------------------------------------------------- | ------- | -------------------- |
|  [openai](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/OpenAIEmbeddingFunction/OpenAIEmbeddingFunction.md)                            |  密集  |  API                 |
|  [sentence-transformer](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/SentenceTransformerEmbeddingFunction/SentenceTransformerEmbeddingFunction.md) |  密集  |  开源                |
|  [bm25](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/BM25EmbeddingFunction/BM25EmbeddingFunction.md)                                |  稀疏  |  开源                |
|  [Splade](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/SpladeEmbeddingFunction/SpladeEmbeddingFunction.md)                            |  稀疏  |  开源                |
|  [bge-m3](https://milvus.io/api-reference/pymilvus/v2.4.x/Model/BGEM3EmbeddingFunction/BGEM3EmbeddingFunction.md)                             |  混合  |  开源                |

## 示例 1：使用默认嵌入函数生成密集向量

要使用Milvus的嵌入函数，首先安装PyMilvus客户端库，其中包括`model`子包，该子包封装了所有用于嵌入生成的实用工具。

```python
pip install pymilvus[model]
# 或者在zsh中使用pip install "pymilvus[model]"
```

`model`子包支持各种嵌入模型，从[OpenAI](https://milvus.io/docs/embed-with-openai.md)、[Sentence Transformers](https://milvus.io/docs/embed-with-sentence-transform.md)、[BGE M3](https://milvus.io/docs/embed-with-bgm-m3.md)、[BM25](https://milvus.io/docs/embed-with-bm25.md)到[SPLADE](https://milvus.io/docs/embed-with-splade.md)预训练模型。为了简单起见，本示例使用`DefaultEmbeddingFunction`，这是__all-MiniLM-L6-v2__句子转换器模型，模型约为70MB，在首次使用时将被下载：

```python
from pymilvus import model

# 这将下载“all-MiniLM-L6-v2”，一个轻量级模型。
ef = model.DefaultEmbeddingFunction()

# 要从中生成嵌入的数据
docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

embeddings = ef.encode_documents(docs)

# Print embeddings
print("Embeddings:", embeddings)
# Print dimension and shape of embeddings
print("Dim:", ef.dim, embeddings[0].shape)
```

预期输出类似于下面的内容：

```python
Embeddings: [array([-3.09392996e-02, -1.80662833e-02,  1.34775648e-02,  2.77156215e-02,
       -4.86349640e-03, -3.12581174e-02, -3.55921760e-02,  5.76934684e-03,
        2.80773244e-03,  1.35783911e-01,  3.59678417e-02,  6.17732145e-02,
...
       -4.61330153e-02, -4.85207550e-02,  3.13997865e-02,  7.82178566e-02,
       -4.75336798e-02,  5.21207601e-02,  9.04406682e-02, -5.36676683e-02],
      dtype=float32)]
Dim: 384 (384,)
```

## 示例 2：使用 BGE M3 模型一次调用生成密集向量和稀疏向量

在本例中，我们使用 [BGE M3](https://milvus.io/docs/embed-with-bgm-m3.md) 混合模型将文本嵌入密集向量和稀疏向量，并利用它们检索相关文档。总体步骤如下：

1. 使用 BGE-M3 模型将文本嵌入到密集向量和稀疏向量中； 
2. 建立一个 Milvus 集合来存储密集向量和稀疏向量； 
3. 将数据插入 Milvus； 
4. 搜索并检查结果。

首先，我们需要安装必要的依赖项。

```python
from pymilvus.model.hybrid import BGEM3EmbeddingFunction
from pymilvus import (
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection, AnnSearchRequest, RRFRanker, connections,
)
```

使用 BGE M3 对文档和查询进行编码，以便嵌入检索。

```python
# 1. prepare a small corpus to search
docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]
query = "Who started AI research?"

# BGE-M3 model can embed texts as dense and sparse vectors.
# It is included in the optional `model` module in pymilvus, to install it,
# simply run "pip install pymilvus[model]".

bge_m3_ef = BGEM3EmbeddingFunction(use_fp16=False, device="cpu")

docs_embeddings = bge_m3_ef(docs)
query_embeddings = bge_m3_ef([query])
```

## 示例 3：使用 BM25 模型生成稀疏向量

BM25 是一种著名的方法，它使用单词出现频率来确定查询和文档之间的相关性。在本例中，我们将展示如何使用 `BM25EmbeddingFunction` 为查询和文档生成稀疏嵌入。

首先，导入 __BM25EmbeddingFunction__ 类。

```python
from pymilvus.model.sparse import BM25EmbeddingFunction
```

在 BM25 中，计算文档中的统计数据以获得 IDF（反向文档频率）非常重要，它可以代表文档中的模式。IDF 是一个衡量单词所提供信息量的指标，即该单词在所有文档中是常见还是罕见。

```python
# 1. 准备语料库
docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]
query = "Where was Turing born?"
bm25_ef = BM25EmbeddingFunction()

# 2. 对语料库进行拟合，以获得文档的 BM25 模型参数。
bm25_ef.fit(docs)

# 3. 将拟合参数存储到磁盘中，以加快特性的处理速度
bm25_ef.save("bm25_params.json")

# 4. 载保存的参数
new_bm25_ef = BM25EmbeddingFunction()
new_bm25_ef.load("bm25_params.json")

docs_embeddings = new_bm25_ef.encode_documents(docs)
query_embeddings = new_bm25_ef.encode_queries([query])
print("Dim:", new_bm25_ef.dim, list(docs_embeddings)[0].shape)
```

预期输出类似于下面的内容：

```python
Dim: 21 (1, 21)
```
