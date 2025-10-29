<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>

<script lang="ts" setup>
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
