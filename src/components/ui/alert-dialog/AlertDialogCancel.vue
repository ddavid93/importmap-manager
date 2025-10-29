<template>
  <AlertDialogCancel
    :class="
      cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', props.class)
    "
    v-bind="delegatedProps"
  >
    <slot />
  </AlertDialogCancel>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AlertDialogCancel, type AlertDialogCancelProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  AlertDialogCancelProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
