---
title: 视频相似性搜索
---

# 视频相似性搜索

本教程演示了如何使用 Milvus（开源向量数据库）构建视频相似性搜索系统。
- [打开 Jupyter 笔记本](https://github.com/towhee-io/examples/tree/main/video/reverse_video_search)

使用的机器学习模型和第三方软件包括：
- OpenCV
- ResNet-50
- MySQL
- [Towhee](https://towhee.io/)

<br/>

如今，在观看了一部他们喜欢的电影或视频后，人们可以轻松地截取屏幕截图，并通过在各种社交网络平台上发布来分享他们的想法。当关注者看到这些截图时，如果帖子中没有明确地拼出电影名称，他们可能很难分辨出是哪部电影。为了弄清楚电影的名字，人们可以利用视频相似性搜索系统。通过使用该系统，用户可以上传一张图片，并获取包含与上传图片相似的关键帧的视频或电影。

<br/>

在本教程中，你将学习如何构建一个视频相似性搜索系统。本教程使用 Tumblr 上大约 100 个动画 gif 来构建系统。然而，你也可以准备自己的视频数据集。系统首先使用 OpenCV 从视频中提取关键帧，然后使用 ResNet-50 获取每个关键帧的特征向量。所有向量都存储在 Milvus 中，并在其中进行搜索，它将返回相似向量的 ID。然后将 ID 映射到存储在 MySQL 中的相应视频。

<br/>

![video_search](/video_search.png "视频相似性搜索系统的流程。")
![video_search_demo](/video_search_demo.gif "视频相似性搜索系统的演示。")