


Milvus 的计算操作依赖于 CPU 对 SIMD（单指令多数据）扩展指令集的支持。你的 CPU 是否支持 SIMD 扩展指令集对于 Milvus 内的索引构建和向量相似性搜索至关重要。确保你的 CPU 至少支持以下 SIMD 指令集之一：

- SSE4.2
- AVX
- AVX2
- AVX512

运行 lscpu 命令来检查你的 CPU 是否支持上述的 SIMD 指令集：

```
$ lscpu | grep -e sse4_2 -e avx -e avx2 -e avx512
```

