<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>

<script lang="ts" setup>
import { DialogTrigger, type DialogTriggerProps } from "reka-ui";

const props = defineProps<DialogTriggerProps>();
</script>
