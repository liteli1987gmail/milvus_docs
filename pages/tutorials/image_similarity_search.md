


# 图像相似度搜索

本教程演示了如何使用 Milvus（开源向量数据库）构建反向图像搜索系统。
- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/image/reverse_image_search)
- [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/image/reverse_image_search/quick_deploy)
- [在线演示](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：
- YOLOv3
- ResNet-50
- MySQL
- [Towhee](https://towhee.io/)

</br>

像 Google 这样的主要搜索引擎已经为用户提供了通过图像搜索的选项。此外，电子商务平台已经意识到这种功能对于在线购物者的好处，亚马逊将图像搜索纳入了其手机应用程序中。

</br>

在本教程中，你将学习如何构建一个反向图像搜索系统，该系统可以检测图像模式并返回与你上传的图像相似的图像。要构建这样一个图像相似度搜索系统，请下载包含 17125 张图像和 20 个类别的 PASCAL VOC 图像数据集。或者，你也可以准备自己的图像数据集。使用 YOLOv3 进行对象检测，使用 ResNet-50 进行图像特征提取。在经过这两个机器学习模型之后，图像将被转换为 256 维的向量。然后将这些向量存储在 Milvus 中，并且 Milvus 会为每个向量自动生成一个唯一的 ID。接下来，使用 MySQL 将向量 ID 映射到数据集中的图像。每当你上传一张新图像到图像搜索系统时，系统将将其转换为一个新的向量，并与之前存储在 Milvus 中的向量进行比较。Milvus 然后返回最相似向量的 ID，并且你可以在 MySQL 中查询相应的图像。

</br>

以下是一个反向图像搜索系统的工作流程图示：

![image_search](/assets/image_search.png "反向图像搜索系统的工作流程。")

下面是反向图像搜索系统的演示图：

![image_search_demo](/assets/image_search_demo.jpeg "反向图像搜索系统的演示。")

