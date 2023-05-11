Attu查询数据
===

本主题介绍如何使用Attu查询数据。

使用高级过滤器查询数据
-------------------------

1. 单击要在其中查询数据的集合条目，打开相应的详细页面。

2. 在**Data Query**选项卡页面上，单击**Filter**图标，弹出**Advanced Filter**对话框。

3. 使用**Field Name**下拉列表、**Logic**下拉列表、**Value**字段和**AND**运算符指定复杂的查询条件，例如**color > 10 && color <20**。然后单击**Apply** Filter，以应用查询条件。

[![查询数据](https://milvus.io/static/9a70e9c53df9d2c7da3cf2df74e5444f/1263b/insight_query1.png "指定查询条件。")](https://milvus.io/static/9a70e9c53df9d2c7da3cf2df74e5444f/bbbf7/insight_query1.png)

指定查询条件。

3. 单击**Query**以检索与查询条件匹配的所有查询结果。

[![查询数据](https://milvus.io/static/07a80d3decf5d9bbabf71853c7745aeb/1263b/insight_query2.png "检索查询结果。")](https://milvus.io/static/07a80d3decf5d9bbabf71853c7745aeb/bbbf7/insight_query2.png)

检索查询结果。

使用时间旅行查询数据
---------------------------

TBD（暂未支持）

删除数据
---------

- 选中要删除的实体，然后单击**垃圾箱**图标。

- 在**删除实体**对话框中输入`delete`以确认删除。

- 单击**删除**以删除选定的实体。

[![删除数据](https://milvus.io/static/20425f2e0577fd8daed336c18d017303/1263b/insight_query3.png "删除选定的实体。")](https://milvus.io/static/20425f2e0577fd8daed336c18d017303/bbbf7/insight_query3.png)

删除选定的实体。

您可以执行查询以检索已删除的实体。 如果删除成功，将不会返回任何结果。

[![删除数据](https://milvus.io/static/5d4a93d61751eace142e8c535f537481/1263b/insight_query4.png "查询已删除的实体时不显示任何结果。")](https://milvus.io/static/5d4a93d61751eace142e8c535f537481/bbbf7/insight_query4.png)

查询已删除的实体时不显示任何结果。

