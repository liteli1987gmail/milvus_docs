---
title: 使用 Milvus 进行图像搜索

---

# 使用 Milvus 进行图像搜索

## 概述

本页面将介绍一个简单的使用 Milvus 进行图像搜索的示例。我们要搜索的数据集是可以在 [Kaggle](https://www.kaggle.com/datasets/delayedkarma/impressionist-classifier-data) 上找到的印象派画家分类数据集。在这个示例中，我们已经将数据重新托管在公共的 Google Drive 上。

在这个示例中，我们只是使用预训练的 Torchvision Resnet50 模型来获取嵌入向量。让我们开始吧！

## 安装依赖

在这个示例中，我们将使用 `pymilvus` 来连接并使用 Milvus，使用 `torch` 来运行嵌入模型，使用 `torchvision` 来获取实际的模型和预处理，使用 `gdown` 来下载示例数据集，以及使用 `tqdm` 来显示加载条。

```shell
pip install pymilvus torch gdown torchvision tqdm
```

## 获取数据

我们将使用 `gdown` 从 Google Drive 获取 zip 文件，然后使用内置的 `zipfile` 库解压缩它。

```python
import gdown
import zipfile

url = 'https://drive.google.com/uc?id=1OYDHLEy992qu5C4C8HV5uDIkOWRTAR1_'
output = './paintings.zip'
gdown.download(url, output)

with zipfile.ZipFile("./paintings.zip","r") as zip_ref:
    zip_ref.extractall("./paintings")
```

<div class="alert note">

数据集的大小为 2.35 GB，下载所需的时间取决于您的网络条件。

</div>

## 全局参数

以下是我们将要使用的一些主要全局参数，以便更容易地跟踪和更新。

```python
# Milvus 设置参数
COLLECTION_NAME = 'image_search'  # 集合名称
DIMENSION = 2048  # 本例中的嵌入向量大小
MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"

# 推理参数
BATCH_SIZE = 128
TOP_K = 3
```

## 设置 Milvus

在这一点上，我们将开始设置 Milvus。步骤如下：

1. 使用提供的 URI 连接到 Milvus 实例。

    ```python
    from pymilvus import connections

    # 连接到实例
    connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
    ```

2. 如果集合已经存在，就删除它。

    ```python
    from pymilvus import utility

    # 删除同名的任何之前的集合
    if utility.has_collection(COLLECTION_NAME):
        utility.drop_collection(COLLECTION_NAME)
    ```

3. 创建一个包含 ID、图像文件路径和其嵌入向量的集合。

    ```python
    from pymilvus import FieldSchema, CollectionSchema, DataType, Collection

    # 创建集合，包括 id、图像文件路径和图像嵌入
    fields = [
        FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name='filepath', dtype=DataType.VARCHAR, max_length=200),  # VARCHARS 需要一个最大长度，因此在这个示例中它们被设置为 200 个字符
        FieldSchema(name='image_embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
    ]
    schema = CollectionSchema(fields=fields)
    collection = Collection(name=COLLECTION_NAME, schema=schema)
    ```

4. 在新创建的集合上创建一个索引并将其加载到内存中。

    ```python
    # 为集合创建 AutoIndex 索引
    index_params = {
    'metric_type':'L2',
    'index_type':"IVF_FLAT",
    'params':{'nlist': 16384}
    }
    collection.create_index(field_name="image_embedding", index_params=index_params)
    collection.load()
    ```

完成这些步骤后，集合就准备好插入和搜索了。任何添加的数据都将自动被索引，并且可以立即用于搜索。如果数据非常新，搜索可能会变慢，因为对于仍在索引过程中的数据，将使用暴力搜索。

## 插入数据

在这个示例中，我们将使用 `torch` 提供的 ResNet50 模型及其模型库。为了获得嵌入向量，我们去掉了最后的分类层，这样模型就会给我们提供 2048 维的嵌入向量。在 `torch` 上找到的所有视觉模型都使用我们这里包含的相同的预处理。

在接下来的几个步骤中，我们将：

1. 加载数据。

    ```python
    import glob

    # 获取图像的文件路径
    paths = glob.glob('./paintings/paintings