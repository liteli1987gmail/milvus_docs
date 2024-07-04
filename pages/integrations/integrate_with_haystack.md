


# 使用 Milvus 和 Haystack 构建检索增强生成系统

[Haystack](https://github.com/deepset-ai/haystack) 是由 [deepset](https://www.deepset.ai/) 开发的用于构建可定制、可投入生产的自然语言理解与处理应用的 Python 开源框架。它是一个端到端的框架，通过为应用程序构建生命周期的每个步骤提供工具来协助完整的 NLP 应用的编排。

本指南演示了如何使用 [Haystack 的 Milvus 集成](https://haystack.deepset.ai/integrations/milvus-document-store) 在 Milvus 文档中构建一个由 LLM 驱动的问答应用。在这个示例中，Haystack 和 Milvus 首先协同工作，将文档页面载入并存储在 MilvusDocumentStore 中，然后使用 OpenAIGenerator 通过检索增强来回答问题。

🚀 可在 [此处](https://github.com/TuanaCelik/milvus-documentation-qa/tree/main) 查看使用 `MilvusDocumentStore` 进行 Milvus 文档问答的完整应用程序。

## 安装

安装 Haystack 和 Milvus 集成：

```bash
pip install milvus-haystack
```

## 使用

首先，按照文档中的 "[启动 Milvus](https://milvus.io/docs/install_standalone-docker.md#Start-Milvus)" 说明启动 Milvus 服务。

一旦你在本地的 `localhost:19530` 上运行了 Milvus，在 Haystack 中使用 Milvus 之前，你需要初始化一个 `MilvusDocumentStore`：


### 创建索引流水线并索引一些文档
```python
import os

from haystack import Pipeline
from haystack.components.converters import MarkdownToDocument
from haystack.components.embedders import SentenceTransformersDocumentEmbedder, SentenceTransformersTextEmbedder
from haystack.components.preprocessors import DocumentSplitter
from haystack.components.writers import DocumentWriter

from milvus_haystack import MilvusDocumentStore
from milvus_haystack.milvus_embedding_retriever import MilvusEmbeddingRetriever

file_paths = [os.path.abspath(__file__)]  # 在这里添加你的知识文档

document_store = MilvusDocumentStore(
    connection_args={
        "host": "localhost",
        "port": "19530",
        "user": "",
        "password": "",
        "secure": False,
    },
    drop_old=True,
)
indexing_pipeline = Pipeline()
indexing_pipeline.add_component("converter", MarkdownToDocument())
indexing_pipeline.add_component("splitter", DocumentSplitter(split_by="sentence", split_length=2))
indexing_pipeline.add_component("embedder", SentenceTransformersDocumentEmbedder())
indexing_pipeline.add_component("writer", DocumentWriter(document_store))
indexing_pipeline.connect("converter", "splitter")
indexing_pipeline.connect("splitter", "embedder")
indexing_pipeline.connect("embedder", "writer")
indexing_pipeline.run({"converter": {"sources": file_paths}})

print("文档数量:", document_store.count_documents())

```

### 创建检索流水线并尝试查询
```python
question = "如何安装Haystack和Milvus集成?"

retrieval_pipeline = Pipeline()
retrieval_pipeline.add_component("embedder", SentenceTransformersTextEmbedder())
retrieval_pipeline.add_component("retriever", MilvusEmbeddingRetriever(document_store=document_store, top_k=3))
retrieval_pipeline.connect("embedder", "retriever")

retrieval_results = retrieval_pipeline.run({"embedder": {"text": question}})

for doc in retrieval_results["retriever"]["documents"]:
    print(doc.content)
    print("-" * 10)
```

### 创建 RAG 流水线并尝试查询






```python
from haystack.utils import Secret
from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator

prompt_template = """回答下面的问题，基于提供的背景。如果背景中没有答案，请回答'I don't know'。\n
                     问题：{{query}}
                     文档：
                     {% for doc in documents %}
                        {{ doc.content }}
                     {% endfor %}
                     答案：
                  """

rag_pipeline = Pipeline()
rag_pipeline.add_component("text_embedder", SentenceTransformersTextEmbedder())
rag_pipeline.add_component("retriever", MilvusEmbeddingRetriever(document_store=document_store, top_k=3))
rag_pipeline.add_component("prompt_builder", PromptBuilder(template=prompt_template))
rag_pipeline.add_component("generator", OpenAIGenerator(api_key=Secret.from_token(os.getenv("OPENAI_API_KEY")),
                                                        generation_kwargs={"temperature": 0}))
rag_pipeline.connect("text_embedder.embedding", "retriever.query_embedding")
rag_pipeline.connect("retriever.documents", "prompt_builder.documents")
rag_pipeline.connect("prompt_builder", "generator")

results = rag_pipeline.run(
    {
        "text_embedder": {"text": question},
        "prompt_builder": {"query": question},
    }
)
print('RAG答案:', results["generator"]["replies"][0])
```

