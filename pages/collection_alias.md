集合别名
====

本主题介绍了如何管理集合别名。 Milvus支持为集合指定唯一别名。

A collection alias is globally unique, hence you cannot assign the same alias to different collections. However, you can assign multiple aliases to one collection.

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

```
from pymilvus import utility
utility.create_alias(
  collection_name = "book",
  alias = "publication"
)

```

```
await milvusClient.createAlias({
  collection_name: "book",
  alias: "publication",
});

```

```
// This function is under active development on the GO client.

```

```
milvusClient.createAlias(
  CreateAliasParam.newBuilder()
    .withCollectionName("book")
    .withAlias("publication")
    .build()
);

```

```
create alias -c book -a publication

```

```
curl -X 'POST' \
  'http://localhost:9091/api/v1/alias' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "alias":"publication"
  }'

```

```
# Output:
{}

```

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to create alias on. |
| `alias` | Collection alias to create. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to create alias on. |
| `alias` | Collection alias to create. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to create alias on. |
| `Alias` | Collection alias to create. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to create alias on. |
| -a | Collection alias to create. |
| -A (Optional) | Flag to transfer the alias to a specified collection. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to create alias on. |
| `alias` | Collection alias to create. |

删除集合别名
------

删除指定的别名。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import utility
utility.drop_alias(alias = "publication")

```

```
await milvusClient.dropAlias({
  alias: "publication",
});

```

```
// This function is under active development on the GO client.

```

```
milvusClient.dropAlias(
  DropAliasParam.newBuilder()
    .withAlias("publication")
    .build()
);

```

```
delete alias -a publication

```

```
curl -X 'DELETE' \
  'http://localhost:9091/api/v1/alias' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "alias":"publication"
  }'

```

```
# Output:
{}

```

| Parameter | Description |
| --- | --- |
| `alias` | Collection alias to drop. |

| Parameter | Description |
| --- | --- |
| `alias` | Collection alias to drop. |

| Parameter | Description |
| --- | --- |
| `Alias` | Collection alias to drop. |

| Option | Description |
| --- | --- |
| -a | Collection alias to drop. |

| Parameter | Description |
| --- | --- |
| `alias` | Collection alias to drop. |

修改集合别名
------

将现有别名更改为其他集合。以下示例基于别名`publication`最初是为另一个集合创建的情况。

[Python](#python) 
[Java](#java)
[GO](#go)
[Node.js](#javascript)
[CLI](#shell)
[Curl](#curl)

```
from pymilvus import utility
utility.alter_alias(
  collection_name = "book",
  alias = "publication"
)

```

```
await milvusClient.alterAlias({
  collection_name: "book",
  alias: "publication",
});

```

```
// This function is under active development on the GO client.

```

```
milvusClient.alterAlias(
  AlterAliasParam.newBuilder()
    .withCollectionName("book")
    .withAlias("publication")
    .build()
);

```

```
create alias -c book -A -a publication

```

```
curl -X 'PATCH' \
  'http://localhost:9091/api/v1/alias' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collection_name": "book",
    "alias":"publication"
  }'

```

Output:

```
{}

```

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to alter alias to. |
| `alias` | Collection alias to alter. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to alter alias to. |
| `alias` | Collection alias to alter. |

| Parameter | Description |
| --- | --- |
| `CollectionName` | Name of the collection to alter alias to. |
| `Alias` | Collection alias to alter. |

| Option | Description |
| --- | --- |
| -c | Name of the collection to alter alias to. |
| -a | Collection alias to alter. |
| -A | Flag to transfer the alias to a specified collection. |

| Parameter | Description |
| --- | --- |
| `collection_name` | Name of the collection to alter alias to. |
| `alias` | Collection alias to alter. |

限制
--

| Feature | Maximum limit |
| --- | --- |
| Length of an alias | 255 characters |

接下来做什么
------

* 学习更多Milvus的基本操作：
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量构建索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
