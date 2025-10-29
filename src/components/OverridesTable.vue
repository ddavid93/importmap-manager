<template>
  <TableButtonsSection v-model="currentSelectedModule" />

  <div class="rounded-md border overflow-auto">
    <TableSearch v-model="search" />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in visibleColumns"
            :key="column.key"
            class="bg-background/95"
          >
            <Button
              variant="ghost"
              class="flex items-center"
              @click="toggleSort(column.key)"
            >
              {{ column.label }}
              <ArrowUpDown
                v-if="sortConfig.key !== column.key"
                class="ml-2 h-4 w-4"
              />
              <ArrowUp
                v-else-if="sortConfig.direction === 'asc'"
                class="ml-2 h-4 w-4"
              />
              <ArrowDown v-else class="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="sortedAndFilteredData.length">
          <TableRow
            v-for="row in sortedAndFilteredData"
            :key="row.module_name"
            :class="{ 'bg-green-50': row.isOverride }"
          >
            <TableCell
              v-for="column in visibleColumns"
              :key="column.key"
              class="cursor-pointer gap-4"
              @click="selectModule(row)"
            >
              <template v-if="column.key === 'domain'">
                <div class="flex items-center flex-row gap-2">
                  <div
                    v-if="getItemOverride(row.module_name)"
                    class="flex items-center gap-2"
                    :class="{
                      'badge-active': getItemOverride(row.module_name)?.enabled,
                      'badge-inactive': !getItemOverride(row.module_name)
                        ?.enabled,
                    }"
                    @click.stop="toggle(row)"
                  >
                    <Replace class="h-4 w-4" /> <span>{{ getItemOverride(row.module_name)?.url }}</span>
                  </div>
                  <div
                    v-if="overridesFromImportMap.imports[row.module_name]"
                    class="flex items-center gap-2"
                    :class="{
                      'badge-pending': !getItemOverride(row.module_name)
                        ?.enabled,
                      'badge-inactive': getItemOverride(row.module_name)
                        ?.enabled,
                    }"
                    @click.stop="toggle(row)"

                  >
                    <Home class="h-4 w-4"/> <span>{{ row[column.key] }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ row[column.key] }}
              </template>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="visibleColumns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Home,
  Replace,
} from "lucide-vue-next";
import { useModal } from "@/composables/useModal.ts";
import {
  type IModuleInfo,
  useImportMapOverrides,
} from "@/composables/useImportMapOverrides.ts";
import TableSearch from "@/components/TableSearch.vue";
import TableButtonsSection from "@/components/TableButtonsSection.vue";

const columns = [
  { key: "module_name", label: "Module Name" },
  { key: "domain", label: "Domain" },
] as const;

const search = shallowRef("");
const { processOverrides, overridesFromImportMap, getItemOverride } =
  useImportMapOverrides();
type columnKeyType = (typeof columns)[number]["key"];

const currentSelectedModule = ref<IModuleInfo>({
  module_name: "",
  domain: "",
  isOverride: false,
  scope: {},
});

const { dialogs } = useModal();

const sortConfig = ref<{
  key: columnKeyType | null;
  direction: "asc" | "desc";
}>({ key: null, direction: "asc" });

const columnVisibility = ref(
  Object.fromEntries(columns.map((col) => [col.key, true]))
);

const visibleColumns = computed(() =>
  columns.filter((col) => columnVisibility.value[col.key])
);

const sortedAndFilteredData = computed(() => {
  let result = [...processOverrides.value];

  if (search.value) {
    result = result.filter((item) =>
      item.module_name.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  if (sortConfig.value.key !== null) {
    result.sort((a, b) => {
      const key = sortConfig.value.key as Exclude<
        typeof sortConfig.value.key,
        null
      >;
      const aVal = a[key];
      const bVal = b[key];
      if (sortConfig.value.direction === "asc") {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });
  }

  return result;
});

// Methods
function toggleSort(key: columnKeyType) {
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
    selectModule(module)
  }
}

</script>
