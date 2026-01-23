<template>
  <TableBody>
    <template v-if="rows.length">
      <TableRow
        v-for="row in rows"
        :key="row.module_name"
        :class="{ 'bg-green-50': row.isOverride }"
      >
        <TableCell class="w-8">
          <div
            class="hover:cursor-pointer flex items-center justify-center"
            @click.stop="togglePin(row)"
          >
            <Pin
              v-if="isPinned(row.module_name)"
              class="h-4 w-4 text-amber-500"
            />
            <PinOff v-else class="h-4 w-4 text-muted-foreground" />
          </div>
        </TableCell>

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
                :class="{
                  'badge-active': getItemOverride(row.module_name)?.enabled,
                  'badge-inactive': !getItemOverride(row.module_name)?.enabled,
                }"
                class="flex items-center gap-2"
                @click.stop="toggleOverride(row)"
              >
                <Replace class="h-4 w-4" />
                <span>{{ getItemOverride(row.module_name)?.url }}</span>
              </div>
              <div
                v-if="overridesFromImportMap.imports[row.module_name]"
                :class="{
                  'badge-pending': !getItemOverride(row.module_name)?.enabled,
                  'badge-inactive': getItemOverride(row.module_name)?.enabled,
                }"
                class="flex items-center gap-2"
                @click.stop="toggleOverride(row)"
              >
                <Home class="h-4 w-4" /> <span>{{ row[column.key] }}</span>
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
      <TableCell :colspan="visibleColumns.length + 1" class="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  </TableBody>
</template>

<script lang="ts" setup>
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Home, Pin, PinOff, Replace } from "lucide-vue-next";
import type {
  IImportMap,
  IModuleInfo,
  IOverrideInfo,
  IOverridesTableColumn,
} from "@/types/importMap.ts";

defineProps<{
  rows: IModuleInfo[];
  visibleColumns: IOverridesTableColumn[];
  overridesFromImportMap: IImportMap;
  getItemOverride: (moduleName: string) => IOverrideInfo | undefined;
  isPinned: (moduleName: string) => boolean;
  togglePin: (module: IModuleInfo) => void;
  selectModule: (module: IModuleInfo) => void;
  toggleOverride: (module: IModuleInfo) => void;
}>();
</script>