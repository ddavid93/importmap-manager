<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>

<script lang="ts" setup>
import type { TabsRootEmits, TabsRootProps } from "reka-ui";
import { TabsRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps<TabsRootProps>();
const emit = defineEmits<TabsRootEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>
