TLS 单向验证和双向验证
===

TLS（传输层安全）是一种加密协议，用于确保通信安全。Milvus代理使用TLS 单向验证和双向验证。

本主题介绍如何在Milvus中启用TLS代理。

创建您自己的证书 
---------------------------

### 前提条件

确保安装了OpenSSL。如果您没有安装它，请先[构建和安装](https://github.com/openssl/openssl/blob/master/INSTALL.md) OpenSSL。

```python
openssl version

```

如果未安装OpenSSL，则可以使用以下命令在Ubuntu上安装。

```python
sudo apt install openssl

```

以下是您要创建的 `openssl.cnf` 文件的代码：

```bash
# OpenSSL configuration file

# Establish working directory.
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
countryName = Country Name (2 letter code)
countryName_default = XX
stateOrProvinceName = State or Province Name (full name)
stateOrProvinceName_default = Example-State
localityName = Locality Name (eg, city)
localityName_default = Example-Locality
organizationalUnitName  = Organizational Unit Name (eg, section)
organizationalUnitName_default  = Example-Organizational-Unit
commonName = Common Name (e.g. server FQDN or YOUR name)
commonName_max  = 64

# Establish common name. Specify the same CommonName as the one used when creating the server key pair.
[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = common_name
```

3. `gen.sh`

```bash
#!/bin/bash

rm *.crt
rm *.key
rm *.csr

openssl req -config openssl.cnf -new -newkey rsa:2048 -nodes -out client.csr -keyout client.key

openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt

rm *.csr

chmod 777 *
```

请确保将 `gen.sh` 文件设置为可执行 (`chmod 777 gen.sh`)。


```python
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
[ CA_default ]

dir		= ./demoCA		# Where everything is kept
certs		= $dir/certs		# Where the issued certs are kept
crl_dir		= $dir/crl		# Where the issued crl are kept
database	= $dir/index.txt	# database index file.
#unique_subject	= no			# Set to 'no' to allow creation of
					# several ctificates with same subject.
new_certs_dir	= $dir/newcerts		# default place for new certs.

certificate	= $dir/cacert.pem 	# The CA certificate
serial		= $dir/serial 		# The current serial number
crlnumber	= $dir/crlnumber	# the current crl number
					# must be commented out to leave a V1 CRL
crl		= $dir/crl.pem 		# The current CRL
private_key	= $dir/private/cakey.pem# The private key
RANDFILE	= $dir/private/.rand	# private random number file

x509_extensions	= usr_cert		# The extentions to add to the cert

# Comment out the following two lines for the "traditional"
# (and highly broken) format.
name_opt 	= ca_default		# Subject Name options
cert_opt 	= ca_default		# Certificate field options

# Extension copying option: use with caution.
copy_extensions = copy

# Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs
# so this is commented out by default to leave a V1 CRL.
# crlnumber must also be commented out to leave a V1 CRL.
# crl_extensions	= crl_ext

default_days	= 365			# how long to certify for
default_crl_days= 30			# how long before next CRL
default_md	= default		# use public key default MD
preserve	= no			# keep passed DN ordering

# A few difference way of specifying how similar the request should look
# For type CA, the listed attributes must be the same, and the optional
# and supplied fields are just that :-)
policy		= policy_match

# For the CA policy
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

# For the 'anything' policy
# At this point in time, you must list all acceptable 'object'
# types.
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
x509_extensions	= v3_ca	# The extentions to add to the self signed cert

# Passwords for private keys if not present they will be prompted for
# input_password = secret
# output_password = secret

# This sets a mask for permitted string types. There are several options. 
# default: PrintableString, T61String, BMPString.
# pkix	 : PrintableString, BMPString (PKIX recommendation before 2004)
# utf8only: only UTF8Strings (PKIX recommendation after 2004).
# nombstr : PrintableString, T61String (no BMPStrings or UTF8Strings).
# MASK:XXXX a literal mask value.
# WARNING: ancient versions of Netscape crash on BMPStrings or UTF8Strings.
string_mask = utf8only

req_extensions = v3_req # The extensions to add to a certificate request

[ req_distinguished_name ]
countryName			= Country Name (2 letter code)
countryName_default		= AU
countryName_min			= 2
countryName_max			= 2

stateOrProvinceName		= State or Province Name (full name)
stateOrProvinceName_default	= Some-State

localityName			= Locality Name (eg, city)

0.organizationName		= Organization Name (eg, company)
0.organizationName_default	= Internet Widgits Pty Ltd

# we can do this but it is not needed normally :-)
#1.organizationName		= Second Organization Name (eg, company)
#1.organizationName_default	= World Wide Web Pty Ltd

organizationalUnitName		= Organizational Unit Name (eg, section)
#organizationalUnitName_default	=

commonName			= Common Name (e.g. server FQDN or YOUR name)
commonName_max			= 64

emailAddress			= Email Address
emailAddress_max		= 64

# SET-ex3			= SET extension number 3

[ req_attributes ]
challengePassword		= A challenge password
challengePassword_min		= 4
challengePassword_max		= 20

unstructuredName		= An optional company name

[ usr_cert ]

# These extensions are added when 'ca' signs a request.

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

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
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

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This really needs to be in place for it to be a proxy certificate.
proxyCertInfo=critical,language:id-ppl-anyLanguage,pathlen:3,policy:foo

####################################################################
[ tsa ]

default_tsa = tsa_config1	# the default TSA section

[ tsa_config1 ]

# These are used by the TSA reply generation only.
dir		= ./demoCA		# TSA root directory
serial		= $dir/tsaserial	# The current serial number (mandatory)
crypto_device	= builtin		# OpenSSL engine to use for signing
signer_cert	= $dir/tsacert.pem 	# The TSA signing certificate
					# (optional)
certs		= $dir/cacert.pem	# Certificate chain to include in reply
					# (optional)
signer_key	= $dir/private/tsakey.pem # The TSA private key (optional)

default_policy	= tsa_policy1		# Policy if request did not specify it
					# (optional)
other_policies	= tsa_policy2, tsa_policy3	# acceptable policies (optional)
digests		= md5, sha1		# Acceptable message digests (mandatory)
accuracy	= secs:1, millisecs:500, microsecs:100	# (optional)
clock_precision_digits  = 0	# number of digits after dot. (optional)
ordering		= yes	# Is ordering defined for timestamps?
				# (optional, default: no)
tsa_name		= yes	# Must the TSA name be included in the reply?
				# (optional, default: no)
ess_cert_id_chain	= no	# Must the ESS cert id chain be included?
				# (optional, default: no)

```

`openssl.cnf` 文件是 OpenSSL 的默认配置文件。有关更多信息，请参见[手册页面](https://www.openssl.org/docs/manmaster/man5/config)。`gen.sh` 文件生成相关的证书文件。您可以修改 `gen.sh` 文件以用于不同的目的，例如更改证书文件的有效期、证书密钥的长度或证书文件名称。

`gen.sh`

```python
#!/usr/bin/env sh
# your variables
Country="CN"
State="Shanghai"
Location="Shanghai"
Organization="milvus"
Organizational="milvus"
CommonName="localhost"

echo "generate ca.key"
openssl genrsa -out ca.key 2048

echo "generate ca.pem"
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"

echo "generate server SAN certificate"
openssl genpkey -algorithm RSA -out server.key
openssl req -new -nodes -key server.key -out server.csr -days 3650 -subj "/C=$Country/O=$Organization/OU=$Organizational/CN=$CommonName" -config ./openssl.cnf -extensions v3_req
openssl x509 -req -days 3650 -in server.csr -out server.pem -CA ca.pem -CAkey ca.key -CAcreateserial -extfile ./openssl.cnf -extensions v3_req

echo "generate client SAN certificate"
openssl genpkey -algorithm RSA -out client.key
openssl req -new -nodes -key client.key -out client.csr -days 3650 -subj "/C=$Country/O=$Organization/OU=$Organizational/CN=$CommonName" -config ./openssl.cnf -extensions v3_req
openssl x509 -req -days 3650 -in client.csr -out client.pem -CA ca.pem -CAkey ca.key -CAcreateserial -extfile ./openssl.cnf -extensions v3_req

```

`gen.sh` 文件中的变量对于创建证书签名请求文件的过程至关重要。前五个变量是基本的签名信息，包括国家、州、位置、组织和组织单位。在配置 `CommonName` 时需要小心，因为它将在客户端与服务器之间的通信期间进行验证。

### 运行 `gen.sh` 以生成证书

运行 `gen.sh` 文件以创建证书。

```bash
chmod +x gen.sh
./gen.sh
```

以下九个文件将被创建：`ca.key`、`ca.pem`、`ca.srl`、`server.key`、`server.pem`、`server.csr`、`client.key`、`client.pem` 和 `client.csr`。

### 修改证书文件的详细信息（可选）

生成证书后，您可以根据自己的需要修改证书文件的详细信息。

SSL 或 TSL 互相验证的实现涉及客户端、服务器和证书授权机构 (CA)。CA 用于确保客户端和服务器之间的证书是合法的。

运行 `man openssl` 或参见 [OpenSSL 手册页面](https://www.openssl.org/docs/) 以获取有关使用 OpenSSL 命令的更多信息。

1. 为 CA 生成 RSA 私钥。

```bash
openssl genpkey -algorithm RSA -out ca.key
```

2. 请求生成 CA 证书。

您需要在此步骤中提供有关 CA 的基本信息。选择 `x509` 选项以跳过请求并直接生成自签名证书。

```bash
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"
```

在此步骤之后，您将获得一个 `ca.pem` 文件，这是一个 CA 证书，可用于生成客户端-服务器证书。`gen.sh` 文件中的变量对于创建证书签名请求文件的过程至关重要。前五个变量是基本的签名信息，包括国家、州、位置、组织和组织单位。在配置 `CommonName` 时需要小心，因为它将在客户端与服务器之间的通信期间进行验证。

### 运行 `gen.sh` 以生成证书

运行 `gen.sh` 文件以创建证书。

```bash
chmod +x gen.sh
./gen.sh
```

以下九个文件将被创建：`ca.key`、`ca.pem`、`ca.srl`、`server.key`、`server.pem`、`server.csr`、`client.key`、`client.pem` 和 `client.csr`。

### 修改证书文件的详细信息（可选）

生成证书后，您可以根据自己的需要修改证书文件的详细信息。

SSL 或 TSL 互相验证的实现涉及客户端、服务器和证书授权机构 (CA)。CA 用于确保客户端和服务器之间的证书是合法的。

运行 `man openssl` 或参见 [OpenSSL 手册页面](https://www.openssl.org/docs/) 以获取有关使用 OpenSSL 命令的更多信息。

1. 为 CA 生成 RSA 私钥。

```bash
openssl genpkey -algorithm RSA -out ca.key
```

2. 请求生成 CA 证书。

您需要在此步骤中提供有关 CA 的基本信息。选择 `x509` 选项以跳过请求并直接生成自签名证书。

```bash
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"
```

在此步骤之后，您将获得一个 `ca.pem` 文件，这是一个 CA 证书，可用于生成客户端-服务器证书。

`gen.sh` 文件中的变量对于创建证书签名请求文件的过程至关重要。前五个变量是基本的签名信息，包括国家、州、位置、组织和组织单位。在配置 `CommonName` 时需要小心，因为它将在客户端与服务器之间的通信期间进行验证。

### 运行 `gen.sh` 以生成证书

运行 `gen.sh` 文件以创建证书。

```bash
chmod +x gen.sh
./gen.sh
```

以下九个文件将被创建：`ca.key`、`ca.pem`、`ca.srl`、`server.key`、`server.pem`、`server.csr`、`client.key`、`client.pem` 和 `client.csr`。

### 修改证书文件的详细信息（可选）

生成证书后，您可以根据自己的需要修改证书文件的详细信息。

SSL 或 TSL 互相验证的实现涉及客户端、服务器和证书授权机构 (CA)。CA 用于确保客户端和服务器之间的证书是合法的。

运行 `man openssl` 或参见 [OpenSSL 手册页面](https://www.openssl.org/docs/) 以获取有关使用 OpenSSL 命令的更多信息。

1. 为 CA 生成 RSA 私钥。

```bash
openssl genpkey -algorithm RSA -out ca.key
```

2. 请求生成 CA 证书。

您需要在此步骤中提供有关 CA 的基本信息。选择 `x509` 选项以跳过请求并直接生成自签名证书。

```bash
openssl req -new -x509 -key ca.key -out ca.pem -days 3650 -subj "/C=$Country/ST=$State/L=$Location/O=$Organization/OU=$Organizational/CN=$CommonName"
```

在此步骤之后，您将获得一个 `ca.pem` 文件，这是一个 CA 证书，可用于生成客户端-服务器证书。


```python
tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsMode: 2

```

### 单向验证

服务器需要 server.pem 和 server.key。客户端需要 server.pem。

### 双向验证

服务器需要 server.pem、server.key 和 ca.pem。客户端需要 client.pem、client.key 和 ca.pem。

使用 TLS 连接 Milvus 服务器
----------------------------

使用 Milvus SDK 时，请为客户端配置 `client.pem`、`client.key` 和 `ca.pem` 文件路径。

以下示例使用 Milvus Python SDK。

```python
from pymilvus import connections

_HOST = '127.0.0.1'
_PORT = '19530'

print(f"Create connection...")
connections.connect(host=_HOST, port=_PORT, secure=True, client_pem_path="cert/client.pem",
                        client_key_path="cert/client.key",
                        ca_pem_path="cert/ca.pem", server_name="localhost")
print(f"List connections:")
print(connections.list_connections())

```

请参见 [example_tls1.py](https://github.com/milvus-io/pymilvus/blob/master/examples/example_tls1.py) 和 [example_tls2.py](https://github.com/milvus-io/pymilvus/blob/master/examples/example_tls2.py) 获取更多信息。

