修改集合
====

本主题描述如何修改集合的属性，特别是生存时间（TTL）。

目前，TTL特性仅在Python中可用。

```bash
collection.set_properties(properties={"collection.ttl.seconds": 1800})

```

上面的示例将集合TTL更改为1800秒。

| 参数 | 描述 | 选项 |
| --- | --- | --- |
| `Properties: collection.ttl.seconds` | 集合生存时间（TTL）是指集合中数据的过期时间。过期的数据将被清除，并不会参与搜索或查询。以秒为单位指定 TTL。 | 值应该为0或更大。默认值为0，表示TTL已禁用。|

接下来是什么
------

* 学习更多Milvus的基本操作:
	+ [将数据插入Milvus](insert_data.md)
	+ [创建分区](create_partition.md)
	+ [为向量建立索引](build_index.md)
	+ [进行向量搜索](search.md)
	+ [进行混合搜索](hybridsearch.md)
