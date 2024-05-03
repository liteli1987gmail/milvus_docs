---
id: metric.md
summary: Milvus supports a variety of similarity metrics, including Euclidean distance, inner product, Jaccard, etc.
title: Similarity Metrics
---

# 相似度度量

在 Milvus 中，相似度度量用于衡量向量之间的相似性。选择合适的距离度量可以显著提高分类和聚类性能。

下表展示了这些广泛使用的相似度度量如何适应各种输入数据形式和 Milvus 索引。

<div class="filter">
<a href="#floating">浮点嵌入</a> <a href="#binary">二进制嵌入</a>
</div>

<div class="filter-floating table-wrapper" markdown="block">

<table class="tg">
<thead>
  <tr>
    <th class="tg-0pky" style="width: 204px;">相似度度量</th>
    <th class="tg-0pky">索引类型</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky"><ul><li>欧几里得距离 (L2)</li><li>内积 (IP)</li><li>余弦相似度 (COSINE)</li></td>
    <td class="tg-0pky" rowspan="2"><ul><li>FLAT</li><li>IVF_FLAT</li><li>IVF_SQ8</li><li>IVF_PQ</li><li>GPU_IVF_FLAT</li><li>GPU_IVF_PQ</li><li>HNSW</li><li>DISKANN</li></ul></td>
  </tr>
</tbody>
</table>

</div>

<div class="filter-binary table-wrapper" markdown="block">

<table class="tg">
<thead>
  <tr>
    <th class="tg-0pky" style="width: 204px;">距离度量</th>
    <th class="tg-0pky">索引类型</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky"><ul><li>杰卡德 (Jaccard)</li><li>汉明 (Hamming)</li></ul></td>
    <td class="tg-0pky"><ul><li>BIN_FLAT</li><li>BIN_IVF_FLAT</li></ul></td>
  </tr>
</tbody>
</table>

</div>

### 欧几里得距离 (L2)

本质上，欧几里得距离测量连接两个点的线段的长度。

欧几里得距离的公式如下：

![euclidean](/public/assets/euclidean_metric.png "欧几里得距离.")

其中 **a** = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>) 和 **b** = (b<sub>0</sub>, b<sub>0</sub>,..., b<sub>n-1</sub>) 是 n 维欧几里得空间中的两个点

这是最常用的距离度量，当数据是连续的时候非常有用。

<div class="alert note">
当选择欧几里得距离作为距离度量时，Milvus 只在应用平方根之前计算值。
</div>

### 内积 (IP)

两个嵌入之间的 IP 距离定义如下：

![ip](/public/assets/IP_formula.png "内积.")

如果你需要比较非标准化数据或者当你关心大小和角度时，IP 更有用。

<div class="alert note">

如果你对标准化的嵌入应用 IP 距离度量，结果将等同于计算嵌入之间的余弦相似度。

</div>

假设 X' 是从嵌入 X 标准化的：

![normalize](/public/assets/normalize_formula.png "标准化.")

两个嵌入之间的相关性如下：

![normalization](/public/assets/normalization_formula.png "归一化.")

### 余弦相似度

余弦相似度使用两个向量集之间的角度的余弦来测量它们有多相似。你可以认为这两个向量集是两条从同一原点 ([0,0,...]) 开始但指向不同方向的线段。

要计算两个向量集 **A = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** 和 **B = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** 之间的余弦相似度，请使用以下公式：

![cosine_similarity](/public/assets/cosine_similarity.png "Cosine Similarity")

The cosine similarity is always in the interval **[-1, 1]**. For example, two proportional vectors have a cosine similarity of **1**, two orthogonal vectors have a similarity of **0**, and two opposite vectors have a similarity of **-1**. The larger the cosine, the smaller the angle between two vectors, indicating that these two vectors are more similar to each other.

By subtracting their cosine similarity from 1, you can get the cosine distance between two vectors.

### Jaccard distance

Jaccard similarity coefficient measures the similarity between two sample sets and is defined as the cardinality of the intersection of the defined sets divided by the cardinality of the union of them. It can only be applied to finite sample sets.

![Jaccard similarity coefficient](/public/assets/jaccard_coeff.png "Jaccard similarity coefficient.")

Jaccard distance measures the dissimilarity between data sets and is obtained by subtracting the Jaccard similarity coefficient from 1. For binary variables, Jaccard distance is equivalent to the Tanimoto coefficient.

![Jaccard distance](/public/assets/jaccard_dist.png "Jaccard distance.")

### Hamming distance

Hamming distance measures binary data strings. The distance between two strings of equal length is the number of bit positions at which the bits are different.

For example, suppose there are two strings, 1101 1001 and 1001 1101.

11011001 ⊕ 10011101 = 01000100. Since, this contains two 1s, the Hamming distance, d (11011001, 10011101) = 2.

### Structural Similarity

When a chemical structure occurs as a part of a larger chemical structure, the former is called a substructure and the latter is called a superstructure. For example, ethanol is a substructure of acetic acid, and acetic acid is a superstructure of ethanol.

Structural similarity is used to determine whether two chemical formulae are similar to each other in that one is the superstructure or substructure of the other.

To determine whether A is a superstructure of B, use the following formula:

![superstructure](/public/assets/superstructure.png "Superstructure")

Where:

- A is the binary representation of a chemical formula to be retrieved
- B is the binary representation of a chemical formula in the database

Once it returns `0`, **A** is not a superstructure of **B**. Otherwise, the result is the other way around.

To determine whether A is a substructure of B, use the following formula:

![substructure](/public/assets/substructure.png "subsctructure")

Where:

- A is the binary representation of a chemical formula to be retrieved
- B is the binary representation of a chemical formula in the database

Once it returns `0`, **A** is not a substructure of **B**. Otherwise, the result is the other way around.

## FAQ

<details>
<summary><font color="#4fc4f9">Why is the top1 result of a vector search not the search vector itself, if the metric type is inner product?</font></summary>
{{fragments/faq_top1_not_target.md}}
</details>
<details>
<summary><font color="#4fc4f9">What is normalization? Why is normalization needed?</font></summary>
{{fragments/faq_normalize_embeddings.md}}
</details>
<details>
<summary><font color="#4fc4f9">Why do I get different results using Euclidean distance (L2) and inner product (IP) as the distance metric?</font></summary>
{{fragments/faq_euclidean_ip_different_results.md}}
</details>

## What's next

- Learn more about the supported [index types](index.md) in Milvus.
