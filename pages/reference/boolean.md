

# 标量过滤规则

## 概述

谓词表达式输出一个布尔值。Milvus 通过使用谓词进行标量过滤。谓词表达式在求值时返回 TRUE 或 FALSE。查看 [Python SDK API 参考](/api-reference/pymilvus/v{{var.milvus_python_sdk_version}}/Collection/query().md)以获取有关使用谓词表达式的指令。

[EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) 语法规则描述了布尔表达式规则：

```
Expr = LogicalExpr | NIL
LogicalExpr = LogicalExpr BinaryLogicalOp LogicalExpr 
              | UnaryLogicalOp LogicalExpr
              | "(" LogicalExpr ")"
              | SingleExpr;
BinaryLogicalOp = "&&" | "and" | "||" | "or";
UnaryLogicalOp = "not";
SingleExpr = TermExpr | CompareExpr;
TermExpr = IDENTIFIER "in" ConstantArray;
Constant = INTEGER | FLOAT
ConstantExpr = Constant
               | ConstantExpr BinaryArithOp ConstantExpr
               | UnaryArithOp ConstantExpr;
                                                          
ConstantArray = "[" ConstantExpr { "," ConstantExpr } "]";
UnaryArithOp = "+" | "-"
BinaryArithOp = "+" | "-" | "*" | "/" | "%" | "**";
CompareExpr = IDENTIFIER CmpOp IDENTIFIER
              | IDENTIFIER CmpOp ConstantExpr
              | ConstantExpr CmpOp IDENTIFIER
              | ConstantExpr CmpOpRestricted IDENTIFIER CmpOpRestricted ConstantExpr;
CmpOpRestricted = "<" | "<=";
CmpOp = ">" | ">=" | "<" | "<=" | "=="| "!=";
MatchOp = "like" | "LIKE";
JsonArrayOps = JsonDefs "(" IDENTIFIER "," JsonExpr | JsonArray ")";
JsonArrayDefs = "json_contains" | "JSON_CONTAINS" 
           | "json_contains_all" | "JSON_CONTAINS_ALL" 
           | "json_contains_any" | "JSON_CONTAINS_ANY";
JsonExpr =  Constant | ConstantArray | STRING | BOOLEAN;
JsonArray = "[" JsonExpr { "," JsonExpr } "]";
ArrayOps = ArrayDefs "(" IDENTIFIER "," ArrayExpr | Array ")";
ArrayDefs = "array_contains" | "ARRAY_CONTAINS" 
           | "array_contains_all" | "ARRAY_CONTAINS_ALL" 
           | "array_contains_any" | "ARRAY_CONTAINS_ANY"
           | "array_length"       | "ARRAY_LENGTH";
ArrayExpr =  Constant | ConstantArray | STRING | BOOLEAN;
Array = "[" ArrayExpr { "," ArrayExpr } "]";
```

下表列出了上述布尔表达式规则中每个符号的描述。

| 符号      | 描述 |
| ----------- | ----------- |
| =      | 定义       |
| ,      | 连接       |
| ;      | 终止        |
| \|      | 替代       |
| {...}   | 重复        |
| (...)      | 分组       |
| NIL   | 空的。表达式可以为空字符串        |
| INTEGER      | 整数，例如 1、2、3       |
| FLOAT   | 浮点数，例如 1.0、2.0        |
| CONST      | 整数或浮点数       |
| IDENTIFIER   | 标识符。在 Milvus 中，标识符代表字段名称        |
| LogicalOp      | 逻辑运算符，支持在一个比较中组合多个关系运算。LogicalOp 的返回值要么是 TRUE（1），要么是 FALSE（0）。LogicalOp 有两种类型，包括 BinaryLogicalOp 和 UnaryLogicalOp   |
| UnaryLogicalOp   | UnaryLogicalOp 是一元逻辑运算符 "not"        |
| BinaryLogicalOp   | 二元逻辑运算符，对两个操作数执行操作。在具有两个或多个操作数的复杂表达式中，计算顺序取决于优先级规则     |
| ArithmeticOp   | 算术运算符，在操作数上执行加法和减法等数学运算         |
| UnaryArithOp      | 一元算术运算符，对单个操作数执行操作。负的一元算术运算符使正表达式变为负，或者反之亦然      |
| BinaryArithOp   | 二元算术运算符，在两个操作数上执行操作。在具有两个或多个操作数的复杂表达式中，计算顺序取决于优先级规则        |
| CmpOp   | CmpOp 是一个关系运算符，对两个操作数执行操作         |
| CmpOpRestricted      |  CmpOpRestricted 限制为 "小于" 和 "等于"       |
| ConstantExpr   | ConstantExpr 可以是 Constant 或 ConstantExpr 上的 BinaryArithOp，或者在单个 ConstantExpr 上进行 UnaryArithOp。它以递归方式定义        |
| ConstantArray      | ConstantArray 由方括号包围，可以在方括号中重复 ConstantExpr。ConstArray 必须包含至少一个 ConstantExpr       |
| TermExpr   | TermExpr 用于检查 IDENTIFIER 的值是否在 ConstantArray 中出现。TermExpr 用 "in" 表示        |
| CompareExpr      | CompareExpr，即比较表达式，可以是两个 IDENTIFIER 之间的关系运算，或者是一个 IDENTIFIER 和一个 ConstantExpr 之间的关系运算，或者是两个 ConstantExpr 和一个 IDENTIFIER 的三元运算       |
| SingleExpr   | SingleExpr，即单一表达式，可以是 TermExpr 或 CompareExpr      |
| LogicalExpr      | LogicalExpr 可以是两个 LogicalExpr 上的 BinaryLogicalOp，也可以是一个 LogicalExpr 上的 UnaryLogicalOp，或者是括在括号内的 LogicalExpr，或者是 SingleExpr。LogicalExpr 以递归方式定义    |
| Expr   | Expr 是表达式的缩写，可以是 LogicalExpr 或 NIL |
| MatchOp   | MatchOp，即匹配运算符，将一个字符串与一个字符串常量或字符串前缀、中缀或后缀常量进行比较 |
| JsonArrayOp | JsonOp，即 JSON 运算符，检查指定的标识符是否包含指定的元素 |
| ArrayOp | ArrayOp，即数组运算符，检查指定的标识符是否包含指定的元素 |

