DNA序列分类
=======

本教程演示如何使用开源向量数据库Milvus构建DNA序列分类模型。

* [打开Jupyter笔记本](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/dna_sequence_classification.ipynb)

* [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/quick_deploy)

使用的ML模型和第三方软件包括：

* CountVectorizer

* MySQL

* [Towhee](https://towhee.io/)

DNA序列是基因可追溯性、物种识别、疾病诊断等许多领域的流行概念。而所有行业都渴望更智能、更高效的研究方法，特别是生物和医学领域，人工智能引起了很大关注。越来越多的科学家和研究人员正在为生物信息学领域的机器学习和深度学习做出贡献。为了使实验结果更加令人信服，一种常见的选择是增加样本量。与基因组学的大数据协作带来了更多的应用可能性。然而，传统的序列比对具有局限性，使其不适用于大型数据集。为了在现实中做出更少的权衡，向量化是大型DNA序列数据集的一个很好的选择。

在本教程中，您将学习如何构建DNA序列分类模型。本教程使用CountVectorizer提取DNA序列的特征并将其转换为向量。然后，这些向量存储在Milvus中，它们对应的DNA分类存储在MySQL中。用户可以在Milvus中进行向量相似性搜索，并从MySQL中检索相应的DNA分类。

[![dna](https://milvus.io/static/2ea19b2d3f624295527d3a0d330d808e/c9fe3/dna.png "Workflow of a DNA sequence classification model.")](https://milvus.io/static/2ea19b2d3f624295527d3a0d330d808e/c9fe3/dna.png)

Workflow of a DNA sequence classification model.

