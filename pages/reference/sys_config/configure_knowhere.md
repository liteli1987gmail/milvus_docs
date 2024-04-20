# Knowhere 相关配置

本主题介绍 Milvus 中 Knowhere 相关的配置。

[Knowhere](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/knowhere_design.md) 是 Milvus 的搜索引擎。

在本节中，您可以配置系统默认的 SIMD 指令集类型。

## `knowhere.simdType`

<table id="knowhere.simdType">
  <thead>
    <tr>
      <th class="width80">描述</th>
      <th class="width20">默认值</th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li>可以加速向量搜索和索引构建的 CPU 指令集。</li>
        <li>选项： <code>auto</code>, <code>avx512</code>, <code>avx2</code>, <code>avx</code>, 和 <code>sse4_2</code></li>
      </td>
      <td>auto</td>
    </tr>
  </tbody>
</table>