<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import {
  type AlertDialogEmits,
  type AlertDialogProps,
  AlertDialogRoot,
  useForwardPropsEmits,
} from "reka-ui";

const props = defineProps<AlertDialogProps>();
const emit = defineEmits<AlertDialogEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
