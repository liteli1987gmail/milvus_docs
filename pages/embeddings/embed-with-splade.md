

# SPLADE

[SPLADE](https://arxiv.org/abs/2109.10086) 嵌入是一种模型，为文档和查询提供高度稀疏的表示，继承了词袋模型（BOW）的优点，如精确术语匹配和高效性。

Milvus 通过 __SpladeEmbeddingFunction__ 类与 SPLADE 模型集成。该类提供了用于编码文档和查询并返回与 Milvus 索引兼容的稀疏向量的方法。

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

    用于编码的 SPLADE 模型的名称。有效选项为 __naver/splade-cocondenser-ensembledistil__（默认值），__naver/splade_v2_max__，__naver/splade_v2_distil__ 和 __naver/splade-cocondenser-selfdistil__。有关更多信息，请参阅 [Play with models](https://github.com/naver/splade?tab=readme-ov-file#playing-with-the-model)。

- __device__ (_string_)

    使用的设备，__cpu__ 表示使用 CPU，__cuda: n__ 表示第 n 个 GPU 设备。

要为文档创建嵌入，请使用 __encode_documents()__ 方法：

```python
docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

docs_embeddings = splade_ef.encode_documents(docs)

# 打印输出嵌入
print("Embeddings:", docs_embeddings)
# 由于输出嵌入是以2D csr_array格式，我们将其转换为列表以便更容易进行操作。
print("Sparse dim:", splade_ef.dim, list(docs_embeddings)[0].shape)
```

预期输出类似于以下内容：

```python
Embeddings:   (0, 2001) 0.6392706036567688
  (0, 2034) 0.024093208834528923
  (0, 2082) 0.3230178654193878
...
  (2, 23602)    0.5671860575675964
  (2, 26757)    0.5770265460014343
  (2, 28639)    3.1990697383880615
Sparse dim: 30522 (1, 30522)
```

要为查询创建嵌入，请使用 __encode_queries()__ 方法：

```python
queries = ["When was artificial intelligence founded", 
           "Where was Alan Turing born?"]

query_embeddings = splade_ef.encode_queries(queries)

# 打印输出嵌入
print("Embeddings:", query_embeddings)
# 由于输出嵌入是以2D csr_array格式，我们将其转换为列表以便更容易进行操作。
print("Sparse dim:", splade_ef.dim, list(query_embeddings)[0].shape)
```

预期输出类似于以下内容：

```python
Embeddings:   (0, 2001)        0.6353746056556702
  (0, 2194)        0.015553371049463749
  (0, 2301)        0.2756537199020386
...
  (1, 18522)        0.1282549500465393
  (1, 23602)        0.13133203983306885
  (1, 28639)        2.8150033950805664
Sparse dim: 30522 (1, 30522)
```
