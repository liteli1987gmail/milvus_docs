


# 安装 Milvus Python SDK

本文档介绍了如何安装 Milvus 的 Python SDK pymilvus。

当前版本的 Milvus 支持 Python、Node.js、GO 和 Java 的 SDK。

## 环境要求

- 需要 Python 3.7 或更高版本。
- 需要安装 Google protobuf。你可以使用命令 `pip3 install protobuf==3.20.0` 来安装。
- 需要安装 grpcio-tools。你可以使用命令 `pip3 install grpcio-tools` 来安装。

## 通过 pip 安装 PyMilvus

PyMilvus 可以在 [Python 包索引](https://pypi.org/project/pymilvus/) 上找到。

<div class="alert note">
建议安装与你安装的 Milvus 服务器版本匹配的 PyMilvus。更多信息，请参见 <a href="release_notes.md"> 发布说明 </a>。
</div>

```
$ python3 -m pip install pymilvus=={{var.milvus_python_sdk_real_version}}
```

## 验证安装

如果 PyMilvus 安装正确，运行以下命令时不会触发任何异常。

```
$ python3 -c "from pymilvus import Collection"
```

## 下一步操作
 


我安装了 PyMilvus 之后，你可以：

- 学习 Milvus 的基本操作：
    - [管理集合](/userGuide/manage-collections.md)
    - [管理分区](/userGuide/manage-partitions.md)
    - [插入、更新和删除数据](/userGuide/insert-update-delete.md)
    - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
    - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- 浏览 [PyMilvus API 参考文档](/api-reference/pymilvus/v{{var.milvus_python_sdk_version}}/About.md)

