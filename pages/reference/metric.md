


# 相似性度量

在 Milvus 中，相似性度量用于衡量向量之间的相似性。选择一个好的距离度量方法能够显着提高分类和聚类性能。

以下表格展示了这些常用的相似性度量方法与各种输入数据形式和 Milvus 索引的对应关系。

<div class="filter">
<a href="#floating"> 浮点向量 </a> <a href="#binary"> 二进制向量 </a>
</div>

<div class="filter-floating table-wrapper" markdown="block">

| 相似性度量方法  | 索引类型                                                                                                                                                                                                                                                                               |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 欧几里得距离(L2) | FLAT <br> IVF_FLAT <br> IVF_SQ8 <br> IVF_PQ <br> GPU_IVF_FLAT <br> GPU_IVF_PQ <br> HNSW <br> DISKANN                                                                                                                                                                                                   |
| 内积(IP)       |                                                                                                                                                                                                                                                                                    |
| 余弦相似度      |                                                                                                                                                                                                                                                                                    |

</div>

<div class="filter-binary table-wrapper" markdown="block">

| 距离度量方法 | 索引类型        |
| :----------- | :-------------- |
| Jaccard      | BIN_FLAT <br> BIN_IVF_FLAT |
| Hamming      |                   |

</div>

### 欧几里得距离(L2)

欧几里得距离本质上衡量了连接两个点的线段的长度。

欧几里得距离的公式如下：

![euclidean](/assets/euclidean_metric.png "欧几里得距离.")

其中 **a** = (a <sub> 0 </sub>, a <sub> 1 </sub>,..., a <sub> n-1 </sub>) 和 **b** = (b <sub> 0 </sub>, b <sub> 1 </sub>,..., b <sub> n-1 </sub>) 是 n 维欧几里得空间中的两个点。

这是最常用的距离度量方法，在数据连续时非常有用。

<div class="alert note">
当选择欧几里得距离作为距离度量方法时，Milvus 仅计算应用平方根之前的值。
</div>

### 内积(IP)

两个嵌入向量之间的内积距离定义如下：

![ip](/assets/IP_formula.png "内积.")

如果你需要比较非归一化的数据或关心其幅度和角度，内积距离更为有用。

<div class="alert note">
如果将内积距离度量应用于归一化的嵌入向量，结果将等同于计算嵌入向量之间的余弦相似度。
</div>

假设 X'是从嵌入向量 X 归一化得到的：

![normalize](/assets/normalize_formula.png "归一化.")

两个嵌入向量之间的相关性如下：

![normalization](/assets/normalization_formula.png "归一化.")

### 余弦相似度




Cosine 相似度使用两组向量之间的夹角的余弦来衡量它们的相似性。你可以将这两组向量想象为起点相同（[0,0,...]）但指向不同方向的两条线段。

要计算两组向量 **A = (a <sub> 0 </sub>, a <sub> 1 </sub>,..., a <sub> n-1 </sub>)** 和 **B = (b <sub> 0 </sub>, b <sub> 1 </sub>,..., b <sub> n-1 </sub>)** 之间的余弦相似度，请使用以下公式：

![cosine_similarity](/assets/cosine_similarity.png "Cosine Similarity")

余弦相似度始终在区间 **[-1, 1]** 内。例如，两个成比例的向量的余弦相似度为 **1**，两个正交的向量的相似度为 **0**，两个相反的向量的相似度为 **-1**。余弦越大，两个向量之间的角度越小，表示这两个向量越相似。

通过将其与 1 相减，可以得到两个向量之间的余弦距离。

### Jaccard 距离

Jaccard 相似系数测量两个样本集之间的相似性，定义为定义集合的交集的基数除以其并集的基数。它只能应用于有限样本集。

![Jaccard similarity coefficient](/assets/jaccard_coeff.png "Jaccard similarity coefficient.")

Jaccard 距离测量数据集之间的不相似性，通过从 1 中减去 Jaccard 相似系数来得到。对于二元变量，Jaccard 距离等价于 Tanimoto 系数。

![Jaccard distance](/assets/jaccard_dist.png "Jaccard distance.")

### Hamming 距离

Hamming 距离测量二进制数据字符串之间的距离。等长字符串之间的距离是位不同的位置的数量。

例如，假设存在两个字符串，1101 1001 和 1001 1101。

11011001 ⊕ 10011101 = 01000100。由于这包含两个 1，Hamming 距离 d（11011001，10011101）= 2。

### 结构相似性

当一个化学结构作为另一个化学结构的一部分出现时，前者称为子结构，后者称为超结构。例如，乙醇是乙酸的子结构，乙酸是乙醇的超结构。

结构相似性用于确定两个化学式是否相似，即一个是另一个的超结构或子结构。

要确定 A 是否是 B 的超结构，请使用以下公式：

![superstructure](/assets/superstructure.png "Superstructure")

其中：

- A 是要检索的化学式的二进制表示
- B 是数据库中化学式的二进制表示

一旦返回 `0`，**A** 就不是 **B** 的超结构。否则，结果相反。

要确定 A 是否是 B 的子结构，请使用以下公式：

![substructure](/assets/substructure.png "subsctructure")

其中：

- A 是要检索的化学式的二进制表示
- B 是数据库中化学式的二进制表示

一旦返回 `0`，**A** 就不是 **B** 的子结构。否则，结果相反。

## 常见问题解答

<details>
<summary> <font color="#4fc4f9"> 如果度量类型是内积，为什么向量搜索的 top1 结果不是搜索向量本身？</font> </summary>
{{fragments/faq_top1_not_target.md}}
</details>
<details>
<summary> <font color="#4fc4f9"> 什么是归一化？为什么需要归一化？</font> </summary>
{{fragments/faq_normalize_embeddings.md}}
</details>
<details>
<summary> <font color="#4fc4f9"> 使用欧几里得距离（L2）和内积（IP）作为距离度量时，为什么会得到不同的结果？</font> </summary>
{{fragments/faq_euclidean_ip_different_results.md}}
</details>


## 下一步



- 了解更多有关于 Milvus 中支持的 [index types](/reference/index.md)。
