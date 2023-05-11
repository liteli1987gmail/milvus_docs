随着ChatGPT占据头条，许多公司都在想如何利用它来改进其现有产品。一个明显的重要用例是改进产品文档的繁琐和有限的搜索功能。目前，如果用户想弄清如何使用产品，他们必须搜索所有文档页面，希望找到答案。如果我们能用ChatGPT取代这个繁琐的过程呢？如果ChatGPT能总结所需的所有信息并回答用户可能遇到的任何问题呢？这就是LlamaIndex和Milvus的用武之地。

LlamaIndex和Milvus共同用于摄取和检索相关信息。LlamaIndex首先通过使用OpenAI处理所有不同的文档并进行嵌入。一旦我们有了嵌入，我们就可以将它们与任何相关文本和元数据一起推入Milvus中。当用户想要提问时，LlamaIndex将在Milvus中查找最接近的答案并使用ChatGPT总结这些答案。

在本示例中，我们要搜索的文档是在Milvus的[网站](milvus.io/docs)上找到的文档。

让我们开始吧。

安装要求
-----------------------

在本示例中，我们将使用`pymilvus`连接到Milvus和`llama-index`处理数据操作和处理流水线。本示例还需要OpenAI API密钥进行嵌入生成。

```
pip install pymilvus llama-index

```

获取数据
-----------------

我们将使用`git`拉取Milvus网站数据。大多数文档以markdown文件的形式存在。

```
git clone https://github.com/milvus-io/milvus-docs

```

全局参数
-----------------

在这里，我们可以找到需要修改以适合自己账户运行的主要参数。每个参数旁边都有一个它所表示的描述。

```
from os import environ

HOST = "localhost"
PORT = "19530" 

environ["OPENAI_API_KEY"] = "sk-******" # OpenAI API Key

```

消费知识
----

一旦我们把数据放在系统中，我们就可以使用LlamaIndex将其消费，并将其上传到Milvus。这需要2个步骤。我们首先从[Llama Hub](https://llamahub.ai)加载一个markdown阅读器，并将所有的markdown转换为文档。

```
from llama_index import download_loader
from glob import glob

# Load the markdown reader from the hub
MarkdownReader = download_loader("MarkdownReader")
markdownreader = MarkdownReader()

# Grab all markdown files and convert them using the reader
docs = []
for file in glob("./milvus-docs/site/en/**/*.md", recursive=True):
    docs.extend(markdownreader.load_data(file=file))
print(len(docs))

```

一旦我们确定了文档，我们就可以将其推送到Milvus中。这一步需要Milvus和OpenAI的配置。

```
from llama_index import GPTMilvusIndex

# Push all markdown files into Zilliz Cloud
index = GPTMilvusIndex.from_documents(docs, host=HOST, port=PORT, overwrite=True)

```

提问
--

将我们的文档加载到Zilliz Cloud中后，我们可以开始提问。问题将会被搜索到知识库中，任何相关的文档都会被用来生成答案。

```
s = index.query("What is a collection?")
print(s)

# Output:
# A collection in Milvus is a logical grouping of entities, similar to a table in a relational database management system (RDBMS). It is used to store and manage entities.

```

我们也能够保存我们的连接信息，并使用`save_to_dict()`和`load_from_dict()`重新加载。

```
saved = index.save_to_dict()
del index

index = GPTMilvusIndex.load_from_dict(saved, overwrite = False)
s = index.query("What communication protocol is used in Pymilvus for commicating with Milvus?")
print(s)

# Output:
# The communication protocol used in Pymilvus for communicating with Milvus is gRPC.

```
