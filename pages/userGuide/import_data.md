---
title: 导入数据
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
  "rows":[
    {"book_id": 101, "word_count": 13, "book_intro": [1.1, 1.2]},
    {"book_id": 102, "word_count": 25, "book_intro": [2.1, 2.2]},
    {"book_id": 103, "word_count": 7, "book_intro": [3.1, 3.2]},
    {"book_id": 104, "word_count": 12, "book_intro": [4.1, 4.2]},
    {"book_id": 105, "word_count": 34, "book_intro": [5.1, 5.2]},
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
    is_row_based