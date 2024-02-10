<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AddImport from '@/components/AddImport.vue'
</script>

<template>
  <AddImport
    title="Add External Import Map"
    btn-trigger-label="Add import map"
    btn-footer-label="Apply override"
  >
    <template #body>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="import_map"> Import map url: </Label>
        <Input id="import_map" />
      </div>
    </template>
  </AddImport>
</template>
