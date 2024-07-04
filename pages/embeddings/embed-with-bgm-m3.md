


# BGE M3

[BGE-M3](https://arxiv.org/abs/2402.03216) 以其在多语言、多功能和多粒度方面的能力而得名。BGE-M3 支持 100 多种语言，为多语言和跨语言检索任务树立了新的基准。它在单个框架中执行密集检索、多向量检索和稀疏检索的独特能力，使其成为广泛的信息检索（IR）应用的理想选择。

Milvus 使用 __BGEM3EmbeddingFunction__ 类与 BGE M3 模型集成。该类负责计算嵌入并以与 Milvus 兼容的格式返回它们，以供索引和搜索使用。为了使用此功能，必须安装 FlagEmbedding。

要安装所需的 FlagEmbedding Python 包，请使用以下命令：

```python
pip install FlagEmbedding
```

然后，实例化 __BGEM3EmbeddingFunction__：

```python
from pymilvus.model.hybrid import BGEM3EmbeddingFunction

bge_m3_ef = BGEM3EmbeddingFunction(
    model_name='BAAI/bge-m3',  # 指定模型名称
    device='cpu',  # 指定使用的设备，例如'cpu'或'cuda:0'
    use_fp16=False  # 指定是否使用fp16。如果`device`是`cpu`，则设置为'False'。
)
```

__参数__：

- __model_name__ (_string_)

    用于编码的模型名称。默认值为 __BAAI/bge-m3__。

- __device__ (_string_)

    使用的设备，使用 __cpu__ 表示 CPU，使用 __cuda: n__ 表示第 n 个 GPU 设备。

- __use_fp16__ (_bool_)

    是否使用 16 位浮点精度（fp16）。如果 __device__ 是 __cpu__，请指定 __False__。

要为文档创建嵌入，请使用 __encode_documents()__ 方法：

```python
docs = [
    "人工智能学科成立于1956年。",
    "艾伦·图灵是第一个在人工智能领域进行大量研究的人。",
    "图灵出生于伦敦迈达维尔，成长于英格兰南部。",
]

docs_embeddings = bge_m3_ef.encode_documents(docs)

# 打印嵌入
print("嵌入：", docs_embeddings)
# 打印密集嵌入的维度
print("密集文档维度：", bge_m3_ef.dim["dense"], docs_embeddings["dense"][0].shape)
# 由于稀疏嵌入以2D csr_array格式存在，我们将它们转换为列表以便更容易处理。
print("稀疏文档维度：", bge_m3_ef.dim["sparse"], list(docs_embeddings["sparse"])[0].shape)
```

预期输出类似于以下内容：

```python
嵌入： {'dense': [array([-0.02505937, -0.00142193,  0.04015467, ..., -0.02094924,
        0.02623661,  0.00324098], dtype=float32), array([ 0.00118463,  0.00649292, -0.00735763, ..., -0.01446293,
        0.04243685, -0.01794822], dtype=float32), array([ 0.00415287, -0.0101492 ,  0.0009811 , ..., -0.02559666,
        0.08084674,  0.00141647], dtype=float32)], 'sparse': <3x250002 sparse array of type '<class 'numpy.float32'>'
        with 43 stored elements in Compressed Sparse Row format>}
密集文档维度： 1024 (1024,)
稀疏文档维度： 250002 (1, 250002)
```

要为查询创建嵌入，请使用 __encode_queries()__ 方法：

```python
queries = ["人工智能成立于何时",
           "艾伦·图灵出生在哪里？"]

query_embeddings = bge_m3_ef.encode_queries(queries)

# 打印嵌入
print("嵌入：", query_embeddings)
# 打印密集嵌入的维度
print("密集查询维度：", bge_m3_ef.dim["dense"], query_embeddings["dense"][0].shape)
# 由于稀疏嵌入以2D csr_array格式存在，我们将它们转换为列表以便更容易处理。
print("稀疏查询维度：", bge_m3_ef.dim["sparse"], list(query_embeddings["sparse"])[0].shape)
```

预期输出类似于以下内容：

```python
嵌入： {'dense': [array([-0.02024024, -0.01514386,  0.02380808, ...,  0.00234648,
       -0.00264978, -0.04317448], dtype=float32), array([ 0.00648045, -0.0081542 , -0.02717067, ..., -0.00380103,
        0.04200587, -0.01274772], dtype=float32)], 'sparse': <2x250002 sparse array of type '<class 'numpy.float32'>'
        with 14 stored elements in Compressed Sparse Row format>}
密集查询维度： 1024 (1024,)
稀疏查询维度： 250002 (1, 250002)
 

Sparse query dim: 250002 (1, 250002)
