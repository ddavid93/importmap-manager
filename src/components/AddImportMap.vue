<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { shallowRef } from 'vue'
import { useImportMapOverrides } from '@/composables/useImportMapOverrides.ts'
import { Checkbox } from '@/components/ui/checkbox'
import { useModal } from '@/composables/useModal.ts'
import ImportDialog from '@/components/ImportDialog.vue'

const { externalImportMap } = useImportMapOverrides()
const { dialogs } = useModal()

const imporMap = shallowRef(externalImportMap.value?.url || '')
const enabled = shallowRef(!!externalImportMap.value?.enabled)

function saveImportMap() {
  const regexUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  if (!regexUrl.test(imporMap.value)) return
  externalImportMap.value = { url: imporMap.value, enabled: enabled.value }
  dialogs.newImportMap = false
}
</script>

<template>
  <ImportDialog
    :disabled="externalImportMap?.enabled === enabled"
    :variant="externalImportMap?.enabled ? 'default' : undefined"
    @submit="saveImportMap"
    :title="`${externalImportMap?.enabled ? 'Edit' : 'Add'} Import Map`"
    :btn-trigger-label="`${externalImportMap?.enabled ? 'Edit' : 'Add'} Import Map`"
    btn-footer-label="Apply override"
  >
    <template #body>
      <div class="grid w-full items-center gap-1.5">
        <Label for="url"> URL: </Label>
        <div class="flex items-center gap-2">
          <Checkbox v-model="enabled" />
          <Input id="url" v-model="imporMap" />
        </div>
      </div>
    </template>
  </ImportDialog>
</template>
