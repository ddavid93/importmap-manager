import { ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'

export interface IModuleInfo {
  id: string
  module_name: string
  domain: string
  status: string
}

function useOverridesTableSingleton() {
  // @ts-ignore
  const overrideMap = window.importMapOverrides.getOverrideMap()
  const data = ref(processOverrides(overrideMap))

  function processOverrides(overrideMap: any) {
    return Object.keys(overrideMap.imports).map((moduleName) => {
      return {
        id: moduleName,
        module_name: moduleName,
        domain: overrideMap.imports[moduleName],
        status: 'override'
      }
    })
  }

  return { data, processOverrides }
}

export const useOverridesTable = createSharedComposable(useOverridesTableSingleton)
