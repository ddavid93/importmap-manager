<template>
  <TooltipContent
    v-bind="{ ...forwarded, ...$attrs }"
    :class="
      cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        props.class
      )
    "
  >
    <slot />
  </TooltipContent>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  useForwardPropsEmits,
} from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<TooltipContentProps & { class?: HTMLAttributes["class"] }>(),
  {
    sideOffset: 4,
  }
);

const emit = defineEmits<TooltipContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emit);
</script>
