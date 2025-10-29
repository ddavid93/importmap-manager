<template>
  <DropdownMenuSeparator
    :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
    v-bind="delegatedProps"
  />
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import {
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
} from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  DropdownMenuSeparatorProps & {
    class?: HTMLAttributes["class"];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
