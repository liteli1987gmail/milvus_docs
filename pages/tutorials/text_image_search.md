---
title: 文本到图像搜索引擎
---

# 文本到图像搜索引擎

本教程展示了如何使用 Milvus，一个开源的向量数据库，来构建一个文本到图像的搜索引擎。

你可以通过遵循基本教程快速构建一个最小可行的文本到图像搜索引擎。或者，你也可以阅读深入教程，它涵盖了从模型选择到服务部署的所有内容。你可以通过遵循深入教程中的说明，构建一个更高级的文本到图像搜索引擎，以满足你自己的业务需求。

- [基本教程笔记本](https://github.com/towhee-io/examples/blob/main/image/text_image_search/1_build_text_image_search_engine.ipynb)

- [深入教程笔记本](https://github.com/towhee-io/examples/blob/main/image/text_image_search/2_deep_dive_text_image_search.ipynb)

使用的机器学习模型和第三方软件包括：

- [CLIP](https://openai.com/blog/clip/)

- [Towhee](https://towhee.io/)

- [Gradio](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj3nvvEhNj7AhVZSGwGHUFuA6sQFnoECA0QAQ&url=https%3A%2F%2Fgradio.app%2F&usg=AOvVaw0Rmnp2xYgYvkDcMb9d-9TR)

- [OpenCV-Python](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjawLa4hNj7AhWrSGwGHSWKD1sQFnoECA0QAQ&url=https%3A%2F%2Fdocs.opencv.org%2F4.x%2Fd6%2Fd00%2Ftutorial_py_root.html&usg=AOvVaw3YMr9iiY-FTDoGSWWqppvP)

如今，传统的文本搜索引擎正在失去魅力，越来越多的人转向 TikTok 作为他们最喜欢的搜索引擎。在传统的文本搜索中，人们输入关键词，然后会显示所有包含该关键词的文本。然而，人们抱怨他们总是无法在这样的搜索中找到他们想要的东西。更重要的是，结果不够直观。人们说，他们发现图像和视频比浏览一行行文本要直观和愉快得多。跨模态文本到图像搜索引擎因此应运而生。有了这种新型搜索引擎，人们可以通过输入一段文本或一些关键词来找到相关图像。

在本教程中，你将学习如何构建一个文本到图像的搜索引擎。本教程使用 CLIP 模型提取图像特征并将其转换为向量。然后，这些图像向量存储在 Milvus 向量数据库中。当用户输入查询文本时，这些文本也使用相同的机器学习模型 CLIP 转换为嵌入向量。随后，在 Milvus 中执行向量相似性搜索，以检索与输入文本向量最相似的图像向量。

![Text_image_search](/public/assets/text_to_image_workflow.png "文本到图像搜索引擎的工作流程。")
