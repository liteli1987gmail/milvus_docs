---
id: import_data.md
related_key: bulk load
summary: Learn how to bulk load data in Milvus.
title: Import Data
---

# 导入数据

本主题描述了如何通过批量加载的方式在 Milvus 中导入数据。

通常，将大量实体批量插入 Milvus 的方法会导致客户端、代理、Pulsar 和数据节点之间的大量网络传输。为了避免这种情况，Milvus 2.1 支持通过批量加载从文件加载数据。您可以通过几行代码将大量数据导入集合，并为整个批次的实体赋予原子性。

您还可以使用 [MilvusDM](migrate_overview.md) 迁移数据到 Milvus，这是一个专门为与 Milvus 导入和导出数据而设计的开源工具。

<div class="alert note">

本页面上的代码片段使用新的 <a href="https://milvus.io/api-reference/pymilvus/v2.4.x/About.md">MilvusClient</a>（Python）与 Milvus 交互。未来更新中将发布其他语言的新 MilvusClient SDK。

</div>

## 准备数据文件

您可以基于行或基于列准备数据文件。

- 基于行的数据文件

基于行的数据文件是一个包含多行的 JSON 文件。根键必须是 "rows"。文件名可以任意指定。

```json
{
  "rows": [
    { "book_id": 101, "word_count": 13, "book_intro": [1.1, 1.2] },
    { "book_id": 102, "word_count": 25, "book_intro": [2.1, 2.2] },
    { "book_id": 103, "word_count": 7, "book_intro": [3.1, 3.2] },
    { "book_id": 104, "word_count": 12, "book_intro": [4.1, 4.2] },
    { "book_id": 105, "word_count": 34, "book_intro": [5.1, 5.2] }
  ]
}
```

- 基于列的数据文件

基于列的数据文件可以是一个包含多列的 JSON 文件，几个 Numpy 文件，每个文件包含一个单独的列，或者是一个包含多列和一些 Numpy 文件的 JSON 文件。

- 包含多列的 JSON 文件

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

- 包含多列和一些 Numpy 文件的 JSON 文件。

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

将数据文件上传到对象存储。

您可以将数据文件上传到 MinIO 或本地存储（仅在 Milvus Standalone 中可用）。

- 上传到 MinIO

将数据文件上传到配置文件 `milvus.yml` 中由 [`minio.bucketName`](configure_minio.md#miniobucketName) 定义的存储桶。

- 上传到本地存储

将数据文件复制到配置文件 `milvus.yml` 中由 [`localStorage.path`](configure_localstorage.md#localStoragepath) 定义的目录。

## 将数据插入 Milvus

将数据导入集合。

- 对于基于行的文件

```python
from pymilvus import utility
tasks = utility.bulk_load(
    collection_name="book",
    is_row_based=True,
    files=["row_based_1.json", "row_based_2.json"]
)
```

- For column-based files

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
		<th>Parameter</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
    <tr>
		<td><code>collection_name</code></td>
		<td>Name of the collection to load data into.</td>
	</tr>
    <tr>
		<td><code>is_row_based</code></td>
		<td>Boolean value to indicate if the file is row-based.</td>
	</tr>
    <tr>
		<td><code>files</code></td>
		<td>List of file names to load into Milvus.</td>
	</tr>
	<tr>
		<td><code>partition_name</code> (optional)</td>
		<td>Name of the partition to insert data into.</td>
	</tr>
	</tbody>
</table>

## Check the import task state

Check the state of the import task.

```python
state = utility.get_bulk_load_state(tasks[0])
print(state.state_name())
print(state.ids())
print(state.infos())
```

The state codes and their corresponding descriptions.

| State code | State              | Description                                                            |
| ---------- | ------------------ | ---------------------------------------------------------------------- |
| 0          | BulkLoadPending    | Task is in pending list                                                |
| 1          | BulkLoadFailed     | Task failed, get the failed reason with `state.infos["failed_reason"]` |
| 2          | BulkLoadStarted    | Task is dispatched to data node, gonna to be executed                  |
| 3          | BulkLoadDownloaded | Data file has been downloaded from MinIO to local                      |
| 4          | BulkLoadParsed     | Data file has been validated and parsed                                |
| 5          | BulkLoadPersisted  | New segments have been generated and persisted                         |
| 6          | BulkLoadCompleted  | Task completed                                                         |

## Limits

| Feature                       | Maximum limit |
| ----------------------------- | ------------- |
| Max size of task pending list | 32            |
| Max size of a data file       | 4GB           |

## What's next

- Learn more basic operations of Milvus:
  - [Index Vetor Fields](index-vector-fields.md)
  - [Single-Vector Search](single-vector-search.md)
  - [Multi-Vector Search](multi-vector-search.md)
- Explore API references for Milvus SDKs:
  - [PyMilvus API reference](/api-reference/pymilvus/v{{var.milvus_python_sdk_version}}/tutorial.html)
  - [Node.js API reference](/api-reference/node/v{{var.milvus_node_sdk_version}}/tutorial.html)
