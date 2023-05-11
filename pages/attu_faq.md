#### 为什么Attu会出现网络错误？

答：检查是否在`docker run`命令中正确赋值了`HOST_URL`。或者，你可以在浏览器地址栏中输入`{HOST_URL}/api/v1/healthy`来检查Attu的网络状态。

#### 为什么Attu无法连接Milvus？

答：请确保Milvus和Attu在同一个网络中。

#### 如何在K8s中使用Attu？

答：你可以[在使用Helm部署Milvus的同时安装Attu（install Attu using Helm）](attu_install-helm.md)。

