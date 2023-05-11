图像去重
====

本教程演示如何使用开源向量数据库Milvus构建图像去重系统。

* [打开笔记本](https://github.com/towhee-io/examples/blob/main/image/image_deduplication/image_deduplication.ipynb)

使用的机器学习模型和第三方软件包括：

* ResNet-50

* [Towhee](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjm8-KEjtj7AhVPcGwGHapPB40QFnoECAgQAQ&url=https%3A%2F%2Ftowhee.io%2F&usg=AOvVaw37IzMMiyxGtj82K7O4fInn)

近年来，用户生成的内容呈指数级爆炸增长。人们可以立即将自己拍摄的照片上传到社交媒体平台。然而，由于这样大量的图像数据，我们看到很多重复的内容。为了提高用户体验，这些重复图片必须被删除。图像去重系统可以避免我们手动比较数据库中的图片来寻找重复的图片。挑选完全相同的图片并不是一项复杂的任务。但是，有时一个图片可以被放大，被裁剪，或者亮度或灰度被调整。图像去重系统需要识别这些相似的图片并将它们消除。

在本教程中，您将学习如何构建一个图像去重系统。本教程使用ResNet-50模型提取图像的特征并将其转换为向量。然后，这些图像向量存储在Milvus向量数据库中，也在Milvus中进行向量相似性搜索。

[![Image_deduplication_workflow](https://milvus.io/static/2b7ccba7fdd93162f49cc3282b61f889/e9985/image_deduplication.png "Workflow of an image deduplication system.")](https://milvus.io/static/2b7ccba7fdd93162f49cc3282b61f889/e9985/image_deduplication.png)

Workflow of an image deduplication system.

