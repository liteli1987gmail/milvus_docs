问答系统
====

本教程演示如何使用开源向量数据库Milvus构建问答系统。

* [打开Jupyter笔记本](https://github.com/towhee-io/examples/tree/main/nlp/question_answering)

* [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/nlp/question_answering_system/quick_deploy)

* [在线演示](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：

* BERT

* MySQL

* [Towhee](https://towhee.io/)

问答系统是自然语言处理领域中常见的实际应用，典型的QA系统包括在线客服系统、QA聊天机器人等等。大多数问答系统可以归类为：生成式或检索式，单轮或多轮，开放域或特定领域问答系统。

在本教程中，您将学习如何构建一个QA系统，该系统可以将新用户的问题链接到先前存储在向量数据库中的大量答案。为构建这样的聊天机器人，准备自己的问题和相应答案的数据集。将这些问题和答案存储在关系型数据库MySQL中。然后使用自然语言处理（NLP）的机器学习（ML）模型BERT将问题转换为向量。这些问题向量被存储并索引在Milvus中。当用户输入新问题时，BERT模型也将其转换为一个向量，Milvus会搜索与这个新向量最相似的问题向量。QA系统将返回最相似问题的相应答案。

[![QA_Chatbot](https://milvus.io/static/01a9b9e93b51edc818fa83c4485597a3/1263b/qa_chatbot.png "Workflow of a QA chatbot.")](https://milvus.io/static/01a9b9e93b51edc818fa83c4485597a3/c8380/qa_chatbot.png)

Workflow of a QA chatbot.

[![QA_chatbot_demo](https://milvus.io/static/8114067a630e4601006ef7571bfbf397/7e80f/qa_chatbot_demo.png "Demo of a QA chatbot.")](https://milvus.io/static/8114067a630e4601006ef7571bfbf397/7e80f/qa_chatbot_demo.png)

Demo of a QA chatbot.

