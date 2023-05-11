文本到图像搜索引擎
=========

本教程演示如何使用开源向量数据库Milvus构建文本到图像搜索引擎。

你可以通过基本教程快速构建最小可行的文本到图像搜索引擎。另外，你也可以阅读深入教程，从模型选择到服务部署等全方位了解。通过遵循深入教程中的指示，你可以构建更高级、更符合自身业务需求的文本到图像搜索引擎。

* [笔记本中的基础教程](https://github.com/towhee-io/examples/blob/main/image/text_image_search/1_build_text_image_search_engine.ipynb)

* [笔记本中的深度教程](https://github.com/towhee-io/examples/blob/main/image/text_image_search/2_deep_dive_text_image_search.ipynb)

使用的机器学习模型和第三方软件包括：

* [CLIP](https://openai.com/blog/clip/)

* [Towhee](https://towhee.io/)

* [Gradio](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj3nvvEhNj7AhVZSGwGHUFuA6sQFnoECA0QAQ&url=https%3A%2F%2Fgradio.app%2F&usg=AOvVaw0Rmnp2xYgYvkDcMb9d-9TR)

* [OpenCV-Python](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjawLa4hNj7AhWrSGwGHSWKD1sQFnoECA0QAQ&url=https%3A%2F%2Fdocs.opencv.org%2F4.x%2Fd6%2Fd00%2Ftutorial_py_root&usg=AOvVaw3YMr9iiY-FTDoGSWWqppvP)

现在，传统的文本搜索引擎正在失去魅力，越来越多的人将TikTok作为他们最喜欢的搜索引擎。在传统的文本搜索中，人们输入关键词，然后会显示包含关键词的所有文本。然而，人们抱怨在这样的搜索中不能总是找到他们想要的内容。而且，结果不够直观。人们说他们发现图像和视频比爬过一行行的文本更直观和愉悦。因此出现了跨模态文本到图像搜索引擎。有了这种新型搜索引擎，人们可以通过输入一段文本或一些关键词来找到相关的图像。

在本教程中，您将学习如何构建一个文本到图像的搜索引擎。本教程使用CLIP模型提取图像的特征并将其转换为向量。然后，这些图像向量存储在Milvus向量数据库中。当用户输入查询文本时，这些文本也使用相同的ML模型CLIP转换为嵌入向量。随后，在Milvus中执行向量相似性搜索，以检索与输入文本向量最相似的图像向量。

[![Text_image_search](https://milvus.io/static/e3bb96a63ca01675a5d30d9604a8fe32/1263b/text_to_image_workflow.png "Workflow of a text-to-image search engine.")](https://milvus.io/static/e3bb96a63ca01675a5d30d9604a8fe32/c7b1b/text_to_image_workflow.png)

Workflow of a text-to-image search engine.

