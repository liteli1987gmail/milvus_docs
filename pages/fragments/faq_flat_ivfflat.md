IVF_FLAT索引将向量空间划分为<code>nlist</code>个簇。如果保持<code>nlist</code>的默认值为16384，Milvus会比较目标向量和所有16384个簇的中心之间的距离，以获得<code>nprobe</code>个最近簇。然后，Milvus会比较目标向量和所选簇中的向量之间的距离，以获得最近向量。与IVF_FLAT不同，FLAT直接比较目标向量和每个向量之间的距离。

因此，当向量的总数大约等于<code>nlist</code>时，IVF_FLAT和FLAT在所需的计算方式和搜索性能上几乎没有差异。但是，随着向量数量增长到<code>nlist</code>的两倍、三倍或n倍，IVF_FLAT索引开始显示出越来越大的优势。

有关更多信息，请参阅<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">如何在Milvus中选择索引</a>。