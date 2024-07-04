


# 音频相似度搜索

本教程演示如何使用 Milvus，一个开源的向量数据库，构建一个音频相似度搜索系统。
- [打开 Jupyter notebook](https://github.com/milvus-io/bootcamp/blob/master/solutions/audio/audio_similarity_search/audio_similarity_search.ipynb)

使用的机器学习模型和第三方软件包括：
- PANNs(大规模预训练音频神经网络)
- MySQL
- [Towhee](https://towhee.io/)

</br>

语音、音乐、音效和其他类型的音频搜索使得快速查询大量音频数据并找到相似的声音成为可能。音频相似度搜索系统的应用包括识别相似的音效、减少知识产权侵权等。音频检索可以用于实时搜索和监控在线媒体，打击知识产权侵权行为。它还在音频数据的分类和统计分析中扮演着重要的角色。

</br>

在本教程中，你将学习如何构建一个音频相似度搜索系统，该系统可以返回相似的音频片段。上传的音频片段将使用 PANNs 转换为向量。这些向量存储在 Milvus 中，Milvus 会自动生成每个向量的唯一标识符。然后用户可以在 Milvus 中进行向量相似度搜索，并查询与 Milvus 返回的唯一向量标识符对应的音频片段数据路径。

<br/>

![音频搜索](/assets/audio_search.png "音频相似度搜索系统的工作流程。")
![音频搜索演示](/assets/audio_search_demo.png "音频相似度搜索系统的演示。")