## 运算符

### 逻辑运算符



Logical operators perform a comparison between two expressions.

| Symbol| Operation | Example | Description          |
| ----------| ------------- | ----------- | ------------------------- |
| 'and' &&  | 且           | expr1 && expr2   | 当 expr1 和 expr2 同时为真时，返回真。 |
| 'or' \|\|  | 或           | expr1 \|\| expr2     | 当 expr1 或 expr2 其中一个为真时，返回真。  |

### 二进制算术运算符

二进制算术运算符包含两个操作数，可以执行基本的算术运算并返回相应的结果。

| Symbol| Operation | Example | Description          |
| ----------| ------------- | ----------- | ------------------------- |
| +         | 加法      | a + b       | 将两个操作数相加。     |
| -         | 减法   | a - b       | 从第一个操作数中减去第二个操作数。  |
| *         | 乘法| a * b       | 将两个操作数相乘。     |
| /         | 除法      | a / b       | 将第一个操作数除以第二个操作数。     |
| **        | 幂运算         | a ** b      | 将第一个操作数的值提升到第二个操作数的幂。     |
| %         | 取模        | a % b       | 将第一个操作数除以第二个操作数，返回余数。    |

### 关系运算符

关系运算符使用符号来检查两个表达式之间的相等性、不等性或相对顺序。

| Symbol| Operation | Example | Description         |
| ----------| ------------- | ----------- | ------------------------- |
| <         | 小于      | a < b      | 如果 a 小于 b，则返回真。     |
| >         | 大于   | a > b       | 如果 a 大于 b，则返回真。  |
| ==        | 等于          | a == b      | 如果 a 等于 b，则返回真。    |
| !=        | 不等于       | a != b     | 如果 a 不等于 b，则返回真。     |
| <=        | 小于或等于          | a <= b     | 如果 a 小于或等于 b，则返回真。     |
| >=        | 大于或等于         | a >= b      | 如果 a 大于或等于 b，则返回真。    |

## 运算符优先级和结合性

下表列出了运算符的优先级和结合性。运算符按照从上到下的顺序列出，优先级从高到低。

| Precedence | Operator                              | Description   | Associativity |
|------------|---------------------------------------|---------------|---------------|
| 1          | + -                                   | 一元算术运算  | 从左到右 |
| 2          | not                                   | 一元逻辑运算  | 从右到左 |
| 3          | **                                    | 二元算术运算 | 从左到右 |
| 4          | * / %                                 | 二元算术运算 | 从左到右 |
| 5          | + -                                   | 二元算术运算 | 从左到右 |
| 6          | < <= > >=                             | 比较运算         | 从左到右 |
| 7          | == !=                                 | 比较运算         | 从左到右 |
| 8          | like LIKE                             | 匹配运算       | 从左到右 |
| 9          | json_contains JSON_CONTAINS           | JSON 数组运算   | 从左到右 |
| 9          | array_contains ARRAY_CONTAINS         | 数组运算       | 从左到右 |
| 10         | json_contains_all JSON_CONTAINS_ALL   | JSON 数组运算   | 从左到右 |
| 10         | array_contains_all ARRAY_CONTAINS_ALL | 数组运算       | 从左到右 |
| 11         | json_contains_any JSON_CONTAINS_ANY   | JSON 数组运算   | 从左到右 |
| 11         | array_contains_any ARRAY_CONTAINS_ANY | 数组运算       | 从左到右 |
| 12         | array_length  ARRAY_LENGTH            | 数组运算       | 从左到右 |
| 13         | && and                                | 二元逻辑运算 | 从左到右 |
| 14         | \|\| or                               | 二元逻辑运算 | 从左到右 |

表达式通常从左到右进行求值。复杂表达式逐个求值。求值表达式的顺序由使用的运算符的优先级确定。

如果一个表达式中包含两个或多个具有相同优先级的运算符，则首先评估左侧的运算符。

<div class="alert note">

