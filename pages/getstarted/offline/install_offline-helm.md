


# 使用 Helm Charts 离线安装 Milvus

本主题描述了如何在离线环境中使用 Helm Charts 安装 Milvus。

由于图像加载错误，安装 Milvus 可能会失败。你可以在离线环境中安装 Milvus 以避免此类问题。

## 下载文件和图像

要离线安装 Milvus，你需要首先在联机环境中拉取并保存所有图像，然后将它们传输到目标主机并手动加载。

1. 在本地添加和更新 Milvus Helm 仓库。

```bash
helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update
```

2. 获取 Kubernetes 清单。

- 对于独立部署的 Milvus：

```bash
helm template my-release --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false milvus/milvus > milvus_manifest.yaml
```

- 对于 Milvus 集群：

```bash
helm template my-release milvus/milvus > milvus_manifest.yaml
```

如果你想更改多个配置，可以下载 [`value.yaml`](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml) 文件，为其指定配置，并基于该文件生成清单。

```bash
wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml
helm template -f values.yaml my-release milvus/milvus > milvus_manifest.yaml
```

3. 下载要求和脚本文件。

```bash
wget https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/offline/requirements.txt
wget https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/offline/save_image.py
```

4. 拉取并保存图像。

```bash
pip3 install -r requirements.txt
python3 save_image.py --manifest milvus_manifest.yaml
```

<div class="alert note">
图像存储在 <code>/images </code> 文件夹中。
</div>

5. 加载图像。

```bash
cd images/for image in $(find . -type f -name "*.tar.gz") ; do gunzip -c $image | docker load; done
```

## 离线安装 Milvus

在将图像传输到目标主机后，运行以下命令以离线安装 Milvus。

```bash
kubectl apply -f milvus_manifest.yaml
```

## 卸载 Milvus

要卸载 Milvus，请运行以下命令。

```bash
kubectl delete -f milvus_manifest.yaml
```

## 下一步操作



已安装 Milvus 后，你可以：

- 检查 [Hello Milvus](/getstarted/quickstart.md) ，使用不同的 SDK 运行示例代码，了解 Milvus 的功能。

- 学习 Milvus 的基本操作：
  - [管理集合](/userGuide/manage-collections.md)
  - [管理分区](/userGuide/manage-partitions.md)
  - [插入、更新和删除](/userGuide/insert-update-delete.md)
  - [单向量搜索](/userGuide/search-query-get/single-vector-search.md)
  - [多向量搜索](/userGuide/search-query-get/multi-vector-search.md)

- [使用 Helm Chart 升级 Milvus](/adminGuide/upgrade_milvus_cluster-helm.md)。
- [扩展 Milvus 集群](/adminGuide/scaleout.md)。
- 探索 [MilvusDM](/migrate/migrate_overview.md)，一个专为在 Milvus 中导入和导出数据而设计的开源工具。
- [使用 Prometheus 监控 Milvus](/adminGuide/monitor/monitor.md)。

