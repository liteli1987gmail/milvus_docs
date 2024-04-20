Milvus 的计算操作依赖于 CPU 对 SIMD（单指令，多数据）扩展指令集的支持。您的 CPU 是否支持 SIMD 扩展指令集对 Milvus 中的索引构建和向量相似性搜索至关重要。请确保您的 CPU 至少支持以下 SIMD 指令集之一：

- SSE4.2
- AVX
- AVX2
- AVX512

您可以运行 lscpu 命令来检查您的 CPU 是否支持上述 SIMD 指令集：

```
$ lscpu | grep -e sse4_2 -e avx -e avx2 -e avx512
```