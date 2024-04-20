---
title: Spark-Milvus 连接器用户指南

---

# Spark-Milvus 连接器用户指南

## 概述

Spark-Milvus 连接器（https://github.com/zilliztech/spark-milvus）提供了 Apache Spark 和 Milvus 之间的无缝集成，结合了 Apache Spark 的数据处理和机器学习特性以及 Milvus 的向量数据存储和搜索能力。这种集成支持各种有趣的应用，包括：

- 大批量高效地将向量数据加载到 Milvus 中，
- 在 Milvus 与其他存储系统或数据库之间移动数据，
- 利用 Spark MLlib 和其他 AI 工具分析 Milvus 中的数据。

## 快速开始

### 准备工作

Spark-Milvus 连接器支持 Scala 和 Python 编程语言。用户可以使用 **Pyspark** 或 **Spark-shell** 来使用它。要运行此演示，请按照以下步骤设置包含 Spark-Milvus 连接器依赖项的 Spark 环境：

1. 安装 Apache Spark（版本 >= 3.3.0）

    您可以参考 [官方文档](https://spark.apache.org/docs/latest/) 安装 Apache Spark。

2. 下载 **spark-milvus** jar 文件。

    ```
    wget https://github.com/zilliztech/spark-milvus/raw/1.0.0-SNAPSHOT/output/spark-milvus-1.0.0-SNAPSHOT.jar
    ```

3. 启动 Spark 运行时，并把 **spark-milvus** jar 作为依赖项之一。

    要启动带有 Spark-Milvus 连接器的 Spark 运行时，请将下载的 **spark-milvus** jar 作为依赖项添加到命令中。

    - **pyspark**

        ```
        ./bin/pyspark --jars spark-milvus-1.0.0-SNAPSHOT.jar
        ```

    - **spark-shell**

        ```
        ./bin/spark-shell --jars spark-milvus-1.0.0-SNAPSHOT.jar
        ```

### 示例演示

在这个示例中，我们创建了一个包含向量数据的样本 Spark DataFrame，并通过 Spark-Milvus 连接器将其写入 Milvus。将根据模式和指定的选项自动在 Milvus 中创建一个集合。

<div class="multipleCode">
  <a href="#python">Python </a>
  <a href="#scala">Scala</a>
</div>

```python
from pyspark.sql import SparkSession

columns = ["id", "text", "vec"]
data = [(1, "a", [1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0]),
    (2, "b", [1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0]),
    (3, "c", [1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0]),
    (4, "d", [1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0])]
sample_df = spark.sparkContext.parallelize(data).toDF(columns)
sample_df.write \
    .mode("append") \
    .option("milvus.host", "localhost") \
    .option("milvus.port", "19530") \
    .option("milvus.collection.name", "hello_spark_milvus") \
    .option("milvus.collection.vectorField", "vec") \
    .option("milvus.collection.vectorDim", "8") \
    .option("milvus.collection.primaryKeyField", "id") \
    .format("milvus") \
    .save()
```

```scala
import org.apache.spark.sql.{SaveMode, SparkSession}

object Hello extends App {

  val spark = SparkSession.builder().master("local[*]")
    .appName("HelloSparkMilvus")
    .getOrCreate()

  import spark.implicits._

  // 创建 DataFrame
  val sampleDF = Seq(
    (1, "a", Seq(1.0,2.0,3.0,4.0,5.0)),
    (2, "b", Seq(1.0,2.0,3.0,4.0,5.0)),
    (3, "c", Seq(1.0,2.0,3.0,4.0,5.0)),
    (4, "d", Seq(1.0,2.0,3.0,4.0,5.0))
  ).toDF("