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
  logo: <span>Milnus中文站</span>,
  sidebar: {
  },
  project: {
    link: 'https://github.com/liteli1987gmail/milnvs_docs',
  },
  docsRepositoryBase: 'https://github.com/liteli1987gmail/milnvs_docs',
  footer: {
    text: 'MILVUS中文站',
  }
}

export default config
