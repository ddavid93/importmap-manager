<script setup lang="ts">
import { shallowRef, unref } from 'vue'
import { Check, ChevronsUpDown, XCircle } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{ items: string[] }>()
const itemsNotReactive = unref(props.items)
const emits = defineEmits(['selectedItem'])

const placeholder = 'Filter module name...'
const open = shallowRef(false)
const query = shallowRef('')

async function cleanQuery() {
  if (!query.value) return
  query.value = ''
  emits('selectedItem', query.value)
  setTimeout(() => (open.value = false))
}

function selectItem({ detail }: any) {
  if (typeof detail.value === 'string') {
    query.value = detail.value
  }
  emits('selectedItem', query.value)
  open.value = false
}

defineExpose({focus: () => open.value = true})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between"
      >
        {{ query ? itemsNotReactive.find((module_name) => module_name === query) : placeholder }}

        <component
          @click="cleanQuery"
          :is="query ? XCircle : ChevronsUpDown"
          class="ml-2 h-4 w-4 shrink-0 opacity-50"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput class="h-9" :placeholder />
        <CommandEmpty>No modules name found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="(module_name, index) in itemsNotReactive"
              :key="module_name + index"
              :value="module_name"
              @select="selectItem($event)"
            >
              {{ module_name }}
              <Check
                :class="cn('ml-auto h-4 w-4', query === module_name ? 'opacity-100' : 'opacity-0')"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
