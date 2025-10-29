<template>
  <ListboxContent
    :class="cn('max-h-[300px] overflow-y-auto overflow-x-hidden', props.class)"
    v-bind="forwarded"
  >
    <div role="presentation">
      <slot />
    </div>
  </ListboxContent>
</template>

<script lang="ts" setup>
import type { ListboxContentProps } from "reka-ui";
import { ListboxContent, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  ListboxContentProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>
