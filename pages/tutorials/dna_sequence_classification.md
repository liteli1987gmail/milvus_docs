

# DNA 序列分类

本教程演示了如何使用 Milvus，一个开源的向量数据库，构建一个 DNA 序列分类模型。

- [打开 Jupyter notebook](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/dna_sequence_classification.ipynb)
- [快速部署](https://github.com/milvus-io/bootcamp/blob/master/solutions/medical/dna_sequence_classification/quick_deploy)

用到的机器学习模型和第三方软件包括：
- CountVectorizer
- MySQL
- [Towhee](https://towhee.io/)

<br/>

DNA 序列是基因可追溯性、物种识别、疾病诊断等领域中常见的概念。尽管各行各业都渴望一种更智能、更高效的研究方法，但人工智能尤其受到生物和医学领域的关注。越来越多的科学家和研究人员正在为生物信息学领域的机器学习和深度学习做出贡献。为了使实验结果更具说服力，一种常见的选择是增加样本大小。与基因组学的大数据协作带来了更多在实际中的应用可能性。然而，传统的序列比对存在局限性，使其不适用于大数据集。为了在实际中做出较少的折衷，将大量的 DNA 序列进行向量化是一个不错的选择。

<br/>

在本教程中，你将学习如何构建一个 DNA 序列分类模型。本教程使用 CountVectorizer 提取 DNA 序列的特征并将其转换为向量。然后，这些向量存储在 Milvus 中，它们对应的 DNA 类别存储在 MySQL 中。用户可以在 Milvus 中进行向量相似度搜索，并从 MySQL 中检索到相应的 DNA 分类。

<br/>

![dna](/assets/dna.png "DNA 序列分类模型的工作流程。")
