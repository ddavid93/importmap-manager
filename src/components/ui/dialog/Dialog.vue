<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
  useForwardPropsEmits,
} from "reka-ui";

const props = defineProps<DialogRootProps>();
const emit = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
