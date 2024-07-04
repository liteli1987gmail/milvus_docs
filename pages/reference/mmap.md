

               
# MMap-enabled Data Storage

在 Milvus 中，内存映射文件允许直接把文件内容映射到内存中。这个特性提高了内存的效率，特别是在可用内存有限但完整数据加载不可行的情况下。这种优化机制可以增加数据容量，同时保证性能在一定限度内；然而，当数据量超过内存太多时，搜索和查询性能可能会严重降低，因此请根据需要选择是否打开此功能。

## 配置内存映射

从 Milvus 2.4 开始，你可以灵活地调整静态配置文件以配置整个集群的默认内存映射设置。此外，你还可以选择在集群和索引级别动态修改参数，以微调内存映射设置。未来的更新将扩展内存映射功能，包括字段级配置。

### 部署集群前：全局配置

在部署集群之前，集群级别的设置将会应用于整个集群的内存映射。这确保所有新的对象都会自动遵守这些配置。需要注意的是，修改这些设置需要重启集群才能生效。

要调整集群的内存映射设置，请编辑 `configs/milvus.yaml` 文件。在这个文件中，你可以指定是否默认启用内存映射，并确定存储内存映射文件的目录路径。如果未指定路径（`mmapDirPath`），系统会默认将内存映射文件存储在 `{localStorage.path}/mmap`。更多信息，请参阅 [本地存储相关配置](https://milvus.io/docs/configure_localstorage.md#localStoragepath)。

```yaml
# This parameter was set in configs/milvus.yaml
...
queryNode:
  mmap:
    # Set memory mapping property for whole cluster
    mmapEnabled: false | true
    # Set memory-mapped directory path, if you leave mmapDirPath unspecified, the memory-mapped files will be stored in {localStorage.path}/ mmap by default. 
    mmapDirPath: any/valid/path 
....
```

### 集群运行时：动态配置

在集群运行时，你可以在集合或索引级别动态调整内存映射设置。

在集合级别，内存映射将应用于集合中的所有未索引的原始数据，不包括主键、时间戳和行 ID。这种方法特别适用于大型数据集的全面管理。

要在集合内动态调整内存映射设置，请使用 `set_properties()` 方法。在这里，你可以根据需要将 `mmap.enabled` 切换为 `True` 或 `False`。

```python
# Get existing collection
collection = Collection("test_collection") # Replace with your collection name

# Set memory mapping property to True or Flase
collection.set_properties({'mmap.enabled': True})
```

对于索引级别的设置，可以特定地将内存映射应用于向量索引，而不影响其他数据类型。这个特性对于需要优化向量搜索性能的集合非常有价值。

要为集合中的索引启用或禁用内存映射，请调用 `alter_index()` 方法，指定目标索引名称为 `index_name`，并将 `mmap.enabled` 设置为 `True` 或 `False`。

```python
collection.alter_index(
    index_name="vector_index", # Replace with your vector index name
    extra_params={"mmap.enabled": True} # Enable memory mapping for index
)
```

## 在不同部署中定制存储路径

内存映射文件默认存储在 `localStorage.path` 下的 `/mmap` 目录中。以下是如何在各种部署方法中自定义此设置的方式：

- 使用 Helm Chart 安装的 Milvus：

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

- 使用 Milvus Operator 安装的 Milvus：

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

- 使用 Docker 安装的 Milvus：

```bash
# 提供了一个新的安装脚本以启用与mmap相关的设置。
```

## 限制
 


- 无法为已加载的集合启用内存映射，请在启用内存映射之前确保集合已被释放。

- DiskANN 或 GPU 级别的索引不支持内存映射。

## 常见问题



- __在哪些场景下建议启用内存映射？启用此功能后有什么权衡之处？__

    当内存有限或性能要求适中时，建议启用内存映射。启用此功能可以增加数据加载的容量。例如，配置为 2 个 CPU 和 8GB 内存，启用内存映射可以使加载的数据量增加到未启用时的 4 倍。对性能的影响因情况而异：

    - 在内存充足的情况下，预期性能类似于仅使用内存时的性能。

    - 在内存不足的情况下，预期性能可能会下降。

- __集合级和索引级配置之间有什么关系？__

    集合级和索引级不是相互包含的关系，集合级配置用于控制原始数据是否启用 mmap，而索引级配置仅适用于向量索引。

- __是否有建议的内存映射索引类型？__

    是的，推荐使用 HNSW 索引进行内存映射。我们之前测试过 HNSW、IVF_FLAT、IVF_PQ/SQ 系列索引，IVF 系列索引的性能严重下降，而对于 HNSW 索引开启 mmap 的性能下降仍然在预期范围内。

- __内存映射需要什么样的本地存储？__

    高质量的磁盘可以提高性能，NVMe 驱动器是首选选项。

- __标量数据可以进行内存映射吗？__

    标量数据可以应用内存映射，但对标量字段上建立的索引不适用。

- __如何确定不同级别内存映射配置的优先级？__

    在 Milvus 中，当显式定义多个级别的内存映射配置时，索引级和集合级配置具有最高优先级，随后是集群级配置。

- __如果我从 Milvus 2.3 升级，而且已经配置了内存映射目录路径，会发生什么？__

    如果你从 Milvus 2.3 升级，并且已经配置了内存映射目录路径（`mmapDirPath`），你的配置将被保留，并且内存映射已启用的默认设置将为 `true`。重要的是要迁移元数据以保持现有内存映射文件的配置同步。有关详细信息，请参阅 [Migrate the metadata](https://milvus.io/docs/upgrade_milvus_standalone-docker.md#Migrate-the-metadata)。
