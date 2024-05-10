---
id: recommendation_system.md
summary: Build a personalized recommender system with Milvus.
title: Recommender System
---

# 推荐系统

本教程演示了如何使用 Milvus（开源向量数据库）构建推荐系统。

- [打开 Jupyter 笔记本](https://github.com/milvus-io/bootcamp/blob/master/solutions/nlp/recommender_system/recommender_system.ipynb)

使用的机器学习模型和第三方软件包括：

- PaddlePaddle
- Redis 或 MySQL
- [Towhee](https://towhee.io/)

</br>

推荐系统是信息过滤系统的一个子集，可用于多种场景，包括个性化电影、音乐、产品和信息流推荐。与搜索引擎不同，推荐系统不需要用户准确描述他们的需求，而是通过分析用户行为来发现用户的需求和兴趣。

</br>

在本教程中，您将学习如何构建一个电影推荐系统，该系统可以根据用户的兴趣推荐电影。要构建这样的推荐系统，首先下载一个与电影相关的数据集。本教程使用 MovieLens 1M。或者，您可以准备自己的数据集，其中应包括用户对电影的评分、用户的人口统计特征和电影描述等信息。使用 PaddlePaddle 将用户 ID 和特征组合并转换为 256 维向量。以类似的方式将电影 ID 和特征转换为向量。将电影向量存储在 Milvus 中，并使用用户向量进行相似性搜索。如果用户向量与电影向量相似，Milvus 将返回电影向量及其 ID 作为推荐结果。然后使用存储在 Redis 或 MySQL 中的电影向量 ID 查询电影信息。

</br>

![recommender_system](/public/assets/recommendation_system.png "推荐系统的流程图。")
