


# 安装 Milvus Java SDK

本文介绍了如何安装 Milvus 的 Java SDK。

当前版本的 Milvus 支持 Python、Node.js、GO 和 Java 的 SDK。

## 要求

- Java （8 或更高版本）
- Apache Maven 或 Gradle/Grails

## 安装 Milvus Java SDK

执行以下命令来安装 Milvus Java SDK。

- Apache Maven

```xml
<dependency>
    <groupId>io.milvus</groupId>
    <artifactId>milvus-sdk-java</artifactId>
    <version>{{var.milvus_java_sdk_real_version}}</version>
</dependency>
```

- Gradle/Grails

```
implementation 'io.milvus:milvus-sdk-java:{{var.milvus_java_sdk_real_version}}'
```

## 下一步操作



在安装了 Milvus Java SDK 之后，你可以进行以下操作：

- 学习 Milvus 的基本操作：
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除数据](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- 查看 [Milvus Java API 参考文档](/api-reference/java/v{{var.milvus_java_sdk_version}}/About.md)

