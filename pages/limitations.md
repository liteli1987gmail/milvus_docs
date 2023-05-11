Milvus限制
========

Milvus致力于提供最佳的向量数据库以支持人工智能应用和向量相似性搜索。但是，团队正在不断努力引入更多功能和最佳工具来增强用户体验。本页列出了一些已知的限制，用户在使用Milvus时可能会遇到。

资源名称的长度
-------

| Resource | Limit |
| --- | --- |
| Collection | 255 characters |
| Field | 255 characters |
| Index | 255 characters |
| Partition | 255 characters |

命名规则
----

资源名称可以包含数字、字母和下划线（_）。资源名称必须以字母或下划线（_）开头。

资源数量
----

| Resource | Limit |
| --- | --- |
| Collection | 65,536 |
| Connection / proxy | 65,536 |

一个集合中资源的数量
----------

| Resource | Limit |
| --- | --- |
| Partition | 4,096 |
| Shard | 64 |
| Field | 64 |
| Index | 1 |
| Entity | unlimited |

字符串长度
-----

| Data type | Limit |
| --- | --- |
| VARCHAR | 65,535 |

向量的维度
-----

| Property | Limit |
| --- | --- |
| Dimension | 32,768 |

每个RPC的输入输出
----------

| Operation | Limit |
| --- | --- |
| Insert | 512 MB |
| Search | 512 MB |
| Query | 512 MB |

加载限制
----

在当前版本中，要加载的数据必须在所有查询节点的总内存资源的90％以下，以保留内存资源以供执行引擎使用。

搜索限制
----

| Vectors | Limit |
| --- | --- |
| `topk` (number of the most similar result to return) | 16,384 |
| `nq` (number of the search requests) | 16,384 |

