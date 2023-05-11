音频相似度搜索
=======

本教程演示如何使用开源向量数据库Milvus构建音频相似度搜索系统。

* [打开Jupyter笔记本](https://github.com/milvus-io/bootcamp/blob/master/solutions/audio/audio_similarity_search/audio_similarity_search.ipynb)

* [快速部署](https://github.com/milvus-io/bootcamp/tree/master/solutions/audio/audio_similarity_search/quick_deploy)

使用的ML模型和第三方软件包括：

* PANNs（大规模预训练音频神经网络）

* MySQL

* [Towhee](https://towhee.io/)

语音、音乐、音效等各种类型的音频搜索使得可以快速查询海量音频数据，并找到相似的声音。音频相似性搜索系统的应用包括识别相似的音效、减少知识产权侵权等。音频检索可用于实时搜索和监控在线媒体，以打击知识产权侵权。它也在音频数据的分类和统计分析中扮演着重要的角色。

在本教程中，您将学习如何构建一个音频相似性搜索系统，可以返回相似的声音片段。上传的音频片段使用PANNs转换为向量。这些向量存储在Milvus中，Milvus会自动生成每个向量的唯一ID。然后，用户可以在Milvus中进行向量相似度搜索，并查询与Milvus返回的唯一向量ID对应的音频片段数据路径。

[![Audio_search](https://milvus.io/static/408dacaa6e9ca67fec59564953195a01/1263b/audio_search.png "Workflow of an audio similarity search system.")](https://milvus.io/static/408dacaa6e9ca67fec59564953195a01/98b00/audio_search.png)

Workflow of an audio similarity search system.

[![Audio_search_demo](https://milvus.io/static/eb203dda58fca2bc1cf8a3f385063cdb/1263b/audio_search_demo.png "Demo of an audio similarity search system.")](https://milvus.io/static/eb203dda58fca2bc1cf8a3f385063cdb/bbbf7/audio_search_demo.png)

Demo of an audio similarity search system.

