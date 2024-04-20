# 管理 Schema

本主题介绍了 Milvus 中的 Schema。Schema 用于定义集合的属性和其中的字段。

## 字段 Schema

字段 Schema 是字段的逻辑定义。在定义[集合 Schema](#集合-schema)和管理集合之前，这是您需要定义的第一件事。

Milvus 在一个集合中只支持一个主键字段。

### 字段 Schema 属性

<table class="properties">
	<thead>
	<tr>
		<th>属性</td>
		<th>描述</th>
		<th>注意</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><code>name</code></td>
		<td>要创建的集合中字段的名称</td>
		<td>数据类型：字符串。<br/>必填</td>
	</tr>
	<tr>
		<td><code>dtype</code></td>
		<td>字段的数据类型</td>
		<td>必填</td>
	</tr>
    <tr>
		<td><code>description</code></td>
		<td>字段的描述</td>
		<td>数据类型：字符串。<br/>可选</td>
	</tr>
    <tr>
		<td><code>is_primary</code></td>
		<td>是否将字段设置为主键字段</td>
		<td>数据类型：布尔值（<code>true</code> 或 <code>false</code>）。<br/>主键字段必填</td>
	</tr>
        <tr>
	        <td><code>auto_id</code>（主键字段必填）</td>
        	<td>启用或禁用自动 ID（主键）分配的开关。</td>
        	<td><code>True</code> 或 <code>False</code></td>
        </tr>
        <tr>
        	<td><code>max_length</code>（VARCHAR 字段必填）</td>
        	<td>允许插入的字符串的最大长度。</td>
        	<td>[1, 65,535]</td>
        </tr>
	<tr>
		<td><code>dim</code></td>
		<td>向量的维度</td>
    		<td>数据类型：整数 ∈[1, 32768]。<br/>对于密集向量字段必填。对于<a href="https://milvus.io/docs/sparse_vector.md">稀疏向量</a>字段省略。</td>
	</tr>
	<tr>
		<td><code>is_partition_key</code></td>
		<td>此字段是否为分区键字段。</td>
		<td>数据类型：布尔值（<code>true</code> 或 <code>false</code>）。</td>
	</tr>
	</tbody>
</table>


### 创建字段 Schema

为了减少数据插入的复杂性，Milvus 允许您在创建字段 Schema 期间为每个标量字段指定默认值，主键字段除外。这意味着，如果在插入数据时留空某个字段，则应用您为该字段指定的默认值。

创建常规字段 Schema：

```python
from pymilvus import FieldSchema
id_field = FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, description="primary id")
age_field = FieldSchema(name="age", dtype=DataType.INT64, description="age")
embedding_field = FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=128, description="vector")

# 下面创建一个字段并将其用作分区键
position_field = FieldSchema(name="position", dtype=DataType.VARCHAR, max_length=256, is_partition_key=True)
```

创建带有默认字段值的字段 Schema：

```python
from pymilvus import FieldSchema

fields = [
  FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
  # 为字段 `age` 配置默认值 `25`
  FieldSchema(name="age", dtype=DataType.INT64, default_value=25, description="age"),
  embedding_field = FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=128, description="vector")
]
```

### 支持的数据类型

`DataType` 定义了字段包含的数据类型。不同的字段支持不同的数据类型。

- 主键字段支持：
  - INT64：numpy.int64
  - VARCHAR：VARCHAR
- 标量字段支持：
  - BOOL：布尔值（`true` 或 `false`）
  - INT8：numpy.int8
  - INT16：numpy.int16
  - INT32：numpy.int32
  - INT64：numpy.int64
  - FLOAT：numpy.float32
  - DOUBLE：numpy.double
  - VARCHAR：VARCHAR
  - JSON：[JSON](use-json-fields.md)
  - Array：[Array]