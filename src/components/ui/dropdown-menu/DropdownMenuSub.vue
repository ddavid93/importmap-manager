<template>
  <DropdownMenuSub v-bind="forwarded">
    <slot />
  </DropdownMenuSub>
</template>

<script lang="ts" setup>
import {
  DropdownMenuSub,
  type DropdownMenuSubEmits,
  type DropdownMenuSubProps,
  useForwardPropsEmits,
} from "reka-ui";

const props = defineProps<DropdownMenuSubProps>();
const emit = defineEmits<DropdownMenuSubEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
