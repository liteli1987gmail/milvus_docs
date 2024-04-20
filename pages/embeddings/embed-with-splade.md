---
id: 使用-splade进行嵌入.md
order: 6
summary: 本文描述了如何使用SpladeEmbeddingFunction来使用SPLADE模型对文档和查询进行编码。
title: SPLADE 嵌入模型
---

# SPLADE

[SPLADE](https://arxiv.org/abs/2109.10086) 嵌入是一种模型，它为文档和查询提供了高度稀疏的表示，继承了词袋（BOW）模型的优良特性，如精确的术语匹配和效率。

Milvus通过 __SpladeEmbeddingFunction__ 类与SPLADE模型集成。此类提供了编码文档和查询的方法，并将嵌入作为与Milvus索引兼容的稀疏向量返回。

要实例化 __SpladeEmbeddingFunction__，请使用以下命令：

```python
from pymilvus import model

splade_ef = model.sparse.SpladeEmbeddingFunction(
    model_name="naver/splade-cocondenser-selfdistil", 
    device="cpu"
)
```

__参数__：

- __model_name__ (_string_)

    用于编码的SPLADE模型名称。有效选项包括 __naver/splade-cocondenser-ensembledistil__（默认）、__naver/splade_v2_max__、__naver/splade_v2_distil__ 和 __naver/splade-cocondenser-selfdistil__。更多信息，请参考 [Play with models](https://github.com/naver/splade?tab=readme-ov-file#playing-with-the-model)。

- __device__ (_string_)

    要使用的设备，_cpu_ 表示CPU，_cuda:n_ 表示第n个GPU设备。

要为文档创建嵌入，请使用 __encode_documents()__ 方法：

```python
docs = [
    "人工智能作为一门学科在1956年成立。",
    "艾伦·图灵是第一个在人工智能领域进行大量研究的人。",
    "图灵出生于伦敦的迈达维尔，在英格兰南部长大。",
]

docs_embeddings = splade_ef.encode_documents(docs)

# 打印嵌入
print("嵌入:", docs_embeddings)
# 由于输出的嵌入是2D csr_array格式，我们将它们转换为列表以便于操作。
print("稀疏维度:", splade_ef.dim, list(docs_embeddings)[0].shape)
```

预期输出类似于以下内容：

```python
嵌入： (0, 2001) 0.6392706036567688
  (0, 2034) 0.024093208834528923
  (0, 2082) 0.3230178654193878
...
  (2, 23602)    0.5671860575675964
  (2, 26757)    0.5770265460014343
  (2, 28639)    3.1990697383880615
稀疏维度：30522 (1, 30522)
```

要为查询创建嵌入，请使用 __encode_queries()__ 方法：

```python
queries = ["人工智能是在什么时候成立的？", 
           "艾伦·图灵在哪里出生？"]

query_embeddings = splade_ef.encode_queries(queries)

# 打印嵌入
print("嵌入:", query_embeddings)
# 由于输出的嵌入是2D csr_array格式，我们将它们转换为列表以便于操作。
print("稀疏维度:", splade_ef.dim, list(query_embeddings)[0].shape)
```

预期输出类似于以下内容：

```python
嵌入： (0, 2001)        0.6353746056556702
  (0, 2194)        0.015553371049463749
  (0, 2301)        0.2756537199020386
...
  (1, 18522)        0.1282549500465393
  (1, 23602)        0.13133203983306885
  (1, 28639)        2.8150033950805664
稀疏维度：30522 (1, 30522)
```