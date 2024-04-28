---
id: install_offline-helm.md
summary: 学习如何在Kubernetes离线环境中安装Milvus。
title: 使用Helm图表离线安装Milvus
---

# 使用Helm图表离线安装Milvus

本主题描述了如何在离线环境中使用Helm图表安装Milvus。

由于镜像加载错误，Milvus的安装可能会失败。您可以在离线环境中安装Milvus以避免此类问题。

## 下载文件和镜像

要在离线环境中安装Milvus，您需要首先在在线环境中拉取并保存所有镜像，然后将它们传输到目标主机并手动加载。

1. 本地添加并更新Milvus Helm仓库。

```bash
helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update
```

2. 获取Kubernetes清单。

- 对于Milvus独立模式：

```bash
helm template my-release --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false milvus/milvus > milvus_manifest.yaml
```

- 对于Milvus集群模式：

```bash
helm template my-release milvus/milvus > milvus_manifest.yaml
```

如果您想更改多个配置，可以下载一个[`values.yaml`](https://github.com/milvus-io/milvus-helm/blob/master/charts/milvus/values.yaml)文件，在其中指定配置，并基于它生成清单。

```bash
wget https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml
helm template -f values.yaml my-release milvus/milvus > milvus_manifest.yaml
```

3. 下载需求和脚本文件。

```bash
$ wget https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/offline/requirements.txt
$ wget https://raw.githubusercontent.com/milvus-io/milvus/master/deployments/offline/save_image.py
```

4. 拉取并保存镜像。

```bash
pip3 install -r requirements.txt
python3 save_image.py --manifest milvus_manifest.yaml
```

<div class="alert note">
镜像存储在<code>/images</code>文件夹中。
</div>

5. 加载镜像。

```bash
cd images/for image in $(find . -type f -name "*.tar.gz") ; do gunzip -c $image | docker load; done
```

## 离线安装Milvus

将镜像传输到目标主机后，运行以下命令以离线方式安装Milvus。

```bash
kubectl apply -f milvus_manifest.yaml
```

## 卸载Milvus

要卸载Milvus，请运行以下命令。

```bash
kubectl delete -f milvus_manifest.yaml
```

## 接下来做什么

安装Milvus后，您可以：

- 查看[Hello Milvus](quickstart.md)，使用不同的SDK运行示例代码，了解Milvus能做什么。

- 学习Milvus的基本操作：
  - [管理集合](manage-collections.md)
  - [管理分区](manage-partitions.md)
  - [插入、更新和删除](insert-update-delete.md)
  - [单向量搜索](single-vector-search.md)
  - [多向量搜索](multi-vector-search.md)

- [使用Helm图表升级Milvus](upgrade_milvus_cluster-helm.md)。
- [扩展您的Milvus集群](scaleout.md)。
- 探索[MilvusDM](migrate_overview.md)，这是一个为Milvus中导入和导出数据而设计的开源工具。
- [使用Prometheus监控Milvus](monitor.md)。