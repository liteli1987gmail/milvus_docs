使用Attu管理数据
==========

本主题介绍了如何使用Attu管理数据。

导入数据
----

本示例导入了20000行数据。导入数据会将数据追加而不是覆盖数据。

- 在**集合**页面上，单击**导入数据**。会显示**导入数据**对话框，如下图所示。

[![Import Data](https://milvus.io/static/f532039c7c6aa19142de01e1798df019/1263b/insight_data1.png "The Import Data dialogue box.")](https://milvus.io/static/f532039c7c6aa19142de01e1798df019/bbbf7/insight_data1.png)

The Import Data dialogue box.

- 在**集合**下拉列表中选择要导入数据的集合。

- 在**分区**下拉列表中选择要导入数据的分区。

- 单击**选择CSV文件**并选择CSV文件。

 Ensure that the CSV file meets the following criteria:
* 列名与模式中指定的字段名相同；

* 文件大小小于150MB且行数少于100,000行。

- 选择合法的CSV文件后，点击**下一步**。

[![Import Data](https://milvus.io/static/b57bd5541ed5c630859adc2c4a01880e/1263b/insight_data2.png "Click Next.")](https://milvus.io/static/b57bd5541ed5c630859adc2c4a01880e/bbbf7/insight_data2.png)

Click Next.

- 在新的对话框中，可以通过单击下拉列表中的相应单元格来匹配字段名称。

We recommend making the headers (column names) as the first row in your CSV file.

[![Import Data](https://milvus.io/static/505c0b8699b7274f83df0183e8fdb8f5/1263b/insight_data3.png "Match the field names.")](https://milvus.io/static/505c0b8699b7274f83df0183e8fdb8f5/bbbf7/insight_data3.png)

Match the field names.

- 确认与字段名称对应的列名称后，点击**导入数据**将CSV文件导入Milvus。导入数据可能需要一些时间。

[![Import Data](https://milvus.io/static/466c21ec85e4f4370639155f0aa23bf3/1263b/insight_data4.png "Import Data.")](https://milvus.io/static/466c21ec85e4f4370639155f0aa23bf3/bbbf7/insight_data4.png)

Import Data.

- 如果导入成功，则实体计数列中的行计数状态会更新到集合中。在相应的分区选项卡页面上，导入数据的分区中的实体计数列中的行计数状态会更新。实体计数的更新可能需要一些时间。

[![Import Data](https://milvus.io/static/61f6080afabe59186a1067379e5aede4/1263b/insight_data5.png "Data import is successful.")](https://milvus.io/static/61f6080afabe59186a1067379e5aede4/bbbf7/insight_data5.png)

Data import is successful.

导出数据
----

- 在**集合**页面上单击**数据查询**。在**数据查询**选项卡页面上，输入查询条件并单击**查询**，以检索所有与您的查询条件匹配的查询结果。

- 单击**下载**图标，以将查询结果下载为CSV文件。

[![Export Data](https://milvus.io/static/92e1c840c5f9b0a368d3a847d8f85210/1263b/insight_data6.png "Click the Download icon.")](https://milvus.io/static/92e1c840c5f9b0a368d3a847d8f85210/bbbf7/insight_data6.png)

Click the Download icon.

