<template>
  <AlertDialogAction
    :class="cn(buttonVariants(), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </AlertDialogAction>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AlertDialogAction, type AlertDialogActionProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  AlertDialogActionProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>
