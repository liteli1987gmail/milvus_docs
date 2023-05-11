图像相似性搜索
=======

本教程演示了如何使用开源向量数据库Milvus构建反向图像搜索系统。

* [打开Jupyter笔记本](https://github.com/towhee-io/examples/tree/main/image/reverse_image_search)

* [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/image/reverse_image_search/quick_deploy)

* [在线试用](https://milvus.io/milvus-demos/)

使用的机器学习模型和第三方软件包括：

* YOLOv3

* ResNet-50

* MySQL

* [Towhee](https://towhee.io/)

像Google这样的主要搜索引擎已经为用户提供了按图像搜索的选项。此外，电子商务平台已经意识到了这种功能为在线购物者带来的好处，亚马逊将图像搜索整合到了其智能手机应用中。

在本教程中，您将学习如何构建一个反向图像搜索系统，该系统可以检测图像模式并返回与上传的图像相似的图像。要构建这样的图像相似性搜索系统，请下载包含20个类别的17125个图像的PASCAL VOC图像集。或者，您可以准备自己的图像数据集。使用YOLOv3进行物体检测和ResNet-50进行图像特征提取。通过这两个ML模型之后，图像被转换为256维向量。然后将向量存储在Milvus中，并由Milvus自动生成每个向量的唯一ID。然后使用MySQL将向量ID映射到数据集中的图像。每当您上传新图像到图像搜索系统时，它将被转换为新向量，并与以前存储在Milvus中的向量进行比较。然后，Milvus返回最相似向量的ID，您可以在MySQL中查询相应的图像。

[![image_search](https://milvus.io/static/24846258d3594e2f90a09ad9f4c9b8c9/b87a0/image_search.png "Workflow of a reverse image search system.")](https://milvus.io/static/24846258d3594e2f90a09ad9f4c9b8c9/b87a0/image_search.png)

Workflow of a reverse image search system.

[![image_search_demo](https://milvus.io/static/e148980a21ac40184f005672288789a7/0a251/image_search_demo.jpg "Demo of a reverse image search system.")](https://milvus.io/static/e148980a21ac40184f005672288789a7/ebb16/image_search_demo.jpg)

Demo of a reverse image search system.

