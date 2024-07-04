
# 问答系统

本教程演示了如何使用 Milvus 开源向量数据库构建一个问答（QA）系统。

- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/nlp/question_answering)
- [在线演示](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：
- BERT
- MySQL
- [Towhee](https://towhee.io/)

</br>

问答系统是一种常见的现实世界应用，属于自然语言处理领域。典型的问答系统包括在线客服系统、问答聊天机器人等。大多数问答系统可以分为：生成式或检索式、单轮或多轮、开放领域或特定问题领域问答系统。

</br>

在本教程中，你将学习如何构建一个可以将用户提出的新问题与先前存储在向量数据库中的大量答案相关联的 QA 系统。为了构建这样一个聊天机器人，你需要准备自己的问题和相应答案的数据集。将问题和答案存储在关系型数据库 MySQL 中。然后使用 BERT 作为自然语言处理（NLP）的机器学习（ML）模型将问题转换为向量。这些问题向量存储在 Milvus 中进行索引。当用户输入一个新问题时，它也会被 BERT 模型转换为向量，然后 Milvus 会搜索与这个新向量最相似的问题向量。QA 系统会返回最相似问题的相应答案。

</br>

![QA_Chatbot](/assets/qa_chatbot.png "QA chatbot的工作流程。")

![QA_chatbot_demo](/assets/qa_chatbot_demo.png "QA chatbot的演示。")

