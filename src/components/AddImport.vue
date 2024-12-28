<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

defineProps<{
  btnTriggerLabel: string
  btnFooterLabel: string
  title: string
}>()

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">
        {{ btnTriggerLabel }}
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <slot name="body"></slot>
      </div>
      <DialogFooter>
        <Button type="submit">
          {{ btnFooterLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
