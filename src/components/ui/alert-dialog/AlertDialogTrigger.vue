<template>
  <AlertDialogTrigger v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>

<script setup lang="ts">
import { AlertDialogTrigger, type AlertDialogTriggerProps } from "reka-ui";

const props = defineProps<AlertDialogTriggerProps>();
</script>
