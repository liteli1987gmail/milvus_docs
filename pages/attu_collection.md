使用Attu管理集合
==========

本主题介绍如何使用Attu管理集合。

创建集合
----

- 单击左侧导航面板上的**集合**图标，然后单击**创建集合**。如下所示，出现**创建集合**对话框。

[![Create Collection dialog box](https://milvus.io/static/820a339231ee95b7dd95858ff87c2bcd/1263b/create_collection_dialog_box1.png "The Create Collection dialog box.")](https://milvus.io/static/820a339231ee95b7dd95858ff87c2bcd/5b631/create_collection_dialog_box1.png)

The Create Collection dialog box.

- 输入必要的信息。本示例创建一个名为`test`的集合，其中包含一个主键字段、一个矢量字段和一个标量字段。您可以根据需要添加标量字段。

[![Create Collection dialog box](https://milvus.io/static/8034b5bf6b119dca5bd96721e862669a/1263b/create_collection_dialog_box2.png "Enter required information.")](https://milvus.io/static/8034b5bf6b119dca5bd96721e862669a/7a7a9/create_collection_dialog_box2.png)

Enter required information.

- 单击**创建**以创建集合。

[![Create Collection dialog box](https://milvus.io/static/87395528793e3b499c4fff1f9a235d4a/1263b/create_collection_dialog_box3.png "Create a collection.")](https://milvus.io/static/87395528793e3b499c4fff1f9a235d4a/bbbf7/create_collection_dialog_box3.png)

Create a collection.

删除集合
----

- 在数据网格中选中要删除的集合。

- 单击**垃圾桶**图标，将出现如下所示的**删除集合**对话框。

- 键入`delete`以确认删除。

- 单击**删除**以删除集合。

Deleting a collection is irreversible.

[![Delete Collection dialog box](https://milvus.io/static/271a0065f334543490485d940d070c1c/1263b/delete_collection.png "Delete a collection.")](https://milvus.io/static/271a0065f334543490485d940d070c1c/bbbf7/delete_collection.png)

Delete a collection.

加载集合
----

- 将鼠标悬停在要加载的集合上，右侧出现**加载**图标。

[![Load Collection](https://milvus.io/static/2bf4ada96d66ee6e26da91c930013417/1263b/load_collection1.png "The load icon.")](https://milvus.io/static/2bf4ada96d66ee6e26da91c930013417/bbbf7/load_collection1.png)

The load icon.

- 单击**加载**图标，显示**加载集合**对话框。

- 在**加载集合**对话框中单击**加载**。

[![Load Collection](https://milvus.io/static/6e89c4b2d2f0f5e49c8776bb844a067a/1263b/load_collection2.png "Click load button.")](https://milvus.io/static/6e89c4b2d2f0f5e49c8776bb844a067a/bbbf7/load_collection2.png)

Click load button.

- 加载集合可能需要一段时间。如果成功，状态列中会显示“已加载以供搜索”。

[![Load Collection](https://milvus.io/static/8b6efabbb5ed8141cbf8dab9469b77a6/1263b/load_collection3.png "Load status.")](https://milvus.io/static/8b6efabbb5ed8141cbf8dab9469b77a6/bbbf7/load_collection3.png)

Load status.

发布集合
----

- 将鼠标悬停在要发布的集合上，右侧出现**发布**图标。

[![Release Collection](https://milvus.io/static/f5a2840e59ed852939a5c8234708bea4/1263b/release_collection1.png "The release icon.")](https://milvus.io/static/f5a2840e59ed852939a5c8234708bea4/bbbf7/release_collection1.png)

The release icon.

- 单击**发布**图标，出现**发布集合**对话框。

- 在**发布集合**对话框中单击**发布**。

- 如果成功，状态栏显示**未加载**。

[![Release Collection](https://milvus.io/static/25653b3f6d5999ff7539920ed3fdaa25/1263b/release_collection2.png "Release status.")](https://milvus.io/static/25653b3f6d5999ff7539920ed3fdaa25/bbbf7/release_collection2.png)

Release status.

查看集合的模式
-------

- 单击要查看模式的集合名称，然后会显示相应的详细页面。

- 在详细页面上单击**模式**，其中列出了所有字段的信息。

模式的属性包括：

* 字段名称

* 字段类型

* 维数（仅适用于向量字段）

* 索引类型（仅适用于向量字段）

* 索引参数（仅适用于向量字段）

* 集合描述

[![Collection Schema](https://milvus.io/static/15dee819afe6c6de3b7a0776abcc1df8/1263b/collection_schema.png "View collection schema.")](https://milvus.io/static/15dee819afe6c6de3b7a0776abcc1df8/bbbf7/collection_schema.png)

View collection schema.

