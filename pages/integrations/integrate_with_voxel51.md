---
id: integrate_with_voxel51.md
summary: 本页讨论与 voxel51 的集成
title: 使用 Milvus 和 FiftyOne 进行视觉搜索
---

# 使用 Milvus 和 FiftyOne 进行视觉搜索

[FiftyOne](https://docs.voxel51.com/) 是一个用于构建高质量数据集和计算机视觉模型的开源工具。本指南将帮助您将 Milvus 的相似性搜索功能集成到 FiftyOne 中，使您能够在自己的数据集上进行视觉搜索。

FiftyOne 提供了一个 API，用于创建 Milvus 集合、上传向量和运行相似性查询，既可以通过 Python [编程方式](https://docs.voxel51.com/integrations/milvus.html#milvus-query)，也可以通过应用程序中的点击操作来实现。本页的演示重点介绍编程集成。

## 前提条件

开始之前，请确保您具备以下条件：

- 一个运行中的 [Milvus 服务器](install_standalone-docker.md)。
- 一个安装了 `pymilvus` 和 `fiftyone` 的 Python 环境。
- 一个 [数据集](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets) 用于搜索。

## 安装要求

对于本示例，我们将使用 `pymilvus` 和 `fiftyone`。您可以通过运行以下命令来安装它们：

```shell
python3 -m pip install pymilvus fiftyone torch torchvision
```

## 基本步骤

使用 Milvus 创建 FiftyOne 数据集的相似性索引并使用该索引查询数据的基本工作流程如下：

1. 将 [数据集](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets) 加载到 FiftyOne 中
2. 计算数据集中样本或补丁的向量嵌入，或选择一个模型来生成嵌入。
3. 使用 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 方法通过设置参数 `backend="milvus"` 并指定您选择的 `brain_key` 来为数据集中的样本或对象补丁生成 Milvus 相似性索引。
4. 使用此 Milvus 相似性索引通过 [`sort_by_similarity()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.sort_by_similarity) 查询您的数据。
5. 如果需要，删除索引。

## 程序

以下示例演示了上述工作流程。

### 1. 将数据集加载到 FiftyOne 中并计算样本的嵌入

以下代码使用 FiftyOne 提供的样本图像集来演示集成。您可以通过参考 [本文](https://docs.voxel51.com/user_guide/dataset_creation/index.html#loading-datasets) 来准备自己的图像集。

```python
import fiftyone as fo
import fiftyone.brain as fob
import fiftyone.zoo as foz

# 第 1 步：将您的数据加载到 FiftyOne 中
dataset = foz.load_zoo_dataset("quickstart")

# 第 2 和第 3 步：计算嵌入并创建相似性索引
milvus_index = fob.compute_similarity(
    dataset,
    brain_key="milvus_index",
    backend="milvus",
)
```

### 2. 进行视觉相似性搜索

现在，您可以使用 Milvus 相似性索引对您的数据集进行视觉相似性搜索。

```python
# 第 4 步：查询您的数据
query = dataset.first().id  # 通过样本 ID 查询
view = dataset.sort_by_similarity(
    query,
    brain_key="milvus_index",
    k=10,  # 限制为 10 个最相似的样本
)

# 第 5 步（可选）：清理

# 删除 Milvus 集合
milvus_index.cleanup()

# 从 FiftyOne 中删除运行记录
dataset.delete_brain_run("milvus_index")
```

### 3. 删除索引

如果您不再需要 Milvus 相似性索引，可以使用以下代码删除它：

```python
# 第 5 步：删除索引
milvus_index.delete()
```

## 使用 Milvus 后端

默认情况下，调用 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 或 `sort_by_similarity()` 将使用 sklearn 后端。

要使用 Milvus 后端，只需将 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 的可选 backend 参数设置为 `"milvus"`

```python
import fiftyone.brain as fob

fob.compute_similarity(..., backend="milvus", ...)
```

Alternatively, you can permanently configure FiftyOne to use the Milvus backend by setting the following environment variable:

```shell
export FIFTYONE_BRAIN_DEFAULT_SIMILARITY_BACKEND=milvus
```

or by setting the `default_similarity_backend` parameter of your [brain config](https://docs.voxel51.com/user_guide/brain.html#brain-config) located at `~/.fiftyone/brain_config.json`:

```json
{
  "default_similarity_backend": "milvus"
}
```

## Authentication

If you are using a custom Milvus server, you can provide your credentials in a variety of ways.

### Environment variables (recommended)

The recommended way to configure your Milvus credentials is to store them in the environment variables shown below, which are automatically accessed by FiftyOne whenever a connection to Milvus is made.

```python
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_URI=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_USER=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_PASSWORD=XXXXXX

# also available if necessary
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SECURE=true
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_TOKEN=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_DB_NAME=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CLIENT_KEY_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CLIENT_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_CA_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SERVER_PEM_PATH=XXXXXX
export FIFTYONE_BRAIN_SIMILARITY_MILVUS_SERVER_NAME=XXXXXX
```

### FiftyOne Brain config

You can also store your credentials in your [brain config](https://docs.voxel51.com/user_guide/brain.html#brain-config) located at `~/.fiftyone/brain_config.json`:

```python
{
    "similarity_backends": {
        "milvus": {
            "uri": "XXXXXX",
            "user": "XXXXXX",
            "password": "XXXXXX",

            # also available if necessary
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

Note that this file will not exist until you create it.

### Keyword arguments

You can manually provide your Milvus credentials as keyword arguments each time you call methods like [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) that require connections to Milvus:

```python
import fiftyone.brain as fob

milvus_index = fob.compute_similarity(
    ...
    backend="milvus",
    brain_key="milvus_index",
    uri="XXXXXX",
    user="XXXXXX",
    password="XXXXXX",

    # also available if necessary
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

Note that, when using this strategy, you must manually provide the credentials when loading an index later via [`load_brain_results()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.load_brain_results):

```python
milvus_index = dataset.load_brain_results(
    "milvus_index",
    uri="XXXXXX",
    user="XXXXXX",
    password="XXXXXX",

    # also available if necessary
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

### Milvus config parameters

The Milvus backend supports a variety of query parameters that can be used to customize your similarity queries. These parameters include:

- **collection_name** (_None_): the name of the Milvus collection to use or create. If none is provided, a new collection will be created

- **metric** (_"dotproduct"_): the embedding distance metric to use when creating a new index. The supported values are (`"dotproduct"`, `"euclidean"`)

- **consistency_level** (_"Session"_): the consistency level to use. Supported values are (`"Strong"`, `"Session"`, `"Bounded"`, `"Eventually"`)

For detailed information on these parameters, see the [Milvus authentication documentation](authenticate.md) and [Milvus consistency levels documentation](consistency.md).

You can specify these parameters via any of the strategies described in the previous section. Here’s an example of a [brain config](https://docs.voxel51.com/user_guide/brain.html#brain-config) that includes all of the available parameters:

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

However, typically these parameters are directly passed to [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) to configure a specific new index:

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

## Manage brain runs

FiftyOne provides a variety of methods that you can use to manage brain runs.

For example, you can call [`list_brain_runs()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.list_brain_runs) to see the available brain keys on a dataset:

```python
import fiftyone.brain as fob

# List all brain runs
dataset.list_brain_runs()

# Only list similarity runs
dataset.list_brain_runs(type=fob.Similarity)

# Only list specific similarity runs
dataset.list_brain_runs(
    type=fob.Similarity,
    patches_field="ground_truth",
    supports_prompts=True,
)
```

Or, you can use [`get_brain_info()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.get_brain_info) to retrieve information about the configuration of a brain run:

```python
info = dataset.get_brain_info(brain_key)
print(info)
```

Use [`load_brain_results()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.load_brain_results) to load the [`SimilarityIndex`](https://docs.voxel51.com/api/fiftyone.brain.similarity.html#fiftyone.brain.similarity.SimilarityIndex) instance for a brain run.

You can use [`rename_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.rename_brain_run) to rename the brain key associated with an existing similarity results run:

```python
dataset.rename_brain_run(brain_key, new_brain_key)
```

Finally, you can use [`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run) to delete a brain run:

```python
dataset.delete_brain_run(brain_key)
```

<div class="alert note">

Calling [`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run) only deletes the record of the brain run from your FiftyOne dataset; it will not delete any associated Milvus collection, which you can do as follows:

```python
# Delete the Milvus collection
milvus_index = dataset.load_brain_results(brain_key)
milvus_index.cleanup()
```

</div>

For common vector search workflow on a FiftyOne dataset using the Milvus backend, see [Examples here](https://docs.voxel51.com/integrations/milvus.html#examples).
