视频相似性搜索
=======

本教程演示如何使用开源向量数据库Milvus构建视频相似性搜索系统。

* [打开Jupyter笔记本](https://github.com/towhee-io/examples/tree/main/video/reverse_video_search)

* [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/video/video_similarity_search/quick_deploy)

使用的机器学习模型和第三方软件包括：

* OpenCV

* ResNet-50

* MySQL

* [Towhee](https://towhee.io/)

现在，人们看完喜欢的电影或视频后，可以轻松地截图并通过各种社交平台发布他们的想法。当关注者看到截图时，如果电影名称没有在帖子中明确说明，他们很难确定电影的名称。为了确定电影的名称，人们可以利用视频相似度搜索系统。通过使用该系统，用户可以上传图像并获得包含与上传图像相似的关键帧的视频或电影。

在本教程中，您将学习如何构建一个视频相似度搜索系统。本教程使用Tumblr上的约100个动画gif来构建系统。但是，您也可以准备自己的视频数据集。该系统首先使用OpenCV从视频中提取关键帧，然后使用ResNet-50获取每个关键帧的特征向量。所有向量都存储在Milvus中，并进行搜索，Milvus将返回相似向量的ID。然后将ID映射到存储在MySQL中的相应视频。

[![video_search](https://milvus.io/static/31c3a15fec52b27ff577bc9899f2b842/1263b/video_search.png "Workflow of a video similarity search system.")](https://milvus.io/static/31c3a15fec52b27ff577bc9899f2b842/bbbf7/video_search.png)

Workflow of a video similarity search system.

![video_search_demo](/blog/e171c474e0f1a69bf3fdc0299e3cc278/video_search_demo.gif "Demo of a video similarity search system.")

