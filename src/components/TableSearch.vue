<template>
  <div class="p-2 relative w-96 items-center">
    <Input
      id="search"
      ref="searchInput"
      v-model="search"
      class="pl-10"
      placeholder="Filter module name..."
      type="text"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Search class="ml-2 w-5 text-muted-foreground" />
    </span>
    <span
      :class="{
        'opacity-50 pointer-events-none': !search,
        ' cursor-pointer': search,
      }"
      class="absolute end-0 top-2 mr-4 mt-1.5"
      @click="search = ''"
    >
      <XIcon class="ml-2 w-4 text-muted-foreground" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Search, XIcon } from "lucide-vue-next";
import Input from "./ui/input/Input.vue";
import { useTemplateRef } from "vue";
import { onStartTyping } from "@vueuse/core";
import { useModal } from "@/composables/useModal.ts";

const search = defineModel<string>({ default: "" });
const { dialogs } = useModal();
const searchElement = useTemplateRef("searchInput");
onStartTyping(() => {
  if (
    !dialogs.newImportMap &&
    !dialogs.newModule &&
    !dialogs.command &&
    !dialogs.confirmDisable &&
    !dialogs.confirmDisable
  ) {
    searchElement.value?.inputField?.focus();
  }
});
</script>
