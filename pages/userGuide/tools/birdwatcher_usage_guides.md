

# 使用 Birdwatcher

本指南介绍如何使用 Birdwatcher 来检查 Milvus 的状态并在运行时进行配置。

## 启动 Birdwatcher

Birdwatcher 是一个命令行工具，你可以按照以下方式启动它：

```shell
./birdwatcher
```

然后你将看到以下提示：

```shell
Offline >
```

## 连接到 etcd

在执行其他操作之前，你需要使用 Birdwatcher 连接到 etcd。

- 使用默认设置进行连接

    ```shell
    Offline > connect
    Milvus(by-dev) >
    ```

- 通过 Pod 中的 Birdwatcher 连接

    如果你选择在 Kubernetes 的 Pod 中运行 Birdwatcher，你需要首先获取 etcd 的 IP 地址，命令如下：

    ```shell
    kubectl get pod my-release-etcd-0 -o 'jsonpath={.status.podIP}'
    ```

    然后访问 Pod 的 Shell。

    ```shell
    kubectl exec --stdin --tty birdwatcher-7f48547ddc-zcbxj -- /bin/sh
    ```

    最后，使用返回的 IP 地址连接到 etcd，命令如下：

    ```shell
    Offline > connect --etcd ${ETCD_IP_ADDR}:2379
    Milvus(by-dev)
    ```

- 使用不同的根路径进行连接

    如果你的 Milvus 的根路径与 `by-dev` 不同，并且你收到与根路径不匹配的错误报告，请按照以下方式连接到 etcd：

    ```shell
    Offline > connect --rootPath my-release
    Milvus(my-release) >
    ```

    如果你不知道 Milvus 的根路径，请按照以下方式连接到 etcd：

    ```shell
    Offline > connect --dry
    using dry mode, ignore rootPath and metaPath
    Etcd(127.0.0.1:2379) > find-milvus
    找到1个候选项:
    my-release
    Etcd(127.0.0.1:2379) > use my-release
    Milvus(my-release) >
    ```

## 检查 Milvus 状态



    你可以使用 `show` 命令来检查 Milvus 的状态。

    ```shell
    Milvus (my-release) > show -h
    用法：
       show [command]

    可用命令：
      alias               列出别名元数据信息
      channel-watch       显示数据协调器元数据存储中的通道监视信息
      checkpoint          列出检查点集合的 vchannel
      collection-history  显示集合的更改历史
      collection-loaded   显示从查询协调器加载的集合的信息
      collections         列出当前可用的集合
      config-etcd         列出由etcd源设置的配置
      configurations      遍历所有在线组件并检查配置
      current-version     
      database            显示来自根协调器元数据的数据库信息
      index               
      partition           列出提供的集合的分区
      querycoord-channel  显示查询协调器集群中的查询节点信息
      querycoord-cluster  显示查询协调器集群中的查询节点信息
      querycoord-task     显示来自查询协调器的任务信息
      replica             列出查询协调器中当前的副本信息
      segment             显示来自数据协调器元数据存储的段信息
      segment-index       显示段索引信息
      segment-loaded      显示来自查询协调器v1元数据的段信息
      segment-loaded-grpc 列出已加载的段信息
      session             列出在线的Milvus组件

    标志：
      -h, --help   显示帮助信息

    使用"show [command] --help"命令查看更多信息。
    ```

    ### 列出会话

    你可以按如下方式列出所有的 etcd 会话：

    ```shell
    Milvus(by-dev) > show session
    Session: datacoord, ServerID: 3, Version: 2.2.11, Address: 10.244.0.8:13333
    Session: datanode, ServerID: 6, Version: 2.2.11, Address: 10.244.0.8:21124
    Session: indexcoord, ServerID: 4, Version: 2.2.11, Address: 10.244.0.8:31000
    Session: indexnode, ServerID: 5, Version: 2.2.11, Address: 10.244.0.8:21121
    Session: proxy, ServerID: 8, Version: 2.2.11, Address: 10.244.0.8:19529
    Session: querycoord, ServerID: 7, Version: 2.2.11, Address: 10.244.0.8:19531
    Session: querynode, ServerID: 2, Version: 2.2.11, Address: 10.244.0.8:21123
    Session: rootcoord, ServerID: 1, Version: 2.2.11, Address: 10.244.0.8:53100
    ```

    在命令输出中，你可以找到所有 Milvus 组件到 etcd 的会话。

    ### 检查数据库和集合
 


