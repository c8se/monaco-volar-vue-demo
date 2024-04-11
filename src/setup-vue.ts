import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

import vueWorker from './vue-worker?worker'

import * as vls from '@volar/language-service'
import { editor, languages } from 'monaco-editor'
import * as volar from '@volar/monaco'

export const setupMonacoEnvVue = async () => {
  languages.register({ id: 'vue', extensions: ['.vue'] })
  self.MonacoEnvironment ??= {}
  const getWorker = self.MonacoEnvironment.getWorker ?? (() => new editorWorker())

  self.MonacoEnvironment.getWorker = (_: any, label: string) => {
    if (label === 'vue') {
      return new vueWorker()
    }
    return getWorker(_, label)
  }

  const worker = editor.createWebWorker<vls.LanguageService>({
    moduleId: 'vs/language/vue/vueWorker',
    label: 'vue',
    createData: {}
  })

  // worker
  const languageId = ['vue']
  const getSyncUris = () => editor.getModels().map(model => model.uri)
  volar.activateMarkers(worker, languageId, 'vue', getSyncUris, editor)
  volar.activateAutoInsertion(worker, languageId, getSyncUris, editor)
  await volar.registerProviders(worker, languageId, getSyncUris, languages)
}
