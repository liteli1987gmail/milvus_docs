Attu管理索引
===

本主题介绍如何使用Attu管理索引。

创建索引
---------

以下示例使用欧几里得距离作为相似性度量标准，构建了一个具有`1024`个`nlist`值的IVF_FLAT索引。

1. 在**Collection**页面上点击**Schema**，切换到**Schema**选项卡页面，然后单击**CREATE INDEX**，弹出**Create Index**对话框。

2. 在**Create Index**对话框中，从**Index Type**下拉列表中选择**IVF_FLAT**，从**Metric Type**下拉列表中选择**L2**，并在`nlist`字段中输入`1024`。

3. （可选）打开**View Code**，跳转到**Code View**页面，你可以选择以Python或Node.js查看代码。

4. 单击**Create**来创建索引。

如果创建成功，你创建的索引类型将出现在矢量字段的**Index Type**列中。

[![创建索引](https://milvus.io/static/bf8b6c74d9a473acd952400a4e02e380/1263b/insight_index1.png "创建索引")](https://milvus.io/static/bf8b6c74d9a473acd952400a4e02e380/bbbf7/insight_index1.png)

创建一个索引。

[![索引类型](https://milvus.io/static/e1a0f6d081682f4c7e2d0b688eff96ac/1263b/insight_index2.png "索引类型")](https://milvus.io/static/e1a0f6d081682f4c7e2d0b688eff96ac/bbbf7/insight_index2.png)

索引类型。

删除索引
--------

- 在**Index Type**列中单击**删除索引**对话框中的**垃圾桶**图标。

- 输入`delete`以确认删除，并单击**Delete**来删除索引。

如果删除成功，**Create Index**按钮将出现在**Index Type**列中。

[![删除索引](https://milvus.io/static/d198211cfd1ff848980a65fde0eea194/1263b/insight_index3.png "删除索引")](https://milvus.io/static/d198211cfd1ff848980a65fde0eea194/bbbf7/insight_index3.png)

删除索引。

