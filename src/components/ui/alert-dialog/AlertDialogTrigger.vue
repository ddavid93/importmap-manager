<template>
  <AlertDialogTrigger v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>

<script lang="ts" setup>
import { AlertDialogTrigger, type AlertDialogTriggerProps } from "reka-ui";

const props = defineProps<AlertDialogTriggerProps>();
</script>
