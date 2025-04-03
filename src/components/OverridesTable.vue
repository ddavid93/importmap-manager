<template>
  <TableButtonsSection v-model="currentSelectedModule" />

  <div class="rounded-md border overflow-auto">
    <TableSearch v-model="search" />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="column in visibleColumns" :key="column.key" class="bg-background/95">
            <Button variant="ghost" @click="toggleSort(column.key)" class="flex items-center">
              {{ column.label }}
              <ArrowUpDown class="ml-2 h-4 w-4" v-if="sortConfig.key !== column.key" />
              <ArrowUp class="ml-2 h-4 w-4" v-else-if="sortConfig.direction === 'asc'" />
              <ArrowDown class="ml-2 h-4 w-4" v-else />
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
              @click="selectModule(row)"
              class="cursor-pointer lowercase gap-4"
            >
              <template v-if="column.key === 'domain' && row.isOverride">
                <span
                  class="mr-2 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
                >
                  {{ getItemOverride(row.module_name)!.url }}</span
                >
                <span
                  v-if="overridesFromImportMap.imports[row.module_name]"
                  class="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20 ring-inset"
                >
                  {{ row[column.key] }}</span
                >
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
import { computed, ref, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
import { useModal } from '@/composables/useModal.ts'
import { type IModuleInfo, useImportMapOverrides } from '@/composables/useImportMapOverrides.ts'
import TableSearch from '@/components/TableSearch.vue'
import TableButtonsSection from '@/components/TableButtonsSection.vue'

const columns = [
  { key: 'module_name', label: 'Module Name' },
  { key: 'domain', label: 'Domain' }
] as const

const search = shallowRef('')
const { processOverrides, overridesFromImportMap, getItemOverride } = useImportMapOverrides()
type columnKeyType = (typeof columns)[number]['key']

const currentSelectedModule = ref<IModuleInfo>({
  module_name: '',
  domain: '',
  isOverride: false
})

const { dialogs } = useModal()

const sortConfig = ref<{
  key: columnKeyType | null
  direction: 'asc' | 'desc'
}>({ key: null, direction: 'asc' })

const columnVisibility = ref(Object.fromEntries(columns.map((col) => [col.key, true])))

const visibleColumns = computed(() => columns.filter((col) => columnVisibility.value[col.key]))

const sortedAndFilteredData = computed(() => {
  let result = [...processOverrides.value]

  if (search.value) {
    result = result.filter((item) =>
      item.module_name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (sortConfig.value.key !== null) {
    result.sort((a, b) => {
      const key = sortConfig.value.key as Exclude<typeof sortConfig.value.key, null>
      const aVal = a[key]
      const bVal = b[key]
      if (sortConfig.value.direction === 'asc') {
        return aVal.localeCompare(bVal)
      }
      return bVal.localeCompare(aVal)
    })
  }

  return result
})

// Methods
function toggleSort(key: columnKeyType) {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value = { key, direction: 'asc' }
  }
}

function selectModule(module: IModuleInfo) {
  const findOverride = getItemOverride(module.module_name)
  if (findOverride?.enabled) {
    module.domain = findOverride.url
  }
  currentSelectedModule.value = { ...module }
  dialogs.newModule = true
}
</script>
