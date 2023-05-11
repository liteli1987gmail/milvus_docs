分子相似性搜索
=======

本教程演示如何使用开源向量数据库Milvus构建分子相似性搜索系统。

* [打开Jupyter笔记本](https://github.com/towhee-io/examples/tree/main/medical/molecular_search)

* [快速部署](https://github.com/milvus-io/bootcamp/tree/master/solutions/medical/molecular_similarity_search/quick_deploy)

* [试用演示](https://milvus.io/milvus-demos/)

使用的第三方软件包括：

* RDKit

* MySQL

* [Towhee](https://towhee.io/)

药物开发是新药研发的重要组成部分。药物开发过程包括靶点选择和确认。当发现片段或引导化合物时，研究人员通常会在内部或商业化合物库中搜索类似化合物，以发现结构活性关系（SAR）、化合物可用性。最终，他们将评估引导化合物的潜力，以优化为候选化合物。为了从数十亿规模的化合物库中发现可用的化合物，通常检索化学指纹以进行亚结构搜索和分子相似性搜索。

在本教程中，您将学习如何构建一种分子相似性搜索系统，该系统可以检索特定分子的亚结构、超结构和类似结构。RDKit是一款开源的化学信息学软件，可以将分子结构转换为向量。然后，这些向量存储在Milvus中，Milvus可以对向量进行相似性搜索。Milvus还会自动为每个向量生成唯一的ID。向量ID和分子结构的映射存储在MySQL中。

[![molecular](https://milvus.io/static/b3bac1ee6c20ddd2a8af37cb9479f66e/1263b/molecular.png "Workflow of a molecular similarity search system.")](https://milvus.io/static/b3bac1ee6c20ddd2a8af37cb9479f66e/7e99c/molecular.png)

Workflow of a molecular similarity search system.

[![molecular](https://milvus.io/static/70c9b0d2fa5d883b1de4ad0625dc06aa/40619/molecular_demo.jpg "Demo of a molded similarity search system.")](https://milvus.io/static/70c9b0d2fa5d883b1de4ad0625dc06aa/40619/molecular_demo.jpg)

Demo of a molded similarity search system.

