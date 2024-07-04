


# 稀疏向量

稀疏向量使用向量嵌入表示单词或短语，其中大多数元素为零，只有一个非零元素表示特定单词的存在。稀疏向量模型，例如 [SPLADEv2](https://arxiv.org/abs/2109.10086)，在领域外的知识搜索、关键词感知和可解释性方面优于稠密模型。它们在信息检索、自然语言处理和推荐系统中特别有用，通过将稀疏向量用于召回并使用大型模型进行排名，可以显著改善召回结果。

在 Milvus 中，使用稀疏向量的方式与使用稠密向量的方式类似。它涉及创建带有稀疏向量列的集合，插入数据，创建索引，并进行相似性搜索和标量查询。

在本教程中，你将学习以下内容：

- 准备稀疏向量嵌入；
- 创建带有稀疏向量字段的集合；
- 插入带有稀疏向量嵌入的实体；
- 对集合进行索引并在稀疏向量上执行 ANN 搜索。

要查看稀疏向量的实际使用，请参阅 [hello_sparse.py](https://github.com/milvus-io/pymilvus/blob/master/examples/milvus_client/sparse.py)。

<div class="admonition note">
    <p> <b> 注意 </b> </p>
    <ul>
        <li> 目前，在 2.4.0 版本中，对稀疏向量的支持是一个 beta 功能，并计划在 3.0.0 版本中正式提供。</li>
        <li> 本页面上的代码片段使用 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/ORM/Connections/connect.md"> PyMilvus ORM 模块 </a> 与 Milvus 进行交互。将很快提供使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient SDK </a> 的代码片段。</li>
    </ul>
</div>

## 准备稀疏向量嵌入



\## 使用稀疏向量

在 Milvus 中使用稀疏向量时，需要准备支持的格式之一的向量嵌入：

- 稀疏矩阵：使用 [scipy.sparse](https://docs.scipy.org/doc/scipy/reference/sparse.html#module-scipy.sparse) 类族来表示稀疏嵌入。该方法适用于处理大规模、高维数据。

- 字典列表：将每个稀疏嵌入表示为字典，结构为 `{dimension_index: value, ...}`，其中每个键值对表示维度索引及其对应的值。

    示例：

    ```python
    {2: 0.33, 98: 0.72, ...}
    ```

- 元组迭代器列表：类似于字典列表，但使用元组迭代器 `(dimension_index, value)` 来指定非零维度及其值。

    示例：

    ```python
    [(2, 0.33), (98, 0.72), ...]
    ```

下面的示例通过生成包含 10,000 个实体的随机稀疏矩阵来准备稀疏嵌入，每个实体有 10,000 个维度，稀疏度为 0.005。

```python
# 准备稀疏向量表示的实体
rng = np.random.default_rng()

num_entities, dim = 10000, 10000

# 生成具有平均每行25个非零元素的随机稀疏行
entities = [
    {
        "scalar_field": rng.random(),
        # 要表示单个稀疏向量行，可以使用：
        # - 任何shape[0] == 1的scipy.sparse稀疏矩阵类族
        # - Dict[int, float]
        # - Iterable[Tuple[int, float]]
        "sparse_vector": {
            d: rng.random() for d in random.sample(range(dim), random.randint(20, 30))
        },
    }
    for _ in range(num_entities)
]

# 打印第一个实体以检查表示形式
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
#         6167: 0.19929870545596562,
#         5891: 0.8214617920371853,
#         2245: 0.7852255053773395,
#         2886: 0.8787982039149889,
#         8966: 0.9000606703940665,
#         4910: 0.3001170013981104,
#         17: 0.00875671667413136,
#         3279: 0.7003425473001098,
#         2622: 0.7571360018373428,
#         4962: 0.3901879090102064,
#         4698: 0.22589525720196246,
#         3290: 0.5510228492587324,
#         6185: 0.4508413201390492
#     }
# }
```

<div class="admonition note">

<p> <b> 注意 </b> </p>

<p> 向量维度必须为 Python <code> int </code> 或 <code> numpy.integer </code> 类型，值必须为 Python <code> float </code> 或 <code> numpy.floating </code> 类型。</p>

</div>

要生成嵌入，还可以使用在 PyMilvus 库中内置的 `model` 包，该包提供了一系列的嵌入函数。详细信息请参考 [嵌入](/embeddings/embeddings.md)。

## 创建包含稀疏向量字段的集合
 


为了创建一个包含稀疏向量字段的集合，将稀疏向量字段的 __datatype__ 设置为 __DataType.SPARSE_FLOAT_VECTOR__。与密集向量不同，对于稀疏向量，无需指定维度。

```python
import numpy as np
import random
from pymilvus import MilvusClient, DataType

# 创建一个MilvusClient实例
client = MilvusClient(uri="http://localhost:19530")

# 创建一个包含稀疏向量字段的集合
schema = client.create_schema(
    auto_id=True,
    enable_dynamic_fields=True,
)

schema.add_field(field_name="pk", datatype=DataType.VARCHAR, is_primary=True, max_length=100)
schema.add_field(field_name="scalar_field", datatype=DataType.DOUBLE)
# 对于稀疏向量，无需指定维度
schema.add_field(field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR) # 将`datatype`设置为`SPARSE_FLOAT_VECTOR`

client.create_collection(collection_name="test_sparse_vector", schema=schema)
```

有关常见集合参数的详细信息，请参阅[create_collection()
](https://milvus.io/api-reference/pymilvus/v2.4.x/MilvusClient/Collections/create_collection.md)。

## 使用稀疏向量嵌入插入实体

要插入具有稀疏向量嵌入的实体，只需将实体列表传递给 `insert()` 方法。

```python
# 插入实体
client.insert(collection_name="test_sparse_vector", data=entities)
```

## 为集合创建索引

在执行相似度搜索之前，为集合创建索引。

```python
# 为集合创建索引

# 准备索引参数
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="sparse_vector",
    index_name="sparse_inverted_index",
    index_type="SPARSE_INVERTED_INDEX", # 要创建的索引类型。设置为`SPARSE_INVERTED_INDEX`或`SPARSE_WAND`。
    metric_type="IP", # 用于索引的度量类型。目前，只支持`IP`（内积）。
    params={"drop_ratio_build": 0.2}, # 在索引过程中要删除的小向量值的比例。
)

# 创建索引
client.create_index(collection_name="test_sparse_vector", index_params=index_params)

```

在构建稀疏向量的索引时，请注意以下事项：

- `index_type`：要构建的索引类型。稀疏向量的可能选项有：

  - `SPARSE_INVERTED_INDEX`：倒排索引，将每个维度映射到其非零向量，便于在搜索期间直接访问相关数据。适用于稀疏但高维数据的数据集。

  - `SPARSE_WAND`：利用 Weak-AND (WAND) 算法，快速绕过不太可能的候选项，并聚焦评估那些具有更高排名潜力的候选项。将维度视为术语，将向量视为文档，加速在大型稀疏数据集中的搜索。

- `metric_type`：只支持稀疏向量的 `IP`（内积）距离度量。

- `params.drop_ratio_build`：专门用于稀疏向量的索引参数。它控制索引过程中要排除的小向量值的比例。该参数通过在构建索引时忽略小值来在效率和准确性之间进行微调。例如，如果 `drop_ratio_build = 0.3`，在构建索引过程中，将收集和排序所有稀疏向量的所有值。这些值中的最小 30 ％不包括在索引中，从而在搜索期间减少计算工作量。

有关更多信息，请参阅 [内存中的索引](/reference/index.md)。

## 执行相似度搜索




索引收集并加载到内存后，使用 `search()` 方法根据查询检索相关文档。

```python
# 将收集加载到内存中
client.load_collection(collection_name="test_sparse_vector")

# 在稀疏向量上执行ANN搜索

# 为了演示目的，我们搜索最后插入的向量
query_vector = entities[-1]["sparse_vector"]

search_params = {
    "metric_type": "IP",
    "params": {"drop_ratio_search": 0.2}, # 查询向量中要忽略的最小值的比例。
}

search_res = client.search(
    collection_name="test_sparse_vector",
    data=[query_vector],
    limit=3,
    output_fields=["pk", "scalar_field"],
    search_params=search_params,
)

for hits in search_res:
    for hit in hits:
        print(f"hit: {hit}")
        
# 输出:
# hit: {'id': '448458373272710786', 'distance': 7.220192909240723, 'entity': {'pk': '448458373272710786', 'scalar_field': 0.46767865218233806}}
# hit: {'id': '448458373272708317', 'distance': 1.2287548780441284, 'entity': {'pk': '448458373272708317', 'scalar_field': 0.7315987515699472}}
# hit: {'id': '448458373272702005', 'distance': 0.9848432540893555, 'entity': {'pk': '448458373272702005', 'scalar_field': 0.9871869181562156}}
```

在配置搜索参数时，请注意以下内容：

- `params.drop_ratio_search`：仅供稀疏向量使用的搜索参数。此选项通过指定查询向量中要忽略的最小值的比例来微调搜索过程。它有助于平衡搜索准确性和性能。将 `drop_ratio_search` 设置为较小的值，这些较小值对最终得分的贡献较小。通过忽略一些较小的值，可以提高搜索性能，对准确性的影响很小。

## 执行标量查询

除了 ANN 搜索，Milvus 还支持对稀疏向量进行标量查询。这些查询允许你基于稀疏向量关联的标量值检索文档。

过滤标量字段大于 3 的实体：

```python
# 通过指定过滤器表达式执行查询
filter_query_res = client.query(
    collection_name="test_sparse_vector",
    filter="scalar_field > 0.999",
)

print(filter_query_res[:2])

# 输出:
# [{'pk': '448458373272701862', 'scalar_field': 0.9994093623822689, 'sparse_vector': {173: 0.35266244411468506, 400: 0.49995484948158264, 480: 0.8757831454277039, 661: 0.9931875467300415, 1040: 0.0965644046664238, 1728: 0.7478245496749878, 2365: 0.4351981580257416, 2923: 0.5505295395851135, 3181: 0.7396837472915649, 3848: 0.4428485333919525, 4701: 0.39119353890419006, 5199: 0.790219783782959, 5798: 0.9623121619224548, 6213: 0.453134149312973, 6341: 0.745091438293457, 6775: 0.27766478061676025, 6875: 0.017947908490896225, 8093: 0.11834774166345596, 8617: 0.2289179265499115, 8991: 0.36600416898727417, 9346: 0.5502803921699524}}, {'pk': '448458373272702421', 'scalar_field': 0.9990218525410719, 'sparse_vector': {448: 0.587817907333374, 1866: 0.0994109958410263, 2438: 0.8672442436218262, 2533: 0.8063794374465942, 2595: 0.02122959867119789, 2828: 0.33827054500579834, 2871: 0.1984412521123886, 2938: 0.09674275666475296, 3154: 0.21552987396717072, 3662: 0.5236313343048096, 3711: 0.6463911533355713, 4029: 0.4041993021965027, 7143: 0.7370485663414001, 7589: 0.37588241696357727, 7776: 0.436136394739151, 7962: 0.06377989053726196, 8385: 0.5808192491531372, 8592: 0.8865005970001221, 8648: 0.05727503448724747, 9071: 0.9450633525848389, 9161: 0.146037295460701, 9358: 0.1903032660484314, 9679: 0.3146636486053467, 9974: 0.8561339378356934, 9991: 0.15841573476791382}}]
```

通过主键过滤实体：

```python
# 满足过滤器的实体的主键
pks = [ret["pk"] for ret in filter_query_res]

# 通过主键执行查询
pk_query_res = client.query(
    collection_name="test_sparse_vector", filter=f"pk == '{pks[0]}'"
)

print(pk_query_res)

# 输出:
# [{'scalar_field': 0.9994093623822689, 'sparse_vector': {173: 0.35266244411468506, 400: 0.49995484948158264, 480: 0.8757831454277039, 661: 0.9931875467300415, 1040: 0.0965644046664238, 1728: 0.7478245496749878, 2365: 0.4351981580257416, 2923: 0.5505295395851135, 3181: 0.7396837472915649, 3848: 0.4428485333919525, 4701: 0.39119353890419006, 5199: 0.790219783782959, 5798: 0.9623121619224548, 6213: 0.453134149312973, 6341: 0.745091438293457, 6775: 0.27766478061676025, 6875: 0.017947908490896225, 8093: 0.11834774166345596, 8617: 0.2289179265499115, 8991: 0.36600416898727417, 9346: 0.5502803921699524}, 'pk': '448458373272701862'}]
```

## 限制

在使用 Milvus 中的稀疏向量时，请考虑以下限制：

- 目前，稀疏向量仅支持 __IP__ 距离度量。

- 对于稀疏向量字段，仅支持 __SPARSE_INVERTED_INDEX__ 和 __SPARSE_WAND__ 索引类型。

- 目前，不支持稀疏向量的 [范围搜索](https://milvus.io/docs/single-vector-search.md#Range-search)、[分组搜索](https://milvus.io/docs/single-vector-search.md#Grouping-search) 和 [搜索迭代器](https://milvus.io/docs/with-iterators.md#Search-with-iterator)。

## 常见问题解答
 

- __稀疏向量支持哪些距离度量方法？__

    由于稀疏向量的高维度特性，仅支持内积（Inner Product，IP）距离度量方法，L2 距离和余弦距离不可行。

- __请解释一下 SPARSE_INVERTED_INDEX 和 SPARSE_WAND 之间的区别，并且我如何选择它们？__

    __SPARSE_INVERTED_INDEX__ 是传统的倒排索引，而 __SPARSE_WAND__ 则使用了 [Weak-AND 算法](https://dl.acm.org/doi/10.1145/956863.956944) 在搜索过程中减少了完整的 IP 距离计算次数。通常情况下，__SPARSE_WAND__ 速度更快，但当向量密度增加时性能可能会下降。选择使用哪种方法取决于具体的数据集和使用场景，建议开展实验和基准测试。

- __如何选择 drop_ratio_build 和 drop_ratio_search 参数？__

    选择 __drop_ratio_build__ 和 __drop_ratio_search__ 参数取决于数据的特征以及对搜索延迟/吞吐量和准确性的要求。

- __稀疏嵌入支持哪些数据类型？__

    维度部分必须是 32 位无符号整数，值部分可以是任意 32 位浮点数。

- __稀疏嵌入的维度是否可以是 uint32 范围内的任何离散值？__

    是的，稀疏嵌入的维度可以是 0 到 42 亿（__uint32__ 的最大值减 1）之间的任何值。

- __在增量段上的搜索是通过索引还是通过蛮力进行的？__

    对于增长中的段，使用与封闭段索引相同类型的索引进行搜索。对于构建索引之前的新增长段，使用蛮力搜索。

- __是否可以在单个集合中同时使用稀疏向量和密集向量？__

    是的，有了多向量类型支持，你可以创建包含稀疏和密集向量列的集合，并对它们进行混合搜索。

- __对于稀疏嵌入进行插入或搜索的要求是什么？__

    稀疏嵌入必须至少具有一个非零值，并且向量索引必须是非负的。
