


# 使用 Milvus 和 FiftyOne 进行视觉搜索

[FiftyOne](https://docs.voxel51.com/) 是一个用于构建高质量数据集和计算机视觉模型的开源工具。本指南将帮助你将 Milvus 的相似度搜索功能集成到 FiftyOne 中，使你能够在自己的数据集上进行视觉搜索。

FiftyOne 提供了一个 API，用于创建 Milvus 集合、上传向量和运行相似度查询，可通过 [编程方式](https://docs.voxel51.com/integrations/milvus.html#milvus-query)（使用 Python）或通过点击来进行操作。本页面的演示重点是程序化集成。

## 先决条件

在开始之前，请确保你具备以下条件：

- 已运行的 [Milvus 服务器](/getstarted/standalone/install_standalone-docker.md)。
- 配有已安装 `pymilvus` 和 `fiftyone` 的 Python 环境。
- 用于搜索的图像 [数据集](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets)。

## 安装要求

在本示例中，我们将使用 `pymilvus` 和 `fiftyone`。你可以通过运行以下命令来安装它们：

```shell
python3 -m pip install pymilvus fiftyone torch torchvision
```

## 基本步骤

使用 Milvus 在 FiftyOne 数据集上创建相似性索引并使用它来查询数据的基本工作流程如下：

1. 将一个 [数据集](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets) 加载到 FiftyOne。
2. 为数据集中的样本或路径计算向量嵌入，或选择一个要用于生成嵌入的模型。
3. 使用 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 方法生成数据集中样本或对象路径的 Milvus 相似性索引，设置参数 `backend="milvus"` 并指定自己选择的 `brain_key`。
4. 使用该 Milvus 相似性索引通过 [`sort_by_similarity()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.sort_by_similarity) 来查询数据。
5. 如果需要，删除索引。

## 步骤

下面的示例演示了上述工作流程。

### 1. 加载数据集到 FiftyOne 并为样本计算嵌入向量

下面的代码使用 FiftyOne 提供的示例图像集来演示集成。你可以参考 [此文章](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets) 来准备自己的图像集。

```python
import fiftyone as fo
import fiftyone.brain as fob
import fiftyone.zoo as foz

# 步骤 1：加载数据到 FiftyOne
dataset = foz.load_zoo_dataset("quickstart")

# 步骤 2 和 3：计算嵌入和创建相似性索引
milvus_index = fob.compute_similarity(
    dataset,
    brain_key="milvus_index",
    backend="milvus",
)
```

### 2. 进行视觉相似度搜索

现在，你可以使用 Milvus 相似性索引在数据集上进行视觉相似度搜索。

```python
# 步骤 4：查询数据
query = dataset.first().id  # 按照样本 ID 进行查询
view = dataset.sort_by_similarity(
    query,
    brain_key="milvus_index",
    k=10,  # 限制为最相似的 10 个样本
)

# 步骤 5（可选）：清理

# 删除 Milvus 集合
milvus_index.cleanup()

# 从 FiftyOne 中删除运行记录
dataset.delete_brain_run("milvus_index")
```

### 3. 删除索引

如果你不再需要 Milvus 相似性索引，你可以使用以下代码进行删除：

```python
# 步骤 5：删除索引
milvus_index.delete()
```

## 使用 Milvus 后端




默认情况下，调用 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 或 `sort_by_similarity()` 将使用 sklearn 后端。

要使用 Milvus 后端，只需将 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 的可选后端参数设置为 `"milvus"`：

```python
import fiftyone.brain as fob

fob.compute_similarity(..., backend="milvus", ...)
```

或者，你可以永久配置 FiftyOne 使用 Milvus 后端，方法是设置以下环境变量：

```shell
export FIFTYONE_BRAIN_DEFAULT_SIMILARITY_BACKEND=milvus
```

或者在位于 `~/.fiftyone/brain_config.json` 的 [brain 配置](https://docs.voxel51.com/user_guide/brain.html#brain-config) 中设置 `default_similarity_backend` 参数：

```json
{
    "default_similarity_backend": "milvus"
}
```

## 身份验证

如果你使用自定义的 Milvus 服务器，可以以多种方式提供凭据。

### 环境变量（推荐）

配置 Milvus 凭据的推荐方法是将它们存储在下面显示的环境变量中，FiftyOne 在连接到 Milvus 时会自动访问这些变量。

```python
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_URI=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_USER=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_PASSWORD=XXXXXX

# 如果必要，也可用以下变量
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SECURE=true
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_TOKEN=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_DB_NAME=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CLIENT_KEY_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CLIENT_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CA_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SERVER_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SERVER_NAME=XXXXXX
```

### FiftyOne Brain 配置

你还可以将凭据存储在位于 `~/.fiftyone/brain_config.json` 的 [brain 配置](https://docs.voxel51.com/user_guide/brain.html#brain-config) 中：

```python
{
    "similarity_backends": {
        "milvus": {
            "uri": "XXXXXX",
            "user": "XXXXXX",
            "password": "XXXXXX",

            # 如果必要，还可用以下变量
            "secure": true,
            "token": "XXXXXX",
            "db_name": "XXXXXX",
            "client_key_path": "XXXXXX",
            "client_pem_path": "XXXXXX",
            "ca_pem_path": "XXXXXX",
            "server_pem_path": "XXXXXX",
            "server_name": "XXXXXX"
        }
    }
}
```

请注意，此文件在创建之前将不存在。

### 关键字参数





你可以在调用 `compute_similarity()` 等需要连接 Milvus 的方法时，手动提供 Milvus 凭据作为关键字参数：

```python
import fiftyone.brain as fob

milvus_index = fob.compute_similarity(
    ...
    backend="milvus",
    brain_key="milvus_index",
    uri="XXXXXX",
    user="XXXXXX",
    password="XXXXXX",

    # 如果有需要，也可以使用以下选项
    secure=True,
    token="XXXXXX",
    db_name="XXXXXX",
    client_key_path="XXXXXX",
    client_pem_path="XXXXXX",
    ca_pem_path="XXXXXX",
    server_pem_path="XXXXXX",
    server_name="XXXXXX",
)
```

请注意，使用此策略时，你必须在稍后通过 `load_brain_results()` 手动提供凭据来加载索引：

```python
milvus_index = dataset.load_brain_results(
    "milvus_index",
    uri="XXXXXX",
    user="XXXXXX",
    password="XXXXXX",

    # 如果有需要，也可以使用以下选项
    secure=True,
    token="XXXXXX",
    db_name="XXXXXX",
    client_key_path="XXXXXX",
    client_pem_path="XXXXXX",
    ca_pem_path="XXXXXX",
    server_pem_path="XXXXXX",
    server_name="XXXXXX",
)
```

### Milvus 配置参数

Milvus 后端支持各种查询参数，可以用于自定义相似性查询。这些参数包括：

- **collection_name**（*None*）：要使用或创建的 Milvus 集合的名称。如果未提供，则会创建一个新的集合

- **metric**（*"dotproduct"*）：在创建新索引时要使用的嵌入距离度量。支持的值为（`"dotproduct"`，`"euclidean"`）

- **consistency_level**（*"Session"*）：要使用的一致性级别。支持的值为（`"Strong"`，`"Session"`，`"Bounded"`，`"Eventually"`）

有关这些参数的详细信息，请参阅 [Milvus 认证文档](/adminGuide/authenticate.md) 和 [Milvus 一致性级别文档](/reference/consistency.md)。

你可以通过前面部分描述的任何策略来指定这些参数。以下是包含所有可用参数的 [脑配置](https://docs.voxel51.com/user_guide/brain.html#brain-config) 的示例：

```json
{
    "similarity_backends": {
        "milvus": {
            "collection_name": "your_collection",
            "metric": "dotproduct",
            "consistency_level": "Strong"
        }
    }
}
```

但通常，这些参数直接传递给 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 以配置一个特定的新索引：

```python
milvus_index = fob.compute_similarity(
    ...
    backend="milvus",
    brain_key="milvus_index",
    collection_name="your_collection",
    metric="dotproduct",
    consistency_level="Strong",
)
```

## 管理脑算法运行
 


FiftyOne 提供了多种方法来管理 brain run。

例如，你可以调用 [`list_brain_runs()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.list_brain_runs) 来查看数据集上的可用 brain 键：

```python
import fiftyone.brain as fob

# 列出所有brain runs
dataset.list_brain_runs()

# 仅列出相似性runs
dataset.list_brain_runs(type=fob.Similarity)

# 仅列出特定的相似性runs
dataset.list_brain_runs(
    type=fob.Similarity,
    patches_field="ground_truth",
    supports_prompts=True,
)
```

或者，你可以使用 [`get_brain_info()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.get_brain_info) 来检索有关 brain run 配置的信息：

```python
info = dataset.get_brain_info(brain_key)
print(info)
```

使用 [`load_brain_results()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.load_brain_results) 来加载 brain run 的 [`SimilarityIndex`](https://docs.voxel51.com/api/fiftyone.brain.similarity.html#fiftyone.brain.similarity.SimilarityIndex) 实例。

你可以使用 [`rename_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.rename_brain_run) 来重命名与现有相似性结果 run 关联的 brain 键：

```python
dataset.rename_brain_run(brain_key, new_brain_key)
```

最后，你可以使用 [`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run) 来删除 brain run：

```python
dataset.delete_brain_run(brain_key)
```

<div class="alert note">

调用 [`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run) 仅会从你的 FiftyOne 数据集中删除 brain run 的记录；它不会删除任何关联的 Milvus 集合，你可以按如下方式删除：

```python
# 删除Milvus集合
milvus_index = dataset.load_brain_results(brain_key)
milvus_index.cleanup()
```

</div>

在 FiftyOne 数据集上使用 Milvus 后端进行常见的向量搜索工作流程，请参阅 [这里的示例](https://docs.voxel51.com/integrations/milvus.html#examples)。
