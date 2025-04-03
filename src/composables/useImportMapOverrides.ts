import { createSharedComposable, useLocalStorage } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { useOverridesUtils } from "@/composables/useOverridesUtils.ts";
import type { ImportMap } from "@/lib/utils.ts";

export interface IModuleInfo {
  module_name: string;
  domain: string;
  isOverride: boolean;
}

export interface IOverrideInfo {
  name: string;
  url: string;
  enabled: boolean;
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

  const processOverrides = computed(() => {
    const { imports } = overridesFromImportMap.value;
    const result = Object.keys(imports).map((moduleName) => {
      return {
        module_name: moduleName,
        domain: imports[moduleName],
        isOverride: overrides.value.some(
          ({ name, enabled }) => name === moduleName && enabled
        ),
      };
    });
    const overridesParsed = overrides.value
      .filter((f) => !result.some((r) => r.module_name === f.name))
      .map((m) => ({
        module_name: m.name,
        domain: m.url,
        isOverride: m.enabled,
      }));
    return [...result, ...overridesParsed].sort(
      (a, b) => +b.isOverride - +a.isOverride
    );
  });

  /**
   * Retrieves an override item from the overrides collection based on the specified module name.
   *
   * @param {string} moduleName - The name of the module to find in the overrides' collection.
   * @return {Object|undefined} The override item that matches the specified module name, or undefined if no match is found.
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
      const imports = onlyEnables.reduce(
        (acc: Record<string, string>, { name, url }) => {
          acc[name] = url;
          return acc;
        },
        {}
      );
      insertOverrideMap({ imports, scopes: {} });
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
