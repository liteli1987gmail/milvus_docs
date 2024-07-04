


# 使用 Milvus 和 LangChain 进行文档问答

本指南演示了如何使用 Milvus 和 LangChain 构建一个基于 LLM（Language Model）驱动的问答应用程序。

## 开始之前

本页面的代码片段需要安装 **pymilvus** 和 **langchain**，还使用了 OpenAI 的嵌入式 API 将文档嵌入向量存储中，因此还需要 **openai** 和 **tiktoken**。如果你的系统中没有这些依赖，运行以下命令进行安装。

```shell
! python -m pip install --upgrade pymilvus langchain openai tiktoken
```

## 全局参数

在本部分中，你需要设置以下代码片段中要使用的所有参数。

```python
import os

# 1. 设置要创建的集合的名称。
COLLECTION_NAME = 'doc_qa_db'

# 2. 设置嵌入的维度。
DIMENSION = 768

# 3. 设置OpenAI的API密钥
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# 4. 设置Milvus服务器的连接参数。
URI = 'http://localhost:19530'
```

## 准备数据



在你开始之前，你需要完成以下步骤：

- 准备好你希望 LLM 在思考时查看的文档。
- 设置一个嵌入模型，将文档转换为向量嵌入。
- 设置一个向量存储用于保存向量嵌入。

```python
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.zilliz import Zilliz
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores.milvus import Milvus
from langchain.schema.runnable import RunnablePassthrough
from langchain.prompts import PromptTemplate

# 使用WebBaseLoader将指定的网页加载到文档中
loader = WebBaseLoader([
    'https://milvus.io/docs/overview.md',
    'https://milvus.io/docs/release_notes.md',
    'https://milvus.io/docs/architecture_overview.md',
    'https://milvus.io/docs/four_layers.md',
    'https://milvus.io/docs/main_components.md',
    'https://milvus.io/docs/data_processing.md',
    'https://milvus.io/docs/bitset.md',
    'https://milvus.io/docs/boolean.md',
    'https://milvus.io/docs/consistency.md',
    'https://milvus.io/docs/coordinator_ha.md',
    'https://milvus.io/docs/replica.md',
    'https://milvus.io/docs/knowhere.md',
    'https://milvus.io/docs/schema.md',
    'https://milvus.io/docs/dynamic_schema.md',
    'https://milvus.io/docs/json_data_type.md',
    'https://milvus.io/docs/metric.md',
    'https://milvus.io/docs/partition_key.md',
    'https://milvus.io/docs/multi_tenancy.md',
    'https://milvus.io/docs/timestamp.md',
    'https://milvus.io/docs/users_and_roles.md',
    'https://milvus.io/docs/index.md',
    'https://milvus.io/docs/disk_index.md',
    'https://milvus.io/docs/scalar_index.md',
    'https://milvus.io/docs/performance_faq.md',
    'https://milvus.io/docs/product_faq.md',
    'https://milvus.io/docs/operational_faq.md',
    'https://milvus.io/docs/troubleshooting.md',
])

docs = loader.load()

# 将文档分割成较小的片段
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=0)
all_splits = text_splitter.split_documents(docs)
```

准备好文档后，下一步是将其转换为向量嵌入并保存在向量存储中。

```python
embeddings = OpenAIEmbeddings()
connection_args = { 'uri': URI }

vector_store = Milvus(
    embedding_function=embeddings,
    connection_args=connection_args,
    collection_name=COLLECTION_NAME,
    drop_old=True,
).from_documents(
    all_splits,
    embedding=embeddings,
    collection_name=COLLECTION_NAME,
    connection_args=connection_args,
)
```

要执行文本到文本的相似性搜索，请使用以下代码片段。结果将返回与查询最相关的文档文本。

```python
query = "What are the main components of Milvus?"
docs = vector_store.similarity_search(query)

print(len(docs))
```

输出应类似于以下内容：

```shell
4
```

## 提问你的问题



    使用以下上下文信息来回答最后的问题。如果你不知道答案，只需说不知道，不要编造答案。回答时最多使用三个句子，并尽量简洁。最后一定要说 "谢谢你的提问！"。
    上下文：

    问题：解释一下 Milvus 中的 IVF_FLAT 是什么？
    有用的答案：
    IVF_FLAT 是 Milvus 中的一个索引机制，将向量空间划分为多个簇。它通过计算目标向量与所有簇中心之间的距离来找到最近的簇，然后通过计算目标向量与选定簇中向量之间的距离来找到最近的向量。当向量的数量超过 nlist 的值时，IVF_FLAT 显示出性能优势。谢谢你的提问！

