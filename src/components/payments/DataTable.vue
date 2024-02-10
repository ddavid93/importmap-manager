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

import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, valueUpdater } from '@/lib/utils'
import ConfirmDelete from '@/components/ui/confirm-delete/ConfirmDelete.vue'
import AddModule from '@/components/AddModule.vue'
import AddImportMap from '@/components/AddImportMap.vue'

const data = [
  {
    id: 'RandomNumber1',
    module_name: 'single-spa',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'single-spa.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber2',
    module_name: 'single-spa-vue',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'single-spa-vue.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber3',
    module_name: 'axios',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'axios.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber4',
    module_name: 'vue-axios',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vue-axios.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber5',
    module_name: 'vue',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vue.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber6',
    module_name: 'vuetify',
    domain: 'https://cdnjs.cloudflare.com',
    filename: 'vuetify.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber7',
    module_name: 'vuex',
    domain: 'https://cdnjs.cloudflare.com',
    filename: 'vuex.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber8',
    module_name: 'vue-i18n',
    domain: 'https://unpkg.com',
    filename: 'vue-i18n.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber9',
    module_name: 'vue-router',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vue-router.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber10',
    module_name: 'vue-moment',
    domain: 'https://cdnjs.cloudflare.com',
    filename: 'vue-moment.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber11',
    module_name: 'moment',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'moment-with-locales.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber12',
    module_name: 'moment-timezone',
    domain: 'https://cdnjs.cloudflare.com',
    filename: 'moment-timezone.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber13',
    module_name: 'vueperslides',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vueperslides.umd.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber14',
    module_name: 'lodash',
    domain: 'https://cdnjs.cloudflare.com',
    filename: 'lodash.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber15',
    module_name: 'vue-tel-input',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vue-tel-input.umd.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber16',
    module_name: 'rxjs',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'rxjs.min.js',
    status: 'default'
  },
  {
    id: 'RandomNumber17',
    module_name: 'vee-validate',
    domain: 'https://cdn.jsdelivr.net',
    filename: 'vee-validate.min.js',
    status: 'default'
  }
]

interface IModuleInfo {
  id: string;
  module_name: string;
  domain: string;
  filename: string;
  status: string;
}

const columnHelper = createColumnHelper<IModuleInfo>()

const columns = [
  columnHelper.accessor('status', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      }, () => ['Module Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('status'))
  }),
  columnHelper.accessor('module_name', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      }, () => ['Module Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('module_name'))
  }),
  columnHelper.accessor('domain', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      }, () => ['Domain', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('domain'))
  }),
  columnHelper.accessor('filename', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      }, () => ['Filename', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('filename'))
  })
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
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
    },
    columnPinning: {
      left: ['status']
    }
  }
})

const getState = table.getState()
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <div class="group relative">
        <div class="top-0 flex justify-center">
          <div
            class="h-[1px] outline-none animate-border-width group-focus:bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
        </div>
        <Input
          class="block max-w-sm focus-visible:outline-none"
          placeholder="Filter module name..."
          :model-value="table.getColumn('module_name')?.getFilterValue() as string"
          @update:model-value=" table.getColumn('module_name')?.setFilterValue($event)"
        />
      </div>
      <AddModule />
      <AddImportMap />
      <ConfirmDelete />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="(value) => {
              column.toggleVisibility(!!value)
            }"
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
              v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
              :class="cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )"
            >
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                          :props="header.getContext()" />
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
                v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                :class="cn(
                  { 'sticky bg-background/95': cell.column.getIsPinned() },
                  cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              col-span="{columns.length}"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>