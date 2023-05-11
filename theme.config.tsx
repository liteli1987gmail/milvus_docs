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
    text: 'Milvus中文文档',
  }
}

export default config
