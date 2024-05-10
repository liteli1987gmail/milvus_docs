---
id: bitset.md
summary: Learn about bitsets in Milvus.
title: Bitset
---

# 位集（Bitset）

本文介绍了位集机制，该机制有助于在 Milvus 中实现关键功能，如属性过滤和[删除操作](https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md)。

## 概述

位集是一组位。位是只有两种可能值的元素，最典型的是 `0` 和 `1`，或者是布尔值 `true` 和 `false`。在 Milvus 中，位集是包含位编号 `0` 和 `1` 的数组，与使用整数、浮点数或字符相比，它可以用来紧凑且高效地表示某些数据。位编号默认为 `0`，只有在满足某些条件时才设置为 `1`。

位集上的操作是使用[布尔逻辑](boolean.md)进行的，在布尔逻辑中，输出值要么是有效的，要么是无效的，分别用 `1` 和 `0` 表示。例如，可以使用[逻辑运算符](https://milvus.io/docs/v2.1.x/boolean.md#Logical-operators) `AND` 来比较两个位集，基于相同索引位置的项，并生成一个新的位集来显示结果。如果两个位置的项相同，则在新的位集中该位置将写入 `1`；如果它们不同，则写入 `0`。

## 实现

位集是一个简单但强大的机制，有助于 Milvus 执行属性过滤、数据删除和带有时间旅行的查询。

### 属性过滤

由于位集只包含两种可能的值，因此它们非常适合存储[属性过滤](https://milvus.io/docs/v2.1.x/hybridsearch.md)的结果。符合给定属性过滤器要求的数据用 `1` 标记。

### 数据删除

位集是存储段中某行是否已删除的信息的紧凑方式。在搜索或查询期间，用 `1` 标记的已删除实体将[不会被计算](https://milvus.io/blog/deleting-data-in-milvus.md)。

## 示例

这里我们提供三个示例，说明 Milvus 如何使用位集，引用了上面讨论的三个主要位集实现。在所有三个案例中，有一个包含 8 个实体的段，然后按照下面显示的顺序发生一系列数据操作语言（DML）事件。

- 当时间戳 `ts` 等于 100 时，插入了四个实体，它们的 `primary_key` 分别是 [1, 2, 3, 4]。
- 当时间戳 `ts` 等于 200 时，插入了剩下的四个实体，它们的 `primary_key` 分别是 [5, 6, 7, 8]。
- 当时间戳 `ts` 等于 300 时，删除了 `primary_key` 为 [7, 8] 的实体。
- 只有 `primary_key` 为 [1, 3, 5, 7] 的实体满足属性过滤条件。

![DML 事件的顺序](/public/assets/bitset_0.svg "DML 事件的顺序。")

### 案例一

在这种情况下，用户将 `time_travel` 设置为 150，这意味着用户对满足 `ts = 150` 的数据进行查询。位集生成过程由图 1 说明。

在初始过滤阶段，`filter_bitset` 应该是 `[1, 0, 1, 0, 1, 0, 1, 0]`，其中实体 [1, 3, 5, 7] 被标记为 `1`，因为它们是有效的过滤结果。

然而，当 `ts` 等于 150 时，实体 [4, 5, 6, 7] 尚未插入向量数据库。因此，无论过滤条件如何，这四个实体都应该被标记为 0。现在位集结果应该是 `[1, 0, 1, 0, 0, 0, 0, 0]`。

如在[数据删除](#data-deletion)中讨论的，用 `1` 标记的实体在搜索或查询期间将被忽略。位集结果现在需要翻转，以便与删除位图结合，这给我们提供了 `[0, 1, 0, 1, 1, 1, 1, 1]`。

至于删除位集 `del_bitset`，初始值应该是 `[0, 0, 0, 0, 0, 0, 1, 1]`。然而，实体 7 和 8 直到 `ts` 是 300 才被删除。因此，当 `ts` 是 150 时，实体 7 和 8 仍然有效。

As for the deletion bitset `del_bitset`, the initial value should be `[0, 0, 0, 0, 0, 0, 1, 1]`. However, entities 7 and 8 are not deleted until `ts` is 300. Therefore, when `ts` is 150, entities 7 and 8 are still valid. As a result, the `del_bitset` value after Time Travel is `[0, 0, 0, 0, 0, 0, 0, 0]`.

Now we have two bitsets after Time Travel and attribute filtering: `filter_bitset` `[0, 1, 0, 1, 1, 1, 1, 1]` and `del_bitset` `[0, 0, 0, 0, 0, 0, 0, 0]`. Combine these two bitsets with the `OR` binary logic operator. The ultimate value of result_bitset is `[0, 1, 0, 1, 1, 1, 1, 1]`, meaning only entities 1 and 3 will be computed in the following search or query stage.

![Figure 1. Search with Time Travel = 150.](/public/assets/bitset_1.jpg "Figure 1. Search with Time Travel = 150.")

### Case two

In this case, the user sets `time_travel` as 250. The bitset generation process is illustrated by Figure 2.

Like in case one, the initial `filter_bitset` is `[1, 0, 1, 0, 1, 0, 1, 0]`.

All entities are in the vector database when `ts` = 250. Therefore, the `filter_bitset` stays the same when we factor in the timestamp. Again, we need to flip the result and get `[0, 1, 0, 1, 0, 1, 0, 1]`.

As for the deletion bitset `del_bitset`, the initial value is `[0, 0, 0, 0, 0, 0, 1, 1]`. However, entities 7 and 8 were not deleted until `ts` is 300. Therefore, when `ts` is 250, entities 7 and 8 are still valid. As a result, the `del_bitset` after Time Travel is `[0, 0, 0, 0, 0, 0, 0, 0]`.

Now we have two bitsets after Time Travel and attribute filtering: `filter_bitset` `[0, 1, 0, 1, 0, 1, 0, 1]` and `del_bitset` `[0, 0, 0, 0, 0, 0, 0, 0]`. Combine these two bitsets with the `OR` binary logic operator. The result_bitset is `[0, 1, 0, 1, 0, 1, 0, 1]`. That is to say, only entites [1, 3, 5, 7] will be computed in the following search or query stage.

![Figure 2. Search with Time Travel = 250.](../../../assets/bitset_2.jpg "Figure 2. Search with Time Travel = 250.")

### Case three

In this case, the user sets `time_travel` as 350. The bitset generation process is illustrated by Figure 3.

As with previous cases, the initial `filter_bitset` is `[0, 1, 0, 1, 0, 1, 0, 1]`.

All entities are in the vector database when `ts`= 350. Therefore, the final, flipped `filter_bitset` is `[0, 1, 0, 1, 0, 1, 0, 1]`, the same as in case two.

As for the deletion bitset `del_bitset`, since entities 7 and 8 have already been deleted when `ts = 350`, therefore, the result of `del_bitset` is `[0, 0, 0, 0, 0, 0, 1, 1]`.

Now we have two bitsets after Time Travel and attribute filtering: `filter_bitset` `[0, 1, 0, 1, 0, 1, 0, 1]` and `del_bitset` `[0, 0, 0, 0, 0, 0, 1, 1]`. Combine these two bitsets with the `OR` binary logic operator. The ultimate `result_bitset` is `[0, 1, 0, 1, 0, 1, 1, 1]`. That is to say, only entities [1, 3, 5] will be computed in the following search or query stage.

![Figure 3. Search with Time Travel = 350.](/public/assets/bitset_3.jpg "Figure 3. Search with Time Travel = 350.")

## What's next

Now that you know how bitsets work in Milvus, you might also want to:

- Learn how to [use strings to filter](https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md) your search results, or refer to [Hybrid Search](https://milvus.io/docs/hybridsearch.md) on our docs.
- Understand [how data are processed](https://milvus.io/docs/v2.1.x/data_processing.md) in Milvus.
