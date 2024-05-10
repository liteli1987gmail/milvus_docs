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

现在您已经将我们的文档存储在Milvus集合中，您可以针对该集合提出问题。该集合将使用其数据作为ChatGPT生成答案的知识库。

```python
query_engine = index.as_query_engine()
response = query_engine.query("作者学到了什么？")
print(textwrap.fill(str(response), 100))

# 作者在Interleaf期间学到了一些东西。他们了解到，科技公司最好由产品人员管理，而不是由销售人员管理，太多人编辑的代码会导致漏洞，如果令人沮丧，廉价的办公空间是不值得的，有计划的会议不如走廊对话，大的官僚客户可能是危险的资金来源，传统的办公时间和黑客攻击的最佳时间之间没有太多重叠。然而，作者学到的最重要的一点是，低端吃掉了高端，这意味着成为“入门级”的选择是有利的，因为如果你不是，其他人将超越你。
```

让我们再试一次。

```python
response = query_engine.query("作者的艰难时刻是什么？")
print(textwrap.fill(str(response), 100))

#作者经历了一个艰难的时刻，他们的母亲中风了，被送进了疗养院。中风破坏了她的平衡，提交人和他们的妹妹决心帮助她走出疗养院，回到自己的家中。
```

## 关于覆盖Milvus集合的说明

如果要重用现有的Milvus集合并覆盖其数据，可以在创建 `MilvusVectorStore` 对象时使用 `overwrite` 参数。


```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=True,
)
```

在这种情况下，当您运行以下代码时，Milvus集合中的所有数据都将被擦除并替换为新数据。

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    [Document(text="The number that is being searched for is ten.")],
    storage_context=storage_context
)
```

现在，当你再次问同样的问题时，你会得到不同的答案。

如果要将其他数据附加到现有Milvus集合，则在创建“MilvusVectorStore”对象时不应使用“overwrite”参数或将其设置为“False”。

```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=False,
)
```

在这种情况下，当您运行以下代码时，新数据将附加到Milvus集合中的现有数据。

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

## 结论

在本文中，我们演示了如何使用LlamaIndex和Milvus构建（RAG）系统。我们使用OpenAI作为LLM后端，并为RAG系统准备了示例数据。我们还演示了如何使用ChatGPT模型查询数据和生成新文本。
