<template>
  <AddImport
    v-model="open"
    :title="model.id ? 'Edit module' : 'New module'"
    btn-trigger-label="Add new module"
    @submit="saveOverride"
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
import { type IModuleInfo, useOverridesTable } from '@/composables/useOverridesTable.ts'
import { watch } from 'vue'

const model = defineModel<IModuleInfo>({ default: { module_name: '', domain: '' } })
const open = defineModel<boolean>('open', { default: false })
const { data, processOverrides } = useOverridesTable()
watch(open, (val) => !val && resetCurrentSelectedModule())

function resetCurrentSelectedModule() {
  model.value = {
    id: '',
    module_name: '',
    domain: '',
    status: ''
  }
}

function saveOverride() {
  data.value = processOverrides(
    window.importMapOverrides.addOverride(model.value.module_name, model.value.domain)
  )
  resetCurrentSelectedModule()
}
</script>
