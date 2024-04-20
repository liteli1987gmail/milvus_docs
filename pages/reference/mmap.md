# MMap 启用的数据存储

在 Milvus 中，内存映射文件允许将文件内容直接映射到内存中。这个特性增强了内存效率，特别是在可用内存稀缺但完全加载数据不可行的情况下。这种优化机制可以在确保性能达到一定限制的同时增加数据容量；然而，当数据量超过内存太多时，搜索和查询性能可能会严重下降，因此请根据需要选择开启或关闭此特性。

## 配置内存映射

从 Milvus 2.4 开始，您有灵活性在部署前调整静态配置文件，以配置整个集群的默认内存映射设置。此外，您还可以选择动态更改参数，以微调集群和索引级别的内存映射设置。展望未来，未来的更新将扩展内存映射功能，包括字段级配置。

### 在集群部署前：全局配置

在您部署集群之前，_集群级_ 设置将内存映射应用于整个集群。这确保所有新对象将自动遵循这些配置。重要的是要注意，修改这些设置需要重新启动集群才能生效。

要调整您的集群内存映射设置，请编辑 `configs/milvus.yaml` 文件。在该文件中，您可以指定是否默认启用内存映射，并确定存储内存映射文件的目录路径。如果路径（`mmapDirPath`）未指定，系统默认将内存映射文件存储在 `{localStorage.path}/mmap` 中。有关更多信息，请参阅 [本地存储相关配置](https://milvus.io/docs/configure_localstorage.md#localStoragepath)。

```yaml
# 此参数设置在 configs/milvus.yaml 中
...
queryNode:
  mmap:
    # 为整个集群设置内存映射属性
    mmapEnabled: false | true
    # 设置内存映射目录路径，如果您离开 mmapDirPath 未指定，默认情况下内存映射文件将存储在 {localStorage.path}/ mmap 中。
    mmapDirPath: 任何/有效/路径 
....
```

### 在集群运行期间：动态配置

在集群运行时，您可以在集合或索引级别动态调整内存映射设置。

在 _集合级别_，内存映射应用于集合中的所有未索引原始数据，不包括主键、时间戳和行 ID。这种方法特别适合于全面管理大型数据集。

要动态调整集合内的内存映射设置，请使用 `set_properties()` 方法。在这里，您可以根据需要在 `True` 或 `False` 之间切换 `mmap.enabled`。

```python
# 获取现有集合
collection = Collection("test_collection") # 替换为您的集合名称

# 将内存映射属性设置为 True 或 Flase
collection.set_properties({'mmap.enabled': True})
```

对于 _索引级别_ 设置，内存映射可以专门应用于向量索引，而不影响其他数据类型。这个特性对于需要为向量搜索优化性能的集合来说非常有价值。

要启用或禁用集合内索引的内存映射，请调用 `alter_index()` 方法，指定目标索引名称在 `index_name` 中，并将 `mmap.enabled` 设置为 `True` 或 `False`。

```python
collection.alter_index(
    index_name="vector_index", # 替换为您的向量索引名称
    extra_params={"mmap.enabled": True} # 为索引启用内存映射
)
```

## 在不同部署中自定义存储路径

内存映射文件默认存储在 `localStorage.path` 中的 `/mmap` 目录。以下是如何在不同部署方法中自定义此设置：

- 对于使用 Helm Chart 安装的 Milvus：

```bash
# new-values.yaml
extraConfigFiles:
   user.yaml: |+
      queryNode:
         mmap:
           mmapEnabled: true
           mmapDirPath: any/valid/path
        
helm upgrade <milvus-release> --reuse-values -f new-values.yaml milvus/milvus
```

- 对于使用 Milvus Operator 安装的 Milvus：

```bash
# patch.yaml
spec:
  config:
    queryNode:
      mmap:
        mmapEnabled: true
        mmapDirPath: any/valid/path
      
 kubectl patch milvus <milvus-name> --patch-file patch.yaml
```

- 对于使用 Docker 安装的 Milvus：

```bash
# 提供了一个新的安装脚本以启用 mmap 相关设置。
```

## 限制

- 不能为已加载的集合启用内存映射，确保在启用内存映射之前已释放集合。

- 不支持为 DiskANN 或 GPU 类索引启用内存映射。

## 常见问题解答

- __在哪些场景下建议启用内存映射？启用此特性后的权衡是什么？__

    当内存有限或性能要求适中时，建议启用内存映射。启用此特性可以增加数据加载容量。例如，在配置为 2 个 CPU 和 8 GB 内存的情况下，启用内存映射可以允许加载的数据量