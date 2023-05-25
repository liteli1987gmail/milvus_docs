# 概览

谓词表达式可以输出布尔值。Milvus 通过使用谓词进行标量过滤。当评估谓词表达式时，返回的结果为 true 或 false。请查看 [Python SDK API 参考文档](/api-reference/pymilvus/v2.2.8/Collection/query().md) 以获取使用谓词表达式的说明。

[EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) 语法规则描述了布尔表达式的方法：

```python
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
BinaryArithOp = "+" | "-" | "*" | "/" | "" | "**";
CompareExpr = IDENTIFIER CmpOp IDENTIFIER
              | IDENTIFIER CmpOp ConstantExpr
              | ConstantExpr CmpOp IDENTIFIER
              | ConstantExpr CmpOpRestricted IDENTIFIER CmpOpRestricted ConstantExpr;
CmpOpRestricted = "<" | "<=";
CmpOp = ">" | ">=" | "<" | "<=" | "=="| "!=";
MatchOp = "like" | "LIKE";
```

以下表格列出了上述布尔表达式规则中提到的每个符号的描述。

| 标记 | 描述 |
| --- | --- |
| = | 定义。 |
| , | 连接。 |
| ; | 结束符。 |
| | | 交替符。 |
| {...} | 重复。 |
| (...) | 分组。 |
| NIL | 空。表达式可以是空字符串。 |
| INTEGER | 整数，例如 1、2、3。 |
| FLOAT | 浮点数，例如 1.0、2.0。 |
| CONST | 整数或浮点数。 |
| IDENTIFIER | 标识符。在 Milvus 中，标识符代表字段名。 |
| LogicalOp | LogicalOp 是一种逻辑操作符，支持在一个比较中结合多个关系运算符。LogicalOp 的返回值只能是 TRUE (1) 或 FALSE (0)。有两种类型的 LogicalOp，包括 BinaryLogicalOps 和 UnaryLogicalOps。 |
| UnaryLogicalOp | UnaryLogicalOp 指一元逻辑运算符“not”。 |
| BinaryLogicalOp | 二元逻辑运算符在两个操作数上执行操作。在具有两个或多个操作数的复杂表达式中，计算顺序取决于优先级规则。 |
| ArithmeticOp | ArithmeticOp，即算术运算符，在操作数上执行数学运算，例如加法和减法。 |
| UnaryArithOp | UnaryArithOp 是一种算术运算符，以单个操作数为操作数执行操作。负的 UnaryArithOp 将一个正的表达式变成负的表达式，反之亦然。 |
| BinaryArithOp | BinaryArithOp，即二元运算符，对两个操作数进行操作。在具有两个或多个操作数的复杂表达式中，计算顺序取决于优先级规则。 |
| CmpOp | CmpOp 是一种关系运算符，对两个操作数执行操作。|
| CmpOpRestricted | CmpOpRestricted 限制为“小于”和“等于”。 |
| ConstantExpr | ConstantExpr 可以是常量或两个 ConstExprs 上的 BinaryArithOp 或单个 ConstantExpr 上的 UnaryArithOp。它被递归地定义。|
| ConstantArray | ConstantArray 由方括号包装，可以在方括号中重复 ConstantExpr。


ConstArray 必须包含至少一个 ConstantExpr。

| TermExpr | TermExpr 用于检查 IDENTIFIER 的值是否出现在 ConstantArray 中。TermExpr 由 "in" 表示。|
| CompareExpr | CompareExpr，即比较表达式，可以是两个 IDENTIFIER 的关系运算，或一个 IDENTIFIER 和一个 ConstantExpr 的关系运算，或两个 ConstantExprs 和一个 IDENTIFIER 的三元运算。 |
| SingleExpr | SingleExpr，即单个表达式，可以是 TermExpr 或 CompareExpr。|
| LogicalExpr | LogicalExpr 可以是逻辑操作 LogicalExprs 上的 BinaryLogicalOp，或一元逻辑操作 UnaryLogicalOp 上的单个 LogicalExpr，或圆括号内的 LogicalExpr，或 SingleExpr。LogicalExpr 递归定义。|
| Expr | 表示表达式的缩写，可以是 LogicalExpr 或 NIL。 |
| MatchOp | MatchOp，即匹配操作符，比较字符串和字符串常量或字符串前缀常量。|

操作符
---------
### 逻辑运算符：

逻辑运算符用于在两个表达式之间进行比较。

