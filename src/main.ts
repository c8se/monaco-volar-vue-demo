import { fsMap } from './fs-map'
import { setupMonacoEnvVue } from './setup-vue'

import * as monaco from 'monaco-editor'

import { getHighlighter } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case 'json':
        return new jsonWorker()
      case 'css':
        return new cssWorker()
      case 'html':
        return new htmlWorker()
      case 'typescript':
      case 'javascript':
        return new tsWorker()
      default:
        return new editorWorker()
    }
  }
}
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  allowJs: true,
  // jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  skipLibCheck: true,
  allowImportingTsExtensions: true,
  allowNonTsExtensions: true,
  isolatedModules: true
})

await setupMonacoEnvVue()
const highlighter = await getHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: ['javascript', 'typescript', 'vue', 'html']
})
shikiToMonaco(highlighter, monaco as any)

const element = document.getElementById('app')!
const editorInstance = monaco.editor.create(element, {
  theme: 'vitesse-dark'
})
const modelMap = new Map(
  Object.keys(fsMap).map(k => [k, monaco.editor.createModel(fsMap[k], undefined, monaco.Uri.parse(`file://${k}`))])
)

const button = document.createElement('button')
button.innerText = 'next'
let index = 1
const keys = Object.keys(fsMap)
button.addEventListener('click', () => {
  index = (index + 1) % keys.length
  editorInstance.setModel(modelMap.get(keys[index])!)
})
document.body.appendChild(button)

editorInstance.setModel(modelMap.get(keys[index])!)
