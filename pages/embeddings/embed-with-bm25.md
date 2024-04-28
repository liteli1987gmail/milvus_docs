
---
id: embed-with-bm25.md
order: 5
summary: BM25 是一种用于信息检索的排名函数，用于估计文档对给定搜索查询的相关性。
title: BM25
---

# BM25 嵌入模型

[BM25](https://en.wikipedia.org/wiki/Okapi_BM25) 是一种用于信息检索的排名函数，用于估计文档对给定搜索查询的相关性。它通过引入文档长度归一化和术语频率饱和度来增强基本的术语频率方法。BM25可以通过将文档表示为术语重要性得分的向量来生成稀疏嵌入，从而允许在稀疏向量空间中进行高效的检索和排名。

Milvus 通过 `BM25EmbeddingFunction` 类集成了 BM25 模型。这个类处理嵌入的计算并返回与 Milvus 兼容的格式，以便进行索引和搜索。此过程中至关重要的是构建一个用于分词的分析器。

为了轻松创建分词器，Milvus 提供了一个默认分析器，该分析器只需要指定文本的语言。

## 示例：

```python
from pymilvus.model.sparse.bm25.tokenizers import build_default_analyzer
from pymilvus.model.sparse import BM25EmbeddingFunction

# 有几个内置的分析器支持几种语言，现在我们使用 'en' 表示英语。
analyzer = build_default_analyzer(language="en")

corpus = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

# 分析器可以将文本分词为 tokens
tokens = analyzer(corpus[0])
print("tokens:", tokens)
```

## 参数：

- __language__ (_string_)

    要分词的文本的语言。有效选项有 __en__ (英语), __de__ (德语), __fr__ (法语), __ru__ (俄语), __sp__ (西班牙语), __it__ (意大利语), __pt__ (葡萄牙语), __zh__ (中文), __jp__ (日语), __kr__ (韩语)。

预期输出类似于以下内容：

```python
tokens: ['artifici', 'intellig', 'found', 'academ', 'disciplin', '1956']
```

BM25 算法通过首先使用内置分析器将文本分解为 tokens 来处理文本，如示例中所示的英语语言 tokens 如 __'artifici'__, __'intellig'__, 和 __'academ'__。然后，它收集这些 tokens 的统计信息，评估它们在文档中的频率和分布。BM25 的核心是根据每个 token 的重要性计算其相关性得分，较少见的 tokens 会获得更高的分数。这个简洁的过程使得文档可以有效地根据与查询的相关性进行排名。

要收集语料库的统计信息，请使用 `fit()` 方法：

```python
# 使用分析器实例化 BM25EmbeddingFunction
bm25_ef = BM25EmbeddingFunction(analyzer)

# 拟合模型以获取语料库的统计信息
bm25_ef.fit(corpus)
```

然后，使用 `encode_documents()` 创建文档的嵌入：

```python
docs = [
    "The field of artificial intelligence was established as an academic subject in 1956.",
    "Alan Turing was the pioneer in conducting significant research in artificial intelligence.",
    "Originating in Maida Vale, London, Turing grew up in the southern regions of England.",
    "In 1956, artificial intelligence emerged as a scholarly field.",
    "Turing, originally from Maida Vale, London, was brought up in the south of England."
]

# 为文档创建嵌入
docs_embeddings = bm25_ef.encode_documents(docs)

# 打印嵌入
print("Embeddings:", docs_embeddings)
# 由于输出嵌入是 2D csr_array 格式，我们将其转换为列表以便于操作。
print("Sparse dim:", bm25_ef.dim, list(docs_embeddings)[0].shape)
```

预期输出类似于以下内容：

```python
Embeddings:   (0, 0)        1.0208816705336425
  (0, 1)        1.0208816705336425
  (0, 3)        1.0208816705336425
...
  (4, 16)        0.9606986899563318
  (4, 17)        0.9606986899563318
  (4, 20)        0.9606986899563318
Sparse dim: 21 (1, 21)
```

要为查询创建嵌入，请使用 `encode_queries()` 方法：

```python
queries = ["When was artificial intelligence founded", 
           "Where was Alan Turing born?"]

query_embeddings = bm25_ef.encode_queries(queries)

# Print embeddings
print("Embeddings:", query_embeddings)
# Since the output embeddings are in a 2D csr_array format, we convert them to a list for easier manipulation.
print("Sparse dim:", bm25_ef.dim, list(query_embeddings)[0].shape)
```

The expected output is similar to the following:

```python
Embeddings:   (0, 0)        0.5108256237659907
  (0, 1)        0.5108256237659907
  (0, 2)        0.5108256237659907
  (1, 6)        0.5108256237659907
  (1, 7)        0.11554389108992644
  (1, 14)        0.5108256237659907
Sparse dim: 21 (1, 21)
```

__Notes:__

When using __BM25EmbeddingFunction__, note that __encoding_queries()__ and __encoding_documents()__ operations cannot be interchanged mathematically. Therefore, there is no implemented __bm25_ef(texts)__ available.
