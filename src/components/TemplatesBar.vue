<template>
  <div
    class="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full"
  >
    <div class="flex items-center gap-2">
      <template v-if="!isSaving">
      <Button
        :class="buttonVariants({ variant: 'success' })"
        :disabled="activeTemplateName?.length"
        @click="startSaving"
      >
        Save template
      </Button>
      </template>
      <template v-else>
      <Input
        ref="nameInput"
        v-model="templateName"
        placeholder="Template name"
        class="h-8"
        @keydown.enter.prevent="handleSave"
        @keydown.esc.prevent="cancelSaving"
      />
      <Button
        :class="buttonVariants({ variant: 'default' })"
        @click="handleSave"
      >
        Save
      </Button>
      <Button
        :class="buttonVariants({ variant: 'destructive' })"
        @click="cancelSaving"
      >
        Cancel
      </Button>
      </template>
    </div>

    <div :key="templates.length" class="flex items-center flex-wrap gap-2">
      <template v-for="template in templates" :key="template.name">
      <div class="flex items-center gap-1">
        <Button
          :class="
          buttonVariants({
            variant:
              activeTemplateName === template.name ? 'success-outline' : 'ghost',
            size: 'sm',
          })
        "
          class="max-w-[220px] truncate"
          :title="template.name"
          @click="apply(template.name)"
        >
          <span>{{ template.name }}</span>
        </Button>
        <Trash
          class="text-destructive w-4 h-4 cursor-pointer hover:text-destructive/80 transition-colors"
          @click="remove(template.name)"
        />
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { Button, buttonVariants }        from "@/components/ui/button";
import { Input }                         from "@/components/ui/input";
import { useImportMapTemplates }         from "@/composables/useImportMapTemplates.ts";
import { Trash } from "lucide-vue-next";

const {
  templates,
  saveTemplate,
  applyTemplate,
  deleteTemplate,
  activeTemplateName,
} = useImportMapTemplates();

const isSaving = ref(false);
const templateName = ref("");
const nameInput = useTemplateRef("nameInput");

function startSaving() {
  isSaving.value = true;
  templateName.value = "";
  nextTick(() => nameInput.value?.inputField?.focus());
}

function cancelSaving() {
  isSaving.value = false;
  templateName.value = "";
}

function handleSave() {
  const ok = saveTemplate(templateName.value);
  if (ok) {
    cancelSaving();
  }
}

function apply(name: string) {
  applyTemplate(name);
}

function remove(name: string) {
  deleteTemplate(name);
}
</script>
