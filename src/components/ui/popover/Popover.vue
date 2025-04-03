<template>
  <PopoverRoot v-bind="forwarded">
    <slot />
  </PopoverRoot>
</template>

<script setup lang="ts">
import type { PopoverRootEmits, PopoverRootProps } from "reka-ui";
import { PopoverRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps<PopoverRootProps>();
const emit = defineEmits<PopoverRootEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
