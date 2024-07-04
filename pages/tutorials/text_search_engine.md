
# 文本搜索引擎

在本教程中，你将学习如何使用开源向量数据库 Milvus 构建文本搜索引擎。
- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/nlp/text_search)

所使用的 ML 模型和第三方软件包括：
- BERT
- MySQL
- [Towhee](https://towhee.io/)

<br/>

Milvus 在自然语言处理（NLP）领域的一个主要应用是文本搜索引擎。它是一个很好的工具，可以帮助用户找到他们正在寻找的信息，甚至可以提供很难找到的信息。文本搜索引擎将用户输入的关键词或语义与文本数据库进行比较，然后返回符合一定条件的结果。

<br/>

在本教程中，你将学习如何构建一个文本搜索引擎。本教程使用 BERT 将文本转换为固定长度的向量。Milvus 被用作向量存储和向量相似性搜索的数据库。然后使用 MySQL 将 Milvus 生成的向量 ID 映射到文本数据。

<br/>

![text_search_engine](/assets/text_search_engine.png "文本搜索引擎的工作流程")
![text_search_engine](/assets/text_search_engine_demo.png "文本搜索引擎的演示")