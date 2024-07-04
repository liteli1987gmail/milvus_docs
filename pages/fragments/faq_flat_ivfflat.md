


IVF_FLAT 索引将一个向量空间划分为 nlist 个簇。如果你保持 nlist 的默认值为 16384，Milvus 将比较目标向量与所有 16384 个簇的中心之间的距离，以获取 nprobe 个最近的簇。然后 Milvus 将比较目标向量与所选簇中的向量之间的距离，以获取最近的向量。与 IVF_FLAT 不同，FLAT 直接比较目标向量与每个向量之间的距离。
  
因此，当向量的总数大约等于 nlist 时，IVF_FLAT 和 FLAT 在所需计算和搜索性能方面的差异很小。但是，当向量的数量增长到 nlist 的两倍、三倍或 n 倍时，IVF_FLAT 索引开始显示出越来越大的优势。
  
有关更多信息，请参阅《如何在 Milvus 中选择索引》（How to Choose an Index in Milvus）。
