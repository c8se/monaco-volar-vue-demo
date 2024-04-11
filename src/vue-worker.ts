import * as vls from '@vue/language-service'
import type * as monaco from 'monaco-editor'
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker'
import ts from 'typescript'

import { ServiceEnvironment, createTypeScriptWorkerService } from '@volar/monaco/worker'

import { create as createTypeScriptService } from 'volar-service-typescript'

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext) => {
    const env: ServiceEnvironment = {
      workspaceFolder: '/',
      typescript: {
        uriToFileName: v => v,
        fileNameToUri: v => v
      }
    }
    const compilerOptions: ts.CompilerOptions = {
      ...ts.getDefaultCompilerOptions(),
      allowJs: true,
      // jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      skipLibCheck: true,
      allowImportingTsExtensions: true,
      allowNonTsExtensions: true,
      isolatedModules: true
    }

    const vueOptions = vls.resolveVueCompilerOptions({})
    const vueLanguagePlugin = vls.createVueLanguagePlugin(
      ts,
      v => v,
      true,
      () => '1',
      () => [], // projectContext.typescript?.host.getScriptFileNames() ??
      {}, //  commandLine?.options ??
      vueOptions
    ) as any

    const getTsPluginClient = vls.createDefaultGetTsPluginClient(ts, () => vueOptions)

    const servicePlugins = vls.createVueServicePlugins(ts, () => vueOptions, getTsPluginClient, true) as any

    const workerService = createTypeScriptWorkerService<vls.LanguageService>({
      typescript: ts,
      compilerOptions,
      env,
      workerContext: ctx,
      languagePlugins: [vueLanguagePlugin],
      servicePlugins: [...createTypeScriptService(ts), ...servicePlugins]
    })

    return workerService
  })
}
