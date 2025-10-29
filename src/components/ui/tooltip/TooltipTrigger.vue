<template>
  <TooltipTrigger v-bind="props">
    <slot />
  </TooltipTrigger>
</template>

<script lang="ts" setup>
import { TooltipTrigger, type TooltipTriggerProps } from "reka-ui";

const props = defineProps<TooltipTriggerProps>();
</script>
