---

id: 使用句子转换器进行嵌入.md
order: 3
summary: 本文演示了如何在 Milvus 中使用句子转换器将文档和查询编码成密集向量。
title: 句子转换器
---

# 句子转换器

Milvus 通过 __SentenceTransformerEmbeddingFunction__ 类与 [SentenceTransformer](https://www.sbert.net/docs/pretrained_models.html#model-overview) 预训练模型集成。此类提供了使用预训练的句子转换器模型对文档和查询进行编码的方法，并将嵌入返回为与 Milvus 索引兼容的密集向量。

要安装必要的句子转换器 Python 包，请使用以下命令：

```python
pip install sentence-transformers
```

然后，实例化 __SentenceTransformerEmbeddingFunction__：

```python
from pymilvus import model

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name='all-MiniLM-L6-v2', # 指定模型名称
    device='cpu' # 指定要使用的设备，例如 'cpu' 或 'cuda:0'
)
```

__参数__：

- __model_name__ (_string_)

    用于编码的 Sentence Transformer 模型的名称。默认值为 __all-MiniLM-L6-v2__。您可以使用句子转换器的任何预训练模型。有关可用模型的列表，请参阅 [预训练模型](https://www.sbert.net/docs/pretrained_models.html)。

- __device__ (_string_)

    要使用的设备，_cpu_ 表示 CPU，_cuda:n_ 表示第 n 个 GPU 设备。

要为文档创建嵌入，请使用 __encode_documents()__ 方法：

```python
docs = [
    "人工智能作为一门学科在1956年成立。",
    "艾伦·图灵是第一个在 AI 领域进行大量研究的人。",
    "图灵出生在伦敦的梅达谷，他在英格兰南部长大。",
]

docs_embeddings = sentence_transformer_ef.encode_documents(docs)

# 打印嵌入
print("嵌入:", docs_embeddings)
# 打印嵌入的维度和形状
print("维度:", sentence_transformer_ef.dim, docs_embeddings[0].shape)
```

预期输出类似于以下内容：

```python
嵌入: [array([-3.09392996e-02, -1.80662833e-02,  1.34775648e-02,  2.77156215e-02,
       -4.86349640e-03, -3.12581174e-02, -3.55921760e-02,  5.76934684e-03,
        2.80773244e-03,  1.35783911e-01,  3.59678417e-02,  6.17732145e-02,
...
       -4.61330153e-02, -4.85207550e-02,  3.13997865e-02,  7.82178566e-02,
       -4.75336798e-02,  5.21207601e-02,  9.04406682e-02, -5.36676683e-02],
      dtype=float32)]
维度: 384 (384,)
```

要为查询创建嵌入，请使用 __encode_queries()__ 方法：

```python
queries = ["人工智能是什么时候成立的",
           "艾伦·图灵出生在哪里？"]

query_embeddings = sentence_transformer_ef.encode_queries(queries)

# 打印嵌入
print("嵌入:", query_embeddings)
# 打印嵌入的维度和形状
print("维度:", sentence_transformer_ef.dim, query_embeddings[0].shape)
```

预期输出类似于以下内容：

```python
嵌入: [array([-2.52114702e-02, -5.29330298e-02,  1.14570223e-02,  1.95571519e-02,
       -2.46500354e-02, -2.66519729e-02, -8.48201662e-03,  2.82961670e-02,
       -3.65092754e-02,  7.50745758e-02,  4.28900979e-02,  7.18822703e-02,
...
       -6.76431581e-02, -6.45996556e-02, -4.