<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <div class="relative">
        <Autocomplete
          @selected-item="table.getColumn('module_name')?.setFilterValue($event)"
          :items="table.getRowModel().rows.map(({ original }) => original.module_name)"
        />
      </div>
      <AddModule v-model:open="open" v-model="currentSelectedModule" />
      <AddImportMap />
      <ConfirmDelete @confirm="resetOverrides" />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((col) => col.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="
              (value) => {
                column.toggleVisibility(!!value)
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              :class="
                cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
                )
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-pinned="cell.column.getIsPinned()"
                :class="
                  cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
                  )
                "
              >
                <FlexRender
                  class="cursor-pointer"
                  @click="currentSelectedModule = cell.row.original"
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell col-span="{columns.length}" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'

import { h, shallowRef, watch } from 'vue'
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
import { cn, valueUpdater } from '@/lib/utils'
import ConfirmDelete from '@/components/ui/confirm-delete/ConfirmDelete.vue'
import AddModule from '@/components/AddModule.vue'
import AddImportMap from '@/components/AddImportMap.vue'
import { type IModuleInfo, useOverridesTable } from '@/composables/useOverridesTable'
import Autocomplete from '@/components/ui/autocomplete/Autocomplete.vue'

const columnHelper = createColumnHelper<IModuleInfo>()

const currentSelectedModule = shallowRef<IModuleInfo>({
  id: '',
  module_name: '',
  domain: '',
  status: ''
})

const open = shallowRef(false)
watch(currentSelectedModule, (val) => (open.value = !!val.id))

const columns = [
  columnHelper.accessor('module_name', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Module Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('module_name'))
  }),
  columnHelper.accessor('domain', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Domain', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('domain'))
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Module Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('status'))
  })
]

const sorting = shallowRef<SortingState>([])
const columnFilters = shallowRef<ColumnFiltersState>([])
const columnVisibility = shallowRef<VisibilityState>({})
const rowSelection = shallowRef({})
const { data } = useOverridesTable()
const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    }
  }
})

function resetOverrides() {
  window.importMapOverrides.resetOverrides()
}
</script>
