

# 导入数据

本主题介绍如何通过批量加载（bulk load）方式在 Milvus 中导入数据。

通常，将大批量的实体插入 Milvus 的常规方法通常会导致在客户端、代理、Pulsar 和数据节点之间进行大规模的网络传输。为了避免这种情况，Milvus 2.1 支持通过批量加载来从文件中加载数据。你只需几行代码即可将大量数据导入到一个集合中，并为整个实体批量提供原子性。

你也可以使用 [MilvusDM](/migrate/migrate_overview.md) 这个针对与 Milvus 导入和导出数据而设计的开源工具将数据迁移到 Milvus 中。

<div class="alert note">

此页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md"> MilvusClient </a>（Python）与 Milvus 进行交互。其他语言的新 MilvusClient SDK 将在未来的更新中发布。

</div>

## 准备数据文件

你可以按行或按列准备数据文件。

- 按行的数据文件

按行的数据文件是包含多行的 JSON 文件。根键必须是“rows”。文件名可以随意指定。

```json
{
  "rows":[
    {"book_id": 101, "word_count": 13, "book_intro": [1.1, 1.2]},
    {"book_id": 102, "word_count": 25, "book_intro": [2.1, 2.2]},
    {"book_id": 103, "word_count": 7, "book_intro": [3.1, 3.2]},
    {"book_id": 104, "word_count": 12, "book_intro": [4.1, 4.2]},
    {"book_id": 105, "word_count": 34, "book_intro": [5.1, 5.2]},
  ]
}
```

- 按列的数据文件

按列的数据文件可以是包含多个列的 JSON 文件、包含单个列的多个 Numpy 文件，或者包含多个列和一些 Numpy 文件的 JSON 文件。

   - 包含多个列的 JSON 文件
    ```json
    {
            "book_id": [101, 102, 103, 104, 105],
            "word_count": [13, 25, 7, 12, 34],
            "book_intro": [
                    [1.1, 1.2],
                    [2.1, 2.2],
                    [3.1, 3.2],
                    [4.1, 4.2],
                    [5.1, 5.2]
            ]
    }
    ```

  - Numpy 文件

    ```python
    import numpy
    numpy.save('book_id.npy', numpy.array([101, 102, 103, 104, 105]))
    numpy.save('word_count.npy', numpy.array([13, 25, 7, 12, 34]))
    arr = numpy.array([[1.1, 1.2],
                [2.1, 2.2],
                [3.1, 3.2],
                [4.1, 4.2],
                [5.1, 5.2]])
    numpy.save('book_intro.npy', arr)
    ```

  - 包含多个列和一些 Numpy 文件的 JSON 文件

    ```json
    {
            "book_id": [101, 102, 103, 104, 105],
            "word_count": [13, 25, 7, 12, 34]
    }
    ```

    ```python
    {
        "book_id": [101, 102, 103, 104, 105],
        "word_count": [13, 25, 7, 12, 34]
    }
    ```

## 上传数据文件
 


上传数据文件到对象存储。

你可以将数据文件上传到 MinIO 或本地存储（仅适用于 Milvus 独立版）。

- 上传到 MinIO

将数据文件上传到配置文件 `milvus.yml` 中 [`minio.bucketName`](configure_minio.md#miniobucketName) 定义的存储桶中。

- 上传到本地存储

将数据文件复制到配置文件 `milvus.yml` 中 [`localStorage.path`](configure_localstorage.md#localStoragepath) 定义的目录中。


## 向 Milvus 中插入数据

将数据导入集合中。

- 对于基于行的文件

```python
from pymilvus import utility
tasks = utility.bulk_load(
    collection_name="book",
    is_row_based=True,
    files=["row_based_1.json", "row_based_2.json"]
)
```

- 对于基于列的文件

```python
from pymilvus import utility
tasks = utility.bulk_load(
    collection_name="book",
    is_row_based=False,
    files=["columns.json", "book_intro.npy"]
)
```

<table class="language-python">
	<thead>
	<tr>
		<th> 参数 </th>
		<th> 描述 </th>
	</tr>
	</thead>
	<tbody>
    <tr>
		<td> <code> collection_name </code> </td>
		<td> 要加载数据的集合的名称。</td>
	</tr>
    <tr>
		<td> <code> is_row_based </code> </td>
		<td> 用于指示文件是否基于行的布尔值。</td>
	</tr>
    <tr>
		<td> <code> files </code> </td>
		<td> 要加载到 Milvus 中的文件名称列表。</td>
	</tr>
	<tr>
		<td> <code> partition_name </code>（可选）</td>
		<td> 要插入数据的分区的名称。</td>
	</tr>
	</tbody>
</table>

## 检查导入任务状态

检查导入任务的状态。

```python
state = utility.get_bulk_load_state(tasks[0])
print(state.state_name())
print(state.ids())
print(state.infos())
```
状态代码及其对应的描述。

| 状态代码 | 状态                     | 描述                                             |
| ---------- | ----------------------- | -------------------------------------------------------------- |
| 0          | BulkLoadPending         | 任务在待处理列表中                        |
| 1          | BulkLoadFailed          | 任务失败，可以通过 `state.infos["failed_reason"]` 获取失败原因 |
| 2          | BulkLoadStarted         | 任务已发送到数据节点，即将执行         |
| 3          | BulkLoadDownloaded      | 数据文件已从 MinIO 下载到本地            |
| 4          | BulkLoadParsed          | 数据文件已验证和解析                           |
| 5          | BulkLoadPersisted       | 生成并持久化了新的段                   |
| 6          | BulkLoadCompleted       | 任务已完成                                         |


## 限制

|功能|最大限制|
|---|---|
|任务待处理列表的最大大小|32|
|数据文件的最大大小|4GB|

## 接下来做什么



- 了解 Milvus 的更多基本操作：
  - [索引向量字段](/userGuide/manage-indexes/index-vector-fields.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)
- 探索 Milvus SDK 的 API 参考：
  - [PyMilvus API 参考](/api-reference/pymilvus/v{{var.milvus_python_sdk_version}}/tutorial.html)
  - [Node.js API 参考](/api-reference/node/v{{var.milvus_node_sdk_version}}/tutorial.html)

