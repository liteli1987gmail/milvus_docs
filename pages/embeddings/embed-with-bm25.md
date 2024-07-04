


# BM25

[BM25](https://en.wikipedia.org/wiki/Okapi_BM25) 是一种在信息检索中用于估计文档与给定搜索查询的相关性的排序函数。它通过引入文档长度归一化和术语频率饱和度来增强基本的词频方法。BM25 能够生成稀疏嵌入，将文档表示为术语重要性评分的向量，从而实现在稀疏向量空间中的高效检索和排序。

Milvus 使用 __BM25EmbeddingFunction__ 类集成了 BM25 模型。该类处理嵌入的计算，并以与 Milvus 兼容的格式返回它们，以便进行索引和搜索。在该过程中，构建一个用于分词的分析器非常重要。

为了轻松创建一个分词器，Milvus 提供了一个默认分析器，只需要指定文本的语言。

__示例__：

```python
from pymilvus.model.sparse.bm25.tokenizers import build_default_analyzer
from pymilvus.model.sparse import BM25EmbeddingFunction

# 有一些内置的分析器适用于几种语言，现在我们使用英语'en'。
analyzer = build_default_analyzer(language="en")

corpus = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

# 分析器可以将文本分词为标记
tokens = analyzer(corpus[0])
print("tokens:", tokens)
```

__参数__：

- __language__ (_string_)

    要进行分词的文本的语言。有效选项为 __en__ (英语), __de__ (德语), __fr__ (法语), __ru__ (俄语), __sp__ (西班牙语), __it__ (意大利语), __pt__ (葡萄牙语), __zh__ (中文), __jp__ (日语), __kr__ (韩语)。

预期输出类似于以下内容：

```python
tokens: ['artifici', 'intellig', 'found', 'academ', 'disciplin', '1956']
```

BM25 算法的处理过程首先使用内置分析器将文本分词，如英语语言的标记 __'artifici'__，__'intellig'__ 和 __'academ'__。然后，它会收集关于这些标记的统计信息，评估它们在文档中的频率和分布。BM25 的核心根据其重要性计算每个标记的相关性得分，较稀有的标记得到较高的得分。这个简明的过程能够有效地根据查询的相关性对文档进行排序。

要收集语料库的统计信息，使用 __fit()__ 方法：

```python
# 使用分析器来实例化BM25EmbeddingFunction
bm25_ef = BM25EmbeddingFunction(analyzer)

# 在语料库上拟合模型以获得语料库的统计信息
bm25_ef.fit(corpus)
```

然后，使用 __encode_documents()__ 创建文档的嵌入向量：

```python
docs = [
    "The field of artificial intelligence was established as an academic subject in 1956.",
    "Alan Turing was the pioneer in conducting significant research in artificial intelligence.",
    "Originating in Maida Vale, London, Turing grew up in the southern regions of England.",
    "In 1956, artificial intelligence emerged as a scholarly field.",
    "Turing, originally from Maida Vale, London, was brought up in the south of England."
]

# 为文档创建嵌入向量
docs_embeddings = bm25_ef.encode_documents(docs)

# 打印嵌入向量
print("Embeddings:", docs_embeddings)
# 由于输出的嵌入向量是2D csr_array格式，我们将其转换为列表以便于操作。
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

要为查询创建嵌入向量，使用 __encode_queries()__ 方法：

```python
queries = ["When was artificial intelligence founded", 
           "Where was Alan Turing born?"]

query_embeddings = bm25_ef.encode_queries(queries)

 


# 打印嵌入向量
print("嵌入向量:", query_embeddings)
# 由于输出的嵌入向量是以2D csr_array格式表示的，我们将其转换为列表以便于处理。
print("稀疏维度:", bm25_ef.dim, list(query_embeddings)[0].shape)
```

期望的输出与以下类似：

```python
嵌入向量:   (0, 0)        0.5108256237659907
  (0, 1)        0.5108256237659907
  (0, 2)        0.5108256237659907
  (1, 6)        0.5108256237659907
  (1, 7)        0.11554389108992644
  (1, 14)        0.5108256237659907
稀疏维度: 21 (1, 21)
```

__注意：__

在使用 __BM25EmbeddingFunction__ 时，请注意 __encoding_queries()__ 和 __encoding_documents()__ 操作不能在数学上互换。因此，没有实现可用于 __bm25_ef(texts)__ 的函数。

