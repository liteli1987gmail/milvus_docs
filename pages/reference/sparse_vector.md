# 稀疏向量

稀疏向量使用向量嵌入来表示单词或短语，其中大部分元素为零，只有一个非零元素表示特定单词的存在。稀疏向量模型，如 [SPLADEv2](https://arxiv.org/abs/2109.10086)，在跨领域知识搜索、关键词感知和可解释性方面优于密集模型。它们特别适用于信息检索、自然语言处理和推荐系统，其中将稀疏向量用于召回与大型模型用于排名相结合可以显著提高检索结果。

在 Milvus 中，稀疏向量的使用流程与密集向量类似。它涉及创建一个带有稀疏向量列的集合，插入数据，创建索引，以及进行相似性搜索和标量查询。

在本教程中，您将学习如何：

- 准备稀疏向量嵌入；
- 创建带有稀疏向量字段的集合；
- 插入带有稀疏向量嵌入的实体；
- 索引集合并在稀疏向量上执行近似最近邻（ANN）搜索。

要查看稀疏向量的实际应用，请参考 [hello_sparse.py](https://github.com/milvus-io/pymilvus/blob/master/examples/milvus_client/sparse.py)。

<div class="admonition note">
    <p><b>注意</b></p>
    <ul>
        <li>目前，稀疏向量的支持是 2.4.0 版本中的一个测试功能，计划在 3.0.0 版本中正式发布。</li>
        <li>本页上的代码片段使用 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md">PyMilvus ORM 模块</a> 与 Milvus 进行交互。使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient SDK</a> 的代码片段将很快提供。</li>
    </ul>
</div>

## 准备稀疏向量嵌入

要在 Milvus 中使用稀疏向量，请使用支持的格式之一准备向量嵌入：

- __稀疏矩阵__：使用 [scipy.sparse](https://docs.scipy.org/doc/scipy/reference/sparse.html#module-scipy.sparse) 类族表示您的稀疏嵌入。这种方法对于处理大规模、高维数据非常高效。

- __字典列表__：将每个稀疏嵌入表示为一个字典，结构为 `{dimension_index: value, ...}`，其中每个键值对表示维度索引及其相应的值。

    示例：

    ```python
    {2: 0.33, 98: 0.72, ...}
    ```

- __可迭代的元组列表__：类似于字典列表，但使用元组的可迭代列表 `(dimension_index, value)` 来指定非零维度及其值。

    示例：

    ```python
    [(2, 0.33), (98, 0.72), ...]
    ```

以下示例通过为 10,000 个实体生成随机稀疏矩阵来准备稀疏嵌入，每个实体具有 10,000 个维度，稀疏度为 0.005。

```python
# 准备具有稀疏向量表示的实体
rng = np.random.default_rng()

num_entities, dim = 10000, 10000

# 生成每行平均有 25 个非零元素的随机稀疏行
entities = [
    {
        "scalar_field": rng.random(),
        # 要表示单个稀疏向量行，您可以使用：
        # - scipy.sparse 稀疏矩阵类族中的任何一种，且 shape[0] == 1
        # - Dict[int, float]
        # - Iterable[Tuple[int, float]]
        "sparse_vector": {
            d: rng.random() for d in random.sample(range(dim), random.randint(20, 30))
        },
    }
    for _ in range(num_entities)
]

# 打印第一个实体以检查表示
print(entities[0])

# 输出：
# {
#     'scalar_field': 0.520821523849214,
#     'sparse_vector': {
#         5263: 0.2639375518635271,
#         3573: 0.34701499565746674,
#         9637: 0.30856525997853057,
#         4399: 0.19771651149001523,
#         6959: 0.31025067641541815,
#         1729: 0.8265339135915016,
#         1220: 0.15303302147479103,
#         7335: 0.9436728846033107,
#         6167: 0.