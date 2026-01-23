import { computed, ref, shallowRef } from "vue";
import { useImportMapOverrides } from "@/composables/useImportMapOverrides.ts";
import { useImportMapPins } from "@/composables/useImportMapPins.ts";
import { deepCloneModuleInfoList } from "@/lib/utils.ts";
import type { IModuleInfo } from "@/types/importmap.types.ts";

const columns = [
  { key: "module_name", label: "Module Name" },
  { key: "domain", label: "Domain" },
] as const;

type ColumnKeyType = (typeof columns)[number]["key"];

export function useOverridesTable() {
  const search = shallowRef("");
  const { processOverrides, overridesFromImportMap, getItemOverride } =
    useImportMapOverrides();

  const currentSelectedModule = ref<IModuleInfo>({
    module_name: "",
    domain: "",
    isOverride: false,
    scope: {},
  });

  const sortConfig = ref<{
    key: ColumnKeyType | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const columnVisibility = ref<Record<ColumnKeyType, boolean>>({
    module_name: true,
    domain: true,
  });

  const visibleColumns = computed(() =>
    columns.filter((col) => columnVisibility.value[col.key])
  );

  const { isPinned, togglePin } = useImportMapPins();

  const sortedAndFilteredData = computed(() => {
    const base = deepCloneModuleInfoList(processOverrides.value);

    const filtered = search.value
      ? base.filter((item) =>
          item.module_name.toLowerCase().includes(search.value.toLowerCase())
        )
      : base;

    const pinned: IModuleInfo[] = [];
    const unpinned: IModuleInfo[] = [];
    for (const item of filtered) {
      if (isPinned(item.module_name)) {
        pinned.push(item);
      } else {
        unpinned.push(item);
      }
    }

    const key = sortConfig.value.key;
    if (key) {
      const direction = sortConfig.value.direction;

      pinned.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
      unpinned.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return [...pinned, ...unpinned];
  });

  function toggleSort(key: ColumnKeyType) {
    if (sortConfig.value.key === key) {
      sortConfig.value.direction =
        sortConfig.value.direction === "asc" ? "desc" : "asc";
    } else {
      sortConfig.value = { key, direction: "asc" };
    }
  }

  function selectModule(module: IModuleInfo) {
    const findOverride = getItemOverride(module.module_name);
    currentSelectedModule.value = {
      ...module,
      domain: findOverride?.enabled ? findOverride.url : module.domain,
    };
  }

  function toggle(module: IModuleInfo) {
    const override = getItemOverride(module.module_name);
    if (override) {
      override.enabled = !override.enabled;
    } else {
      selectModule(module);
    }
  }

  return {
    search,
    currentSelectedModule,
    sortConfig,
    visibleColumns,
    sortedAndFilteredData,
    overridesFromImportMap,
    getItemOverride,
    isPinned,
    togglePin,
    toggleSort,
    selectModule,
    toggle,
  };
}
