<template>
  <div class="relative w-full items-center">
    <Input
      ref="input"
      v-model="modelValue"
      type="text"
      :class="
        cn(
          'pl-10',
          props.class
        )
      "
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Replace class="size-4 text-muted-foreground" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { Replace } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

import { type HTMLAttributes, useTemplateRef } from "vue";
import { cn } from "@/lib/utils";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emit, {
  passive: true,
  defaultValue: props.defaultValue,
});

const inputField = useTemplateRef("input");
defineExpose({ inputField });
</script>