| Symbol | Operation | Example | Description |
| --- | --- | --- | --- |
| 'and' && | and | expr1 && expr2 | True if both expr1 and expr2 are true. |
| 'or' || | or | expr1 || expr2 | True if either expr1 or expr2 are true. |

### 二元算术运算符：

二元算术运算符包含两个操作数，可以执行基本算术运算并返回相应的结果。

| Symbol | Operation | Example | Description |
| --- | --- | --- | --- |
| + | Addition | a + b | Add the two operands. |
| - | Subtraction | a - b | Subtract the second operand from the first operand. |
| * | Multiplication | a * b | Multiply the two operands. |
| / | Division | a / b | Divide the first operand by the second operand. |
| ** | Power | a ** b | Raise the first operand to the power of the second operand. |
| % | Modulo | a % b | Divide the first operand by the second operand and yield the remainder portion. |

### Relational operators:

Relational operators use symbols to check for equality, inequality, or relative order between two expressions.

| Symbol | Operation | Example | Description |
| --- | --- | --- | --- |
| < | Less than | a < b | True if a is less than b. |
| > | Greater than | a > b | True if a is greater than b. |
| == | Equal | a == b | True if a is equal to b. |
| != | Not equal | a != b | True if a is not equal to b. |
| <= | Less than or equal | a <= b | True if a is less than or equal to b. |
| >= | Greater than or equal | a >= b | True if a is greater than or equal to b. |

运算符优先级和结合性
----------

下表列出了运算符的优先级和结合性。运算符从上到下按优先级降序排列。

| Precedence | Operator | Description | Associativity |
| --- | --- | --- | --- |
| 1 | + - | UnaryArithOp | Left-to-right |
| 2 | not | UnaryLogicOp | Right-to-left |
| 3 | ** | BinaryArithOp | Left-to-right |
| 4 | * / % | BinaryArithOp | Left-to-right |
| 5 | + - | BinaryArithOp | Left-to-right |
| 6 | < <= > >= | CmpOp | Left-to-right |
| 7 | == != | CmpOp | Left-to-right |
| 8 | like LIKE | MatchOp | Left-to-right |
| 9 | && and | BinaryLogicOp | Left-to-right |
| 10 | || or | BinaryLogicOp | Left-to-right |

通常，表达式从左到右进行求值。复杂表达式一次计算一个。表达式求值的顺序由所使用的运算符的优先级确定。

如果一个表达式包含两个或多个具有相同优先级的运算符，则先计算左边的运算符。

For example, 10 / 2 * 5 will be evaluated as (10 / 2) and the result multiplied by 5. 

当需要先处理低优先级操作时，应将其括在括号内。

For example, 30 / 2 + 8. This is normally evaluated as 30 divided by 2 then 8 added to the result. If you want to divide by 2 + 8, it should be written as 30 / (2 + 8). 

括号可以嵌套在表达式中。最内层的括号表达式先求值。

使用
--

Milvus中所有可用布尔表达式用法的示例如下(`int64`表示包含INT64类型数据的标量字段，`float`表示包含浮点类型数据的标量字段，`VARCHAR`表示包含VARCHAR类型数据的标量字段):

- CmpOp

```python
"int64 > 0"

```

```python
"0 < int64 < 400"

```

```python
"500 <= int64 < 1000"

```

```python
VARCHAR > "str1"

```

- BinaryLogicalOp和括号

```python
"(int64 > 0 && int64 < 400) or (int64 > 500 && int64 < 1000)"

```

- TermExpr和UnaryLogicOp

Milvus only supports deleting entities with clearly specified primary keys, which can be achieved merely with the term expression `in`.

```python
"int64 not in [1, 2, 3]"

```

```python
VARCHAR not in ["str1", "str2"]

```

- TermExpr、BinaryLogicalOp 和 CmpOp（在不同的字段上）

```python
"int64 in [1, 2, 3] and float != 2"

```

- BinaryLogicalOp 和 CmpOp

```python
"int64 == 0 || int64 == 1 || int64 == 2"

```

- CmpOp 和 UnaryArithOp 或 BinaryArithOp

```python
"200+300 < int64 <= 500+500"

```

- MatchOp（前缀匹配）

```python
VARCHAR like "prefix"

```

下一步是什么
------

现在，您已经知道在Milvus中如何使用位集，您可能还想：

* 学习如何进行[混合搜索](hybridsearch.md)。

* 学习如何[使用字符串过滤器](https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md)搜索结果。
