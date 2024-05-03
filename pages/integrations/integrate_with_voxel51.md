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

或者，您可以通过设置以下环境变量，将FiftyOne永久配置为使用Milvus后端：

```shell
export FIFTYONE_BRAIN_DEFAULT_SIMILARITY_BACKEND=milvus
```

或者通过设置[brain config](https://docs.voxel51.com/user_guide/brain.html#brain-config)位于`~/.5ftyone/brain_config.json` 的`default_simility_backend`参数：

```json
{
  "default_similarity_backend": "milvus"
}
```

## 身份验证

如果您使用的是自定义Milvus服务器，您可以通过多种方式提供凭据。

### 环境变量（推荐）

配置Milvus凭据的建议方法是将它们存储在下面显示的环境变量中，只要连接到Milvus，FiftyOne就会自动访问这些环境变量。

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

### FiftyOne大脑配置

你也可以将你的凭据存储在你的 [brain config](https://docs.voxel51.com/user_guide/brain.html#brain-config) 中 , 本地地址为 `~/.fiftyone/brain_config.json`:

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

请注意，在创建此文件之前，该文件将不存在。

### 关键字参数

每次调用像[`compute_smilarity()`]这样的方法时，您可以手动将Milvus凭据作为关键字参数提供(https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity)需要连接Milvus：

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

请注意，使用此策略时，必须在稍后通过[`load_brain_results()`]加载索引时手动提供凭据(https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.load_brain_results):

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

### Milvus配置参数

Milvus后端支持各种查询参数，这些参数可用于自定义相似性查询。这些参数包括：

-**collection_name**(_None_)：要使用或创建的Milvus集合的名称。如果没有提供，将创建一个新集合

-**metric**(_"dotproduct"_)：创建新索引时使用的嵌入距离度量。支持的值为(`"点积"`，`"欧几里得"`）

-**consistency_level**(_"会话"_)：要使用的一致性级别。支持的值为（`"Strong"`、`"Session"`、`"Bounded"`和`"Finally"`）

有关这些参数的详细信息，请参阅[Milvus身份验证文档](authenticate.md)和[Milvus-consistent-levelsdocumentation](consistent.md)。

您可以通过上一节中描述的任何策略指定这些参数。下面是一个[brain config]的例子(https://docs.voxel51.com/user_guide/brain.html#brain-config），其包括所有可用参数：

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

但是，这些参数通常直接传递给 [`compute_similarity()`](https://docs.voxel51.com/api/fiftyone.brain.html#fiftyone.brain.compute_similarity) 去配置特定的新索引：

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

FiftyOne 提供了多种方法，可以用来管理 brain 运行。

举个例子, 你可以 [`list_brain_runs()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.list_brain_runs) 查看数据集上可用的 brain 密钥:

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

或者，您可以使用 [`get_brain_info()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.get_brain_info) 以检索关于脑运行的配置的信息：

```python
info = dataset.get_brain_info(brain_key)
print(info)
```

使用 [`load_brain_results()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.load_brain_results) 去加载 [`SimilarityIndex`](https://docs.voxel51.com/api/fiftyone.brain.similarity.html#fiftyone.brain.similarity.SimilarityIndex) 例子来运行 brain.

你可以使用 [`rename_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.rename_brain_run) 去重命名与现有相似性结果运行相关联的 brain 密钥:

```python
dataset.rename_brain_run(brain_key, new_brain_key)
```

最后，您可以使用 [`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run) 去删除 brain:

```python
dataset.delete_brain_run(brain_key)
```

<div class="alert note">

调用[`delete_brain_run()`](https://docs.voxel51.com/api/fiftyone.core.collections.html#fiftyone.core.collections.SampleCollection.delete_brain_run)仅从FiftyOne数据集中删除大脑运行的记录；它不会删除任何相关的Milvus集合，您可以按如下方式执行：

```python
# Delete the Milvus collection
milvus_index = dataset.load_brain_results(brain_key)
milvus_index.cleanup()
```

</div>

有关使用Milvus后端在FiftyOne数据集上的常见矢量搜索工作流，请参阅[此处的示例](https://docs.voxel51.com/integrations/milvus.html#examples).

