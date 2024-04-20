---
title: Milvus_CLI 命令参考
---

# Milvus_CLI 命令参考

Milvus 命令行界面（CLI）是一个支持数据库连接、数据操作以及数据导入导出的命令行工具。

本主题介绍了所有支持的命令及其对应的选项。也包括了一些示例供您参考。

## clear

清除屏幕。

### 语法

```shell
clear
```

### 选项

| 选项 | 全名 | 描述                          |
| :----- | :-------- | :----------------------------------- |
| --help | n/a       | 显示使用命令的帮助信息。 |

## connect

连接到 Milvus。

### 语法

```shell
connect [-uri (text)] [-t (text)]
```

### 选项

| 选项 | 全名    | 描述                                                                                                 |
| :----- | :----------- | :---------------------------------------------------------------------------------------------------------- |
| -uri   | --uri        | (可选) uri 名称。默认是 "http://127.0.0.1:19530"。                                                       |
| -t     | --token      | (可选) Zilliz 云 API 密钥或 `用户名:密码`。默认是 None。                                                         |
| --help | n/a          | 显示使用命令的帮助信息。                                                                        |

### 示例

```shell
milvus_cli > connect -uri http://127.0.0.1:19530 
```

## 创建数据库

在 Milvus 中创建数据库

### 语法

```shell
create database -db (text) 
```

### 选项

| 选项 | 全名  | 描述                                         |
| :----- | :--------- | :-------------------------------------------------- |
| -db    | --database | [必需] Milvus 中的数据库名称。              |
| --help | n/a        | 显示使用命令的帮助信息。                |

### 示例

#### 示例 1

以下示例在 milvus 中创建了数据库 `<code>testdb</code>`。

```shell
milvus_cli > create database -db testdb
```

## 使用数据库

在 Milvus 中使用数据库

### 语法

```shell
use database -db (text) 
```

### 选项

| 选项 | 全名  | 描述                                         |
| :----- | :--------- | :-------------------------------------------------- |
| -db    | --database | [必需] Milvus 中的数据库名称。              |
| --help | n/a        | 显示使用命令的帮助信息。                |

### 示例

#### 示例 1

以下示例在 milvus 中使用了数据库 `<code>testdb</code>`。

```shell
milvus_cli > use database -db testdb
```

## 列出数据库

列出 Milvus 中的数据库

### 语法

```shell
list databases 
```

### 示例

#### 示例 1

以下示例列出了 milvus 中的数据库。

```shell
milvus_cli > list databases
```

## 删除数据库

在 Milvus 中删除数据库

### 语法

```shell
delete database -db (text) 
```

### 选项

| 选项 | 全名  | 描述                                         |
| :----- | :--------- | :-------------------------------------------------- |
| -db    | --database | [必需] Milvus 中的数据库名称。              |
| --help | n/a        | 显示使用命令的帮助信息。                |

### 示例

#### 示例 1

以下示例删除了 milvus 中的数据库 `<code>testdb</code>`。

```shell
milvus_cli > delete database -db testdb
```

## 创建用户

在 Milvus 中创建用户

### 语法

```shell
create user -u (text) -p (text)
```

### 选项

| 选项 | 全名  | 描述                                         |
| :----- | :--------- | :-------------------------------------------------- |
| -p     | --password | Milvus 中的用户密码。默认是 "None"。 |
| -u     | --username | Milvus 中的用户名。默认是 "None"。      |
| --help | n/a        | 显示使用命令的帮助信息。                |

### 示例

#### 示例 1

以下示例在 milvus 中创建了用户 `<code>zilliz</code>` 和密码 `<code>zilliz</code>`。

```shell
milvus_cli > create user -u zilliz -p zilliz
```

## 创建别名

为集合指定唯一的别名。

> 注意：一个集合可以有多个别名。但是，一个别名最多对应一个集合。

### 语法

```shell
create alias -c (text) -a (text) [-