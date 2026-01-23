import { computed, ref, shallowRef } from "vue";
import { useImportMapOverrides } from "@/composables/useImportMapOverrides.ts";
import { useImportMapPins } from "@/composables/useImportMapPins.ts";
import { useModal } from "@/composables/useModal.ts";
import { deepCloneModuleInfoList } from "@/lib/utils.ts";
import type {
  IModuleInfo,
  IOverridesTableColumn,
  OverridesTableColumnKeyType,
} from "@/types/importMap.ts";

const columns: IOverridesTableColumn[] = [
  { key: "module_name", label: "Module Name" },
  { key: "domain", label: "Domain" },
];

export function useOverridesTable() {
  const search = shallowRef("");
  const { processOverrides, overridesFromImportMap, getItemOverride } =
    useImportMapOverrides();
  const { isPinned, togglePin } = useImportMapPins();
  const { dialogs } = useModal();

  const currentSelectedModule = ref<IModuleInfo>({
    module_name: "",
    domain: "",
    isOverride: false,
    scope: {},
  });

  const sortConfig = ref<{
    key: OverridesTableColumnKeyType | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const columnVisibility = ref(
    Object.fromEntries(columns.map((col) => [col.key, true]))
  );

  const visibleColumns = computed(() =>
    columns.filter((col) => columnVisibility.value[col.key])
  );

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
      if (isPinned(item.module_name)) pinned.push(item);
      else unpinned.push(item);
    }

    if (sortConfig.value.key !== null) {
      const key = sortConfig.value.key as Exclude<
        typeof sortConfig.value.key,
        null
      >;
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

  function toggleSort(key: OverridesTableColumnKeyType) {
    if (sortConfig.value.key === key) {
      sortConfig.value.direction =
        sortConfig.value.direction === "asc" ? "desc" : "asc";
    } else {
      sortConfig.value = { key, direction: "asc" };
    }
  }

  function selectModule(module: IModuleInfo) {
    const findOverride = getItemOverride(module.module_name);
    if (findOverride?.enabled) {
      module.domain = findOverride.url;
    }

    currentSelectedModule.value = { ...module };
    dialogs.newModule = true;
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
    currentSelectedModule,
    getItemOverride,
    overridesFromImportMap,
    search,
    sortedAndFilteredData,
    sortConfig,
    toggle,
    togglePin,
    toggleSort,
    visibleColumns,
    isPinned,
    selectModule,
  };
}