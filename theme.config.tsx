import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

const docs = [ 
  {
    type: "category",
    label: "Getting Started",
    items: [
      {
        type: "doc",
        id: "getting-started/introduction",
        label: "Introduction"
      },
      {
        type: "doc",
        id: "getting-started/installation",
        label: "Installation"
      },
      {
        type: "doc",
        id: "getting-started/usage",
        label: "Usage"
      }
    ]
  },
  {
    type: "category",
    label: "Advanced",
    items: [
      {
        type: "doc",
        id: "advanced/webpack-config",
        label: "Webpack Config"
      },
      {
        type: "doc",
        id: "advanced/plugin-api",
        label: "Plugin API"
      }
    ]
  }
]

const config: DocsThemeConfig = {
  logo: <span>Milvus中文文档</span>,
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter } = useConfig()
    console.log(frontMatter)
    const url =
      'https://www.langchain.com.cn' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`)
 
    return <>
      <meta name="keywords" content="langchain,LLM,chatGPT,应用开发" />
      <meta name="description" content="LangChain中文站，助力大语言模型LLM应用开发、chatGPT应用开发。" />
      <meta property="og:url" content={url} />
      <meta property="og:description" content="LangChain中文站，助力大语言模型LLM应用开发、chatGPT应用开发。" />
    </>
  },
  useNextSeoProps:() =>{
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Milvus向量库中文文档'
      }
    }
  },
  sidebar: {
  },
  project: {
    link: 'https://github.com/liteli1987gmail/milnvs_docs',
  },
  docsRepositoryBase: 'https://github.com/liteli1987gmail/milnvs_docs',
  toc: {
    float: true,
    extraContent:(
      <div>
        <img src="https://pic1.zhimg.com/80/v2-31131dcb1732cb5bca7c182c9e8da046_r.jpg" alt="扫我，入群" />
      </div>
    )
  },
  footer: {
    text: <div><span>MIT {new Date().getFullYear()} © <a href="https://www.milvus-io.com" target="_blank">Milvus-io中文文档</a>.  </span>
      <span><a href="https://www.Langchain.com.cn" target="_blank">Langchain中文网</a>  </span>
    <span><a href="https://www.r-p-a.com/llm-gpt-kaifa/" target="_blank">LLM/GPT应用外包开发    </a></span>
    <span><a href="https://www.openaidoc.com.cn" target="_blank">OpenAI中文文档    </a></span>
    </div>
  }
}

export default config
