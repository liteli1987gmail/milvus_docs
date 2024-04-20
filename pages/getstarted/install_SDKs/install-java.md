---

id: 安装-java-sdk.md
label: 安装 Java SDK
related_key: SDK
summary: 学习如何安装 Milvus 的 Java SDK。
title: 安装 Milvus Java SDK

---

# 安装 Milvus Java SDK

本主题描述了如何为 Milvus 安装 Java SDK。

当前版本的 Milvus 支持 Python、Node.js、GO 和 Java 的 SDK。

## 要求

- Java (8 或更高版本)
- Apache Maven 或 Gradle/Grails

## 安装 Milvus Java SDK

运行以下命令以安装 Milvus Java SDK。

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

## 接下来做什么

安装了 Milvus Java SDK 后，您可以：

- 学习 Milvus 的基本操作：
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、更新和删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)

- 探索 [Milvus Java API 参考](/api-reference/java/v{{var.milvus_java_sdk_version}}/About.md)