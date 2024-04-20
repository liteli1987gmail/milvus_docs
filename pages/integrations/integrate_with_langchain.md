---
title: 利用 Milvus 和 LangChain 在文档上进行问答

---

# 利用 Milvus 和 LangChain 在文档上进行问答

本指南演示了如何构建一个由 LLM 驱动的问答应用程序，使用 Milvus 作为向量数据库和 LangChain 作为嵌入系统。

## 开始之前

本页上的代码片段需要安装 **pymilvus** 和 **langchain**。还使用了 OpenAI 的嵌入 API 将文档嵌入到向量存储中，因此还需要 **openai** 和 **tiktoken**。如果它们在您的系统上不存在，请运行以下命令进行安装。

```shell
! python -m pip install --upgrade pymilvus langchain openai tiktoken
```

## 全局参数

在本节中，您需要设置以下代码片段中使用的所有参数。

```python
import os

# 1. 设置要创建的集合的名称。
COLLECTION_NAME = 'doc_qa_db'

# 2. 设置嵌入的维度。
DIMENSION = 768

# 3. 设置 cohere API 密钥
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# 4. 设置您的 Milvus 服务器的连接参数。
URI = 'http://localhost:19530'
```

## 准备数据

在深入之前，您应该完成以下步骤：

- 准备 LLM 在思考时想要查看的文档。
- 设置一个嵌入模型，将文档转换为向量嵌入。
- 设置一个向量存储，用于保存向量嵌入。

```python
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.zilliz import Zilliz
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores.milvus import Milvus
from langchain.schema.runnable import RunnablePassthrough
from langchain.prompts import PromptTemplate

# 使用 WebBaseLoader 将指定的网页加载到文档中
loader = WebBaseLoader([
    'https://milvus.io/docs/overview.md',
    'https://milvus.io/docs/release_notes.md',
    # ... 其他网页 URL
])

docs = loader.load()

# 将文档分割成较小的块
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=0)
all_splits = text_splitter.split_documents(docs)
```

准备好文档后，下一步是将它们转换为向量嵌入并保存在向量存储中。

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

要执行文本到文本的相似性搜索，请使用以下代码片段。结果将返回查询中最相关的文档文本。

```python
query = "Milvus 的主要组件是什么？"
docs = vector_store.similarity_search(query)

print(len(docs))
```

输出应该是这样的：

```shell
4
```

## 提出问题

准备好文档后，您可以设置一个链，将它们包含在提示中。这将允许 LLM 在准备答案时使用文档作为参考。

以下代码片段设置了使用 OpenAI 作为 LLM 和 RAG 提示的 RAG 链。

```python
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0) 
retriever = vector_store.as_retriever()

template = """使用以下上下文片段回答最后的问题。
如果你不知道答案，就直接说你不知道，不要试图编造答案。
最多使用三个句子，并尽可能简洁地回答问题。
在答案的末尾总是说“谢谢你的提问！”。
{context}
问题：{question}
有用的答案："""
rag_prompt = PromptTemplate.from_template(template)

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
)

print(rag_chain.invoke("解释 Milvus 中的 IVF_FLAT。"))
```

返回的结果包括一个内容参数作为 output_text。

```shell
# 输出
#
# content='IVF_FLAT 是 Milvus 中的一种索引机制，它将向量空间划分为多个簇。它通过比较目标向量和所有簇中心之间的距离来找到最近的簇。然后，它比较目标向量和所选簇中的向量之间的距离，以找到最近的向量。当向量数量超过 nlist 的值时，IVF_FLAT 显示出性能