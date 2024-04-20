---
id: limitations.md
title: Milvus 限制
related_key: 限制
summary: 了解使用 Milvus 时的限制。
---

# Milvus 限制

Milvus 致力于提供最佳的向量数据库，以支持 AI 应用程序和向量相似性搜索。然而，团队正在不断努力引入更多功能和最佳实用工具以增强用户体验。本页面列出了用户在使用 Milvus 时可能遇到的一些已知限制。

## 资源名称长度

| 资源      | 限制  |
| ----------- | ----------- |
| Collection      | 255 个字符      |
| Field   | 255 个字符        |
| Index   | 255 个字符       |
| Partition   | 255 个字符      |

## 命名规则

资源名称可以包含数字、字母和下划线 (\_\)。资源名称必须以字母或下划线 (\_\) 开头。

## 资源数量

| 资源      | 限制 |
| ----------- | ----------- |
| Collection     | 65,536       |
| Connection / proxy   | 65,536        |

## 集合中的资源数量

| 资源     | 限制|
| ----------- | ----------- |
| Partition      | 4,096       |
| Shard   | 16        |
| Field   | 64        |
| Index   | 1        |
| Entity   | 无限制        |

## 字符串长度
| 数据类型      | 限制  |
| ----------- | ----------- |
| VARCHAR      | 65,535       |

## 向量维度
| 属性      | 限制 |
| ----------- | ----------- |
| Dimension      | 32,768       |

## RPC 的输入和输出
| 操作      | 限制 |
| ----------- | ----------- |
| Insert      | 512 MB    |
| Search   | 512 MB     |
| Query   | 512 MB      |

## 加载限制
在当前版本中，要加载的数据必须低于所有查询节点总内存资源的 90%，以保留执行引擎的内存资源。

## 搜索限制
| 向量      | 限制 |
| ----------- | ----------- |
| <code>topk</code>（要返回的最相似结果数量）   | 16,384       |
| <code>nq</code>（搜索请求的数量）    | 16,384       |

## 不同搜索类型上的索引限制

下表提供了不同索引类型在各种搜索行为上的支持概述。

|                                      | HNSW | DISKANN | FLAT | IVF_FLAT | IVF_SQ8 | IVF_PQ | SCANN | GPU_IFV_FLAT | GPU_IVF_PQ | GPU_CAGRA | GPU_BRUTE_FORCE | SPARSE_INVERTED_INDEX | SPARSE_WAND         | BIN_FLAT | BIN_IVF_FLAT |
|--------------------------------------|------|---------|------|----------|---------|--------|-------|--------------|------------|-----------|-----------------|-----------------------|---------------------|----------|--------------|
| 基本搜索                         | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | Yes          | Yes        | Yes       | Yes             | Yes                   | Yes                 | Yes      | Yes          |
| 分区搜索                     | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | Yes          | Yes        | Yes       | Yes             | Yes                   | Yes                 | Yes      | Yes          |
| 检索原始数据的基本搜索 | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | Yes          | Yes        | Yes       | Yes             | Yes                   | Yes                 | Yes      | Yes          |
| 带分页的基本搜索         | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | Yes          | Yes        | Yes       | Yes             | Yes                   | Yes                 | Yes      | Yes          |
| 过滤搜索                      | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | Yes          | Yes        | Yes       | Yes             | Yes                   | Yes                 | Yes      | Yes          |
| 范围搜索                         | Yes  | Yes     | Yes  | Yes      | Yes     | Yes    | Yes   | No           | No         | No        | No              | No                    | No                  | Yes      | Yes          |
| 分组搜索                      | Yes  | No      | Yes  | Yes      | No      | No     | No    | No           | No         | No        | No              | No                    | No                  | No       | No           |
| 使用迭代器的搜索                 | Yes  