---
id: scalar_index.md
related_key: scalar_index
summary: Scalar index in Milvus.
title: Scalar Index
---

# 标量索引

Milvus 支持结合标量和向量字段进行过滤搜索。为了提高涉及标量字段的搜索效率，Milvus 从版本 2.1.0 开始引入了标量字段索引。本文提供了 Milvus 中标量字段索引的概述，帮助您理解其重要性和实现方式。

## 概述

在 Milvus 中进行向量相似性搜索后，您可以使用逻辑运算符将标量字段组织成布尔表达式。

当 Milvus 接收到带有此类布尔表达式的搜索请求时，它会将布尔表达式解析成抽象语法树（AST），以生成属性过滤的物理计划。然后，Milvus 在每个段上应用物理计划，生成一个 [位集](bitset.md) 作为过滤结果，并将结果作为向量搜索参数包含在内，以缩小搜索范围。在这种情况下，向量搜索的速度在很大程度上依赖于属性过滤的速度。

![段中的属性过滤](/scalar_index.png)

标量字段索引是一种通过以特定方式排序标量字段值来确保属性过滤速度的方法，以加速信息检索。

## 标量字段索引算法

Milvus 的目标是通过其标量字段索引算法实现低内存使用、高过滤效率和短加载时间。这些算法分为两种主要类型：[默认索引](#default-indexing)和[倒排索引](#inverted-indexing)。

### 默认索引

Milvus 会自动为标量字段基于其数据类型创建一个默认索引，无需手动干预。这种默认索引适用于前缀匹配查询和频繁检索场景。

下表列出了 Milvus 支持的数据类型及其相应的默认索引算法。

| 数据类型 | 默认索引算法 |
| -------- | ------------ |
| VARCHAR  | MARISA-trie  |
| INT8     | STL sort     |
| INT16    | STL sort     |
| INT32    | STL sort     |
| INT64    | STL sort     |
| FLOAT    | STL sort     |
| DOUBLE   | STL sort     |

### 倒排索引

倒排索引是一种更灵活的方法，您可以通过指定索引参数手动为标量字段创建一个倒排索引。这种方法适用于各种场景，包括点查询、模式匹配查询、全文搜索、JSON 搜索、布尔搜索，甚至是前缀匹配查询。

倒排索引由一个词项字典和一个倒排列表组成。词项字典包含所有按字母顺序排序的标记化单词，而倒排列表包含每个单词出现的文档列表。这种结构通过减少与蛮力搜索相比的时间复杂度，使点查询和范围查询等操作非常高效。

![倒排索引图](/scalar_index_inverted.png)

使用倒排索引的优势在以下操作中尤为明显：

- **点查询**：例如，当搜索包含单词 **Milvus** 的文档时，过程首先检查词项字典中是否存在 **Milvus**。如果未找到，则没有文档包含该单词。但是，如果找到了，就会检索与 **Milvus** 相关联的倒排列表，指示包含该单词的文档。这种方法比通过百万文档的蛮力搜索要高效得多，因为排序的词项字典显著降低了查找单词 **Milvus** 的时间复杂度。
- **范围查询**：范围查询的效率，例如查找单词按字母顺序大于 **very** 的文档，也通过排序的词项字典得到了提高。这种方法比蛮力搜索更高效，提供更快、更准确的结果。

## 性能建议

为了充分利用 Milvus 在标量字段索引方面的能力，并在向量相似性搜索中发挥其潜力，您可能需要一个模型来根据您拥有的数据估计所需的内存大小。

下表列出了 Milvus 支持的所有数据类型的估计函数。

- 数字字段

  | 数据类型 | 内存估计函数 (MB)                 |
  | -------- | --------------------------------- |
  | INT8     | numOfRows \* **12** / 1024 / 1024 |
  | INT16    | numOfRows \* **12** / 1024 / 1024 |
  | INT32    | numOfRows \* **12** / 1024 / 1024 |
  | INT64    | numOfRows \* **24** / 1024 / 1024 |
  | FLOAT32  | numOfRows \* **12** / 1024 / 1024 |
  | DOUBLE   | numOfRows \* **24** / 1024 / 1024 |

- String fields

  | String length | Memory estimation function (MB)                |
  | ------------- | ---------------------------------------------- |
  | (0, 8]        | numOfRows \* **128** / 1024 / 1024             |
  | (8, 16]       | numOfRows \* **144** / 1024 / 1024             |
  | (16, 32]      | numOfRows \* **160** / 1024 / 1024             |
  | (32, 64]      | numOfRows \* **192** / 1024 / 1024             |
  | (64, 128]     | numOfRows \* **256** / 1024 / 1024             |
  | (128, 65535]  | numOfRows _ \*\*strLen _ 1.5\*\* / 1024 / 1024 |

## What's next

- To index a scalar field, read [Build an Index on Scalars](index-scalar-fields.md).
- To learn more about the related terms and rules mentioned above, read

  - [Bitset](bitset.md)
  - [Multi-Vector search](multi-vector-search.md)
  - [Boolean expression rules](boolean.md)
  - [Supported data types](schema.md#Supported-data-type)
