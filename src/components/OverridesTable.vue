<template>
  <TableButtonsSection v-model="currentSelectedModule" />

  <div class="rounded-md border overflow-auto">
    <TableSearch v-model="search" />
    <Table>
      <OverridesTableHeader
        :visibleColumns="visibleColumns"
        :sortConfig="sortConfig"
        :onToggleSort="toggleSort"
      />
      <OverridesTableBody
        :rows="sortedAndFilteredData"
        :visibleColumns="visibleColumns"
        :overridesFromImportMap="overridesFromImportMap"
        :getItemOverride="getItemOverride"
        :isPinned="isPinned"
        :togglePin="togglePin"
        :selectModule="selectModule"
        :toggleOverride="toggle"
      />
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { Table } from "@/components/ui/table";
import TableButtonsSection from "@/components/TableButtonsSection.vue";
import TableSearch from "@/components/TableSearch.vue";
import OverridesTableBody from "@/components/OverridesTableBody.vue";
import OverridesTableHeader from "@/components/OverridesTableHeader.vue";
import { useOverridesTable } from "@/composables/useOverridesTable.ts";

const {
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
} = useOverridesTable();
</script>
