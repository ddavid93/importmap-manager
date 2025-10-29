<template>
  <DropdownMenuGroup v-bind="props">
    <slot />
  </DropdownMenuGroup>
</template>

<script lang="ts" setup>
import { DropdownMenuGroup, type DropdownMenuGroupProps } from "reka-ui";

const props = defineProps<DropdownMenuGroupProps>();
</script>
