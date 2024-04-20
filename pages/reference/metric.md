## 相似度度量

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

![euclidean](/euclidean_metric.png "欧几里得距离.")

其中 **a** = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>) 和 **b** = (b<sub>0</sub>, b<sub>0</sub>,..., b<sub>n-1</sub>) 是 n 维欧几里得空间中的两个点

这是最常用的距离度量，当数据是连续的时候非常有用。

<div class="alert note">
当选择欧几里得距离作为距离度量时，Milvus 只在应用平方根之前计算值。
</div>

### 内积 (IP)

两个嵌入之间的 IP 距离定义如下：

![ip](/IP_formula.png "内积.")

如果你需要比较非标准化数据或者当你关心大小和角度时，IP 更有用。

<div class="alert note">

如果你对标准化的嵌入应用 IP 距离度量，结果将等同于计算嵌入之间的余弦相似度。

</div>

假设 X' 是从嵌入 X 标准化的：

![normalize](/normalize_formula.png "标准化.")

两个嵌入之间的相关性如下：

![normalization](/normalization_formula.png "归一化.")

### 余弦相似度

余弦相似度使用两个向量集之间的角度的余弦来测量它们有多相似。你可以认为这两个向量集是两条从同一原点 ([0,0,...]) 开始但指向不同方向的线段。

要计算两个向量集 **A = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** 和 **B = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** 之间的余弦相似度，请使用以下公式：

![cosine_similarity](/cosine_similarity.png "余弦相似度")

余弦相似度总是在区间 **[-1, 1]** 内。例如，两个成比例的向量有一个余弦相似度的 **1**，两个正交向量有一个相似度