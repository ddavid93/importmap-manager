<template>
  <Label
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class
      )
    "
    v-bind="delegatedProps"
  >
    <slot />
  </Label>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { Label, type LabelProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
