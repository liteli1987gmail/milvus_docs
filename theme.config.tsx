import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

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
  sidebar: {
  },
  project: {
    link: 'https://github.com/liteli1987gmail/milnvs_docs',
  },
  docsRepositoryBase: 'https://github.com/liteli1987gmail/milnvs_docs',
  footer: {
    text: <div><span>MIT {new Date().getFullYear()} © <a href="https://www.milvus-io.com/overview" target="_blank">Milvus-io中文文档</a>.  </span>
      <span><a href="https://www.Langchain.com.cn" target="_blank">Langchain中文网</a>  </span>
    <span><a href="http://www.r-p-a.com/llm-gpt-kaifa/" target="_blank">LLM/GPT应用外包开发    </a></span>
    <span><a href="https://www.openaidoc.com.cn" target="_blank">Openai中文文档    </a></span>
    </div>
  }
}

export default config
