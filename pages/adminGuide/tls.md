---
title:  TLS（传输层安全）
---

## 传输加密

TLS（传输层安全）是一种加密协议，用于确保通信安全。Milvus代理使用TLS单向和双向认证。

本主题描述了如何在Milvus中启用TLS代理。

## 创建自己的证书

### 先决条件

确保已安装OpenSSL。如果尚未安装，请首先[构建并安装](https://github.com/openssl/openssl/blob/master/INSTALL.md)OpenSSL。

```shell
openssl version
```

如果未安装OpenSSL，可以使用以下命令在Ubuntu中安装。

```shell
sudo apt install openssl
```

### 创建文件

1. 创建`openssl.cnf`和`gen.sh`文件。

```
mkdir cert && cd cert
touch openssl.cnf gen.sh
```

2. 将以下配置复制到文件中。需要配置`CommonName`。`CommonName`指的是客户端在连接时需要指定的服务器名称。

<details><summary><code>openssl.cnf</code></summary>

```ini
#
# OpenSSL 示例配置文件。
# 此文件主要用于生成证书请求。
#

# 此定义防止以下行在HOME未定义时出现错误。
HOME			= .
RANDFILE		= $ENV::HOME/.rnd

# 额外的对象标识符信息：
#oid_file		= $ENV::HOME/.oid
oid_section		= new_oids

# 若要使用“-extfile”选项与“openssl x509”实用程序一起使用此配置文件，请在此处命名包含要使用的X.509v3扩展的节：
# extensions		=
# （或者，使用一个只有其主[=默认]部分中包含X.509v3扩展的配置文件。）

[ new_oids ]

# 我们可以在这里添加新的OID，以供'ca'、'req'和'ts'使用。
# 如此添加一个简单的OID：
# testoid1=1.2.3.4
# 或者使用配置文件替换，如下所示：
# testoid2=${testoid1}.5.6

# 由TSA示例使用的政策。
tsa_policy1 = 1.2.3.4.1
tsa_policy2 = 1.2.3.4.5.6
tsa_policy3 = 1.2.3.4.5.7

####################################################################
[ ca ]
default_ca	= CA_default		# 默认的ca节

####################################################################
[ CA_default ]

dir		= ./demoCA		# 所有内容都保存在这里
certs		= $dir/certs		# 颁发证书保存在这里
crl_dir		= $dir/crl		# 颁发crl保存在这里
database	= $dir/index.txt	# 数据库索引文件。
#unique_subject	= no			# 设置为'no'以允许创建
					# 具有相同主题的多个证书。
new_certs_dir	= $dir/newcerts		# 新证书的默认位置。

certificate	= $dir/cacert.pem 	# CA证书
serial		= $dir/serial 		# 当前的序列号
crlnumber	= $dir/crlnumber	# 当前的crl号码
					# 必须注释掉以留下V1 CRL
crl		= $dir/crl.pem 		# 当前的CRL
private_key	= $dir/private/cakey.pem# 私钥
RANDFILE	= $dir/private/.rand	# 私有随机数文件

x509_extensions	= usr_cert		# 添加到证书的扩展

# 注释掉以下两行以使用“传统”的（并且高度破坏性的）
# 格式。
name_opt 	= ca_default		# 主题名称选项
cert_opt 	= ca_default		# 证书字段选项

# 扩展复制选项：请谨慎使用。
copy_extensions = copy

# 添加到CRL的扩展。注意：Netscape communicator在V2 CRL上会窒息
# 因此，默认情况下此选项被注释掉以留下V1 CRL。
# 要留下V1 CRL，crlnumber也必须注释掉。
# crl_extensions	= crl_ext

default_days	= 365			# 认证多长时间
default_crl_days= 30			# 下一个CRL之前多长时间
default_md	= default		# 使用公钥默认MD
preserve	= no			# 保持通过的DN顺序

# 几种不同的指定请求应该看起来有多相似的方式
# 对于类型CA，列出的属性必须相同，可选的和提供的字段就是那样：）
policy		= policy_match

# 对于CA政策
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		=