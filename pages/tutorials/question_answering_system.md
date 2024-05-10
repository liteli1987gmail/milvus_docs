---
id: question_answering_system.md
summary: Build a question answering system with Milvus.
title: Question Answering System
---

# 问答系统

本教程演示了如何使用 Milvus（一个开源的向量数据库）构建一个问答（QA）系统。

- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/nlp/question_answering)
- [尝试在线演示](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：

- BERT
- MySQL
- [Towhee](https://towhee.io/)

</br>

问答系统是自然语言处理领域中一个常见的实际应用。典型的问答系统包括在线客服系统、问答聊天机器人等。大多数问答系统可以分为：生成式或检索式、单轮或多轮、开放域或特定问题问答系统。

</br>

在本教程中，您将学习如何构建一个 QA 系统，该系统可以将新用户问题与向量数据库中预先存储的大量答案相关联。要构建这样的聊天机器人，准备您自己的问题和相应答案的数据集。将问题和答案存储在 MySQL，一个关系型数据库中。然后使用 BERT（自然语言处理（NLP）的机器学习（ML）模型）将问题转换为向量。这些问题向量存储并索引在 Milvus 中。当用户输入一个新问题时，它也由 BERT 模型转换为向量，并且 Milvus 搜索与这个新向量最相似的问题向量。问答系统返回与最相似问题对应的答案。

</br>

![QA_Chatbot](/public/assets/qa_chatbot.png "问答聊天机器人的工作流程。")

![QA_chatbot_demo](/public/assets/qa_chatbot_demo.png "问答聊天机器人的演示。")
