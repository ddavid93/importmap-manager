<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

defineEmits(['confirm'])
const open = defineModel<boolean>({ default: false })
defineProps<{ disabled: boolean; color: string; text: string; description: string }>()
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger :class="{ 'cursor-not-allowed': disabled }">
      <Button :disabled class="w-full">
        {{ text }}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent v-if="!disabled">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm')">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