例如，10 / 2 * 5 将被评估为(10 / 2)，然后将结果乘以 5。

</div>

当一个较低优先级的操作应该首先处理时，应将其放在括号中。

<div class="alert note">

例如，30 / 2 + 8。这通常被解释为 30 除以 2，然后将 8 加上结果。如果要除以 2 + 8，则应写为 30 / (2 + 8)。

</div>

括号可以在表达式中嵌套。最内层的括号表达式最先求值。

## 用法







---

Samples of all available boolean expression usage in Milvus are listed as follows (`int64` represents the scalar field that contains data of INT64 type,  `float` represents the scalar field that contains data of floating-point type, and `VARCHAR` represents the scalar field that contains data of VARCHAR  type):

1. CmpOp

```
"int64 > 0"
```
```
"0 < int64 < 400"
```
```
"500 <= int64 < 1000"
```
```
VARCHAR > "str1"
```

2. BinaryLogicalOp and parentheses

```
"(int64 > 0 && int64 < 400) or (int64 > 500 && int64 < 1000)"
```

3. TermExpr and UnaryLogicOp

<div class="alert note">

Milvus 仅支持通过明确定义的主键删除实体，这仅可以通过 term 表达式 <code> in </code> 实现。

</div>

```
"int64 not in [1, 2, 3]"
```
```
VARCHAR not in ["str1", "str2"]
```

4. TermExpr, BinaryLogicalOp, and CmpOp (on different fields)

```
"int64 in [1, 2, 3] and float != 2"
```

5. BinaryLogicalOp and CmpOp

```
"int64 == 0 || int64 == 1 || int64 == 2"
```

6. CmpOp and UnaryArithOp or BinaryArithOp

```
"200+300 < int64 <= 500+500"
```

7. MatchOp

```
VARCHAR like "prefix%"
VARCHAR like "%suffix"
VARCHAR like "%middle%"
VARCHAR like "_suffix"
```

8. JsonArrayOp

- `JSON_CONTAINS(identifier, JsonExpr)`

    如果 `JSON_CONTAINS` 语句的 JSON 表达式（第二个参数）为列表，则标识符（第一个参数）应为列表的列表。否则，该语句始终为 False。

    ```python
    # {"x": [1,2,3]}
    json_contains(x, 1) # ==> true
    json_contains(x, "a") # ==> false

    # {"x": [[1,2,3], [4,5,6], [7,8,9]]}
    json_contains(x, [1,2,3]) # ==> true
    json_contains(x, [3,2,1]) # ==> false
    ```

- `JSON_CONTAINS_ALL(identifier, JsonExpr)`

    `JSON_CONTAINS_ALL` 语句中的 JSON 表达式应始终为列表。

    ```python
    # {"x": [1,2,3,4,5,7,8]}
    json_contains_all(x, [1,2,8]) # ==> true
    json_contains_all(x, [4,5,6]) # ==> false 6不存在
    ```

- `JSON_CONTAINS_ANY(identifier, JsonExpr)`

    `JSON_CONTAINS_ANY` 语句中的 JSON 表达式应始终为列表。否则，它的行为与 `JSON_CONTAINS` 相同。






## ArrayOp

- `ARRAY_CONTAINS`（identifier，ArrayExpr）

    如果 `ARRAY_CONTAINS`（第二个参数）语句中的数组表达式是一个列表，则标识符（第一个参数）应该是列表的列表。否则，该语句始终计算为 False。

    ```python
    # {"x": [1,2,3,4,5,7,8]}
    json包含任何(x，[1,2,8])  # ==> true
    json包含任何(x，[4,5,6])  # ==> true
    json包含任何(x，[6,9])  # ==> false
    ```

- `ARRAY_CONTAINS_ALL`（identifier，ArrayExpr）

    `ARRAY_CONTAINS_ALL` 语句中的数组表达式应始终是一个列表。

    ```python
    # "int_array": [1,2,3,4,5,7,8]
    数组包含所有(int_array，[1,2,8])  # ==> true
    数组包含所有(int_array，[4,5,6])  # ==> false 6不存在
    ```

- `ARRAY_CONTAINS_ANY`（identifier，ArrayExpr）

    `ARRAY_CONTAINS_ANY` 语句中的数组表达式应始终是一个列表。否则，它的作用与 `ARRAY_CONTAINS` 相同。

    ```python
    # "int_array": [1,2,3,4,5,7,8]
    数组包含任何(int_array，[1,2,8])  # ==> true
    数组包含任何(int_array，[4,5,6])  # ==> true
    数组包含任何(int_array，[6,9])  # ==> false
    ```

- `ARRAY_LENGTH`（identifier）

    检查数组中元素的数量。

    ```python
    # "int_array": [1,2,3,4,5,7,8]
    数组长度(int_array)  # ==> 7
    ```

## What's next


既然你已经知道在 Milvus 中 bitsets 的工作原理，你可能还想要：

- 学习如何进行 [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)。
- 学习如何 [使用字符串过滤](https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md) 你的搜索结果。
- 学习如何在构建布尔表达式中 [使用动态字段](/userGuide/enable-dynamic-field.md)。