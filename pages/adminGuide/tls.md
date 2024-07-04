


# 在传输中的加密

TLS（传输层安全）是一种加密协议，用于确保通信安全。Milvus 代理使用 TLS 单向和双向身份验证。

本主题介绍了如何在 Milvus 中启用 TLS 代理。

## 创建自己的证书

### 先决条件

确保已安装 OpenSSL。如果尚未安装，请先 [构建和安装](https://github.com/openssl/openssl/blob/master/INSTALL.md) OpenSSL。

```shell
openssl version
```

如果未安装 OpenSSL，则可以在 Ubuntu 中使用以下命令进行安装。

```shell
sudo apt install openssl
```

### 创建文件

1. 创建 `openssl.cnf` 和 `gen.sh` 文件。

```
mkdir cert && cd cert
touch openssl.cnf gen.sh
```

2. 将以下配置复制到文件中。需要配置 `CommonName`。`CommonName` 是客户端在连接时需要指定的服务器名称。

<details> <summary> <code> openssl.cnf </code> </summary>

```ini
#
# OpenSSL example configuration file.
# This is mostly being used for generation of certificate requests.
#

# This definition stops the following lines choking if HOME isn't
# defined.
HOME			= .
RANDFILE		= $ENV::HOME/.rnd

# Extra OBJECT IDENTIFIER info:
#oid_file		= $ENV::HOME/.oid
oid_section		= new_oids

# To use this configuration file with the "-extfile" option of the
# "openssl x509" utility, name here the section containing the
# X.509v3 extensions to use:
# extensions		= 
# (Alternatively, use a configuration file that has only
# X.509v3 extensions in its main [= default] section.)

[ new_oids ]

# We can add new OIDs in here for use by 'ca', 'req' and 'ts'.
# Add a simple OID like this:
# testoid1=1.2.3.4
# Or use config file substitution like this:
# testoid2=${testoid1}.5.6

# Policies used by the TSA examples.
tsa_policy1 = 1.2.3.4.1
tsa_policy2 = 1.2.3.4.5.6
tsa_policy3 = 1.2.3.4.5.7

####################################################################
[ ca ]
default_ca	= CA_default		# The default ca section

####################################################################
 


# 


[ CA_default ]

dir		= ./demoCA		# 存放所有内容的位置
certs		= $dir/certs		# 存放已签发证书的位置
crl_dir		= $dir/crl		# 存放已签发crl的位置
database	= $dir/index.txt	# 数据库索引文件。
#unique_subject	= no			# 设置为“no”允许创建具有相同subject的多个证书。
new_certs_dir	= $dir/newcerts		# 新证书的默认位置。

certificate	= $dir/cacert.pem 	# CA证书
serial		= $dir/serial 		# 当前序列号
crlnumber	= $dir/crlnumber	# 当前crl号码
					# 必须注释掉以保留V1 CRL
crl		= $dir/crl.pem 		# 当前CRL
private_key	= $dir/private/cakey.pem# 私钥
RANDFILE	= $dir/private/.rand	# 私有随机数文件

x509_extensions	= usr_cert		# 添加到证书的扩展

# 将以下两行注释掉以使用“传统”（且高度错误）格式。
name_opt 	= ca_default		# 主题名称选项
cert_opt 	= ca_default		# 证书字段选项

# 扩展复制选项：谨慎使用。
copy_extensions = copy

# 添加到CRL的扩展。注意：Netscape通讯器对V2 CRL有问题，所以默认情况下注释掉以保留V1 CRL。
# crlnumber也必须注释掉以保留V1 CRL。
# crl_extensions	= crl_ext

default_days	= 365			# 证书有效期
default_crl_days= 30			# 下一个CRL前的有效期
default_md	= default		# 使用默认的公钥MD
preserve	= no			# 保持通过的DN顺序

# 指定请求的相似度的几种不同方式
# 对于CA类型，列出的属性必须相同，可选和提供的字段只是这样的 :-)
policy		= policy_match

# 对于CA策略
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

# 对于“任何”策略
# 目前，你必须列出所有可接受的“object”类型。
[ policy_anything ]
countryName		= optional
stateOrProvinceName	= optional
localityName		= optional
organizationName	= optional
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

####################################################################



[ req ]
default_bits		= 2048
default_keyfile 	= privkey.pem
distinguished_name	= req_distinguished_name
attributes		= req_attributes
x509_extensions	= v3_ca	# 将要添加到自签名证书的扩展名

# 如果没有私钥密码，它们将会提示输入
# input_password = secret
# output_password = secret

# 这设置了允许的字符串类型掩码。有几个选项。
# 默认值：PrintableString, T61String, BMPString。
# pkix：PrintableString, BMPString (2004年之前的PKIX建议)
# utf8only：仅限UTF8Strings (2004年之后的PKIX建议)。
# nombstr：PrintableString, T61String (没有BMPStrings或UTF8Strings)。
# MASK:XXXX 一个文字掩码值。
# 警告：古老版本的Netscape会在BMPStrings或UTF8Strings上崩溃。
string_mask = utf8only

req_extensions = v3_req # 将要添加到证书请求的扩展名

[ req_distinguished_name ]
countryName			= 国家名 (2个字母代码)
countryName_default		= AU
countryName_min			= 2
countryName_max			= 2

stateOrProvinceName		= 州/省名 (全名)
stateOrProvinceName_default	= Some-State

localityName			= 地区名 (例如，城市)

0.organizationName		= 组织名 (例如，公司)
0.organizationName_default	= Internet Widgits Pty Ltd

# 我们可以这样做，但通常不需要 :-)
# 1.organizationName		= 第二个组织名 (例如，公司)
# 1.organizationName_default	= World Wide Web Pty Ltd

organizationalUnitName		= 组织单位名 (例如，部门)
#organizationalUnitName_default	=

commonName			= 通用名 (例如，服务器FQDN或你的名字)
commonName_max			= 64

emailAddress			= 电子邮件地址
emailAddress_max		= 64

# SET-ex3			= SET扩展号3

[ req_attributes ]
challengePassword		= 挑战密码
challengePassword_min		= 4
challengePassword_max		= 20

unstructuredName		= 可选的公司名

[ usr_cert ]

# 当'ca'签署请求时，将添加这些扩展名。

# 这违反了PKIX指南，但一些CA这样做，有些软件
# 需要这样做以避免将终端用户证书解释为CA证书。

basicConstraints=CA:FALSE

# 这是nsCertType用法的一些示例。如果省略它
# 证书可以用于任何事情，除了*对象签名*。

# 对于SSL服务器来说是可以的。
# nsCertType			= 服务器

# 对于对象签名证书来说，将使用此选项。
# nsCertType = objsign

# 对于正常的客户端使用，这是典型的做法
# nsCertType = 客户端，电子邮件

# 对于包括对象签名的一切而言，
# nsCertType = 客户端，电子邮件，objsign

# 这是客户端证书的常用keyUsage。
# keyUsage = 不可否认，数字签名，密钥加密

# 这将显示在Netscape的注释列表框中。
nsComment			= "OpenSSL生成的证书"

# PKIX建议包含在所有证书中是无害的。
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# 这些是subjectAltName和issuerAltname的内容。
# 导入电子邮件地址。
# subjectAltName=电子邮件:副本
# 一个替代方案，以生成不会
# 根据PKIX被弃用的证书。
# subjectAltName=电子邮件:move

# 复制主题详细信息




# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This is required for TSA certificates.
# extendedKeyUsage = critical,timeStamping

[ v3_req ]

# Extensions to add to a certificate request

basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment

subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
DNS.2 = *.ronething.cn
DNS.3 = *.ronething.com

[ v3_ca ]


# Extensions for a typical CA


# PKIX recommendation.

subjectKeyIdentifier=hash

authorityKeyIdentifier=keyid:always,issuer

# This is what PKIX recommends but some broken software chokes on critical
# extensions.
#basicConstraints = critical,CA:true
# So we do this instead.
basicConstraints = CA:true

# Key usage: this is typical for a CA certificate. However since it will
# prevent it being used as an test self-signed certificate it is best
# left out by default.
# keyUsage = cRLSign, keyCertSign

# Some might want this also
# nsCertType = sslCA, emailCA

# Include email address in subject alt name: another PKIX recommendation
# subjectAltName=email:copy
# Copy issuer details
# issuerAltName=issuer:copy

# DER hex encoding of an extension: beware experts only!
# obj=DER:02:03
# Where 'obj' is a standard or added object
# You can even override a supported extension:
# basicConstraints= critical, DER:30:03:01:01:FF

[ crl_ext ]

# CRL extensions.
# Only issuerAltName and authorityKeyIdentifier make any sense in a CRL.

# issuerAltName=issuer:copy
authorityKeyIdentifier=keyid:always

[ proxy_cert_ext ]
# These extensions should be added when creating a proxy certificate

# This goes against PKIX guidelines but some CAs do it and some software
# requires this to avoid interpreting an end user certificate as a CA.

basicConstraints=CA:FALSE

# Here are some examples of the usage of nsCertType. If it is omitted
# the certificate can be used for anything *except* object signing.

# This is OK for an SSL server.
# nsCertType			= server

# For an object signing certificate this would be used.
# nsCertType = objsign

# For normal client use this is typical
# nsCertType = client, email

# and for everything including object signing:
# nsCertType = client, email, objsign

# This is typical in keyUsage for a client certificate.
# keyUsage = nonRepudiation, digitalSignature, keyEncipherment

# This will be displayed in Netscape's comment listbox.
nsComment			= "OpenSSL Generated Certificate"


                


# PKIX建议在所有证书中包含是无害的。
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# 这些用于subjectAltName和issuerAltName。
# 导入电子邮件地址。
# subjectAltName=email:copy
# 产生符合PKIX标准的未弃用证书的替代方案。
# subjectAltName=email:move

# 复制主题详细信息
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# 这真的需要放置在代理证书中。
proxyCertInfo=critical,language:id-ppl-anyLanguage,pathlen:3,policy:foo

####################################################################
[ tsa ]

default_tsa = tsa_config1	# 默认的TSA部分

[ tsa_config1 ]

# 仅用于TSA回复生成。
dir		= ./demoCA		# TSA根目录
serial		= $dir/tsaserial	# 当前序列号（必须）
crypto_device	= builtin		# 用于签名的OpenSSL引擎
signer_cert	= $dir/tsacert.pem 	# TSA签名证书（可选）
certs		= $dir/cacert.pem	# 包含在回复中的证书链（可选）
signer_key	= $dir/private/tsakey.pem # TSA私钥（可选）

default_policy	= tsa_policy1		# 如果请求未指定策略，则为默认策略（可选）
other_policies	= tsa_policy2, tsa_policy3	# 可接受的策略（可选）
digests		= md5, sha1		# 可接受的消息摘要（必需）
accuracy	= secs:1, millisecs:500, microsecs:100	#（可选）
clock_precision_digits  = 0	# 小数点后的位数（可选）
ordering		= yes	# 时间戳是否定义了顺序？
				#（可选，默认为no）
tsa_name		= yes	# 必须在回复中包含TSA名称？
				#（可选，默认为no）
ess_cert_id_chain	= no	# 是否必须包括ESS证书ID链？
				#（可选，默认为no）
```

</details>

`openssl.cnf` 文件是默认的 OpenSSL 配置文件。详情请参阅 [手册页面](https://www.openssl.org/docs/manmaster/man5/config.html)。`gen.sh` 文件用于生成相关的证书文件。你可以修改 `gen.sh` 文件以满足不同的需求，例如更改证书文件的有效期、证书密钥的长度或证书文件的名称。

<details> <summary> <code> gen.sh </code> </summary>

```shell
#!/usr/bin/env sh
# 你的变量
Country="CN"
State="上海"
Location="上海"
Organization="milvus"
Organizational="milvus"
CommonName="localhost"

echo "生成ca.key"
openssl genrsa -out ca.key 2048

echo "生成ca.pem"
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"

echo "生成服务器SAN证书"
openssl genpkey -algorithm RSA -out server.key
openssl req -new -nodes -key server.key -out server.csr -days 3650 -subj "/C=$Country/O=$Organization/OU=$Organizational/CN=$CommonName" -config ./openssl.cnf -extensions v3_req
openssl x509 -req -days 3650 -in server.csr -out server.pem -CA ca.pem -CAkey ca.key -CAcreateserial -extfile ./openssl.cnf -extensions v3_req

echo "生成客户端SAN证书"
openssl genpkey -algorithm RSA -out client.key
openssl req -new -nodes -key client.key -out client.csr -days 3650 -subj "/C=$Country/O=$Organization/OU=$Organizational/CN=$CommonName" -config ./openssl.cnf -extensions v3_req
openssl x509 -req -days 3650 -in client.csr -out client.pem -CA ca.pem -CAkey ca.key -CAcreateserial -extfile ./openssl.cnf -extensions v3_req

```
</details>

`gen.sh` 文件中的变量对于创建证书签名请求文件的过程至关重要。前五个变量是基本的签名信息，包括国家、省份、地点、组织、组织单位。在配置 `CommonName` 时需要小心，因为在客户端和服务器之间的通信中会进行验证。

### 运行 `gen.sh` 生成证书
 




运行 `gen.sh` 文件以创建证书。

```
chmod +x gen.sh
./gen.sh
```

将创建以下九个文件：`ca.key`，`ca.pem`，`ca.srl`，`server.key`，`server.pem`，`server.csr`，`client.key`，`client.pem`，`client.csr`。

### 修改证书文件的详细信息（可选）

生成证书后，你可以根据自己的需求修改证书文件的详细信息。

SSL 或 TSL 相互认证的实现涉及客户端、服务器和证书颁发机构（CA）。 CA 用于确保客户端和服务器之间的证书的合法性。

运行 `man openssl` 命令或参见 [openssl 手册页面](https://www.openssl.org/docs/) 以获得有关使用 OpenSSL 命令的更多信息。

1. 为 CA 生成 RSA 私钥。

```
openssl genpkey -algorithm RSA -out ca.key
```

2. 请求生成 CA 证书。

在此步骤中，你需要提供有关 CA 的基本信息。选择 `x509` 选项以跳过请求并直接生成自签名证书。

```
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"
```

在这一步之后，你将获得一个 `ca.pem` 文件，即可用于生成客户端-服务器证书的 CA 证书。

3. 生成服务器私钥。

```
openssl genpkey -algorithm RSA -out server.key
```

在这一步之后，你将获得一个 `server.key` 文件。

4. 生成证书签名请求文件。

你需要提供有关服务器的必要信息来生成证书签名请求文件。

```
openssl req -new -nodes -key server.key -out server.csr -days 3650 -subj "/C=$Country/O=$Organization/OU=$Organizational/CN=$CommonName" -config ./openssl.cnf -extensions v3_req
```

在这一步之后，你将获得一个 `server.csr` 文件。

5. 对证书进行签名。

打开 `server.csr`、`ca.key` 和 `ca.pem` 文件以对证书进行签名。如果该文件不存在，使用 `CAcreateserial` 命令选项创建一个 CA 序列号文件。在选择此命令选项后，你将获得一个 `aca.srl` 文件。

```
openssl x509 -req -days 3650 -in server.csr -out server.pem -CA ca.pem -CAkey ca.key -CAcreateserial -extfile ./openssl.cnf -extensions v3_req
```

## 修改 Milvus 服务器配置

将 `tlsEnabled` 设置为 `true`，并为服务器配置文件 `config/milvus.yaml` 中的 `server.pem`、`server.key` 和 `ca.pem` 文件路径。

```
tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsMode: 2
 ```

### 单向认证

服务器需要 `server.pem` 和 `server.key`。客户端需要 `server.pem`。

### 双向认证

服务器需要 `server.pem`、`server.key` 和 `ca.pem`。客户端需要 `client.pem`、`client.key` 和 `ca.pem`。

## 使用 TLS 连接到 Milvus 服务器



配置在使用 Milvus SDK 时，客户端的 `client.pem`、`client.key` 和 `ca.pem` 文件的路径。

以下示例使用 Milvus Python SDK。

```
from pymilvus import connections

_HOST = '127.0.0.1'
_PORT = '19530'

print(f"\n创建连接...")
connections.connect(host=_HOST, port=_PORT, secure=True, client_pem_path="cert/client.pem",
                        client_key_path="cert/client.key",
                        ca_pem_path="cert/ca.pem", server_name="localhost")
print(f"\n连接列表:")
print(connections.list_connections())
```

更多信息请参考 [example_tls1.py](https://github.com/milvus-io/pymilvus/blob/master/examples/example_tls1.py) 和 [example_tls2.py](https://github.com/milvus-io/pymilvus/blob/master/examples/example_tls2.py)。

