<template>
  <Separator
    :class="cn('-mx-1 h-px bg-border', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Separator>
</template>

<script lang="ts" setup>
import type { SeparatorProps } from "reka-ui";
import { Separator } from "reka-ui";
import { cn } from "@/lib/utils";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
