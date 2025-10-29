<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>

<script lang="ts" setup>
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
