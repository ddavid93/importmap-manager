<template>
  <TabsList
    :class="
      cn(
        'inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class
      )
    "
    v-bind="delegatedProps"
  >
    <slot />
  </TabsList>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { TabsList, type TabsListProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  TabsListProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
