<template>
  <Dialog v-model:open="open">
    <DialogTrigger asChild>
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
          <slot name="body" />
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button :disabled type="submit" @click="$emit('submit')">
          {{ btnFooterLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button, type ButtonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const open = defineModel<boolean>({ default: false });

defineProps<{
  btnTriggerLabel: string;
  btnFooterLabel: string;
  title: string;
  disabled?: boolean;
  variant?: ButtonVariants["variant"];
}>();

defineEmits<{
  submit: [];
}>();
</script>
