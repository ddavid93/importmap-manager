<template>
  <TableButtonsSection v-model="currentSelectedModule" />

  <div class="rounded-md border overflow-auto">
    <TableSearch v-model="search" />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-8 bg-background/95"></TableHead>
          <TableHead
            v-for="column in visibleColumns"
            :key="column.key"
            class="bg-background/95"
          >
            <Button
              class="flex items-center"
              variant="ghost"
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
                      'badge-inactive': !getItemOverride(row.module_name)
                        ?.enabled,
                    }"
                    class="flex items-center gap-2"
                    @click.stop="toggle(row)"
                  >
                    <Replace class="h-4 w-4" />
                    <span>{{ getItemOverride(row.module_name)?.url }}</span>
                  </div>
                  <div
                    v-if="overridesFromImportMap.imports[row.module_name]"
                    :class="{
                      'badge-pending': !getItemOverride(row.module_name)
                        ?.enabled,
                      'badge-inactive': getItemOverride(row.module_name)
                        ?.enabled,
                    }"
                    class="flex items-center gap-2"
                    @click.stop="toggle(row)"
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
          <TableCell
            :colspan="visibleColumns.length + 1"
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
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
  Pin,
  PinOff,
  Replace,
} from "lucide-vue-next";
import TableSearch from "@/components/TableSearch.vue";
import TableButtonsSection from "@/components/TableButtonsSection.vue";
import { useOverridesTable } from "@/composables/useOverridesTable.ts";

const {
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
} = useOverridesTable();
</script>