你可以列出所有数据库和集合。

- 列出数据库

    在命令输出中，你可以找到有关每个数据库的信息。

    ```shell
    Milvus(by-dev) > show database
    =============================
    ID: 1   名称: default
    租户ID:        状态: DatabaseCreated
    --- 总数据库数: 1
    ```

- 列出集合

    在命令输出中，你可以找到有关每个集合的详细信息。

    ```shell
    Milvus(by-dev) > show collections
    ================================================================================
    DBID: 1
    集合ID: 443407225551410746       集合名称: medium_articles_2020
    集合状态: CollectionCreated     创建时间: 2023-08-08 09:27:08
    字段:
    - 字段ID: 0   字段名称: RowID       字段类型: Int64
    - 字段ID: 1   字段名称: Timestamp   字段类型: Int64
    - 字段ID: 100         字段名称: id          字段类型: Int64
            - 主键: true, 自增ID: false
    - 字段ID: 101         字段名称: title       字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 102         字段名称: title_vector        字段类型: FloatVector
            - 类型参数 dim: 768
    - 字段ID: 103         字段名称: link        字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 104         字段名称: reading_time        字段类型: Int64
    - 字段ID: 105         字段名称: publication         字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 106         字段名称: claps       字段类型: Int64
    - 字段ID: 107         字段名称: responses   字段类型: Int64
    启用动态模式: false
    一致性级别: Bounded
    通道 by-dev-rootcoord-dml_0(by-dev-rootcoord-dml_0_443407225551410746v0) 的起始位置: [1 0 28 175 133 76 39 6]
    --- 总集合数:  1        匹配的集合数:  1
    --- 总通道数: 1     健康集合数: 1
    ================================================================================
    ```

- 查看特定集合

    你可以通过指定其 ID 来查看特定集合。

    ```shell
    Milvus(by-dev) > show collection-history --id 443407225551410746
    ================================================================================
    DBID: 1
    集合ID: 443407225551410746       集合名称: medium_articles_2020
    集合状态: CollectionCreated     创建时间: 2023-08-08 09:27:08
    字段:
    - 字段ID: 0   字段名称: RowID       字段类型: Int64
    - 字段ID: 1   字段名称: Timestamp   字段类型: Int64
    - 字段ID: 100         字段名称: id          字段类型: Int64
            - 主键: true, 自增ID: false
    - 字段ID: 101         字段名称: title       字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 102         字段名称: title_vector        字段类型: FloatVector
            - 类型参数 dim: 768
    - 字段ID: 103         字段名称: link        字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 104         字段名称: reading_time        字段类型: Int64
    - 字段ID: 105         字段名称: publication         字段类型: VarChar
            - 类型参数 max_length: 512
    - 字段ID: 106         字段名称: claps       字段类型: Int64
    - 字段ID: 107         字段名称: responses   字段类型: Int64
    启用动态模式: false
    一致性级别: Bounded
    通道 by-dev-rootcoord-dml_0(by-dev-rootcoord-dml_0_443407225551410746v0) 的起始位置: [1 0 28 175 133 76 39 6]
    ```

- 查看所有已加载的集合

    你可以要求 Birdwatcher 筛选所有已加载的集合。

    ```shell
    Milvus(by-dev) > show collection-loaded
    版本: [>= 2.2.0]     集合ID: 443407225551410746
    复制数量: 1        加载状态: 已加载
    --- 已加载的集合数: 1
    ```

- 列出特定集合的所有通道检查点

    你可以要求 Birdwatcher 列出特定集合的所有检查点。

    ```shell
    Milvus(by-dev) > show checkpoint --collection 443407225551410746
    vchannel by-dev-rootcoord-dml_0_443407225551410746v0 跳转到 2023-08-08 09:36:09.54 +0000 UTC, 检查点通道: by-dev-rootcoord-dml_0_443407225551410746v0, 来源: 通道检查点
    ```

 


### 检查索引详情

运行以下命令可以详细列出所有索引文件。

