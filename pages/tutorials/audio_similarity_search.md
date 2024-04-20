---
title: 音频相似性搜索
---

# 音频相似性搜索

本教程演示了如何使用 Milvus（开源向量数据库）构建音频相似性搜索系统。
- [打开 Jupyter 笔记本](https://github.com/milvus-io/bootcamp/blob/master/solutions/audio/audio_similarity_search/audio_similarity_search.ipynb)

使用的机器学习模型和第三方软件包括：
- PANNs（大规模预训练音频神经网络）
- MySQL
- [Towhee](https://towhee.io/)

</br>

语音、音乐、音效和其他类型的音频搜索使得可以快速查询大量音频数据并找到相似的声音。音频相似性搜索系统的应用包括识别相似的音效、最小化知识产权侵权等。音频检索可用于实时搜索和监控在线媒体，以打击侵犯知识产权的行为。它在音频数据的分类和统计分析中也扮演着重要角色。

</br>

在本教程中，您将学习如何构建一个音频相似性搜索系统，该系统可以返回相似的音频剪辑。上传的音频剪辑使用 PANNs 转换为向量。这些向量存储在 Milvus 中，Milvus 会自动为每个向量生成一个唯一的 ID。然后用户可以在 Milvus 中进行向量相似性搜索，并查询 Milvus 返回的唯一向量 ID 对应的音频剪辑数据路径。

<br/>

![Audio_search](/audio_search.png "音频相似性搜索系统的流程。")
![Audio_search_demo](/audio_search_demo.png "音频相似性搜索系统的演示。")