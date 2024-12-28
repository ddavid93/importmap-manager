export interface IModuleInfo {
  id: string
  module_name: string
  domain: string
  status: string
}

export function useOverridesTable() {
  const overrideMap = window.importMapOverrides.getOverrideMap()
  const data = Object.keys(overrideMap.imports).map((moduleName) => {
    return {
      id: moduleName,
      module_name: moduleName,
      domain: overrideMap.imports[moduleName],
      status: 'override'
    }
  })
  return { data }
}
