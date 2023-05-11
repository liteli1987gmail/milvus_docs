推荐系统
====

本教程演示如何使用开源向量数据库Milvus构建推荐系统。

* [打开Jupyter notebook](https://github.com/milvus-io/bootcamp/blob/master/solutions/nlp/recommender_system/recommender_system.ipynb)

* [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/nlp/recommender_system/quick_deploy)

使用的ML模型和第三方软件包括：

* PaddlePaddle

* Redis或MySQL

* [Towhee](https://towhee.io/)

推荐系统是信息过滤系统的一个子集，可用于个性化电影、音乐、产品和信息流推荐等各种场景。与搜索引擎不同，推荐系统不需要用户准确描述其需求，而是通过分析用户行为来发现用户的需求和兴趣。

在本教程中，您将学习如何构建一个电影推荐系统，该系统可以建议符合用户兴趣的电影。要构建这样的推荐系统，首先需要下载一个与电影相关的数据集。本教程使用MovieLens 1M。或者，您可以准备自己的数据集，其中应包括用户对电影的评分、用户的人口统计特征和电影描述等信息。使用PaddlePaddle将用户ID和特征组合并将其转换为256维向量。以类似的方式将电影ID和特征转换为向量。将电影向量存储在Milvus中，并使用用户向量进行相似性搜索。如果用户向量与电影向量相似，Milvus将返回电影向量和其ID作为推荐结果。然后使用存储在Redis或MySQL中的电影向量ID查询电影信息。

[![recommender_system](https://milvus.io/static/46df1b9dcc35b52455c5e9ede92ca5ae/a27c6/recommendation_system.png "Workflow of a recommender system.")](https://milvus.io/static/46df1b9dcc35b52455c5e9ede92ca5ae/a27c6/recommendation_system.png)

Workflow of a recommender system.

