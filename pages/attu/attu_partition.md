使用 Attu 管理分区
============

本主题介绍如何使用 Attu 管理分区。

在创建集合后，Milvus 会自动创建一个分区，该分区无法删除。

创建分区
----

- 在**Collection**页面上，单击**Partitions**选项卡。

- 在**Partitions**选项卡页面上，单击**Create Partition**，如下所示出现**Create Partition**对话框。

- 在**Create Partition**对话框中，在**Name**字段中输入新的分区名称。

- 单击**Create**以创建一个分区。

[![Create Partition](https://milvus.io/static/f5b2fc2a0cd00152d7e5dd4312f4f2a4/1263b/insight_partition1.png "Create a partition.")](https://milvus.io/static/f5b2fc2a0cd00152d7e5dd4312f4f2a4/bbbf7/insight_partition1.png)

Create a partition.

如果成功，则新的分区将出现在**Partitions**选项卡页面上。

[![Create Partition](https://milvus.io/static/2537005e0572a32ad44182a9694e2f55/1263b/insight_partition2.png "The newly created partition.")](https://milvus.io/static/2537005e0572a32ad44182a9694e2f55/bbbf7/insight_partition2.png)

The newly created partition.

选择默认分区或新创建的分区，根据需要存储导入的数据。

删除分区
----

- 选中要删除的分区。

- 单击**垃圾桶**图标，出现如下所示的**删除分区**对话框。

- 输入`delete`以确认删除操作。

- 单击**删除**以删除分区。

[![Delete Partition](https://milvus.io/static/1e1fea3d2be181356884690006c1ca3a/1263b/insight_partition3.png "Delete a partition.")](https://milvus.io/static/1e1fea3d2be181356884690006c1ca3a/bbbf7/insight_partition3.png)

Delete a partition.

