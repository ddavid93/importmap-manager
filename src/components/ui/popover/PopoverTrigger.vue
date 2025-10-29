<template>
  <PopoverTrigger v-bind="props">
    <slot />
  </PopoverTrigger>
</template>

<script lang="ts" setup>
import { PopoverTrigger, type PopoverTriggerProps } from "reka-ui";

const props = defineProps<PopoverTriggerProps>();
</script>
