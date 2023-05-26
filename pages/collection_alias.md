集合别名
====

本主题介绍了如何管理集合别名。 Milvus支持为集合指定唯一别名。

一个集合别名是全局唯一的，因此不能将相同的别名分配给不同的集合。但是，您可以将多个别名分配给一个集合。

以下示例基于别名`publication`。

创建集合别名
------

指定集合的别名。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import utility
utility.create_alias(
  collection_name = "book",
  alias = "publication"
)

```

```bash
await milvusClient.createAlias({
  collection_name: "book",
  alias: "publication",
});

```

```bash
// This function is under active development on the GO client.

```

```bash
milvusClient.createAlias(
  CreateAliasParam.newBuilder()
    .withCollectionName("book")
    .withAlias("publication")
    .build()
);

```

```bash
create alias -c book -a publication

```

```bash
curl -X 'POST' 
  'http://localhost:9091/api/v1/alias' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "alias":"publication"
  }'

```

```bash
# Output:
{}

```
以下是每个表格的中文翻译：

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要创建别名的集合的名称。|
| `alias` | 要创建的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要创建别名的集合的名称。|
| `alias` | 要创建的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要创建别名的集合的名称。|
| `Alias` | 要创建的集合别名。|

| 选项 | 描述 |
| --- | --- |
| `-c` | 要创建别名的集合的名称。|
| `-a` | 要创建的集合别名。|
| `-A` (可选) | 转移到指定集合别名的标志。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要创建别名的集合的名称。|
| `alias` | 要创建的集合别名。|

删除集合别名
------

删除指定的别名。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import utility
utility.drop_alias(alias = "publication")

```

```bash
await milvusClient.dropAlias({
  alias: "publication",
});

```

```bash
// This function is under active development on the GO client.

```

```bash
milvusClient.dropAlias(
  DropAliasParam.newBuilder()
    .withAlias("publication")
    .build()
);

```

```bash
delete alias -a publication

```

```bash
curl -X 'DELETE' 
  'http://localhost:9091/api/v1/alias' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "alias":"publication"
  }'

```

```bash
# Output:
{}

```
以下是每个表格的中文翻译：

| 参数 | 描述 |
| --- | --- |
| `alias` | 要删除的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `alias` | 要删除的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `Alias` | 要删除的集合别名。|

| 选项 | 描述 |
| --- | --- |
| `-a` | 要删除的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `alias` | 要删除的集合别名。|

修改集合别名
------

将现有别名更改为其他集合。以下示例基于别名`publication`最初是为另一个集合创建的情况。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```bash
from pymilvus import utility
utility.alter_alias(
  collection_name = "book",
  alias = "publication"
)

```

```bash
await milvusClient.alterAlias({
  collection_name: "book",
  alias: "publication",
});

```

```bash
// This function is under active development on the GO client.

```

```bash
milvusClient.alterAlias(
  AlterAliasParam.newBuilder()
    .withCollectionName("book")
    .withAlias("publication")
    .build()
);

```

```bash
create alias -c book -A -a publication

```

```bash
curl -X 'PATCH' 
  'http://localhost:9091/api/v1/alias' 
  -H 'accept: application/json' 
  -H 'Content-Type: application/json' 
  -d '{
    "collection_name": "book",
    "alias":"publication"
  }'

```

Output:

```bash
{}

```


| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要更改别名所指向的集合名称。|
| `alias` | 要更改的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要更改别名所指向的集合名称。|
| `alias` | 要更改的集合别名。|

| 参数 | 描述 |
| --- | --- |
| `CollectionName` | 要更改别名所指向的集合名称。|
| `Alias` | 要更改的集合别名。|

| 选项 | 描述 |
| --- | --- |
| `-c` | 要更改别名所指向的集合名称。|
| `-a` | 要更改的集合别名。|
| `-A` | 将别名转移到指定集合的标志。|

| 参数 | 描述 |
| --- | --- |
| `collection_name` | 要更改别名所指向的集合名称。|
| `alias` | 要更改的集合别名。|
限制
--

| 功能 | 最大限制 |
| --- | --- |
| 别名长度 | 255 个字符 |

接下来做什么
------

* 学习更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
