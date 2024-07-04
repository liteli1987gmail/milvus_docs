



---
id: embed-with-openai.md
order: 2
summary: Milvus通过OpenAIEmbeddingFunction类与OpenAI模型集成。
title: OpenAI
---

# OpenAI

Milvus 通过 __OpenAIEmbeddingFunction__ 类与 OpenAI 模型集成。该类提供了使用预训练的 OpenAI 模型对文档和查询进行编码的方法，并将嵌入作为与 Milvus 索引兼容的稠密向量返回。要使用此功能，请在 [OpenAI](https://openai.com/api/) 上创建帐户，获取 API 密钥。

要安装所需的 OpenAI Python 包，请使用以下命令:

---python
pip install openai
```

然后，实例化__OpenAIEmbeddingFunction__：

```python
from pymilvus import model

openai_ef = model.dense.OpenAIEmbeddingFunction(
    model_name='text-embedding-3-large', # 指定模型名称
    api_key='YOUR_API_KEY', # 提供你的OpenAI API密钥
    dimensions=512 # 设置嵌入的维度
)
```

__参数__:

- __model_name__ (_string_)

    要使用的OpenAI模型的名称。有效选项为__text-embedding-3-small__、__text-embedding-3-large__和__text-embedding-ada-002__（默认）。

- __api_key__ (_string_)

    访问OpenAI API的API密钥。

- __dimensions__ (_int_)

    输出嵌入应具有的维度数。仅适用于__text-embedding-3__及更高版本的模型。

要为文档创建嵌入，请使用__encode_documents()__方法：

```python
docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

docs_embeddings = openai_ef.encode_documents(docs)

# 打印嵌入结果
print("嵌入:", docs_embeddings)
# 打印嵌入结果的维度和形状
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
 
要为查询创建嵌入，请使用__encode_queries()__方法：

```python
queries = ["When was artificial intelligence founded", 
           "Where was Alan Turing born?"]

query_embeddings = openai_ef.encode_queries(queries)

# 打印嵌入结果
print("嵌入:", query_embeddings)
# 打印嵌入结果的维度和形状
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

