# 标量过滤规则

## 概览

谓词表达式输出一个布尔值。Milvus 通过使用谓词进行标量过滤搜索。谓词表达式在评估时返回 TRUE 或 FALSE。查看 [Python SDK API 参考](/api-reference/pymilvus/v{{var.milvus_python_sdk_version}}/Collection/query().md) 了解如何使用谓词表达式。

使用扩展巴科斯范式（EBNF）语法规则描述布尔表达式规则：

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

下表列出了上述布尔表达式规则中提到的每个符号的描述。

| 符号      | 描述 |
| ----------- | ----------- |
| =      | 定义。       |
| ,      | 连接。       |
| ;      | 结束。        |
| \|      | 选择。       |
| {...}   | 重复。        |
| (...)      | 分组。       |
| NIL   | 空。表达式可以为空字符串。        |
| INTEGER      | 整数，如 1, 2, 3。       |
| FLOAT   | 浮点数，如 1.0, 2.0。        |
| CONST      | 整数或浮点数。       |
| IDENTIFIER   | 标识符。在 Milvus 中，IDENTIFIER 表示字段名称。        |
| LogicalOp      | LogicalOp 是一个逻辑运算符，支持在一次比较中组合多个关系操作。LogicalOp 的返回值是 TRUE（1）或 FALSE（0）。有两种类型的 LogicalOps，包括 BinaryLogicalOps 和 UnaryLogicalOps。    |
| UnaryLogicalOp   | UnaryLogicalOp 指的是一元逻辑运算符 "not"。        |
| BinaryLogicalOp   | 二元逻辑运算符对两个操作数执行操作。在具有两个或更多操作数的复杂表达式中，计算顺序取决于优先级规则。       |
| ArithmeticOp   | ArithmeticOp，即算术运算符，在操作数上执行数学运算，如加法和减法。         |
| UnaryArithOp      | UnaryArithOp 是一个算术运算符，对单个操作数执行操作。负的 UnaryArithOp 将正表达式变为负表达式，或反之亦然。      |
| BinaryArithOp   | BinaryArithOp，即二元运算符，在两个操作数上执行操作。在具有两个或更多操作数的复杂表达式中，计算顺序取决于优先级规则。        |
| CmpOp   | CmpOp 是关系运算符，对两个操作数执行操作。        |
| CmpOpRestricted      |  CmpOpRestricted 限制为 "小于" 和 "等于"。       |
| ConstantExpr   | ConstantExpr 可以是常量或两个 ConstExprs 上的 BinaryArithOp 或单个 ConstantExpr 上