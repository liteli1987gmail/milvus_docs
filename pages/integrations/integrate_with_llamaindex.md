---
id: integrate_with_llamaindex.md
summary: This page goes over how to search for the best answer to questions using Milvus as the Vector Database and LlamaIndex as the embedding system.
title: 利用 Milvus 和 LlamaIndex 构建检索增强生成（RAG）系统
---

# 利用 Milvus 和 LlamaIndex 构建检索增强生成（RAG）系统

本指南展示了如何使用 LlamaIndex 和 Milvus 构建检索增强生成（RAG）系统。

RAG 系统结合了检索系统和生成模型，基于给定的提示生成新文本。系统首先使用类似 Milvus 这样的向量相似性搜索引擎从语料库中检索相关文档，然后使用生成模型基于检索到的文档生成新文本。

[LlamaIndex](https://www.llamaindex.ai/) 是一个简单、灵活的数据框架，用于将自定义数据源连接到大型语言模型（LLMs）。[Milvus](https://milvus.io/) 是世界上最先进的开源向量数据库，旨在支持嵌入相似性搜索和 AI 应用。

## 开始之前

本页上的代码片段需要 **pymilvus** 和 **llamaindex** 库。您可以使用以下命令安装它们：

```shell
python3 -m pip install --upgrade pymilvus llama-index openai
```

此外，LlamaIndex 需要后端的 LLM 模型。在本文中，我们将使用 OpenAI 作为 LLM 后端。您可以在 [OpenAI](https://openai.com/) 注册免费 API 密钥。

```python
import openai

openai.api_key = "sk-**************************"
```

## 准备数据

在本节中，您需要为 RAG 系统准备数据。运行以下命令下载示例数据。

```shell
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

示例数据是 Paul Graham 的一篇名为 _What I Worked On_ 的单篇散文。在您可以将其用于 RAG 系统之前，您需要使其对 LlamaIndex 可访问。

```python
from llamaindex import SimpleDirectoryReader

# 加载文档
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()

print("文档 ID:", documents[0].doc_id)

# 文档 ID: d33f0397-b51a-4455-9b0f-88a101254d95
```

现在，您可以创建一个 Milvus 集合并将文档插入其中。

```python
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.milvus import MilvusVectorStore

vector_store = MilvusVectorStore(dim=1536, overwrite=True)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

<div class="alert note">

上述代码将在 Milvus 服务器上使用默认设置生成一个名为 **llamalection** 的 Milvus 集合。您可以包含以下参数以根据需要自定义 MilvusVectorStore 对象：

- **uri**: 连接的 URI，格式为 "http://address:port"，默认为 "http://localhost:19530"。
- **token**: 用于认证连接的令牌。如果未启用 RBAC，则可以不指定。否则，使用现有用户的用户名和密码。要以默认密码作为 root 用户进行身份验证，请使用 "root:Milvus"。
- **collection_name**: 要创建或使用的 Milvus 集合的名称。
- **dim**: 向量嵌入的维度。如果没有提供，在第一次插入时将创建集合。
- **embedding_field**: 用于在要创建的集合中保存向量嵌入的字段名称，默认为 `DEFAULT_EMBEDDING_KEY`。
- **doc_id_field**: 用于在要创建的集合中保存文档 ID 的字段名称，默认为 `DEFAULT_DOC_ID_KEY`。
- **similarity_metric**: 要使用的相似性度量。可能的选项是 `IP` 和 `L2`，默认为 `IP`。
- **consistency_level**: 在要创建的集合中使用的一致性级别。可能的选项是 `Strong`、`Bounded`、`Staleness`、`Eventually`，默认为 `Strong`。
- **overwrite**: 如果存在，则是否覆盖现有集合。
- **text_key**: 在现有集合中保存文本的字段名称，默认为 `None`。这只适用于您想要使用现有集合而不是创建新集合时。
- **index_config**: 用于为指定的集合构建索引的索引参数，默认为 `None`。
- **search_config**: 用于准备指定集合中搜索的搜索参数，默认为 `None`。

</div>

## 查询数据

Now that you have our document stored in the Milvus collection, you can ask questions against the collection. The collection will use its data as the knowledge base for ChatGPT to generate answers.

```python
query_engine = index.as_query_engine()
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))

# The author learned several things during their time at Interleaf. They learned that it's better for technology companies to be run by product people than sales people, that code edited by too many people leads to bugs, that cheap office space is not worth it if it's depressing, that planned meetings are inferior to corridor conversations, that big bureaucratic customers can be a dangerous source of money, and that there's not much overlap between conventional office hours and the optimal time for hacking. However, the most important thing the author learned is that the low end eats the high end, meaning that it's advantageous to be the "entry level" option because if you're not, someone else will be and will surpass you.
```

Let's give it another try.

```python
response = query_engine.query("What was a hard moment for the author?")
print(textwrap.fill(str(response), 100))

# The author experienced a difficult moment when their mother had a stroke and was put in a nursing home. The stroke destroyed her balance, and the author and their sister were determined to help her get out of the nursing home and back to her house.
```

## Notes on overwriting the Milvus collection

If you want to reuse an existing Milvus collection and overwrite its data, you can use the `overwrite` argument when creating the `MilvusVectorStore` object.

```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=True,
)
```

In such a case, when you run the following code, all the data in the Milvus collection will be erased and replaced with the new data.

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    [Document(text="The number that is being searched for is ten.")],
    storage_context=storage_context
)
```

Now when you ask the same questions again, you will receive different answers.

If you want to append additional data to an existing Milvus collection, you should not use the `overwrite` argument or set it to `False` when creating the `MilvusVectorStore` object.

```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=False,
)
```

In such a case, when you run the following code, the new data will be appended to the existing data in the Milvus collection.

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

## Conclusion

In this article, we demonstrated how to build a (RAG) system using LlamaIndex and Milvus. We used the OpenAI as the LLM backend and prepared the example data for the RAG system. We also demonstrated how to query the data and generate new text using the ChatGPT model.
