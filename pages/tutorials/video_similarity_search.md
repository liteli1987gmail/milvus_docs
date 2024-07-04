


    # 视频相似度搜索

    本教程演示如何使用开源向量数据库 Milvus 构建视频相似度搜索系统。
    - [打开 Jupyter notebook](https://github.com/towhee-io/examples/tree/main/video/reverse_video_search)

    使用的机器学习模型和第三方软件包括：
    - OpenCV
    - ResNet-50
    - MySQL
    - [Towhee](https://towhee.io/)

    <br/>

    如今，人们在观看喜欢的电影或视频后，可以轻松截屏并通过发布到各种社交平台来分享他们的想法。当关注者看到截图时，如果电影名称在帖子中没有明确指出，那么很难告诉他们这是哪部电影。为了找出电影的名称，人们可以利用一个视频相似度搜索系统。通过使用该系统，用户可以上传一个图像，并获得包含与上传图像相似的关键帧的视频或电影。

    <br/>

    在本教程中，你将学习如何构建一个视频相似度搜索系统。本教程使用了来自 Tumblr 的约 100 个动态 GIF 文件来构建系统。不过，你也可以准备自己的视频数据集。该系统首先使用 OpenCV 从视频中提取关键帧，然后使用 ResNet-50 获取每个关键帧的特征向量。所有向量都存储在 Milvus 中，并在 Milvus 中进行搜索，将返回相似向量的 ID。然后将这些 ID 映射到 MySQL 中存储的相应视频。

    <br/>

    ![video_search](/assets/video_search.png "视频相似度搜索系统的工作流程。")
    ![video_search_demo](/assets/video_search_demo.gif "视频相似度搜索系统的演示。")

