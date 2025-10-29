<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>

<script lang="ts" setup>
import {
  DropdownMenuRoot,
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
  useForwardPropsEmits,
} from "reka-ui";

const props = defineProps<DropdownMenuRootProps>();
const emit = defineEmits<DropdownMenuRootEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
