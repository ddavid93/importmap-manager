import { createSharedComposable, useLocalStorage } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { useOverridesUtils } from "@/composables/useOverridesUtils.ts";
import { extractScopeFromUrl, type ImportMap } from "@/lib/utils.ts";

export interface IModuleInfo {
  module_name: string;
  domain: string;
  isOverride: boolean;
  scope: Record<string, string> | null;
}

export interface IOverrideInfo {
  name: string;
  url: string;
  enabled: boolean;
  scope: Record<string, string> | null;
}

export const IMPORT_MAP_MANAGER_EXTERNAL_KEY = "importmap-manager-external";
export const IMPORT_MAP_MANAGER_OVERRIDES_KEY = "importmap-manager-overrides";

function useImportMapOverridesSingleton() {
  const overridesFromImportMap = ref<ImportMap>({ imports: {}, scopes: {} });

  const overrides = useLocalStorage<IOverrideInfo[]>(
    IMPORT_MAP_MANAGER_OVERRIDES_KEY,
    []
  );

  const externalImportMap = useLocalStorage<{ url: string; enabled: boolean }>(
    IMPORT_MAP_MANAGER_EXTERNAL_KEY,
    { enabled: false, url: "" }
  );

  // Helper function to find the scope by partial match
  const getScopeForModule = (
    moduleName: string,
    imports: { [p: string]: string },
    scopes: {
      [scope: string]: {
        [moduleName: string]: string;
      };
    }
  ) => {
    const importUrl = imports[moduleName];
    if (!importUrl) return null;

    // Check if any scope key is a substring of the import URL
    for (const scopeUrl in scopes) {
      if (importUrl.includes(scopeUrl)) {
        return scopes[scopeUrl];
      }
    }
    return null;
  };

  const processOverrides = computed(() => {
    const { imports, scopes } = overridesFromImportMap.value;
    const result = Object.keys(imports).map((moduleName) => {
      return {
        module_name: moduleName,
        domain: imports[moduleName],
        isOverride: overrides.value.some(
          ({ name, enabled }) => name === moduleName && enabled
        ),
        scope: getScopeForModule(moduleName, imports, scopes),
      };
    });
    const overridesParsed = overrides.value
      .filter((f) => !result.some((r) => r.module_name === f.name))
      .map((m) => ({
        module_name: m.name,
        domain: m.url,
        isOverride: m.enabled,
        scope: getScopeForModule(m.name, imports, scopes),
      }));
    return [...result, ...overridesParsed].sort(
      (a, b) => +b.isOverride - +a.isOverride
    );
  });

  /**
   * Retrieves an override item from the overrides collection based on the specified module name.
   */
  function getItemOverride(moduleName: string) {
    return overrides.value.find((f) => f.name === moduleName);
  }

  const { insertOverrideMap, getDefaultMap, fetchExternalMap } =
    useOverridesUtils();

  onMounted(async () => {
    overridesFromImportMap.value = await getDefaultMap();

    if (externalImportMap.value?.enabled) {
      const external = await fetchExternalMap(externalImportMap.value.url);
      overridesFromImportMap.value = {
        ...overridesFromImportMap.value,
        ...external,
      };
    }
  });

  watch(
    overrides,
    (val) => {
      const onlyEnables = val.filter((f) => f.enabled);
      const { imports, scopes } = onlyEnables.reduce(
        (acc, { name, url, scope }) => {
          acc.imports[name] = url;

          const extractedScope = extractScopeFromUrl(url);
          if (extractedScope) {
            acc.scopes[extractedScope] =
              acc.scopes[extractedScope] || scope || {};
          }

          return acc;
        },
        {
          imports: {} as Record<string, string>,
          scopes: {} as Record<string, Record<string, string>>,
        }
      );

      insertOverrideMap({ imports, scopes });
    },
    { immediate: true }
  );

  watch(
    () => externalImportMap.value,
    async (val) => {
      if (val?.url && val?.enabled) {
        insertOverrideMap(val.url, true);
        overridesFromImportMap.value = await fetchExternalMap(val.url);
      } else {
        insertOverrideMap("", true);
      }
    },
    { immediate: true }
  );

  return {
    processOverrides,
    externalImportMap,
    overrides,
    overridesFromImportMap,
    getItemOverride,
  };
}

export const useImportMapOverrides = createSharedComposable(
  useImportMapOverridesSingleton
);