```shell
Milvus(by-dev) > show index
*************2.1.x***************
*************2.2.x***************
==================================================================
索引ID：443407225551410801    索引名称：_default_idx_102    集合ID：443407225551410746
创建时间：2023-08-08 09:27:19.139 +0000      是否已删除：false
索引类型：HNSW        度量类型：L2
索引参数： 
==================================================================
```

### 列出分区

运行以下命令可以列出特定集合中的所有分区。

```shell
Milvus(by-dev) > show partition --collection 443407225551410746
分区ID：443407225551410747 名称：_default  状态：已创建
--- 总数据库数：1
```

### 检查通道状态

运行以下命令可以查看通道状态。

```shell
Milvus(by-dev) > show channel-watch
=============================
关键字：by-dev/meta/channelwatch/6/by-dev-rootcoord-dml_0_443407225551410746v0
通道名称：by-dev-rootcoord-dml_0_443407225551410746v0         监控状态：监控成功
通道开始时间：2023-08-08 09:27:09 +0000，超时时间：1970-01-01 00:00:00 +0000
起始位置ID：[1 0 28 175 133 76 39 6]，时间：1970-01-01 00:00:00 +0000
未刷新段：[]
已刷新段：[]
已删除段：[]
--- 总通道数：1
```

### 列出所有副本和段

- 列出所有副本

    运行以下命令可以列出所有副本及其对应的集合。

    ```shell
    Milvus(by-dev) > show replica
    ================================================================================
    副本ID：443407225685278721 集合ID：443407225551410746 版本：>=2.2.0
    所有节点：[2]
    ```

- 列出所有段

    运行以下命令可以列出所有段及其状态。

    ```shell
    段ID：443407225551610865 状态：已刷新，行数：5979
    --- 生长中：0，已封存：0，已刷新：1
    --- 总段数：1，行数：5979
    ```

    运行以下命令可以详细列出所有已加载的段。对于 Milvus 2.1.x，请改用 `show segment-loaded`。

    ```shell
    Milvus(by-dev) > show segment-loaded-grpc
    ===========
    服务器ID 2
    通道 by-dev-rootcoord-dml_0_443407225551410746v0，集合：443407225551410746，版本 1691486840680656937
    通道的领导者视图：by-dev-rootcoord-dml_0_443407225551410746v0
    生长中的段数目：0，IDs：[]
    段ID：443407225551610865 集合ID：443407225551410746 通道：by-dev-rootcoord-dml_0_443407225551410746v0
    封存的段数目：1    
    ```

### 列出配置项
 


# 


你可以让 Birdwatcher 列出每个 Milvus 组件的当前配置。

```shell
Milvus(by-dev) > 显示配置
客户端 nil 会话：proxy，服务器ID：8，版本：2.2.11，地址：10.244.0.8：19529
组件 rootcoord-1
rootcoord.importtaskexpiration: 900
rootcoord.enableactivestandby: false
rootcoord.importtaskretention: 86400
rootcoord.maxpartitionnum: 4096
rootcoord.dmlchannelnum: 16
rootcoord.minsegmentsizetoenableindex: 1024
rootcoord.port: 53100
rootcoord.address: localhost
rootcoord.maxdatabasenum: 64
组件 datacoord-3
...
querynode.gracefulstoptimeout: 30
querynode.cache.enabled: true
querynode.cache.memorylimit: 2147483648
querynode.scheduler.maxreadconcurrentratio: 2
```

作为替代方案，你可以访问每个 Milvus 组件以查找其配置。以下示例演示了如何列出 ID 为 7 的 QueryCoord 的配置。

