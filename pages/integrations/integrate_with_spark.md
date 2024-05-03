---
id: integrate_with_spark.md
summary: This page discusses the Spark-Milvus connector.
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

   ```bash
   wget https://github.com/zilliztech/spark-milvus/raw/1.0.0-SNAPSHOT/output/spark-milvus-1.0.0-SNAPSHOT.jar
   ```

3. 启动 Spark 运行时，并把 **spark-milvus** jar 作为依赖项之一。

   要启动带有 Spark-Milvus 连接器的 Spark 运行时，请将下载的 **spark-milvus** jar 作为依赖项添加到命令中。

   - **pyspark**

     ```bash
     ./bin/pyspark --jars spark-milvus-1.0.0-SNAPSHOT.jar
     ```

   - **spark-shell**

     ```bash
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
  ).toDF("id", "text", "vec")

  // set milvus options
  val milvusOptions = Map(
      "milvus.host" -> "localhost" -> uri,
      "milvus.port" -> "19530",
      "milvus.collection.name" -> "hello_spark_milvus",
      "milvus.collection.vectorField" -> "vec",
      "milvus.collection.vectorDim" -> "5",
      "milvus.collection.primaryKeyField", "id"
    )

  sampleDF.write.format("milvus")
    .options(milvusOptions)
    .mode(SaveMode.Append)
    .save()
}
```

执行完上述代码后，您可以使用SDK或Attu(Milvus Dashboard)在Milvus中查看插入的数据。您可以找到一个名为 `hello_park_milvus` 的集合，其中已插入4个实体。

## 特点和概念

### Milvus选项

