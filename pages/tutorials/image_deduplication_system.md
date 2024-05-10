---
id: image_deduplication_system.md
summary: Build an image deduplication system with Milvus.
title: Image Deduplication
---

# 图像去重系统

本教程演示了如何使用 Milvus（开源向量数据库）构建一个图像去重系统。

- [打开笔记本](https://github.com/towhee-io/examples/blob/main/image/image_deduplication/image_deduplication.ipynb)

使用的机器学习模型和第三方软件包括：

- ResNet-50

- [Towhee](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjm8-KEjtj7AhVPcGwGHapPB40QFnoECAgQAQ&url=https%3A%2F%2Ftowhee.io%2F&usg=AOvVaw37IzMMiyxGtj82K7O4fInn)

近年来，用户生成的内容呈指数级爆炸式增长。人们可以立即将他们拍摄的照片上传到社交媒体平台。然而，随着如此大量的图像数据，我们看到了许多重复的内容。为了改善用户体验，这些重复的图像必须被删除。一个图像去重系统可以节省我们手动比较数据库中的图像以找出重复图像的劳动。挑选出完全相同的图像并不复杂。然而，有时一张图片可以被放大、裁剪，或者调整亮度或灰度。图像去重系统需要识别这些相似的图像并消除它们。

在本教程中，你将学习如何构建一个图像去重系统。本教程使用 ResNet-50 模型提取图像特征并将其转换为向量。然后，这些图像向量存储在 Milvus 向量数据库中，并在 Milvus 中进行向量相似性搜索。

![Image_deduplication_workflow](/public/assets/image_deduplication.png "图像去重系统的流程图。")
