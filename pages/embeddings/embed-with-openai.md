
---
id: embed-with-openai.md
order: 2
summary: Milvus 通过 OpenAIEmbeddingFunction 类与 OpenAI 的模型进行集成
title: OpenAI 嵌入模型
---

# OpenAI

Milvus 通过 `OpenAIEmbeddingFunction` 类与 OpenAI 的模型进行集成。此类提供了使用预训练的 OpenAI 模型对文档和查询进行编码的方法，并将嵌入返回为与 Milvus 索引兼容的密集向量。要使用此功能，请通过在他们的平台上创建账户，从 [OpenAI](https://openai.com/api/) 获取 API 密钥。

要安装必要的 OpenAI Python 包，请使用以下命令：

```python
pip install openai
```

然后，实例化 `OpenAIEmbeddingFunction`：

```python
from pymilvus import model

openai_ef = model.dense.OpenAIEmbeddingFunction(
    model_name='text-embedding-3-large',  # 指定模型名称
    api_key='YOUR_API_KEY',  # 提供你的 OpenAI API 密钥
    dimensions=512  # 设置嵌入的维度
)
```

**参数**：

- `model_name` (_string_)

  用于编码的 OpenAI 模型的名称。有效选项包括 `text-embedding-3-small`、`text-embedding-3-large` 和 `text-embedding-ada-002`（默认）。

- `api_key` (_string_)

  用于访问 OpenAI API 的 API 密钥。

- `dimensions` (_int_)

  生成的输出嵌入应具有的维度数。仅在 `text-embedding-3` 及以后的模型中支持。

要为文档创建嵌入，请使用 `encode_documents()` 方法：

```python
docs = [
    "人工智能于1956年作为一门学科被创立。",
    "艾伦·图灵是第一个进行大量人工智能研究的人。",
    "图灵出生于伦敦的梅达维尔，在英格兰南部长大。",
]

docs_embeddings = openai_ef.encode_documents(docs)

# 打印嵌入
print("嵌入:", docs_embeddings)
# 打印嵌入的维度和形状
print("维度:", openai_ef.dim, docs_embeddings[0].shape)
```

预期的输出类似于以下内容：

```python
嵌入: [array([ 1.76741909e-02, -2.04964578e-02, -1.09788161e-02, -5.27223349e-02,
        4.23139781e-02, -6.64533582e-03,  4.21088142e-03,  1.04644023e-01,
        5.10009527e-02,  5.32827862e-02, -3.26061808e-02, -3.66494283e-02,
...
       -8.93232748e-02,  6.68255147e-03,  3.55093405e-02, -5.09071983e-02,
        3.74144339e-03,  4.72541340e-02,  2.11916920e-02,  1.00753829e-02,
       -5.76633997e-02,  9.68257990e-03,  4.62721288e-02, -4.33261096e-02])]
维度: 512 (512,)
```

要为查询创建嵌入，请使用 `encode_queries()` 方法：

```python
queries = ["人工智能是在什么时候创立的",
           "艾伦·图灵是在哪里出生的？"]

query_embeddings = openai_ef.encode_queries(queries)

# 打印嵌入
print("嵌入:", query_embeddings)
# 打印嵌入的维度和形状
print("维度", openai_ef.dim, query_embeddings[0].shape)
```

预期的输出类似于以下内容：


```python
嵌入: [array([ 0.00530251, -0.01907905, -0.01672608, -0.05030033,  0.01635982,
       -0.03169853, -0.0033602 ,  0.09047844,  0.00030747,  0.11853652,
       -0.02870182, -0.01526102,  0.05505067,  0.00993909, -0.07165466,
...
       -9.78106782e-02, -2.22669560e-02,  1.21873049e-02, -4.83198799e-02,
        5.32377362e-02, -1.90469325e-02,  5.62430918e-02,  1.02650477e-02,
       -6.21757433e-02,  7.88027793e-02,  4.91846527e-04, -1.51633881e-02])]
维度 512 (512,)
```