```shell
Milvus(by-dev) > 显示会话
会话：datacoord，服务器ID：3，版本：2.2.11，地址：10.244.0.8：13333
会话：datanode，服务器ID：6，版本：2.2.11，地址：10.244.0.8：21124
会话：indexcoord，服务器ID：4，版本：2.2.11，地址：10.244.0.8：31000
会话：indexnode，服务器ID：5，版本：2.2.11，地址：10.244.0.8：21121
会话：proxy，服务器ID：8，版本：2.2.11，地址：10.244.0.8：19529
会话：querycoord，服务器ID：7，版本：2.2.11，地址：10.244.0.8：19531
会话：querynode，服务器ID：2，版本：2.2.11，地址：10.244.0.8：21123
会话：rootcoord，服务器ID：1，版本：2.2.11，地址：10.244.0.8：53100

Milvus(by-dev) > 访问querycoord 7
QueryCoord-7(10.244.0.8:19531) > 配置
Key: querycoord.enableactivestandby, Value: false
Key: querycoord.channeltasktimeout, Value: 60000
Key: querycoord.overloadedmemorythresholdpercentage, Value: 90
Key: querycoord.distpullinterval, Value: 500
Key: querycoord.checkinterval, Value: 10000
Key: querycoord.checkhandoffinterval, Value: 5000
Key: querycoord.taskexecutioncap, Value: 256
Key: querycoord.taskmergecap, Value: 8
Key: querycoord.autohandoff, Value: true
Key: querycoord.address, Value: localhost
Key: querycoord.port, Value: 19531
Key: querycoord.memoryusagemaxdifferencepercentage, Value: 30
Key: querycoord.refreshtargetsintervalseconds, Value: 300
Key: querycoord.balanceintervalseconds, Value: 60
Key: querycoord.loadtimeoutseconds, Value: 1800
Key: querycoord.globalrowcountfactor, Value: 0.1
Key: querycoord.scoreunbalancetolerationfactor, Value: 0.05
Key: querycoord.reverseunbalancetolerationfactor, Value: 1.3
Key: querycoord.balancer, Value: ScoreBasedBalancer
Key: querycoord.autobalance, Value: true
Key: querycoord.segmenttasktimeout, Value: 120000
```

## 备份指标

你可以让 Birdwatcher 备份所有组件的指标

```shell
Milvus(my-release) > 备份
备份中... 100%(2452/2451)
备份etcd的前缀完成
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
http://10.244.0.10:9091/metrics
备份前缀完成，保存在文件：bw_etcd_ALL.230810-075211.bak.gz
```

然后你可以在启动 Birdwatcher 的目录中检查文件。

## 探查数据集

你可以让 Birdwatcher 使用指定的主键或模拟查询来探查已加载数据集的状态。

### 使用已知主键探查数据集
 

在 `probe` 命令中，你应该使用 `pk` 标志指定主键，并使用 `collection` 标志指定集合 ID。

```shell
Milvus(by-dev) > probe pk --pk 110 --collection 442844725212299747
PK 110 在段 442844725212299830 上找到
字段 id, 值: &{long_data:<data:110 > }
字段 title, 值: &{string_data:<data:"人力资源数字化" > }
字段 title_vector, 值: &{dim:768 float_vector:<data:0.022454707 data:0.007861045 data:0.0063843643 data:0.024065714 data:0.013782166 data:0.018483251 data:-0.026526336 ... data:-0.06579628 data:0.00033906146 data:0.030992996 data:-0.028134001 data:-0.01311325 data:0.012471594 > }
字段 article_meta, 值: &{json_data:<data:"{\"link\":\"https:\\/\\/towardsdatascience.com\\/human-resources-datafication-d44c8f7cb365\",\"reading_time\":6,\"publication\":\"数据科学\",\"claps\":256,\"responses\":0}" > }
```

### 使用模拟查询探测所有集合





你还可以让 Birdwatcher 使用模拟查询来探测所有集合。

```shell
Milvus（按开发者）> 探测查询
正在探测集合442682158191982314
发现矢量字段vector（103），dim[384]，索引ID：442682158191990455
生成模拟请求进行探测，探测失败，IVF_FLAT索引类型尚不支持
正在探测集合442844725212086932
发现矢量字段title_vector（102），dim[768]，索引ID：442844725212086936
Shard my-release-rootcoord-dml_1_442844725212086932v0的领袖[298]探测搜索成功。
正在探测集合442844725212299747
发现矢量字段title_vector（102），dim[768]，索引ID：442844725212299751
Shard my-release-rootcoord-dml_4_442844725212299747v0的领袖[298]探测搜索成功。
正在探测集合443294505839900248
发现矢量字段vector（101），dim[256]，索引ID：443294505839900251
Shard my-release-rootcoord-dml_5_443294505839900248v0的领袖[298]探测搜索成功。
```

