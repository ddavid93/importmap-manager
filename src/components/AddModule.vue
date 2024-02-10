<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AddImport from '@/components/AddImport.vue'
</script>

<template>
  <AddImport
    title="New module"
    btn-trigger-label="Add new module"
    btn-footer-label="Apply override || Reset to default"
  >
    <template #body>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="name"> Module name: </Label>
        <Input id="name" />
      </div>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="url"> Override URL: </Label>
        <Input id="url" />
      </div>
    </template>
  </AddImport>
</template>
