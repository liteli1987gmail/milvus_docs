


# 日志相关配置

本主题介绍了 Milvus 的日志相关配置。

使用 Milvus 会生成一系列的日志。默认情况下，Milvus 使用日志记录标准输出(stdout)和标准错误(stderr)的调试级别及更高级别的信息。

在本节中，你可以配置系统的日志输出。

## `log.level`

<table id="log.level">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> Milvus 日志级别。</li>
        <li> 选项：<code> debug </code>、<code> info </code>、<code> warn </code>、<code> error </code>、<code> panic </code> 和 <code> fatal </code> </li>
        <li> 建议在测试和开发环境中使用 <code> debug </code> 级别，在生产环境中使用 <code> info </code> 级别。</li>
      </td>
      <td> <code> debug </code> </td>
    </tr>
  </tbody>
</table>

## `log.file.rootPath`

<table id="log.file.rootPath">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 日志文件的根路径。</li>
        <li> 默认值为空，表示输出日志文件到标准输出(stdout)和标准错误(stderr)。</li>
        <li> 如果将此参数设置为有效的本地路径，Milvus 将在此路径中写入和存储日志文件。</li>
        <li> 将此参数设置为你具有写入权限的路径。</li>
      </td>
      <td> "" </td>
    </tr>
  </tbody>
</table>

## `log.file.maxSize`

<table id="log.file.maxSize">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 日志文件的最大大小。</li>
        <li> 单位：MB </li>
      </td>
      <td> 300 </td>
    </tr>
  </tbody>
</table>

## `log.file.maxAge`
 

<table id="log.file.maxAge">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 日志文件自动清除之前的最大保留时间。</li>
        <li> 单位：天 </li>
        <li> 最小值为 1。</li>
        <li> 此参数仅在设置有效的 <code> log.file.rootPath <code> 后才生效。</li>
      </td>
      <td> 10 </td>
    </tr>
  </tbody>
</table>

## `log.file.maxBackups`

<table id="log.file.maxBackups">
  <thead>
    <tr>
      <th class="width80"> 描述 </th>
      <th class="width20"> 默认值 </th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <li> 备份的日志文件最大数量。</li>
        <li> 单位：天 </li>
        <li> 最小值为 1。</li>
        <li> 此参数仅在设置有效的 <code> log.file.rootPath <code> 后才生效。</li>
      </td>
      <td> 20 </td>
    </tr>
  </tbody>
</table>

## `log.format`






# 


| Description           | Default Value |
|-----------------------|---------------|
| Milvus log format.    | text          |
| Option: `text` and `JSON`. | text          |

