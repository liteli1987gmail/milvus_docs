


# 使用 Milvus 和 LlamaIndex 构建检索辅助生成（RAG）系统

本指南演示了如何使用 LlamaIndex 和 Milvus 构建检索辅助生成（RAG）系统。

RAG 系统将检索系统与生成模型结合起来，根据给定的提示生成新的文本。系统首先使用像 Milvus 这样的矢量相似性搜索引擎从语料库中检索相关文档，然后使用生成模型根据检索到的文档来生成新的文本。

[LlamaIndex](https://www.llamaindex.ai/) 是一个简单灵活的数据框架，用于将自定义数据源连接到大型语言模型（LLM）。[Milvus](https://milvus.io/) 是世界上最先进的开源矢量数据库，用于支持嵌入相似性搜索和人工智能应用。

## 开始之前

本页上的代码片段需要安装 **pymilvus** 和 **llamaindex** 库。你可以使用以下命令安装它们：

```shell
python3 -m pip install --upgrade pymilvus llama-index openai
```

此外，LlamaIndex 需要后端的 LLM 模型。在本文中，我们将使用 OpenAI 作为 LLM 后端。你可以在 [OpenAI](https://openai.com/) 上注册免费 API 密钥。

```python
import openai

openai.api_key = "sk-**************************"
```

## 准备数据

在本节中，你需要为 RAG 系统准备数据。运行以下命令下载示例数据。

```shell
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

示例数据是 Paul Graham 的一篇标题为《我工作的内容》的文章。在将其用于 RAG 系统之前，你需要使其对 LLamaIndex 可访问。

```python
from llamaindex import SimpleDirectoryReader

# 加载文档
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()

print("文档ID:", documents[0].doc_id)

# 文档ID: d33f0397-b51a-4455-9b0f-88a101254d95
```

现在，你可以创建一个 Milvus 集合并将文档插入其中。

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

上述代码将在 Milvus 服务器上使用默认设置生成一个名为 **llamalection** 的 Milvus 集合。你可以包含以下参数来自定义 MilvusVectorStore 对象：

- **uri**：用于连接的 URI，格式为“http://address: port”，默认为“http://localhost: 19530”。
- **token**：用于身份验证连接的令牌。如果未启用 RBAC，则可以将其留空。否则，请使用现有用户的用户名和密码。要作为具有默认密码的根用户进行身份验证，使用“root: Milvus”。
- **collection_name**：要创建或使用的 Milvus 集合的名称。
- **dim**：矢量嵌入的维数。如果未提供，将在第一次插入时进行集合创建。
- **embedding_field**：在要创建的集合中用于保存矢量嵌入的字段的名称，默认为 `DEFAULT_EMBEDDING_KEY`。
- **doc_id_field**：在要创建的集合中用于保存文档 ID 的字段的名称，默认为 `DEFAULT_DOC_ID_KEY`。
- **similarity_metric**：要使用的相似性度量。可能的选项有 `IP` 和 `L2`，默认为 `IP`。
- **consistency_level**：要在创建的集合中使用的一致性级别。可能的选项有 `Strong`、`Bounded`、`Staleness`、`Eventually`，默认为 `Strong`。
- **overwrite**：如果存在，是否覆盖现有集合。
- **text_key**：在现有集合中保存文本的字段的名称，默认为 `None`。仅当你希望使用现有集合而不是创建新集合时才适用。
- **index_config**：用于为指定集合构建索引的索引参数，默认为 `None`。
- **search_config**：用于准备指定集合中的搜索的搜索参数，默认为 `None`。

</div>


## 查询数据




现在你已经将我们的文档存储在 Milvus 集合中，你可以对该集合提问。集合将使用其数据作为 ChatGPT 生成答案的知识库。

```python
query_engine = index.as_query_engine()
response = query_engine.query("作者学到了什么？")
print(textwrap.fill(str(response), 100))

# 作者在他们在Interleaf的时间里学到了很多东西。他们发现，由产品人员而不是销售人员管理技术公司更好，代码经过太多人编辑会导致错误，如果办公空间令人沮丧，那么便宜的办公空间就不值得，计划会议不如走廊对话好，大型官僚的客户是一种危险的资金来源，而传统办公时间与最佳黑客时间之间没有太多交集。然而，作者学到的最重要的是低端吃掉了高端，这意味着成为“入门级”选项很有优势，因为如果你不是，其他人就会并且将超过你。

```

让我们再试一次。

```python
response = query_engine.query("作者经历了哪个艰难的时刻？")
print(textwrap.fill(str(response), 100))

# 作者的母亲中风后被送进了养老院，这是作者面临的困难时刻。中风摧毁了她的平衡，作者和他们的姐姐决心帮助她离开养老院回到自己的家中。

```

## 关于覆盖 Milvus 集合的注意事项

如果要重用现有的 Milvus 集合并覆盖其数据，可以在创建 `MilvusVectorStore` 对象时使用 `overwrite` 参数。

```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=True,
)
```

在这种情况下，当你运行以下代码时，Milvus 集合中的所有数据将被清除并替换为新数据。

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    [Document(text="正在搜索的数字是十。")], 
    storage_context=storage_context
)
```

现在，当你再次问同样的问题时，你将收到不同的答案。

如果要将附加数据添加到现有的 Milvus 集合中，你不应使用 `overwrite` 参数或将其设置为 `False`，而是在创建 `MilvusVectorStore` 对象时。

```python
vector_store = MilvusVectorStore(
    dim=1536,
    overwrite=False,
)
```

在这种情况下，当你运行以下代码时，新数据将附加到 Milvus 集合中的现有数据。

```python
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

## 结论


在这篇文章中，我们演示了如何使用 LlamaIndex 和 Milvus 构建一个（RAG）系统。我们使用 OpenAI 作为 LLM 后端，并为 RAG 系统准备了示例数据。我们还演示了如何查询数据并使用 ChatGPT 模型生成新的文本。
