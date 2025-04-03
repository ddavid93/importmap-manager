<script setup lang="ts">
import { Button, type ButtonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

defineProps<{
  btnTriggerLabel: string
  btnFooterLabel: string
  title: string
  disabled?: boolean
  variant?: ButtonVariants['variant']
}>()

const open = defineModel<boolean>({ default: false })
defineEmits(['submit'])
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button :variant="variant || 'outline'">
        {{ btnTriggerLabel }}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <DialogDescription class="mt-[10px] mb-5 text-[15px] leading-normal">
        <div class="grid gap-4 py-4">
          <slot name="body"/>
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button :disabled @click="$emit('submit')" type="submit">
          {{ btnFooterLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
