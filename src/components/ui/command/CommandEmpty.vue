<template>
  <span></span>
  <Primitive
    v-if="isRender"
    :class="cn('py-6 text-center text-sm', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import type { PrimitiveProps } from "reka-ui";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { computed, type HTMLAttributes } from "vue";
import { useCommand } from ".";

const props = defineProps<
  PrimitiveProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const { filterState } = useCommand();
const isRender = computed(
  () => !!filterState.search && filterState.filtered.count === 0
);
</script>
