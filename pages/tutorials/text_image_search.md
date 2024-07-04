


# 文字到图片搜索引擎

本教程演示了如何使用 Milvus，一个开源的向量数据库，构建一个文字到图片的搜索引擎。

你可以按照基础教程快速构建一个可行的文字到图片搜索引擎。此外，你还可以阅读深入教程，其中涵盖了从模型选择到服务部署的所有内容。通过按照深入教程中的说明，你可以构建一个更高级的根据自己业务需求定制的文字到图片搜索引擎。

- [在 notebook 中的基础教程](https://github.com/towhee-io/examples/blob/main/image/text_image_search/1_build_text_image_search_engine.ipynb)

- [在 notebook 中的深入教程](https://github.com/towhee-io/examples/blob/main/image/text_image_search/2_deep_dive_text_image_search.ipynb)


使用的 ML 模型和第三方软件包括：

- [CLIP](https://openai.com/blog/clip/)

- [Towhee](https://towhee.io/)

- [Gradio](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj3nvvEhNj7AhVZSGwGHUFuA6sQFnoECA0QAQ&url=https%3A%2F%2Fgradio.app%2F&usg=AOvVaw0Rmnp2xYgYvkDcMb9d-9TR)

- [OpenCV-Python](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjawLa4hNj7AhWrSGwGHSWKD1sQFnoECA0QAQ&url=https%3A%2F%2Fdocs.opencv.org%2F4.x%2Fd6%2Fd00%2Ftutorial_py_root.html&usg=AOvVaw3YMr9iiY-FTDoGSWWqppvP)



现在，传统的文本搜索引擎正失去魅力，越来越多的人转而将 TikTok 作为他们最喜欢的搜索引擎。在传统的文本搜索中，人们输入关键词，然后显示包含该关键词的所有文本。然而，人们抱怨说他们不能总是在这样的搜索中找到想要的内容。而且，结果还不够直观。人们说他们发现图片和视频比起浏览一行行的文本更直观和愉悦。跨模态的文字到图片搜索引擎随之应运而生。有了这样一种新型的搜索引擎，人们可以通过输入一段包含某些关键字的文本来找到相关的图片。

在本教程中，你将学习如何构建一个文字到图片的搜索引擎。本教程使用 CLIP 模型提取图像的特征并将其转换为向量。然后，这些图像向量被存储在 Milvus 向量数据库中。当用户输入查询文本时，这些文本也使用相同的 ML 模型 CLIP 转换为嵌入向量。随后，在 Milvus 中执行向量相似性搜索，以检索与输入文本向量最相似的图像向量。

![Text_image_search](/assets/text_to_image_workflow.png "文字到图片搜索引擎的工作流程。")
