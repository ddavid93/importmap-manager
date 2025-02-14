<template>
  <div class="flex flex-col sm:flex-row gap-2 items-center py-4">
    <!-- Search/Filter Input -->
    <AddModule v-model:open="open" v-model="currentSelectedModule" />
    <AddImportMap />
    <ConfirmDelete @confirm="resetOverrides" />

    <!-- Column Visibility Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="ml-auto">
          Columns
          <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          v-for="column in columns"
          :key="column.key"
          class="capitalize"
          :checked="columnVisibility[column.key]"
          @update:checked="toggleColumnVisibility(column.key)"
        >
          {{ column.label }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div class="relative pb-4">
    <Autocomplete ref="search" @selected-item="filterByModule" :items="uniqueModuleNames" />
  </div>

  <div class="rounded-md border overflow-auto">
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
          <TableRow v-for="row in sortedAndFilteredData" :key="row.id">
            <TableCell
              v-for="column in visibleColumns"
              :key="column.key"
              @click="selectModule(row)"
              class="cursor-pointer lowercase"
            >
              {{ row[column.key] }}
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
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ConfirmDelete from '@/components/ui/confirm-delete/ConfirmDelete.vue'
import AddModule from '@/components/AddModule.vue'
import AddImportMap from '@/components/AddImportMap.vue'
import { type IModuleInfo, useOverridesTable } from '@/composables/useOverridesTable'
import Autocomplete from '@/components/ui/autocomplete/Autocomplete.vue'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { onStartTyping } from '@vueuse/core'

const { data } = useOverridesTable()
const props = defineProps<{
  isOpen: boolean
}>()

// Column definitions
const columns = [
  { key: 'module_name', label: 'Module Name' },
  { key: 'domain', label: 'Domain' },
  { key: 'status', label: 'Module Status' }
] as const

type columnKeyType = (typeof columns)[number]['key']

// State
const currentSelectedModule = ref<IModuleInfo>({
  id: '',
  module_name: '',
  domain: '',
  status: ''
})
const open = ref(false)
const search = ref<typeof Autocomplete | null>(null)

const sortConfig = ref<{
  key: columnKeyType | null
  direction: 'asc' | 'desc'
}>({ key: null, direction: 'asc' })
const columnVisibility = ref(Object.fromEntries(columns.map((col) => [col.key, true])))
const filterText = ref('')

// Computed properties
const visibleColumns = computed(() => columns.filter((col) => columnVisibility.value[col.key]))

const uniqueModuleNames = computed(() => [...new Set(data.value.map((item) => item.module_name))])

const sortedAndFilteredData = computed(() => {
  let result = [...data.value]

  // Apply filter
  if (filterText.value) {
    result = result.filter((item) =>
      item.module_name.toLowerCase().includes(filterText.value.toLowerCase())
    )
  }

  // Apply sort
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

function toggleColumnVisibility(key: string) {
  columnVisibility.value[key] = !columnVisibility.value[key]
}

function filterByModule(value: string) {
  filterText.value = value
}

function selectModule(module: IModuleInfo) {
  currentSelectedModule.value = { ...module }
  open.value = true
}

function resetOverrides() {
  // @ts-ignore
  window.importMapOverrides.resetOverrides()
}

onStartTyping(() => {
  if (props.isOpen && search.value && !search.value.active) {
    search.value.focus()
  }
})

// Watch for currentSelectedModule changes
watch(currentSelectedModule, (val) => {
  open.value = !!val.id
})
</script>
