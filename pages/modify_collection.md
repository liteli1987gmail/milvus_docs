修改集合
====

本主题描述如何修改集合的属性，特别是生存时间（TTL）。

目前，TTL特性仅在Python中可用。

```
collection.set_properties(properties={"collection.ttl.seconds": 1800})

```

上面的示例将集合TTL更改为1800秒。

| Parameter | Description | Option |
| --- | --- | --- |
| Properties: collection.ttl.seconds | Collection time to live (TTL) is the expiration time of data in a collection. Expired data in the collection will be cleaned up and will not be involved in searches or queries. Specify TTL in the unit of seconds. | The value should be 0 or greater. The default value is 0, which means TTL is disabled. |

接下来是什么
------

* 学习更多Milvus的基本操作:
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
