# 内存索引

本文列出了 Milvus 支持的各种内存索引类型，它们最适合的场景，以及用户可以配置的参数，以实现更好的搜索性能。有关磁盘索引的信息，请参见 **[磁盘索引](disk_index.md)**。

索引是有效组织数据的过程，在通过大幅加速大型数据集上的耗时查询，使相似性搜索变得有用方面起着重要作用。

为了提高查询性能，你可以为每个向量字段 [指定索引类型](index-vector-fields.md)。

<div class="alert note">
目前，一个向量字段只支持一种索引类型。在切换索引类型时，Milvus 会自动删除旧索引。
</div>

## ANNS 向量索引

Milvus 支持的大多数向量索引类型使用近似最近邻搜索（ANNS）算法。与通常非常耗时的精确检索相比，ANNS 的核心思想不再局限于返回最准确的结果，而是只搜索目标的邻居。ANNS 通过在可接受的准确度范围内牺牲准确性来提高检索效率。

根据实现方法，ANNS 向量索引可以分为四类：

- 基于树的索引
- 基于图的索引
- 基于哈希的索引
- 基于量化的索引

## Milvus 支持的索引

根据适用的数据类型，Milvus 支持的索引可以分为两类：

- 用于浮点嵌入的索引

  - 对于 128 维的浮点嵌入，它们占用的存储空间为 128 * float 的大小 = 512 字节。用于浮点嵌入的 [距离度量](metric.md) 是欧几里得距离（L2）和内积。

  - 这些类型的索引包括 FLAT、IVF_FLAT、IVF_PQ、IVF_SQ8、HNSW 和 SCANN<sup>(beta)</sup>，适用于基于 CPU 的 ANN 搜索。

- 用于二进制嵌入的索引

  - 对于 128 维的二进制嵌入，它们占用的存储空间为 128 / 8 = 16 字节。用于二进制嵌入的距离度量是杰卡德和汉明距离。

  - 这类索引包括 BIN_FLAT 和 BIN_IVF_FLAT。

- 用于稀疏嵌入的索引

  - 支持稀疏嵌入的距离度量仅为 `IP`（内积）。

  - 索引类型包括 `SPARSE_INVERTED_INDEX` 和 `SPARSE_WAND`。

以下表格对 Milvus 支持的索引进行了分类：

<div class="filter">
  <a href="#floating">浮点嵌入</a>
  <a href="#binary">二进制嵌入</a>
  <a href="#sparse">稀疏嵌入</a>
</div>

<div class="filter-floating table-wrapper">

<table id="floating">
<thead>
  <tr>
    <th>支持的索引</th>
    <th>分类</th>
    <th>场景</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>FLAT</td>
    <td>不适用</td>
    <td>
      <ul>
        <li>相对较小的数据集</li>
        <li>需要 100% 的召回率</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>IVF_FLAT</td>
    <td>基于量化的索引</td>
    <td>
      <ul>
        <li>高速查询</li>
        <li>需要尽可能高的召回率</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>IVF_SQ8</td>
    <td>基于量化的索引</td>
    <td>
      <ul>
        <li>高速查询</li>
        <li>有限的内存资源</li>
        <li>可以接受在召回率上的小幅度折衷</li>
      </ul>
    </td>
  </tr>  
  <tr>
    <td>IVF_PQ</td>
    <td>基于量化的索引</td>
    <td>
      <ul>
        <li>非常高速的查询</li>
        <li>有限的内存资源</li>
        <li>可以接受在召回率上的大幅度折衷</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>HNSW</td>
    <td>基于图的索引</td>
    <td>
      <ul>
        <li>非常高速的查询</li>
        <li>需要尽可能高的召回率</li>
        <li>大内存资源</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>SCANN</td>
    <td>基于量化的索引</td>
    <td>
      <ul>
        <li>非常高速的查询</li>
        <li>需要尽可能高的