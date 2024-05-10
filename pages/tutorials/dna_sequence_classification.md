---
id: dna_sequence_classification.md
summary: Build a DNA sequence classification system with Milvus.
title: DNA Sequence Classification
---

# DNA 序列分类

本教程演示了如何使用 Milvus，一个开源的向量数据库，来构建一个 DNA 序列分类模型。

- [打开 Jupyter 笔记本](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/dna_sequence_classification.ipynb)
- [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/quick_deploy)

使用的机器学习模型和第三方软件包括：

- CountVectorizer
- MySQL
- [Towhee](https://towhee.io/)

<br/>

DNA 序列是基因可追溯性、物种识别、疾病诊断等领域的一个流行概念。尽管所有行业都渴望更智能、更高效的研究方法，但人工智能已经吸引了生物和医学领域的大量关注。越来越多的科学家和研究人员正在为生物信息学领域的机器学习和深度学习做出贡献。为了使实验结果更有说服力，一个常见的选择是增加样本量。与基因组学中的大数据合作带来了更多的现实应用可能性。然而，传统的序列比对有局限性，不适合大型数据集。为了在现实中做出更少的权衡，向量化是处理大量 DNA 序列数据集的一个好选择。

<br/>

在本教程中，你将学习如何构建一个 DNA 序列分类模型。本教程使用 CountVectorizer 提取 DNA 序列的特征并将其转换为向量。然后，这些向量存储在 Milvus 中，并将它们对应的 DNA 类别存储在 MySQL 中。用户可以在 Milvus 中进行向量相似性搜索，并从 MySQL 中检索相应的 DNA 分类。

<br/>

![dna](/public/assets/dna.png "DNA序列分类模型的工作流程。")