在[快速启动](#Quick-start)部分，我们展示了Milvus操作期间的设置选项。这些选项被抽象为Milvus选项。它们用于创建与Milvus的连接并控制其他Milvus行为。并非所有选项都是强制性的。


| Option Key                          | Default Value    | Description                                                                                                                                                                                                |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `milvus.host`                       | `localhost`      | Milvus server host. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                               |
| `milvus.port`                       | `19530`          | Milvus server port. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                               |
| `milvus.username`                   | `root`           | Username for Milvus server. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                       |
| `milvus.password`                   | `Milvus`         | Password for Milvus server. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                       |
| `milvus.uri`                        | `--`             | Milvus server URI. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                                |
| `milvus.token`                      | `--`             | Milvus server token. See [Manage Milvus Connections](https://milvus.io/docs/manage_connection.md) for detail.                                                                                              |
| `milvus.database.name`              | `default`        | Name of the Milvus database to read or write.                                                                                                                                                              |
| `milvus.collection.name`            | `hello_milvus`   | Name of the Milvus collection to read or write.                                                                                                                                                            |
| `milvus.collection.primaryKeyField` | `None`           | Name of the primary key field in the collection. Required if the collection does not exist.                                                                                                                |
| `milvus.collection.vectorField`     | `None`           | Name of the vector field in the collection. Required if the collection does not exist.                                                                                                                     |
| `milvus.collection.vectorDim`       | `None`           | Dimension of the vector field in the collection. Required if the collection does not exist.                                                                                                                |
| `milvus.collection.autoID`          | `false`          | If the collection does not exist, this option specifies whether to automatically generate IDs for the entities. For more information, see [create_collection](https://milvus.io/docs/create_collection.md) |
| `milvus.bucket`                     | `a-bucket`       | Bucket name in the Milvus storage. This should be the same as `minio.bucketName` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                                    |
| `milvus.rootpath`                   | `files`          | Root path of the Milvus storage. This should be the same as `minio.rootpath` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                                        |
| `milvus.fs`                         | `s3a://`         | File system of the Milvus storage. The value `s3a://` applies to open-source Spark. Use `s3://` for Databricks.                                                                                            |
| `milvus.storage.endpoint`           | `localhost:9000` | Endpoint of the Milvus storage. This should be the same as `minio.address`:`minio.port` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                             |
| `milvus.storage.user`               | `minioadmin`     | User of the Milvus storage. This should be the same as `minio.accessKeyID` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                                          |
| `milvus.storage.password`           | `minioadmin`     | Password of the Milvus storage. This should be the same as `minio.secretAccessKey` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                                  |
| `milvus.storage.useSSL`             | `false`          | Whether to use SSL for the Milvus storage. This should be the same as `minio.useSSL` in [milvus.yaml](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml).                                |

## Milvus数据格式

Spark Milvus连接器支持以以下Milvus数据格式读取和写入数据：

- `milvus`：用于从Spark DataFrame无缝转换到milvus实体的milvus数据格式。
- `milvusbinlog`：用于读取Milvus内置binlog数据的Milvus数据格式。
- `mjson`：用于将数据批量插入Milvus的Milvus JSON格式。

### milvus

在 [快速开始](#Quick-start), 我们使用**milvus**格式将样本数据写入milvus集群。**milvus**格式是一种新的数据格式，支持将Spark DataFrame数据无缝写入milvus Collections。这是通过批量调用Milvus SDK的Insert API来实现的。如果Milvus中不存在集合，将根据Dataframe的模式创建一个新的集合。但是，自动创建的集合可能不支持集合架构的所有功能。因此，建议先通过SDK创建一个集合，然后使用spark-milvus进行编写。有关更多信息，请参阅[演示](https://github.com/zilliztech/spark-milvus/blob/main/examples/src/main/scala/InsertDemo.scala).

### milvusbinlog

新的数据格式 **milvusbinlog** 用于读取Milvus内置的binlog数据。Binlog是Milvus基于镶木地板的内部数据存储格式。不幸的是，它不能被普通的镶木地板库读取，所以我们实现了这个新的数据格式来帮助Spark job读取它。

除非您熟悉milvus内部存储的详细信息，否则不建议直接使用**milvusbinlog**。我们建议使用[MilvusUtils](#MilvusUtils)函数，该函数将在下一节中介绍。


```scalar
val df = spark.read
  .format("milvusbinlog")
  .load(path)
  .withColumnRenamed("val", "embedding")
```

### mjson

Milvus提供[Bulkinsert](https://milvus.io/docs/bulk_insert.md•在使用大型数据集操作时提供更好的写入性能的功能。然而，Milvus使用的JSON格式与Spark默认的JSON输出格式略有不同。
为了解决这个问题，我们引入了**mjson**数据格式来生成满足Milvus要求的数据。以下示例显示了JSON行和**mjson**之间的区别：

- JSON-lines:

  ```json
  {"book_id": 101, "word_count": 13, "book_intro": [1.1, 1.2]}
  {"book_id": 102, "word_count": 25, "book_intro": [2.1, 2.2]}
  {"book_id": 103, "word_count": 7, "book_intro": [3.1, 3.2]}
  {"book_id": 104, "word_count": 12, "book_intro": [4.1, 4.2]}
  {"book_id": 105, "word_count": 34, "book_intro": [5.1, 5.2]}
  ```

- mjson (Required for Milvus Bulkinsert):

  ```json
  {
    "rows": [
      { "book_id": 101, "word_count": 13, "book_intro": [1.1, 1.2] },
      { "book_id": 102, "word_count": 25, "book_intro": [2.1, 2.2] },
      { "book_id": 103, "word_count": 7, "book_intro": [3.1, 3.2] },
      { "book_id": 104, "word_count": 12, "book_intro": [4.1, 4.2] },
      { "book_id": 105, "word_count": 34, "book_intro": [5.1, 5.2] }
    ]
  }
  ```

这将在未来得到改善。如果您的milvus版本是v2.3.7+，支持parquet格式的bulksert，我们建议在spark milvus集成中使用parquet形式。参见[演示](https://github.com/zilliztech/spark-milvus/blob/main/examples/src/main/scala/BulkInsertDemo.scala)在Github上。

## MilvusUtils

MilvusUtils包含几个有用的util函数。目前只有Scala支持它。更多用法示例见[高级用法]（#高级用法）部分。

### MilvusUtils.readMilvusCollection

**readMilvusCollection**是一个简单的接口，用于将整个Milvus集合加载到Spark Dataframe中。它封装了各种操作，包括调用MilvusSDK、读取**milvusbinlog**和常见的联合/联接操作。

```scala
val collectionDF = MilvusUtils.readMilvusCollection(spark, milvusOptions)
```

### MilvusUtils.bulkInsertFromSpark

**MilvusUtils.bulkInsertFromSpark**提供了一种将Spark输出文件大批量导入Milvus的方便方法。它包装了Milvus SDK的**Bullkinsert**API。

```scala
df.write.format("parquet").save(outputPath)
MilvusUtils.bulkInsertFromSpark(spark, milvusOptions, outputPath, "parquet")
```

## 高级使用

在本节中，您将找到用于数据分析和迁移的Spark Milvus连接器的高级使用示例。有关更多演示，请参阅[示例](https://github.com/zilliztech/spark-milvus/tree/main/examples/src/main/scala).

### MySQL -> embedding -> Milvus

在这个演示中，我们将

1. 通过Spark MySQL连接器从MySQL中读取数据，
2. 生成嵌入（以Word2Verc为例），以及
3. 将嵌入的数据写入Milvus。

要启用Spark MySQL连接器，您需要将以下依赖项添加到您的Spark环境中：

```
spark-shell --jars spark-milvus-1.0.0-SNAPSHOT.jar,mysql-connector-j-x.x.x.jar
```

```scala
import org.apache.spark.ml.feature.{Tokenizer, Word2Vec}
import org.apache.spark.sql.functions.udf
import org.apache.spark.sql.{SaveMode, SparkSession}
import zilliztech.spark.milvus.MilvusOptions._

import org.apache.spark.ml.linalg.Vector

object Mysql2MilvusDemo  extends App {

  val spark = SparkSession.builder().master("local[*]")
    .appName("Mysql2MilvusDemo")
    .getOrCreate()

  import spark.implicits._

  // Create DataFrame
  val sampleDF = Seq(
    (1, "Milvus was created in 2019 with a singular goal: store, index, and manage massive embedding vectors generated by deep neural networks and other machine learning (ML) models."),
    (2, "As a database specifically designed to handle queries over input vectors, it is capable of indexing vectors on a trillion scale. "),
    (3, "Unlike existing relational databases which mainly deal with structured data following a pre-defined pattern, Milvus is designed from the bottom-up to handle embedding vectors converted from unstructured data."),
    (4, "As the Internet grew and evolved, unstructured data became more and more common, including emails, papers, IoT sensor data, Facebook photos, protein structures, and much more.")
  ).toDF("id", "text")

  // Write to MySQL Table
  sampleDF.write
    .mode(SaveMode.Append)
    .format("jdbc")
    .option("driver","com.mysql.cj.jdbc.Driver")
    .option("url", "jdbc:mysql://localhost:3306/test")
    .option("dbtable", "demo")
    .option("user", "root")
    .option("password", "123456")
    .save()

  // Read from MySQL Table
  val dfMysql = spark.read
    .format("jdbc")
    .option("driver","com.mysql.cj.jdbc.Driver")
    .option("url", "jdbc:mysql://localhost:3306/test")
    .option("dbtable", "demo")
    .option("user", "root")
    .option("password", "123456")
    .load()

  val tokenizer = new Tokenizer().setInputCol("text").setOutputCol("tokens")
  val tokenizedDf = tokenizer.transform(dfMysql)

  // Learn a mapping from words to Vectors.
  val word2Vec = new Word2Vec()
    .setInputCol("tokens")
    .setOutputCol("vectors")
    .setVectorSize(128)
    .setMinCount(0)
  val model = word2Vec.fit(tokenizedDf)

  val result = model.transform(tokenizedDf)

  val vectorToArrayUDF = udf((v: Vector) => v.toArray)
  // Apply the UDF to the DataFrame
  val resultDF = result.withColumn("embedding", vectorToArrayUDF($"vectors"))
  val milvusDf = resultDF.drop("tokens").drop("vectors")

  milvusDf.write.format("milvus")
    .option(MILVUS_HOST, "localhost")
    .option(MILVUS_PORT, "19530")
    .option(MILVUS_COLLECTION_NAME, "text_embedding")
    .option(MILVUS_COLLECTION_VECTOR_FIELD, "embedding")
    .option(MILVUS_COLLECTION_VECTOR_DIM, "128")
    .option(MILVUS_COLLECTION_PRIMARY_KEY, "id")
    .mode(SaveMode.Append)
    .save()
}
```

### Milvus -> Transform -> Milvus

在这个演示中，我们将

1. 从Milvus集合读取数据，
2. 应用变换（以PCA为例），以及
3. 通过Bulkinsert API将转换后的数据写入另一个Milvus。

<div class="alert notes">

PCA模型是一种降低嵌入向量维数的变换模型，这是机器学习中的常见操作。
您可以将任何其他处理操作（如过滤、连接或规范化）添加到转换步骤中。

</div>

```scala
import org.apache.spark.ml.feature.PCA
import org.apache.spark.ml.linalg.{Vector, Vectors}
import org.apache.spark.SparkConf
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions.udf
import org.apache.spark.sql.util.CaseInsensitiveStringMap
import zilliztech.spark.milvus.{MilvusOptions, MilvusUtils}

import scala.collection.JavaConverters._

object TransformDemo extends App {
  val sparkConf = new SparkConf().setMaster("local")
  val spark = SparkSession.builder().config(sparkConf).getOrCreate()

  import spark.implicits._

  val host = "localhost"
  val port = 19530
  val user = "root"
  val password = "Milvus"
  val fs = "s3a://"
  val bucketName = "a-bucket"
  val rootPath = "files"
  val minioAK = "minioadmin"
  val minioSK = "minioadmin"
  val minioEndpoint = "localhost:9000"
  val collectionName = "hello_spark_milvus1"
  val targetCollectionName = "hello_spark_milvus2"

  val properties = Map(
    MilvusOptions.MILVUS_HOST -> host,
    MilvusOptions.MILVUS_PORT -> port.toString,
    MilvusOptions.MILVUS_COLLECTION_NAME -> collectionName,
    MilvusOptions.MILVUS_BUCKET -> bucketName,
    MilvusOptions.MILVUS_ROOTPATH -> rootPath,
    MilvusOptions.MILVUS_FS -> fs,
    MilvusOptions.MILVUS_STORAGE_ENDPOINT -> minioEndpoint,
    MilvusOptions.MILVUS_STORAGE_USER -> minioAK,
    MilvusOptions.MILVUS_STORAGE_PASSWORD -> minioSK,
  )

  // 1, configurations
  val milvusOptions = new MilvusOptions(new CaseInsensitiveStringMap(properties.asJava))

  // 2, batch read milvus collection data to dataframe
  //  Schema: dim of `embeddings` is 8
  // +-+------------+------------+------------------+
  // | | field name | field type | other attributes |
  // +-+------------+------------+------------------+
  // |1|    "pk"    |    Int64   |  is_primary=True |
  // | |            |            |   auto_id=False  |
  // +-+------------+------------+------------------+
  // |2|  "random"  |    Double  |                  |
  // +-+------------+------------+------------------+
  // |3|"embeddings"| FloatVector|     dim=8        |
  // +-+------------+------------+------------------+
  val arrayToVectorUDF = udf((arr: Seq[Double]) => Vectors.dense(arr.toArray[Double]))
  val collectionDF = MilvusUtils.readMilvusCollection(spark, milvusOptions)
    .withColumn("embeddings_vec", arrayToVectorUDF($"embeddings"))
    .drop("embeddings")

  // 3. Use PCA to reduce dim of vector
  val dim = 4
  val pca = new PCA()
    .setInputCol("embeddings_vec")
    .setOutputCol("pca_vec")
    .setK(dim)
    .fit(collectionDF)
  val vectorToArrayUDF = udf((v: Vector) => v.toArray)
  // embeddings dim number reduce to 4
  // +-+------------+------------+------------------+
  // | | field name | field type | other attributes |
  // +-+------------+------------+------------------+
  // |1|    "pk"    |    Int64   |  is_primary=True |
  // | |            |            |   auto_id=False  |
  // +-+------------+------------+------------------+
  // |2|  "random"  |    Double  |                  |
  // +-+------------+------------+------------------+
  // |3|"embeddings"| FloatVector|     dim=4        |
  // +-+------------+------------+------------------+
  val pcaDf = pca.transform(collectionDF)
    .withColumn("embeddings", vectorToArrayUDF($"pca_vec"))
    .select("pk", "random", "embeddings")

  // 4. Write PCAed data to S3
  val outputPath = "s3a://a-bucket/result"
  pcaDf.write
    .mode("overwrite")
    .format("parquet")
    .save(outputPath)

  // 5. Config MilvusOptions of target table
  val targetProperties = Map(
    MilvusOptions.MILVUS_HOST -> host,
    MilvusOptions.MILVUS_PORT -> port.toString,
    MilvusOptions.MILVUS_COLLECTION_NAME -> targetCollectionName,
    MilvusOptions.MILVUS_BUCKET -> bucketName,
    MilvusOptions.MILVUS_ROOTPATH -> rootPath,
    MilvusOptions.MILVUS_FS -> fs,
    MilvusOptions.MILVUS_STORAGE_ENDPOINT -> minioEndpoint,
    MilvusOptions.MILVUS_STORAGE_USER -> minioAK,
    MilvusOptions.MILVUS_STORAGE_PASSWORD -> minioSK,
  )
  val targetMilvusOptions = new MilvusOptions(new CaseInsensitiveStringMap(targetProperties.asJava))

  // 6. Bulkinsert Spark output files into milvus
  MilvusUtils.bulkInsertFromSpark(spark, targetMilvusOptions, outputPath, "parquet")
}
```

### Databricks -> Zilliz Cloud

如果您正在使用Zilliz Cloud（托管Milvus服务），您可以利用其方便的数据导入API。Zilliz Cloud提供全面的工具和文档，帮助您高效地从各种数据源（包括Spark和Databricks）中移动数据。只需设置一个S3 bucket作为中介，并打开它对您的Zilliz Cloud帐户的访问权限。Zilliz Cloud的Data Import API将自动将S3存储桶中的整批数据加载到Zilliz云集群中。

**准备工作**

1. 通过向Databricks集群添加一个jar文件来加载Spark运行时。

可以用不同的方式安装库。这个屏幕截图显示了将一个jar从本地上传到集群。有关详细信息，请参阅[群集库](https://docs.databricks.com/en/libraries/cluster-libraries.html)在Databricks文档中。

![安装Databricks库]（/public/assets/Install Databricks Library.png）

2. 创建一个S3 bucket，并将其配置为Databricks集群的外部存储位置。

Bulkinsert要求将数据存储在临时存储桶中，以便Zilliz Cloud可以批量导入数据。您可以创建一个S3存储桶，并将其配置为数据块的外部位置。请参阅[外部位置](https://docs.databricks.com/en/sql/language-manual/sql-ref-external-locations.html)详细信息。

3. 保护您的Databricks凭据。

有关更多详细信息，请参阅博客上的说明[在Databricks中安全管理凭据](https://www.databricks.com/blog/2018/06/04/securely-managing-credentials-in-databricks.html).

**Demo**

下面是一个代码片段，展示了批处理数据迁移过程。与上面的Milvus示例类似，您只需要替换凭据和S3存储桶地址。

```scala
// Write the data in batch into the Milvus bucket storage.
val outputPath = "s3://my-temp-bucket/result"
df.write
  .mode("overwrite")
  .format("mjson")
  .save(outputPath)
// Specify Milvus options.
val targetProperties = Map(
  MilvusOptions.MILVUS_URI -> zilliz_uri,
  MilvusOptions.MILVUS_TOKEN -> zilliz_token,
  MilvusOptions.MILVUS_COLLECTION_NAME -> targetCollectionName,
  MilvusOptions.MILVUS_BUCKET -> bucketName,
  MilvusOptions.MILVUS_ROOTPATH -> rootPath,
  MilvusOptions.MILVUS_FS -> fs,
  MilvusOptions.MILVUS_STORAGE_ENDPOINT -> minioEndpoint,
  MilvusOptions.MILVUS_STORAGE_USER -> minioAK,
  MilvusOptions.MILVUS_STORAGE_PASSWORD -> minioSK,
)
val targetMilvusOptions = new MilvusOptions(new CaseInsensitiveStringMap(targetProperties.asJava))

// Bulk insert Spark output files into Milvus
MilvusUtils.bulkInsertFromSpark(spark, targetMilvusOptions, outputPath, "mjson")
```

## Hands-on

为了帮助您快速开始使用Spark Milvus连接器，我们准备了一个笔记本，通过Milvus和Zilliz Cloud引导您完成流媒体和批量数据传输过程。

- [Spark-Milvus Connector Hands-on](https://zilliz.com/databricks_zilliz_demos)
