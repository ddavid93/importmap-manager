<template>
  <div class="relative w-full items-center">
    <Input
      ref="input"
      v-model="modelValue"
      :class="cn('pl-10', props.class)"
      type="text"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Replace class="size-4 text-muted-foreground" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Replace } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

import { type HTMLAttributes, useTemplateRef } from "vue";
import { cn } from "@/lib/utils";

const modelValue = defineModel<string | number>();

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const inputField = useTemplateRef("input");
defineExpose({ inputField });
</script>
