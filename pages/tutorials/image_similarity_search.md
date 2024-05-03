---
id: image_similarity_search.md
summary: Build an image similarity search system with Milvus.
title: Image Similarity Search
---

# 图像相似性搜索

本教程演示了如何使用 Milvus（开源向量数据库）构建反向图像搜索系统。

- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/image/reverse_image_search)
- [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/image/reverse_image_search/quick_deploy)
- [尝试在线演示](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：

- YOLOv3
- ResNet-50
- MySQL
- [Towhee](https://towhee.io/)

</br>

像 Google 这样的主要搜索引擎已经为用户提供了按图像搜索的选项。此外，电子商务平台已经意识到这项功能为在线购物者提供了好处，亚马逊已经将其智能手机应用程序中加入了图像搜索。

</br>

在本教程中，您将学习如何构建一个反向图像搜索系统，该系统可以检测图像模式并返回与您上传的图像相似的图像。要构建这样的图像相似性搜索系统，请下载 PASCAL VOC 图像集，该图像集包含 20 个类别的 17125 张图像。或者，您可以准备自己的图像数据集。使用 YOLOv3 进行对象检测和 ResNet-50 进行图像特征提取。在通过两个机器学习模型后，图像被转换为 256 维向量。然后将向量存储在 Milvus 中，Milvus 会自动为每个向量生成一个唯一 ID。MySQL 随后用于将向量 ID 映射到数据集中的图像。每当您将新图像上传到图像搜索系统时，它将被转换为一个新的向量，并与 Milvus 中先前存储的向量进行比较。然后 Milvus 返回最相似向量的 ID，您可以在 MySQL 中查询相应的图像。

</br>

![image_search](/public/assets/image_search.png "反向图像搜索系统的流程图。")

![image_search_demo](/public/assets/image_search_demo.jpeg "反向图像搜索系统的演示。")
