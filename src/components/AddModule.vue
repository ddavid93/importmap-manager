<template>
  <AddImport
    v-model="open"
    title="New module"
    :btn-trigger-label="model.module_name ? 'Edit module' : 'Add new module'"
    btn-footer-label="Apply override"
  >
    <template #body>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="name"> Module name: </Label>
        <Input id="name" v-model="model.module_name" />
      </div>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="url"> URL: </Label>
        <Input id="url" v-model="model.domain" />
      </div>
    </template>
  </AddImport>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AddImport from '@/components/AddImport.vue'
import type { IModuleInfo } from '@/composables/useOverridesTable.ts'

const model = defineModel<IModuleInfo>({ default: { module_name: '', domain: '' } })
const open = defineModel<boolean>('open', { default: false })
</script>
